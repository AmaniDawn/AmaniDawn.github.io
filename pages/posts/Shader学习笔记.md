---
title: Shader学习笔记
date: 2022-11-15
updated: 2022-11-15
tags:
  - Shader
  - Unity
categories:
  - 学习笔记
---

### 一、升级旧项目为 URP 项目（Unity 2021.3.5f1c1）

- **1、安装 URP 包**

  - 在 Unity 的 Window 菜单中单击 Package Manager 选项，打开 Package Manager 窗口。

  - 在  Package Manager 窗口的左上角的下拉菜单中选择 Unity Registry 选项，窗口左侧就会显示出所有的 Unity 官方拓展包。

  - 找到 Universal RP ，或者也可以直接在右上角的搜索框中输入 "Universal RP" 进行搜索，然后点击窗口右下角的 Install 进行安装。
  - ![PackageManager窗口](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/PackageManager窗口.jpg)

- **2、创建 UPR Asset**
  - Unity 在 URP 中开放给用户很多调节渲染质量的设置选项，用户可以通过 URP Asset 文件进行设置，创建步骤如下：
    - 在 Project 窗口下的 Assets 目录下单击鼠标右键选择 Create ➡ Folder ➡ 命名文件为 Settings(为了文件资源工整)。
    - 在上述 Settings 文件夹中依次右键 Create ➡ Rendering ➡ URP Asset(with Universal Renderer)，Unity 会在项目资源的当前路径中自动创建出 UniversalRenderPipelineAsset 和 UniversalRenderPipelineAsset_Renderer 两个文件。
  - ![创建URPAsset](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/创建URPAsset.jpg)
  - 选中 UniversalRenderPipelineAsset 文件之后，即可在面板中设置 Anti Aliasing(抗锯齿)、Render Scale(渲染倍率)、Cast Shadows(投射阴影)、Shadow Resolution(阴影分辨率)等一系列影响渲染质量的选项。
  - ![URPAsset设置面板](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/URPAsset设置面板.jpg)
  - 创建了 URP Asset 之后，还需要将其添加到当前项目的图形设置中才能生效，操作步骤如下：
    - 在 Edit 菜单中选择 Project Settings ➡ Graphics 选项窗口中，将之前创建好的 URP Asset 文件拖动到 Scriptable Render Pipeline Settings 中即可。
  - ![Unity项目设置窗口](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/Unity项目设置窗口.jpg)

- **3、升级旧材质**

  - 使用了新的 URP Asset 之后，项目中的所有物体会立刻变成紫色，不必担心，这是由于 URP 与旧项目中的 Shader 不兼容导致的，只需要在 Edit 菜单中依次点击 Window ➡ Rendering ➡ Render Pipeline Converter，即可将当前项目中的所有材质升级为 URP的内置材质。
  - ![升级旧材质为URP内置材质](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/升级旧材质为URP内置材质.jpg)

  - 旧材质升级为 URP 材质的 Shader 映射
  - ![旧材质升级为URP材质的Shader映射](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/旧材质升级为URP材质的Shader映射.jpg)
