# python包管理conda命令


# 常用命令



[toc]

## 1.创建一个新环境

```shell
#创建环境
conda create -n your_env_name python=X.X 
conda create --name your_env_name python=X.X
-n即--name，your_env_name是你自定义的环境名称


```

例如：

conda create -n newenv python=3.7

 python=3.7会安装最新的python3.7系列版本（如3.7.12）

如要指定更详细的版本，需使用python=3.7.2

## 2.激活某个环境

```shell

##2.激活某个环境
#激活，activate。即进入某个环境。

Windows系统：
conda activate your_env_name


Linux系统：
source activate your_env_name

激活环境后，可检查当前环境下的Python版本：
python --version


```

## 3.包的安装和删除、环境删除

```shell


#3.包的安装和删除、环境删除
#激活到指定环境后，可直接向环境中安装所需的包：

#安装包：

conda install [package] 

#如：conda install numpy
 #指定包版本：conda install xlrd=1.2.0 (注意是单等于号）
 #也可以使用pip install安装 pip install xlrd==1.2.0 (注意是双等于号）
 #查看可用的版本：pip install spyder==*
 
 
#删除当前环境中的某个包：

conda remove [package] 
 请注意：并非conda uninstall
 pip指令下才有 pip uninstall
#升级某个包：

conda update [package]
 conda update --all 升级所有包
#退出当前虚拟环境：

source deactivate  # Linux环境

conda deactivate # Windows环境
#删除某个虚拟环境：

conda remove -n your_env_name --all
 -n即--name
#复制某个虚拟环境：

conda create --name new_env_name --clone old_env_name 
在安装前的确认[Y/N]的时候，false表示由用户再做决定，而不直接进行： 

conda config --set always_yes false
```

## 4.环境查询

```shell

#查看安装了哪些包：

conda list
#查看当前有哪些虚拟环境：

conda env list
conda info --envs

#查询环境python版本：
python --version

#查询conda版本：

conda --version
#更新conda：

conda update conda
#查看conda环境详细信息：

conda info

```

### 查看conda的环境配置

```
conda config --show
```

## 5.分享/备份环境

```shell


#一个分享环境的快速方法就是给他一个你的环境的.yml文件。

#首先激活到要分享的环境，在当前工作目录下生成一个environment.yml文件。

conda env export > environment.yml
#对方拿到environment.yml文件后，将该文件放在工作目录下，可以通过以下命令从该文件创建环境。

conda env create -f environment.yml
```

## 6.镜像源

```shell
#conda方法：

#查看镜像源：

conda config --show channels
#添加镜像源（如清华源）：

conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --set show_channel_urls yes

 conda config --set show_channel_urls yes  #的意思是从channel中安装包时显示channel的url，这样就可以知道包的安装来源了。
#清除索引缓存，保证用的是镜像站提供的索引： 
conda clean -i

#搜索包： 

conda search [package]

#切换回默认源：

conda config --remove-key channels
#移除某个镜像源（如清华源）：

conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/


#pip方法：

#临时指定安装某个包使用的镜像源：

pip install [package] -i https://pypi.tuna.tsinghua.edu.cn/simple/
pip install [package] -i http://pypi.douban.com/simple/ --trusted-host pypi.douban.com

#



```

```html

清华：https://pypi.tuna.tsinghua.edu.cn/simple
腾讯：https://mirrors.cloud.tencent.com/pypi/simple
阿里云：http://mirrors.aliyun.com/pypi/simple/
中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple/
华中理工大学：http://pypi.hustunique.com/
山东理工大学：http://pypi.sdutlinux.org/ 
豆瓣：http://pypi.douban.com/simple/
```

### 清除conda缓存

```bash
conda clean -p      # 删除没有用的包 --packages
conda clean -t      # 删除tar打包 --tarballs
conda clean -y -all # 删除所有的安装包及cache(索引缓存、锁定文件、未使用过的包和tar包)
conda clean -h    #清除命令的更详细的说明
```

## 7.清理

```shell
#删除没有用的包：

conda clean -p   
#删除tar包：

conda clean -t   
#删除所有的安装包及cache：

conda clean -y --all 
```

## 8.conda config换源配置

```bash
#显示换源url
conda config --show-sources

#添加配置

conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes

```

## Python版本的管理

    除了上面在创建虚环境时可以指定python版本外，Anaconda基环境的python版本也可以根据需要进行更改。

### 5.1 将版本变更到指定版本

```
conda install python=3.5
```

更新完后可以用以下命令查看变更是否符合预期。

```
python --version
```

### 5.2 将python版本更新到最新版本

    如果你想将python版本更新到最新版本，可以使用以下命令：

````
conda update python
````

### conda install vs pip install 有什么区别？

conda可以管理非python包，pip只能管理python包。
	conda自己可以用来创建环境，pip不能，需要依赖virtualenv之类的。
	conda安装的包是编译好的二进制文件，安装包文件过程中会自动安装依赖包；pip安装的包是wheel或源码，装过程中不会去支持python语言之外的依赖项。
	**conda安装的包会统一下载到一个目录文件中，当环境B需要下载的包，之前其他环境安装过，就只需要把之间下载的文件复制到环境B中，下载一次多次安装。pip是直接下载到对应环境中。**
	conda只能在conda管理的环境中使用，例如比如conda所创建的虚环境中使用。pip可以在任何环境中使用，在conda创建的环境 中使用pip命令，需要先安装pip（conda install pip ），然后可以 环境A 中使用pip 。conda 安装的包，pip可以卸载，但不能卸载依赖包，pip安装的包，只能用pip卸载。

#### 6.3 安装在哪里？

conda install xxx：这种方式安装的库都会放在anaconda3/pkgs目录下，这样的好处就是，当在某个环境下已经下载好了某个库，再在另一个环境中还需要这个库时，就可以直接从pkgs目录下将该库复制至新环境而不用重复下载。
pip install xxx：分两种情况，一种情况就是当前conda环境的python是conda安装的，和系统的不一样，那么xxx会被安装到anaconda3/envs/current_env/lib/python3.x/site-packages文件夹中，如果当前conda环境用的是系统的python，那么xxx会通常会被安装到~/.local/lib/python3.x/site-packages文件夹中

#### 6.4 如何判断conda中某个包是通过conda还是pip安装的？

    执行 conda list ，用pip安装的包显示的build项目为pypi

```
 conda configuration
```

 conda的配置文件为".condarc"，该文件在安装时不是缺省存在的。但是当你第一次运行conda config命令时它就被自动创建了。".condarc"配置文件遵循简单的YAML语法。


#### 7.1 .condarc文件在哪儿？

    执行conda info，会有信息显示如下所示：
