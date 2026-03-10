---
title: UGUI源码解析——ILayoutGroup
tags: 
categories: 
mathjax: true
description: >-
date: 2024-07-20
updated: 2024-07-20
---

>ILayoutGroup：继承自ILayoutController，挂载了实现ILayoutGroup的组件的对象被视为一个布局控制器，用于控制子布局对象，驱动它的子元素的RectTransforms，例如：HorizontalLayoutGroup、VerticalLayoutGroup、GridLayoutGroup。

#### 源码解析

>继承自ILayoutController

```c#
public interface ILayoutGroup : ILayoutController
{
}
```

