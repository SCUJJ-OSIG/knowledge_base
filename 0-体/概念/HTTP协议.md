---
date created: 2026-04-22
tags: [体/概念, 场景/网络]
aliases: [HTTP, 超文本传输协议]
related: [HTTPS, TCP/IP, RESTful, API]
形态: 参考型
场景: 网络
published: true
---

# HTTP协议

> 一句话定义：超文本传输协议，用于客户端与服务器之间传输超文本的应用层协议

## 核心原理

### OSI 模型位置

HTTP 位于**应用层**，基于 TCP 协议传输。

```
应用层 (HTTP)
    ↓
传输层 (TCP)
    ↓
网络层 (IP)
    ↓
数据链路层
```

### 请求 - 响应模型

HTTP 采用**无状态**的请求 - 响应模型：

```
客户端                 服务器
  | --- HTTP 请求 --->   |
  |                     | 处理请求
  | <--- HTTP 响应 ---   |
```

### 无状态特性

- 每次请求独立，服务器不保留之前请求的状态
- 通过 Cookie/Session 实现状态保持
- 有利于水平扩展

## HTTP 方法

| 方法 | 用途 | 幂等性 |
|------|------|--------|
| GET | 获取资源 | 是 |
| POST | 创建资源 | 否 |
| PUT | 更新资源 (全量) | 是 |
| PATCH | 更新资源 (部分) | 否 |
| DELETE | 删除资源 | 是 |
| HEAD | 获取响应头 | 是 |
| OPTIONS | 获取支持的方法 | 是 |

## HTTP 状态码

### 1xx 信息

- 100 Continue - 继续

### 2xx 成功

- 200 OK - 成功
- 201 Created - 已创建
- 204 No Content - 无内容

### 3xx 重定向

- 301 Moved Permanently - 永久重定向
- 302 Found - 临时重定向
- 304 Not Modified - 未修改 (缓存)

### 4xx 客户端错误

- 400 Bad Request - 请求格式错误
- 401 Unauthorized - 未授权
- 403 Forbidden - 禁止访问
- 404 Not Found - 未找到

### 5xx 服务器错误

- 500 Internal Server Error - 服务器内部错误
- 502 Bad Gateway - 网关错误
- 503 Service Unavailable - 服务不可用

## HTTP 版本演进

### HTTP/1.0

- 短连接：每次请求建立新 TCP 连接
- 简单但效率低

### HTTP/1.1

- 长连接：Keep-Alive 复用 TCP 连接
- 管道化：多个请求可并发
- 分块传输：支持流式传输

### HTTP/2

- 多路复用：单个连接并发多个请求
- 头部压缩：减少传输数据量
- 服务器推送：主动推送资源

### HTTP/3

- 基于 QUIC 协议 (UDP)
- 解决队头阻塞
- 更快的连接建立

## 与其他概念的关系

- [[HTTPS]] - HTTP + TLS 加密
- [[RESTful]] - 基于 HTTP 的 API 设计风格
- [[TCP/IP]] - HTTP 的底层协议
- [[WebSocket]] - 双向通信协议

## 常见应用场景

- Web 页面请求：参考 [[Web 开发场景]]
- API 接口调用：参考 [[API 设计场景]]
- 文件上传下载：参考 [[文件传输场景]]

---

## 参考链接

- [MDN HTTP 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)
- [HTTP/2 详解](https://http2.github.io/)
