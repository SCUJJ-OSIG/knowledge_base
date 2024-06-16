```
docker pull nginx:latest  //拉去镜像
```

```
docker run --name nginx-test2 -p 80:80 -v /tmp/aaa:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest 
//运行镜像
```

-p 是端口映射

-v 是指定数据卷挂载目录

-e 是指定环境变量

-d 是后台运行

docker run 会返回一个容器的 hash：

docker ps  //显示容器列表的，默认是运行中的。

-a  //想显示全部的，可以加个 -a

```
docker exec -it  你取的镜像名称  /bin/bash
```

-i 是 terminal 交互的方式运行

-t 是 tty 终端类型

然后指定容器 id 和 shell 类型，就可以交互的方式在容器内执行命令了。

docker log nginx-test2

docker inspect 可以查看容器的详情

docker volume 可以管理数据卷：

* docker start：启动一个已经停止的容器
* docker rm：删除一个容器
* docker stop：停止一个容器
