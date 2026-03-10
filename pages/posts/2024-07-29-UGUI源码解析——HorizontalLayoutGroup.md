---
title: UGUI源码解析——HorizontalLayoutGroup
tags: 
categories: 
mathjax: true
description: >-
date: 2024-07-29
updated: 2024-07-29
---

>HorizontalLayoutGroup：继承自HorizontalOrVerticalLayoutGroup，HorizontalOrVerticalLayoutGroup继承自LayoutGroup，是水平布局组件。会受到LayoutElement组件的影响。

#### 源码解析

[**UGUI源码解析——LayoutGroup**](https://azurebubble.github.io/posts/51e1a8f9.html)

> CalculateLayoutInputHorizontal：由布局系统调用。也请参见ILayoutElement。

```c#
// 实现了计算并设置m_TotalMinSize、m_TotalPreferredSize、m_TotalFlexibleSize属性值，调用了基类LayoutGroup中的SetLayoutInputForAxis方法
public override void CalculateLayoutInputHorizontal()
{
    base.CalculateLayoutInputHorizontal();
    CalcAlongAxis(0, false);
}
```

> CalculateLayoutInputVertical：

```c#
public override void CalculateLayoutInputVertical()
{
    CalcAlongAxis(1, false);
}
```

> SetLayoutHorizontal：实现了设置子物体的位置和大小，调用了基类LayoutGroup中的SetChildAlongAxisWithScale或SetChildAlongAxis方法

```c#
public override void SetLayoutHorizontal()
{
    SetChildrenAlongAxis(0, false);
}
```

> SetLayoutHorizontal：实现了设置子物体的位置和大小，调用了基类LayoutGroup中的SetChildAlongAxisWithScale或SetChildAlongAxis方法

```c#
public override void SetLayoutVertical()
{
    SetChildrenAlongAxis(1, false);
}
```

