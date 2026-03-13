---
title: Unity游戏框架 DGame —— 基于 TEngine 深度优化演进
tags:
  - Unity
  - 游戏框架
  - 开源项目
categories: Unity游戏框架
date: 2026-03-13
updated: 2026-03-13
description: 基于 TEngine 深度优化演进的 Unity 游戏框架，为商业级游戏开发打造，新增多个核心模块，经过多个商业化游戏及百万DAU项目验证。
top: 1
---

<div align="center">

<img src="https://socialify.git.ci/AmaniDawn/DGame/image?custom_description=%E6%A0%B9%E6%8D%AETEngine%E6%A1%86%E6%9E%B6%EF%BC%8C%E7%BB%93%E5%90%88%E5%AE%9E%E9%99%85%E5%B7%A5%E4%BD%9C%E7%BB%8F%E9%AA%8C%EF%BC%8C%E5%AF%B9%E6%A1%86%E6%9E%B6%E8%BF%9B%E8%A1%8C%E4%BA%86%E4%B8%80%E4%BA%9B%E8%B0%83%E6%95%B4%EF%BC%88%E5%8C%85%E6%8B%AC%E4%BD%86%E4%B8%8D%E9%99%90%E4%BA%8E%E5%B7%A5%E5%85%B7%E3%80%81%E6%8B%93%E5%B1%95%E3%80%81%E9%83%A8%E5%88%86%E5%BA%95%E5%B1%82%E9%80%BB%E8%BE%91%E8%B0%83%E6%95%B4%E4%BC%98%E5%8C%96%EF%BC%89%E3%80%82%E4%B8%8D%E6%8F%90TEngine%E7%9A%84PR%EF%BC%8C%E4%BF%9D%E6%8C%81TEngine%E7%AE%80%E6%B4%81%E7%BA%AF%E5%87%80%E3%80%82&description=1&font=JetBrains+Mono&language=1&logo=https%3A%2F%2Funity.com%2F_next%2Fimage%3Furl%3Dhttps%253A%252F%252Fcdn.sanity.io%252Fimages%252Ffuvbjjlp%252Fproduction%252Faa5ce86e0add266e09ffa222609af4cc94befc7b-250x282.png%26w%3D256%26q%3D75&name=1&pattern=Signal&theme=Light" alt="DGame" width="800"/>

# <span style="background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">DGame</span>

### <span style="color: #666;">基于 TEngine 深度优化演进的 Unity 游戏框架</span>

[![Unity Version](https://img.shields.io/badge/Unity-2021.3.30%2B-blue.svg?style=for-the-badge)](https://unity3d.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/AmaniDawn/DGame?style=for-the-badge&logo=github)](https://github.com/AmaniDawn/DGame/stargazers)

</div>

---

<div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 15px 20px; border-radius: 10px; margin: 20px 0; text-align: center; color: #333;">

> 📝 **本文档由 AI（Claude）自动生成，内容可能存在偏差，如有疑问请参考[源代码](https://github.com/AmaniDawn/DGame)或提交 Issue。**

</div>

## 📖 简介

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 20px; color: white; margin: 20px 0;">

**DGame** 是在 **[TEngine](https://github.com/ALEXTANGXIAO/TEngine)** 基础上深度优化演进的 Unity 游戏框架。保留 TEngine 核心优势的同时，针对商业游戏开发需求**新增了多个核心模块**，并对现有系统进行了**部分优化**。

</div>

<div style="background: rgba(102, 126, 234, 0.1); border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 20px 0;">

✨ **核心优势**

- 🔥 保留 TEngine 核心优势
- 🎯 新增多个商业级核心模块
- ⚡ 对现有系统进行深度优化
- 💎 经过**百万 DAU** 项目验证
- 🌐 **服务器分支同步接入 [Fantasy](https://github.com/qq362946/Fantasy) 框架**

</div>

<div style="background: rgba(240, 147, 251, 0.1); border-left: 4px solid #f093fb; padding: 20px; border-radius: 8px; margin: 20px 0;">

> 💡 **设计理念**：Fantasy 线和 TE 同步接入服务器框架 Fantasy，区别在于 TE 接入的更纯净简洁，本项目会做更多的项目细节和实用工具方法处理。

</div>

---

## ✨ 核心特性

<div style="background: #1a1a2e; padding: 25px; border-radius: 16px; overflow-x: auto;">

| 特性 | 描述 | 状态 |
|:---|:---|:---:|
| 🚀 **模块化设计** | 高内聚低耦合的模块化架构，基于接口的模块管理 | 继承自 TEngine |
| 🔥 **热更新支持** | 集成 HybridCLR，支持全平台 C# 代码热更新 | 继承自 TEngine |
| 📦 **资源管理** | 集成 YooAsset，支持资源分包、边玩边下 | 继承自 TEngine |
| 📋 **配置系统** | 基于 Luban 的配置表解决方案 | 继承自 TEngine |
| 🧩 **流程管理** | 基于状态机的流程系统，管理游戏生命周期 | 继承自 TEngine |
| 🔄 **MonoDriver** | 替代 UpdataDriver，统一生命周期驱动 | ⚡ 优化改进 |
| 🌍 **多语言** | ILocalizationModule，接口驱动、8 种语言支持 | ⚡ 重新实现 |
| ⏱️ **GameTimer** | 替代 TimerModule，支持循环次数限制 | ⚡ 优化改进 |
| 🎲 **MemoryCollector** | 替代 MemoryCollection，Spawn/Release 语义 | ⚡ 优化改进 |
| 🛠️ **编辑器工具** | 工具栏扩展、Spine 助手、Odin 支持、快速创建入口 | 🆕 新增功能 |
| 🎯 **AnimModule** | 封装 Playable API，与 FsmModule 深度集成 | 🆕 新增功能 |
| 🕹️ **InputModule** | 统一输入处理、多点触控、手势识别 | 🆕 新增功能 |
| 🏊 **GameObjectPool** | 专用 GameObject 对象池 | 🆕 新增功能 |
| 🎨 **UIBindComponent** | UI 代码自动生成、UIButton/UIImage/UIText 组件扩展 | 🆕 新增功能 |
| 🔴 **RedDotModule** | 树状结构红点管理，编辑器可视化配置 | 🆕 新增功能 |
| 🎬 **FrameSprite** | 序列帧动画系统，对象池复用 | 🆕 新增功能 |
| 🎮 **GMPanel** | GM 调试面板，配置表驱动 | 🆕 新增功能 |
| 💾 **DataCenter** | 统一数据管理，生命周期事件通知 | 🆕 新增功能 |
| 💽 **ClientSaveDataMgr** | 客户端存档系统，JSON 序列化、按角色存档 | 🆕 新增功能 |
| 📜 **SuperScrollView** | 高性能循环滚动视图 | 🆕 新增功能 |
| 📝 **Text 系统** | 多语言文本系统（G.cs, TextConfigMgr） | 🆕 新增功能 |
| 🔧 **SingletonSystem** | 单例系统 | 🆕 新增功能 |
| 👁️ **GameTickWatcher** | 游戏帧监听 | 🆕 新增功能 |

</div>

---

## 📚 目录

- [🆕 新增功能一览](#-新增功能一览)
- [⚡ 优化改进一览](#-优化改进一览)
- [快速开始](#-快速开始)
- [新增功能详解](#-新增功能详解)
- [优化改进详解](#-优化改进详解)
- [核心模块](#-核心模块)
- [项目结构](#-项目结构)
- [系统要求](#-系统要求)
- [开发指南](#-开发指南)

---

## 🆕 新增功能一览

### Runtime 层

<div style="background: #1a1a2e; padding: 25px; border-radius: 16px; overflow-x: auto;">

| 模块 | 文件路径 | 说明 |
|:---|:---|:---|
| 🎯 **AnimModule** | Runtime/Module/ | 封装 Playable API，与 FsmModule 集成 |
| 🕹️ **InputModule** | Runtime/Module/ | 统一输入处理、多点触控、手势识别 |
| 🏊 **GameObjectPool** | Runtime/Module/ | 专用 GameObject 对象池 |
| ⏱️ **GameTimer** | Runtime/Module/ | 替代 TimerModule，支持循环次数限制 |
| 🔄 **MonoDriver** | Runtime/Module/ | 替代 UpdataDriver |

</div>

### HotFix 层

<div style="background: #1a1a2e; padding: 25px; border-radius: 16px; overflow-x: auto;">

| 模块 | 文件路径 | 说明 |
|:---|:---|:---|
| 🔴 **RedDotModule** | GameLogic/Module/ | 树状结构红点管理，编辑器可视化配置 |
| 💾 **DataCenter** | GameLogic/DataCenter/ | 统一数据管理，生命周期事件通知 |
| 💽 **ClientSaveDataMgr** | GameLogic/DataCenter/ | 客户端存档系统，支持按角色存档 |
| 🎬 **FrameSprite** | GameLogic/Common/ | 序列帧动画系统，对象池复用 |
| 🎮 **GMPanel** | GameLogic/GMPanel/ | GM 调试面板，配置表驱动 |
| 📜 **SuperScrollView** | GameLogic/Module/UIModule/ | 高性能循环滚动视图（ListView/GridView/StaggeredGridView） |
| 📝 **Text 系统** | GameLogic/Text/ | 多语言文本系统（G.cs, TextConfigMgr） |
| 🔧 **SingletonSystem** | GameLogic/SingletonSystem/ | 单例系统 |
| 👤 **PlayerData** | GameLogic/PlayerData/ | 玩家数据管理 |
| 👁️ **GameTickWatcher** | GameLogic/GameTickWatcher/ | 游戏帧监听 |

</div>

### Editor 层

<div style="background: #1a1a2e; padding: 25px; border-radius: 16px; overflow-x: auto;">

| 模块 | 文件路径 | 说明 |
|:---|:---|:---|
| 🛠️ **UnityToolBarExtend** | Editor/ | 工具栏扩展（场景启动、播放模式） |
| 🎨 **SpineModelHelper** | Editor/ | Spine 模型辅助处理 |
| ⚙️ **CreateGameEntry** | Editor/Settings/ | 快速创建 GameEntry 对象 |
| 📦 **Odin** | Editor/Odin/ | Odin 插件支持 |
| 🚪 **OpenFolderHelper** | Editor/OpenFolder/ | 快速打开项目文件夹 |

</div>

---

## ⚡ 优化改进一览

<div style="background: #1a1a2e; padding: 25px; border-radius: 16px; overflow-x: auto;">

| 模块 | TEngine | DGame | 主要改进点 |
|:---|:---|:---|:---|
| ⏱️ **计时器** | TimerModule | GameTimer | 返回对象可操作、支持循环次数限制、DGameLinkedList |
| 🌍 **多语言** | LocalizationModule | ILocalizationModule | 接口驱动设计、8 种语言支持、事件通知机制 |
| 🎲 **内存池** | MemoryCollection | MemoryCollector | Spawn/Release 语义、支持批量释放、Capacity 属性 |
| 🎨 **UI 系统** | 基础组件 | UIBindComponent + 组件扩展 | 代码自动生成、UIButton/UIImage/UIText 组件扩展 |
| 📡 **事件系统** | GameEventMgr | EventDispatcher | 分离设计、接口包装支持 |
| 📝 **日志系统** | Log | DGameLog | 更简洁的日志封装 |

</div>

---

## 🚀 快速开始

### 环境要求

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">

**Unity 版本**

2021.3.30f1c1+

</div>

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">

**开发环境**

.NET 4.x

</div>

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 12px; color: white; text-align: center;">

**支持平台**

Win / Android / iOS

</div>

</div>

### 快速上手

<div style="background: #263238; color: #aed581; padding: 20px; border-radius: 10px; margin: 15px 0; font-family: 'Consolas', monospace;">

**1. 克隆项目**

```bash
git clone https://github.com/AmaniDawn/DGame.git
```

**2. 打开项目**

使用 Unity 2021.3.30f1c1 打开 `GameUnity` 目录

**3. 运行项目**

打开 `Assets/Scenes` 下的 `LaunchScene` 启动场景，点击运行按钮启动游戏

**4. 热更新设置（可选）**

- 运行菜单 `HybridCLR/Install...` 安装 HybridCLR
- 运行菜单 `HybridCLR/Generate/All` 生成必要的代码
- 构建热更新 DLL 和资源包

</div>

---

## 🎁 新增功能详解

### 🛠️ 编辑器工具 (Editor)

<div style="background: #e9ecef; padding: 20px; border-radius: 10px; margin: 15px 0; color: #333;">

| 工具 | 功能 |
|:---|:---|
| **UnityToolBarExtend** | 左右工具栏增强、场景快速启动、播放模式控制 |
| **SpineModelHelper** | Spine 模型辅助处理 |
| **CreateGameEntry** | 一键创建 GameEntry 对象 |
| **Odin** | Odin 插件支持 |
| **OpenFolderHelper** | 快速打开项目文件夹 |

</div>

---

### 🔴 红点系统 (RedDotModule)

<div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**树状结构红点管理** · 编辑器可视化配置 · 代码自动生成

</div>

```csharp
// 创建红点
var redDot = CreateRedDot(RedDotPathDefine_Gen.Main.Bag.Equipment, parentTransform);

// 更新红点状态
RedDotModule.Instance.SetState(RedDotPathDefine_Gen.Main.Bag.Equipment, true);

// 设置红点数量
RedDotModule.Instance.SetNumber(RedDotPathDefine_Gen.Main.Quest.Daily, 5);
```

---

### 🎬 序列帧动画 (FrameSprite)

<div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 25px; border-radius: 16px; color: #333; margin: 20px 0;">

**高效序列帧播放** · 对象池复用 · 异步加载

</div>

```csharp
var frameSprite = await FrameSpriteMgr.PlayAsync(
    parent: transform,
    atlasName: "EffectAtlas",
    spriteNames: new[] { "frame_0", "frame_1", "frame_2" },
    frameRate: 30,
    loopCount: 1
);
```

---

### 🎮 GM 系统 (GMPanel)

<div style="background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); padding: 25px; border-radius: 16px; color: #333; margin: 20px 0;">

**配置表驱动的调试面板**

</div>

```csharp
GMModule.ExecuteCommand("AddGold 1000");
GMModule.ExecuteClientGm(GmCommandId.AddGold);
```

---

### 💾 数据中心 (DataCenter)

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**统一数据管理** · 生命周期事件通知

</div>

```csharp
public class PlayerData : DataBase
{
    public int Level;
    public long Gold;
}

var playerData = DataCenterModule.GetData<PlayerData>();
playerData.Gold += 100;
```

---

### 💽 客户端存档系统 (ClientSaveDataMgr)

<div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 25px; border-radius: 16px; color: #333; margin: 20px 0;">

**JSON 序列化** · PlayerPrefs 本地存储 · **多角色支持**

</div>

**特性：**
- JSON 序列化/反序列化
- PlayerPrefs 本地存储
- 支持按角色 ID 存档（多角色支持）
- 自动加载、批量保存

```csharp
// 定义存档类
[ClientSaveData("Setting", PerRoleID = false)]
public class SettingSaveData : BaseClientSaveData
{
    public int MusicVolume = 50;
    public bool IsFirstLogin = true;
}

// 获取存档（自动加载）
var setting = ClientSaveDataMgr.Instance.GetSaveData<SettingSaveData>();
setting.MusicVolume = 80;
setting.Save();  // 保存

// 批量保存所有存档
ClientSaveDataMgr.Instance.SaveAllClientData();
```

---

### 🎯 动画模块 (AnimModule)

<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**封装 Playable API** · 与 FsmModule 深度集成

</div>

```csharp
public class IdleState : BaseState<Character>
{
    public override void OnEnter()
    {
        PlayAnimation("Idle");  // 状态切换自动播放动画
    }
}
```

---

### 🕹️ 输入模块 (InputModule)

<div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**统一输入处理** · 多点触控支持

</div>

```csharp
var inputModule = ModuleSystem.GetModule<IInputModule>();
inputModule.OnClick += (position) => { };
inputModule.OnLongPress += (position, duration) => { };
inputModule.OnDrag += (delta) => { };
```

---

### 🏊 GameObject 对象池 (GameObjectPoolModule)

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**专用 GameObject 对象池**

</div>

```csharp
var pool = ModuleSystem.GetModule<IGameObjectPoolModule>();
var obj = pool.Spawn("Bullet");
pool.Despawn(obj);
```

---

### 📜 SuperScrollView

<div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 25px; border-radius: 16px; color: #333; margin: 20px 0;">

**高性能循环滚动视图**

</div>

```csharp
loopListView.InitListView(itemCount, (index, item) => {
    var itemLogic = item as MyItem;
    itemLogic.SetItemData(index);
    return itemLogic;
});
```

---

### 📝 Text 系统

<div style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**多语言文本系统**（G.cs, TextConfigMgr, TextDefine）

</div>

---

### 🔧 SingletonSystem

<div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 25px; border-radius: 16px; color: #333; margin: 20px 0;">

**单例系统** · 统一管理单例模式

</div>

---

### 👁️ GameTickWatcher

<div style="background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%); padding: 25px; border-radius: 16px; color: white; margin: 20px 0;">

**游戏帧监听** · 用于性能监控和调试

</div>

---

## ⚡ 优化改进详解

### ⏱️ GameTimer（替代 TimerModule）

<div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 12px; margin: 15px 0; color: #333;">

- 返回可操作对象，支持循环次数限制
- 使用 DGameLinkedList 优化链表结构

</div>

```csharp
var timer = GameTimer.CreateLoopGameTimer(1f, () => DLogger.Info("每秒执行"));
timer.LoopCount = 5;  // 只执行 5 次
timer.Paused = true;  // 暂停
```

---

### 🌍 ILocalizationModule（替代 LocalizationModule）

<div style="background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); padding: 20px; border-radius: 12px; margin: 15px 0; color: #333;">

- 接口驱动设计
- 8 种语言支持（中/英/繁/韩/日/越/印尼）
- 事件通知机制

</div>

---

### 🎲 MemoryCollector（替代 MemoryCollection）

<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 20px; border-radius: 12px; margin: 15px 0; color: white;">

- Spawn/Release 语义更清晰
- 支持批量释放

</div>

```csharp
var obj = MemoryCollector.Spawn<MyClass>();
MemoryCollector.Release(obj);
```

---

### 🎨 UI 系统（UIBindComponent + 组件扩展）

<div style="background: linear-gradient(135deg, #d63384 0%, #c2185b 100%); padding: 20px; border-radius: 12px; margin: 15px 0; color: white; font-weight: bold;">

**组件扩展**

</div>

<div style="background: #e9ecef; padding: 20px; border-radius: 10px; margin: 15px 0; color: #333;">

| 组件 | 功能 |
|:---|:---|
| UIButton | 点击保护、缩放效果、音效、长按、双击 |
| UIImage | 镜像翻转、圆角、遮罩 |
| UIText | 渐变色、字间距、圆形排列、阴影 |
| RichTextItem | 图文混排、超链接、动画表情 |

</div>

---

### 📡 EventDispatcher（替代 GameEventMgr）

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin: 15px 0; color: white;">

- 分离设计
- 接口包装支持

</div>

---

## 🧩 核心模块

<div style="background: #1a1a2e; padding: 25px; border-radius: 16px; overflow-x: auto;">

| 模块 | 接口 | 描述 | 来源 |
|:---|:---|:---|:---|
| 🎮 Mono 驱动 | `IMonoDriver` | Unity 生命周期驱动 | TEngine |
| 📦 资源管理 | `IResourceModule` | YooAsset 资源管理 | TEngine |
| 🔄 状态机 | `IFsmModule` | 有限状态机管理 | TEngine |
| 🔊 音频 | `IAudioModule` | 背景音乐与音效管理 | TEngine |
| 🎬 场景 | `ISceneModule` | 场景加载与切换 | TEngine |
| 🌍 多语言 | `ILocalizationModule` | 8 种语言支持，接口驱动 | ⚡ 重新实现 |
| 🏊 对象池 | `IObjectPoolModule` | 对象池管理 | TEngine |
| ⏱️ 计时器 | `IGameTimerModule` | 游戏计时器 | ⚡ 优化 |
| 🎲 内存池 | `MemoryPool` | 非托管内存池 | ⚡ 优化 |
| 🎯 动画 | `IAnimModule` | 动画控制 | 🆕 新增 |
| 🕹️ 输入 | `IInputModule` | 输入处理 | 🆕 新增 |
| 🏊 GameObject 池 | `IGameObjectPoolModule` | GameObject 对象池 | 🆕 新增 |

</div>

---

## 📁 项目结构

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0; font-family: 'Consolas', monospace; font-size: 0.85em; overflow-x: auto;">

```
DGame/
├── GameConfig/              # 游戏配置（Luban）
├── GameRelease/             # 发布版本输出
├── GameUnity/               # Unity 主项目
│   ├── Assets/
│   │   ├── DGame/           # DGame 框架核心
│   │   │   ├── Editor/      # 🆕 编辑器工具（工具栏扩展、Spine 助手等）
│   │   │   └── Runtime/     # 框架运行时代码
│   │   │       ├── Core/    # 核心系统（日志、内存池、模块系统、事件）
│   │   │       └── Module/  # 功能模块（GameTimer、AnimModule、InputModule等）
│   │   └── Scripts/
│   │       ├── HotFix/      # 热更新代码
│   │       │   ├── GameBase/      # 基础框架程序集
│   │       │   ├── GameProto/     # 配置协议程序集
│   │       │   └── GameLogic/     # 业务逻辑程序集
│   │       │       ├── Module/    # 🆕 红点系统、数据中心、UI 系统等
│   │       │       ├── Common/    # 🆕 序列帧动画等
│   │       │       └── GMPanel/   # 🆕 GM 系统
│   │       └── Launcher/    # 启动器代码（AOT）
│   └── ...
├── Tools/                   # 开发工具
└── UnityPackage/            # Unity 包导出
```

</div>

---

## 💻 系统要求

<div style="background: #e9ecef; padding: 20px; border-radius: 10px; margin: 15px 0; color: #333;">

| 项目 | 要求 |
|:---|:---|
| **Unity 版本** | 2021.3.30f1c1（推荐）或更高 |
| **开发环境** | .NET 4.x / .NET Standard 2.1 |
| **支持平台** | Windows、Android、iOS |

</div>

---

## 📖 开发指南

### 计时器使用（⚡ 优化版）

```csharp
var timer = GameTimer.CreateLoopGameTimer(1f, () => DLogger.Info("每秒执行"));
timer.LoopCount = 5;  // 只执行 5 次
```

---

### 红点系统使用（🆕 新增）

```csharp
RedDotModule.Instance.SetState(RedDotPathDefine_Gen.Main_Bag_Equipment, true);
AddUIEvent(RedDotPathDefine_Gen.Main_Bag, OnRedDotChanged);
```

---

### 序列帧动画（🆕 新增）

```csharp
var frameSprite = await FrameSpriteMgr.PlayAsync(transform, "EffectAtlas", spriteNameArray, 30, 1);
```

---

### GM 命令（🆕 新增）

```csharp
GMModule.ExecuteCommand("AddGold 1000");
GMModule.ExecuteClientGm(GmCommandId.AddGold);
```

---

### 存档系统（🆕 新增）

```csharp
// 定义存档类
[ClientSaveData("Setting", PerRoleID = false)]
public class SettingSaveData : BaseClientSaveData
{
    public int MusicVolume = 50;
}

// 获取存档
var setting = ClientSaveDataMgr.Instance.GetSaveData<SettingSaveData>();
setting.MusicVolume = 80;
setting.Save();

// 批量保存
ClientSaveDataMgr.Instance.SaveAllClientData();
```

---

### UI 开发

```csharp
public class MyWindow : UIWindow
{
    private Button m_btnClose;

    protected override void ScriptGenerator()
    {
        m_btnClose = FindChildComponent<Button>("m_btnClose");
        m_btnClose.ClickProtect = true;
        m_btnClose.ClickScale = 0.9f;
    }
}

await UIModule.Instance.ShowWindowAsync<MyWindow>(userData);
```

---

<div align="center">

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 60px; border-radius: 24px; box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4); margin: 40px 0;">

# 🔗 访问仓库

[![GitHub](https://img.shields.io/badge/GitHub-AmaniDawn/DGame-white?style=for-the-badge&logo=github)](https://github.com/AmaniDawn/DGame)

</div>

---

## 🙏 致谢

本项目基于 **[TEngine](https://github.com/ALEXTANGXIAO/TEngine)** 框架进行深度优化演进，感谢 TEngine 项目的优秀架构设计和核心功能实现。

<div style="margin-top: 30px; color: #888;">

💻 **MIT License** © 2026

</div>

</div>
