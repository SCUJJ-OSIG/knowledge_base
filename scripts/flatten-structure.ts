/**
 * vault 目录扁平化脚本(实际移动文件)
 *
 * 规则:
 * 1. KEEP_DIRS - 系统教程/有图片,保留结构
 * 2. 其他 .md 全部移到 vault 根
 * 3. 冲突时:目标已存在 → 用源目录名作为前缀
 * 4. assets 文件夹:仅当 .md 真的引用了图片时,跟着 .md 移到 <md-stem>.assets/
 * 5. 没被任何 .md 引用的 assets 目录:扁平化后删除
 *
 * 用法:
 *   bun scripts/flatten-structure.ts --dry-run   # 只打印,不动文件
 *   bun scripts/flatten-structure.ts             # 实际执行
 */

import { existsSync, readdirSync, readFileSync, renameSync, rmdirSync, statSync, unlinkSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";

const VAULT = resolve(import.meta.dir, "..");
const DRY_RUN = process.argv.includes("--dry-run");

// 保留结构(系统教程/有图片)
const KEEP_DIRS = [
  "2-技术文章/02-TypeScript全栈开发",
  "2-技术文章/05-DevOps与基础设施/Linux系统管理",
  "2-技术文章/05-DevOps与基础设施/容器化技术",
  "2-技术文章/05-DevOps与基础设施/CI-CD流水线",
  "2-技术文章/13-论文",
  "2-技术文章/9-yolo",
  "2-技术文章/3-编辑器/0-vscode",
  "2-技术文章/0-vim",
  "2-技术文章/1-aiCoding",
  "2-技术文章/08-AI编程/ai+自动化",
  "2-技术文章/组件封装",
  "2-技术文章/03-软件架构与设计哲学/react",
  "2-技术文章/02-TypeScript全栈开发/前端框架/Vue生态/vue3ts尚硅谷",
  "2-技术文章/Git版本控制",
  "2-技术文章/12-磁盘",
  "4-全栈/01-elysia",
  "7-信息研究/金钱流动",
].map((p) => p.replace(/\//g, sep));

// 根目录已存在的文件,跳过移动
const ROOT_KEEP = new Set([
  "CLAUDE.md",
  "README.md",
  "学习js.md",
  "未命名.md",
  "未命名 1.md",
  "base驱动博客重构计划.md",
  "知识库管理规则.md",
  "views.published.base",
  "知识库.base",
  "skills-lock.json",
]);

// 要删的模板文件
const DELETE_TEMPLATES = new Set([
  "3-场景/模板 - 场景.md",
  "0-体/概念/模板 - 概念.md",
  "0-体/工具/模板 - 工具.md",
  "0-体/技能/模板 - 技能.md",
]);

// 跳过的目录
const SKIP_DIRS = new Set([
  ".obsidian",
  ".git",
  ".trash",
  ".github",
  ".claude",
  ".agents",
  "scripts",
  "copilot",
  "node_modules",
]);

function isInKeepDir(absPath: string): boolean {
  const rel = relative(VAULT, absPath);
  return KEEP_DIRS.some((keep) => rel === keep || rel.startsWith(keep + sep));
}

function isAtRoot(absPath: string): boolean {
  return dirname(absPath) === VAULT;
}

function isSkippedFile(absPath: string): boolean {
  return ROOT_KEEP.has(basename(absPath));
}

/** 检测 .md 是否引用了图片(obsidian 嵌入 ![[xxx]] 或 markdown 引用 ![](相对路径) */
function hasImageRefs(mdAbs: string): boolean {
  let content: string;
  try {
    content = readFileSync(mdAbs, "utf-8");
  } catch {
    return false;
  }
  // ![[filename]] 或 ![[filename|alias]]
  if (/!\[\[[^]]+\.(png|jpe?g|gif|webp|svg|bmp|ico)\]?\]/i.test(content)) {
    return true;
  }
  // ![alt](path) - 相对路径(. 或 ./ 开头)且是图片
  if (/!\[[^\]]*\]\((\.{0,2}\/[^)]*\.(png|jpe?g|gif|webp|svg|bmp|ico))\)/i.test(content)) {
    return true;
  }
  // ![alt](filename) - 同目录相对引用(没路径)
  if (/!\[[^\]]*\]\(([^()\/:]+\.(png|jpe?g|gif|webp|svg|bmp|ico))\)/i.test(content)) {
    return true;
  }
  return false;
}

function findAllMd(): string[] {
  const out: string[] = [];
  function walk(dir: string) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      if (SKIP_DIRS.has(name)) continue;
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (st.isFile() && extname(name).toLowerCase() === ".md") {
        out.push(full);
      }
    }
  }
  walk(VAULT);
  return out.sort();
}

/** 决定移动目标路径,处理冲突 */
function pickTarget(srcAbs: string, baseName: string): string {
  const target = join(VAULT, baseName);
  if (!existsSync(target)) return target;

  const rel = relative(VAULT, dirname(srcAbs));
  const topDir = rel.split(sep)[0];
  const ext = extname(baseName);
  const stem = basename(baseName, ext);
  const prefixed = `${topDir}--${stem}${ext}`;
  const target2 = join(VAULT, prefixed);
  if (!existsSync(target2)) return target2;

  for (let i = 2; i < 100; i++) {
    const t = join(VAULT, `${topDir}--${stem}-${i}${ext}`);
    if (!existsSync(t)) return t;
  }
  return target;
}

/** 检测 .md 关联的 assets 目录 */
function findAssetsDir(mdAbs: string): string | null {
  const stem = basename(mdAbs, ".md");
  const dir = dirname(mdAbs);
  const candidates = [join(dir, `${stem}.assets`), join(dir, "assets")];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isDirectory()) return c;
  }
  return null;
}

/** 把 assets 目录移到 vault 根,命名为 "<md文件名>.assets" */
function moveAssets(assetsAbs: string, mdStem: string): string {
  const newName = `${mdStem}.assets`;
  let target = join(VAULT, newName);
  if (existsSync(target)) {
    const rel = relative(VAULT, assetsAbs);
    const topDir = rel.split(sep)[0];
    target = join(VAULT, `${topDir}--${newName}`);
  }
  if (DRY_RUN) {
    console.log(`  [assets] ${relative(VAULT, assetsAbs)} -> ${relative(VAULT, target)}`);
  } else {
    renameSync(assetsAbs, target);
    console.log(`  [assets] ${relative(VAULT, assetsAbs)} -> ${relative(VAULT, target)}`);
  }
  return target;
}

/** 删除空目录(KEEP_DIRS 外的) */
function cleanupEmptyDirs() {
  const allDirs: string[] = [];
  function walk(dir: string) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      if (SKIP_DIRS.has(name)) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        allDirs.push(full);
        walk(full);
      }
    }
  }
  walk(VAULT);
  allDirs.sort((a, b) => b.length - a.length);

  let removed = 0;
  for (const d of allDirs) {
    if (isInKeepDir(d)) continue;
    if (dirname(d) === VAULT) continue;
    try {
      if (readdirSync(d).length === 0) {
        if (DRY_RUN) {
          console.log(`  [rmdir] ${relative(VAULT, d)}`);
        } else {
          rmdirSync(d);
          console.log(`  [rmdir] ${relative(VAULT, d)}`);
        }
        removed++;
      }
    } catch {
      // 忽略
    }
  }
  return removed;
}

function main() {
  console.log(`DRY_RUN: ${DRY_RUN}`);
  console.log(`VAULT: ${VAULT}`);
  console.log("");

  const allMd = findAllMd();
  let moveCount = 0;
  let skipCount = 0;
  let keepCount = 0;
  let templateDelCount = 0;
  let assetsMovedCount = 0;

  // 分类:有图片引用的 .md 先处理(抢 assets),剩下的后处理
  const withImages: string[] = [];
  const withoutImages: string[] = [];
  for (const abs of allMd) {
    if (isSkippedFile(abs) && isAtRoot(abs)) {
      skipCount++;
      continue;
    }
    if (isInKeepDir(abs)) {
      keepCount++;
      continue;
    }
    if (isAtRoot(abs)) {
      skipCount++;
      continue;
    }
    const relNorm = relative(VAULT, abs).split(sep).join("/");
    if (DELETE_TEMPLATES.has(relNorm)) {
      if (DRY_RUN) {
        console.log(`  [DELETE template] ${relNorm}`);
      } else {
        unlinkSync(abs);
        console.log(`  [DELETE template] ${relNorm}`);
      }
      templateDelCount++;
      continue;
    }
    if (hasImageRefs(abs)) {
      withImages.push(abs);
    } else {
      withoutImages.push(abs);
    }
  }

  // 第一遍:有图片引用的 .md 先搬(先抢 assets)
  for (const abs of [...withImages, ...withoutImages]) {
    const rel = relative(VAULT, abs);
    const name = basename(rel);

    // 决定目标
    const baseName = name;
    const target = pickTarget(abs, baseName);

    if (DRY_RUN) {
      console.log(`  [move] ${rel} -> ${relative(VAULT, target)}`);
    } else {
      renameSync(abs, target);
      console.log(`  [move] ${rel} -> ${relative(VAULT, target)}`);
    }
    moveCount++;

    // 处理 assets:仅当 .md 真的引用了图片时
    if (hasImageRefs(abs)) {
      const assets = findAssetsDir(abs);
      if (assets) {
        const mdStem = basename(target, ".md");
        moveAssets(assets, mdStem);
        assetsMovedCount++;
      } else {
        console.log(`  [warn] ${rel} 有图片引用但找不到 assets 目录`);
      }
    }
  }

  // 清理剩余的 assets 目录(没被任何 .md 引用的)
  const orphanAssetsRemoved = cleanupOrphanAssets();
  // 清理空目录
  const removedDirs = cleanupEmptyDirs();

  console.log("");
  console.log(`=== summary ===`);
  console.log(`  moved:                ${moveCount}`);
  console.log(`  kept (KEEP_DIRS):     ${keepCount}`);
  console.log(`  skipped (root):       ${skipCount}`);
  console.log(`  templates deleted:    ${templateDelCount}`);
  console.log(`  assets moved:         ${assetsMovedCount}`);
  console.log(`  orphan assets removed: ${orphanAssetsRemoved}`);
  console.log(`  empty dirs removed:   ${removedDirs}`);
}

/** 删除没被引用的 assets 目录(任何 KEEP_DIRS 外的) */
function cleanupOrphanAssets() {
  const orphanDirs: string[] = [];
  function walkTopLevel(dir: string) {
    for (const name of readdirSync(dir)) {
      if (SKIP_DIRS.has(name)) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (isInKeepDir(full)) continue;
        if (name === "assets" || name.endsWith(".assets")) {
          orphanDirs.push(full);
        } else {
          walkTopLevel(full);
        }
      }
    }
  }
  walkTopLevel(VAULT);

  let removed = 0;
  for (const d of orphanDirs) {
    if (!existsSync(d)) continue;
    try {
      const items = readdirSync(d);
      if (DRY_RUN) {
        console.log(`  [rm assets] ${relative(VAULT, d)} (${items.length} files)`);
      } else {
        removeRecursive(d);
        console.log(`  [rm assets] ${relative(VAULT, d)} (${items.length} files)`);
      }
      removed++;
    } catch {
      // 忽略
    }
  }
  return removed;
}

function removeRecursive(p: string) {
  const st = statSync(p);
  if (st.isDirectory()) {
    for (const name of readdirSync(p)) {
      removeRecursive(join(p, name));
    }
    rmdirSync(p);
  } else {
    unlinkSync(p);
  }
}

main();
