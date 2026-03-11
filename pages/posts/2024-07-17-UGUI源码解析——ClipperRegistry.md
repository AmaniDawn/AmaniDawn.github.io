---
title: UGUI源码解析——ClipperRegistry
path: /posts/ugui-clipperregistry
tags:
categories: UGUI源码解析
mathjax: true
description: 一个裁剪注册器单例
date: 2024-07-18
updated: 2024-07-18
---

> ClipperRegister：是一个裁剪注册器单例，用于跟踪场景中存在的所有IClipper。
>
> 这在CanvasUpdate循环期间用于剔除可剪裁元素。剪裁在布局之后但在图形更新之前调用。

#### 源码解析

> 单例

```c#
// 单例获取
static ClipperRegistry s_Instance;
public static ClipperRegistry instance
{
    get
    {
        if (s_Instance == null)
            s_Instance = new ClipperRegistry();
        return s_Instance;
    }
}
```

>保护类型的构造函数，这里面声明了一个空的带有具体类型的字典，是为了在AOT平台中能够识别使用前面说到的IndexedSet自定义容器中的字典容器。
>
>类型的可参考xLua热更新就需要给每个泛型容器预先定义一个空的具体类型的容器。

```c#
protected ClipperRegistry()
{
#pragma warning disable 168
    Dictionary<IClipper, int> emptyIClipperDic;
#pragma warning restore 168
}
```

>Register：将裁剪对象添加到m_Clippers序列中

```c#
public static void Register(IClipper c)
{
    if (c == null)
        return;
    instance.m_Clippers.AddUnique(c);
}
```

> Cull：对所有注册的IClipper执行剪辑，在CanvasUpdateRegistry类中的PerformUpdate中调用了这个方法，可回顾查看

```c#
public void Cull()
{
    for (var i = 0; i < m_Clippers.Count; ++i)
    {
        m_Clippers[i].PerformClipping();
    }
}
```

> Unregister：取消注册的IClipper元素

```c#
public static void Unregister(IClipper c)
{
	instance.m_Clippers.Remove(c);
}
```

