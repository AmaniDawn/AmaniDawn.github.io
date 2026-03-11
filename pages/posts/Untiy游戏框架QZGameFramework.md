---
title: Untiy游戏框架QZGameFramework
tags:
categories:
date: 2024-01-06
updated: 2024-01-06
description: 已停止维护，新维护框架地址[**《DGame》**](https://github.com/AmaniDawn/DGame)
---

### 框架仓库链接——[**《QZGameFramework》**](https://github.com/AzureBubble/QZGameFramework)

#### <span style="color: #FF0000; background-color: #FFFF00; padding: 4px 8px; border-radius: 4px; font-weight: bold;">⚠ 已停止维护，新维护框架地址 [《DGame》](https://github.com/AmaniDawn/DGame)（新框架经过多个成熟商业项目以及百万DAU项目验证）</span>

> 本框架的基础是在本人参加多个项目，并且查阅积累了各类优秀代码后，自己总结优化的一个较为通用且易用的简易游戏框架，并会在未来自我能力提升的同时继续优化更新此框架，目标是一个适用于新手入门和中小公司节约成本的前提下的涵盖前后端Unity游戏框架(目前后端服务器还在学习中...)。

### Unity Editor 编辑器工具

> 本框架中的工具是原创+魔改实现的。

#### ExcelTool —— 读取 Excel 配置表工具

> 主要包含两种读表方式：Json和Binary。可自定义存储路径。
>
> 配置表规则
> 	第一行：字段名(如修改规则，请更改 ExcelTool 脚本中的 BEGIN_VARIABLE_NAME_INDEX 变量)
> 	第二行：字段类型(字段类型支持：int,float,bool,string)
> 	如需增加新的字段类型读写规则，请在任务列表中找到对应的位置添加对应字段类型处理规则即可
> 	(如修改规则，请更改 ExcelTool 脚本中的 BEGIN_VARIABLE_TYPE_INDEX 变量)
> 	第三行：主键(key)，通过key来标识唯一主键(Json文件默认 id 为主键，不以自定义key为规则)
> 	(如修改规则，请更改 ExcelTool 脚本中的 BEGIN_KEY_INDEX 变量)
> 	第四行：描述信息(可选：增加注释，便于阅读理解)
> 	(如修改规则，请更改 ExcelTool 脚本中的 BEGIN_DESCRIPTION_INDEX 变量)
> 	第五行~第n行：具体数据信息
> 	Excel 下的表名决定数据结构类名，容器类名，二进制文件名
> 	(如修改规则，请更改 ExcelTool 脚本中的 BEGIN_INDEX 变量)
>
> 目前只支持int、float、bool、string四种数据类型配置表读取，如需增加，可直接打开ExcelTool脚本找到TODO任务列表添加即可。

![ExcelTool1](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/ExcelTool1.png)

#### ABTool —— 资源服务器AB包上传工具

>本工具提供了AB包一键上传AB资源文件到指定资源服务器。使用的是MD5码加密生成的AB包对比文件。下载配合使用ABUpdateMgr脚本使用即可。

![ABTool1](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/ABTool1.png)

#### LuaTool —— Lua脚本一键生成txt后缀并移动到指定AB包和文件夹工具

> 本工具是为了方便Lua文件的迁移。

![LuaTool1](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/LuaTool1.png)

#### DialogueTool —— 对话树编辑器工具

> 利用树的特性和UIToolkit编写的一个对话树插件，快速编辑剧情对话分支。对应的每个节点的具体行为逻辑，继承顺序节点和分支节点的基类重写对应方法即可。

![DialogueTreeTool](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/DialogueTreeTool.png)

![DialogueTreeTool](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/DialogueTreeTool1.png)

![DialogueTreeTool](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/DialogueTreeTool2.png)

#### BehaviourTreeTool —— 行为树编辑器

> 一个简单的可视化行为树编辑器工具，自定义节点，只需要继承指定的Action类，decoration等节点类即可。

![BehaviourTool](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/BehaviourTool1.png)

![BehaviourTool](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/BehaviourTool2.png)

![BehaviourTool](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/QZGameFramework/BehaviourTool3.png)

### Unity框架

#### 成就管理器

> 一个简易的使用观察者实现的成就系统，待完善。

#### 事件中心模块

> 分发消息

#### 有限状态机模块

> 通用的FSM系统：状态包含一个数据黑板。

#### 输入系统

>命令模式实现的一个旧输入系统监听操纵。

#### 背包系统

> 待完善

#### 音乐管理系统

> 结合对象池和资源加载模块实现的音乐管理器

#### 对象池模块

>

#### 包管理器模块

#### 数据持久化模块

#### 场景切换管理器

#### 单例模式管理器

> 这是一个管理全局所有单例的模块：管理全局所有的单例，相对于传统的单例模式创建，这样更便于对单例的管理和销毁，且如果需要进行帧更新的单例可以继承IUpdateSingleton接口即可实现单例帧更新函数OnUpdate，且这个帧更新的单例可以单独设置优先级，控制单例的帧更新顺序。

#### 自动化UI框架

> 搭建好界面后，一键生成通用UI窗口脚本和UI元素脚本并挂载在窗口GameObject上

#### Timer计时器

#### SceneName特性

> [SceneName]特性标记string变量，可快速在Inspector窗口通过下拉框选择场景

#### ReadOnly特性

> 编辑在Inspector显示但只读的变量属性，可通过后面的单选框开启关闭只读绘制。

