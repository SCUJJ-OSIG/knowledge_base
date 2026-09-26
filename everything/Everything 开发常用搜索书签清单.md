---
date created: 2026-08-Sa 12:12:13
date modified: 2026-08-Sa 12:28:03
---

## 一、项目包相关（快速定位各类项目）

| 书签名称 | 搜索表达式 | 用途说明 |
| :--- | :--- | :--- |
| package.json 清单 | `filename:package.json` | 查找所有前端项目根目录，快速定位前端仓库 |
| package-lock / yarn.lock | `filename:package-lock.json OR filename:yarn.lock OR filename:pnpm-lock.yaml` | 锁定文件，区分npm/pnpm/yarn项目 |
| Cargo.toml(Rust项目) | `filename:Cargo.toml` | Rust项目根文件 |
| go.mod(Golang项目) | `filename:go.mod` | Go项目识别 |
| pyproject.toml(Python现代项目) | `filename:pyproject.toml` | poetry/pdm/uv python项目 |
| requirements.txt | `filename:requirements.txt` | 传统python依赖清单 |
| build.gradle(Android/Gradle) | `filename:build.gradle OR filename:build.gradle.kts` | Android、Java Gradle项目 |
| pom.xml(Maven Java) | `filename:pom.xml` | Java Maven项目 |

## ️ 二、源码配置文件书签

| 书签名称 | 搜索表达式 | 用途 |
| :--- | :--- | :--- |
| Git仓库根目录 | `filename:.git` | 快速找到所有git项目文件夹 |
| Docker相关配置 | `filename:Dockerfile OR filename:docker-compose.yml` | 容器项目定位 |
| Typescript配置 | `filename:tsconfig.json` | TS项目 |
| .env环境变量文件 | `filename:.env` | 所有环境配置文件 |

## 三、目录快速检索书签（文件夹筛选）

> 提示：Everything 表达式区分文件/文件夹，`folder:` 代表只匹配文件夹。

| 书签名称 | 搜索表达式 | 说明 |
| :--- | :--- | :--- |
| dist产物目录 | `folder:dist` | 打包输出目录 |
| build构建目录 | `folder:build` | 通用构建文件夹 |
| 所有public静态资源 | `folder:public` | 前端静态资源目录 |
| src源代码目录 | `folder:src` | 查找源码文件夹 |

## 四、实用高级搜索书签（开发高频）

| 书签名称 | 搜索表达式 | 功能 |
| :--- | :--- | :--- |
| 查找所有README | `filename:readme.md OR filename:README.md` | 项目说明文档 |
| 数据库迁移脚本 | `ext:sql` | 所有sql脚本文件 |
| Shell脚本 | `ext:sh OR ext:bat OR ext:ps1` | 各类脚本文件 |
| 图片资源 | `ext:png;jpg;jpeg;webp;svg` | 静态图片 |

## ️ 五、进阶增强：结合排除规则优化书签

如果你不想书签搜索时扫进缓存目录，可以追加过滤（示例）：

```text
filename:package.json !folder:node_modules !folder:target !folder:venv
```

> `!folder:xxx` 代表排除该文件夹，双重保险，防止排除列表失效时搜到子目录内无关文件。

## 六、导入小技巧

1. **批量添加方式**：手动新建书签；
2. **书签备份位置**：`%APPDATA%\Everything\Bookmarks.csv` 可以直接导出csv，换电脑、升级Everything Beta预览版直接导入。

## ️ 额外补充：快速搜索模板（直接复制到搜索框测试）

**全部前端项目一键检索**
```text
filename:package.json !folder:node_modules
```

**所有代码仓库（Git项目）**
```text
folder:.git
```

如果你需要，我可以整理一份 **CSV格式文本**，你直接复制保存为 `Bookmarks.csv`，直接导入 Everything，不用一条一条手动创建书签。


![[Everything_Bookmarks_Corrected.csv]]