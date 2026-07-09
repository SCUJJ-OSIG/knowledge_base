weigths: 指的是训练好的网络模型，用来初始化网络权重
cfg：为configuration的缩写，指的是网络结构，一般对应models文件夹下的xxx.yaml文件
data：训练数据路径，一般为data文件夹下的xxx.yaml文件
hyp: 训练网络的一些超参数设置，(一般用不到)
epochs：设置训练的轮数（自己电脑上一般建议先小一点，测试一下，看跑一轮要多久）
batch-size：每次输出给神经网络的图片数，（需要根据自己电脑性能进行调整）
img-size：用于分别设置训练集和测试集的大小。两个数字前者为训练集大小，后者为测试集大小
rect： 是否采用矩形训练
resume： 指定之前训练的网络模型，并继续训练这个模型
nosave： 只保留最后一次的网络模型
notest：只在最后一次进行测试
noautoanchor：是否采用锚点
evolve：是否寻找最优参数
bucket：这个参数是 yolov5 作者将一些东西放在谷歌云盘，可以进行下载
cache-images：是否对图片进行缓存，可以加快训练
image-weights：测试过程中，图像的那些测试地方不太好，对这些不太好的地方加权重
device：训练网络的设备cpu还是gpu
multi-scale：训练过程中对图片进行尺度变换
single-cls：训练数据集是单类别还是多类别
adam：是否采用adam
sync-bn：生效后进行多 GPU 进行分布式训练
local_rank：DistributedDataParallel 单机多卡训练，一般不改动
workers: 多线程训练
project：训练结果保存路径
name： 训练结果保存文件名
exist-ok： 覆盖掉上一次的结果，不新建训练结果文件
quad：在dataloader时采用什么样的方式读取我们的数据
linear-lr：用于对学习速率进行调整，默认为 false，含义是通过余弦函数来降低学习率，生效后按照线性的方式去调整学习率
save_period：用于记录训练日志信息，int 型，默认为 -1
label-smoothing： 对标签进行平滑处理，防止过拟合
freeze：冻结哪些层，不去更新训练这几层的参数
save-period：训练多少次保存一次网络模型
注意：参数含default的为默认值，可以直接在文件进行修改，那么运行时直接python train.py也可；直接在命令行指定也可以。

含action的一般为'store_true',使用该参数则需要在命令行指定。
————————————————

    版权声明：本文为博主原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。

原文链接：https://blog.csdn.net/bruce__ray/article/details/132781640





# 用gpu运行yolov5


https://blog.csdn.net/weixin_68922189/article/details/134448330
