# nginx 的用法

```shell
#版本
nginx -v



sudo systemctl status nginx

sudo systemctl enable nginx


#重新加载 Nginx
sudo systemctl restart nginx

sudo systemctl start nginx


#二选一
sudo ufw allow 'Nginx full'

#防火墙
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'




#防火墙
sudo ufw reload
#
#主配置文件：/etc/nginx/nginx.conf
#站点配置文件目录：/etc/nginx/sites-available 和 /etc/nginx/sites-enabled


#创建一个简单的站点配置文件
sudo nano /etc/nginx/sites-available/my_site
#示例站点配置：

server {
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;

    root /var/www/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}




sudo nginx -t

#Ubuntu 22.04 中删除 NGINX 服务器 NGINX 服务器及其依赖项：
sudo  apt autoremove nginx --purge
```
