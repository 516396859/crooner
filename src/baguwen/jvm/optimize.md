---
title: 性能调优
icon: file
author: Cheney
date: 2024-05-06
isOriginal: true
category: JVM
order: 4
---


### 1. 内存泄露与内存溢出的区别？
两个的相同点都是内存满了，但是区别是导致的原因不一样；内存溢出是内存满了，原因是可能访问量太大了，或者创建的对象或者变量太多了。内存泄露的原因是该回收的对象没有及时回收导致占用大量内存而内存不够。
>[!tip]
> 内存泄露会导致内存溢出，原因和结果的关系，但是内存溢出不止内存泄露会导致！

---

### 2. 几种内存泄露情况知道吗？
- 静态集合类，静态容器的生命周期是类的生命周期，如果长生命周期对象持有短生命周期对象将导致短生命周期对象无法及时回收，及时短生命周期不再使用。
- 各种数据库、网络连接时没有及时close释放连接，导致内存泄露
- 改变对象哈希值，存入HashMap集合后，修改了参与Hash计算的字段后，无法找到原对象导致无法删除该对象。
- 局部变量定义在方法外，方法出栈也不会销毁，只有对象回收了才回收。
- 过期引用， 在动态数组或者一些栈和队列中，一旦对象不用了需要将引用指向null，否则先增长再pop后的对象不会被垃圾回收，因为内部维护了对象的过期引用。

---

### 3. 内存溢出的几个场景知道吗？
- 堆内存：并发流量突增、对象创建太多，字符串常量太多太大；对策 -Xms -Xmx 调优，避免创建大对象，对于大文件上传需要分批分片上传；
- 元空间：加载的第三方jar包太多，常量太多；对策 -XX MetaSpaceSize 调优；
- 栈内存：栈帧太多，方法递归调用太深，局部变量太多；对策 -Xss调大栈大小，但是线程就少了，提高算法功底，代码逻辑正确；

---


### 4. 如何避免内存泄露？
- 不要长生命周期持有短生命周期对象
- 养成连接关闭，注销监听的好习惯
- 谨慎创建大对象，变量的作用范围不要太大

---

### 5. JVM性能调优了解吗？
一般而言JVM不需要调优，但是面对高并发的场景，需要调优。调优分为调两个地方，一个是调参数，例如 -Xms 和 Xmx 堆内存和 -Xss 栈内存，或者垃圾回收器及其年轻代老年代空间大小，一般应对内存溢出情况。另一方面不是由于参数设置太小导致的内存泄露，无论有多少资源随着运行下去都会被吃完，这种情况往往由于编程不合理导致的，这就需要进行JVM级别的Debug，也就是JVM调优。

- 看见问题：使用VisualVM 工具，可以监视CPU、堆内存、类数量、线程数等状态。
- 分析问题：可以通过VisualVM 工具查看更加具体的信息，例如幸存区内存，老年代内存，GC次数。发现老年代一直在GC，但是内存占用没有下降，考虑是内存泄露。
- 找到问题：抽样器，将开始运行的Dump转储文件和最后运行的Dump内容进行比较，会发现哪些类大量创建了大量实例，占用大量内存，很可能与这个类有关系的操作导致内存泄露。从而进一步分析对象引用关系。
- 定位代码：可以查看上一步的类的引用关系，分析引用关系进行定位到内存泄露的代码。

---

### 6. 常用的JVM调参命令？
- 堆内存：-Xms 初始内存 -Xmx 最大内存
- 栈内存：-Xss 栈内存
- 新生代：-Xmn
- 垃圾回收：-XX：+UserG1GC
- 查看所有java进程情况：jps
- 生成内存转储快照分析堆内存：jmap pid
- 生成线程快照文件分析死循环：jstack pid

---



### 7. 堆内存问题如何分析？
查看内存占用情况，分析老年代GC次数和内存，查看堆中类创建实例的数量定位到实例多的类，查看对象引用情况，进一步找到泄露位置；分析堆信息，一般可以解决老年代年轻代内存分配合理性、内存泄露问题、垃圾收回合理性问题。

---

### 8. JVM调优建议？
- 频繁创建销毁的对象，适当增加新生代大小；常量多和单例多的适当增加老年代大小
- 追求高吞吐量选择并行垃圾回收 G1，追求高响应并发收集 CMS。

---
