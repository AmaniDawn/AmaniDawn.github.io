---
title: UGUI源码解析——LayoutUtility
path: /posts/ugui-layoututility
tags:
categories: UGUI源码解析
mathjax: true
date: 2024-08-07
updated: 2024-08-07
description: 布局的工具类
---

>LayoutUtility：布局的工具类，可以获取到对象的minWidth、preferredWidth、flexibleWidth、minHeight、preferredHeight、layoutPriority的属性值。用于查询布局元素的最小、首选和灵活大小的实用程序函数。

#### 源码解析

>GetMinSize:返回布局元素的最小大小。

``` c#
/// <summary>
/// 返回布局元素的最小大小。
/// </summary>
/// <param name="rect">要查询的布局元素的RectTransform</param>
/// <param name="axis">要查询的轴。可以是0或1</param>
/// <remarks>所有在GameObject上实现ILayoutElement的组件都会被查询。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值</remarks>
public static float GetMinSize(RectTransform rect, int axis)
{
    if (axis == 0)
        return GetMinWidth(rect);
    return GetMinHeight(rect);
}
```

>GetPreferredSize：返回布局元素的首选大小。

``` c#
/// <summary>
/// 返回布局元素的灵活大小
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
/// <param name="axis">要查询的轴。可以是0或1</param>
public static float GetPreferredSize(RectTransform rect, int axis)
{
    if (axis == 0)
        return GetPreferredWidth(rect);
    return GetPreferredHeight(rect);
}
```

>GetFlexibleSize：返回布局元素的灵活大小

``` c#
/// <summary>
/// 返回布局元素的灵活大小
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
/// <param name="axis">要查询的轴。可以是0或1</param>
public static float GetFlexibleSize(RectTransform rect, int axis)
{
     if (axis == 0)
         return GetFlexibleWidth(rect);
     return GetFlexibleHeight(rect);
}
```

>GetMinWidth：返回布局元素的最小宽度

``` c#
/// <summary>
/// 返回布局元素的最小宽度
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
public static float GetMinWidth(RectTransform rect)
{
    return GetLayoutProperty(rect, e => e.minWidth, 0);
}
```

>GetPreferredWidth:返回布局元素的首选宽度

``` c#
/// <summary>
/// 返回布局元素的首选宽度
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
public static float GetPreferredWidth(RectTransform rect)
{
    return Mathf.Max(GetLayoutProperty(rect, e => e.minWidth, 0), GetLayoutProperty(rect, e => e.preferredWidth, 0));
}
```

>GetFlexibleWidth:返回布局元素的灵活宽度

``` c#
/// <summary>
/// 返回布局元素的灵活宽度
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
public static float GetFlexibleWidth(RectTransform rect)
{
    return GetLayoutProperty(rect, e => e.flexibleWidth, 0);
}
```

>GetMinHeight:返回布局元素的最小高度

``` c#
/// <summary>
/// 返回布局元素的最小高度
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
public static float GetMinHeight(RectTransform rect)
{
    return GetLayoutProperty(rect, e => e.minHeight, 0);
}
```

>GetPreferredHeight:返回布局元素的首选高度

``` c#
/// <summary>
/// 返回布局元素的首选高度
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
public static float GetPreferredHeight(RectTransform rect)
{
	return Mathf.Max(GetLayoutProperty(rect, e => e.minHeight, 0), GetLayoutProperty(rect, e => e.preferredHeight, 0));
}
```

>GetFlexibleHeight:返回布局元素的灵活高度

``` c#
/// <summary>
/// 返回布局元素的灵活高度
/// </summary>
/// <remarks>
/// 查询GameObject中实现ILayoutElement的所有组件。使用具有此设置值的具有最高优先级的那个。如果多个组件具有此设置并且具有相同的优先级，则使用其中的最大值
/// </remarks>
/// <param name="rect">要查询的布局元素的RectTransform</param>
public static float GetFlexibleHeight(RectTransform rect)
{
	return GetLayoutProperty(rect, e => e.flexibleHeight, 0);
}
```

>GetLayoutProperty:获取具有给定RectTransform的布局元素的计算布局属性

``` c#
/// <summary>
/// 获取具有给定RectTransform的布局元素的计算布局属性
/// </summary>
/// <param name="rect">布局元素的RectTransform，用于获取。</param>
/// <param name="property">要计算的属性。</param>
/// <param name="defaultValue">如果布局元素上没有组件提供给定属性，则使用的默认值</param>
/// <returns> layout属性的计算值。</returns>
public static float GetLayoutProperty(RectTransform rect, System.Func<ILayoutElement, float> property, float defaultValue)
{
    ILayoutElement dummy;
    return GetLayoutProperty(rect, property, defaultValue, out dummy);
}
```

>GetLayoutProperty:遍历对象身上所有的ILayoutElement类型的组件，使用优先级最高组件的属性值，若组件优先级一致，则取数值最大的属性值，注意的是取得Preferred属性时会比较Preferred和Min的大小，取数值大的

``` c#
/// <summary>
/// 获取具有给定RectTransform的布局元素的计算布局属性
/// </summary>
/// <param name="rect">布局元素的RectTransform，用于获取。</param>
/// <param name="property">要计算的属性。</param>
/// <param name="defaultValue">如果布局元素上没有组件提供给定属性，则使用的默认值</param>
/// <param name="source">可选的out参数，用于获取提供计算值的组件。</param>
/// <returns> layout属性的计算值。</returns>
public static float GetLayoutPropertypublic static float GetLayoutProperty(RectTransform rect, System.Func<ILayoutElement, float> property, float defaultValue, out ILayoutElement source)
{
    source = null;
    if (rect == null)
        return 0;
    float min = defaultValue;
    int maxPriority = System.Int32.MinValue;
    var components = ListPool<Component>.Get();
    rect.GetComponents(typeof(ILayoutElement), components);

    for (int i = 0; i < components.Count; i++)
    {
        var layoutComp = components[i] as ILayoutElement;
        if (layoutComp is Behaviour && !((Behaviour)layoutComp).isActiveAndEnabled)
            continue;

        int priority = layoutComp.layoutPriority;
        // 如果这个布局组件的优先级低于先前使用的组件，忽略它
        if (priority < maxPriority)
            continue;
        float prop = property(layoutComp);
        // 如果此布局属性设置为负值，则意味着应该忽略它
        if (prop < 0)
            continue;

        // 如果这个布局组件的优先级高于前面所有组件，
        // 用这个值覆盖
        if (priority > maxPriority)
        {
            min = prop;
            maxPriority = priority;
            source = layoutComp;
        }
        // 如果布局组件与之前使用的组件具有相同的优先级，
        // 使用具有相同优先级的最大值
        else if (prop > min)
        {
            min = prop;
            source = layoutComp;
        }
    }

    ListPool<Component>.Release(components);
    return min;
}
```

