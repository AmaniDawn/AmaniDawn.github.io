---
title: UGUI源码解析——LayoutElement
path: /posts/ugui-layoutelement
tags:
categories: UGUI源码解析
mathjax: true
date: 2024-08-07
updated: 2024-08-07
description: 继承了ILayoutElement和ILayoutIgnorer接口，作为布局元素组件。
---

> LayoutElement：继承了ILayoutElement和ILayoutIgnorer接口，作为布局元素组件
> 挂载了Layout Element组件的对象，布局并不会生效，它是受到实现了布局组的控制(HorizontalLayoutGroup、VerticalLayoutGroup、GridLayoutGroup)

#### 源码解析

> 继承自ILayoutElement的属性

[**UGUI源码解析——ILayoutElement**](https://azurebubble.github.io/posts/2f5dfff6.html)

``` c#
// 这个RectTransform是否被布局系统忽略
[SerializeField] private bool m_IgnoreLayout = false;
public virtual bool ignoreLayout { get { return m_IgnoreLayout; } set { if (SetPropertyUtility.SetStruct(ref m_IgnoreLayout, value)) SetDirty(); } }

// SetPropertyUtility.SetStruct(); 的作用是安全的设置一个结构体的值，只有检测到值真正发生变化的时候才会返回True，避免了不要的性能开销

// 最小宽度，只要设置了值，不管布局组件怎么设置，最小宽度不能小于这个值
[SerializeField] private float m_MinWidth = -1;
public virtual float minWidth { get { return m_MinWidth; } set { if (SetPropertyUtility.SetStruct(ref m_MinWidth, value)) SetDirty(); } }

// 最小高度，只要设置了值，不管布局组件怎么设置，最小高度不能小于这个值
[SerializeField] private float m_MinHeight = -1;
public virtual float minHeight { get { return m_MinHeight; } set { if (SetPropertyUtility.SetStruct(ref m_MinHeight, value)) SetDirty(); } }

// 首选宽度，会优先选择这个值作为布局计算参考
[SerializeField] private float m_PreferredWidth = -1;
public virtual float preferredWidth { get { return m_PreferredWidth; } set { if (SetPropertyUtility.SetStruct(ref m_PreferredWidth, value)) SetDirty(); } }

// 首选高度，会优先选择这个值作为布局计算参考
[SerializeField] private float m_PreferredHeight = -1;
public virtual float preferredHeight { get { return m_PreferredHeight; } set { if (SetPropertyUtility.SetStruct(ref m_PreferredHeight, value)) SetDirty(); } }

// 是一个比例值，如果有额外的空间，会利用这个比例值获取最后的结果
[SerializeField] private float m_FlexibleWidth = -1;
public virtual float flexibleWidth { get { return m_FlexibleWidth; } set { if (SetPropertyUtility.SetStruct(ref m_FlexibleWidth, value)) SetDirty(); } }

// 一个比例值，如果有额外的空间，会利用这个比例值获取最后的结果
[SerializeField] private float m_FlexibleHeight = -1;
public virtual float flexibleHeight { get { return m_FlexibleHeight; } set { if (SetPropertyUtility.SetStruct(ref m_FlexibleHeight, value)) SetDirty(); } }

// 此元素的布局优先级
[SerializeField] private int m_LayoutPriority = 1;
public virtual int layoutPriority { get { return m_LayoutPriority; } set { if (SetPropertyUtility.SetStruct(ref m_LayoutPriority, value)) SetDirty(); } }
```

>SetDirty:将LayoutElement标记为dirty。这将使自动布局系统在下一次布局时处理该元素。只要有可能影响布局的更改，LayoutElement就应该调用这个方法。

``` c#
protected void SetDirty()
{
    if (!IsActive())
        return;
    LayoutRebuilder.MarkLayoutForRebuild(transform as RectTransform);
}
```

