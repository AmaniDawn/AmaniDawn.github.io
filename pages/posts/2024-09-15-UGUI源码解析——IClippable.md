---
title: UGUI源码解析——IClippable
tags: 
categories: 
mathjax: true
description: 裁剪接口(被裁剪者)
date: 2024-09-15
updated: 2024-09-15
---

>IClippable：MaskableGraphic继承此接口

#### 源码解析

>IClipper：裁剪接口（裁剪者），RectMask2D继承此接口。接口中只有一个方法，在子类中实现PerformClipping，此方法在布局重建后图像重建前执行
>
>首先将每个实现了IClipper接口的对象添加到待裁剪序列中，在CanvasUpdateRegistry类中的PerformUpdate里调用了Cull方法执行裁剪序列中每个对象的PerformClipping方法参与Canvas的更新

```c#
/// <summary>
/// 可以用来接收裁剪回调作为画布更新循环的一部分
/// </summary>
public interface IClipper
{
    /// <summary>
    /// 删除/剪辑子元素的函数
    /// </summary>
    /// <remarks>
    /// 在Canvas更新循环的布局之后和图形更新之前调用。
    /// </remarks>
    void PerformClipping();
}
```

>IClippable接口

```c#
/// <summary>
///   Interface for elements that can be clipped if they are under an IClipper
/// </summary>
public interface IClippable
{
    /// <summary>
    /// 实现此接口的游戏物体
    /// </summary>
    GameObject gameObject { get; }

    /// <summary>
    /// 重新计算待裁剪对象（MaskUtilities的Notify2DMaskStateChanged调用）
    /// </summary>
    void RecalculateClipping();

    /// <summary>
    /// 实现此接口的游戏物体的 RectTransform
    /// </summary>
    RectTransform rectTransform { get; }

    /// <summary>
    /// 裁剪和剔除给定的矩形（RectMask2D的PerformClipping调用）
    /// </summary>
    /// <param name="clipRect">要剪切的矩形</param>
    /// <param name="validRect">Rect是否有效?如果不是，则矩形的大小为0</param>
    void Cull(Rect clipRect, bool validRect);

    /// <summary>
    /// 设置裁剪矩形（RectMask2D的PerformClipping调用）
    /// </summary>
    /// <param name="value">用于剪切的矩形<</param>
    /// <param name="validRect">rect是否有效</param>
    void SetClipRect(Rect value, bool validRect);
    
    /// <summary>
    /// 设置渐变度（RectMask2D的PerformClipping调用）
    /// </summary>
    void SetClipSoftness(Vector2 clipSoftness);
}
```

