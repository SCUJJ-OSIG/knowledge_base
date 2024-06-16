1. 开启终端，此时首先需要更新系统的软件仓库（apt仓库）
   
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. 使用`apt`安装Redis
   
   ```bash
   sudo apt install redis-server -y
   ```
   
   待全部执行完毕，若无任何报错，及安装成功。

3. 检查Redis是否安装成功，检查Redis版本。
   
   ```bash
   redis-cli --version
   ```
   
   ![image-20231101095404040](https://gitee.com/taknife/images-note/raw/master/imgs/image-20231101095404040.png)
   
   `redis-cli`可直接进入redis客户端交互视图。

1. 检查Redis服务运行状态。
   
   ```bash
   sudo systemctl status redis-server
   ```

2. 启动

```bash
sudo systemctl start redis-server
```

3. 自启动 --同时需要关注Loaded中，是否为自启动，及状态为enable，若为disenable，则需要开启自启动。

```bash
sudo systemctl enable redis-server
```

Redis默认配置文件路径为`/etc/redis/redis.conf`

在Ubuntu中修改Redis配置文件需要提权

```bash
sudo vim /etc/redis/redis.conf
```

4. 重启  在完成Redis配置文件修改后，需要重启Redis服务，来使配置文件生效

```bash
sudo systemctl restart redis-server
```

#### 一、配置文件

## 1. 设置redis密码

Redis默认配置文件路径为`/etc/redis/redis.conf`

在Ubuntu中修改Redis配置文件需要提权

```bash
sudo vim /etc/redis/redis.conf
```

### 1.修改配置文件：

```bash
sudo vim /etc/redis/redis.conf
```

### 2.设置密码认证

- 找到`# requirepass XXXXXX`

- 改为`requirepass admin.123`

- 重启：`sudo systemctl restart redis-server`

### 3. 配置远程登录

找到 `bind` 参数，修改`bind`参数后内容

注释# 

127.0.0.1

# 二、开放端口

- 如果使用的是电脑，确保防火墙开放了redis的默认端口6379，开放命令为：`sudo ufw allow 6379/tcp`
- 如果使用的是云服务器，确保规则组里开放了6379端口
