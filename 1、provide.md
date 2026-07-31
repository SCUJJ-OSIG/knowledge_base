---
date created: '2026-01-日 15:25:35'
date modified: '2026-07-31'
tags:
  - 技术/前端/react
  - 技术/软件架构/设计模式
  - 技术/组件/context
title: 优雅重构版 `UserProvider`
---

Next.js + React Query + Zustand

- **桥梁 (Bridge)**：把 **Server State** (React Query 的数据) 同步到 **Client State** (Zustand Store)。

- **配置 (Configuration)**：初始化全局配置（比如注入 API Client 的 getter），确保 React 树以外的工具能正常工作。

- **守卫 (Guard)**：(可选但常见) 决定“谁能进，谁该滚”（路由保护）。

一个“优雅”的 `UserProvider` 应该像一个**交通枢纽**，而不是一个**大杂烩工厂**。它的核心职责应该非常单一且清晰。

在你的架构（Next.js + React Query + Zustand）中，一个优雅的 Provider 应该具备以下 **3 大职责**：

1. **桥梁 (Bridge)**：把 **Server State** (React Query 的数据) 同步到 **Client State** (Zustand Store)。

2. **配置 (Configuration)**：初始化全局配置（比如注入 API Client 的 getter），确保 React 树以外的工具能正常工作。

3. **守卫 (Guard)**：(可选但常见) 决定“谁能进，谁该滚”（路由保护）。

---

### 优雅重构版 `UserProvider`

这是我为你重构的代码。它利用了 Zustand 的**脱离 React 组件访问状态**的能力，消除了复杂的 `useEffect` 依赖，并清晰地分离了逻辑。

TypeScript

```
"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { useMe } from "@/hooks/api/user";
import { useAuthStore } from "@/stores/auth-store";
import { setDeptIdGetter } from "@/lib/api-client"; // 假设这是你的 api client 路径

// 定义不需要鉴权的白名单路径
const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password"];

export function UserProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 判定当前是否在公共页面
  const isPublicPage = PUBLIC_PATHS.includes(pathname);

  // --- 职责 1: 配置 API Client (最优雅的改动) ---
  // 利用 Zustand 的 .getState() 方法。
  // 不需要依赖 React 的渲染周期，也不需要 ref。
  // 只要组件挂载一次，API Client 就能永远获取到 store 里最新的值。
  useEffect(() => {
    setDeptIdGetter(() => {
      // 🔥 核心魔法：直接从 Store 实例拿值，而不是从 Hook 拿
      return useAuthStore.getState().currentDeptId;
    });
  }, []);

  // --- 职责 2: 数据获取与同步 ---
  // 只在非白名单页面，或者我们要尝试恢复会话时请求
  const { data, error, isLoading } = useMe({
    retry: false, // 失败了别重试，直接跳登录
    enabled: !isPublicPage // 公开页面不查用户信息，节省资源
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // 监听数据变化，同步到 Zustand
  useEffect(() => {
    if (data) {
      setAuth(data);
    } else if (error) {
      // 只有在非公开页面遇到错误才清理和跳转
      // 防止在 Login 页面因为之前的过期 Token 导致循环跳转
      clearAuth();
      if (!isPublicPage) {
        router.replace("/login"); // 使用 replace 防止用户点后退又回到受保护页面
      }
    }
  }, [data, error, isPublicPage, router, setAuth, clearAuth]);

  // --- 职责 3: 渲染控制 (防闪烁) ---

  // 1. 如果是公开页面，无条件放行
  if (isPublicPage) {
    return <>{children}</>;
  }

  // 2. 如果正在加载用户信息，显示骨架屏（防止未登录用户看到受保护内容一闪而过）
  if (isLoading) {
    return <FullPageSkeleton />;
  }

  // 3. 如果加载完了但没数据（且有错误），通常 useEffect 会处理跳转，
  // 但为了安全，这里返回 null 防止渲染子组件
  if (!data) return null;

  // 4. 正常渲染
  return <>{children}</>;
}

// 抽离骨架屏组件，保持代码整洁
function FullPageSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col gap-4 p-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}
```

---

### 💡 为什么这个版本更优雅？

#### 1. 解决了 `useEffect` 闭包地狱 (Line 26-31)

你的原版：依赖 authStore 钩子的返回值。如果 Store 更新，Effect 可能会重新运行（取决于具体写法），或者陷入闭包陷阱拿到旧值。

优雅版：

TypeScript

```
setDeptIdGetter(() => useAuthStore.getState().currentDeptId);
```

这是 **Zustand** 的杀手锏。`useAuthStore.getState()` 允许你在 React 组件之外、甚至在普通的 JS 函数中直接读取最新的状态。我们将这个读取函数传给 API Client，API Client 每次请求时都会实时去 Store 里“现拿”最新的 ID。**零依赖，零副作用重新执行。**

#### 2. 路由跳转使用 `replace` (Line 52)

在鉴权失败时，使用 `router.replace` 而不是 `push`。

- **场景**：用户 Token 过期 -> 被踢到登录页。

- **Push**：用户点浏览器“后退” -> 回到受保护页 -> 再次触发错误 -> 又被踢回登录页（死循环，用户体验极差）。

- **Replace**：替换当前历史记录，用户点“后退”会回到上一个正常的页面（比如谷歌搜索页）。

#### 3. 职责边界清晰

- **API Client**：完全不知道 React 的存在，只知道“有个函数能给我 ID”。

- **React Query**：负责与服务器通信，处理 Loading/Error 状态。

- **Zustand**：负责作为全局数据的“真理来源 (Single Source of Truth)”。

- **UserProvider**：仅仅是把上面三个东西组装起来的胶水层。

#### 4. 白名单机制 (Line 12)

将 `isPublicPage` 的判断逻辑抽离成 `PUBLIC_PATHS` 常量。如果有新的公开页面（比如 `/forgot-password`, `/terms`），只需要改数组，不需要去改复杂的 `if` 逻辑。

### 总结

优雅的 Provider 不做复杂的业务逻辑，它只做 “同步” 和 “分发”。

通过使用 useAuthStore.getState()，你彻底解耦了 API 层和 UI 渲染层，这是 React + Zustand 架构中最精髓的部分。
