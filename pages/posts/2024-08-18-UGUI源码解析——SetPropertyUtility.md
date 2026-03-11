---
title: UGUI源码解析——SetPropertyUtility
tags:
categories: UGUI源码解析
mathjax: true
description: 设置UI元素属性的静态工具类。
date: 2024-08-18
updated: 2024-08-18
---

> SetPropertyUtility：设置UI元素属性的静态工具类。

#### 源码解析

>SetColor:修改颜色值，如果新传入的颜色的RGBA和就颜色相同则不进行修改

```	c#
public static bool SetColor(ref Color currentValue, Color newValue)
{
    if (currentValue.r == newValue.r && currentValue.g == newValue.g && currentValue.b == newValue.b && currentValue.a == newValue.a)
        return false;

    currentValue = newValue;
    return true;
}
```

>SetStruct:比较两个结构体的值，如果为不一样才进行更新

```	c#
public static bool SetStruct<T>(ref T currentValue, T newValue) where T : struct
{
    if (EqualityComparer<T>.Default.Equals(currentValue, newValue))
        return false;

    currentValue = newValue;
    return true;
}
```

>SetClass:比较两个类的值，如果不一样且都不为空才进行更新

```	c#
public static bool SetClass<T>(ref T currentValue, T newValue) where T : class
{
    if ((currentValue == null && newValue == null) || (currentValue != null && currentValue.Equals(newValue)))
        return false;

    currentValue = newValue;
    return true;
}
```

