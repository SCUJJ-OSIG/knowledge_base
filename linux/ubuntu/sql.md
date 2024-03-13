Ubuntu和MySQL默认版本对照
以下是一个以表格形式列出了不同Ubuntu版本和它们通常默认安装的MySQL版本：

| Ubuntu 版本      | 默认 MySQL 版本 |
| ---------------- | --------------- |
| Ubuntu 22.04 LTS | MySQL 8.0       |
| Ubuntu 20.04 LTS | MySQL 8.0       |
| Ubuntu 18.04 LTS | MySQL 5.7       |
| Ubuntu 16.04 LTS | MySQL 5.7       |
| Ubuntu 14.04 LTS | MySQL 5.5       |
| Ubuntu 12.04 LTS | MySQL 5.5       |






### 一：查看系统版本：

在Ubuntu系统中，查看当前系统版本的常用方法有几种：

1. **使用 `lsb_release -a`命令** ： 打开终端（Terminal）并输入以下命令：


```code
lsb_release -a
```

   这个命令将会输出详细的系统版本信息，包括发行版ID、描述、发行版本号、代号以及CODENAME等。

   示例输出：

```code
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.6 LTS
Release:        20.04
Codename:       focal
```

2.**使用 `cat /etc/issue`或 `cat /etc/os-release`命令** ： 这两个命令可以帮助获取关于操作系统的简短版本信息。

```
cat /etc/issue
```

   或

```
cat /etc/os-release
```

   输出可能会包含Ubuntu版本的基本信息。


#### **内核信息**

**使用 `uname -a`命令** ： 虽然这个命令主要用来查看内核信息，但它也会显示部分系统版本信息。

```
uname -a
```

   示例输出的一部分可能包含内核版本和发行版信息。





在线安装MySQL
步骤1：更新软件包列表
在进行任何软件安装之前，请确保你的系统的软件包列表是最新的。打开终端并运行以下命令：

sudo apt update
1
步骤2：安装MySQL服务器
在更新软件包列表后，这里我们可以查看一下可使用的MySQL安装包：

# 查看可使用的安装包

sudo apt search mysql-server
1
2

接下来可以使用以下命令安装MySQL服务器：

# 安装最新版本

sudo apt install -y mysql-server

# 安装指定版本

sudo apt install -y mysql-server-8.0
1
2
3
4
如果不加-y 会在安装过程中，系统将提示你设置MySQL的root密码。确保密码足够强，且记住它，因为你将在以后需要用到它。

步骤3：启动MySQL服务
安装完成后，MySQL服务会自动启动，未启动则使用以下命令启动MySQL服务：

sudo systemctl start mysql
1
并将MySQL设置为开机自启动：

sudo systemctl enable mysql
1
步骤4：检查MySQL状态
你可以使用以下命令来检查MySQL是否正在运行：

sudo systemctl status mysql
1

至此，你已经成功在线安装了MySQL服务器。

步骤5：修改密码、权限
默认安装是没有设置密码的，需要我们自己设置密码。

# 登录mysql，在默认安装时如果没有让我们设置密码，则直接回车就能登录成功。

mysql -uroot -p

# 设置密码 mysql8.0

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';

# 设置密码 mysql5.7

set password=password('新密码');

# 配置IP 5.7

grant all privileges on *.* to root@"%" identified by "密码";

# 刷新缓存

flush privileges;
1
2
3
4
5
6
7
8
9
10
注意：配置8.0版本参考：我这里通过这种方式没有实现所有IP都能访问；我是通过直接修改配置文件才实现的，MySQL8.0版本把配置文件 my.cnf 拆分成mysql.cnf 和mysqld.cnf，我们需要修改的是mysqld.cnf文件：

sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
1
修改 bind-address，保存后重启MySQL即可。

bind-address            = 0.0.0.0
1
重启MySQL重新加载一下配置：

sudo systemctl restart mysql






### 1、编辑mysqld.cnf文件

mysqld.cnf 文件在目录‘/etc/mysql/mysql.conf.d/’中，

```bash
cd /etc/mysql/mysql.conf.d/
sudo vi mysqld.cnf
```


输入i进入vi编辑模式。
在文件中找到 [mysqld] 下面的 skip-external-locking 一行，在此行下面增加一行 skip-grant-tables
例如：

[mysqld]
...
...
skip-external-locking
skip-grant-tables





### 重启mysql服务：

```bash
sudo service mysql restart
```
