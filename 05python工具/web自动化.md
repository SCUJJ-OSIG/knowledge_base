## web自动化测试



### 1. selenium 基础安装 



命令行模式下，执行：

```
 pip install selenium==4.4.0 
```

###  2.WebDriver_manager 安装

#### 2.1 webdriver_manager是什么？

webdriver_manager 是 Python 中的一个库，用于管理 Web 驱动程序。它的作用是自动下载和设置不同浏览器（如 Chrome、Firefox、Edge 等）的 Web 驱动程序，以便在自动化测试中使用这些浏览器。

在进行 Selenium 测试时，需要一个与浏览器相匹配的 Web 驱动程序，以便控制和操作浏览器。webdriver_manager 为您提供了一种简便的方式，可以自动检测所需浏览器的版本并下载相应的 Web 驱动程序。这样，您就不需要手动下载和设置 Web 驱动程序，可以减轻您的负担，提高测试的可靠性和可维护性。

## 3.使用







### 导入模块

```
pip install webdriver_manager
pip install Selenium

```

### 2.3、Chrome用法

```
# Selenium4.0以上版本使用该方法
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# 使用 ChromeDriverManager 安装 ChromeDriver，并返回驱动程序的路径
driver_path = ChromeDriverManager().install()
# 打印驱动程序的路径
print(driver_path)

# 创建 ChromeDriver 服务，并指定驱动程序的路径
service = Service(driver_path)
# 创建 Chrome WebDriver，并指定服务
driver = webdriver.Chrome(service=service)
# 打开百度网页
driver.get("https://www.baidu.com")

```



- **以下代码是判断谷歌浏览器版本和谷歌驱动版本是否一致，不一致则重新下载**

```
# Selenium4.0以上版本使用该方法
import os
import shutil
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


def determine_google_drive():
    """判断谷歌驱动版本是否和谷歌浏览器版本一致"""
    # 谷歌浏览器可执行文件的完整路径
    chrome_path = r'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

    # 指定谷歌驱动目标位置
    folder_path = r'C:\Users\admin\Desktop\run'
    # 驱动名称
    file_name = 'chromedriver.exe'
    # 路径拼接
    file_path = os.path.join(folder_path, file_name)

    if os.path.exists(file_path):
        # 获取chromedriver.exe版本(谷歌浏览器驱动)
        result = subprocess.run([file_path, '--version'], capture_output=True, text=True)
        driverversion = '.'.join(result.stdout.strip().split(' ')[1].split('.')[:-1])

        # 获取chrome.exe版本(谷歌浏览器)
        command = f'wmic datafile where name="{chrome_path}" get Version /value'
        result_a = subprocess.run(command, capture_output=True, text=True, shell=True)
        output = result_a.stdout.strip()
        chromeversion = '.'.join(output.split('=')[1].split('.')[0:3])

        # 判断版本是否一致，不一致就重新下载
        if driverversion != chromeversion:
            # 使用ChromeDriverManager安装ChromeDriver，并获取驱动程序的路径
            download_driver_path = ChromeDriverManager().install()
            # 复制文件到目标位置
            shutil.copy(download_driver_path, folder_path)
        else:
            print("版本一致，无需重新下载！")

    else:
        download_driver_path = ChromeDriverManager().install()
        shutil.copy(download_driver_path, folder_path)

    return file_path


if __name__ == '__main__':
    # 创建Chrome WebDriver，并指定驱动路径
    driver = webdriver.Chrome(service=Service(determine_google_drive()))
    # 打开百度网页
    driver.get("https://www.baidu.com")

```





## selenium 三种等待方式



time.sleep









### 元素定位最佳顺序

1. ID（唯一标识）：如果元素具有唯一的ID属性，优先使用ID进行定位，因为它是最快和最可靠的定位方式。
2. CSS选择器：如果元素没有唯一的ID，可以考虑使用CSS选择器进行定位。CSS选择器具有灵活的语法，并且在性能上通常比XPath更高效。
3. 类名（class）：如果元素没有唯一的ID或合适的CSS选择器，可以使用元素的类名进行定位。尽量选择具有明确含义的类名，并避免选择过于通用的类名。
4. Name属性：如果元素具有唯一的name属性，可以使用name属性进行定位。但要注意，name属性并不是所有元素都具有的，所以不是一种通用的定位方式。
5. XPath：如果前面的方式都无法定位元素，可以使用XPath进行定位。XPath提供了强大的定位功能，但在性能上相对较低，因为XPath需要遍历整个文档，直到找到匹配的元素。暂无性能对比数据，我觉得好用就用，及时行乐。
6. 标签名（TagName）：如果元素无法使用上述方式进行定位，可以考虑使用标签名进行定位。但要注意，标签名定位方式通常会返回多个匹配的元素，需要结合其他条件来缩小范围。

### 元素定位建议

1. 在定位列表的元素时，尽量根据文本信息定位而不是下标（比如百度首页的左上角，可能顺序会打乱，后台配置）
2. 相对定位时，尽量选择不易改变的元素作为锚点，比如拥有id的元素或者一个目录。比如后台管理系统中的主菜单，比如H5页面的tab
3. 如果关系好，可以让开发多加一些id，不要勉强。现在的前端开发都用的框架，html，css，js等都是由框架定义的了。











