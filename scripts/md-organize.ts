#!/usr/bin/env bun
import fs from "fs/promises";
import path from "path";
import pc from "picocolors";
import hljs from "highlight.js";

// ===================== 配置区 =====================
const IGNORE_DIRS = new Set(["node_modules", "dist", "build", ".git", ".vscode"]);
const DIR_BLACKLIST = new Set(["temp", "draft", "archive"]);
const FILE_BLACKLIST = new Set(["README.old", "todo-backup.md"]);
const TARGET_EXT = new Set([".md"]);
const ASSETS_FOLDER = "assets";

/** 喂给 hljs.highlightAuto 的候选语言白名单 */
const HLJS_SUBSET: string[] = [
  "bash", "powershell", "shellsession",
  "javascript", "typescript", "jsx", "tsx",
  "json", "yaml", "toml", "xml",
  "html", "css", "scss",
  "python", "go", "rust", "java",
  "sql", "dockerfile", "markdown", "log",
];

/** 短代码块直接跳过识别(命中率低 + 误报率高) */
const MIN_CODE_CHARS = 20;
const MIN_CODE_LINES = 3;

/** hljs relevance 低于此值视为猜测不可信 */
const RELEVANCE_THRESHOLD = 3;

/** 语言别名归一化(输出更整洁 + 兼容 Obsidian/Pandoc 习惯) */
const LANG_ALIAS_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  ps1: "powershell",
  yml: "yaml",
  vue: "html",
};

export type MdScanReportItem = {
  filePath: string;
  changed: boolean;
  violations: string[];
};
// ==================================================

// 异步兼容的算子签名:sync 算子返回 string 自动当 Promise<string> 处理
type TextTransform = (text: string) => string | Promise<string>;

/**
 * 顺序管道执行器:sync + async 算子混用
 * for-of + await 替代 reduce(reduce 处理 await 繁琐且语义不直观)
 */
async function asyncPipe(
  source: string,
  ...transforms: TextTransform[]
): Promise<string> {
  let val: string = source;
  for (const fn of transforms) {
    val = await fn(val);
  }
  return val;
}

/**
 * 分割 FrontMatter
 * 纯文本处理，不修改内容
 */
function splitFrontmatter(text: string): { front: string | null; body: string } {
  const reg = /^---\n([\s\S]*?)\n---\n/;
  const match = text.match(reg);
  if (!match) return { front: null, body: text };
  return {
    front: match[0],
    body: text.slice(match[0].length),
  };
}

// ===================== 【独立管道算子：每函数只做一件事】 =====================
/** 统一换行符 */
const normalizeLineBreak: TextTransform = (t) => t.replaceAll("\r\n", "\n").replaceAll("\r", "\n");

/** 删除行尾空白 */
const trimTrailingSpace: TextTransform = (t) => t.replace(/[ \t]+$/gm, "");

/** 列表标记 -/* 后强制空格 */
const fixListMarkerSpacing: TextTransform = (t) => t.replace(/^([-*])([^\s])/gm, "$1 $2");

/** 连续多行空行压缩至多2行 */
const compressEmptyLines: TextTransform = (t) => t.replace(/\n{3,}/g, "\n\n");

/** 标题上下空行标准化 */
const fixHeadingPadding: TextTransform = (t) => {
  let res = t.replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2");
  res = res.replace(/(#{1,6} .+)\n([^\n#])/g, "$1\n\n$2");
  return res;
};

/** 清理冗余 HTML 标签 */
const stripRedundantHtml: TextTransform = (t) => {
  return t.replace(/<\/?(div|span|section|article|main|aside|header|footer)>/gi, "");
};

/** Markdown 表格自动对齐 */
const fixTableAlign: TextTransform = (text) => {
  const lines = text.split("\n");
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
      output.push(...formatSingleTable(tableBlock));
      tableBlock.length = 0;
      inTable = false;
    }
    output.push(line);
  }
  if (tableBlock.length > 0) output.push(...formatSingleTable(tableBlock));
  return output.join("\n");
};

function formatSingleTable(tableLines: string[]): string[] {
  const rows = tableLines.map((r) => r.split("|").map((c) => c.trim())).filter((r) => r.some((x) => x));
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

/** 同步快速通道:原 regex 规则 + 新增 npm/pnpm/yarn/bun 和 powershell */
const FAST_LANG_RULES: Array<{ lang: string; test: RegExp }> = [
  { lang: "typescript", test: /^(import |export |const |interface |type )/ },
  { lang: "javascript", test: /^(console\.|require\()/ },
  { lang: "json", test: /^\s*[\{\[]/ },
  { lang: "bash", test: /^(#!\/bin | curl | echo |npm |pnpm |yarn |bun )/ },
  { lang: "powershell", test: /^(Get-|Set-|New-|Write-Host|\$\w+\s*=)/ },
  { lang: "yaml", test: /^[\w_-]+:\s*.+/ },
  { lang: "sql", test: /^(SELECT|INSERT|CREATE)/i },
  { lang: "html", test: /^<(div|script|body)>/ },
  { lang: "css", test: /^[\.\#\w]+\s*\{\s*/ },
];

function fastDetectLang(block: string): string {
  const content = block.trimStart();
  for (const r of FAST_LANG_RULES) {
    if (r.test.test(content)) return r.lang;
  }
  return "txt";
}

/**
 * 异步代码块语言识别(也作用于已有语言:做别名归一化)
 * 策略:
 *   1. 已有语言的块:做别名归一化
 *   2. 裸块:先走 FAST_LANG_RULES 命中即返回(快)
 *   3. FAST 失败:试 hljs(relevance 阈值 + 短代码块过滤)
 *   4. hljs 不可用 / 都失败:保持 txt
 */
const autoDetectCodeBlockLang: TextTransform = async (text) => {
  const lines = text.split("\n");
  const out: string[] = [];
  const fenceOpen = /^```(\w*)\s*$/;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const openMatch = line.match(fenceOpen);
    if (!openMatch) {
      out.push(line);
      i++;
      continue;
    }
    const explicitLang = openMatch[1];
    // 收集块
    const blockLines: string[] = [];
    let j = i + 1;
    while (j < lines.length && !/^```\s*$/.test(lines[j])) {
      blockLines.push(lines[j]);
      j++;
    }
    const block = blockLines.join("\n");
    const hasClose = j < lines.length;
    if (!hasClose) {
      // 没有闭合 fence(异常),原样保留剩余内容
      out.push(line);
      for (const bl of blockLines) out.push(bl);
      i = lines.length;
      break;
    }
    let lang: string;
    if (explicitLang) {
      lang = LANG_ALIAS_MAP[explicitLang.toLowerCase()] ?? explicitLang.toLowerCase();
    } else {
      lang = await detectBareBlockLang(block);
    }
    out.push("```" + lang);
    for (const bl of blockLines) out.push(bl);
    out.push(lines[j]);
    i = j + 1;
  }
  return out.join("\n");
};

async function detectBareBlockLang(block: string): Promise<string> {
  // 1. 短代码直接 txt
  if (block.length < MIN_CODE_CHARS) return "txt";
  const nonEmptyLines = block.split("\n").filter((l) => l.trim()).length;
  if (nonEmptyLines < MIN_CODE_LINES) return "txt";

  // 2. 快速通道(regex 命中就走)
  const fastHit = fastDetectLang(block);
  if (fastHit !== "txt") return fastHit;

  // 3. hljs 兜底
  try {
    const result = hljs.highlightAuto(block, HLJS_SUBSET);
    if (!result?.language) return "txt";
    if ((result.relevance ?? 0) < RELEVANCE_THRESHOLD) return "txt";
    // shellsession → bash(语义重叠,且 Obsidian 渲染 bash 更通用)
    if (result.language === "shellsession") return "bash";
    return LANG_ALIAS_MAP[result.language] ?? result.language;
  } catch {
    return "txt";
  }
}

/** 图片路径统一转为 ./assets/xxx */
const normalizeImageAssetPath: TextTransform = (text) => {
  const reg = /!\[(.*?)\]\((.*?)\)/g;
  return text.replace(reg, (full, alt, src) => {
    if (/^https?:\/\//.test(src) || src.startsWith("#")) return full;
    const filename = path.basename(src);
    return `![${alt}](${"./" + ASSETS_FOLDER + "/" + filename})`;
  });
};

/** 末尾统一单个换行 */
const ensureTrailingNewline: TextTransform = (t) => t.trimEnd() + "\n";

// ===================== 组装 MD 正文处理管道【可自由增删算子】 =====================
/**
 * 异步管道:第一个参数是源,后面是算子。
 * 算子顺序保持原 sync 版本,只在 autoDetectCodeBlockLang 处引入 await。
 */
function mdBodyPipeline(source: string): Promise<string> {
  return asyncPipe(
    source,
    normalizeLineBreak,
    trimTrailingSpace,
    fixListMarkerSpacing,
    compressEmptyLines,
    fixHeadingPadding,
    stripRedundantHtml,
    fixTableAlign,
    autoDetectCodeBlockLang, // 唯一 async 算子
    normalizeImageAssetPath,
    ensureTrailingNewline,
  );
}

// ===================== 文件遍历逻辑 =====================
async function walkDirectory(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name) || DIR_BLACKLIST.has(entry.name)) continue;
      files.push(...(await walkDirectory(fullPath)));
    } else if (entry.isFile()) {
      if (FILE_BLACKLIST.has(entry.name)) continue;
      if (TARGET_EXT.has(path.extname(entry.name))) files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let outputJsonReport = false;
  let scanDirs: string[] = ["./"];
  const report: MdScanReportItem[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry") dryRun = true;
    else if (arg === "--json-report") outputJsonReport = true;
    else if (arg === "--dir") scanDirs = args[++i].split(",");
  }

  let allMdFiles: string[] = [];
  for (const d of scanDirs) {
    allMdFiles.push(...(await walkDirectory(path.resolve(d))));
  }

  for (const fp of allMdFiles) {
    try {
      const rawContent = await fs.readFile(fp, "utf8");
      const { front, body } = splitFrontmatter(rawContent);
      const processedBody = await mdBodyPipeline(body);
      const finalContent = front ? front + processedBody : processedBody;

      const changed = rawContent !== finalContent;
      report.push({
        filePath: fp,
        changed,
        violations: changed ? ["正文格式化修正"] : [],
      });

      if (changed) {
        console.log(pc.yellow(`${dryRun ? "[DRY] " : ""}待整理: ${fp}`));
        if (!dryRun) await fs.writeFile(fp, finalContent, "utf8");
      }
    } catch (err) {
      console.warn(pc.red(`读取失败: ${fp}`), err);
    }
  }

  const modifyTotal = report.filter((r) => r.changed).length;
  console.log(pc.bold("\n===== MD管道格式化汇总 ====="));
  console.log(`扫描 MD 文件: ${allMdFiles.length}`);
  console.log(`需要修改文件: ${modifyTotal}`);
  if (dryRun) console.log(pc.blue("⚠️ 试运行模式，未写入磁盘"));

  if (outputJsonReport) {
    console.log("\n" + JSON.stringify(report, null, 2));
  }
}

main().catch((err) => {
  console.error(pc.red("执行异常："), err);
  process.exit(1);
});