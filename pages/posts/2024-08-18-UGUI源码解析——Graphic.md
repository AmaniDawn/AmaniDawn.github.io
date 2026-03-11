---
title: UGUI源码解析——Graphic
path: /posts/ugui-graphic
tags:
categories: UGUI源码解析
mathjax: true
description: 负责图像的更新与显示。
date: 2024-08-18
updated: 2024-08-18
---

> Graphic：是UGUI的核心组件，负责图对象的显示和更新，是MaskableGraphic的基类，而MaskableGraphic是Text、RawImage、Image的基类。Graphic是一个抽象类，意味着不能被实例化，但是它提供了很多可重写的方法可被继承并重写。

#### 源码解析

> 类头：特性，Graphic是继承自UIBehaviour和ICanvasElement，UIBehaviour是所有UGUI组件的最基类，负责接收UnityEditor的事件。ICanvasElement负责接收Canvas重新渲染的事件。

[**UGUI源码解析——UIBehaviour**](https://azurebubble.github.io/posts/45311df6.html)

[**UGUI源码解析——CanvasUpdateRegistry**](https://azurebubble.github.io/posts/6dcd3730.html)

``` 	c#
// 不允许一个对象添加多个相同的组件
[DisallowMultipleComponent]
// 依赖于CanvasRenderer画布渲染组件
[RequireComponent(typeof(CanvasRenderer))]
// 依赖于RectTransform组件
[RequireComponent(typeof(RectTransform))]
// 编辑器模式下可以运行
[ExecuteAlways]
```

> 字段

[**UGUI源码解析——SetPropertyUtility**](https://azurebubble.github.io/posts/ef6aa33a.html)

> SetPropertyUtility：设置UI元素属性的静态工具类。

```c#
// 静态的材质和纹理字段，用于存储默认的UI元素材质和纹理，如果没有指定UI元素的材质和纹理，将会用这两个字段作为默认输入
static protected Material s_DefaultUI = null;
static public Material defaultGraphicMaterial
{
    get
    {
        if (s_DefaultUI == null)
            s_DefaultUI = Canvas.GetDefaultCanvasMaterial();
        return s_DefaultUI;
    }
}
public virtual Material defaultMaterial
{
    get { return defaultGraphicMaterial; }
}

static protected Texture2D s_WhiteTexture = null;
public virtual Texture mainTexture
{
    get
    {
        return s_WhiteTexture;
    }
}

// 指示这个字段再序列化时曾经用过不同的名称("m_Mat")
[FormerlySerializedAs("m_Mat")]
[SerializeField] protected Material m_Material;
public virtual Material material
{
    get
    {
        // 如果没有，则直接返回默认材质
        return (m_Material != null) ? m_Material : defaultMaterial;
    }
    set
    {
        if (m_Material == value)
            return;

        m_Material = value;
        // 脏标记
        SetMaterialDirty();
    }
}

// 默认颜色是白色
[SerializeField] private Color m_Color = Color.white;
// 如果颜色发生了变化，则标记重新渲染顶点数据
public virtual Color color { get { return m_Color; } set { if (SetPropertyUtility.SetColor(ref m_Color, value)) SetVerticesDirty(); } }

// 标记是否跳过布局更新和材质更新
[NonSerialized] protected bool m_SkipLayoutUpdate;
[NonSerialized] protected bool m_SkipMaterialUpdate;

// 标记这个图形对象是否能接收到鼠标射线的信号
[SerializeField] private bool m_RaycastTarget = true;
public virtual bool raycastTarget { get { return m_RaycastTarget; } set { m_RaycastTarget = value; } }

// RectTransform是必备的组件，不能被销毁，只需要检测它是否为空引用即可
[NonSerialized] private RectTransform m_RectTransform;
public RectTransform rectTransform
{
    get
    {
        if (ReferenceEquals(m_RectTransform, null))
        {
            m_RectTransform = GetComponent<RectTransform>();
        }
        return m_RectTransform;
    }
}

// CanvasRenderer是必备的组件，不能被销毁，只需要检测它是否为空引用即可
[NonSerialized] private CanvasRenderer m_CanvasRenderer;
public CanvasRenderer canvasRenderer
{
    get
    {
        if (ReferenceEquals(m_CanvasRenderer, null))
        {
            m_CanvasRenderer = GetComponent<CanvasRenderer>();
        }
        return m_CanvasRenderer;
    }
}

// 图形渲染到的画布引用，取最接近的Canvas
[NonSerialized] private Canvas m_Canvas;
public Canvas canvas
{
    get
    {
        if (m_Canvas == null)
            CacheCanvas();
        return m_Canvas;
    }
}

// 顶点和材质脏标记
[NonSerialized] private bool m_VertsDirty;
[NonSerialized] private bool m_MaterialDirty;

// 布局设置为脏时候的回调函数
[NonSerialized] protected UnityAction m_OnDirtyLayoutCallback;
// 顶点设置为脏时候的回调函数
[NonSerialized] protected UnityAction m_OnDirtyVertsCallback;
// 材质设置为脏时候的回调函数
[NonSerialized] protected UnityAction m_OnDirtyMaterialCallback;

// 静态网格字段
[NonSerialized] protected static Mesh s_Mesh;
protected static Mesh workerMesh
{
    get
    {
        if (s_Mesh == null)
        {
            s_Mesh = new Mesh();
            s_Mesh.name = "Shared UI Mesh";
            // 使其在 Unity 编辑器中不可见，并且在保存场景时不会被序列化，确保它不会在场景保存时保存，也不会在 Hierarchy 面板中显示
            s_Mesh.hideFlags = HideFlags.HideAndDontSave;
        }
        return s_Mesh;
    }
}

// 共享帮助类实例，避免重复创建
[NonSerialized] private static readonly VertexHelper s_VertexHelper = new VertexHelper();

// 网格缓存
[NonSerialized] protected Mesh m_CachedMesh;
// UV坐标缓存
[NonSerialized] protected Vector2[] m_CachedUvs;

// 指定颜色变化的插值对象
private readonly TweenRunner<ColorTween> m_ColorTweenRunner;

// 是否使用旧版的网格生成方式
protected bool useLegacyMeshGeneration { get; set; }

// 它表示图形的绝对深度，值从最低到最高，用于确定图形的绘制顺序和事件处理顺序。
// 具有较高深度的图形会在较低深度的图形之上绘制，并且接收事件的优先级较高。
public int depth { get { return canvasRenderer.absoluteDepth; } }

// 获取在渲染过程中实际发送到 CanvasRenderer 的材质
public virtual Material materialForRendering
{
    get
    {
        var components = ListPool<Component>.Get();
        GetComponents(typeof(IMaterialModifier), components);

        var currentMat = material;
        // 遍历所有 IMaterialModifier 组件，逐个应用材质修改
        for (var i = 0; i < components.Count; i++)
            currentMat = (components[i] as IMaterialModifier).GetModifiedMaterial(currentMat);
        ListPool<Component>.Release(components);
        return currentMat;
    }
}
```

> 构造函数：创建一个颜色变化的插值对象，并将当前实例传递。指定图形组件在初始化时使用旧版网格生成方式。

```c#
protected Graphic()
{
    if (m_ColorTweenRunner == null)
        m_ColorTweenRunner = new TweenRunner<ColorTween>();
    m_ColorTweenRunner.Init(this);
    useLegacyMeshGeneration = true;
}
```

>SetAllDirty:设置所有的图形属性需要进行重建，如布局，顶点，材质等

``` c#
public virtual void SetAllDirty()
{
    // 判断对象的布局是否需要重建
    if (m_SkipLayoutUpdate)
    {
        m_SkipLayoutUpdate = false;
    }
    else
    {
        SetLayoutDirty();
    }

    // 判断对象的材质是否需要更新
    if (m_SkipMaterialUpdate)
    {
        m_SkipMaterialUpdate = false;
    }
    else
    {
        SetMaterialDirty();
    }

    // 标记顶点需要更新
    SetVerticesDirty();
}
```

>SetLayoutDirty:将布局设置为脏，需要进行布局重建

``` c#
public virtual void SetLayoutDirty()
{
    if (!IsActive())
        return;

    // 标记当前rectTransform需要进行布局重建
    LayoutRebuilder.MarkLayoutForRebuild(rectTransform);

    // 布局脏标记后的回调
    if (m_OnDirtyLayoutCallback != null)
        m_OnDirtyLayoutCallback();
}
```

>SetVerticesDirty:将顶点设置为脏，需要进行布局重建

``` c#
public virtual void SetVerticesDirty()
{
    if (!IsActive())
        return;

    // 标记当前图形元素将在Canvas更新时被重新计算
    m_VertsDirty = true;
    CanvasUpdateRegistry.RegisterCanvasElementForGraphicRebuild(this);

    // 顶点脏标记后的回调
    if (m_OnDirtyVertsCallback != null)
        m_OnDirtyVertsCallback();
}
```

>SetMaterialDirty:将材质设置为脏，需要进行布局重建

``` c#
public virtual void SetMaterialDirty()
{
    if (!IsActive())
        return;

    m_MaterialDirty = true;
    CanvasUpdateRegistry.RegisterCanvasElementForGraphicRebuild(this);

    // 材质脏标记后的回调
    if (m_OnDirtyMaterialCallback != null)
        m_OnDirtyMaterialCallback();
}
```

>OnRectTransformDimensionsChange:当RectTransform尺寸发生变化的时候调用

``` c#
protected override void OnRectTransformDimensionsChange()
{
    if (gameObject.activeInHierarchy)
    {
        // 防止双重污染…
        // 如果正在布局重建，则只对顶点进行脏标记
        if (CanvasUpdateRegistry.IsRebuildingLayout())
            SetVerticesDirty();
        else
        {
            // 否则布局也需要设置为需要重建，确保UI元素的布局和渲染是最新的
            SetVerticesDirty();
            SetLayoutDirty();
        }
    }
}
```

>OnBeforeTransformParentChanged:父对象变更前调用

```c#
protected override void OnBeforeTransformParentChanged()
{
    // 从图像重建队列中注销当前对象注册
    GraphicRegistry.UnregisterGraphicForCanvas(canvas, this);
    // 标记当前rectTransform需要进行布局重建，确保父对象发生变化后，布局系统能够重新计算并更新对象的布局
    LayoutRebuilder.MarkLayoutForRebuild(rectTransform);
}
```

>OnTransformParentChanged:父对象发生变化的时候调用

```c#
protected override void OnTransformParentChanged()
{
    base.OnTransformParentChanged();

    // 因为父对象的变化意味着当前的画布 (canvas) 可能不再适用，因此需要清空缓存的画布引用。
    m_Canvas = null;

    if (!IsActive())
        return;

    // 重新缓存当前对象的画布 (canvas)。这一步是为了在父对象变化后，重新获取并缓存正确的画布引用。
    CacheCanvas();
    // 将当前对象注册到 GraphicRegistry 中
    GraphicRegistry.RegisterGraphicForCanvas(canvas, this);
    // 对当前对象的所有属性进行脏标记
    SetAllDirty();
}
```

>CacheCanvas:缓存当前对象的第一个Canvas父对象

```c#
private void CacheCanvas()
{
    // 取对象池
    var list = ListPool<Canvas>.Get();
    // 查找父对象中的所有Canvas组件
    gameObject.GetComponentsInParent(false, list);
    if (list.Count > 0)
    {
        // 找到第一个激活的画布
        for (int i = 0; i < list.Count; ++i)
        {
            if (list[i].isActiveAndEnabled)
            {
                m_Canvas = list[i];
                break;
            }
        }
    }
    else
    {
        m_Canvas = null;
    }

    // 释放对象池
    ListPool<Canvas>.Release(list);
}
```

>OnEnable:将图形和画布设置为脏标记

```c#
        protected override void OnEnable()
        {
            base.OnEnable();
            CacheCanvas();
            // 当前图形组件注册到指定的 Canvas 对象上。这样做可以确保在绘制或更新时，图形组件被正确地管理和处理。
            GraphicRegistry.RegisterGraphicForCanvas(canvas, this);

#if UNITY_EDITOR
    		// 在编辑器模式下跟踪和管理图形重建
            GraphicRebuildTracker.TrackGraphic(this);
#endif
    		// 初始化白色纹理
            if (s_WhiteTexture == null)
                s_WhiteTexture = Texture2D.whiteTexture;

            SetAllDirty();
        }
```

>OnDisable:清空引用

```c#
        protected override void OnDisable()
        {
#if UNITY_EDITOR
    		// 取消跟踪
            GraphicRebuildTracker.UnTrackGraphic(this);
#endif
    		// 注销Canvas和当前对象的图形重建
            GraphicRegistry.UnregisterGraphicForCanvas(canvas, this);
            // 注销画布元素重建
            CanvasUpdateRegistry.UnRegisterCanvasElementForRebuild(this);

            if (canvasRenderer != null)
                // 清空
                canvasRenderer.Clear();

            // 标记当前rectTransform需要进行布局重建
            LayoutRebuilder.MarkLayoutForRebuild(rectTransform);

            base.OnDisable();
        }
```

>OnDestroy:清空网格引用

```c#
protected override void OnDestroy()
{
    if (m_CachedMesh)
        Destroy(m_CachedMesh);
    m_CachedMesh = null;

    base.OnDestroy();
}
```

>OnCanvasHierarchyChanged:Canvas的层级发生变化的时候调用

```c#
protected override void OnCanvasHierarchyChanged()
{
    // 缓存当前的Canvas
    Canvas currentCanvas = m_Canvas;

    // 清空m_Canvas引用
    m_Canvas = null;

    if (!IsActive())
        return;

    // 查找到第一个父对象中的Canvas
    CacheCanvas();

    // 如果新的Canvas和缓存的Canvas不一样
    if (currentCanvas != m_Canvas)
    {
        // 注销旧的Canvas
        GraphicRegistry.UnregisterGraphicForCanvas(currentCanvas, this);

        // 只有当我们激活并启用OnCanvasHierarchyChanged时才能注册
		// 在对象销毁过程中，我们不想注册自己，然后变成null。
        if (IsActive())
            // 注册新的Canvas
            GraphicRegistry.RegisterGraphicForCanvas(canvas, this);
    }
}
```

>OnCullingChanged:处理 Canvas 元素在被剔除状态变化时的逻辑

```c#
public virtual void OnCullingChanged()
{
    // 检查是否剔除和属性脏标志
    if (!canvasRenderer.cull && (m_VertsDirty || m_MaterialDirty))
    {
        // 将当前Canvas 元素注册到图形重建队列中。
        CanvasUpdateRegistry.RegisterCanvasElementForGraphicRebuild(this);
    }
}
```

>Rebuild:根据 `CanvasUpdate` 类型重新构建图形组件，确保在绘制之前，组件的几何体和材质都是最新的。

```c#
public virtual void Rebuild(CanvasUpdate update)
{
    if (canvasRenderer == null || canvasRenderer.cull)
        return;

    switch (update)
    {
        case CanvasUpdate.PreRender:
            if (m_VertsDirty)
            {
                // 更新顶点几何体
                UpdateGeometry();
                m_VertsDirty = false;
            }
            if (m_MaterialDirty)
            {
                // 更新材质
                UpdateMaterial();
                m_MaterialDirty = false;
            }
            break;
    }
}
```

>LayoutComplete:布局重建完成事件

```c#
public virtual void LayoutComplete(){}
```

>GraphicUpdateComplete:图形重建完成事件

```c#
public virtual void GraphicUpdateComplete(){}
```

>UpdateMaterial:更新UI的材质和纹理

```c#
protected virtual void UpdateMaterial()
{
    if (!IsActive())
        return;

    // 设置渲染器所用的材质数量为 1 
    canvasRenderer.materialCount = 1;
    // 指定materialForRendering应用到渲染器上
    canvasRenderer.SetMaterial(materialForRendering, 0);
    // 将纹理引用到当前材质上
    canvasRenderer.SetTexture(mainTexture);
}
```

>UpdateGeometry:更新 UI 元素的几何体。

```c#
protected virtual void UpdateGeometry()
{
    // 是否使用旧网格生成方法
    if (useLegacyMeshGeneration)
    {
        // 使用传统的方法来生成或更新 UI 元素的网格。
        DoLegacyMeshGeneration();
    }
    else
    {
        // 使用新的方法来生成或更新 UI 元素的网格。
        DoMeshGeneration();
    }
}
```

>DoMeshGeneration:新的生成或更新 UI 元素的网格方法

```c#
private void DoMeshGeneration()
{
    if (rectTransform != null && rectTransform.rect.width >= 0 && rectTransform.rect.height >= 0)
        // 调用 OnPopulateMesh 方法将顶点数据填充到 s_VertexHelper 中
        OnPopulateMesh(s_VertexHelper);
    else
        // 清除顶点帮助器，使无效图形不绘制。
        s_VertexHelper.Clear();

    // 获取所有实现了 IMeshModifier 接口的组件
    var components = ListPool<Component>.Get();
    GetComponents(typeof(IMeshModifier), components);

    // 遍历所有获取到的 IMeshModifier 组件，并调用它们的 ModifyMesh 方法来修改 s_VertexHelper 中的网格数据
    for (var i = 0; i < components.Count; i++)
        ((IMeshModifier)components[i]).ModifyMesh(s_VertexHelper);

    ListPool<Component>.Release(components);

    // 填充 workerMesh
    s_VertexHelper.FillMesh(workerMesh);
    // 将这个网格设置到 canvasRenderer 中，以便进行渲染
    canvasRenderer.SetMesh(workerMesh);
}
```

>DoLegacyMeshGeneration:旧的生成或更新 UI 元素的网格方法

```c#
        private void DoLegacyMeshGeneration()
        {
            if (rectTransform != null && rectTransform.rect.width >= 0 && rectTransform.rect.height >= 0)
            {
#pragma warning disable 618
    			// 填充 workerMesh
                OnPopulateMesh(workerMesh);
#pragma warning restore 618
            }
            else
            {
                // 清除网格数据
                workerMesh.Clear();
            }

            // 获取所有 IMeshModifier 组件
            var components = ListPool<Component>.Get();
            GetComponents(typeof(IMeshModifier), components);

            for (var i = 0; i < components.Count; i++)
            {
#pragma warning disable 618
                ((IMeshModifier)components[i]).ModifyMesh(workerMesh);
#pragma warning restore 618
            }

            ListPool<Component>.Release(components);
            canvasRenderer.SetMesh(workerMesh);
        }
```

>OnPopulateMesh:UI元素需要生成顶点时的回调函数。填充顶点缓冲区数据。

```c#
protected virtual void OnPopulateMesh(Mesh m)
{
    OnPopulateMesh(s_VertexHelper);
    s_VertexHelper.FillMesh(m);
}
```

>OnPopulateMesh:UI元素需要生成顶点时的回调函数。填充顶点缓冲区数据。

```c#
protected virtual void OnPopulateMesh(VertexHelper vh)
{
    // 获取 UI 元素调整后的矩形区域，以确保像素对齐
    var r = GetPixelAdjustedRect();
    // 包含矩形的左下角和右上角的坐标
    var v = new Vector4(r.x, r.y, r.x + r.width, r.y + r.height);

    Color32 color32 = color;
    vh.Clear();
    // 添加左下角的顶点
    vh.AddVert(new Vector3(v.x, v.y), color32, new Vector2(0f, 0f));
    // 添加左上角的顶点
    vh.AddVert(new Vector3(v.x, v.w), color32, new Vector2(0f, 1f));
    // 添加右上角的顶点
    vh.AddVert(new Vector3(v.z, v.w), color32, new Vector2(1f, 1f));
    // 添加右下角的顶点
    vh.AddVert(new Vector3(v.z, v.y), color32, new Vector2(1f, 0f));

    // 第一个三角形由顶点 0、1 和 2 组成
    vh.AddTriangle(0, 1, 2);
    // 第二个三角形由顶点 2、3 和 0 组成
    vh.AddTriangle(2, 3, 0);
}
```

>GetPixelAdjustedRect：返回最接近图形RectTransform的像素完美矩形。
>
>注意:只有当图形根画布在屏幕空间时才准确。

```c#
public Rect GetPixelAdjustedRect()
{
    // 检查 canvas 是否存在、canvas 的渲染模式是否为 WorldSpace、canvas 的 scaleFactor 是否为 0、或 canvas 的 pixelPerfect 属性是否为 false
    if (!canvas || canvas.renderMode == RenderMode.WorldSpace || canvas.scaleFactor == 0.0f || !canvas.pixelPerfect)
        // 如果条件成立，则返回 rectTransform 的原始矩形
        return rectTransform.rect;
    else
        // 否则，使用 PixelAdjustRect 方法获取调整后的矩形
        return RectTransformUtility.PixelAdjustRect(rectTransform, canvas);
}
```

>OnDidApplyAnimationProperties：动画属性发生改变时调用

```c#
protected override void OnDidApplyAnimationProperties()
{
    SetAllDirty();
}
```

>SetNativeSize：使图形具有其内容的原始大小

```c#
public virtual void SetNativeSize() {}
```

>Raycast：用于 UI 组件的点击检测

```c#
/// <param name="sp">射线的起始点，通常是屏幕坐标</param>
/// <param name="eventCamera">进行射线检测的相机</param>
public virtual bool Raycast(Vector2 sp, Camera eventCamera)
{
    // 当前对象是否被激活并启用
    if (!isActiveAndEnabled)
        return false;

    var t = transform;
    var components = ListPool<Component>.Get();

    // 是否忽略父级的 CanvasGroup
    bool ignoreParentGroups = false;
    // 控制是否继续遍历父对象
    bool continueTraversal = true;

    // 循环遍历当前对象及其所有父对象，直到没有更多的父对象为止
    while (t != null)
    {
        t.GetComponents(components);
        for (var i = 0; i < components.Count; i++)
        {
            // 检查组件是否为 Canvas 类型
            var canvas = components[i] as Canvas;
            // 如果覆盖父级的SortingLayer
            if (canvas != null && canvas.overrideSorting)
                // 停止遍历父级
                continueTraversal = false;

            // 确定射线是否有效的接口
            var filter = components[i] as ICanvasRaycastFilter;

            if (filter == null)
                continue;

            // 假设射线有效
            var raycastValid = true;

            // 检查组件是否为 CanvasGroup 类型
            var group = components[i] as CanvasGroup;
            if (group != null)
            {
                // 当前组件不忽略父级 并且获取到的group也不忽略父级
                if (ignoreParentGroups == false && group.ignoreParentGroups)
                {
                    // 忽略父级
                    ignoreParentGroups = true;
                    // 检查射线在当前位置是否有效
                    raycastValid = filter.IsRaycastLocationValid(sp, eventCamera);
                }
                else if (!ignoreParentGroups) // 当前组件不忽略父级
                    // 检查射线在当前位置是否有效
                    raycastValid = filter.IsRaycastLocationValid(sp, eventCamera);
            }
            else
            {
                // 组件不是 CanvasGroup 类型
                // 检查射线在当前位置是否有效
                raycastValid = filter.IsRaycastLocationValid(sp, eventCamera);
            }

            if (!raycastValid)
            {
                // 无效射线
                ListPool<Component>.Release(components);
                return false;
            }
        }
        // 是否继续遍历父级
        t = continueTraversal ? t.parent : null;
    }
    // 有效射线
    ListPool<Component>.Release(components);
    return true;
}
```

>PixelAdjustPoint：将给定像素点调整为像素完美。
>
>注意:只有当图形根画布在屏幕空间时才准确。

```c#
public Vector2 PixelAdjustPoint(Vector2 point)
{
    if (!canvas || canvas.renderMode == RenderMode.WorldSpace || canvas.scaleFactor == 0.0f || !canvas.pixelPerfect)
        return point;
    else
    {
        return RectTransformUtility.PixelAdjustPoint(point, transform, canvas);
    }
}
```

>CrossFadeColor：使用RGB模式实现颜色渐变效果的方法

```c#
///<param name="targetColor">目标颜色。</param>
///<param name="duration">渐变持续时间。</param>
///<param name="ignoreTimeScale">是否忽略Time.scale< / param >
///<param name="useAlpha">是否也应该补间alpha通道< / param >
public virtual void CrossFadeColor(Color targetColor, float duration, bool ignoreTimeScale, bool useAlpha)
{
    CrossFadeColor(targetColor, duration, ignoreTimeScale, useAlpha, true);
}
```

>CrossFadeColor：将颜色渐变到目标颜色

```c#
///<param name="targetColor">目标颜色。</param>
///<param name="duration">渐变持续时间。</param>
///<param name="ignoreTimeScale">是否忽略Time.scale< / param >
///<param name="useAlpha">是否也应该补间alpha通道< / param >
/// <param name="useRGB">是否使用颜色还是alpha来补间</param>
public virtual void CrossFadeColor(Color targetColor, float duration, bool ignoreTimeScale, bool useAlpha, bool useRGB)
{
    // 既不使用alpha也不使用RGB来补间 没有指定渐变模式
    if (canvasRenderer == null || (!useRGB && !useAlpha))
        return;

    // 获取当前颜色
    Color currentColor = canvasRenderer.GetColor();
    // 如果已经是目标颜色 则不进行渐变
    if (currentColor.Equals(targetColor))
    {
        m_ColorTweenRunner.StopTween();
        return;
    }

    // 决定渐变模式
    ColorTween.ColorTweenMode mode = (useRGB && useAlpha ?
        ColorTween.ColorTweenMode.All :
        (useRGB ? ColorTween.ColorTweenMode.RGB : ColorTween.ColorTweenMode.Alpha));

    // 创建一个 ColorTween 实例，并初始化其属性
    var colorTween = new ColorTween {duration = duration, startColor = canvasRenderer.GetColor(), targetColor = targetColor};
    // 添加颜色变化时的回调，调用canvasRenderer.SetColor来更新颜色
    colorTween.AddOnChangedCallback(canvasRenderer.SetColor);
    // 设置是否忽略时间缩放
    colorTween.ignoreTimeScale = ignoreTimeScale;
    // 设置渐变模式
    colorTween.tweenMode = mode;
    // 启动颜色渐变
    m_ColorTweenRunner.StartTween(colorTween);
}
```

>CreateColorFromAlpha：根据指定的透明度（`alpha`）创建一个带有该透明度的黑色颜色对象

```c#
static private Color CreateColorFromAlpha(float alpha)
{
    var alphaColor = Color.black;
    alphaColor.a = alpha;
    return alphaColor;
}
```

>CrossFadeAlpha：使用Alpha模式实现颜色渐变效果的方法

```c#
///<param name="alpha">目标alpha。</param>
///<param name="duration">渐变的持续时间，单位为秒。</param>
///<param name="ignoreTimeScale">是否应该忽略时间缩放< / param >
public virtual void CrossFadeAlpha(float alpha, float duration, bool ignoreTimeScale)
{
    CrossFadeColor(CreateColorFromAlpha(alpha), duration, ignoreTimeScale, true, false);
}
```

>添加事件监听方法

```c#
// 添加布局重建脏标记后回调
public void RegisterDirtyLayoutCallback(UnityAction action)
{
    m_OnDirtyLayoutCallback += action;
}
// 移除布局重建脏标记后回调
public void UnregisterDirtyLayoutCallback(UnityAction action)
{
    m_OnDirtyLayoutCallback -= action;
}

// 添加顶点重建脏标记后回调
public void RegisterDirtyVerticesCallback(UnityAction action)
{
    m_OnDirtyVertsCallback += action;
}
// 移除顶点重建脏标记后回调
public void UnregisterDirtyVerticesCallback(UnityAction action)
{
    m_OnDirtyVertsCallback -= action;
}

// 添加材质更新脏标记后回调
public void RegisterDirtyMaterialCallback(UnityAction action)
{
    m_OnDirtyMaterialCallback += action;
}
// 移除材质更新脏标记后回调
public void UnregisterDirtyMaterialCallback(UnityAction action)
{
    m_OnDirtyMaterialCallback -= action;
}
```

#### Unity编辑器中的方法

>OnRebuildRequested：主要处理在编辑模式下当需要重新构建 UI 图形时的行为。

```c#
#if UNITY_EDITOR
        /// <summary>
        /// 如果需要重建图形，Unity会发出仅编辑器的回调。
        /// 当资产被重新导入时当前发送。
        /// </summary>
        public virtual void OnRebuildRequested()
        {
            // 当请求重建时，我们需要重建所有图形
            // 和相关组件…正确的做法是通过
            // 调用OnValidate…因为MB没有公共基类
            // 我们通过反射来完成。它又脏又丑……编辑器。
            var mbs = gameObject.GetComponents<MonoBehaviour>();
            foreach (var mb in mbs)
            {
                if (mb == null)
                    continue;
                var methodInfo = mb.GetType().GetMethod("OnValidate", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
                if (methodInfo != null)
                    methodInfo.Invoke(mb, null);
            }
        }

        protected override void Reset()
        {
            SetAllDirty();
        }

#endif
```

>OnValidate：编辑器模式下，脚本的属性在 Inspector 中被更改时自动调用

```c#
#if UNITY_EDITOR
        protected override void OnValidate()
        {
            base.OnValidate();
    		// 对所有属性设置为脏标记
            SetAllDirty();
        }
#endif
```

