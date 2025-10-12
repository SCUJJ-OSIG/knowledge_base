# Promise深度解析

## 📋 学习目标
- 深入理解Promise的核心概念和状态机制
- 掌握Promise的各种方法和使用技巧
- 学会处理复杂的异步操作场景
- 理解Promise的执行顺序和错误处理机制

## 🎯 Promise基础概念

### 1. 什么是Promise？

Promise是JavaScript中处理异步操作的对象，代表了一个异步操作的最终完成或失败。Promise有三种状态：

```javascript
// Promise的三种状态
const PENDING = 'pending';     // 进行中
const FULFILLED = 'fulfilled'; // 已成功
const REJECTED = 'rejected';   // 已失败
```

### 2. Promise的基本语法

```javascript
// 创建Promise实例
const promise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve('操作成功！'); // 成功时调用
        } else {
            reject('操作失败！');  // 失败时调用
        }
    }, 1000);
});

// 使用Promise
promise
    .then(result => {
        console.log('成功:', result);
    })
    .catch(error => {
        console.log('失败:', error);
    })
    .finally(() => {
        console.log('操作完成');
    });
```

### 3. Promise状态特点

```javascript
// Promise状态一旦改变就不可逆
const promise = new Promise((resolve, reject) => {
    resolve('成功');
    reject('失败'); // 这行不会执行，因为状态已经改变
});

// Promise立即执行
console.log('开始');
const p = new Promise((resolve) => {
    console.log('Promise内部');
    resolve('完成');
});
console.log('结束');
// 输出：开始 -> Promise内部 -> 结束
```

## 🔧 Promise方法详解

### 1. then() - 处理成功状态

```javascript
// 基础用法
const promise = Promise.resolve('成功数据');

promise.then(
    value => {
        console.log('成功回调:', value); // '成功数据'
    },
    error => {
        console.log('失败回调:', error);
    }
);

// 推荐用法：只处理成功，用catch处理失败
promise.then(value => {
    console.log('成功:', value);
}).catch(error => {
    console.log('失败:', error);
});

// 链式调用
promise
    .then(value => {
        console.log('第一步:', value);
        return value + ' -> 第二步';
    })
    .then(value => {
        console.log('第二步:', value);
        return value + ' -> 第三步';
    })
    .then(value => {
        console.log('最终结果:', value);
    });
```

### 2. catch() - 处理失败状态

```javascript
const promise = new Promise((resolve, reject) => {
    reject('出错了！');
});

// 捕获错误
promise.catch(error => {
    console.log('捕获错误:', error); // '出错了！'
});

// 错误冒泡
promise
    .then(value => {
        console.log('这里不会执行');
    })
    .then(value => {
        console.log('这里也不会执行');
    })
    .catch(error => {
        console.log('错误会被传播到这里:', error);
    });

// then中的错误也会被catch捕获
Promise.resolve()
    .then(() => {
        throw new Error('then中抛出的错误');
    })
    .catch(error => {
        console.log('捕获到错误:', error.message);
    });
```

### 3. finally() - 无论成功失败都执行

```javascript
const promise = new Promise((resolve, reject) => {
    const success = Math.random() > 0.5;
    if (success) {
        resolve('成功');
    } else {
        reject('失败');
    }
});

promise
    .then(result => {
        console.log('处理结果:', result);
    })
    .catch(error => {
        console.log('处理错误:', error);
    })
    .finally(() => {
        console.log('清理工作');
        // 适用于：关闭loading、释放资源等
    });

// finally不接收参数，返回值会被忽略
Promise.resolve(1)
    .finally(() => {
        return 2; // 这个返回值会被忽略
    })
    .then(value => {
        console.log(value); // 1 (不是2)
    });
```

### 4. Promise.resolve() - 创建成功的Promise

```javascript
// 创建已成功的Promise
Promise.resolve('成功数据').then(console.log); // '成功数据'

// 参数是Promise时，直接返回
const p1 = Promise.resolve('p1');
const p2 = Promise.resolve(p1);
console.log(p1 === p2); // true

// 参数是thenable对象
const thenable = {
    then(resolve) {
        resolve('thenable对象');
    }
};
Promise.resolve(thenable).then(console.log); // 'thenable对象'

// 传入其他值
Promise.resolve(42).then(console.log); // 42
Promise.resolve({ name: '对象' }).then(console.log); // { name: '对象' }
```

### 5. Promise.reject() - 创建失败的Promise

```javascript
// 创建已失败的Promise
Promise.reject('失败原因').catch(console.log); // '失败原因'

// 参数是Promise时，不会解包
const p1 = Promise.resolve('成功');
const p2 = Promise.reject(p1);
p2.catch(error => {
    console.log(error === p1); // true
});
```

### 6. Promise.all() - 并行执行，全部成功才成功

```javascript
// 所有Promise都成功
const p1 = Promise.resolve('p1');
const p2 = Promise.resolve('p2');
const p3 = Promise.resolve('p3');

Promise.all([p1, p2, p3]).then(results => {
    console.log(results); // ['p1', 'p2', 'p3']
});

// 异步操作示例
function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });
}

Promise.all([
    delay(1000, '第一个'),
    delay(2000, '第二个'),
    delay(3000, '第三个')
]).then(results => {
    console.log('全部完成:', results); // 3秒后输出
});

// 有一个失败就立即失败
const failPromise = Promise.reject('失败');
Promise.all([p1, p2, failPromise, p3]).catch(error => {
    console.log('有任务失败:', error); // '失败'
});

// 实际应用：并行请求数据
async function fetchUserData() {
    try {
        const [userInfo, posts, comments] = await Promise.all([
            fetch('/api/user'),
            fetch('/api/posts'),
            fetch('/api/comments')
        ]);

        return {
            user: await userInfo.json(),
            posts: await posts.json(),
            comments: await comments.json()
        };
    } catch (error) {
        console.error('数据加载失败:', error);
    }
}
```

### 7. Promise.race() - 竞速，第一个完成的结果

```javascript
// 第一个完成的Promise的结果
const p1 = new Promise(resolve => setTimeout(() => resolve('p1完成'), 1000));
const p2 = new Promise(resolve => setTimeout(() => resolve('p2完成'), 2000));
const p3 = new Promise(resolve => setTimeout(() => resolve('p3完成'), 3000));

Promise.race([p1, p2, p3]).then(result => {
    console.log(result); // 'p1完成' (1秒后)
});

// 失败的情况
const failFast = Promise.reject('快速失败');
Promise.race([p1, failFast, p2]).catch(error => {
    console.log(error); // '快速失败' (立即)
});

// 实际应用：超时控制
function withTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('操作超时')), timeout);
    });

    return Promise.race([promise, timeoutPromise]);
}

// 使用示例
const slowRequest = new Promise(resolve =>
    setTimeout(() => resolve('请求完成'), 2000)
);

withTimeout(slowRequest, 1000)
    .then(result => console.log(result))
    .catch(error => console.log(error.message)); // '操作超时'
```

### 8. Promise.allSettled() - 等待所有Promise完成

```javascript
// 不管成功失败，都返回结果
const promises = [
    Promise.resolve('成功1'),
    Promise.reject('失败1'),
    Promise.resolve('成功2'),
    Promise.reject('失败2')
];

Promise.allSettled(promises).then(results => {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Promise ${index + 1} 成功:`, result.value);
        } else {
            console.log(`Promise ${index + 1} 失败:`, result.reason);
        }
    });
});

// 实际应用：批量操作，不希望一个失败影响全部
async function uploadFiles(files) {
    const uploadPromises = files.map(file => uploadFile(file));

    const results = await Promise.allSettled(uploadPromises);

    const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

    const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

    return { successful, failed };
}
```

### 9. Promise.any() - 任一成功即成功

```javascript
// 第一个成功的Promise的结果
const promises = [
    Promise.reject('失败1'),
    Promise.reject('失败2'),
    Promise.resolve('成功1'),
    Promise.resolve('成功2')
];

Promise.any(promises).then(result => {
    console.log(result); // '成功1'
}).catch(error => {
    // 所有都失败时才进入catch
    console.log('所有Promise都失败了:', error);
});

// 错误对象包含所有失败信息
Promise.all([Promise.reject('错误1'), Promise.reject('错误2')])
    .then(() => {})
    .catch(error => {
        console.log(error instanceof AggregateError); // true
        console.log(error.errors); // ['错误1', '错误2']
    });
```

## 🚀 高级应用

### 1. Promise序列化执行

```javascript
// 顺序执行异步操作
const tasks = [
    () => delay(1000, '任务1'),
    () => delay(2000, '任务2'),
    () => delay(1500, '任务3')
];

// 方法1：使用reduce
async function executeSequentially(tasks) {
    const results = [];

    for (const task of tasks) {
        const result = await task();
        results.push(result);
    }

    return results;
}

// 方法2：使用async/await
async function executeSequentially2(tasks) {
    return await tasks.reduce(async (previousPromise, currentTask) => {
        const results = await previousPromise;
        const result = await currentTask();
        return [...results, result];
    }, Promise.resolve([]));
}

// 执行
executeSequentially(tasks).then(console.log);
// 1秒后：['任务1'] -> 3秒后：['任务1', '任务2'] -> 4.5秒后：['任务1', '任务2', '任务3']
```

### 2. Promise重试机制

```javascript
// 重试失败的Promise
function retry(promiseFn, times = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        function tryAgain() {
            attempt++;

            promiseFn()
                .then(resolve)
                .catch(error => {
                    if (attempt < times) {
                        console.log(`第${attempt}次尝试失败，${delay}ms后重试`);
                        setTimeout(tryAgain, delay);
                    } else {
                        reject(error);
                    }
                });
        }

        tryAgain();
    });
}

// 使用示例
function unstableRequest() {
    return new Promise((resolve, reject) => {
        const success = Math.random() > 0.7;
        if (success) {
            resolve('请求成功');
        } else {
            reject('请求失败');
        }
    });
}

retry(unstableRequest, 5, 1000)
    .then(console.log)
    .catch(console.error);
```

### 3. Promise缓存

```javascript
// Promise结果缓存
function memoizePromise(promiseFn) {
    const cache = new Map();

    return async function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const promise = promiseFn.apply(this, args)
            .then(result => {
                cache.set(key, Promise.resolve(result));
                return result;
            })
            .catch(error => {
                cache.delete(key); // 失败时不缓存
                throw error;
            });

        cache.set(key, promise);
        return promise;
    };
}

// 使用示例
const cachedFetch = memoizePromise(url =>
    fetch(url).then(res => res.json())
);

// 第一次请求
cachedFetch('/api/data').then(data1 => {
    console.log('第一次请求:', data1);

    // 第二次请求（从缓存获取）
    cachedFetch('/api/data').then(data2 => {
        console.log('第二次请求:', data2); // 相同的数据，立即返回
    });
});
```

### 4. Promise超时控制

```javascript
// Promise超时控制
function withTimeout(promise, timeout, errorMessage = '操作超时') {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(errorMessage)), timeout);
        })
    ]);
}

// 可取消的Promise
function makeCancelable(promise) {
    let isCanceled = false;
    let cancelPromise = new Promise((_, reject) => {
        const cancel = () => {
            isCanceled = true;
            reject(new Error('操作已取消'));
        };

        promise.catch(() => {}); // 防止未处理的错误

        return cancel;
    });

    const wrappedPromise = Promise.race([
        promise,
        cancelPromise
    ]);

    return {
        promise: wrappedPromise,
        cancel: cancelPromise
    };
}

// 使用示例
const { promise, cancel } = makeCancelable(
    delay(5000, '长时间操作')
);

promise
    .then(console.log)
    .catch(error => console.log(error.message));

// 2秒后取消
setTimeout(() => cancel(), 2000);
```

## ⚠️ 常见陷阱

### 1. 未处理的Promise拒绝

```javascript
// ❌ 未处理的Promise拒绝
Promise.reject('错误'); // 控制台会警告

// ✅ 正确处理
Promise.reject('错误').catch(() => {
    // 处理错误
});

// 全局处理未捕获的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.log('未处理的Promise拒绝:', reason);
});

// 浏览器中
window.addEventListener('unhandledrejection', event => {
    console.log('未处理的Promise拒绝:', event.reason);
    event.preventDefault(); // 防止控制台警告
});
```

### 2. Promise构造函数陷阱

```javascript
// ❌ 在Promise构造函数中抛出同步错误
new Promise(() => {
    throw new Error('同步错误'); // 会被Promise捕获
}).catch(error => {
    console.log('捕获到错误:', error.message);
});

// ❌ Promise构造函数中的return无效
new Promise((resolve) => {
    return '返回值'; // 无效
    resolve('成功'); // 才会改变状态
});

// ✅ 正确用法
new Promise((resolve, reject) => {
    if (condition) {
        resolve('成功');
    } else {
        reject('失败');
    }
});
```

### 3. 链式调用中的this问题

```javascript
// ❌ 在then中丢失this
class Timer {
    constructor() {
        this.count = 0;
    }

    start() {
        Promise.resolve()
            .then(() => {
                this.count++; // this可能丢失
            });
    }
}

// ✅ 解决方案1：箭头函数
class Timer2 {
    constructor() {
        this.count = 0;
    }

    start() {
        Promise.resolve()
            .then(() => {
                this.count++;
            });
    }
}

// ✅ 解决方案2：绑定this
class Timer3 {
    constructor() {
        this.count = 0;
    }

    start() {
        Promise.resolve()
            .then(function() {
                this.count++;
            }.bind(this));
    }
}
```

## 📝 最佳实践

1. **优先使用async/await**：代码更清晰易读
2. **正确处理错误**：总是使用catch或try/catch
3. **避免Promise嵌套**：使用链式调用
4. **合理使用Promise.all**：并行处理独立操作
5. **设置超时**：避免长时间等待

## 🎯 小结

- 深入理解了Promise的核心概念和状态机制
- 掌握了Promise的各种方法和使用技巧
- 学会了处理复杂的异步操作场景
- 理解了Promise的执行顺序和错误处理机制
- 掌握了Promise的高级应用和最佳实践

---

**下一步学习**：[this指向全面理解](02-this指向全面理解.md)