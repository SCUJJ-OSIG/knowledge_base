一谈到nginx 就是web服务器，反向代理服务器，负载均衡，而在网上去看配置文件，就是一脸懵，因为基本都是围绕本地地址去讲的。涉及到服务器的配置太少了。

首先你应该明白配置的结构，main（全局块）、events、http（主模块）、server（服务器块）以及location（位置块）。下面是对这些块的基本解释，帮助你更好地理解配置逻辑：

1. **Main Block（全局块）**
   
   - 这是配置文件的最外层，设定影响Nginx整体运行的配置项，如worker进程数、PID文件路径、错误日志位置等。
   
   - 示例：
     
     Nginx
     
     ```nginx
     worker_processes  1;
     error_log  /var/log/nginx/error.log warn;
     pid        /var/run/nginx.pid;
     ```

2. **Events Block（事件驱动模型配置块）**
   
   - 定义了Nginx如何处理连接和请求的事件，例如最大连接数、连接超时时间等。
   
   - 示例：
     
     Nginx
     
     ```nginx
     events {
        worker_connections  1024;
        use epoll; # 对于Linux系统优化
        multi_accept on;
     5}
     ```

3. **Http Block（HTTP核心模块）**
   
   - 包含了所有与HTTP协议相关的配置，比如MIME类型、日志格式、压缩设置、以及反向代理、负载均衡等高级功能。

4. **Server Block（服务器块）**
   
   - 每个`server`块定义了一个虚拟主机，可以监听不同的端口、有不同的域名，以及独立的配置。
   
   - 示例：
     
     Nginx
     
     ```nginx
     server {
         listen 80;
         server_name example.com www.example.com;    location / {
         root /var/www/example.com;       index index.html index.htm;
         }
     }
     ```

5. **Location Block（位置块）**
   
   - 位于`server`块内部，根据URL路径来指定不同的处理方式，如静态文件服务、反向代理转发等。
   
   - 示例：
     
     Nginx
     
     ```
     1location /api/ {
     2    proxy_pass http://backend_server; # 反向代理到后端服务器
     3    proxy_set_header Host $host;
     4    proxy_set_header X-Real-IP $remote_addr;
     5}
     ```

说了些书面话，但我想说的只有server：
![](nginx的配置/2024-06-14-20-05-46-Clip_2024-06-14_20-05-44.png)

监听服务的80端口，所有的请求都会被nginx获得，根据server_name匹配请求中相应的host，location的/根目录都传递到root所指的目录，在根据index选择入口点

因此还可以写一个server,也监听80,只是servername不同,local指向其他位置 local的 / 其实就是指的root的目录,你把前端的打包项目为 / 的放进去就好,要是想多放几个项目, 在local后面 /xxx(子项目) 

```nginx
http {
    server {
        listen 80;
        server_name example.com www.example.com;

        location / {
            root /var/www/example.com/public; # 假设example.com的前端项目位于此目录
            index index.html index.htm;
            try_files $uri $uri/ /index.html; # 用于SPA应用，重定向所有非文件请求到index.html
        }
    }

    server {
        listen 80;
        server_name anotherapp.com;

        location / {
            root /var/www/anotherapp/public; # 另一个应用的前端项目根目录
            index index.html index.htm;
            try_files $uri $uri/ /index.html; # 同样适用于SPA
        }

        # 如果你想在同一server块中添加另一个子项目
        location /subproject {
            alias /var/www/subproject/public; # 子项目的根目录
            index index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

- 第一个`server`块处理所有以`example.com`或`www.example.com`为主机头的请求，将其路由到`/var/www/example.com/public`目录。
- 第二个`server`块则服务于`anotherapp.com`，其前端资源存储在`/var/www/anotherapp/public`。
- 通过在第二个`server`块内添加额外的`location /subproject`，你可以为同一域名下的子目录映射不同的前端项目，这里假设子项目位于`/var/www/subproject/public`。

`try_files`指令在单页面应用（SPA）中非常有用，它确保所有非文件请求都被重定向到`index.html`，这对于基于前端路由的应用至关重要。

nginx的命令

```shell
sudo systemctl start nginx
```

```
sudo systemctl stop nginx
```

```
sudo systemctl restart nginx
```

```
sudo systemctl status nginx
```

```
sudo nginx -t
```
