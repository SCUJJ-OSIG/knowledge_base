

# Idea的开始



## 1.maven安装两种方式



### 1.离线安装配置

[apache-maven-maven-4-4.0.0-alpha-9-binaries安装包下载_开源镜像站-阿里云](https://mirrors.aliyun.com/apache/maven/maven-4/4.0.0-alpha-9/binaries/?spm=a2c6h.25603864.0.0.4eac390cXvqIao)

#### 1.解压到d盘![](../../assets/2024-06-05-00-04-53-Clip_2024-06-05_00-04-50.png)

#### 2.换源

打开 》 conf 》 settings.xml  ， 像这样配置。

找到<mirrors> 添加<mirror>

```xml
<mirrors>
    <mirror>  
      <id>alimaven</id>  
      <name>aliyun maven</name>  
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>  
      <mirrorOf>central</mirrorOf>          
    </mirror>

    <mirror>
      <id>maven-default-http-blocker</id>
      <mirrorOf>external:http:*</mirrorOf>
      <name>Pseudo repository to mirror external repositories initially using HTTP.</name>
      <url>http://0.0.0.0/</url>
      <blocked>true</blocked>
    </mirror>

  </mirrors>

```





### 2.IDea自带maven



只需要配置换源即可

#### 1 . 换源

默认位置在C盘用户 .m2文件夹，里面一个仓库，一个是wrapper

![](../../assets/2024-06-05-00-16-34-Clip_2024-06-05_00-16-32.png)

新增一个，setting.xml文件，在下面，指定你写的配置文件。

![](../../assets/2024-06-05-00-19-16-Clip_2024-06-05_00-19-10.png)





## 2.JDk

idea自带JDK，而且下载也很方便，推荐用idea下载JdK，缺什么版本就下什么版本。 jdk1.8就是java8






