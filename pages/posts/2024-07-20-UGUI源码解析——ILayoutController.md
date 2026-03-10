---
title: UGUI源码解析——ILayoutController
tags: 
categories: 
mathjax: true
description: 挂载了实现ILayoutController的组件的对象被视为一个布局控制器，布局控制器用于设置布局。布局控制器可分为两种：控制自身和控制子布局元素。
date: 2024-07-20
updated: 2024-07-20
---

>ILayoutController：挂载了实现ILayoutController的组件的对象被视为一个布局控制器，布局控制器用于设置布局。布局控制器可分为两种：控制自身和控制子布局元素

#### 源码解析

> SetLayoutHorizontal：由自动布局系统调用的回调函数，先处理布局的水平方面

```c#
void SetLayoutHorizontal();
```

> SetLayoutVertical：由自动布局系统调用的回调函数，先处理布局的垂直方面

```c#
void SetLayoutVertical();
```

