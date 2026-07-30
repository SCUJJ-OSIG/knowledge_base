---
tags:
  - blog
series: blog
---

使用trubo管理monorepo

1，先把这个仓库运行起来
`https://github.com/eastgold15/vue-elysia-template`

技术栈：
前端：vue +tailwind(UI) + volt (UI)
后端：elyisa  +orm(dirzzle) +pg数据库  

前端运行在9011，后端在9001



2.运行条件
因为使用了数据库，你电脑没有数据库是运行不起来的，我配置了远程数据库，你需要替换这个文件
```
D:\Users\boer\Desktop\monorepo-vue-elyisa\apps\backend\.env.development


# 数据库配置

# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb
DATABASE_URL=postgresql://mydb:sb48ExRmrRM8WsBx@47.109.24.194:5432/mydb

```

安装运行环境bun：


1.安装换源工具
[[node 加速下载]]

2.安装node和bun环境

[[安装volta]]

[[Bun安装]]
