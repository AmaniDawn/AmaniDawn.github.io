---
title: Unity常用Attribue用法
date: 2022-09-14
updated: 2022-09-14
tags:
  - C#
  - Unity
categories:
  - 学习笔记
---

## 标记字段

***

#### [Space]

- 可以与上面形成一个空隙，可以带参数。如[Space(20)];

```c#
// [Space]的用法和特性
[Space]
public string worldName0;
[Space(20)]
public string worldName1;
```

![未使用Space的效果](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/NoSpace.jpg)

![使用Space的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/Space.jpg)

#### [Header("XXX")]

- 在Inspector面板上给定义的字段加上描述，可以将属性隔离，形成分组。

```c#
// [Header("XXX")]的用法和特性
[Header("这是一个name分组")]
public string worldName0;
public string worldName1;
[Header("这是一个age分组")]
public string age1;
public string age2;
```

![使用【Header】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/使用【Header】的效果.jpg)

#### [Tooltip("XXX")]

- 给一个变量添加这个属性后，在Inspector面板将鼠标悬停在该变量上可以显示提示。

```c#
// [Tooltip("XXX")]的用法和特性
[Tooltip("请给worldName0输入一个值")]
public string worldName0;
[Space(50)]
public string worldName1;
```

![使用【Tooltip】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/使用【Tooltip】的效果.jpg)

#### [Range(min,max)]

- 限制一个float,int类型的变量的取值范围并以滑动条显示在Inspector中。

```c#
// [Range(min, max)]的用法和特性
[Range(1,50)]
public int age1; // 使用 [Range(min, max)] 特性
public int age2; // 未使用 [Range(min, max)] 特性
```

![使用【Range(min, max)】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/使用【Range(min, max)】的效果.gif)

#### [Min(min)]

- 限制一个float,int类型的变量的最小值。

```c#
// [Min(min)]的用法和特性
[Min(1)]
public int age1; // 使用 [Min(min)] 特性
public int age2; // 未使用 [Min(min)] 特性
```

![使用【Min】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/使用【Min】的效果.gif)

#### [SerializeField]

- 强制序列化一个私有的变量，使其可以在Inspector面板显示，很多UI都会对private的组件进行强制序列化。

```c#
// [SerializeField]的用法和特性
[SerializeField]
private int worldName0; // 使用 [SerializeField] 特性
private int worldName1; // 未使用 [SerializeField] 特性
```

![使用【SerializeField】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/使用【SerializeField】的效果.jpg)

#### [NonSerialized]

- 在Inspector面板中隐藏public属性，不执行序列化。（该变量在序列化时改变了其初始化的值，游戏在运行和结束时，值会被强制修改成初始值）

```c#
// [SerializeField]的用法和特性
[NonSerialized]
public int worldName0; // 使用 [NonSerialized] 特性
public int worldName1; // 未使用 [NonSerialized] 特性
```

![未使用【NonSerialized】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/未使用【NonSerialized】的效果.jpg)

#### [HideInInspector]

- 使属性在Inspector中隐藏。但是还是可以序列化，想赋值可以通过写程序赋值序列化。（该变量在序列化时改变了其初始化的值，游戏在运行和结束时，值不会被强制修改成初始值，仍保留修改后的值)

```c#
// [HideInInspector]的用法和特性
[HideInInspector]
public int worldName0; // 使用 [HideInInspector] 特性
public int worldName1; // 未使用 [HideInInspector] 特性
```

![未使用【HideInInspector】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/未使用【HideInInspector】的效果.jpg)

#### [System.Serializable]

- 可序列化自定义的类或结构体，即当自定义的类或结构体中存在public成员的时候可以在Inspector显示。

```c#
//[System.Serializable]的用法和特性
[System.Serializable]
public class People
{
    public int age;
    string name;
    private int day;
}

//另外一个类需要用到People类里的属性
public class HelloWorld : MonoBehaviour
{
    public People people;
}
```

![使用【System.Serializable】的效果.jpg](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/showImg/使用【System.Serializable】的效果.jpg)

#### [InspectorName("枚举A")]

- 标记枚举类型的枚举值，可以使枚举值在Inspector上显示的名字改变

#### [FormerlySerializedAs("XXX")]
- 使变量以另外的名称进行序列化，并且在变量自身修改名称的时候，不会丢失之前的序列化的值

#### [ContextMenuItem("显示的方法名","方法")]

- 标记字段，在Inspector面板上给字段右键段添加一个菜单,不能是静态函数

#### [Multiline]

- 添加在string类型的变量上,可以在Inspector面板上显示一个多行文本框

#### [TextArea]

- 该属性可以把string在Inspector面板上变为一个带有滚动条的文本域

#### [NotConverted]

- 在变量上使用，可以指定该变量在build的时候，不要转换为目标平台的类型

#### [NotFlashValidated]

- 在变量上使用，在Flash平台build的时候，对该变量不进行类型检查。Unity5.0中已经移除了这个属性

#### [NotRenamed]

- 禁止对变量和方法进行重命名。Unity5.0中已经移除了这个属性

#### [ColorUsage(false, true, 0f, 8f, 1f, 1f)]

- 第一个参数:是否启用 Alpha 通道
- 第二个参数:是否启用 HDR 模式,启用后多四个参数为 最小/最大亮度,最小/最大曝光度

#### [GradientUsage]

- 给一个 Gradient 类型的变量添加这个属性用来设置是否为 HDR 渐变模式

#### [Delayed]

- 标记int/float/string类型的变量,在Inspector面板修改变量值时,只有按下Enter键 或 鼠标失去焦点后值才会改变

#### [ExecuteInEditMode]

- 标记的类在编辑模式下也能运行，游戏运行时复原。


#### [ExecuteAlways]

- 标记的类的修改将会永久修改，不会复原。
