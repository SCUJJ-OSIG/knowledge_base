### `ssh-copy-id`命令简介

> 把本地的ssh[公钥](https://so.csdn.net/so/search?q=公钥&spm=1001.2101.3001.7020)文件安装到远程主机对应的账户下,`ssh-copy-id`命令 可以把本地主机的公钥复制到远程主机的`authorized_keys`文件上，`ssh-copy-id`命令也会给远程主机的用户主目录（home）和~/.ssh, 和`~/.ssh/authorized_keys`设置合适的权限。

> ssh-copy-id 命令可以把本地主机的公钥复制到远程主机的 authorized_keys 文件上。authorized_keys 文件用来验证 client 。使用 ssh-copy-id 命令将本地公钥复制到远程主机之后可以实现免密登录远程主机。

> ssh-copy-id 用来将本地公钥复制到远程主机。如果不传入 -i 参数，ssh-copy-id 使用默认 ~/.ssh/identity.pub 作为默认公钥。如果多次运行 ssh-copy-id ，该命令不会检查重复，会在远程主机中多次写入 authorized_keys 。

> 使用 ssh-copy-id 的主要功能就是免密码登录远程主机。成功运行该命令之后，就可以免去密码登录远程主机。

> 注意本地 ~/.ssh/id_rsa 的权限，chmod 400 ~/.ssh/id_rsa ，该文件包含用于授权的私钥，如果该文件可以被其他用户访问，ssh 会忽略该私钥。

### 命令语法

```bash
ssh-copy-id [-i [identity_file]] [user@]machine
1
```

### 命令选项

- -i：指定公钥文件

把本地的ssh公钥文件安装到远程主机对应的账户下

```shell
 ssh-copy-id -i ~/.ssh/id_rsa.pub user@server
```