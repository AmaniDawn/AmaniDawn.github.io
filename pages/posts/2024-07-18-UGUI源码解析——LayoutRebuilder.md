---
title: UGUI源码解析——LayoutRebuilder
tags: 
categories: 
mathjax: true
description: 负责布局的刷新(UI对象位置和大小的刷新)
date: 2024-07-18
updated: 2024-07-18
---

>LayoutRebuilder：用于管理CanvasElement布局重建的包装类，主要负责布局的刷新(UI对象位置和大小的刷新)。

#### 源码解析

>字段

``` c#
private RectTransform m_ToRebuild;
// 从变换中缓存哈希值有几个原因:
//  - 这是一个ValueType (struct)， . net从ValueType字段计算Hash值。
//  - 字典的键应该有一个常量哈希值。
//  - 这是可能的转换得到null从本地端。
// 我们将这个结构体与IndexedSet容器一起使用，IndexedSet容器使用字典作为实现的一部分
// 这个结构体被用作字典的键，所以我们需要保证一个恒定的哈希值。
private int m_CachedHashFromTransform;

// 返回当前的 RectTransform
public Transform transform { get { return m_ToRebuild; }}

// 当前的 RectTransform 是否被销毁
public bool IsDestroyed()
{
    return m_ToRebuild == null;
}

// 静态对象池 管理 LayoutRebuilder 对象
static ObjectPool<LayoutRebuilder> s_Rebuilders = new ObjectPool<LayoutRebuilder>(null, x => x.Clear());
```

> Initialize：初始化 m_ToRebuild 和 m_CachedHashFromTransform，确保哈希值保持不变

``` c#
private void Initialize(RectTransform controller)
{
    m_ToRebuild = controller;
    m_CachedHashFromTransform = controller.GetHashCode();
}
```

> Clear：清理缓存

``` c#
private void Clear()
{
    m_ToRebuild = null;
    m_CachedHashFromTransform = 0;
}
```

> LayoutRebuilder：静态构造函数，第一次访问该类时被调用，不接受参数

``` c#
// RectTransform.reapplyDrivenProperties 是一个静态事件，定义在 RectTransform 类中。这个事件在 RectTransform 的属性被重新应用时触发。例如，当 RectTransform 的尺寸或位置受到驱动并需要更新时，该事件会被触发。
static LayoutRebuilder()
{
    RectTransform.reapplyDrivenProperties += ReapplyDrivenProperties;
}
```

> ReapplyDrivenProperties：静态构造函数，第一次访问该类时被调用，不接受参数

``` c#
// 在 ReapplyDrivenProperties 方法内部，调用了 MarkLayoutForRebuild(driven)。这个方法的目的是标记指定的 RectTransform 以便在下次布局更新时进行重新构建。
static void ReapplyDrivenProperties(RectTransform driven)
{
    MarkLayoutForRebuild(driven);
}
```

> ReapplyDrivenProperties：静态构造函数，第一次访问该类时被调用，不接受参数

``` c#
// 在 ReapplyDrivenProperties 方法内部，调用了 MarkLayoutForRebuild(driven)。这个方法的目的是标记指定的 RectTransform 以便在下次布局更新时进行重新构建。
static void ReapplyDrivenProperties(RectTransform driven)
{
    MarkLayoutForRebuild(driven);
}
```

> MarkLayoutForRebuild：将给定的RectTransform标记为需要在下一次布局过程中重新计算其布局。

``` c#
public static void MarkLayoutForRebuild(RectTransform rect)
{
    if (rect == null || rect.gameObject == null)
        return;

    var comps = ListPool<Component>.Get();
    // 用于标记当前处理的 RectTransform 是否具有有效的布局组。
    bool validLayoutGroup = true;
    // 是当前 RectTransform，将用来追踪有效的布局根。
    RectTransform layoutRoot = rect;
    //  是当前 RectTransform 的父级，类型转换为 RectTransform。
    var parent = layoutRoot.parent as RectTransform;
    // 持续检查父级的 RectTransform 直到找到有效的布局组或到达根节点
    while (validLayoutGroup && !(parent == null || parent.gameObject == null))
    {
        validLayoutGroup = false;
        parent.GetComponents(typeof(ILayoutGroup), comps);

        for (int i = 0; i < comps.Count; ++i)
        {
            var cur = comps[i];
            if (cur != null && cur is Behaviour && ((Behaviour)cur).isActiveAndEnabled)
            {
                validLayoutGroup = true;
                layoutRoot = parent;
                break;
            }
        }

        parent = parent.parent as RectTransform;
    }

    // 我们知道布局根是有效的，如果它不相同的矩形，
	// 上面已经检查过了。但如果它们是一样的，我们还需要检查。
    // 如果当前父级不符合条件，则继续向上检查其上一级父级，直到找到有效的布局组或到达根节点。
    if (layoutRoot == rect && !ValidController(layoutRoot, comps))
    {
        // // 如果 layoutRoot 没有变化并且 ValidController 返回 false，则表示当前 RectTransform 不需要重新标记为重建。释放组件列表并退出方法。
        ListPool<Component>.Release(comps);
        return;
    }

    // 调用 MarkLayoutRootForRebuild 方法，标记 layoutRoot 需要重建布局。
    MarkLayoutRootForRebuild(layoutRoot);
    ListPool<Component>.Release(comps);
}
```

> ValidController：检查给定的 `RectTransform` 是否具有有效的 `ILayoutController` 组件

``` c#
private static bool ValidController(RectTransform layoutRoot, List<Component> comps)
{
    if (layoutRoot == null || layoutRoot.gameObject == null)
        return false;

    // 遍历 comps 列表，检查每个组件是否是 Behaviour 类型且处于启用状态（isActiveAndEnabled 为 true）。
    layoutRoot.GetComponents(typeof(ILayoutController), comps);
    for (int i = 0; i < comps.Count; ++i)
    {
        var cur = comps[i];
        if (cur != null && cur is Behaviour && ((Behaviour)cur).isActiveAndEnabled)
        {
            return true;
        }
    }

    return false;
}
```

> StripDisabledBehavioursFromList：从给定的组件列表中移除所有是Behaviour类型并且未启用的组件。

``` c#
static void StripDisabledBehavioursFromList(List<Component> components)
{
    components.RemoveAll(e => e is Behaviour && !((Behaviour)e).isActiveAndEnabled);
}
```

> ForceRebuildLayoutImmediate：强制立即重建受计算影响的布局元素和子布局元素。

``` c#
// 强制立即重建受计算影响的布局元素和子布局元素。
// 正常使用的布局系统不应该使用这个方法。相反，应该使用MarkLayoutForRebuild，它会在下一次布局传递时触发延迟的布局重建。延迟的重新构建以正确的顺序自动处理整个布局层次结构中的对象，并防止对相同布局元素进行多次重新计算。
// 但是，对于特殊的布局计算需求，可以使用::ref:: forcerebuildlayoutimate来立即解析子树的布局。这甚至可以从内部布局计算方法，如ILayoutController完成。SetLayoutHorizontal orILayoutController.SetLayoutVertical。使用应该限制在多个布局传递不可避免的情况下，尽管在性能上有额外的成本。
public static void ForceRebuildLayoutImmediate(RectTransform layoutRoot)
{
    var rebuilder = s_Rebuilders.Get();
    rebuilder.Initialize(layoutRoot);
    rebuilder.Rebuild(CanvasUpdate.Layout);
    s_Rebuilders.Release(rebuilder);
}
```

> Rebuild：在CanvasUpdateRegistry类中给委托Canvas.willRenderCanvases注册了PerformUpdate方法，PerformUpdate会在CanvasRender渲染之前会遍历布局和图像重建序列调用每个元素的Rebuild方法(执行布局重建操作前会先将所有待重建对象的父物体数量进行升序排序，这样可以保证是从下到上进行布局重建，避免布局混乱)，这里的Rebuild就是布局更新操作的具体实现，先进行水平布局的计算和设置再进行竖直布局的计算和设置。

``` c#
public void Rebuild(CanvasUpdate executing)
{
    switch (executing)
    {
        case CanvasUpdate.Layout:
            // 不幸的是，我们将对树执行相同的GetComponents查询2次，
            // 但是每个树必须在进入下一个动作之前被完全迭代，
            // 所以重用结果需要将结果存储在Dictionary或类似的地方，
            // 这可能比多次执行GetComponents的开销更大。
            PerformLayoutCalculation(m_ToRebuild, e => (e as ILayoutElement).CalculateLayoutInputHorizontal());
            PerformLayoutControl(m_ToRebuild, e => (e as ILayoutController).SetLayoutHorizontal());
            PerformLayoutCalculation(m_ToRebuild, e => (e as ILayoutElement).CalculateLayoutInputVertical());
            PerformLayoutControl(m_ToRebuild, e => (e as ILayoutController).SetLayoutVertical());
            break;
    }
}
```

> PerformLayoutControl：**从上到下**遍历实现了ILayoutController接口的组件的对象，先处理实现了ILayoutController接口的组件的对象，接着处理实现了ILayoutGroup接口的组件的对象，最后迭代遍历当前对象的子物体。从上到下设置是因为子对象的布局依赖于父对象的布局

``` c#
// 确保父节点的布局控制器能够首先设置并影响其子节点的布局
private void PerformLayoutControl(RectTransform rect, UnityAction<Component> action)
{
    if (rect == null)
        return;

    var components = ListPool<Component>.Get();
    rect.GetComponents(typeof(ILayoutController), components);
    StripDisabledBehavioursFromList(components);

    //如果这个rect上没有控制器，我们可以跳过这整个子树
	//我们也不需要考虑子树更深处的子节点上的控制器，
	//因为它们将成为自己的根。
    if (components.Count > 0)
    {
        //布局控件需要自顶向下执行，父控件在子控件之前完成;
		//因为孩子依赖于父母的大小。

		//首先调用布局控制器，它们可以改变自己的RectTransform
        for (int i = 0; i < components.Count; i++)
            if (components[i] is ILayoutSelfController)
                action(components[i]);

        //然后调用其余的，比如改变它们的子布局组，考虑它们自己的RectTransform大小。
        for (int i = 0; i < components.Count; i++)
            if (!(components[i] is ILayoutSelfController))
                action(components[i]);

        for (int i = 0; i < rect.childCount; i++)
            PerformLayoutControl(rect.GetChild(i) as RectTransform, action);
    }

    ListPool<Component>.Release(components);
}
```

> PerformLayoutCalculation：递归地**从下到上**遍历实现了ILayoutElement接口的组件的对象，并调用计算布局属性的方法(CalculateLayoutInputHorizontal和CalculateLayoutInputVertical)。从下到上计算是因为父对象的属性依赖于子对象的属性

``` c#
// 计算布局大小，依赖于子对象
private void PerformLayoutCalculation(RectTransform rect, UnityAction<Component> action)
{
    if (rect == null)
        return;

    var components = ListPool<Component>.Get();
    rect.GetComponents(typeof(ILayoutElement), components);
    StripDisabledBehavioursFromList(components);

    //如果这个rect上没有控制器，我们可以跳过这整个子树
	//我们也不需要考虑子树更深处的子节点上的控制器，
	//因为它们将成为自己的根。
    if (components.Count > 0  || rect.GetComponent(typeof(ILayoutGroup)))
    {
        //布局计算需要自底向上执行，子节点在父节点之前完成;
		//因为父节点的计算大小依赖于子节点的大小。
        for (int i = 0; i < rect.childCount; i++)
            PerformLayoutCalculation(rect.GetChild(i) as RectTransform, action);

        for (int i = 0; i < components.Count; i++)
            action(components[i]);
    }

    ListPool<Component>.Release(components);
}
```

> MarkLayoutRootForRebuild：标记一个 `RectTransform` 对象以便在布局更新时进行重建

``` c#
private static void MarkLayoutRootForRebuild(RectTransform controller)
{
    if (controller == null)
        return;

    var rebuilder = s_Rebuilders.Get();
    rebuilder.Initialize(controller);
    // 尝试注册到布局重建容器中，如果注册失败就直接释放掉这个对象
    if (!CanvasUpdateRegistry.TryRegisterCanvasElementForLayoutRebuild(rebuilder))
        s_Rebuilders.Release(rebuilder);
}
```

> LayoutComplete：布局重建完成时间，释放s_Rebuilders对象池中的当前对象

``` c#
public void LayoutComplete()
{
    s_Rebuilders.Release(this);
}
```

> 一些比较简单的方法

```c#
// 图像更新完成事件
public void GraphicUpdateComplete()
{}

// 获得当前进行重建的RectTransform的哈希值
public override int GetHashCode()
{
    return m_CachedHashFromTransform;
}

// 判断两个对象的哈希值是否相同
public override bool Equals(object obj)
{
    return obj.GetHashCode() == GetHashCode();
}

// ToString 重写
public override string ToString()
{
    return "(Layout Rebuilder for) " + m_ToRebuild;
}
```

