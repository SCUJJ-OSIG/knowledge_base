卸载原来的ssh并且重装新的ssh
1、卸载目前的ssh：

```
sudo apt-get autoremove --purge openssh-server openssh-client
```

2、重装新的ssh

```
sudo apt-get update
sudo apt-get install openssh-server openssh-client
```

3、查看ssh进程

```
ps -e | grep ssh
```

说明已经启动ssh服务。如果你的ssh服务没有启动，可以使用如下命令：

```
sudo service ssh start
```

4、查看ssh状态

```
systemctl status ssh.service
```
