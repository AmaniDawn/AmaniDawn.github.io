---
title: UGUI源码解析——GridLayoutGroup
tags: 
categories: 
mathjax: true
date: 2024-07-29
updated: 2024-07-29
description: 继承自LayoutGroup，为网格布局组件，它同时实现了水平和竖直布局。
---

>GridLayoutGroup：继承自LayoutGroup，为网格布局组件，它同时实现了水平和竖直布局。

#### 源码解析

>枚举Corner：标记网格起始的位置，有左上角、右上角、左下角、右下角。

```c#
public enum Corner
{
    /// <summary>
    /// 左上角
    /// </summary>
    UpperLeft = 0,
    /// <summary>
    /// 右上角
    /// </summary>
    UpperRight = 1,
    /// <summary>
    /// 左下角
    /// </summary>
    LowerLeft = 2,
    /// <summary>
    /// 右下角
    /// </summary>
    LowerRight = 3
}
```

> Axis：标记开始排列的轴方向，有水平轴和垂直轴。

```c#
public enum Axis
{
    /// <summary>
    /// 水平轴
    /// </summary>
    Horizontal = 0,
    /// <summary>
    /// 垂直轴
    /// </summary>
    Vertical = 1
}
```

> Constraint：约束行列的个数

```c#
public enum Constraint
{
    /// <summary>
    /// 不限制行列多少个
    /// </summary>
    Flexible = 0,
    /// <summary>
    /// 约束行数
    /// </summary>
    FixedColumnCount = 1,
    /// <summary>
    /// 约束列数
    /// </summary>
    FixedRowCount = 2
}
```

>一些序列化的字段

```c#
/// <summary>
/// 单元格起始角 Corner
/// </summary>
[SerializeField] protected Corner m_StartCorner = Corner.UpperLeft;
public Corner startCorner { get { return m_StartCorner; } set { SetProperty(ref m_StartCorner, value); } }

/// <summary>
/// 单元格沿着哪个轴开始放置填充，优先填满一个轴才进行换轴
/// </summary>
[SerializeField] protected Axis m_StartAxis = Axis.Horizontal;
public Axis startAxis { get { return m_StartAxis; } set { SetProperty(ref m_StartAxis, value); } }

/// <summary>
/// 单元格大小
/// </summary>
[SerializeField] protected Vector2 m_CellSize = new Vector2(100, 100);
public Vector2 cellSize { get { return m_CellSize; } set { SetProperty(ref m_CellSize, value); } }

/// <summary>
/// 单元格两个轴向上的间距
/// </summary>
[SerializeField] protected Vector2 m_Spacing = Vector2.zero;
public Vector2 spacing { get { return m_Spacing; } set { SetProperty(ref m_Spacing, value); } }

/// <summary>
/// 行列约束的规则 Constraint
/// </summary>
[SerializeField] protected Constraint m_Constraint = Constraint.Flexible;
public Constraint constraint { get { return m_Constraint; } set { SetProperty(ref m_Constraint, value); } }

/// <summary>
/// 约束轴上限制最多存在多少个单元格
/// </summary>
[SerializeField] protected int m_ConstraintCount = 2;
public int constraintCount { get { return m_ConstraintCount; } set { SetProperty(ref m_ConstraintCount, Mathf.Max(1, value)); } }
```

> OnValidate：强制刷新 constraintCount 确保它的值在编辑器中能被正确应用和验证。

```c#
#if UNITY_EDITOR
    protected override void OnValidate()
    {
        base.OnValidate();
        constraintCount = constraintCount;
    }
#endif
```

[**UGUI源码解析——LayoutGroup**](https://azurebubble.github.io/posts/51e1a8f9.html)

> CalculateLayoutInputHorizontal：由布局系统调用，计算水平布局的大小。

```c#
public override void CalculateLayoutInputHorizontal()
{
    base.CalculateLayoutInputHorizontal();

    // 根据约束类型 计算列数
    int minColumns = 0;
    int preferredColumns = 0;
    if (m_Constraint == Constraint.FixedColumnCount)
    {
        // 如果约束类型是固定列数，则最小列数和首选列数都设置为 m_ConstraintCount
        minColumns = preferredColumns = m_ConstraintCount;
    }
    else if (m_Constraint == Constraint.FixedRowCount)
    {
        // 如果约束类型是固定行数，则根据子对象的数量和行数约束计算最小列数和首选列数
        minColumns = preferredColumns = Mathf.CeilToInt(rectChildren.Count / (float)m_ConstraintCount - 0.001f);
    }
    else
    {
        // 如果没有约束，则最小列数为1，首选列数为平方根下的子对象数量向上取整
        minColumns = 1;
        preferredColumns = Mathf.CeilToInt(Mathf.Sqrt(rectChildren.Count));
    }

    // padding.horizontal：表示水平方向上的内边距。
    // (cellSize.x + spacing.x) * minColumns - spacing.x 表示根据列数计算出的最小宽度，考虑了每个单元格的大小和间距。
    // (cellSize.x + spacing.x) * preferredColumns - spacing.x 表示根据列数计算出的首选宽度，同样考虑了每个单元格的大小和间距。
    SetLayoutInputForAxis(
        padding.horizontal + (cellSize.x + spacing.x) * minColumns - spacing.x,
        padding.horizontal + (cellSize.x + spacing.x) * preferredColumns - spacing.x,
        -1, 0);
}
```

> CalculateLayoutInputVertical：由布局系统调用，计算垂直布局的大小。

```c#
public override void CalculateLayoutInputVertical()
{
    // 计算最小行数
    int minRows = 0;
    if (m_Constraint == Constraint.FixedColumnCount)
    {
        // 如果约束类型是固定列数，则根据子对象数量和列数约束计算最小行数
        minRows = Mathf.CeilToInt(rectChildren.Count / (float)m_ConstraintCount - 0.001f);
    }
    else if (m_Constraint == Constraint.FixedRowCount)
    {
        // 如果约束类型是固定行数，则最小行数直接设置为 m_ConstraintCount
        minRows = m_ConstraintCount;
    }
    else
    {
        // 如果没有约束，则根据容器宽度计算可以容纳的列数，再根据子对象数量计算最小行数
        float width = rectTransform.rect.width;
        int cellCountX = Mathf.Max(1, Mathf.FloorToInt((width - padding.horizontal + spacing.x + 0.001f) / (cellSize.x + spacing.x)));
        minRows = Mathf.CeilToInt(rectChildren.Count / (float)cellCountX);
    }
    
	// padding.vertical：表示垂直方向上的内边距。
    // (cellSize.y + spacing.y) * minRows - spacing.y 表示根据行数计算出的垂直方向上的最小高度，考虑了每个单元格的大小和间距。
    float minSpace = padding.vertical + (cellSize.y + spacing.y) * minRows - spacing.y;
    SetLayoutInputForAxis(minSpace, minSpace, -1, 1);
}

```

>SetLayoutVertical：这个方法通常用于在水平方向上设置布局，以确保布局组件内的子对象按照规定的方式进行排列和调整位置。

```c#
public override void SetLayoutVertical()
{
    SetCellsAlongAxis(1);
}

private void SetCellsAlongAxis(int axis)
{
    //通常情况下，布局控制器应该只在调用水平轴时设置水平值
	//当对垂直轴调用时，只调用垂直值。
	//然而，在本例中，我们在调用垂直轴时设置了水平和垂直位置。
	//因为我们只设置水平位置而不设置大小，所以它应该不会影响子元素的布局。
	//因此不应该打破所有水平布局必须在所有垂直布局之前计算的规则。
    if (axis == 0)
    {
        // 仅在调用水平轴时设置大小，而不是位置。
        for (int i = 0; i < rectChildren.Count; i++)
        {
            RectTransform rect = rectChildren[i];

            m_Tracker.Add(this, rect,
                DrivenTransformProperties.Anchors |
                DrivenTransformProperties.AnchoredPosition |
                DrivenTransformProperties.SizeDelta);

            // 设置所有子元素的锚点为左上角(0,1) 并且设置他们的大小为cellSize
            rect.anchorMin = Vector2.up;
            rect.anchorMax = Vector2.up;
            rect.sizeDelta = cellSize;
        }
        return;
    }

    // 如果垂直轴的布局
    float width = rectTransform.rect.size.x; // 容器的宽度
    float height = rectTransform.rect.size.y; // 容器的高度

    int cellCountX = 1;
    int cellCountY = 1;
    if (m_Constraint == Constraint.FixedColumnCount)
    {
        // 如果限制了列数
        // 设置 X 轴的格子数量为预定义数量
        cellCountX = m_ConstraintCount;

        // 如果子元素的数量大于预定义的 X 轴格子数 则计算 Y 轴行数
        if (rectChildren.Count > cellCountX)
            // 如果有余数 则 再加 1
            cellCountY = rectChildren.Count / cellCountX + (rectChildren.Count % cellCountX > 0 ? 1 : 0);
    }
    else if (m_Constraint == Constraint.FixedRowCount)
    {
        // 如果限制了行数
        cellCountY = m_ConstraintCount;

        // 如果子元素数量大于限制行数 则计算列数
        if (rectChildren.Count > cellCountY)
            cellCountX = rectChildren.Count / cellCountY + (rectChildren.Count % cellCountY > 0 ? 1 : 0);
    }
    else
    {
        // 如果没有限制
        // 如果单元格大小+间距小于等于0，表示水平方向没有元素数量限制，应尽可能容纳多的元素
        if (cellSize.x + spacing.x <= 0)
            cellCountX = int.MaxValue;
        else
            // 否则，计算水平方向上可以容纳的单元格数量。使用 Mathf.FloorToInt 函数计算 (width - padding.horizontal + spacing.x + 0.001f) / (cellSize.x + spacing.x)，这个表达式计算容器宽度减去水平填充、加上间距和微小调整后能容纳多少个单元格的整数部分。
            cellCountX = Mathf.Max(1, Mathf.FloorToInt((width - padding.horizontal + spacing.x + 0.001f) / (cellSize.x + spacing.x)));

        // 同上
        if (cellSize.y + spacing.y <= 0)
            cellCountY = int.MaxValue;
        else
            cellCountY = Mathf.Max(1, Mathf.FloorToInt((height - padding.vertical + spacing.y + 0.001f) / (cellSize.y + spacing.y)));
    }

    // 计算起始角的坐标
    int cornerX = (int)startCorner % 2; // (0/1)
    int cornerY = (int)startCorner / 2; // (0/1)

    // 计算主轴上的单元格数量
    int cellsPerMainAxis, actualCellCountX, actualCellCountY;
    if (startAxis == Axis.Horizontal)
    {
        // 主轴最大数量
        cellsPerMainAxis = cellCountX;
        // 横轴最大数量
        actualCellCountX = Mathf.Clamp(cellCountX, 1, rectChildren.Count);
        // 竖轴最大数量
        actualCellCountY = Mathf.Clamp(cellCountY, 1, Mathf.CeilToInt(rectChildren.Count / (float)cellsPerMainAxis));
    }
    else
    {
        // 同上 计算垂直布局
        cellsPerMainAxis = cellCountY;
        actualCellCountY = Mathf.Clamp(cellCountY, 1, rectChildren.Count);
        actualCellCountX = Mathf.Clamp(cellCountX, 1, Mathf.CeilToInt(rectChildren.Count / (float)cellsPerMainAxis));
    }

    // 计算容器所需的空间大小
    Vector2 requiredSpace = new Vector2(
        actualCellCountX * cellSize.x + (actualCellCountX - 1) * spacing.x,
        actualCellCountY * cellSize.y + (actualCellCountY - 1) * spacing.y
    );
    // 计算起始偏移量
    Vector2 startOffset = new Vector2(
        GetStartOffset(0, requiredSpace.x),
        GetStartOffset(1, requiredSpace.y)
    );

    // 设置子元素的位置
    for (int i = 0; i < rectChildren.Count; i++)
    {
        int positionX;
        int positionY;
        if (startAxis == Axis.Horizontal)
        {
            // 假设水平轴限制最多两个元素
            // X ： 0 % 2 = 0  1 % 2 = 1 2 % 2 = 0 3 % 2 = 1 .....
            // Y ： 0 / 2 = 0  1 / 2 = 0 2 / 2 = 1 3 / 2 = 1 ..... 
            positionX = i % cellsPerMainAxis;
            positionY = i / cellsPerMainAxis;
        }
        else
        {
            // 垂直轴 同上
            positionX = i / cellsPerMainAxis;
            positionY = i % cellsPerMainAxis;
        }
        
        // 根据起始角的位置 计算元素的位置 假设是一个四行三列的布局
        // 例如如果起始角为左上角(0,0)，则第一个元素坐标为(0,0)
        // 如果起始角为右上角(1,0)，则第一个元素坐标为(2,0) 以此类推
        if (cornerX == 1)
            positionX = actualCellCountX - 1 - positionX;
        if (cornerY == 1)
            positionY = actualCellCountY - 1 - positionY;

        SetChildAlongAxis(rectChildren[i], 0, startOffset.x + (cellSize[0] + spacing[0]) * positionX, cellSize[0]);
        SetChildAlongAxis(rectChildren[i], 1, startOffset.y + (cellSize[1] + spacing[1]) * positionY, cellSize[1]);
    }
}
```

