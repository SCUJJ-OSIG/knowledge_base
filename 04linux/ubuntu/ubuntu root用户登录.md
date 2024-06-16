一、

> No Permissions(FileSystemError):Error:EACCES:permission denied ,open …

当修改linuxUbuntu的文件时，或者传输文件 显示permission denied，权限拒绝，你有两种方式 ，

第一种：

```shell
chmod -R 777 目标文件
```

,递归修改文件的使用权限以达到拥有权限修改

但是这种方式太麻烦了，每次创建个文件夹，拖一个东西上去都很麻烦

主要就是ubuntu系统处于安全考虑，不让你root用登录。

第二种：就是Ubuntu 系统如何使用 root 用户登录实例？

 Ubuntu 系统的默认用户名是 ubuntu，并在安装过程中默认不设置 root 账户和密码。您如有需要，可在设置中开启允许 root 用户登录。具体操作步骤如下：

1. 使用 ubuntu 账户登录轻量应用服务器。

2. 执行以下命令，设置 root 密码。

```shell
sudo passwd root
```

3. 输入 root 的密码，按 **Enter**。

4. 重复输入 root 的密码，按 **Enter**。
   返回如下信息，即表示 root 密码设置成功。

```shell
passwd: password updated successfully`
```

5. 执行以下命令，打开 `sshd_config` 配置文件。

```shell
sudo vi /etc/ssh/sshd_config
```

6. 按 **i** 切换至编辑模式，找到 `#Authentication`，将 `PermitRootLogin` 参数修改为 `yes`。如果 `PermitRootLogin` 参数被注释，请去掉首行的注释符号（`#`）。如下图所示：'

7. 这里需要注意
   
   ```shell
   在ubuntu22系统中ssh的配置不太好找
   PermitRootLogin  在30多行
   PasswordAuthentication 在最后一行
   注释 38行左右的 authentication,account processing
   # Authentication:  30行的位置
   
   #LoginGraceTime 2m
   #PermitRootLogin prohibit-password
   PermitRootLogin yes  #这里只有一个PermitRootLogin  另一个PasswordAuthentication在最后一行
   StrictModes no
   #MaxAuthTries 6
   #MaxSessions 10
   ###authentication,account processing,
   # and session processing. If this is enabled, PAM authentication will
   # be allowed through the KbdInteractiveAuthentication and
   # PasswordAuthentication.  Depending on your PAM configuration,
   # PAM authentication via KbdInteractiveAuthentication may bypass
   # the setting of "PermitRootLogin without-password".
   # If you just want the PAM account and session checks to run without
   # PAM authentication, then enable this but set PasswordAuthentication
   # and KbdInteractiveAuthentication to 'no'.
   UsePAM yes
   
   #AllowAgentForwarding yes
   #AllowTcpForwarding yes
   ```

![](https://qcloudimg.tencent-cloud.cn/image/document/565ffca41a52b21db17020dfc4d72b20.png)

7. 找到 `#Authentication`，将 `PasswordAuthentication` 参数修改为 yes。如下图所示：

**说明：**

若 `sshd_config` 配置文件中无此配置项，则添加 `PasswordAuthentication yes` 项即可。

![](https://qcloudimg.tencent-cloud.cn/image/document/8a500f485cabb0f1e0d227f983b359aa.png)

8. 按 **Esc**，输入**:wq**，保存文件并返回。

9. 执行以下命令，重启 ssh 服务。

```shell
sudo service ssh restart
```

如果报错

![](ubuntu%20root用户登录/2024-06-14-16-54-58-Clip_2024-06-14_16-54-55.png)

多半是配置文件错了 用下面检查配置 

```shell
/usr/sbin/sshd -t
#检查配置文件的问题
```

![loading-ag-462](ubuntu%20root用户登录/2024-06-14-16-56-58-Clip_2024-06-14_16-56-55.png)

提示38行配置错误 改好就行 ，我用的注释这一行。
