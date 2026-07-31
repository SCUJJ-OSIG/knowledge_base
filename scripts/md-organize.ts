#!/usr/bin/env bun
import fs from "fs/promises";
import path from "path";
import pc from "picocolors";

// ========== 配置区 ==========
const IGNORE_DIRS = new Set(["node_modules", "dist", "build", ".git", ".vscode"]);
const TARGET_EXT = new Set([".md"]);
const IMG_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const ASSETS_FOLDER = "assets";

// 黑名单：目录名 / 文件关键词，命中直接跳过
const DIR_BLACKLIST = new Set(["temp", "draft", "archive"]);
const FILE_BLACKLIST = new Set(["README.old", "todo-backup.md"]);

// 代码语言特征推断规则
const CODE_HINT_RULES: Array<{ lang: string; test: RegExp }> = [
  { lang: "typescript", test: /^(import |export |const |let |function |interface |type )/ },
  { lang: "javascript", test: /^(console\.|require\(|function |var )/ },
  { lang: "json", test: /^\s*[\{\[]/ },
  { lang: "yaml", test: /^[\w_-]+:\s*.+/ },
  { lang: "sql", test: /^(SELECT |INSERT |UPDATE |CREATE TABLE)/i },
  { lang: "html", test: /^<(div|html|script|body)>/ },
  { lang: "css", test: /^[\.\#\w]+\s*\{\s*/ },
];

export type MdScanReportItem = {
  filePath: string;
  changed: boolean;
  violations: string[];
};
// ===========================

function splitFrontmatter(text: string) {
  const fmRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = text.match(fmRegex);
  if (!match) return { front: null, content: text };
  return { front: match[0], content: text.slice(match[0].length) };
}

/** 清除冗余HTML标签（保留<kbd><br>这类常用可选，可自行增减） */
function stripRedundantHtml(text: string): string {
  // 删除多余html标签，按需保留/删除
  return text
    .replace(/<\/?(div|span|section|article|main|aside|header|footer)>/gi, "")
    .replace(/\s*\n\s*/g, "\n");
}

function fixTableAlign(content: string): string {
  const lines = content.split("\n");
  const output: string[] = [];
  let inTable = false;
  const tableBlock: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      inTable = true;
      tableBlock.push(line);
      continue;
    }
    if (inTable && tableBlock.length > 0) {
      output.push(...formatMarkdownTable(tableBlock));
      tableBlock.length = 0;
      inTable = false;
    }
    output.push(line);
  }
  if (tableBlock.length > 0) output.push(...formatMarkdownTable(tableBlock));
  return output.join("\n");
}

function formatMarkdownTable(tableLines: string[]): string[] {
  const rows = tableLines.map(r => r.split("|").map(c => c.trim())).filter(r => r.some(x => x));
  if (rows.length < 2) return tableLines;
  const colCount = rows[0].length;
  const maxWidth: number[] = Array(colCount).fill(0);
  for (const row of rows) for (let i = 0; i < colCount; i++) maxWidth[i] = Math.max(maxWidth[i], row[i]?.length ?? 0);
  const out: string[] = [];
  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    const row = rows[rIdx];
    const cells: string[] = [];
    for (let i = 0; i < colCount; i++) {
      const cell = row[i] ?? "";
      const w = maxWidth[i];
      cells.push(rIdx === 1 ? "-".repeat(w) : cell.padEnd(w, " "));
    }
    out.push("| " + cells.join(" | ") + " |");
  }
  return out;
}

/** 智能推断代码块语言 */
function fixCodeBlockLang(content: string): string {
  // 匹配无语言代码块
  return content.replace(/^```\n([\s\S]*?)(?=^```)/gm, (_, blockBody) => {
    let detected = "txt";
    for (const rule of CODE_HINT_RULES) {
      if (rule.test.test(blockBody.trimStart())) {
        detected = rule.lang;
        break;
      }
    }
    return "```" + detected + "\n" + blockBody;
  });
}

function normalizeImagePaths(content: string): string {
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  return content.replace(imgRegex, (full, alt, src) => {
    if (/^https?:\/\//.test(src) || src.startsWith("#")) return full;
    const filename = path.basename(src);
    return `![${alt}](${"./" + ASSETS_FOLDER + "/" + filename})`;
  });
}

function normalizeMarkdownBody(rawBody: string): { text: string; violations: string[] } {
  let text = rawBody.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  const violations: string[] = [];

  const before = text;
  text = text.replace(/[ \t]+$/gm, "");
  text = text.replace(/^([-*])([^\s])/gm, "$1 $2");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2");
  text = text.replace(/(#{1,6} .+)\n([^\n#])/g, "$1\n\n$2");
  text = stripRedundantHtml(text);
  text = fixTableAlign(text);
  text = fixCodeBlockLang(text);
  text = normalizeImagePaths(text);
  text = text.trimEnd() + "\n";

  if (before !== text) violations.push("正文格式修正");
  return { text, violations };
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name) || DIR_BLACKLIST.has(entry.name)) continue;
      files.push(...await walk(full));
    } else if (entry.isFile()) {
      const fname = entry.name;
      if (FILE_BLACKLIST.has(fname)) continue;
      const ext = path.extname(fname);
      if (TARGET_EXT.has(ext)) files.push(full);
    }
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let scanDirs: string[] = ["./"];
  let outputJsonReport = false;
  const report: MdScanReportItem[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry") dryRun = true;
    else if (arg === "--dir") scanDirs = args[++i].split(",");
    else if (arg === "--json-report") outputJsonReport = true;
  }

  let allFiles: string[] = [];
  for (const d of scanDirs) allFiles.push(...await walk(path.resolve(d)));

  for (const fp of allFiles) {
    try {
      const raw = await fs.readFile(fp, "utf8");
      const { front, content } = splitFrontmatter(raw);
      const { text: fixedBody, violations } = normalizeMarkdownBody(content);
      const finalText = front ? front + fixedBody : fixedBody;
      const changed = raw !== finalText;

      report.push({ filePath: fp, changed, violations });

      if (changed) {
        console.log(pc.yellow(`${dryRun ? "[DRY] " : ""}待整理: ${fp}`));
        if (!dryRun) await fs.writeFile(fp, finalText, "utf8");
      }
    } catch (e) {
      console.warn(pc.red(`读取失败: ${fp}`), e);
    }
  }

  const modifyCount = report.filter(r => r.changed).length;
  console.log(pc.bold("\n===== MD整理汇总 ====="));
  console.log(`扫描MD总数: ${allFiles.length}`);
  console.log(`待修改文件: ${modifyCount}`);
  if (dryRun) console.log(pc.blue("⚠️ 试运行，未写入文件"));

  if (outputJsonReport) {
    console.log("\n" + JSON.stringify(report, null, 2));
  }
}

main().catch(err => {
  console.error(pc.red("执行异常"), err);
  process.exit(1);
});