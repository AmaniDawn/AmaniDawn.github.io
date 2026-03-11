---
title: UGUI源码解析——IClipper
tags:
categories: UGUI源码解析
mathjax: true
description: 裁剪接口（裁剪者）
date: 2024-07-17
updated: 2024-07-17
---

>IClipper：裁剪接口（裁剪者），RectMask2D继承此接口

```c#
// 子类实现PerformClipping
public interface IClipper
{
     /// <summary>
     /// 函数用于筛选/剪辑子元素
     /// </summary>
     /// <remarks>
     /// CanvasUpdateRegistry类中的PerformUpdate里调用了Cull方法执行裁剪
     /// 在Canvas更新循环的布局之后和图形更新之前调用
     /// </remarks>
     void PerformClipping();
}
```

