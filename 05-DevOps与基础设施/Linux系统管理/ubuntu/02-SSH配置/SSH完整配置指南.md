# SSH 完整配置指南

## 📋 目录
1. [SSH免密登录](#ssh免密登录)
2. [Ubuntu Root用户登录](#ubuntu-root用户登录)
3. [SSH密钥用于GitHub Actions](#ssh密钥用于github-actions)
4. [常见问题排查](#常见问题排查)

---

## SSH免密登录

### 方法一：Linux/Mac 下使用 ssh-copy-id

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@123.45.67.89
```

### 方法二：Windows 下手动配置

#### 1. 生成SSH密钥对

```bash
ssh-keygen -t rsa -C "your-email@example.com"
```

一路回车，密钥对生成完成。

#### 2. 将公钥上传到服务器

```bash
# 如果服务器已有.ssh目录
cat ~/.ssh/id_rsa.pub | ssh user@123.45.67.89 "cat >> ~/.ssh/authorized_keys"

# 如果服务器没有.ssh目录，先创建
cat ~/.ssh/id_rsa.pub | ssh user@123.45.56.78 "mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys"
```

#### 3. 配置本地SSH Config

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

## Ubuntu Root用户登录

### 1. 设置Root密码

```bash
sudo passwd root
```

按提示输入两次密码。

### 2. 修改SSH配置

```bash
sudo nano /etc/ssh/sshd_config
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

## SSH密钥用于GitHub Actions

### 1. 生成专用密钥对

```bash
# macOS/Linux
ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/id_ed25519_deploy

# Windows PowerShell
ssh-keygen -t ed25519 -C "deploy-key" -f "$env:USERPROFILE\.ssh\id_ed25519_deploy"
```

- 不要设置passphrase（直接回车）
- 生成文件：
  - 私钥：`id_ed25519_deploy`
  - 公钥：`id_ed25519_deploy.pub`

### 2. 将公钥上传到服务器

#### 方法A：控制台手动粘贴（推荐）

```bash
# 切换到用户（如ubuntu）
su - ubuntu

# 创建.ssh目录
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 编辑authorized_keys
nano ~/.ssh/authorized_keys
```

粘贴公钥内容后设置权限：

```bash
chmod 600 ~/.ssh/authorized_keys
```

#### 方法B：使用scp上传

```bash
scp -i ... ~/.ssh/id_ed25519_deploy.pub ubuntu@ip:~/.ssh/authorized_keys
```

### 3. 配置GitHub Actions

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

## 常见问题排查

| 问题现象 | 可能原因 | 解决方案 |
|---------|---------|---------|
| `Permission denied (publickey)` | 公钥未正确放入authorized_keys | 检查公钥内容、权限设置为600 |
| `Connection refused` | SSH服务未运行或防火墙拦截 | 检查SSH服务状态和防火墙设置 |
| 登录后立即断开 | 用户shell被破坏 | 检查`/etc/passwd`中用户的shell是否为`/bin/bash` |
| 配置文件语法错误 | sshd_config格式问题 | 使用`sshd -t`检查并修正 |

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