---
title: UGUI源码解析——MaskableGraphic
tags:
categories: UGUI源码解析
mathjax: true
description: 继承自 Graphic，实现了裁剪和遮罩功能。
date: 2024-09-15
updated: 2024-09-15
---

>MaskableGraphic：是可被遮罩的图像，严谨的说应该是可被遮罩和可被裁剪的图像，可它继承自Graphic类和IClippable、IMaskable、IMaterialModifier接口，在Graphic的基础上实现了裁剪和遮罩功能，Image、RawImage、Text都继承自MaskableGraphic类

[**UGUI源码解析——Graphic**](https://azurebubble.github.io/posts/ee37f782.html)

[**UGUI源码解析——IMaterialModifier**](https://azurebubble.github.io/posts/6390c557.html)

[**UGUI源码解析——IMaskable**](https://azurebubble.github.io/posts/e480027.html)

[**UGUI源码解析——IClippable**](https://azurebubble.github.io/posts/27cfff35.html)

#### 源码解析

>
