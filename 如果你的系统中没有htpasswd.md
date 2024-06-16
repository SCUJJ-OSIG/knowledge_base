### 1. 基于用户名和密码的HTTP基本认证

要在Tinyproxy中启用基于用户名和密码的认证，你需要在配置文件中加入`BasicAuth`和`BasicAuthUserFile`指令。首先，生成一个用于存储用户名和密码的文件，例如使用`htpasswd`工具：

Bash

```
1sudo apt-get install apache2-utils  # 如果你的系统中没有htpasswd
2htpasswd -c /etc/tinyproxy/htpasswd username
```

上述命令会创建一个名为`htpasswd`的文件，并添加一个名为`username`的用户，之后你可以通过重复执行不带`-c`参数的命令来添加更多用户。

接着，在Tinyproxy的配置文件中加入以下内容：

Plaintext

```
1# 启用基本认证
2BasicAuth Yes
3# 指定认证用户文件路径
4BasicAuthUserFile /etc/tinyproxy/htpasswd
```

安装步骤，配置文件，启动：

```
wget https://github.com/tinyproxy/tinyproxy/releases/download/1.11.1/tinyproxy-1.11.1.tar.gz
tar xvpf tinyproxy-1.11.1.tar.gz
cd tinyproxy-1.11.1
/autogen.sh
./configure --prefix=/usr/local/tinyproxy
make
make install
执行后会产生可执行程序：usr/local/bin/tinyproxy
A配置文件：/usr/local/etc/tinyproxy/tinyproxy.conf
新建文件Ietc/profile.d//tinyproxy.sh
export PATH-SPATH:/usr/local/tinyproxy/bin/
执行
source /etc/profile命令，把tinyproxy添加到SPATH路径，服务器重启后依然生效。
4配置文件做置在/etc目录
mv /usr/local/tinyproxy/etc/tinyproxy/tinyproxy.conf /etc/tinyproxy.conf
修改配置文件：
修改用户为root用户和root组
注釋掉alow127.0.0.1
修改输出地址：LogFile"usr/local/share/tinyproxy/tinyproxy.log
启动
tinyproxy -c /etc/tinyproxy.confwget https://github.com/tinyproxy/tinyproxy/releases/download/1.11.1/tinyproxy-1.11.1.tar.gz
tar xvpf tinyproxy-1.11.1.tar.gz
cd tinyproxy-1.11.1
/autogen.sh
./configure --prefix=/usr/local/tinyproxy
make
make install
执行后会产生可执行程序：usr/local/bin/tinyproxy
A配置文件：/usr/local/etc/tinyproxy/tinyproxy.conf
新建文件Ietc/profile.d//tinyproxy.sh
export PATH-SPATH:/usr/local/tinyproxy/bin/
执行
source /etc/profile命令，把tinyproxy添加到SPATH路径，服务器重启后依然生效。
4配置文件做置在/etc目录
mv /usr/local/tinyproxy/etc/tinyproxy/tinyproxy.conf /etc/tinyproxy.conf
修改配置文件：
修改用户为root用户和root组
注釋掉alow127.0.0.1
修改输出地址：LogFile"usr/local/share/tinyproxy/tinyproxy.log
启动
tinyproxy -c /etc/tinyproxy.conf
```
