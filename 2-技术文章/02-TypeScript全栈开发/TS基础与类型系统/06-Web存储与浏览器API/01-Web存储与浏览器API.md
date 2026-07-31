---
tags:
  - 技术/前端/javascript
  - 技术/浏览器api/storage
title: Web存储与浏览器API
date created: '2026-07-31'
date modified: '2026-07-31'
---
# Web存储与浏览器API

## 📋 学习目标
- 掌握Web存储的两种方式：localStorage和sessionStorage
- 理解Cookie的使用和限制
- 学会IndexedDB进行复杂数据存储
- 掌握浏览器常用API的使用
- 了解浏览器安全机制和同源策略
- 学会进行数据存储的最佳实践

## 🎯 Web存储基础

### 1. Web存储概述

```javascript
// Web Storage是HTML5提供的本地存储解决方案
// 分为两种：localStorage和sessionStorage

// localStorage - 永久存储
// 特点：
// 1. 数据永久保存，除非手动清除
// 2. 容量通常为5-10MB
// 3. 只能存储字符串
// 4. 遵循同源策略

// sessionStorage - 临时存储
// 特点：
// 1. 数据仅在当前会话有效
// 2. 关闭标签页或浏览器后数据清除
// 3. 容量通常为5MB
// 4. 也遵循同源策略

// 检测浏览器支持
if (typeof(Storage) !== "undefined") {
    console.log("浏览器支持Web Storage");
} else {
    console.log("浏览器不支持Web Storage");
}
```

### 2. localStorage详解

```javascript
// localStorage基本操作

// 1. 存储数据 - 三种方式
localStorage.setItem('username', '张三');        // setItem方法
localStorage.age = '25';                         // 点号方式
localStorage['email'] = 'zhangsan@example.com';  // 方括号方式

// 2. 读取数据 - 三种方式
const username = localStorage.getItem('username');    // getItem方法
const age = localStorage.age;                         // 点号方式
const email = localStorage['email'];                  // 方括号方式

console.log(username); // 张三
console.log(age);      // 25
console.log(email);    // zhangsan@example.com

// 3. 更新数据（重新赋值覆盖原值）
localStorage.setItem('username', '李四');
localStorage.age = '30';

console.log(localStorage.getItem('username')); // 李四
console.log(localStorage.age);                 // 30

// 4. 删除特定数据
localStorage.removeItem('username');
delete localStorage.age;  // 使用delete关键字

console.log(localStorage.getItem('username')); // null
console.log(localStorage.age);                 // undefined

// 5. 清空所有数据
localStorage.clear();

// 6. 遍历所有数据
// 存储一些测试数据
localStorage.setItem('name', '王五');
localStorage.setItem('city', '北京');
localStorage.setItem('job', '开发工程师');

// 遍历方式1：使用length和key方法
console.log('方式1：');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
}

// 遍历方式2：使用for...in（会包含内置属性）
console.log('方式2：');
for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
        console.log(`${key}: ${localStorage[key]}`);
    }
}

// 7. 检查是否存在某个key
console.log('检查name是否存在:', localStorage.hasOwnProperty('name')); // true
console.log('检查phone是否存在:', localStorage.hasOwnProperty('phone')); // false

// 8. 获取所有值
console.log('所有值:', localStorage.valueOf());
```

### 3. sessionStorage详解

```javascript
// sessionStorage用法与localStorage相同，只是生命周期不同

// 存储数据
sessionStorage.setItem('sessionId', 'abc123');
sessionStorage.userName = '用户A';
sessionStorage['pageViews'] = '5';

// 读取数据
console.log(sessionStorage.getItem('sessionId')); // abc123
console.log(sessionStorage.userName);             // 用户A
console.log(sessionStorage['pageViews']);         // 5

// 更新数据
sessionStorage.setItem('pageViews', '6');

// 删除数据
sessionStorage.removeItem('sessionId');

// 清空数据
sessionStorage.clear();

// 遍历数据
for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(`${key}: ${value}`);
}
```

## 🍪 Cookie详解

### 1. Cookie基础

```javascript
// Cookie是服务器发送到用户浏览器并保存在本地的小数据
// 会在后续请求时发送回服务器

// 设置Cookie
document.cookie = "username=张三; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
document.cookie = "age=25; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
document.cookie = "theme=dark; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";

// Cookie参数说明
// name=value: Cookie的名称和值
// expires: 过期时间（GMT时间）
// max-age: 最大存活时间（秒）
// domain: 域名限制
// path: 路径限制
// secure: 仅在HTTPS下传输
// HttpOnly: 仅服务器可访问
// SameSite: 跨站点请求控制

// 读取Cookie
function getCookies() {
    const cookies = {};
    const cookieString = document.cookie;

    if (cookieString) {
        const cookieArray = cookieString.split(';');
        for (let cookie of cookieArray) {
            const [name, value] = cookie.trim().split('=');
            cookies[name] = value;
        }
    }

    return cookies;
}

const allCookies = getCookies();
console.log(allCookies);

// 获取特定Cookie
function getCookie(name) {
    const cookies = getCookies();
    return cookies[name] || null;
}

console.log('username:', getCookie('username'));

// 删除Cookie（设置过期时间为过去的时间）
function deleteCookie(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

deleteCookie('username');
```

### 2. Cookie工具类

```javascript
class CookieManager {
    // 设置Cookie
    static set(name, value, options = {}) {
        const {
            expires = null,
            maxAge = null,
            domain = null,
            path = '/',
            secure = false,
            httpOnly = false,
            sameSite = 'Lax'
        } = options;

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (expires) {
            cookieString += `; expires=${expires.toUTCString()}`;
        }

        if (maxAge) {
            cookieString += `; max-age=${maxAge}`;
        }

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        if (path) {
            cookieString += `; path=${path}`;
        }

        if (secure) {
            cookieString += '; secure';
        }

        if (httpOnly) {
            cookieString += '; HttpOnly';
        }

        cookieString += `; SameSite=${sameSite}`;

        document.cookie = cookieString;
    }

    // 获取Cookie
    static get(name) {
        const nameEQ = encodeURIComponent(name) + "=";
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            let c = cookie.trim();
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length));
            }
        }

        return null;
    }

    // 删除Cookie
    static delete(name, options = {}) {
        this.set(name, '', {
            ...options,
            expires: new Date(0),
            maxAge: -1
        });
    }

    // 获取所有Cookie
    static getAll() {
        const cookies = {};
        const cookieString = document.cookie;

        if (cookieString) {
            const cookieArray = cookieString.split(';');
            for (let cookie of cookieArray) {
                const [name, value] = cookie.trim().split('=');
                if (name && value) {
                    cookies[decodeURIComponent(name)] = decodeURIComponent(value);
                }
            }
        }

        return cookies;
    }

    // 清空所有Cookie
    static clearAll() {
        const cookies = this.getAll();
        Object.keys(cookies).forEach(name => {
            this.delete(name);
        });
    }
}

// 使用CookieManager
CookieManager.set('user', '张三', {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
    path: '/',
    secure: true,
    sameSite: 'Strict'
});

console.log('用户:', CookieManager.get('user'));

CookieManager.set('preferences', JSON.stringify({
    theme: 'dark',
    language: 'zh-CN',
    notifications: true
}));

const preferences = JSON.parse(CookieManager.get('preferences') || '{}');
console.log('用户偏好:', preferences);
```

## 💾 IndexedDB详解

### 1. IndexedDB基础

```javascript
// IndexedDB是浏览器提供的客户端数据库，支持复杂数据结构存储

class IndexedDBManager {
    constructor(dbName, version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    // 打开数据库连接
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                reject(`数据库打开失败: ${event.target.error}`);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('数据库打开成功');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 创建对象存储（相当于表）
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', {
                        keyPath: 'id',
                        autoIncrement: true
                    });

                    // 创建索引
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('name', 'name', { unique: false });
                }

                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', {
                        keyPath: 'id'
                    });
                    productStore.createIndex('category', 'category', { unique: false });
                    productStore.createIndex('price', 'price', { unique: false });
                }
            };
        });
    }

    // 添加数据
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => {
                console.log('数据添加成功');
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`数据添加失败: ${event.target.error}`);
            };
        });
    }

    // 获取单条数据
    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`数据获取失败: ${event.target.error}`);
            };
        });
    }

    // 获取所有数据
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`数据获取失败: ${event.target.error}`);
            };
        });
    }

    // 更新数据
    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => {
                console.log('数据更新成功');
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`数据更新失败: ${event.target.error}`);
            };
        });
    }

    // 删除数据
    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('数据删除成功');
                resolve();
            };

            request.onerror = (event) => {
                reject(`数据删除失败: ${event.target.error}`);
            };
        });
    }

    // 通过索引查询
    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.get(value);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(`查询失败: ${event.target.error}`);
            };
        });
    }

    // 清空存储
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('存储清空成功');
                resolve();
            };

            request.onerror = (event) => {
                reject(`清空失败: ${event.target.error}`);
            };
        });
    }
}

// 使用IndexedDB
async function demonstrateIndexedDB() {
    const dbManager = new IndexedDBManager('MyDatabase', 1);

    try {
        await dbManager.open();

        // 添加用户数据
        const userId = await dbManager.add('users', {
            name: '张三',
            email: 'zhangsan@example.com',
            age: 25,
            createdAt: new Date()
        });

        console.log('用户ID:', userId);

        // 添加产品数据
        await dbManager.add('products', {
            id: 'prod_001',
            name: '笔记本电脑',
            category: '电子产品',
            price: 5999,
            description: '高性能笔记本电脑'
        });

        // 获取所有用户
        const users = await dbManager.getAll('users');
        console.log('所有用户:', users);

        // 通过邮箱查询用户
        const user = await dbManager.getByIndex('users', 'email', 'zhangsan@example.com');
        console.log('查询到的用户:', user);

        // 更新用户信息
        await dbManager.update('users', {
            id: userId,
            name: '张三',
            email: 'zhangsan@example.com',
            age: 26,
            updatedAt: new Date()
        });

    } catch (error) {
        console.error('操作失败:', error);
    }
}

demonstrateIndexedDB();
```

## 🔧 存储工具类封装

### 1. 统一存储管理器

```javascript
class StorageManager {
    constructor() {
        this.storagePrefix = 'app_';
    }

    // 生成带前缀的key
    getKey(key) {
        return `${this.storagePrefix}${key}`;
    }

    // 设置数据到localStorage
    setLocal(key, value) {
        try {
            const prefixedKey = this.getKey(key);
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(prefixedKey, serializedValue);
            return true;
        } catch (error) {
            console.error('localStorage设置失败:', error);
            return false;
        }
    }

    // 从localStorage获取数据
    getLocal(key, defaultValue = null) {
        try {
            const prefixedKey = this.getKey(key);
            const serializedValue = localStorage.getItem(prefixedKey);
            return serializedValue ? JSON.parse(serializedValue) : defaultValue;
        } catch (error) {
            console.error('localStorage获取失败:', error);
            return defaultValue;
        }
    }

    // 设置数据到sessionStorage
    setSession(key, value) {
        try {
            const prefixedKey = this.getKey(key);
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(prefixedKey, serializedValue);
            return true;
        } catch (error) {
            console.error('sessionStorage设置失败:', error);
            return false;
        }
    }

    // 从sessionStorage获取数据
    getSession(key, defaultValue = null) {
        try {
            const prefixedKey = this.getKey(key);
            const serializedValue = sessionStorage.getItem(prefixedKey);
            return serializedValue ? JSON.parse(serializedValue) : defaultValue;
        } catch (error) {
            console.error('sessionStorage获取失败:', error);
            return defaultValue;
        }
    }

    // 删除localStorage中的数据
    removeLocal(key) {
        const prefixedKey = this.getKey(key);
        localStorage.removeItem(prefixedKey);
    }

    // 删除sessionStorage中的数据
    removeSession(key) {
        const prefixedKey = this.getKey(key);
        sessionStorage.removeItem(prefixedKey);
    }

    // 清空所有应用数据
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                localStorage.removeItem(key);
            }
        });

        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                sessionStorage.removeItem(key);
            }
        });
    }

    // 获取存储空间使用情况
    getStorageInfo() {
        let localUsed = 0;
        let sessionUsed = 0;

        // 计算localStorage使用量
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                localUsed += localStorage[key].length;
            }
        }

        // 计算sessionStorage使用量
        for (let key in sessionStorage) {
            if (sessionStorage.hasOwnProperty(key)) {
                sessionUsed += sessionStorage[key].length;
            }
        }

        return {
            localStorage: {
                used: localUsed,
                usedKB: (localUsed / 1024).toFixed(2),
                // 估算容量（通常为5MB）
                capacity: 5 * 1024 * 1024,
                capacityMB: 5,
                usage: ((localUsed / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
            },
            sessionStorage: {
                used: sessionUsed,
                usedKB: (sessionUsed / 1024).toFixed(2),
                capacity: 5 * 1024 * 1024,
                capacityMB: 5,
                usage: ((sessionUsed / (5 * 1024 * 1024)) * 100).toFixed(2) + '%'
            }
        };
    }
}

// 使用StorageManager
const storage = new StorageManager();

// 存储用户信息
storage.setLocal('user', {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    preferences: {
        theme: 'dark',
        language: 'zh-CN'
    }
});

// 存储临时数据
storage.setSession('currentPage', 'dashboard');
storage.setSession('viewHistory', ['home', 'products', 'dashboard']);

// 读取数据
const user = storage.getLocal('user');
const currentPage = storage.getSession('currentPage', 'home');

console.log('用户信息:', user);
console.log('当前页面:', currentPage);

// 查看存储使用情况
console.log('存储使用情况:', storage.getStorageInfo());
```

### 2. 数据同步管理器

```javascript
class DataSyncManager {
    constructor() {
        this.storage = new StorageManager();
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('网络连接恢复，开始同步数据');
            this.syncData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('网络连接断开，数据将缓存到本地');
        });
    }

    // 保存数据（支持离线）
    async saveData(key, data, syncToServer = true) {
        // 先保存到本地
        this.storage.setLocal(key, data);

        if (syncToServer && this.isOnline) {
            try {
                await this.syncToServer(key, data);
                console.log('数据同步到服务器成功');
            } catch (error) {
                console.error('数据同步失败，加入同步队列:', error);
                this.addToSyncQueue(key, data);
            }
        } else if (syncToServer && !this.isOnline) {
            console.log('离线状态，数据加入同步队列');
            this.addToSyncQueue(key, data);
        }
    }

    // 添加到同步队列
    addToSyncQueue(key, data) {
        this.syncQueue.push({
            key,
            data,
            timestamp: Date.now()
        });
        this.saveSyncQueue();
    }

    // 保存同步队列
    saveSyncQueue() {
        this.storage.setLocal('syncQueue', this.syncQueue);
    }

    // 加载同步队列
    loadSyncQueue() {
        const queue = this.storage.getLocal('syncQueue', []);
        this.syncQueue = queue;
        return queue;
    }

    // 同步数据到服务器
    async syncToServer(key, data) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90%成功率
                    resolve({ success: true });
                } else {
                    reject(new Error('网络请求失败'));
                }
            }, 1000);
        });
    }

    // 批量同步
    async syncData() {
        if (!this.isOnline || this.syncQueue.length === 0) {
            return;
        }

        console.log(`开始同步 ${this.syncQueue.length} 条数据`);

        const failedItems = [];

        for (const item of this.syncQueue) {
            try {
                await this.syncToServer(item.key, item.data);
                console.log(`同步成功: ${item.key}`);
            } catch (error) {
                console.error(`同步失败: ${item.key}`, error);
                failedItems.push(item);
            }
        }

        // 更新同步队列
        this.syncQueue = failedItems;
        this.saveSyncQueue();

        console.log(`同步完成，失败 ${failedItems.length} 条数据`);
    }

    // 清理旧数据
    cleanupOldData(daysOld = 30) {
        const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

        // 清理过期的同步队列项
        this.syncQueue = this.syncQueue.filter(item =>
            item.timestamp > cutoffTime
        );
        this.saveSyncQueue();

        // 清理其他过期数据
        // 这里可以添加更多清理逻辑
    }
}

// 使用DataSyncManager
const dataSync = new DataSyncManager();

// 保存数据
dataSync.saveData('userProfile', {
    name: '张三',
    preferences: { theme: 'dark' }
});

dataSync.saveData('lastLogin', {
    timestamp: Date.now(),
    ip: '192.168.1.1'
});
```

## 🌐 浏览器常用API

### 1. 地理位置

```javascript
// Geolocation API
class LocationService {
    // 获取当前位置
    static getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持地理位置API'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            reject(new Error('用户拒绝了地理位置请求'));
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject(new Error('位置信息不可用'));
                            break;
                        case error.TIMEOUT:
                            reject(new Error('获取位置信息超时'));
                            break;
                        default:
                            reject(new Error('获取位置信息时发生未知错误'));
                            break;
                    }
                },
                {
                    enableHighAccuracy: true,  // 高精度定位
                    timeout: 10000,           // 超时时间（毫秒）
                    maximumAge: 60000         // 缓存时间（毫秒）
                }
            );
        });
    }

    // 持续监听位置变化
    static watchPosition(callback, errorCallback) {
        if (!navigator.geolocation) {
            errorCallback(new Error('浏览器不支持地理位置API'));
            return null;
        }

        return navigator.geolocation.watchPosition(
            callback,
            errorCallback,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    // 停止监听位置变化
    static clearWatch(watchId) {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }
    }

    // 计算两点间距离
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // 地球半径（公里）
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    static toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

// 使用位置服务
async function demonstrateLocation() {
    try {
        const position = await LocationService.getCurrentPosition();
        console.log('当前位置:', position);

        // 计算与北京天安门的距离
        const beijingLat = 39.9042;
        const beijingLon = 116.4074;
        const distance = LocationService.calculateDistance(
            position.latitude, position.longitude,
            beijingLat, beijingLon
        );

        console.log(`距离北京天安门: ${distance.toFixed(2)} 公里`);

    } catch (error) {
        console.error('获取位置失败:', error.message);
    }
}
```

### 2. 设备和系统信息

```javascript
// 设备和浏览器信息
class DeviceInfo {
    // 获取浏览器信息
    static getBrowserInfo() {
        const ua = navigator.userAgent;

        return {
            userAgent: ua,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            // 检测浏览器类型
            browser: this.detectBrowser(ua),
            // 检测操作系统
            os: this.detectOS(ua)
        };
    }

    // 检测浏览器类型
    static detectBrowser(ua) {
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        if (ua.indexOf('Edge') > -1) return 'Edge';
        if (ua.indexOf('Opera') > -1) return 'Opera';
        if (ua.indexOf('MSIE') > -1) return 'Internet Explorer';
        return 'Unknown';
    }

    // 检测操作系统
    static detectOS(ua) {
        if (ua.indexOf('Windows') > -1) return 'Windows';
        if (ua.indexOf('Mac') > -1) return 'macOS';
        if (ua.indexOf('Linux') > -1) return 'Linux';
        if (ua.indexOf('Android') > -1) return 'Android';
        if (ua.indexOf('iOS') > -1) return 'iOS';
        return 'Unknown';
    }

    // 获取屏幕信息
    static getScreenInfo() {
        return {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation?.type || 'unknown',
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }

    // 获取视口信息
    static getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            scrollX: window.scrollX || window.pageXOffset,
            scrollY: window.scrollY || window.pageYOffset,
            documentWidth: document.documentElement.scrollWidth,
            documentHeight: document.documentElement.scrollHeight
        };
    }

    // 检测设备类型
    static getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    // 检测触摸支持
    static hasTouchSupport() {
        return 'ontouchstart' in window ||
               navigator.maxTouchPoints > 0 ||
               navigator.msMaxTouchPoints > 0;
    }

    // 获取电池信息
    static async getBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                return {
                    level: battery.level,
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            } catch (error) {
                console.error('获取电池信息失败:', error);
            }
        }
        return null;
    }

    // 获取网络信息
    static getNetworkInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }
}

// 使用设备信息
const browserInfo = DeviceInfo.getBrowserInfo();
const screenInfo = DeviceInfo.getScreenInfo();
const deviceType = DeviceInfo.getDeviceType();

console.log('浏览器信息:', browserInfo);
console.log('屏幕信息:', screenInfo);
console.log('设备类型:', deviceType);
console.log('触摸支持:', DeviceInfo.hasTouchSupport());

// 获取电池信息
DeviceInfo.getBatteryInfo().then(batteryInfo => {
    if (batteryInfo) {
        console.log('电池信息:', batteryInfo);
    }
});
```

### 3. 通知API

```javascript
// Notification API
class NotificationService {
    // 检查通知权限
    static async checkPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }

        return Notification.permission;
    }

    // 请求通知权限
    static async requestPermission() {
        if (!('Notification' in window)) {
            throw new Error('浏览器不支持通知API');
        }

        const permission = await Notification.requestPermission();
        return permission;
    }

    // 显示通知
    static show(title, options = {}) {
        if (Notification.permission !== 'granted') {
            console.warn('没有通知权限');
            return null;
        }

        const defaultOptions = {
            body: '',
            icon: '/icon.png',
            badge: '/badge.png',
            image: null,
            tag: '',
            data: {},
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
        };

        const notificationOptions = { ...defaultOptions, ...options };

        try {
            const notification = new Notification(title, notificationOptions);

            // 自动关闭通知
            if (!notificationOptions.requireInteraction) {
                setTimeout(() => {
                    notification.close();
                }, 5000);
            }

            // 点击事件
            notification.onclick = (event) => {
                console.log('通知被点击:', event);
                if (notificationOptions.data.url) {
                    window.open(notificationOptions.data.url);
                }
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('显示通知失败:', error);
            return null;
        }
    }

    // 显示进度通知
    static showProgress(title, progress, options = {}) {
        return this.show(title, {
            ...options,
            body: `进度: ${progress}%`,
            tag: 'progress',
            data: { progress }
        });
    }

    // 显示成功通知
    static showSuccess(title, message, options = {}) {
        return this.show(title, {
            ...options,
            body: message,
            icon: '/success-icon.png',
            tag: 'success'
        });
    }

    // 显示错误通知
    static showError(title, message, options = {}) {
        return this.show(title, {
            ...options,
            body: message,
            icon: '/error-icon.png',
            tag: 'error',
            vibrate: [200, 100, 200, 100, 200]
        });
    }
}

// 使用通知服务
async function demonstrateNotifications() {
    try {
        // 请求权限
        const permission = await NotificationService.requestPermission();
        console.log('通知权限:', permission);

        if (permission === 'granted') {
            // 显示不同类型的通知
            NotificationService.showSuccess('操作成功', '文件上传完成');
            NotificationService.showProgress('下载中', 45);
            NotificationService.showError('操作失败', '网络连接错误');
        }
    } catch (error) {
        console.error('通知服务错误:', error);
    }
}
```

## 🔒 安全机制

### 1. 同源策略

```javascript
// 同源策略：协议、域名、端口都相同才算同源

class SecurityUtils {
    // 检查是否同源
    static isSameOrigin(url1, url2) {
        try {
            const origin1 = new URL(url1).origin;
            const origin2 = new URL(url2).origin;
            return origin1 === origin2;
        } catch (error) {
            console.error('URL解析失败:', error);
            return false;
        }
    }

    // 获取当前源
    static getCurrentOrigin() {
        return window.location.origin;
    }

    // 安全地解析URL
    static parseURL(url) {
        try {
            return new URL(url);
        } catch (error) {
            console.error('无效的URL:', url);
            return null;
        }
    }

    // 检查URL是否安全
    static isSecureURL(url) {
        const parsedURL = this.parseURL(url);
        if (!parsedURL) return false;

        // 检查协议
        const secureProtocols = ['https:', 'wss:'];
        if (!secureProtocols.includes(parsedURL.protocol)) {
            return false;
        }

        // 检查是否为相对路径
        if (!parsedURL.host) {
            return true;
        }

        // 检查是否为同源
        return this.isSameOrigin(url, this.getCurrentOrigin());
    }

    // 安全的fetch请求
    static async secureFetch(url, options = {}) {
        if (!this.isSecureURL(url)) {
            throw new Error('不安全的URL请求');
        }

        const defaultOptions = {
            credentials: 'same-origin',
            mode: 'cors'
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            return response;
        } catch (error) {
            console.error('请求失败:', error);
            throw error;
        }
    }

    // 防止XSS攻击 - HTML转义
    static escapeHTML(str) {
        if (typeof str !== 'string') {
            return '';
        }

        const htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };

        return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
    }

    // 防止XSS攻击 - 输入验证
    static sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        // 移除脚本标签和危险属性
        return input
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:/gi, '')
            .trim();
    }

    // 生成安全的随机字符串
    static generateSecureRandom(length = 32) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint32Array(length);
            window.crypto.getRandomValues(array);

            for (let i = 0; i < length; i++) {
                result += charset[array[i] % charset.length];
            }
        } else {
            // 降级方案
            for (let i = 0; i < length; i++) {
                result += charset[Math.floor(Math.random() * charset.length)];
            }
        }

        return result;
    }

    // CSP内容安全策略检查
    static checkCSP() {
        const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (metaCSP) {
            console.log('CSP Meta标签:', metaCSP.getAttribute('content'));
        }

        // 检查通过HTTP头设置的CSP
        // 注意：JavaScript无法直接读取HTTP头，需要服务器配合
    }
}

// 使用安全工具
console.log('当前源:', SecurityUtils.getCurrentOrigin());
console.log('URL安全检查:', SecurityUtils.isSecureURL('https://example.com'));

const userInput = '<script>alert("XSS")</script>';
console.log('转义后的HTML:', SecurityUtils.escapeHTML(userInput));
console.log('清理后的输入:', SecurityUtils.sanitizeInput(userInput));
```

### 2. 加密和数据保护

```javascript
// 基础加密工具
class CryptoUtils {
    // Base64编码
    static base64Encode(str) {
        try {
            return btoa(unescape(encodeURIComponent(str)));
        } catch (error) {
            console.error('Base64编码失败:', error);
            return null;
        }
    }

    // Base64解码
    static base64Decode(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (error) {
            console.error('Base64解码失败:', error);
            return null;
        }
    }

    // 生成哈希（使用Web Crypto API）
    static async hash(data, algorithm = 'SHA-256') {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('浏览器不支持Web Crypto API');
        }

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        const hashBuffer = await window.crypto.subtle.digest(algorithm, dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
    }

    // 生成随机盐值
    static generateSalt(length = 16) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 密码哈希（加盐）
    static async hashPassword(password, salt = null) {
        if (!salt) {
            salt = this.generateSalt();
        }

        const saltedPassword = password + salt;
        const hash = await this.hash(saltedPassword);

        return {
            hash,
            salt,
            algorithm: 'SHA-256'
        };
    }

    // 验证密码
    static async verifyPassword(password, hashedPassword, salt) {
        const { hash: computedHash } = await this.hashPassword(password, salt);
        return computedHash === hashedPassword;
    }

    // 生成JWT Token（简化版，实际应用中应使用专门的库）
    static generateJWT(payload, secret, expiresIn = '1h') {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const now = Date.now();
        const expirationTime = this.parseExpiration(expiresIn);

        const tokenPayload = {
            ...payload,
            iat: Math.floor(now / 1000),
            exp: Math.floor((now + expirationTime) / 1000)
        };

        const encodedHeader = this.base64Encode(JSON.stringify(header));
        const encodedPayload = this.base64Encode(JSON.stringify(tokenPayload));

        const signature = this.base64Encode(
            `${encodedHeader}.${encodedPayload}.${secret}`
        );

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    // 解析过期时间
    static parseExpiration(expiresIn) {
        const units = {
            's': 1000,
            'm': 60 * 1000,
            'h': 60 * 60 * 1000,
            'd': 24 * 60 * 60 * 1000
        };

        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (match) {
            const [, value, unit] = match;
            return parseInt(value) * units[unit];
        }

        return 60 * 60 * 1000; // 默认1小时
    }

    // 安全存储敏感数据
    static secureStore(key, data, password) {
        try {
            // 简化的加密存储（实际应用中应使用更强的加密算法）
            const encrypted = this.base64Encode(JSON.stringify(data));
            const salt = this.generateSalt();

            const storageData = {
                data: encrypted,
                salt: salt,
                timestamp: Date.now()
            };

            localStorage.setItem(key, JSON.stringify(storageData));
            return true;
        } catch (error) {
            console.error('安全存储失败:', error);
            return false;
        }
    }

    // 安全读取敏感数据
    static secureRetrieve(key, password) {
        try {
            const storageData = JSON.parse(localStorage.getItem(key));
            if (!storageData) return null;

            const decrypted = JSON.parse(this.base64Decode(storageData.data));
            return decrypted;
        } catch (error) {
            console.error('安全读取失败:', error);
            return null;
        }
    }
}

// 使用加密工具
async function demonstrateCrypto() {
    // Base64编码/解码
    const message = 'Hello, World!';
    const encoded = CryptoUtils.base64Encode(message);
    const decoded = CryptoUtils.base64Decode(encoded);

    console.log('Base64编码:', encoded);
    console.log('Base64解码:', decoded);

    // 密码哈希
    const password = 'userPassword123';
    const passwordHash = await CryptoUtils.hashPassword(password);
    console.log('密码哈希:', passwordHash);

    // 验证密码
    const isValid = await CryptoUtils.verifyPassword(password, passwordHash.hash, passwordHash.salt);
    console.log('密码验证:', isValid);

    // 生成JWT
    const token = CryptoUtils.generateJWT(
        { userId: 123, role: 'admin' },
        'secret-key',
        '24h'
    );
    console.log('JWT Token:', token);
}
```

## 📝 最佳实践

### 1. 存储策略选择

```javascript
// 存储选择指南
class StorageStrategy {
    // 根据数据类型选择合适的存储方式
    static chooseStorageType(data) {
        const options = {
            // 用户设置 - localStorage
            userSettings: {
                type: 'localStorage',
                encrypt: false,
                compress: false,
                ttl: null
            },

            // 临时状态 - sessionStorage
            temporaryState: {
                type: 'sessionStorage',
                encrypt: false,
                compress: false,
                ttl: null
            },

            // 敏感信息 - IndexedDB（加密）
            sensitiveData: {
                type: 'indexedDB',
                encrypt: true,
                compress: true,
                ttl: 7 * 24 * 60 * 60 * 1000 // 7天
            },

            // 大型数据 - IndexedDB
            largeData: {
                type: 'indexedDB',
                encrypt: false,
                compress: true,
                ttl: null
            },

            // 服务器同步数据 - localStorage + 同步队列
            syncData: {
                type: 'localStorage',
                encrypt: false,
                compress: false,
                syncToServer: true,
                ttl: null
            }
        };

        return options;
    }

    // 数据清理策略
    static cleanupStrategy() {
        return {
            // 会话结束时清理
            sessionEnd: ['currentPage', 'formDraft', 'tempData'],

            // 定期清理（如每天）
            daily: ['cache_*', 'logs_*'],

            // 版本更新时清理
            versionUpdate: ['oldFormat_*'],

            // 手动清理
            manual: ['userSettings', 'preferences']
        };
    }
}
```

### 2. 性能优化

```javascript
// 存储性能优化
class StorageOptimizer {
    constructor() {
        this.cache = new Map();
        this.writeQueue = [];
        this.isProcessingQueue = false;
    }

    // 批量写入优化
    queueWrite(key, value) {
        this.writeQueue.push({ key, value, timestamp: Date.now() });

        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    async processQueue() {
        this.isProcessingQueue = true;

        // 使用requestIdleCallback在浏览器空闲时处理
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.flushQueue());
        } else {
            setTimeout(() => this.flushQueue(), 0);
        }
    }

    flushQueue() {
        if (this.writeQueue.length === 0) {
            this.isProcessingQueue = false;
            return;
        }

        // 批量处理队列中的写入操作
        const batch = this.writeQueue.splice(0, 10); // 每次处理10个

        batch.forEach(({ key, value }) => {
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                console.error('写入失败:', key, error);
            }
        });

        // 继续处理剩余队列
        if (this.writeQueue.length > 0) {
            setTimeout(() => this.flushQueue(), 100);
        } else {
            this.isProcessingQueue = false;
        }
    }

    // 内存缓存优化
    getCached(key) {
        if (this.cache.has(key)) {
            const item = this.cache.get(key);
            if (Date.now() - item.timestamp < 60000) { // 1分钟缓存
                return item.value;
            } else {
                this.cache.delete(key);
            }
        }

        // 从存储中读取并缓存
        const value = localStorage.getItem(key);
        if (value !== null) {
            this.cache.set(key, {
                value,
                timestamp: Date.now()
            });
        }

        return value;
    }

    // 压缩数据（简单实现）
    compress(data) {
        // 这里可以实现真正的压缩算法
        // 简单示例：移除多余的空格
        return typeof data === 'string' ? data.replace(/\s+/g, ' ').trim() : data;
    }

    // 清理缓存
    clearCache() {
        this.cache.clear();
    }
}
```

## 🎯 小结

- 掌握了Web存储的三种方式：localStorage、sessionStorage和Cookie
- 学会了使用IndexedDB进行复杂数据存储
- 理解了浏览器常用API的使用方法
- 了解了浏览器安全机制和同源策略
- 学会了数据加密和安全存储的基本方法
- 掌握了存储策略选择和性能优化的最佳实践

Web存储和浏览器API为前端开发提供了强大的本地存储和设备交互能力，合理使用这些API可以大大提升用户体验和应用性能。

---

**下一步学习**：[前端工具链与构建](../07-前端工具链/01-npm包管理.md)
