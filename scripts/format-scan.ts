/**
 * 格式扫描脚本(只读不改)
 *
 * 作用:扫 vault 内所有 .md,统计各类格式违例数,输出"乱度排行榜"。
 *      不修改任何文件,只诊断。
 *
 * 用法:
 *   bun scripts/format-scan.ts                  # 扫整个 vault
 *   bun scripts/format-scan.ts --threshold N    # 只显示乱度 ≥ N 的(默认 5)
 *   bun scripts/format-scan.ts --top N          # 只显示前 N 名(默认 15)
 *
 * 乱度评分(每类违例各 +1,总分越高越乱):
 *   1. 标题跳级           (# 后直接 ###,跳了 ##)
 *   2. 列表风格混用       (- 和 * 同时出现)
 *   3. 裸代码块           (``` 后没跟语言)
 *   4. 表格缺分隔行       (有 |---| 的列对齐行)
 *   5. 连续空行 ≥ 3       (多余空行,每处算 1)
 *   6. 中英文之间缺空格   (中文字符紧贴英文/数字,每处算 1,上限 5)
 *   7. 行尾空格           (有则算 1,多次只算 1)
 *   8. Tab 缩进           (有则算 1)
 *   9. frontmatter 缺字段 (至少需要 形态/tags;缺一个算 1)
 *  10. frontmatter 顺序错 (date modified 在 date created 之前等)
 */

import { readFileSync, statSync, existsSync } from "node:fs";
import { globSync } from "node:fs";
import { join, resolve, sep } from "node:path";

const VAULT = resolve(process.cwd());

const THRESHOLD = (() => {
  const i = process.argv.indexOf("--threshold");
  return i >= 0 ? Number(process.argv[i + 1]) || 5 : 5;
})();

const TOP = (() => {
  const i = process.argv.indexOf("--top");
  return i >= 0 ? Number(process.argv[i + 1]) || 15 : 15;
})();

const GLOB_IGNORE = [
  "**/node_modules/**",
  "**/scripts/**",
  "**/.obsidian/**",
  "**/.git/**",
  "**/.claude/**",
  "**/agents/**",
  "**/copilot/**",
  "**/assets/**",
  "**/.github/**",
  "**/.trash/**",
];

const FRONTMATTER_REQUIRED = ["形态", "tags"];
const FRONTMATTER_ORDER = ["date created", "date modified", "tags", "形态", "场景", "published", "series"];

type Issue = { kind: string; line?: number; count?: number };
type ScanResult = {
  file: string;
  score: number;
  issues: Issue[];
  lines: number;
};

function listMd(): string[] {
  // 用绝对路径 glob,避开 cwd 问题
  const absPattern = join(VAULT, "**", "*.md").replace(/\\/g, "/");
  return globSync(absPattern, { ignore: GLOB_IGNORE.map((g) => join(VAULT, g).replace(/\\/g, "/")) }).sort();
}

function scanFile(absPath: string): ScanResult {
  const text = readFileSync(absPath, "utf-8");
  const lines = text.split("\n");
  const issues: Issue[] = [];
  const file = absPath.replace(VAULT + sep, "");

  // ---- 切分 frontmatter ----
  let bodyStart = 0;
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    if (end > 0) {
      const fm = lines.slice(1, end);
      const fmText = fm.join("\n");
      // 9. 缺字段
      for (const key of FRONTMATTER_REQUIRED) {
        if (!new RegExp(`^${key}:`, "m").test(fmText)) {
          issues.push({ kind: `frontmatter 缺字段 \`${key}\`` });
        }
      }
      // 10. 顺序错
      const presentOrder = FRONTMATTER_ORDER.filter((k) => new RegExp(`^${k}:`, "m").test(fmText));
      const sorted = [...presentOrder].sort((a, b) => FRONTMATTER_ORDER.indexOf(a) - FRONTMATTER_ORDER.indexOf(b));
      if (presentOrder.join("|") !== sorted.join("|")) {
        issues.push({ kind: `frontmatter 字段顺序错(当前: ${presentOrder.join("→")})` });
      }
      bodyStart = end + 1;
    }
  } else {
    // 完全没 frontmatter
    issues.push({ kind: "无 frontmatter" });
  }

  // ---- 1. 标题跳级 ----
  let prevLevel = 0;
  for (const line of lines.slice(bodyStart)) {
    const m = /^(#{1,6})\s/.exec(line);
    if (!m) continue;
    const lvl = m[1].length;
    if (prevLevel > 0 && lvl > prevLevel + 1) {
      issues.push({ kind: `标题跳级: \`${"#".repeat(prevLevel)}\` → \`${"#".repeat(lvl)}\`` });
    }
    prevLevel = lvl;
  }

  // ---- 2. 列表风格混用 ----
  const hasDash = /^- /m.test(text);
  const hasStar = /^\* /m.test(text);
  if (hasDash && hasStar) {
    issues.push({ kind: "列表风格混用(`-` 和 `*` 同时出现)" });
  }

  // ---- 3. 裸代码块 ----
  let inFence = false;
  let bareCount = 0;
  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inFence) {
        const lang = line.slice(3).trim();
        if (lang === "") bareCount++;
        inFence = true;
      } else {
        inFence = false;
      }
    }
  }
  if (bareCount > 0) {
    issues.push({ kind: `裸代码块(共 ${bareCount} 个,没跟语言)`, count: bareCount });
  }

  // ---- 4. 表格缺分隔行 ----
  const tableHeaderRe = /^\|.+\|$/;
  const tableSepRe = /^\|[\s\-:|]+\|$/;
  for (let i = 0; i < lines.length - 1; i++) {
    if (tableHeaderRe.test(lines[i]) && !tableSepRe.test(lines[i + 1]) && tableHeaderRe.test(lines[i + 1])) {
      issues.push({ kind: "表格缺分隔行", line: i + 1 });
      break;
    }
  }

  // ---- 5. 连续空行 ≥ 3 ----
  let emptyStreak = 0;
  let blankGroupCount = 0;
  for (const line of lines) {
    if (line.trim() === "") {
      emptyStreak++;
      if (emptyStreak === 3) blankGroupCount++;
    } else {
      emptyStreak = 0;
    }
  }
  if (blankGroupCount > 0) {
    issues.push({ kind: `连续空行 ≥ 3(共 ${blankGroupCount} 处)`, count: blankGroupCount });
  }

  // ---- 6. 中英文之间缺空格(启发式,每文件最多算 5) ----
  const cnEnNoSpace = /[一-鿿][A-Za-z0-9]|[A-Za-z0-9][一-鿿]/g;
  const matches = text.match(cnEnNoSpace) || [];
  if (matches.length > 0) {
    issues.push({ kind: `中英文之间缺空格(共 ${matches.length} 处)`, count: Math.min(matches.length, 5) });
  }

  // ---- 7. 行尾空格 ----
  const trailSpaceLines = lines.filter((l) => / $/.test(l)).length;
  if (trailSpaceLines > 0) {
    issues.push({ kind: `行尾空格(共 ${trailSpaceLines} 行)`, count: trailSpaceLines });
  }

  // ---- 8. Tab 缩进 ----
  if (lines.some((l) => l.startsWith("\t"))) {
    issues.push({ kind: "存在 Tab 缩进" });
  }

  return { file, score: issues.length, issues, lines: lines.length };
}

function main() {
  if (!existsSync(VAULT)) {
    console.error(`VAULT 路径不存在: ${VAULT}`);
    console.error(`请在 vault 根目录执行此脚本`);
    process.exit(1);
  }

  const files = listMd();
  const results: ScanResult[] = files.map(scanFile).sort((a, b) => b.score - a.score);

  const messy = results.filter((r) => r.score >= THRESHOLD);
  const clean = results.filter((r) => r.score < THRESHOLD);

  console.log("## 格式扫描报告");
  console.log("");
  console.log(`VAULT: ${VAULT}`);
  console.log(`扫了: ${results.length} 个 .md`);
  console.log(`乱度 ≥ ${THRESHOLD}: ${messy.length} 个`);
  console.log(`干净(< ${THRESHOLD}): ${clean.length} 个`);
  console.log("");

  if (messy.length === 0) {
    console.log(`✅ 全部干净,没有乱度 ≥ ${THRESHOLD} 的文件。`);
    console.log("");
    console.log("如需更严,把 --threshold 调小,如 `bun scripts/format-scan.ts --threshold 1`");
    return;
  }

  const top = messy.slice(0, TOP);
  console.log(`### TOP ${top.length} 乱度排行`);
  console.log("");
  for (const r of top) {
    console.log(`#### ${r.score}. \`${r.file}\`(${r.lines} 行)`);
    for (const i of r.issues) {
      const detail = i.line ? ` (第 ${i.line} 行)` : i.count ? ` [×${i.count}]` : "";
      console.log(`  - [${i.kind}]${detail}`);
    }
    console.log("");
  }

  if (messy.length > TOP) {
    console.log(`(还有 ${messy.length - TOP} 个乱度 ≥ ${THRESHOLD} 的文件,被 --top 截断。用 --top N 看更多)`);
    console.log("");
  }

  console.log("### 建议下一步");
  console.log("1. 选乱度最高的几篇,跑 `/format <文件名>` 单独整理");
  console.log("2. 或者跑 `/format --all` 一次性全整理(慎用,先扫后改)");
}

main();
