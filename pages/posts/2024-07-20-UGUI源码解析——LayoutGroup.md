---
title: UGUI源码解析——LayoutGroup
tags: 
categories: 
mathjax: true
description: >-
date: 2024-07-20
updated: 2024-07-20
---

>LayoutGroup：LayoutGroup是控制子布局对象组件的基类，实现了ILayoutElement和ILayoutGroup接口，继承自UIBehaviour，说明它既是一个布局元素也是一个布局控制器，HorizontalLayoutGroup、VerticalLayoutGroup、GridLayoutGroup都继承或间接继承了此类。

#### 源码解析

##### 特性

> [DisallowMultipleComponent]：不允许组件对象挂载重复的这个脚本。
>
> [ExecuteAlways]：确保脚本在编辑器和游戏运行时都能被执行。
>
> [RequireComponent(typeof(RectTransform))]：确保组件对象挂载了RectTransform组件。

##### 内部实现

>m_Padding：可以在Unity的Inspector窗口中直观的调整和配置这个矩形区域的边距偏移量，而无需通过代码进行硬编码。

```c#
// RectOffset 类型用于定义矩形区域的偏移量。它通常用于 UI 布局中，例如在实现边距（padding）或者边框（border）时非常有用。
protected RectOffset m_Padding = new RectOffset();
// 控制子布局元素周围的边距偏移量。
public RectOffset padding { get { return m_Padding; } set { SetProperty(ref m_Padding, value);
```

> SetProperty：帮助器方法，用于在给定属性发生更改时设置该属性。
>
> 这是类似MVVM模式中的使用方法

```c#
protected void SetProperty<T>(ref T currentValue, T newValue)
{
    if ((currentValue == null && newValue == null) || (currentValue != null && currentValue.Equals(newValue)))
        return;
    currentValue = newValue;
    SetDirty();
}
```

> SetDirty：标记LayoutGroup为Dirty，标记当前对象的布局是否需要重新构建，如果是失活状态将不会被标记。

```c#
protected void SetDirty()
{
    // 失活状态则不标记
    if (!IsActive())
        return;

    // 当前不在进行布局重建中则通过LayoutRebuilder.MarkLayoutForRebuild来标记当前对象的布局需要重新构建
    if (!CanvasUpdateRegistry.IsRebuildingLayout())
        LayoutRebuilder.MarkLayoutForRebuild(rectTransform);
    else
        // 否则启动一个协程DelayedSetDirty，延迟标记此对象布局需要重新构建
        StartCoroutine(DelayedSetDirty(rectTransform));
}
```

>协程DelayedSetDirty:等待一帧之后再通过LayoutRebuilder.MarkLayoutForRebuild来标记当前对象的布局需要重新构建。可以使用LayoutRebuilder.ForceRebuildLayoutImmediate(rectTransform)方法强制更新布局。

```c#
 IEnumerator DelayedSetDirty(RectTransform rectTransform)
 {
     yield return null;
     LayoutRebuilder.MarkLayoutForRebuild(rectTransform);
 }

```

>子布局元素的对齐方式

```c#
[SerializeField] protected TextAnchor m_ChildAlignment = TextAnchor.UpperLeft;
// 布局组中子布局元素的对齐方式。默认是左上角对齐。
public TextAnchor childAlignment { get { return m_ChildAlignment; } set { SetProperty(ref m_ChildAlignment, value); } }
```

>获取此布局元素的RectTransform组件

```c#
[System.NonSerialized] private RectTransform m_Rect;
protected RectTransform rectTransform
{
    get
    {
        if (m_Rect == null)
            m_Rect = GetComponent<RectTransform>();
        return m_Rect;
    }
}
```

> 存储布局组中所有的子布局元素

```c#
[System.NonSerialized] private List<RectTransform> m_RectChildren = new List<RectTransform>();
protected List<RectTransform> rectChildren { get { return m_RectChildren; } }
```

>一些其他属性和字段

```c#
// DrivenRectTransformTracker 是 Unity 提供的一个用于跟踪 RectTransform 尺寸和位置的工具类。确保布局可以在尺寸或位置变化时得到更新。
protected DrivenRectTransformTracker m_Tracker;
// m_TotalMinSize 用来记录当前布局所需的最小尺寸。初始值设为 Vector2.zero，即没有最小尺寸要求。
private Vector2 m_TotalMinSize = Vector2.zero;
// m_TotalPreferredSize 用来记录当前布局所需的首选尺寸。初始为 Vector2.zero，即没有首选尺寸要求。
private Vector2 m_TotalPreferredSize = Vector2.zero;
// m_TotalFlexibleSize 用来记录当前布局所需的灵活尺寸（即可变尺寸）。初始值设为 Vector2.zero，表示没有灵活尺寸的要求。
private Vector2 m_TotalFlexibleSize = Vector2.zero;
```

> CalculateLayoutInputHorizontal：实现ILayoutElement中的接口，子类可重写

```c#
public virtual void CalculateLayoutInputHorizontal()
{
    // 清空当前子布局元素容器
    m_RectChildren.Clear();
    // 使用对象池获取一个临时的ListPool<Component>容器
    var toIgnoreList = ListPool<Component>.Get();
    // 过滤不参与布局的子布局元素
    for (int i = 0; i < rectTransform.childCount; i++)
    {
        var rect = rectTransform.GetChild(i) as RectTransform;
        // 没有RectTransform组件和在Hierarchy中没有被激活则跳过
        if (rect == null || !rect.gameObject.activeInHierarchy)
            continue;

        // 获取附加在子布局元素组件的所有ILayoutIgnorer组件对象
        rect.GetComponents(typeof(ILayoutIgnorer), toIgnoreList);
		// 如果为空，则代表需要参与布局
        if (toIgnoreList.Count == 0)
        {
            m_RectChildren.Add(rect);
            continue;
        }

        // 只要存在一个为false的ILayoutIgnorer组件，则需要参与布局
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
    // 释放toIgnoreList返回对象池
    ListPool<Component>.Release(toIgnoreList);
    // 清空布局追踪器
    m_Tracker.Clear();
}
```

>抽象方法CalculateLayoutInputVertical计算垂直布局输入，子类必须实现

```c#
public abstract void CalculateLayoutInputVertical();
```

> GetTotalMinSize：由子类调用给定轴上布局组的最小大小

```c#
// 轴索引。0表示水平，1表示垂直。
protected float GetTotalMinSize(int axis)
{
    return m_TotalMinSize[axis];
}
```

> GetTotalPreferredSize

```c#
// // 轴索引。0表示水平，1表示垂直。
protected float GetTotalPreferredSize(int axis)
{
    return m_TotalPreferredSize[axis];
}
```

> GetTotalFlexibleSize：由子类调用给定轴上布局组的灵活大小。

```c#
// // 轴索引。0表示水平，1表示垂直。
protected float GetTotalFlexibleSize(int axis)
{
    return m_TotalFlexibleSize[axis];
}
```

> ILayoutController中的接口，抽象方法，子类必须实现的回调

```c#
public abstract void SetLayoutHorizontal();
public abstract void SetLayoutVertical();
```

> 构造方法

```c#
protected LayoutGroup()
{
    if (m_Padding == null)
        m_Padding = new RectOffset();
}
```

>生命周期OnEnable：启用时，标记为需要进行布局重建

```c#
protected override void OnEnable()
{
    base.OnEnable();
    SetDirty();
}
```

> 生命周期OnDisable：失活时，清空布局追踪器，强制更新布局

```c#
protected override void OnDisable()
{
    m_Tracker.Clear();
    LayoutRebuilder.MarkLayoutForRebuild(rectTransform);
    base.OnDisable();
}
```

> OnDidApplyAnimationProperties：当动画属性改变时，标记为需要进行布局重建

```c#
protected override void OnDidApplyAnimationProperties()
{
	SetDirty();
}
```

> OnRectTransformDimensionsChange：当动画属性改变时，标记为需要进行布局重建

```c#
protected override void OnDidApplyAnimationProperties()
{
	SetDirty();
}
```

>GetStartOffset：根据给定轴和对齐方式计算第一个子布局元素起始偏移坐标，由子类调用。

```c#
// 轴索引。0表示水平，1表示垂直
// 所有布局元素在给定轴上所需的总空间，包括间距和不包括填充。
protected float GetStartOffset(int axis, float requiredSpaceWithoutPadding)
{
    // 计算实际需要的空间大小。它等于 requiredSpaceWithoutPadding 加上轴向上的填充值，根据 axis 的值来决定使用水平填充或垂直填充。
    float requiredSpace = requiredSpaceWithoutPadding + (axis == 0 ? padding.horizontal : padding.vertical);
    // 获取当前轴上可用的空间大小，通过查询 rectTransform.rect.size[axis] 得到。
    float availableSpace = rectTransform.rect.size[axis];
    // 计算剩余的空间大小，即 availableSpace 减去 requiredSpace。
    float surplusSpace = availableSpace - requiredSpace;
    // 调用 GetAlignmentOnAxis(axis) 方法，获取在当前轴上的对齐方式或比例因子。
    float alignmentOnAxis = GetAlignmentOnAxis(axis);
    // 如果 axis 是 0（水平轴），则返回水平填充的左边距 padding.left 加上剩余空间乘以轴向的对齐方式。
	// 如果 axis 是 1（垂直轴），则返回垂直填充的顶边距 padding.top 加上剩余空间乘以轴向的对齐方式。
    return (axis == 0 ? padding.left : padding.top) + surplusSpace * alignmentOnAxis;
}
```

>GetAlignmentOnAxis：以分数形式返回指定轴上的对齐方式，其中0为左/上，0.5为中，1为右/下。

```c#
// 0表示水平，1表示垂直
protected float GetAlignmentOnAxis(int axis)
{
    if (axis == 0)
        // 水平轴：子布局元素的对齐方式进行模3运算，得到一个范围在0~2之间的整数，这个值乘以0.5f,得到一个在0.0f~1.0f之间的浮点数作为水平对齐的比例因子
        return ((int)childAlignment % 3) * 0.5f;
    else
        // 垂直轴：子布局元素的对齐方式进行除3运算，得到一个范围在0~2之间的整数，这个值乘以0.5f,得到一个在0.0f~1.0f之间的浮点数作为垂直对齐的比例因子
        return ((int)childAlignment / 3) * 0.5f;
}
```

> SetLayoutInputForAxis：用于设置给定轴的计算布局属性。由子类调用。

```c#
// 0表示水平，1表示垂直。
protected void SetLayoutInputForAxis(float totalMin, float totalPreferred, float totalFlexible, int axis)
{
    m_TotalMinSize[axis] = totalMin;
    m_TotalPreferredSize[axis] = totalPreferred;
    m_TotalFlexibleSize[axis] = totalFlexible;
}
```

>SetChildAlongAxis：设置子布局元素沿给定轴的位置和大小。

```c#
// 0表示水平，1表示垂直。
protected void SetChildAlongAxis(RectTransform rect, int axis, float pos)
{
    if (rect == null)
        return;

    SetChildAlongAxisWithScale(rect, axis, pos, 1.0f);
}
```

>SetChildAlongAxisWithScale：设置子布局元素沿给定轴的位置和大小。

```c#
// 0表示水平，1表示垂直。
protected void SetChildAlongAxisWithScale(RectTransform rect, int axis, float pos, float scaleFactor)
{
    if (rect == null)
        return;
	// 跟踪锚点和锚定位置（Anchors 和 AnchoredPositionX 或 AnchoredPositionY）的变化
    m_Tracker.Add(this, rect,
        DrivenTransformProperties.Anchors |
        (axis == 0 ? DrivenTransformProperties.AnchoredPositionX : DrivenTransformProperties.AnchoredPositionY));

    //内联rect.SetInsetAndSizeFromParentEdge(…)和重构代码，以乘以所需的大小scaleFactor。
	// sizeDelta必须保持不变，但位置计算中使用的大小必须通过scaleFactor进行缩放。
	// 设置子元素的 anchorMin 和 anchorMax 为 Vector2.up，即完全沿父元素的顶部边缘对齐。
    rect.anchorMin = Vector2.up;
    rect.anchorMax = Vector2.up;

    // 对于水平轴（axis == 0）：计算公式为 pos + rect.sizeDelta[axis] * rect.pivot[axis] * scaleFactor。这将根据位置 pos、子元素的尺寸 rect.sizeDelta[axis]、子元素的中心点 rect.pivot[axis] 和缩放因子 scaleFactor 设置子元素的位置。
    // 对于垂直轴（axis == 1）：计算公式为 -pos - rect.sizeDelta[axis] * (1f - rect.pivot[axis]) * scaleFactor。这同样根据位置 pos、子元素的尺寸 rect.sizeDelta[axis]、子元素的中心点 rect.pivot[axis] 和缩放因子 scaleFactor 设置子元素的位置。
    Vector2 anchoredPosition = rect.anchoredPosition;
    anchoredPosition[axis] = (axis == 0) ? (pos + rect.sizeDelta[axis] * rect.pivot[axis] * scaleFactor) : (-pos - rect.sizeDelta[axis] * (1f - rect.pivot[axis]) * scaleFactor);
    // 将计算得到的位置应用到子元素的 anchoredPosition 上，确保子元素按预期位置放置
    rect.anchoredPosition = anchoredPosition;
}
```

>SetChildAlongAxis：上面方法的重载，多了一个参数size，子布局元素的尺寸大小

```c#
protected void SetChildAlongAxis(RectTransform rect, int axis, float pos, float size)
{
    if (rect == null)
        return;

    SetChildAlongAxisWithScale(rect, axis, pos, size, 1.0f);
}
```

>SetChildAlongAxisWithScale：上面方法的重载，多了一个参数size，子布局元素的尺寸大小

```c#
protected void SetChildAlongAxisWithScale(RectTransform rect, int axis, float pos, float size, float scaleFactor)
{
    if (rect == null)
        return;

    // 跟踪锚点和锚定位置的变化，以及根据轴的不同追踪 AnchoredPositionX 或 AnchoredPositionY 和对应的 SizeDeltaX 或 SizeDeltaY。
    m_Tracker.Add(this, rect,
        DrivenTransformProperties.Anchors |
        (axis == 0 ?
            (DrivenTransformProperties.AnchoredPositionX | DrivenTransformProperties.SizeDeltaX) :
            (DrivenTransformProperties.AnchoredPositionY | DrivenTransformProperties.SizeDeltaY)
        )
    );

    // 设置子元素的 anchorMin 和 anchorMax 为 Vector2.up，即完全沿父元素的顶部边缘对齐
    rect.anchorMin = Vector2.up;
    rect.anchorMax = Vector2.up;

    // 更新子元素的 sizeDelta，将指定轴上的尺寸设置为传入的 size 值，确保子元素在该轴上具有正确的大小
    Vector2 sizeDelta = rect.sizeDelta;
    sizeDelta[axis] = size;
    rect.sizeDelta = sizeDelta;

    // 对于水平轴（axis == 0）：计算公式为 pos + size * rect.pivot[axis] * scaleFactor。这将根据位置 pos、子元素的尺寸 size、子元素的中心点 rect.pivot[axis] 和缩放因子 scaleFactor 设置子元素的位置。
    // 对于垂直轴（axis == 1）：计算公式为 -pos - size * (1f - rect.pivot[axis]) * scaleFactor。这同样根据位置 pos、子元素的尺寸 size、子元素的中心点 rect.pivot[axis] 和缩放因子 scaleFactor 设置子元素的位置。
    Vector2 anchoredPosition = rect.anchoredPosition;
    anchoredPosition[axis] = (axis == 0) ? (pos + size * rect.pivot[axis] * scaleFactor) : (-pos - size * (1f - rect.pivot[axis]) * scaleFactor);
    // 将计算得到的位置应用到子元素的 anchoredPosition 上，确保子元素按预期位置放置
    rect.anchoredPosition = anchoredPosition;
}
```

>isRootLayoutGroup：判断当前对象是否是布局组的根布局对象组件。

```c#
private bool isRootLayoutGroup
{
    get
    {
        Transform parent = transform.parent;
        if (parent == null)
            return true;
        return transform.parent.GetComponent(typeof(ILayoutGroup)) == null;
    }
}
```

>OnRectTransformDimensionsChange：如果当前对象是根布局对象，且RectTransform发生了变化，则标记为需要进行布局重建

```c#
protected override void OnRectTransformDimensionsChange()
{
    base.OnRectTransformDimensionsChange();
    if (isRootLayoutGroup)
        SetDirty();
}
```

>OnTransformChildrenChanged：子布局元素如果的Transform如果发生改变则标记为需要进行布局重建

```c#
protected virtual void OnTransformChildrenChanged()
{
    SetDirty();
}
```

>在编辑器模式下，每次对该组件的属性进行修改并保存时自动调用OnValidate方法，标记为需要进行布局重建

```c#
#if UNITY_EDITOR
    protected override void OnValidate()
    {
        SetDirty();
    }
#endif
```

