/**
 * 目录→tags 迁移脚本
 *
 * 作用:把每个 .md 文件的目录路径转成 frontmatter 的 tags 数组
 * 规则:
 *   1. 取目录每层作为独立 tag
 *   2. 数字+连字符前缀(0-、1-、2-、3-、4-)剥掉
 *   3. 已有 tags 字段追加(去重)
 *   4. 已有 形态/场景/published 保留不覆盖
 *   5. 文件名不进 tags
 *
 * 用法:
 *   bun scripts/flatten.ts            # 实跑
 *   bun scripts/flatten.ts --dry-run  # 只打印会改哪些,不写盘
 *
 * 依赖:gray-matter(用 my-blog 项目 node_modules 里的,避免 vault 端装)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// 复用 my-blog 的 gray-matter
const MY_BLOG_NODE_MODULES =
  "L:/Documents/GitHub/my-blog/node_modules";
const { default: matter } = await import(
  join(MY_BLOG_NODE_MODULES, "gray-matter", "index.js")
);

const VAULT_ROOT = "H:/main/knowledge_base";
const DRY_RUN = process.argv.includes("--dry-run");

// 忽略的目录
const IGNORED_DIRS = new Set([
  ".obsidian",
  ".git",
  ".agents",
  ".claude",
  "node_modules",
  "scripts",
  "copilot",
  "assets",
  "public",
]);

// 数字+分隔符前缀(连字符或点,如 "0-体" -> "体"、"5.git" -> "git")
const NUMERIC_PREFIX = /^[0-9]+[-.]/;

/** 递归扫 .md 文件 */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, out);
    } else if (name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

/** 从目录路径提取 tag 列表 */
function dirToTags(filePath: string): string[] {
  const rel = relative(VAULT_ROOT, dirname(filePath));
  if (!rel || rel === ".") return [];
  return rel
    .split(sep)
    .filter(Boolean)
    .map((seg) => seg.replace(NUMERIC_PREFIX, "").trim())
    .filter(Boolean);
}

/** 合并已有 tags 和目录 tags,去重 */
function mergeTags(existing: unknown, dirTags: string[]): string[] {
  const existed = Array.isArray(existing)
    ? existing.map(String)
    : typeof existing === "string"
      ? [existing]
      : [];
  return [...new Set([...existed, ...dirTags])];
}

// 主流程
const files = walk(VAULT_ROOT);
console.log(`[flatten] 扫描到 ${files.length} 个 .md 文件`);

let changedCount = 0;
let skippedCount = 0;
let errorCount = 0;
const changes: Array<{ file: string; before: string[]; after: string[] }> = [];
const errors: Array<{ file: string; msg: string }> = [];

for (const filePath of files) {
  const rel = relative(VAULT_ROOT, filePath);

  let parsed: ReturnType<typeof matter>;
  try {
    const raw = readFileSync(filePath, "utf8");
    parsed = matter(raw);
  } catch (err) {
    errorCount++;
    errors.push({
      file: rel,
      msg: err instanceof Error ? err.message : String(err),
    });
    continue;
  }

  const dirTags = dirToTags(filePath);
  const newTags = mergeTags(parsed.data.tags, dirTags);
  const oldTags = Array.isArray(parsed.data.tags)
    ? parsed.data.tags.map(String)
    : [];

  // 检查是否有变化(tags 数组元素不同视为有变化)
  const isChanged =
    newTags.length !== oldTags.length ||
    newTags.some((t, i) => t !== oldTags[i]);

  if (!isChanged) {
    skippedCount++;
    continue;
  }

  changedCount++;
  changes.push({ file: rel, before: oldTags, after: newTags });

  if (DRY_RUN) continue;

  // 写回
  try {
    parsed.data.tags = newTags;
    const updated = matter.stringify(parsed.content, parsed.data);
    writeFileSync(filePath, updated, "utf8");
  } catch (err) {
    errorCount++;
    errors.push({
      file: rel,
      msg: `写入失败: ${err instanceof Error ? err.message : err}`,
    });
  }
}

console.log(`[flatten] ${DRY_RUN ? "[DRY-RUN] " : ""}完成:`);
console.log(`  - 总文件: ${files.length}`);
console.log(`  - 会改:   ${changedCount}`);
console.log(`  - 不变:   ${skippedCount}`);
console.log(`  - 失败:   ${errorCount}`);

if (errors.length > 0) {
  console.log(`\n[flatten] 失败文件清单:`);
  for (const e of errors) {
    console.log(`  - ${e.file}`);
    console.log(`    ${e.msg.slice(0, 120)}`);
  }
}

if (DRY_RUN && changes.length > 0) {
  console.log(`\n[flatten] 前 20 个变更样例:`);
  for (const c of changes.slice(0, 20)) {
    console.log(`  ${c.file}`);
    console.log(`    before: ${JSON.stringify(c.before)}`);
    console.log(`    after:  ${JSON.stringify(c.after)}`);
  }
  if (changes.length > 20) {
    console.log(`  ... 还有 ${changes.length - 20} 个文件未显示`);
  }
}
