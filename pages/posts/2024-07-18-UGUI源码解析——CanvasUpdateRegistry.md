---
title: UGUI源码解析——CanvasUpdateRegistry
path: /posts/ugui-canvasupdateregistry
tags:
categories: UGUI源码解析
mathjax: true
description: 图像、布局重建注册器
date: 2024-07-18
updated: 2024-07-18
---

> CanvasUpdate：用于描述在Canvas更新过程中可能发生的不同阶段

```c#
public enum CanvasUpdate
{
    /// <summary>
    /// 布局更新之前调用
    /// </summary>
    Prelayout = 0,
    /// <summary>
    /// 布局更新时调用
    /// </summary>
    Layout = 1,
    /// <summary>
    /// 布局更新之后调用
    /// </summary>
    PostLayout = 2,
    /// <summary>
    /// 渲染之前调用
    /// </summary>
    PreRender = 3,
    /// <summary>
    /// 渲染之前完成后调用
    /// </summary>
    LatePreRender = 4,
    /// <summary>
    /// 表示枚举的范围，边界检测或者迭代
    /// </summary>
    MaxUpdateValue = 5
}
```

> ICanvasElement：图像、布局重建接口。几乎所有UI对象都继承自ICanvasElement接口，一个UI对象若要重建都需要继承自ICanvasElement接口。

```c#
public interface ICanvasElement
 {
     /// <summary>
     /// 重构方法，需要在继承类中实现，Graphic和LayoutRebuilder继承了此接口
     /// </summary>
     /// <param name="executing">正在重建的当前的CanvasUpdate阶段</param>
     void Rebuild(CanvasUpdate executing);

     /// <summary>
     /// 每个UI都继承自UIBehaviour类，UIBehaviour继承自MonoBehaviour，MonoBehaviour继承自Component类，而Component类实现了transform属性，所以子类可以不再实现这个属性
     /// </summary>
     Transform transform { get; }

     /// <summary>
     /// 布局完成的回调函数
     /// </summary>
     void LayoutComplete();

     /// <summary>
     /// 图像更新完成的回调函数
     /// </summary>
     void GraphicUpdateComplete();

     /// <summary>
     /// 获取UI对象是否销毁
     /// </summary>
     /// <returns></returns>
     bool IsDestroyed();
 }
```

> CanvasUpdateRegistry：是一个单例，它监听了Canvas即将渲染的事件，并调用已注册对象的Rebuild、LayoutComplete、GraphicUpdateComplete方法，<font color=red>而其中的Rebuild方法就是每个UI元素的刷新方法。</font>

```c#
// 单例获取
private static CanvasUpdateRegistry s_Instance;
public static CanvasUpdateRegistry instance
{
    get
    {
        if (s_Instance == null)
            s_Instance = new CanvasUpdateRegistry();
        return s_Instance;
    }
}

// 构造函数：给Canvas的静态事件willRenderCanvases注册一个名为PerformUpdate的方法
// (willRenderCanvases每帧在Canvas渲染前执行)，PerformUpdate中调用了布局和图像的更新
protected CanvasUpdateRegistry()
{
    Canvas.willRenderCanvases += PerformUpdate;
}

// 两个标记是否在进行布局或图像更新的字段
private bool m_PerformingLayoutUpdate;
private bool m_PerformingGraphicUpdate;

// 用于在性能分析器中识别和记录Canvas更新过程中的不同阶段的标识符
private string[] m_CanvasUpdateProfilerStrings = new string[] { "CanvasUpdate.Prelayout", "CanvasUpdate.Layout", "CanvasUpdate.PostLayout", "CanvasUpdate.PreRender", "CanvasUpdate.LatePreRender" };
// 用于在性能分析器或调试器中标识剪切器注册表中执行裁剪的标识符
private const string m_CullingUpdateProfilerString = "ClipperRegistry.Cull";

// 布局重建序列和图像重建序列
// 当需要更新布局或图像时，可以调用RegisterCanvasElementForLayoutRebuild和
// RegisterCanvasElementForGraphicRebuild两个方法将对象添加到对应的重建序列中
// PerformUpdate方法会调用Rebuild方法对这两个序列中中的对象进行更新操作
private readonly IndexedSet<ICanvasElement> m_LayoutRebuildQueue = new IndexedSet<ICanvasElement>();
private readonly IndexedSet<ICanvasElement> m_GraphicRebuildQueue = new IndexedSet<ICanvasElement>();

// 检查指定的Canvas元素是否是Unity的Object，是否可以进行有效更新
// Object是Unity所有对象的基类，object是C#中所有对象的基类
private bool ObjectValidForUpdate(ICanvasElement element)
{
    var valid = element != null;

    var isUnityObject = element is Object;
    if (isUnityObject)
        valid = (element as Object) != null;

    return valid;
}

// 清理两个队列中的无效元素
// MonoBehaviour对空值相等性重载了==操作符，用于检查他们是否被销毁
// 这段代码中处理的是一个ICanvasElement接口类型的列表，而不是具体的MonoBehaviour类型
// 因此直接使用==操作符不能直接转发到MonoBehaviour，而只是检查接口本身是否为null
// IsDestroyed()方法用于检查元素的后端是否被销毁
private void CleanInvalidItems()
{
    var layoutRebuildQueueCount = m_LayoutRebuildQueue.Count;
    for (int i = layoutRebuildQueueCount - 1; i >= 0; --i)
    {
        var item = m_LayoutRebuildQueue[i];
        // 元素是否为空
        if (item == null)
        {
            m_LayoutRebuildQueue.RemoveAt(i);
            continue;
        }

        // 元素是否被销毁
        if (item.IsDestroyed())
        {
            m_LayoutRebuildQueue.RemoveAt(i);
            item.LayoutComplete();
        }
    }

    var graphicRebuildQueueCount = m_GraphicRebuildQueue.Count;
    for (int i = graphicRebuildQueueCount - 1; i >= 0; --i)
    {
        var item = m_GraphicRebuildQueue[i];
        if (item == null)
        {
            m_GraphicRebuildQueue.RemoveAt(i);
            continue;
        }

        if (item.IsDestroyed())
        {
            m_GraphicRebuildQueue.RemoveAt(i);
            item.GraphicUpdateComplete();
        }
    }
}

// 计算指定Transform对象的父级层级数目
private static int ParentCount(Transform child)
{
    if (child == null)
        return 0;

    var parent = child.parent;
    int count = 0;
    while (parent != null)
    {
        count++;
        parent = parent.parent;
    }
    return count;
}

// 比较两个元素的祖先层级深度，祖先层级深度越深，则排在列表的更后面
// 决定元素的布局和图像重建顺序
private static int SortLayoutList(ICanvasElement x, ICanvasElement y)
{
    Transform t1 = x.transform;
    Transform t2 = y.transform;

    return ParentCount(t1) - ParentCount(t2);
}

// 将一个Canvas元素注册到布局重建队列中，一个带返回值一个不带返回值方法
public static void RegisterCanvasElementForLayoutRebuild(ICanvasElement element)
{
    instance.InternalRegisterCanvasElementForLayoutRebuild(element);
}
public static bool TryRegisterCanvasElementForLayoutRebuild(ICanvasElement element)
{
    return instance.InternalRegisterCanvasElementForLayoutRebuild(element);
}
private bool InternalRegisterCanvasElementForLayoutRebuild(ICanvasElement element)
{
    // 判断元素是否存在布局重建队列中
    if (m_LayoutRebuildQueue.Contains(element))
        return false;
    // 向布局重建队列中添加元素，确保不会重复添加
    return m_LayoutRebuildQueue.AddUnique(element);
}

// 将一个Canvas元素注册到图像重建队列中，一个带返回值一个不带返回值方法
public static void RegisterCanvasElementForGraphicRebuild(ICanvasElement element)
{
    instance.InternalRegisterCanvasElementForGraphicRebuild(element);
}
public static bool TryRegisterCanvasElementForGraphicRebuild(ICanvasElement element)
{
    return instance.InternalRegisterCanvasElementForGraphicRebuild(element);
}
private bool InternalRegisterCanvasElementForGraphicRebuild(ICanvasElement element)
{
    // 是否正在进行图像重建更新操作，是的话将不会将元素添加到图像重建队列中
    if (m_PerformingGraphicUpdate)
    {
        Debug.LogError(string.Format("Trying to add {0} for graphic rebuild while we are already inside a graphic rebuild loop. This is not supported.", element));
        return false;
    }
	// 向图像重建队列中添加元素，确保不会重复添加
    return m_GraphicRebuildQueue.AddUnique(element);
}

// 从布局和重建的队列中移除指定的Canvas元素
public static void UnRegisterCanvasElementForRebuild(ICanvasElement element)
{
    instance.InternalUnRegisterCanvasElementForLayoutRebuild(element);
    instance.InternalUnRegisterCanvasElementForGraphicRebuild(element);
}
private void InternalUnRegisterCanvasElementForLayoutRebuild(ICanvasElement element)
{
    // 如果正在进行布局重建更新操作，将不会移除指定元素
    if (m_PerformingLayoutUpdate)
    {
        Debug.LogError(string.Format("Trying to remove {0} from rebuild list while we are already inside a rebuild loop. This is not supported.", element));
        return;
    }
	// 调用元素的布局重建完成函数
    element.LayoutComplete();
    // 从布局重建队列中移除元素
    instance.m_LayoutRebuildQueue.Remove(element);
}
private void InternalUnRegisterCanvasElementForGraphicRebuild(ICanvasElement element)
{
    // 如果正在进行图像重建更新操作，将不会移除指定元素
    if (m_PerformingGraphicUpdate)
    {
        Debug.LogError(string.Format("Trying to remove {0} from rebuild list while we are already inside a rebuild loop. This is not supported.", element));
        return;
    }
    // 调用元素的图像重建完成函数
    element.GraphicUpdateComplete();
    // 从图像重建队列中移除元素
    instance.m_GraphicRebuildQueue.Remove(element);
}

// 从布局和重建的队列中禁用指定的Canvas元素
public static void DisableCanvasElementForRebuild(ICanvasElement element)
{
    instance.InternalDisableCanvasElementForLayoutRebuild(element);
    instance.InternalDisableCanvasElementForGraphicRebuild(element);
}
private void InternalDisableCanvasElementForLayoutRebuild(ICanvasElement element)
{
    // 如果正在进行布局重建更新操作，将不会禁用指定元素
    if (m_PerformingLayoutUpdate)
    {
        Debug.LogError(string.Format("Trying to remove {0} from rebuild list while we are already inside a rebuild loop. This is not supported.", element));
        return;
    }
	// 调用元素的布局重建完成函数
    element.LayoutComplete();
    // 禁用指定元素
    instance.m_LayoutRebuildQueue.DisableItem(element);
}
private void InternalDisableCanvasElementForGraphicRebuild(ICanvasElement element)
{
    // 如果正在进行图像重建更新操作，将不会禁用指定元素
    if (m_PerformingGraphicUpdate)
    {
        Debug.LogError(string.Format("Trying to remove {0} from rebuild list while we are already inside a rebuild loop. This is not supported.", element));
        return;
    }
    // 调用元素的图像重建完成函数
    element.GraphicUpdateComplete();
    // 禁用指定元素
    instance.m_GraphicRebuildQueue.DisableItem(element);
}

// 当前是否正在计算图形布局
public static bool IsRebuildingLayout()
{
    return instance.m_PerformingLayoutUpdate;
}
// 当前是否正在重建图形
public static bool IsRebuildingGraphics()
{
    return instance.m_PerformingGraphicUpdate;
}
```

> 接下来着重分析CanvasUpdateRegistry中的PerformUpdate方法的内部实现和执行顺序。<font color=red>可以在Profiler中通过查看标志性函数Canvas.willRenderCanvases的耗时，来了解重建的性能消耗</font>

```c#
// 先定义一个静态只读的比较函数委托
// Comparison<T>是C#已经预定义好的一个用于比较两个类型为T的对象并返回整数的委托
private static readonly Comparison<ICanvasElement> s_SortLayoutFunction = SortLayoutList;

private void PerformUpdate()
{
    // 用于在代码块开始和结束时记录性能样本，监测布局更新的性能
    UISystemProfilerApi.BeginSample(UISystemProfilerApi.SampleType.Layout);
    // 清理无效的元素或数据
    CleanInvalidItems();
	// 标记正在进行布局更新操作
    m_PerformingLayoutUpdate = true;
	// 对布局重建队列中的元素进行排序
    m_LayoutRebuildQueue.Sort(s_SortLayoutFunction);

    for (int i = 0; i <= (int)CanvasUpdate.PostLayout; i++)
    {
        // 标记每一个元素的性能分析
        	UnityEngine.Profiling.Profiler.BeginSample(m_CanvasUpdateProfilerStrings[i]);

        for (int j = 0; j < m_LayoutRebuildQueue.Count; j++)
        {
            var rebuild = m_LayoutRebuildQueue[j];
            try
            {
                // 判断元素是否是有效元素
                // 对布局重建序列中的每一个元素进行CanvasUpdate的每个阶段更新
                if (ObjectValidForUpdate(rebuild))
                    rebuild.Rebuild((CanvasUpdate)i);
            }
            catch (Exception e)
            {
                Debug.LogException(e, rebuild.transform);
            }
        }
        UnityEngine.Profiling.Profiler.EndSample();
    }

    for (int i = 0; i < m_LayoutRebuildQueue.Count; ++i)
        // 调用布局重建完成函数
        m_LayoutRebuildQueue[i].LayoutComplete();

    // 清空布局重建列表，并修改布局重建标志为false
    m_LayoutRebuildQueue.Clear();
    m_PerformingLayoutUpdate = false;
    UISystemProfilerApi.EndSample(UISystemProfilerApi.SampleType.Layout);
    UISystemProfilerApi.BeginSample(UISystemProfilerApi.SampleType.Render);

    // now layout is complete do culling...
    UnityEngine.Profiling.Profiler.BeginSample(m_CullingUpdateProfilerString);
    // 执行实际的裁剪操作
    ClipperRegistry.instance.Cull();
    UnityEngine.Profiling.Profiler.EndSample();

    // 标记正在进行图像更新操作
    m_PerformingGraphicUpdate = true;

    for (var i = (int)CanvasUpdate.PreRender; i < (int)CanvasUpdate.MaxUpdateValue; i++)
    {
        UnityEngine.Profiling.Profiler.BeginSample(m_CanvasUpdateProfilerStrings[i]);
        for (var k = 0; k < m_GraphicRebuildQueue.Count; k++)
        {
            try
            {
                var element = m_GraphicRebuildQueue[k];
                // 判断元素是否是有效元素
                // 对布局重建序列中的每一个元素进行CanvasUpdate的每个阶段更新
                if (ObjectValidForUpdate(element))
                    element.Rebuild((CanvasUpdate)i);
            }
            catch (Exception e)
            {
                Debug.LogException(e, m_GraphicRebuildQueue[k].transform);
            }
        }
        UnityEngine.Profiling.Profiler.EndSample();
    }

    for (int i = 0; i < m_GraphicRebuildQueue.Count; ++i)
        // 调用图像重建完成函数
        m_GraphicRebuildQueue[i].GraphicUpdateComplete();
	// 清空图像重建序列 并修改图像重建标志为false
    m_GraphicRebuildQueue.Clear();
    m_PerformingGraphicUpdate = false;
    UISystemProfilerApi.EndSample(UISystemProfilerApi.SampleType.Render);
}
```
