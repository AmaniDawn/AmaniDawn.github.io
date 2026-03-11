---
title: UGUI源码解析——IndexedSet
path: /posts/ugui-indexedset
tags:
categories: UGUI源码解析
mathjax: true
description: UGUI中继承IList实现特定功能的容器
date: 2024-07-17
updated: 2024-07-17
---

>IndexedSet：
>
>优点：保证容器元素的唯一性，快速随机移除，快速唯一的添加元素到容器尾部，顺序访问
>
>缺点：使用更多的内存，排序不是持久化的，不支持序列化

```c#
// 当删除时，我们将最后一项移动到删除项的位置，这样我们只需要更新单个项的索引缓存。(快速删除)
// 不保证元素的顺序。移除将改变项目的顺序。
readonly List<T> m_List = new List<T>();
// 使用字典来加速列表的查找，这也保证了列表中元素的唯一性
Dictionary<T, int> m_Dictionary = new Dictionary<T, int>();
```

> Add：添加元素到列表中

```c#
public void Add(T item)
{
    // 添加元素到List中
    m_List.Add(item);
    // 以元素作为key，列表中的下标作为value
    m_Dictionary.Add(item, m_List.Count - 1);
}
```

> AddUnique：确保列表中的元素的唯一性的添加方法

```c#
public bool AddUnique(T item)
{
    // 判断字典中是否存在key
    if (m_Dictionary.ContainsKey(item))
        return false;
	
    不存在则添加
    m_List.Add(item);
    m_Dictionary.Add(item, m_List.Count - 1);

    return true;
}
```

>Remove：删除列表中的元素

```c#
public bool Remove(T item)
{
    // 取出对应元素在List中的下标位置
    int index = -1;
    if (!m_Dictionary.TryGetValue(item, out index))
        return false;
	// 删除List中该下标元素
    RemoveAt(index);
    return true;
}
```

> 实现以下两个方法以提供foreach遍历

```c#
public IEnumerator<T> GetEnumerator()
{
    throw new System.NotImplementedException();
}

IEnumerator IEnumerable.GetEnumerator()
{
    return GetEnumerator();
}
```

> Clear：清空这个容器类

```c#
public void Clear()
{
    m_List.Clear();
    m_Dictionary.Clear();
}
```

> Contains：查询是否存在某元素

```c#
public bool Contains(T item)
{
    return m_Dictionary.ContainsKey(item);
}
```

> CopyTo：将此容器复制到一个泛型数组中

```c#
// 指定类型的数组 数组索引
public void CopyTo(T[] array, int arrayIndex)
{
    m_List.CopyTo(array, arrayIndex);
}
```

>Count：获得容器大小

```c#
public int Count { get { return m_List.Count; } }
```

> IsReadOnly：容器是否只读，这里为不是

```c#
public bool IsReadOnly { get { return false; } }
```

> Insert：因为语义可能很奇怪，顺序不能保证，所以在这个容器没有实现支持

```c#
public void Insert(int index, T item)
{
    throw new NotSupportedException("Random Insertion is semantically invalid, since this structure does not guarantee ordering.");
}
```

>RemoveAt：删除指定下标的元素

```c#
public void RemoveAt(int index)
{
    // 找到该下标元素
    T item = m_List[index];
    // 删除字典中的对应值
    m_Dictionary.Remove(item);
    if (index == m_List.Count - 1)
        m_List.RemoveAt(index);
    else
    {
        // 如果该下标不是列表的最后一个元素
        // 则将该元素替换到列表的最后一个元素
        // 再进行删除操作
        int replaceItemIndex = m_List.Count - 1;
        T replaceItem = m_List[replaceItemIndex];
        m_List[index] = replaceItem;
        m_Dictionary[replaceItem] = index;
        m_List.RemoveAt(replaceItemIndex);
    }
}
```

> 索引器实现

```c#
public T this[int index]
{
    get { return m_List[index]; }
    set
    {
        T item = m_List[index];
        m_Dictionary.Remove(item);
        m_List[index] = value;
        m_Dictionary.Add(item, index);
    }
}
```

> RemoveAll：
>
> - `Predicate<T> match` 是一个委托，它表示一个方法或 Lambda 表达式，用来确定是否移除列表中的元素。
>
> - 作者提到了一种可能的优化方法，即将需要移除的元素移动到列表的末尾，然后一次性进行移除操作。这种方法可能减少了移动元素的次数，但需要额外的逻辑来管理移动元素和一次性移除的操作。
> - 现在的实现方式虽然简单，但如果列表中的元素较多或者频繁调用 `RemoveAll` 方法，可能会成为性能的瓶颈。

```c#
public void RemoveAll(Predicate<T> match)
{
    int i = 0;
    while (i < m_List.Count)
    {
        // 判断元素是否匹配传入的委托，匹配则删除
        T item = m_List[i];
        if (match(item))
            Remove(item);
        else
            i++;
    }
}
```

> Sort:
>
> - 对内部列表进行排序，这使得暴露的索引访问器也排序。
> - 但是注意，任何插入或删除都可以再次打乱集合的顺序。
> - 由上面的插入和删除代码可知道，会打乱排序，所以这个容器的排序不是持久化的

```c#
public void Sort(Comparison<T> sortLayoutFunction)
{
    // 可能有更好的排序方法，并使得字典的索引保持最新
    m_List.Sort(sortLayoutFunction);
    // 重建字典的索引
    for (int i = 0; i < m_List.Count; ++i)
    {
        T item = m_List[i];
        m_Dictionary[item] = i;
    }
}
```

