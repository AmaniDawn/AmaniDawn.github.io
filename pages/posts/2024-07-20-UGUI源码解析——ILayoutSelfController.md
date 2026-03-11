---
title: UGUI源码解析——ILayoutSelfController
path: /posts/ugui-ilayoutselfcontroller
tags:
categories: UGUI源码解析
mathjax: true
description: >-
date: 2024-07-20
updated: 2024-07-20
---

>ILayoutSelfController：继承自ILayoutController(布局控制器)，挂载了实现ILayoutSelfController的组件的对象被视为一个布局控制器，用于控制自身布局对象，例如：ContentSizeFitter、AspectRatioFitter。

#### 源码解析

>继承自ILayoutController，用于驱动自身的RectTransform，调用 `ILayoutController.SetLayoutHorizontal` 处理水平布局部分，调用 `ILayoutController.SetLayoutVertical` 处理垂直布局部分。可以改变 RectTransform 的高度、宽度、位置和旋转。

```c#
public interface ILayoutSelfController : ILayoutController
{
}
```

