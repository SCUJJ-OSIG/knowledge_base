**报错描述**：如果本地有一些文件，你又连接远程仓库，把文件pull拉取下来，合并报错

[toc]

# fatal: refusing to merge unrelated historiess


```bash
#error1:
fatal: refusing to merge unrelated histories
```

### 一、本地合并时遇到refusing to merge unrelated histories的错误

如果git merge合并的时候出现refusing to merge unrelated histories的错误，

**原因**是两个仓库不同而导致的，需要在后面加上--allow-unrelated-histories进行允许合并，即可解决问题

如果还不能解决问题，就把本地的remote删除，重新git remote add添加远程仓库，再按上面的方法来，问题解决。

### 二、远程push 的时候出现refusing to merge unrelated histories

 

本地仓库在想做同步远程仓库到本地为之后本地仓库推送到远程仓库做准备时报错了，错误如下：

```
`fatal: refusing to merge unrelated histories` （拒绝合并不相关的历史）
```



出现这个问题的最主要原因还是在于本地仓库和远程仓库实际上是独立的两个仓库。

假如我之前是直接clone的方式在本地建立起远程github仓库的克隆本地仓库就不会有这问题了。

查阅了一下资料，发现可以在pull命令后紧接着使用--allow-unrelated-history选项来解决问题（该选项可以合并两个独立启动仓库的历史）。
 

```bash
#解决：
    
$git pull origin master –allow-unrelated-histories

#以上是将远程仓库的文件拉取到本地仓库了。 

#紧接着将本地仓库的提交推送到远程github仓库上，使用的命令是：

$ git push <远程主机名> <本地分支名>:<远程分支名>
#也就是

$git push origin master:master


```

![GitPushRemote](./git问题.assets/GitPushRemote.jpg)

### pull

git pull 命令基本上就是 git fetch 和 git merge 命令的组合体，Git 从指定的远程仓库中抓取内容，然后马上尝试将其合并进你所在的分支中。

从远程仓库中获得数据，可以执行：

```crystal
$ git fetch [remote-name]
```

这个命令会访问远程仓库，从中拉取所有你还没有的数据。 执行完成后，你将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看。

但是注意的是 git fetch **并不会自动合并或修改你当前的工作**。 当准备好时你必须手动将其合并入你的工作。

如果你使用 clone 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写。 所以，git fetch origin 会抓取克隆（或上一次抓取）后新推送的所有工作。

由于fetch命令后还要再做一步merge命令的操作，所以使用 git pull 命令来自动的抓取然后合并远程分支到当前分支。 （相当于一次执行fetch加merge命令）这可能会是一个更简单或更舒服的工作流程。

要用远程的分支来合并你的分支，不然在远程就会出现两个分支；




```
git efrror: RPC failed; curl 56 Recv failure: Connection was reset
```


设置传送的缓存大小(即http.postBuffer的值，单位为B，1GB = 1024*1024*1000 B = 1048576000 B)：

```bash
git config --global http.postBuffer 1048576000
```






###### . VPN使用环境下的解决方案

 **查看系统端口号** :
 打开“设置 -> 网络和Internet -> 代理”，记录下当前的端口号。

 **设置Git端口号** :
 使用命令：

javascript

```javascript
git config --global http.proxy 127.0.0.1:<你的端口号>
git config --global https.proxy 127.0.0.1:<你的端口号>
```

 例如，如果你的端口号是7897，则输入：

javascript

```javascript
git config --global http.proxy 127.0.0.1:7897
git config --global https.proxy 127.0.0.1:7897
```

**验证设置** (可选):

javascript

```javascript
git config --global -l
```

 检查输出，确认代理设置已正确配置。

 **重试Git操作** :
 在执行 `git push`或 `git pull`前，建议在命令行中运行 `ipconfig/flushdns`以刷新**DNS**缓存。

###### b. 未使用VPN时的解决方案

如果你并未使用VPN，但依然遇到端口443连接失败的问题，尝试取消Git的代理设置：

javascript

```javascript
git config --global --unset http.proxy
git config --global --unset https.proxy
```

之后重试Git操作，并刷新DNS缓存。
