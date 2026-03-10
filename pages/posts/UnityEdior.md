---
title: UnityEdior
date: 2023-12-06
updated: 2023-12-06
tags:
  - UnityEditor
  - C#
  - Unity
categories:
  - 学习笔记
  - C#
  - Unity
---

![插入排序](https://cdn.jsdelivr.net/gh/AzureBubble/PicBed@main/UnityEditor/插入排序动图.gif)

> UnityEditor编辑器的代码必须放在Editor文件夹下，因为这个文件夹下的代码是不会被打包出去，只允许程序员在Unity编辑器下使用，如果不放在Editor这个文件夹下，打包时若包含UnityEditor的代码，会报错。

#### MenuItem

##### 1.使用方法:[MenuItem("path")]

```c#
using UnityEditor;
using UnityEngine;

namespace EditorExtensions
{
    public class MenuItemExample
    {
        // [MenuItem()] 修饰的必须是一个静态方法
        // 才会在Unity菜单栏出现先对应的按键
        // ()括号里的是这个方法在菜单栏的树形路径
        [MenuItem("EditorExtensions/MenuItem/EditorTest")]
        private static void EditorTest()
        {
            Debug.Log("Hello Editor");
        }
    }
}
```

##### 2.Application.OpenURL("path") 打开一个网址或者一个Application应用

```c#
[MenuItem("EditorExtensions/MenuItem/OpenBilibili")]
private static void OpenBilibili()
{
    // 可以通过这个Api接口打开一个网址或者一个Application应用
    Application.OpenURL("Http://bilibili.com");
}
```

##### 3.EditorUtility.RevealInFinder("path") 打开一个指定的文件目录

```c#
[MenuItem("EditorExtensions/MenuItem/打开策划目录")]
private static void OpenDesignFolder()
{
    // 打开一个指定的文件目录 参数是一个文件的路径
    EditorUtility.RevealInFinder(Application.dataPath.Replace("Assets", "Library"));
}
```

##### 4.Menu.SetChecked("path",isChecked) 可勾选的菜单栏

```c#
private static bool openShotCut = false; // 记录菜单栏勾选状态

[MenuItem("EditorExtensions/MenuItem/快捷键开关")]
private static void ToggleShotCut()
{
    openShotCut = !openShotCut; // 切换状态
    Menu.SetChecked("EditorExtensions/MenuItem/快捷键开关", openShotCut);
}
```

##### 5.MenuItem的快捷键设置

```c#
[MenuItem("EditorExtensions/MenuItem/EditorTestWithShotCut _c")]
private static void EditorTestWithShotCut()
{
    // 常用快捷键码
    // # -> Shift & -> Alt % -> Ctrl/Command
    // _a-z A-Z - a-z A-Z
    Debug.Log("键盘C键的快捷键呼出菜单");
}

[MenuItem("EditorExtensions/MenuItem/OpenBilibiliWithShotCut %#e")]
private static void OpenBilibiliWithShotCut()
{
    EditorUtility.RevealInFinder(Application.persistentDataPath);
}
```

##### 6.[MenuItem("path", validate = true)]

```c#
private static bool openShotCut = false; // 记录菜单栏勾选状态

[MenuItem("EditorExtensions/MenuItem/快捷键开关")]
private static void ToggleShotCut()
{
    openShotCut = !openShotCut; // 切换状态
    Menu.SetChecked("EditorExtensions/MenuItem/快捷键开关", openShotCut);
}
[MenuItem("EditorExtensions/MenuItem/EditorTestWithShotCut _c")]
private static void EditorTestWithShotCut()
{
    // 常用快捷键码
    // # -> Shift & -> Alt % -> Ctrl/Command
    // _a-z A-Z - a-z A-Z
    Debug.Log("键盘C键的快捷键呼出菜单");
}
// openShotCut 为true时才能被使用
[MenuItem("EditorExtensions/MenuItem/EditorTestWithShotCut %#e", validate = true)]
private static bool EditorTestWithShotCutValidate()
{
    return openShotCut;
}

[MenuItem("EditorExtensions/MenuItem/OpenBilibiliWithShotCut %#e")]
private static void OpenBilibiliWithShotCut()
{
    EditorUtility.RevealInFinder(Application.persistentDataPath);
}

[MenuItem("EditorExtensions/MenuItem/OpenBilibiliWithShotCut %#e", validate = true)]
private static bool OpenBilibiliWithShotCutValidate()
{
    return openShotCut;
}
```

##### 7. EditorApplication.ExecuteMenuItem("同名path") 复用MenuItem

```c#
[MenuItem("EditorExtensions/MenuItem/EditorTestWithShotCut _c")]
private static void EditorTestWithShotCut()
{
 EditorApplication.ExecuteMenuItem("EditorExtensions/MenuItem/EditorTest");
}
```

#### EditorWindow

##### 1.绘制一个编辑器窗口

```c#
[MenuItem("EditorExtensions/IMGUI/OpenGUILayoutExample")]
private static void OpenGUILayoutExample()
{
 GUILayoutExample window = GetWindow<GUILayoutExample>();
 window.Show();
}

private void OnGUI()
{
 GUILayout.Label("Hello IMGUI");
}
```

