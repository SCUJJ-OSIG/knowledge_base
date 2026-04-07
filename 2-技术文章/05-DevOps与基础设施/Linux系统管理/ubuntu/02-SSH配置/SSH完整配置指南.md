

## 📋 目录
1. [SSH免密登录](#ssh免密登录)
2. [Ubuntu Root用户登录](#ubuntu-root用户登录)
3. [SSH密钥用于GitHub Actions](#ssh密钥用于github-actions)
4. [常见问题排查](#常见问题排查)

---


## 基础知识

### 1. 什么是SSH免密登录
SSH 密钥对由**私钥（private key）**和**公钥（public key）**组成：

- **私钥**必须**严格保密**，保存在你的本地电脑（如 `~/.ssh/id_rsa`  win用户，在c盘/用户名/.ssh/id_rsa），它是你身份的唯一凭证。
- **公钥**可以**安全地分享**给任何你想登录的服务器，通常放在服务器的 `~/.ssh/authorized_keys` 文件中。

当你通过 SSH 连接服务器时：

1. 服务器会用你提供的公钥**生成一个加密挑战**；
2. 你的 SSH 客户端使用本地**私钥解密并响应**；
3. 服务器验证响应正确，就允许你登录。

因此，只要你的私钥安全，且公钥已部署到服务器，就可以实现**免密码登录**。


### 2. 生成ssh密钥

   ```bash
 
#rsa 
ssh-keygen -t rsa -C "your-email@example.com"
  
  
#推荐使用更安全的算法（而不是 RSA）：
ssh-keygen -t ed25519 -C "your-email@example.com"
 
# -t: 指定密钥的类型。在这里，`rsa` 表示我们将生成一个RSA类型的密钥对。
# -rsa: 随 `-t` 之后，指定实际的密钥类型名称。RSA是目前较为常用的一种密钥类型，尽管Ed25519因为其更强的安全性而逐渐变得流行。
 
   ```
   > `ed25519` 比 `rsa` 更安全、更短、更快。



### 3. 如何把我们生成的公钥传到服务器呢？


1. 方法一：Linux/Mac 下使用 ssh-copy-id
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@123.45.67.89

# -i：指定公钥文件
#`ssh-copy-id`命令 可以把本地主机的公钥复制到远程主机的`authorized_keys`文件上
```

2. 方法二：Windows 

```bash
# 如果服务器已有.ssh目录
cat ~/.ssh/id_rsa.pub | ssh user@123.45.67.89 "cat >> ~/.ssh/authorized_keys"

# 如果服务器没有.ssh目录，先创建
cat ~/.ssh/id_rsa.pub | ssh user@123.45.56.78 "mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys"
```


### 4. 讲解 `/etc/ssh/sshd_config`配置

#### 1. **登录控制**
> prohibit-password  **允许 root 登录，但仅限使用 SSH 密钥认证** ,禁止使用密码

| 配置项                      | 默认值                        | 推荐值                        | 说明             |
| ------------------------ | -------------------------- | -------------------------- | -------------- |
| `PermitRootLogin`        | `prohibit-password` 或 `no` | `no` 或 `prohibit-password` | 是否允许 root 登录。  |
| `PasswordAuthentication` | `yes`                      | `no`（配合密钥）                 | 是否允许密码登录       |
| `PubkeyAuthentication`   | `yes`                      | `yes`                      | 是否允许公钥认证（密钥登录） |
| `AuthorizedKeysFile`     | `.ssh/authorized_keys`     | 默认即可                       | 公钥存放路径         |

✅ **安全组合**：
```conf
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

---

#### 2. **用户与组限制**
| 配置项           | 示例                            | 说明            |     |
| ------------- | ----------------------------- | ------------- | --- |
| `AllowUsers`  | `AllowUsers alice bob deploy` | **只允许**这些用户登录 |     |
| `DenyUsers`   | `DenyUsers root guest`        | **禁止**这些用户登录  |     |
| `AllowGroups` | `AllowGroups ssh-users`       | 只允许指定用户组登录    |     |

> 💡 用 `AllowUsers` 比 `DenyUsers` 更安全（白名单机制）

---

#### 3. **端口与网络**
| 配置项             | 默认值       | 推荐值             | 说明                   |
| --------------- | --------- | --------------- | -------------------- |
| `Port`          | `22`      | `22222` 等非标准端口  | 修改默认端口可减少自动化扫描攻击     |
| `ListenAddress` | `0.0.0.0` | `192.168.1.100` | 只监听特定 IP（如内网）        |
| `Protocol`      | `2`       | `2`             | 必须为 2（SSHv1 已废弃且不安全） |

> ⚠️ 改端口后连接命令：`ssh -p 22222 user@host`

---

#### 4. **认证与会话**
| 配置项 | 默认值 | 推荐值 | 说明 |
|--------|--------|--------|------|
| `LoginGraceTime` | `120` | `30` | 登录超时时间（秒），防止僵尸连接 |
| `MaxAuthTries` | `6` | `3` | 最大认证尝试次数，防暴力破解 |
| `ClientAliveInterval` | `0` | `300` | 服务端每隔 N 秒发心跳包 |
| `ClientAliveCountMax` | `3` | `2` | 心跳无响应几次后断开 |

---

#### 5. **日志与调试**
| 配置项 | 示例 | 说明 |
|--------|------|------|
| `LogLevel` | `INFO` / `VERBOSE` | 日志详细程度（`VERBOSE` 可记录登录 IP） |

查看日志：
```bash
sudo tail -f /var/log/auth.log      # Ubuntu/Debian
sudo tail -f /var/log/secure        # CentOS/RHEL
```

---

#### 6. **高级安全（可选）**
| 配置项 | 说明 |
|--------|------|
| `PermitEmptyPasswords` | `no`（默认）→ 禁止空密码账户登录 |
| `X11Forwarding` | `no`（除非需要图形界面） |
| `AllowTcpForwarding` | `no`（如不需要端口转发） |
| `Banner` | `/etc/issue.net` → 登录前显示警告信息 |
#### 🔍 修改后必做三件事

1. **检查语法**  
   ```bash
   sudo sshd -t
   ```
   → 无输出 = 配置正确

2. **重启服务**  
```bash
   sudo systemctl restart ssh
   ```

> 🔐 **权限要求**：
> ```bash
> chmod 700 ~/.ssh
> chmod 600 ~/.ssh/authorized_keys
> chown $USER:$USER ~/.ssh -R
> ```

---







## ubantu实践


```
1. 生成密钥
ssh-keygen -t ed25519 -C "your-email@example.com"
2.使用git 自带的bash 终端 上传公钥
ssh-copy-id -i ~\.ssh\id_ed25519.pub root@47.110.73.65
输入密码
3.打开服务器设置允许ssh登录

vim  /etc/ssh/sshd_config


PubkeyAuthentication yes
AuthorizedKeysFile  .ssh/authorized_keys .ssh/authorized_keys2
PermitRootLogin yes
PasswordAuthentication yes

即可免密登录

```



## vscode ssh 连接服务器

配置本地SSH Config（给vscode 用的）

创建或编辑 `~/.ssh/config` 文件：

```bash
Host server-name
    HostName 123.45.56.78
    User user
    IdentitiesOnly yes
    Port 22
```

保存后即可使用 `ssh server-name` 直接连接，无需输入密码。




---

## Ubuntu Root 设置允许密码登录

### 1. 设置Root密码

```bash
sudo passwd root
```

按提示输入两次密码。

### 2. 修改SSH配置

```bash
sudo nano /etc/ssh/sshd_config
sudo vim  /etc/ssh/sshd_config
```

找到并修改以下配置项：

```bash
# Authentication 部分（约30行）
PermitRootLogin yes
PasswordAuthentication yes
```

**注意：** Ubuntu 22.04系统中：
- `PermitRootLogin` 在30多行
- `PasswordAuthentication` 在文件末尾
- 注释掉38行左右的 `authentication,account processing` 部分

### 3. 重启SSH服务

```bash
sudo systemctl restart ssh
```

### 4. 验证配置

```bash
# 检查配置文件语法
/usr/sbin/sshd -t
```

如果出现错误，根据提示修正配置文件。

---



## Ubuntu Root 设置允许ssh登录

### 1. 修改SSH配置

```bash
sudo nano /etc/ssh/sshd_config
sudo vim  /etc/ssh/sshd_config
```

找到并修改以下配置项：

```bash
# Authentication 部分（约30行）
PermitRootLogin yes
PubkeyAuthentication yes
```
 

```

### 3. 重启SSH服务

```bash
sudo systemctl restart ssh
```

### 4. 验证配置

```bash
# 检查配置文件语法
/usr/sbin/sshd -t
```

如果出现错误，根据提示修正配置文件。




---




## SSH密钥用于GitHub Actions

1. 复制私钥内容：
   ```bash
   cat ~/.ssh/id_ed25519_deploy
   ```

2. 在GitHub仓库的Settings → Secrets → New secret中添加：
   - Name: `SSH_PRIVATE_KEY`
   - Value: 粘贴私钥内容

3. 在workflow中使用：

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.HOST }}
    username: ubuntu
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: whoami
```

---

### 权限问题解决

```bash
# 递归修改文件权限（临时解决方案）
chmod -R 777 目标文件

# 推荐的权限设置
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/id_rsa
```

### 相关文件链接
- [[../01-服务器运维/1.第一台服务器|服务器购买后的第一步]]
- [[../01-服务器运维/安装docker|Docker安装配置]]
- [[../03-开发环境/Node.js开发环境搭建|Node.js开发环境搭建]]