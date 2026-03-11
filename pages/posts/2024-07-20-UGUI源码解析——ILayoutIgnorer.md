---
title: UGUI源码解析——ILayoutIgnorer
path: /posts/ugui-ilayoutignorer
tags:
categories: UGUI源码解析
mathjax: true
description: 挂载了实现ILayoutIgnorer接口的组件对象可以设置不受布局系统控制，例如：LayoutElement
date: 2024-07-20
updated: 2024-07-20
---

>ILayoutIgnorer：挂载了实现ILayoutIgnorer接口的组件的对象可以设置不受布局系统控制，例如LayoutElement。
><font color=red>实现ILayoutIgnorer接口的组件的作用是针对于布局组下的子对象，而不是针对于自身，例如给挂载了ContentSizeFitter组件的对象身上挂载LayoutElement组件并将ignoreLayout设置为true是没有作用的</font>

#### 源码解析

>ignoreLayout：返回这个布局元素的RecTransform是否应该被布局系统忽略。
>
><font color=red>注意：需要对象身上所有挂载了ILayoutIgnorer组件中的ignoreLayout都为true的时候才会不受到布局系统控制</font>

```c#
bool ignoreLayout { get; }
```

><font color=red>因为只有在LayoutGroup类中引用了ILayoutIngnorer接口，LayoutGroup类是只作用与子布局元素的，所以实现了ILayoutIgnorer接口的组件的作用是针对于布局组下的子对象，而不是自身。</font>

```c#
public virtual void CalculateLayoutInputHorizontal()
{
    m_RectChildren.Clear();
    var toIgnoreList = ListPool<Component>.Get();
    for (int i = 0; i < rectTransform.childCount; i++)
    {
        var rect = rectTransform.GetChild(i) as RectTransform;
        if (rect == null || !rect.gameObject.activeInHierarchy)
            continue;

        rect.GetComponents(typeof(ILayoutIgnorer), toIgnoreList);

        if (toIgnoreList.Count == 0)
        {
            m_RectChildren.Add(rect);
            continue;
        }

        for (int j = 0; j < toIgnoreList.Count; j++)
        {
            var ignorer = (ILayoutIgnorer)toIgnoreList[j];
            if (!ignorer.ignoreLayout)
            {
                m_RectChildren.Add(rect);
                break;
            }
        }
    }
    ListPool<Component>.Release(toIgnoreList);
    m_Tracker.Clear();
}
```

