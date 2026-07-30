/**
 * 删除脚本批量加的 series 字段
 *
 * 作用:回滚 scripts/series-from-path.ts 的自动派生
 * 规则:只删除值为字符串(且是脚本派生的简单形式,如父目录名)的 series 字段
 *       保留手动加的 series(将来用户在 frontmatter 写的)
 *
 * 简单策略:把所有 series 字段值是父目录名(剥数字前缀后)的删掉
 *          也就是 series === deriveSeries(filePath) 的
 *
 * 用法:
 *   bun scripts/remove-auto-series.ts            # 实跑
 *   bun scripts/remove-auto-series.ts --dry-run  # 只打印
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";

const GRAY_MATTER_PATH =
  "L:/Documents/GitHub/my-blog/node_modules/.bun/gray-matter@4.0.3/node_modules/gray-matter/index.js";
const { default: matter } = await import(GRAY_MATTER_PATH);

const VAULT_ROOT = "H:/main/knowledge_base";
const DRY_RUN = process.argv.includes("--dry-run");

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

const NUMERIC_PREFIX = /^[0-9]+[-.]/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function deriveSeriesFromPath(filePath: string): string | null {
  const rel = relative(VAULT_ROOT, filePath);
  const parent = dirname(rel);
  if (!parent || parent === ".") return null;
  const lastSeg = parent.split(sep).pop()!;
  return lastSeg.replace(NUMERIC_PREFIX, "").trim() || null;
}

const files = walk(VAULT_ROOT);
console.log(`[remove-series] 扫描到 ${files.length} 个 .md`);

let changedCount = 0;
let skippedCount = 0;
let errorCount = 0;
const changes: Array<{ file: string; series: string }> = [];
const errors: Array<{ file: string; msg: string }> = [];

for (const filePath of files) {
  const rel = relative(VAULT_ROOT, filePath);

  let parsed: ReturnType<typeof matter>;
  try {
    const raw = readFileSync(filePath, "utf8");
    parsed = matter(raw);
  } catch (err) {
    errorCount++;
    errors.push({ file: rel, msg: String(err) });
    continue;
  }

  const current = parsed.data.series;
  if (!current) {
    skippedCount++;
    continue;
  }

  // 只有当 series === 派生值(脚本自动加的)才删
  const derived = deriveSeriesFromPath(filePath);
  if (current !== derived) {
    // 手动加的,保留
    skippedCount++;
    continue;
  }

  changedCount++;
  changes.push({ file: rel, series: String(current) });

  if (DRY_RUN) continue;

  try {
    delete parsed.data.series;
    const updated = matter.stringify(parsed.content, parsed.data);
    writeFileSync(filePath, updated, "utf8");
  } catch (err) {
    errorCount++;
    errors.push({ file: rel, msg: `写入失败: ${err}` });
  }
}

console.log(`[remove-series] ${DRY_RUN ? "[DRY-RUN] " : ""}完成:`);
console.log(`  - 总文件: ${files.length}`);
console.log(`  - 会改:   ${changedCount}`);
console.log(`  - 不变:   ${skippedCount}`);
console.log(`  - 失败:   ${errorCount}`);

if (errors.length > 0) {
  console.log(`\n[remove-series] 失败文件:`);
  for (const e of errors) console.log(`  - ${e.file}: ${e.msg.slice(0, 80)}`);
}

if (DRY_RUN && changes.length > 0) {
  console.log(`\n[remove-series] 前 20 个变更:`);
  for (const c of changes.slice(0, 20)) {
    console.log(`  ${c.file}  -  series: ${c.series}`);
  }
  if (changes.length > 20) {
    console.log(`  ... 还有 ${changes.length - 20} 个未显示`);
  }
}
