---
title: UGUI源码解析——IMaskable
tags:
categories: UGUI源码解析
mathjax: true
description: 遮罩接口(被遮罩者)
date: 2024-09-15
updated: 2024-09-15
---

>IMaskable：可以在子类中实现RecalculateMasking方法去重新计算遮罩

#### 源码解析

>IMaskable接口

```c#
/// <summary>
///   这个元素可以被遮罩
/// </summary>
public interface IMaskable
{
    /// <summary>
    /// 重新计算所有子元素的遮罩.
    /// </summary>
    /// <remarks>
    /// 使用这个来更新内部状态(重新创建材质等)
    /// </remarks>
    void RecalculateMasking();
}
```

