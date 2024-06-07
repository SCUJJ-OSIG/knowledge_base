.安装 Gradio
pip install gradio
1 1.写个简单的 RGB 转灰度
import gradio as gr
import cv2

def to_black(image):
output = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
return output

interface = gr.Interface(fn=to_black, inputs="image", outputs="image")
interface.launch()

gradio 的核心是它的 gr.Interface 函数，用来构建可视化界面。

fn：放你用来处理的函数

inputs：写你的输入类型，这里输入的是图像，所以是"image"

outputs：写你的输出类型，这里输出的是图像，所以是"image"

最后我们用 interface.lauch()把页面一发布，一个本地静态交互页面就完成了！

在浏览器输入http://127.0.0.1:7860/,查收你的页面：

2.增加 example
我们可以在页面下方添加供用户选择的测试样例。

在 gr.Interface 里的 examples 中放入图片路径，格式为[[路径 1],[路径 2],…]。

import gradio as gr
import cv2

def to_black(image):
output = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
return output

interface = gr.Interface(fn=to_black, inputs="image", outputs="image")
interface.launch()

### 3.创建一个外部访问链接

创建外部访问链接非常简单，只需要 `launch(share=True)`即可，在打印信息中会看到你的外部访问链接。

```
升个级:图像分类pytorch+resnet18
import gradio as gr
import torch
from torchvision import transforms
import requests
from PIL import Image

model = torch.hub.load('pytorch/vision:v0.6.0', 'resnet18', pretrained=True).eval()

# Download human-readable labels for ImageNet.
response = requests.get("https://git.io/JJkYN")
labels = response.text.split("\n")

def predict(inp):
  inp = Image.fromarray(inp.astype('uint8'), 'RGB')
  inp = transforms.ToTensor()(inp).unsqueeze(0)
  with torch.no_grad():
    prediction = torch.nn.functional.softmax(model(inp)[0], dim=0)
  return {labels[i]: float(prediction[i]) for i in range(1000)}

inputs = gr.inputs.Image()
outputs = gr.outputs.Label(num_top_classes=3)
gr.Interface(fn=predict, inputs=inputs, outputs=outputs).launch()

```
