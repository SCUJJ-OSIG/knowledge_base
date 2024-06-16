

# 安卓的开始

## 1.下载地址

android的下载 ，网上一般找镜像，在写教程的时候发现了这个网址，挺快的

[androiddevtools]([https://www.androiddevtools.cn/](https://www.androiddevtools.cn/))

## 2.安装



> 注意: 换源成功只是下载库很快，打开项目时，gradel下载还是很慢

## 3.gradle安装

### 1.android软件内下载gradle

进入项目，先停掉项目，修改gradle-wrapper.properties文件下 >的distributionUrl,改为

```shell



distributionUrl=https\://mirrors.cloud.tencent.com   /gradle/gradle-8.7-bin.zip

主要是修改前面的镜像源。
```



<img title="" src="../../assets/2024-06-04-23-21-00-Clip_2024-06-04_23-20-57.png" alt="" width="665">



### 2.离线下载（推荐离线下载）

> 推荐离线下载是因为，这种方式多一个换源时readme文件。明确告诉你怎么换源。



[ 腾讯云gradle下载](https://mirrors.cloud.tencent.com/gradle/)



#### 1.下载后gradle，解压到d盘，还需要配置系统环境变量。



```shell
#系统变量
GRADLE_HOME      ===D:\AllSoftLib\android\gradle-8.7-all\bin
GRADLE_USER_HOME  ==  D:\AllSoftLib\android\gradle-8.7-all\gradleLib

#环境变量：
%GRADLE_HOME%   
%GRADLE_USER_HOME%
```



长这样子：

![](../../assets/2024-06-04-23-35-28-image.png)

就好了。接下来就是配置andriod的gradle位置。





#### 2.打开设置 》Build 》Build Tools 》Gradle》

修改Gradle的userhome，改为你离线安装的位置。

![](../../assets/2024-06-04-23-28-46-Clip_2024-06-04_23-28-39.png)



## 4 .配置换源，下载andriod开发时的库很快

#### 1. grandle目录配置换源

在安装gralde的位置，新建init.d文件夹

![](../../assets/2024-06-04-23-48-34-Clip_2024-06-04_23-48-30.png)

在新建init.gradle文件。



![](../../assets/2024-06-04-23-49-11-Clip_2024-06-04_23-49-09.png)

> 离线下载的，不需要新建，因为已经有了。

gradle文件内容如下： 两种写法，都可

```shell

// allprojects {
//     repositories {
//         maven { url 'file:///D:/AllSoftLib/java/maven396/apache-maven-3.9.6\/mvn-repository'}
//         mavenLocal()
//         maven { name "Alibaba" ; url "https://maven.aliyun.com/repository/public" }

//         maven{ url 'https://maven.aliyun.com/repository/public'}

//         maven { url 'https://maven.aliyun.com/repositories/jcenter' }
//         maven { url 'https://maven.aliyun.com/repositories/google' }
//         maven { url 'https://maven.aliyun.com/repository/central' }
//         maven { name "Bstek" ; url "http://nexus.bsdn.org/content/groups/public/" }
//         mavenCentral()
//     }
 
//     buildscript { 
//         repositories { 
//             maven { name "Alibaba" ; url 'https://maven.aliyun.com/repository/public' }
//             maven { name "Bstek" ; url 'http://nexus.bsdn.org/content/groups/public/' }
//             maven { name "M2" ; url 'https://plugins.gradle.org/m2/' }
//             mavenLocal()
//             mavenCentral()
//         }
//     }
// }        
  





//第二种写法


//for all project
//在用户/.gradle/下创建init.gradle文件，内容如下:
// https://blog.csdn.net/lj402159806/article/details/78422953
def repoConfig = {
    all { ArtifactRepository repo ->
        if (repo instanceof MavenArtifactRepository) {
            def url = repo.url.toString()
            if (url.contains('repo1.maven.org/maven2')
                    || url.contains('jcenter.bintray.com')
                    || url.contains('maven.google.com')
                    || url.contains('plugins.gradle.org/m2')
                    || url.contains('repo.spring.io/libs-milestone')
                    || url.contains('repo.spring.io/plugins-release')
                    || url.contains('repo.grails.org/grails/core')
                    || url.contains('repository.apache.org/snapshots')
            ) {
                println "gradle init: [buildscript.repositories] (${repo.name}: ${repo.url}) removed"
                remove repo
            }
        }
    }

/// project level build.gradle repos config / in China
//        google()
//        jcenter()
//        mavenLocal()
//        mavenCentral()
//        maven{url "https://jitpack.io"}
    // 腾讯云/阿里云 maven 镜像聚合了：central、jcenter、google、gradle-plugin
    maven { url 'https://mirrors.cloud.tencent.com/gradle/'}
    maven { url 'https://mirrors.cloud.tencent.com/nexus/repository/maven-public/' }

    maven { url 'https://maven.aliyun.com/repository/central' }
    // jcenter & public
    maven { url 'https://maven.aliyun.com/repository/public' }
    maven { url 'https://maven.aliyun.com/repository/google' }
    maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
}

allprojects {
    buildscript {
        repositories repoConfig
    }

    repositories repoConfig
}
```





#### 2.软件内换源

![](../../assets/2024-06-04-23-46-59-Clip_2024-06-04_23-46-48.png)



## 5. 结束 tip

在学校学时，写书上的老例子，打开项目第一时间先暂停项目，打开项目管理，修改gralde的版本，不然的话，下载一个4.x的gradel，下完之后又叫下载7.x的gradel，直接让你上课全在等下载。




