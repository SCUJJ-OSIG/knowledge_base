---
tags:
  - 技术/编辑器/vscode
  - 技术/调试/debug
title: 配置列表configurations
date created: '2026-07-31'
date modified: '2026-07-31'
---

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "前端调试",
      "url": "http://localhost:${env.PORT:-8850}",
      "webRoot": "${workspaceFolder}",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      },
      "preLaunchTask": "serve" // 启动前执行 serve 任务
    }
  ],
  //复合列表。每个复合可引用多个配置，这些配置将一起启动
  "compounds": [
    {
      "name": "全栈调试",
      "configurations": ["前端调试", "后端调试"]
    }
  ]
}
```

## 配置列表configurations

字段

### 1.type: "pwa-chrome"​ 与 type: "chrome"​ 的区别

- ​type: "chrome"​ ​：用于调试传统 Web 应用，需要手动指定 URL。
- ​type: "pwa-chrome"​ ​：专为 PWA（渐进式 Web 应用）设计，支持自动检测和启动 PWA。

### 2. request: "attach"​ 与 request: "launch"​ 的区别

- ​request: "attach"​ ​：附加到已运行的调试会话（如已启动的 Chrome 浏览器）。
- ​request: "launch"​ ​：启动一个新会话（如新 Chrome 实例）。

‍

前端项目例子

```json
//launch.json
{
    "version": "0.2.0",
    "envFile": ".env",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Vue 前端调试",
            "url": "http://localhost:${env.PORT}",
            "webRoot": "${workspaceFolder}/src",
            "sourceMapPathOverrides": {
                "webpack:///src/*": "${webRoot}/*"
            },
            "preLaunchTask": "serve"
        }
    ]
}

//tasks.json
{
    "version": "0.2.0",
    "envFile": ".env",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Vue 前端调试",
            "url": "http://localhost:${env.PORT}",
            "webRoot": "${workspaceFolder}/src",
            "sourceMapPathOverrides": {
                "webpack:///src/*": "${webRoot}/*"
            },
            "preLaunchTask": "serve"
        }
    ]
}

```
