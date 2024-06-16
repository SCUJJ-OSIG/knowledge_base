# 服务器安装系统 第一步是

## 1.raid 配置

raid0 和raid1  按Ctrl+R进入raid配置界面

raid配置学习 原文链接：https://blog.csdn.net/weixin_49452223/article/details/117393648

## 2.ubuntu系统的磁盘的划分

需要自己定义磁盘的挂载。ubuntu较坑的是，每一次format都会重新进入安装系统界面。

ubuntu分区 不过是根目录“\” \boot  ,剩余空间自己挂载home下。

[2020-04-14 ubuntu 18.04 下查看系统硬盘、硬盘挂载、创建LVM一条龙](http://t.csdnimg.cn/wU3Bb)

### 分区

/swap 交换分区（虚拟内存），类型为逻辑分区，（8G及以下RAM选择两倍大小，以上跟RAM大小一样就行）

EFI引导分区，类型为逻辑分区，，默认ext4。 推荐分 512 ~ 1024M，注意：放在空间起始位置【关于是否要分/boot分区的问题：如果你的主板bios里设置的是UEFI+GPT分区表模式，那么给ubuntu分区的时候不用设置这个/boot分区，设置下面第3步的efi系统分区即可； 但如果你用的是legacy+MBR分区表那就正常设置/boot分区，这个很重要，特别是装双系统或多系统时，避免破坏到其他系统的引导文件】

/home 用户分区，类型为逻辑分区，默认ext4，分50GB，用户的所有文件都在这里。

/ 根目录（root分区），类型为主分区，默认ext4，linux系统文件都在这里

##### 设置用户和密码

1. 安装程序会要求您设置计算机的用户名、密码和其他相关信息，请按提示输入

##### 最后设置启动项

1. 完成安装：拔下U盘，重启电脑时马上按F1或Delete键进入电脑BIOS，设置硬盘为第一启动项，保存之后，重启即可。

关于磁盘挂载的命令

```powershell
1、df -hl   //查看系统硬盘(可用的，已经挂载)

2、sudo fdisk -l  //查看系统分区情况
```

```
需要安装lvm2
sudo apt install lvm2  # 直接安装

或者
sudo apt install -d lvm2  
# 打包下载模式，会下载所有需要的安装包。-d就是打包下载不安装
# 然后  将所有的安装包拷贝到制定服务器中，通过以下命令安装
sudo dpkg -i *.deb
这总对没有联网的服务器很友好
```

### ubuntu 磁盘管理工具 ---- GParted 图形化分区工具

GParted是一个图形界面的分区管理工具。传统的 Linux分区工具是FDisk，它需要输入很多的命令，非常的繁琐。而GParted则提供了直观的图形界面，功能也非常的强大。它的特点有：

1、支持多种硬盘分区格式，如FAT、FAT32、NTFS、EXT2、EXT3等

2、可以建立、删除分区

3、可以对于分区 的空间进行调整

安装GParted：

```python
sudo apt-get install gparted
```

安装完成后， 在终端里面输入：

```python
sudo gparted
```

当然，也可以建立一个程序启动器， 从桌面启动。

GParted 的主界面非常的直观，显示了硬盘上所有的分区情况，包括分区的大小，类型和挂载情况。 注意，已经挂载的分区必须首先卸载，才能进行分区操作（如删除，变更大小等操作）

##### [Ubuntu硬盘分区、挂载](http://t.csdnimg.cn/bOjoq)

3.鱼香换源

[鱼香社区](https://fishros.org.cn/forum/)

[小鱼的一键安装系列](https://fishros.org.cn/forum/topic/20/%E5%B0%8F%E9%B1%BC%E7%9A%84%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E7%B3%BB%E5%88%97)

##### 一键安装指令

```shell
wget http://fishros.com/install -O fishros && . fishros
```

切换中文

docker
