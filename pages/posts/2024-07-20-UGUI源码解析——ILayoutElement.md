---
title: UGUI源码解析——ILayoutElement
path: /posts/ugui-ilayoutelement
tags:
categories: UGUI源码解析
mathjax: true
description: 挂载了实现ILayoutElement的组件的对象被视为一个布局元素，布局元素不直接设置布局，只计算自身属性，设置布局由布局控制器设置
date: 2024-07-20
updated: 2024-07-20
---

>ILayoutElement：挂载了实现ILayoutElement接口的组件的对象被视为一个布局元素，<font color=red>布局元素不直接设置布局，只计算自身属性，设置布局由布局控制器设置</font>

#### 源码解析

> CalculateLayoutInputHorizontal：先计算水平布局的属性值，当调用这个方法时，子节点已经有了最新的水平布局输入。

```c#
void CalculateLayoutInputHorizontal();
```

> CalculateLayoutInputVertical：后计算垂直布局的属性值，当调用这个方法时，子节点已经有了最新的垂直布局输入。

```c#
void CalculateLayoutInputVertical();
```

> minWidth：此布局元素属性分配最小的宽度

```c#
float minWidth { get; }
```

> preferredWidth：如果有足够的空间，应该分配这个布局元素的首选宽度，preferredWidth可以设置为-1来移除大小

```c#
float preferredWidth { get; }
```

> flexibleWidth：布局元素在有额外可用空间时应该分配的额外相对宽度

```c#
float flexibleWidth { get; }
```

> minHeight：此布局元素属性分配最小的高度

```c#
float minHeight { get; }
```

> preferredHeight：如果有足够的空间，应该分配这个布局元素的首选高度，preferredHeight可以设置为-1来移除大小

```c#
float preferredHeight { get; }
```

> flexibleHeight：布局元素在有额外可用空间时应该分配的额外相对高度

```c#
float flexibleHeight { get; }
```

> layoutPriority：获取该组件的布局优先级，当一个游戏对象上的多个组件实现了ILayoutElement接口时，确定到底由哪个组件提供布局属性，值越大优先级越高，小于0的值将被忽略。通过这种方式，组件可以只重写选中的属性，让剩余的值为-1或其他小于零的值。

```c#
int layoutPriority { get; }
```

