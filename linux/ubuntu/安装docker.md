
## 在 Ubuntu 22.04 LTS 中安装 Docker

### 1、更新 Ubuntu

首先，更新你的 Ubuntu 系统。

打开终端，依次运行下列命令：

```bash
sudo apt updatesudo apt upgradesudo apt full-upgrade
```

### 2、添加 Docker 库

首先，安装必要的证书并允许 apt 包管理器使用以下命令通过 HTTPS 使用存储库：

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
```

然后，运行下列命令添加 Docker 的官方 GPG 密钥：

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

添加 Docker 官方库：

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

使用命令更新 Ubuntu 源列表：

```bash
sudo apt update
```

### 3、安装 Docker

#### 安装最新版本

最后，运行下列命令在 Ubuntu 22.04 LTS 服务器中安装最新 Docker CE：

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

#### 手动安装其他版本

当然你也可以安装其他版本 Docker 。运行下列命令检查可以安装的 Docker 版本：

```bash
apt-cache madison docker-ce
```

输出样例：

```bash
	docker-ce | 5:20.10.17~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages    docker-ce | 5:20.10.16~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages    docker-ce | 5:20.10.15~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages    docker-ce | 5:20.10.14~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages    docker-ce | 5:20.10.13~3-0~ubuntu-jammy | https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages1.2.3.4.5.
```

你可以挑选上面列表中的任何版本进行安装。例如，安装 **5:20.10.16~ 3-0 ~ubuntu-jammy** 这个版本，运行：

```bash
sudo apt install docker-ce=5:20.10.16~3-0~ubuntu-jammy docker-ce-cli=5:20.10.16~3-0~ubuntu-jammy containerd.io
```





安装完成后，运行如下命令验证 Docker 服务是否在运行：

```bash
sudo systemctl status docker
```

你会看到类似下面的输出：

```bash
* docker.service - Docker Application Container Engine         Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)         Active: active (running) since Mon 2022-06-27 13:07:43 UTC; 3min 4s ago    TriggeredBy: * docker.socket           Docs: https://docs.docker.com       Main PID: 2208 (dockerd)          Tasks: 8         Memory: 29.6M            CPU: 126ms         CGroup: /system.slice/docker.service                 `-2208 /usr/bin/dockerd -H fd:// --cnotallow=/run/containerd/containerd.sock    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.071453522Z" level=info msg="ccResolverWrapper: sending update to cc: {[{unix:>    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.071459974Z" level=info msg="ClientConn switching balancer to \"pick_first\"" >    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.130989294Z" level=info msg="Loading containers: start."    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.187439756Z" level=info msg="Default bridge (docker0) is assigned with an IP a>    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.235966874Z" level=info msg="Loading containers: done."    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.240149866Z" level=warning msg="Not using native diff for overlay2, this may c>    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.240281966Z" level=info msg="Docker daemon" commit=a89b842 graphdriver(s)=over>    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.240386856Z" level=info msg="Daemon has completed initialization"    Jun 27 13:07:43 Ubuntu22CT systemd[1]: Started Docker Application Container Engine.    Jun 27 13:07:43 Ubuntu22CT dockerd[2208]: time="2022-06-27T13:07:43.276336600Z" level=info msg="API listen on /run/docker.sock"1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20.21.
```

好极了！Docker 服务已启动并运行！

如果没有运行，运行以下命令运行 Docker 服务：

```bash
sudo systemctl start docker
```

使 Docker 服务在每次重启时自动启动：

```bash
sudo systemctl enable docker
```

可以使用以下命令查看已安装的 Docker 版本：

```bash
sudo docker version
```

输出样例：

```bash
Client: Docker Engine - Community      Version:           20.10.17      API version:       1.41      Go version:        go1.17.11      Git commit:        100c701      Built:             Mon Jun  6 23:02:46 2022      OS/Arch:           linux/amd64      Context:           default      Experimental:      true    Server: Docker Engine - Community      Engine:        Version:          20.10.17        API version:      1.41 (minimum version 1.12)        Go version:       go1.17.11        Git commit:       a89b842      Built:            Mon Jun  6 23:00:51 2022        OS/Arch:          linux/amd64        Experimental:     false      containerd:        Version:          1.6.6        GitCommit:        10c12954828e7c7c9b6e0ea9b0c02b01407d3ae1      runc:        Version:          1.1.2        GitCommit:        v1.1.2-0-ga916309      docker-init:        Version:          0.19.0        GitCommit:        de40ad0
```

### 4、测试 Docker

让我们继续，测试 Docker 是否运行正常：

运行：

```bash
sudo docker run hello-world
```

上述命令会下载一个 Docker 测试镜像，并在容器内执行一个 “hello_world” 样例程序。

如果你看到类似下方的输出，那么祝贺你！Docker 正常运行在你的 Ubuntu 系统中了。

```bash
Unable to find image 'hello-world:latest' locally    latest: Pulling from library/hello-world    2db29710123e: Pull complete     Digest: sha256:13e367d31ae85359f42d637adf6da428f76d75dc9afeb3c21faea0d976f5c651    Status: Downloaded newer image for hello-world:latest    Hello from Docker!    This message shows that your installation appears to be working correctly.    To generate this message, Docker took the following steps:     1. The Docker client contacted the Docker daemon.     2. The Docker daemon pulled the "hello-world" image from the Docker Hub.        (amd64)     3. The Docker daemon created a new container from that image which runs the        executable that produces the output you are currently reading.     4. The Docker daemon streamed that output to the Docker client, which sent it        to your terminal.    To try something more ambitious, you can run an Ubuntu container with:     $ docker run -it ubuntu bash    Share images, automate workflows, and more with a free Docker ID:     https://hub.docker.com/    For more examples and ideas, visit:     https://docs.docker.com/get-started/
```

很好！可以使用 Docker 了。

### 5、作为非 root 用户运行 Docker （选做）

默认情况下，Docker 守护进程绑定到 Unix 套接字而不是 TCP 端口。由于  **Unix 套接字由 root 用户拥有** ，Docker 守护程序将仅以 root 用户身份运行。因此，普通用户无法执行大多数 Docker 命令。

如果你想要在 Linux 中作为非 root 用户运行 Docker ，参考下方链接：

* [如何在 Linux 中作为非 root 用户运行 Docker](https://ostechnix.com/how-to-run-docker-as-non-root-user-in-linux/)

我个人不这样做也**不推荐**你这么做。如果你不会在互联网上暴露你的系统，那没问题。然而，不要在生产系统中以非 root 用户身份运行 Docker 。

## 在 Ubuntu 22.04 LTS 中安装 Docker Compose

**Docker Compose** 是一个可用于定义和运行多容器 Docker 应用程序的工具。使用 Compose，你可以使用 Compose 文件来配置应用程序的服务。然后，使用单个命令，你可以从配置中创建和启动所有服务。

下列任何方式都可以安装 Docker Compose 。

### 方式 1、使用二进制文件安装 Docker Compose

从 [这里](https://github.com/docker/compose/releases) 下载最新 Docker Compose 。

当我在写这篇文章时，最新版本是 **2.6.1** 。

运行下列命令安装最新稳定的 Docker Compose 文件：

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

如果有更新版本，只需要将上述命令中的 **v2.6.1** 替换为最新的版本号即可。请不要忘记数字前的 **"v"** 。

最后，使用下列命令赋予二进制文件可执行权限：

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

运行下列命令检查安装的 Docker Compose 版本：

```bash
sudo docker-compose version
```

### 方式 2、使用 pip 安装 Docker Compose

或许，我们可以使用 **pip** 安装 Docker Compose 。pip 是 Python 包管理器，用来安装使用 Python 编写的应用程序。

参考下列链接安装 pip 。

* [如何使用 pip 管理 Python 包](https://ostechnix.com/manage-python-packages-using-pip/)

安装 pip 后，运行以下命令安装 Docker Compose。下列命令对于所有 Linux 发行版都是相同的！

```bash
pip install docker-compose
```

安装 Docker Compose 后，使用下列命令检查版本：

```bash
docker-compose --version
```

你将会看到类似下方的输出：

```bash
docker-compose version 2.6.1
```

恭喜你！我们已经成功安装了 Docker 社区版和 Docker Compose
