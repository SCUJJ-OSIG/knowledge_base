# 文件和目录的创建、删除、移动、复制、重命名

1. ## 查看目录结构命令： ls

```shell
ls -a    #所有文件和目录。注意隐藏文件、特殊目录、以“.”开头的和以“..”开头的
ls -l    #使用详细格式列表
ls -t    #用文件和目录的更改时间排序
ls -r    #反向排序


#常用
ls -l            #列出当前目录下的文件信息（此命令很常用，简化的格式为 ll）
ls -al           #列出当前目录下的文件信息（包括隐藏文件，特殊目录）
ll /home/        #显示根目录下home目录下的内容
```

2. ## 切换目录命令：cd

```bash
cd ~          #当前用户主目录
cd /          #根目录
cd -          #上一次访问的目录
cd ..         #上一级目录
cd            #当前用户主目录
pwd           #显示当前工作目录

"./" #表示当前目录
"../" #表示上一级目录
```

3. ## 创建目录命令：mkdir

```bash
mkdir          #创建目录

mkdir a        #:当前目录下创建文件夹a

mkdir web/test #:创建多级目录 [p:parents 父级目录]

mkdir web test  # 创建多个目录

mkdir -p web/test # -p表示创建指定的目录,并自动创建其中所需的所有缺少的父级目录
```

3. ## touch 创建空文件 echo

```bash
touch web.txt  #创建单个空文件              
touch demo.txt test.txt       #创建多个空文件           
echo "dengruicode.com"        #打印输出文本

echo "dengruicode.com" >> web.t #向文件中添加一行文字
 '>> web.txt' #将打印输出的文本 追加 到 web.txt 文件末尾, 若文件不存在, 则会创建该文件 


>  重定向输出 # 会覆盖已有的文件, 
>> 追加      # 则会保留原来文件的内容, 在文件末尾追加内容
```

4. ## cat  tail   head

```bash
cat web.txt #显示文件内容




tail  #从文件末尾显示指定数量的
tail web.txt  #默认显示文件的最后 10 行
tail -n 1 web.txt  #显示文件的最后 1 行



head #文件开头显示指定数量的行
head web.txt        #默认显示文件的前 10 行
head -n 1 web.txt   #显示文件的前 1 行
```

5. ## copy

```bash
cp web.txt /home/david/web  #将文件复制到另一个目录中
cp /home/david/web.txt /home/david/web  
cp /home/david/web.txt /home/david/web/newWeb.txt    # 将文件复制到另一个目录中并重命名
#将目录复制到另一个目录中 [r:recursive 递归]
cp -r /home/david/test/ /home/david/web/ # -r表示复制整个目录树的内容
```

6. ## rm 删除文件或目录

```bash
rm newWeb.txt           # 删除单个文件   
rm demo.txt test.txt     #删除多个文件
#删除目录 [r:recursive 递归]
rm -r web  #-r表示删除此文件夹和其子文件夹中的所有文件和目录
```

7. ## mv  移动或更名现有的文件或目录

```bash
 mv web.txt newWeb.txt  重命名文件
 mv newWeb.txt /home/david/web           移动文件
 mv newWeb.txt /home/david/web/test.txt    移动文件并重命名

mv web newWeb      重命名目录
mv newWeb /home/david/test    移动目录
mv newWeb /home/david/test/demo     移动目录并重命名
```

## 8. 备份压缩：tar命令 zip

```bash
解压

tar -xf   nginx-1.24.0.tar.gz
tar -xvf  nginx-1.24.0.tar.gz
tar -zxvf nginx-1.24.0.tar.gz
tar -zxvf nginx-1.24.0.tar.gz -C /usr/local/src


压缩
tar -zcvf nginx.tar.gz nginx-1.24.0



zip 
unzip images.zip        #解压
zip -r img.zip images  # 压缩  -r(recursive) 递归地压缩指定目录及其所有子目录和文件
```

- -z 表示使用gzip解压缩,使用gzip会减少压缩文件体积

- -c(create) 表示创建一个新的tar文件

- -x(extract) 表示解压tar文件 

- -v(verbose) 表示在解压过程中显示详细信息 

- -f(file) 指定要解压的tar文件的路径

- -C(Change Directory) 解压到指定目录

```
                      以.gz结尾文件,会自动启用gzip
```

常用

```bash
tar -zcvf /root/1.tar /root/a  #将root目录下的a文件夹压缩成1.tar,放在root目录下。
tar -zxvf ./1.tar              #将当前目录下的1.tar文件解压缩
```

- 如果后缀名为`.tar.gz`的压缩包用`-zxvf`

- 如果后缀名为`.tar`的压缩包用`-xvf`







9. ## 文档编辑命令：vi或vim命令

`vim`是一款功能强大的文本编辑器，它是`Linux`下常用的编辑器之一，对于熟练掌握了 `vim`的人来说，用它编辑文件，方便又快捷，能极大的提高工作效率。

1. vim 的模式

进入`vim`之后，会有多种不同的模式，模式之间的切换，让你只需要通过键盘，就能完成文本的编辑，这也是`vim`存在多种模式的原因，

`vim`主要有以下几个模式：

- **正常模式**：刚进入`vim`界面的时候是正常模式，复制、粘贴操作都是在这个模式下进行的。 

- **插入模式**：文本内容输入，修改是在这个模式下进行的，可以按`i`或者`I`进入到插入模式，在插入模式下，按`esc`会返回到正常模式。 

- **命令模式**：输入或者修改完之后，需要保存退出，这个时候`vim`就会进入到命令模式，按`Shift` + `:`进入命令模式，再次按`esc`返回正常模式。 

- **可视模式**：可视模式是对文件进行大量重复操作的时候，可以一次性执行完成的功能，可通过`v`、`V`、`ctrl v`进入可视模式。

###### 2. 常用命令

```
vim file    #打开文件
wq          #保存并退出
q!          #不保存退出,会丢失数据
```

**例如**：`vim a.txt`命令打开`a.txt`文件，假如`a.txt`存在的话，打开已有的，不存在的话，则会打开一个新的文件。

## 10.更改文件或目录的所有者和所属组 chown 和 chgrp



```shell
su root           #切换到root用户
chown (change owner) #更改文件或目录的所有者
chown pori test.txt
chown pori  web
chown  -R   pori  web
chown pori:root web  将目录web的所有者改为pori用户，所属组改为root组


chgrp(change  group) #更改文件或目录的所属组
chgrp pori test.txt
chgrp pori  web

```







 /usr 目录主要用来存储系统级别的二进制文件、库和文档

                        可以被视为系统级目录

               /usr/local 目录通常用来存储用户手动安装的软件