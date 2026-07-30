/**
 * 目录→series 迁移脚本
 *
 * 作用:从每个 .md 的父目录派生 frontmatter series 字段
 * 规则:
 *   1. 取父目录名作为 series(剥数字前缀,如 "0-vim" -> "vim")
 *   2. 已有 series 字段的不覆盖
 *   3. 文件在 vault 根的(无父目录)不写 series
 *   4. 文件名本身不进 series
 *
 * 用法:
 *   bun scripts/series-from-path.ts            # 实跑
 *   bun scripts/series-from-path.ts --dry-run  # 只打印会改哪些,不写盘
 *
 * 依赖:gray-matter(用 my-blog 项目 node_modules 里的)
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

/** 从文件路径取父目录名作为 series(剥数字前缀) */
function deriveSeries(filePath: string): string | null {
  const rel = relative(VAULT_ROOT, filePath);
  const parent = dirname(rel);
  if (!parent || parent === ".") return null;
  // 取最后一段(直接父目录)
  const lastSeg = parent.split(sep).pop()!;
  const cleaned = lastSeg.replace(NUMERIC_PREFIX, "").trim();
  return cleaned || null;
}

const files = walk(VAULT_ROOT);
console.log(`[series] 扫描到 ${files.length} 个 .md 文件`);

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
    errors.push({
      file: rel,
      msg: err instanceof Error ? err.message : String(err),
    });
    continue;
  }

  // 已 series 字段不覆盖
  if (parsed.data.series) {
    skippedCount++;
    continue;
  }

  const newSeries = deriveSeries(filePath);
  if (!newSeries) {
    skippedCount++;
    continue;
  }

  // 检查是否有变化
  if (parsed.data.series === newSeries) {
    skippedCount++;
    continue;
  }

  changedCount++;
  changes.push({ file: rel, series: newSeries });

  if (DRY_RUN) continue;

  try {
    parsed.data.series = newSeries;
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

console.log(`[series] ${DRY_RUN ? "[DRY-RUN] " : ""}完成:`);
console.log(`  - 总文件: ${files.length}`);
console.log(`  - 会改:   ${changedCount}`);
console.log(`  - 不变:   ${skippedCount}`);
console.log(`  - 失败:   ${errorCount}`);

if (errors.length > 0) {
  console.log(`\n[series] 失败文件清单:`);
  for (const e of errors) {
    console.log(`  - ${e.file}`);
    console.log(`    ${e.msg.slice(0, 120)}`);
  }
}

if (DRY_RUN && changes.length > 0) {
  console.log(`\n[series] 前 20 个变更样例:`);
  for (const c of changes.slice(0, 20)) {
    console.log(`  ${c.file}  →  series: ${c.series}`);
  }
  if (changes.length > 20) {
    console.log(`  ... 还有 ${changes.length - 20} 个文件未显示`);
  }
}
