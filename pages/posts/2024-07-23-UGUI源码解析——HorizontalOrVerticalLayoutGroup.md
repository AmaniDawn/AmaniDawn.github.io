---
title: UGUI源码解析——HorizontalOrVerticalLayoutGroup
tags: 
categories: 
mathjax: true
description: >-
date: 2024-07-23
updated: 2024-07-23
---

>继承自LayoutGroup，是HorizontalLayoutGroup和VerticalLayoutGroup的父类，提供了一些HorizontalLayoutGroup和VerticalLayoutGroup通用的方法。

#### 源码解析

> spacing：布局组中布局元素之间使用的间距。

```c#
[SerializeField] protected float m_Spacing = 0;
public float spacing { get { return m_Spacing; } set { SetProperty(ref m_Spacing, value); } }
```

>childForceExpandWidth：是否强迫孩子们扩展以填充额外的可用水平空间。

```c#
[SerializeField] protected bool m_ChildForceExpandWidth = true;
public bool childForceExpandWidth { get { return m_ChildForceExpandWidth; } set { SetProperty(ref m_ChildForceExpandWidth, value); } }

```

>childForceExpandHeight：是否强迫孩子们扩展以填充额外的可用垂直空间。

```c#
[SerializeField] protected bool m_ChildForceExpandHeight = true;
public bool childForceExpandHeight { get { return m_ChildForceExpandHeight; } set { SetProperty(ref m_ChildForceExpandHeight, value); } }
```

> childControlWidth：如果布局组控制其子元素的宽度则返回true。如果子节点控制自己的宽度，则返回false。
>
> 如果设置为false，布局组将只影响子元素的位置而不影响宽度。在这种情况下，子元素的宽度可以通过各自的RectTransforms来设置。
>
> 如果设置为true，子元素的宽度将由布局组根据它们各自的最小宽度、首选宽度和灵活宽度自动驱动。如果子节点的宽度应该根据可用空间的大小而变化，这是很有用的。在这种情况下，不能在RectTransform中手动设置每个子元素的宽度，但是可以通过向其添加LayoutElement组件来控制每个子元素的最小、首选和灵活宽度。

```c#
[SerializeField] protected bool m_ChildControlWidth = true;
public bool childControlWidth { get { return m_ChildControlWidth; } set { SetProperty(ref m_ChildControlWidth, value); } }
```

>childControlHeight：如果Layout Group控制其子元素的高度，则返回true。如果孩子控制自己的高度返回false。
>
>如果设置为false，布局组将只影响子元素的位置而不影响高度。在这种情况下，子元素的高度可以通过各自的RectTransforms来设置。
>
>如果设置为true，子元素的高度由布局组根据它们各自的最小高度、首选高度和灵活高度自动驱动。如果孩子的高度应该根据可用空间的大小而变化，这是有用的。在这种情况下，不能在RectTransform中手动设置每个子元素的高度，但是可以通过向其添加LayoutElement组件来控制每个子元素的最小、首选和灵活高度。

```c#
[SerializeField] protected bool m_ChildControlHeight = true;
public bool childControlHeight { get { return m_ChildControlHeight; } set { SetProperty(ref m_ChildControlHeight, value); } }
```

>m_ChildScaleWidth：孩子的宽度是否按x尺度缩放。

```c#
[SerializeField] protected bool m_ChildScaleWidth = false;
public bool childScaleWidth { get { return m_ChildScaleWidth; } set { SetProperty(ref m_ChildScaleWidth, value); } }
```

>childScaleHeight：孩子的高度是否按y尺度缩放。

```c#
[SerializeField] protected bool m_ChildScaleHeight = false;
public bool childScaleHeight { get { return m_ChildScaleHeight; } set { SetProperty(ref m_ChildScaleHeight, value); } }
```

> CalcAlongAxis：计算该布局元素沿给定轴的布局元素属性。0表示水平，1表示垂直。这个组是否是垂直组。计算minWidth、preferredWidth、flexibleWidth、minHeight、preferredHeight、flexibleHeight属性值，并通过父类LayoutGroup中的SetLayoutInputForAxis方法设置属性值

```c#
// 计算minWidth、preferredWidth、flexibleWidth、minHeight、preferredHeight、flexibleHeight属性值，并通过父类LayoutGroup中的SetLayoutInputForAxis方法设置属性值
protected void CalcAlongAxis(int axis, bool isVertical)
{
    // 计算子元素布局时所考虑的边距总和，取决于是水平还是垂直布局
    float combinedPadding = (axis == 0 ? padding.horizontal : padding.vertical);
    // 是否控制子元素的尺寸
    bool controlSize = (axis == 0 ? m_ChildControlWidth : m_ChildControlHeight);
    // 是否使用缩放来调整子元素的尺寸
    bool useScale = (axis == 0 ? m_ChildScaleWidth : m_ChildScaleHeight);
    // 子元素是否强制扩展尺寸
    bool childForceExpandSize = (axis == 0 ? m_ChildForceExpandWidth : m_ChildForceExpandHeight);

    // 初始化为零，分别用于累积最小尺寸、首选尺寸和灵活尺寸
    float totalMin = combinedPadding;
    float totalPreferred = combinedPadding;
    float totalFlexible = 0;

    // （表示是否沿另一轴）来累积总的最小尺寸、首选尺寸和灵活尺寸。如果不是沿另一轴，还会增加间距 spacing。
    bool alongOtherAxis = (isVertical ^ (axis == 1));
    for (int i = 0; i < rectChildren.Count; i++)
    {
        RectTransform child = rectChildren[i];
        float min, preferred, flexible;
        GetChildSizes(child, axis, controlSize, childForceExpandSize, out min, out preferred, out flexible);

        // 根据子元素在该轴上的缩放因子调整尺寸
        if (useScale)
        {
            float scaleFactor = child.localScale[axis];
            min *= scaleFactor;
            preferred *= scaleFactor;
            flexible *= scaleFactor;
        }

        if (alongOtherAxis)
        {
            totalMin = Mathf.Max(min + combinedPadding, totalMin);
            totalPreferred = Mathf.Max(preferred + combinedPadding, totalPreferred);
            totalFlexible = Mathf.Max(flexible, totalFlexible);
        }
        else
        {
            totalMin += min + spacing;
            totalPreferred += preferred + spacing;

            // Increment flexible size with element's flexible size.
            totalFlexible += flexible;
        }
    }

    if (!alongOtherAxis && rectChildren.Count > 0)
    {
        totalMin -= spacing;
        totalPreferred -= spacing;
    }
    totalPreferred = Mathf.Max(totalMin, totalPreferred);
    SetLayoutInputForAxis(totalMin, totalPreferred, totalFlexible, axis);
}
```

>GetChildSizes：计算子对象在布局组件中的尺寸大小，主要用于UI布局系统，比如Unity中的UI布局组件。

```c#
// 表示要计算尺寸的子对象的RectTransform组件
// 表示计算尺寸的轴向（通常是水平轴或垂直轴，用0和1表示）
// 一个布尔值，表示是否应该控制子对象的尺寸。如果为false，子对象的最小尺寸、首选尺寸和灵活尺寸将直接从子对象的sizeDelta中获取；如果为true，将通过LayoutUtility来获取这些尺寸
// 一个布尔值，表示是否强制扩展子对象的灵活尺寸
// min: 输出参数，表示子对象在指定轴向上的最小尺寸。
// preferred: 输出参数，表示子对象在指定轴向上的首选尺寸。
// flexible: 输出参数，表示子对象在指定轴向上的灵活尺寸。
private void GetChildSizes(RectTransform child, int axis, bool controlSize, bool childForceExpand,
    out float min, out float preferred, out float flexible)
{
    if (!controlSize)
    {
        // 使用子对象的 sizeDelta[axis] 作为最小尺寸（min）、首选尺寸（preferred），并将灵活尺寸（flexible）设为 0
        min = child.sizeDelta[axis];
        preferred = min;
        flexible = 0;
    }
    else
    {
        // 使用 LayoutUtility 类的静态方法来获取子对象在指定轴向上的最小尺寸、首选尺寸和灵活尺寸
        min = LayoutUtility.GetMinSize(child, axis);
        preferred = LayoutUtility.GetPreferredSize(child, axis);
        flexible = LayoutUtility.GetFlexibleSize(child, axis);
    }

    if (childForceExpand)
        flexible = Mathf.Max(flexible, 1);
}
```

>SetChildrenAlongAxis：为给定轴设置子布局元素的位置和大小。0表示水平，1表示垂直。是否是垂直组。计算子物体的位置和大小，并通过父类LayoutGroup中的SetChildAlongAxisWithScale方法设置位置和大小

```c#
protected void SetChildrenAlongAxis(int axis, bool isVertical)
{
    // 获取布局组件在当前轴向上的尺寸大小
    float size = rectTransform.rect.size[axis];
    //  控制子对象尺寸、使用缩放因子、子对象是否强制扩展尺寸的布尔参数
    bool controlSize = (axis == 0 ? m_ChildControlWidth : m_ChildControlHeight);
    bool useScale = (axis == 0 ? m_ChildScaleWidth : m_ChildScaleHeight);
    bool childForceExpandSize = (axis == 0 ? m_ChildForceExpandWidth : m_ChildForceExpandHeight);
    // 获取子对象在当前轴向上的对齐方式
    float alignmentOnAxis = GetAlignmentOnAxis(axis);

    bool alongOtherAxis = (isVertical ^ (axis == 1));
    // 根据当前是否垂直布局以及轴向来决定是沿另一轴向排列还是当前轴向排列
    if (alongOtherAxis)
    {
        // 计算沿着垂直轴或水平轴另一方向的排列
        float innerSize = size - (axis == 0 ? padding.horizontal : padding.vertical);
        for (int i = 0; i < rectChildren.Count; i++)
        {
            // 在垂直布局时，计算子对象在水平轴上的排列：根据子对象的尺寸、缩放因子和对齐方式，设置其位置
            RectTransform child = rectChildren[i];
            float min, preferred, flexible;
            GetChildSizes(child, axis, controlSize, childForceExpandSize, out min, out preferred, out flexible);
            float scaleFactor = useScale ? child.localScale[axis] : 1f;

            float requiredSpace = Mathf.Clamp(innerSize, min, flexible > 0 ? size : preferred);
            float startOffset = GetStartOffset(axis, requiredSpace * scaleFactor);
            if (controlSize)
            {
                SetChildAlongAxisWithScale(child, axis, startOffset, requiredSpace, scaleFactor);
            }
            else
            {
                float offsetInCell = (requiredSpace - child.sizeDelta[axis]) * alignmentOnAxis;
                SetChildAlongAxisWithScale(child, axis, startOffset + offsetInCell, scaleFactor);
            }
        }
    }
    else
    {
        // 计算沿着当前轴向的排列
        // 计算剩余空间和灵活尺寸来确定子对象的位置和尺寸
        float pos = (axis == 0 ? padding.left : padding.top);
        float itemFlexibleMultiplier = 0;
        float surplusSpace = size - GetTotalPreferredSize(axis);

        if (surplusSpace > 0)
        {
            if (GetTotalFlexibleSize(axis) == 0)
                pos = GetStartOffset(axis, GetTotalPreferredSize(axis) - (axis == 0 ? padding.horizontal : padding.vertical));
            else if (GetTotalFlexibleSize(axis) > 0)
                itemFlexibleMultiplier = surplusSpace / GetTotalFlexibleSize(axis);
        }

        float minMaxLerp = 0;
        if (GetTotalMinSize(axis) != GetTotalPreferredSize(axis))
            minMaxLerp = Mathf.Clamp01((size - GetTotalMinSize(axis)) / (GetTotalPreferredSize(axis) - GetTotalMinSize(axis)));

        for (int i = 0; i < rectChildren.Count; i++)
        {
            RectTransform child = rectChildren[i];
            float min, preferred, flexible;
            GetChildSizes(child, axis, controlSize, childForceExpandSize, out min, out preferred, out flexible);
            float scaleFactor = useScale ? child.localScale[axis] : 1f;

            float childSize = Mathf.Lerp(min, preferred, minMaxLerp);
            childSize += flexible * itemFlexibleMultiplier;
            if (controlSize)
            {
                SetChildAlongAxisWithScale(child, axis, pos, childSize, scaleFactor);
            }
            else
            {
                float offsetInCell = (childSize - child.sizeDelta[axis]) * alignmentOnAxis;
                SetChildAlongAxisWithScale(child, axis, pos + offsetInCell, scaleFactor);
            }
            pos += childSize * scaleFactor + spacing;
        }
    }
}
```

