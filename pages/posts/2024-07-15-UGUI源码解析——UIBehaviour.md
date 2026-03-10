---
title: UGUI源码解析——UIBehaviour
tags: 
categories: 
mathjax: true
description: UI组件的基类，继承MonoBehaviour
date: 2024-07-15
updated: 2024-07-15
---

> UIBehaviour：是所有UI组件的基类，UI组件都是直接或者间接继承UIBehaviour这个抽象类，<font color=red>它继承自MonoBehaviour，所以拥有和Unity相同的生命周期。</font>

#### 源码解析

>只会在物体创建时执行一次 ，与Mono Awake调用时机和次数保持一致

```c#
 protected virtual void Awake(){}
```

>在物体显示时执行一次，与Mono OnEnable一致

```c#
 protected virtual void OnEnable(){}
```

>在物体第一次激活时执行一次，在Awake之后，第一帧Update之前执行，与Mono Start一致

```c#
 protected virtual void Start(){}
```

>在物体隐藏时执行一次，与Mono OnDisable 一致

```c#
 protected virtual void OnDisable(){}
```

>在当前界面被销毁时调用一次，与Mono Destroy一致

```c#
 protected virtual void OnDestroy(){}
```

>在编辑器模式下：当脚本被加载(禁用或启用)或者Inspector窗口的值出现变化的时候会被调用，使用时添加#if UNITY_EDITOR

```c#
protected virtual void OnValidate(){}
```

>在编辑器模式下：当脚本恢复默认值时调用，使用时添加#if UNITY_EDITOR

```c#
protected virtual void Reset(){}
```

>当RectTransform变化时候调用，Anchors、Pivot、Width、Height变化时调用，Transform、Rotation、Scale变化时不调用

```c#
protected virtual void OnRectTransformDimensionsChange(){}
```

>在父物体变化之前调用

```c#
protected virtual void OnBeforeTransformParentChanged(){}
```

>在父物体变化之后调用

```c#
protected virtual void OnTransformParentChanged(){}
```

>在Canvas状态变化时调用，比如禁用Canvas组件

```c#
protected virtual void OnDidApplyAnimationProperties(){}
```

>在Canvas Group变化时调用

```c#
protected virtual void OnCanvasGroupChanged(){}
```

>当应用动画属性时调用

```c#
protected virtual void OnCanvasHierarchyChanged(){}
```

>获取GameObject和Component是否处于激活状态

```c#
public virtual bool IsActive()
{
    return isActiveAndEnabled;
}
```

>获取GameObject和Component是否被销毁

```c#
public bool IsDestroyed()
{
    return this == null;
}
```

