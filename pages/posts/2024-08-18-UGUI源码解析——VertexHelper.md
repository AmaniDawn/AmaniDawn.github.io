---
title: UGUI源码解析——VertexHelper
path: /posts/ugui-vertexhelper
tags:
categories: UGUI源码解析
mathjax: true
date: 2024-08-18
updated: 2024-08-18
description: 网格数据的工具类。
---

> VertexHelper：是一个工具类，可以帮助我们快速创建网格
> 我们知道一个UI想要显示出来就需要对应的Mesh网格信息，而生成Mesh的网格信息就保存在了VertexHelper中，实际上我们可以直接操作Mesh类添加顶点等数据，可以理解为VertexHelper是UGUI与Mesh之间的一座桥梁。

#### 源码解析

>字段

```c#
private List<Vector3> m_Positions; // 顶点位置
private List<Color32> m_Colors; // 顶点颜色
private List<Vector2> m_Uv0S; // 第一个顶点的UV坐标
private List<Vector2> m_Uv1S; // 第二个顶点的UV坐标
private List<Vector2> m_Uv2S; // 第三个顶点的UV坐标
private List<Vector2> m_Uv3S; // 第四个顶点的UV坐标
private List<Vector3> m_Normals; // 法线向量
private List<Vector4> m_Tangents; // 切线向量
private List<int> m_Indices; // 三角面顶点索引

// 属性
// 当前顶点数
public int currentVertCount
{
    get { return m_Positions != null ? m_Positions.Count : 0; }
}
// 当前顶点索引（为了绘制三角形，同一个顶点可能会使用多次，这里会统计使用多次的情况）
public int currentIndexCount
{
    get { return m_Indices != null ? m_Indices.Count : 0; }
}

// 静态默认切线向量 X\Y\Z\W
private static readonly Vector4 s_DefaultTangent = new Vector4(1.0f, 0.0f, 0.0f, -1.0f);
// 静态默认法线向量 向后
private static readonly Vector3 s_DefaultNormal = Vector3.back;
// 记录顶点数据列表是否已初始化
private bool m_ListsInitalized = false;
```

>构造函数：将 Mesh 对象 m 中的各个顶点属性(如位置、颜色、UV坐标、法线、切线和索引)提取到 VertexHelper 实例的相应列表中。

```c#
public VertexHelper(Mesh m)
{
    // 初始化数据列表
    InitializeListIfRequired();
	// 将 Mesh 对象 m 中的各个顶点属性(如位置、颜色、UV坐标、法线、切线和索引)提取到 VertexHelper 实例的相应列表中。
    m_Positions.AddRange(m.vertices);
    m_Colors.AddRange(m.colors32);
    m_Uv0S.AddRange(m.uv);
    m_Uv1S.AddRange(m.uv2);
    m_Uv2S.AddRange(m.uv3);
    m_Uv3S.AddRange(m.uv4);
    m_Normals.AddRange(m.normals);
    m_Tangents.AddRange(m.tangents);
    m_Indices.AddRange(m.GetIndices(0));
}
```

>InitializeListIfRequired：通过对象池初始化所有的数据列表

```c#
private void InitializeListIfRequired()
{
    if (!m_ListsInitalized)
    {
        m_Positions = ListPool<Vector3>.Get();
        m_Colors = ListPool<Color32>.Get();
        m_Uv0S = ListPool<Vector2>.Get();
        m_Uv1S = ListPool<Vector2>.Get();
        m_Uv2S = ListPool<Vector2>.Get();
        m_Uv3S = ListPool<Vector2>.Get();
        m_Normals = ListPool<Vector3>.Get();
        m_Tangents = ListPool<Vector4>.Get();
        m_Indices = ListPool<int>.Get();
        m_ListsInitalized = true;
    }
}
```

>Dispose：释放内存

```c#
public void Dispose()
{
    if (m_ListsInitalized)
    {
        ListPool<Vector3>.Release(m_Positions);
        ListPool<Color32>.Release(m_Colors);
        ListPool<Vector2>.Release(m_Uv0S);
        ListPool<Vector2>.Release(m_Uv1S);
        ListPool<Vector2>.Release(m_Uv2S);
        ListPool<Vector2>.Release(m_Uv3S);
        ListPool<Vector3>.Release(m_Normals);
        ListPool<Vector4>.Release(m_Tangents);
        ListPool<int>.Release(m_Indices);

        m_Positions = null;
        m_Colors = null;
        m_Uv0S = null;
        m_Uv1S = null;
        m_Uv2S = null;
        m_Uv3S = null;
        m_Normals = null;
        m_Tangents = null;
        m_Indices = null;

        m_ListsInitalized = false;
    }
}
```

>Clear：如果初始化过，则清空缓存

```c#
public void Clear()
{
    if (m_ListsInitalized)
    {
        m_Positions.Clear();
        m_Colors.Clear();
        m_Uv0S.Clear();
        m_Uv1S.Clear();
        m_Uv2S.Clear();
        m_Uv3S.Clear();
        m_Normals.Clear();
        m_Tangents.Clear();
        m_Indices.Clear();
    }
}
```

>SetUIVertex：将某个顶点数据赋值给指定索引的顶点数据

```c#
public void SetUIVertex(UIVertex vertex, int i)
{
    InitializeListIfRequired();

    m_Positions[i] = vertex.position;
    m_Colors[i] = vertex.color;
    m_Uv0S[i] = vertex.uv0;
    m_Uv1S[i] = vertex.uv1;
    m_Uv2S[i] = vertex.uv2;
    m_Uv3S[i] = vertex.uv3;
    m_Normals[i] = vertex.normal;
    m_Tangents[i] = vertex.tangent;
}
```

>FillMesh：将当前VertexHelper中的数据填充到输入的Mesh上，注意顶点数不能超过65000

```c#
public void FillMesh(Mesh mesh)
{
    InitializeListIfRequired();

    mesh.Clear();

    if (m_Positions.Count >= 65000)
        throw new ArgumentException("Mesh can not have more than 65000 vertices");

    mesh.SetVertices(m_Positions);
    mesh.SetColors(m_Colors);
    mesh.SetUVs(0, m_Uv0S);
    mesh.SetUVs(1, m_Uv1S);
    mesh.SetUVs(2, m_Uv2S);
    mesh.SetUVs(3, m_Uv3S);
    mesh.SetNormals(m_Normals);
    mesh.SetTangents(m_Tangents);
    mesh.SetTriangles(m_Indices, 0);
    mesh.RecalculateBounds();
}
```

>AddVert：添加顶点

```c#
public void AddVert(Vector3 position, Color32 color, Vector2 uv0, Vector2 uv1, Vector2 uv2, Vector2 uv3, Vector3 normal, Vector4 tangent)
{
    InitializeListIfRequired();

    m_Positions.Add(position);
    m_Colors.Add(color);
    m_Uv0S.Add(uv0);
    m_Uv1S.Add(uv1);
    m_Uv2S.Add(uv2);
    m_Uv3S.Add(uv3);
    m_Normals.Add(normal);
    m_Tangents.Add(tangent);
}

public void AddVert(Vector3 position, Color32 color, Vector2 uv0, Vector2 uv1, Vector3 normal, Vector4 tangent)
{
    AddVert(position, color, uv0, uv1, Vector2.zero, Vector2.zero, normal, tangent);
}

public void AddVert(Vector3 position, Color32 color, Vector2 uv0)
{
    AddVert(position, color, uv0, Vector2.zero, s_DefaultNormal, s_DefaultTangent);
}

public void AddVert(UIVertex v)
{
    AddVert(v.position, v.color, v.uv0, v.uv1, v.normal, v.tangent);
}
```

>AddTriangle：添加三角形，按照顶点索引顺序进行绘制（CanvasRender和MeshRender不同在于三角形索引顺序不论正反CanvasRender都能够绘制出来）
>
>### **1. CanvasRenderer:**
>
>- **CanvasRenderer** 是 Unity UI 系统中的一部分，用于绘制 UI 元素（如按钮、图像等）。
>- **绘制方式**: `CanvasRenderer` 不依赖于三角形的索引顺序（即正向或反向）。它可以正确绘制三角形，即使它们的顶点索引顺序是反向的（逆时针或顺时针）。
>- **原因**: 在 Canvas 系统中，顶点的索引顺序通常不会影响绘制结果，因为 CanvasRenderer 主要关注的是 UI 组件的渲染，而不是底层的几何图形处理。Canvas 的渲染逻辑处理的是已经转换成屏幕坐标系的元素，而不是深度或面朝向。
>
>### **2. MeshRenderer:**
>
>- **MeshRenderer** 是用于渲染 3D 网格的组件。
>- **绘制方式**: `MeshRenderer` 对三角形的索引顺序有严格的要求。默认情况下，它期望三角形的顶点按顺时针（或逆时针）顺序排列，以确定三角形的正面（前面）。如果三角形的顶点索引顺序不符合预期，可能会导致三角形的面朝向不正确，或者三角形不会被渲染。
>- **原因**: 在 3D 图形渲染中，面朝向决定了哪些面是可见的，哪些面是隐藏的（背面剔除）。正确的索引顺序对于正确的深度测试和视觉渲染是至关重要的。

```c#
public void AddTriangle(int idx0, int idx1, int idx2)
{
    InitializeListIfRequired();
	// 三角顶点的索引
    m_Indices.Add(idx0);
    m_Indices.Add(idx1);
    m_Indices.Add(idx2);
}
```

>AddUIVertexQuad：根据传入的顶点数据数组(verts)，从当前索引处添加一个长方形，顶点数据数组(verts)中不论有几个数据也只能添加四个顶点数据

```c#
public void AddUIVertexQuad(UIVertex[] verts)
{
    int startIndex = currentVertCount;

    for (int i = 0; i < 4; i++)
        AddVert(verts[i].position, verts[i].color, verts[i].uv0, verts[i].uv1, verts[i].normal, verts[i].tangent);

    AddTriangle(startIndex, startIndex + 1, startIndex + 2);
    AddTriangle(startIndex + 2, startIndex + 3, startIndex);
}
```

>AddUIVertexStream：将传入的顶点数据列表(verts)覆盖掉当前VertexHelper中的顶点数据，不会覆盖m_Indices
>将传入的顶点索引列表(indices)添加到当前VertexHelper的m_Indices列表中

```c#
public void AddUIVertexStream(List<UIVertex> verts, List<int> indices)
{
    InitializeListIfRequired();

    if (verts != null)
    {
        CanvasRenderer.AddUIVertexStream(verts, m_Positions, m_Colors, m_Uv0S, m_Uv1S, m_Uv2S, m_Uv3S, m_Normals, m_Tangents);
    }

    if (indices != null)
    {
        m_Indices.AddRange(indices);
    }
}
```

>AddUIVertexTriangleStream：将传入的顶点数据列表(verts)覆盖添加到当前VertexHelper中，会覆盖掉之前VertexHelper中的所有数据包括m_Indices列表，传入的顶点数据列表(verts)有几个数据，最终VertexHelper中的顶点列表和顶点索引列表就有几个数据，传入的顶点数据列表(verts)的长度必须是三的倍数

```c#
public void AddUIVertexTriangleStream(List<UIVertex> verts)
{
    if (verts == null)
        return;

    InitializeListIfRequired();

    CanvasRenderer.SplitUIVertexStreams(verts, m_Positions, m_Colors, m_Uv0S, m_Uv1S, m_Uv2S, m_Uv3S, m_Normals, m_Tangents, m_Indices);
}
```

>GetUIVertexStream：获取当前VertexHelper中的所有顶点数据
>将当前VertexHelper中的所有顶点数据填充到传入的顶点数据列表中(stream)，会根据m_Indices顶点索引列表的数量创建顶点数据，例如一个长方形需要4个顶点，6个顶点索引，使用此方法得到的列表元素数量是6

```c#
public void GetUIVertexStream(List<UIVertex> stream)
{
    if (stream == null)
        return;

    InitializeListIfRequired();

    CanvasRenderer.CreateUIVertexStream(stream, m_Positions, m_Colors, m_Uv0S, m_Uv1S, m_Uv2S, m_Uv3S, m_Normals, m_Tangents, m_Indices);
}
```

>PopulateUIVertex：返回指定索引的顶点数据

```c#
public void PopulateUIVertex(ref UIVertex vertex, int i)
{
    InitializeListIfRequired();

    vertex.position = m_Positions[i];
    vertex.color = m_Colors[i];
    vertex.uv0 = m_Uv0S[i];
    vertex.uv1 = m_Uv1S[i];
    vertex.uv2 = m_Uv2S[i];
    vertex.uv3 = m_Uv3S[i];
    vertex.normal = m_Normals[i];
    vertex.tangent = m_Tangents[i];
}
```

