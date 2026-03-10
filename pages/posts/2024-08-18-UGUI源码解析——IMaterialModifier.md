---
title: UGUI源码解析——IMaterialModifier
tags: 
categories: 
mathjax: true
description: 材质处理的接口，可以在子类中实现GetModifiedMaterial方法去修改渲染的材质。
date: 2024-08-18
updated: 2024-08-18
---

>IMaterialModifier：是材质处理的接口，可以在子类中实现GetModifiedMaterial方法去修改渲染的材质。
>Mask实现了此接口

#### 源码解析

> GetModifiedMaterial：

```c#
Material GetModifiedMaterial(Material baseMaterial);
```

> Canvas每帧更新时会将materialForRendering赋给canvasRenderer进行渲染
