---
title: UGUI源码解析——ContentSizeFitter
path: /posts/ugui-contentsizefitter
tags:
categories: UGUI源码解析
mathjax: true
description: 继承了ILayoutElement和ILayoutSelfController，是调整对象自适应的组件。
date: 2024-08-06
updated: 2024-08-06
---

>ContentSizeFitter：它用于自适应对象尺寸，根据ILayoutElement接口的子物体调整自身大小。在使用时要注意，挂载ContentSizeFitter后，大小变化可能需要下一帧生效，可通过调用SetLayoutHorizontal或ForceRebuildLayoutImmediate方法强制更新。
>
>ContentSizeFitter不改变子物体的大小和位置，而是根据子物体(ILayoutElement)来改变自身的尺寸
>ContentSizeFitter所[挂载](https://so.csdn.net/so/search?q=挂载&spm=1001.2101.3001.7020)的对象上必须挂载了实现ILayoutElement接口的组件

#### 源码解析

>FitMode：自适应尺寸适合模式。

```c#
public enum FitMode
{
    /// <summary>
    /// 不做任何大小调整
    /// </summary>
    Unconstrained,
    /// <summary>
    /// 将大小调整为内容的最小大小
    /// </summary>
    MinSize,
    /// <summary>
    /// 将大小调整为内容的首选大小
    /// </summary>
    PreferredSize
}
```

> 一些字段参数

```c#
/// <summary>
/// 用于宽度自适应尺寸适合模式。默认是不做任何调整
/// </summary>
[SerializeField] protected FitMode m_HorizontalFit = FitMode.Unconstrained;
public FitMode horizontalFit { get { return m_HorizontalFit; } set { if (SetPropertyUtility.SetStruct(ref m_HorizontalFit, value)) SetDirty(); } }

/// <summary>
/// 用于高度自适应尺寸适合模式。默认是不做任何调整
/// </summary>
[SerializeField] protected FitMode m_VerticalFit = FitMode.Unconstrained;
public FitMode verticalFit { get { return m_VerticalFit; } set { if (SetPropertyUtility.SetStruct(ref m_VerticalFit, value)) SetDirty(); } }

// 获取当前挂载ContentSizeFitter组件对象的RectTransform
[System.NonSerialized] private RectTransform m_Rect;
private RectTransform rectTransform
{
    get
    {
        if (m_Rect == null)
            m_Rect = GetComponent<RectTransform>();
        return m_Rect;
    }
}
```

> 生命周期

```c#
protected override void OnEnable()
{
    base.OnEnable();
    SetDirty();
}

protected override void OnDisable()
{
     // 清空追踪器
     m_Tracker.Clear();
    // 强制重构布局
     LayoutRebuilder.MarkLayoutForRebuild(rectTransform);
     base.OnDisable();
}

// 如果关联的 RectTransform 发生改变则调用这个函数
protected override void OnRectTransformDimensionsChange()
{
    SetDirty();
}

#if UNITY_EDITOR
    protected override void OnValidate()
    {
        SetDirty();
    }
#endif
```

> SetDirty：强制重建布局

```c#
protected void SetDirty()
{
    if (!IsActive())
        return;
	// 如果是激活状态 强制重构布局
    LayoutRebuilder.MarkLayoutForRebuild(rectTransform);
}
```

> SetLayoutHorizontal：计算并将大小的水平分量应用于RectTransform

```c#
public virtual void SetLayoutHorizontal()
{
    m_Tracker.Clear();
    HandleSelfFittingAlongAxis(0);
}
```

> SetLayoutVertical：计算并将大小的垂直分量应用于RectTransform

```c#
public virtual void SetLayoutVertical()
{
    HandleSelfFittingAlongAxis(1);
}
```

> HandleSelfFittingAlongAxis：设置对象的位置和大小，对象属性直接通过LayoutUtility.GetMinSize与LayoutUtility.GetPreferredSize获取，获取时会从对象自身查找ILayoutElement，获取到minWidth与preferredWidth，如果不存在则返回默认值0

[**UGUI源码解析——LayoutUtility**](https://azurebubble.github.io/posts/a99e5cea.html)

```c#
private void HandleSelfFittingAlongAxis(int axis)
{
    // 获取水平或者垂直方向的自适应模式
     FitMode fitting = (axis == 0 ? horizontalFit : verticalFit);
     if (fitting == FitMode.Unconstrained)
     {
         // 保持对跟踪变换的引用，但不要控制它的属性
         // 不做任何大小调整
         m_Tracker.Add(this, rectTransform, DrivenTransformProperties.None);
         return;
     }

     // 如果不是 Unconstrained 模式，则关联 rectTransform 的 X 轴和 Y 轴变化，对rectTransform进行调整
     m_Tracker.Add(this, rectTransform, (axis == 0 ? DrivenTransformProperties.SizeDeltaX : DrivenTransformProperties.SizeDeltaY));

     // 设置大小为最小或首选大小
     if (fitting == FitMode.MinSize)
         rectTransform.SetSizeWithCurrentAnchors((RectTransform.Axis)axis, LayoutUtility.GetMinSize(m_Rect, axis));
     else
         rectTransform.SetSizeWithCurrentAnchors((RectTransform.Axis)axis, LayoutUtility.GetPreferredSize(m_Rect, axis));
}
```

> 注意：给对象身上挂载ContentSizeFitter组件后设置PreferredSize后立即获取rectTransform.sizeDelte或rectTransform.rect.size还是之前的值，下一帧后获取才是真实的size，可以使用以下方法执行一次更新方法再去获取rect

```c#
//第一种 SetLayoutHorizontal 里会对 m_Tracker 进行清空后再执行 HandleSelfFittingAlongAxis
GetComponent<ContentSizeFitter>().SetLayoutHorizontal();
//第二种 强制重建
LayoutRebuilder.ForceRebuildLayoutImmediate(txt.rectTransform);
```

