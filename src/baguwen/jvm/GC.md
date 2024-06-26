---
title: 垃圾回收
icon: file
author: Cheney
date: 2024-05-06
isOriginal: true
category: JVM
order: 3
---


### 1. 如何判断对象是否可用回收？
- 引用计数法，缺点循环引用；
- 可达性分析，沿着GC Root的引用链看是否能够抵达对象，有向图设计的。

---

### 2. 清楚四种引用吗？
- 强引用不会被回收。
- 软引用内存不足回收。
- 弱引用GC收集器发现就回收。
- 虚引用与弱引用类似但是它需要放进引用队列中往往用来做回收前的通知或处理工作。

---

### 3. 垃圾回收算法知道吗？
标记清除算法、标记整理算法、复制算法、分代垃圾回收算法

---


### 4.  垃圾回收器知道吗？
分为单线程收集器Serial和多线程收集器Parallel、CMS、G1：

- Serial，单线程收集器，简单高效。只用一个线程收集垃圾；新生代使用复制算法， Serial Old 标记整理
- Parallel，多线程并行收集器，追求高吞吐量，Serial的多线程版本，新生代使用复制算法， Parallel Old 标记整理。
- CMS ，多线程标记清除算法，并发标记和用户线程一起工作，但是重新标记需要暂停用户线程修正。 一种老年代垃圾收集器，目标是获取最短Stor the world停顿时间，适合响应速度要求高的场景。
- G1 ，基于标记整理并行收集算法，G1回收的范围是整个Java堆(包括新生代，老年代) 。精准控制stw停顿时间，实现低停顿垃圾回收，收集器避免全区域垃圾收集，它把堆内存划分为大小相等的几个独立区域，并且跟踪这些区域的垃圾收集进度， 优先回收垃圾最多的区域。

---

### 5. 垃圾回收器的基本原理是什么？有什么办法主动通知虚拟机进行垃圾回收？垃圾回收器可以马上回收内存吗？
当创建一个对象后，就被GC线程监控了，GC使用可达性分析确定是否需要回收；你可以调用 System.gc() 或者 Runtime.gc()，但是没有办法保证 GC的执行。因为，垃圾回收是一个涉及到系统资源的复杂过程，JVM会根据当前的内存使用情况、垃圾回收算法、JVM配置参数等因素来决定何时以及如何执行垃圾回收。调用System.gc()或Runtime.gc()只是向JVM发出一个垃圾回收的建议，但JVM可以自行决定是否执行，以及在何时执行。

---

### 6. 新生代垃圾回收策略？
首先，新对象创建都放在伊甸区，当伊甸区空间不足时触发 MinorGC ,此时将伊甸区和From区的对象进行回收，幸存的对象复制到To区，年龄+1。然后清空From区和伊甸区，将From区和To区进行交换。如果幸存的对象age达到15则放到老年代中。如果伊甸区一开始就空间不足则对象直接放到老年代中并触发Full GC，Full GC 清理整个内存堆 – 包括年轻代和年老代。 Major GC 发生在老年代的GC，清理老年区，经常会伴随至少一次Minor GC，比Minor GC慢10倍以上 。

---



### 7. 为什么要分为Eden和Survivor?为什么要设置两个Survivor区？
设置Survivor是为了不让一次 MinorGC 就将对象放入到老年代中，进行一次Full GC消耗的时间比Minor GC长得多,所以需要分为Eden和Survivor。设置两个是因为可以使用标记复制算法避免空间碎片。Survivor的存在意义，就是减少被送到老年代的对象，进而减少Full GC的发生。

---

### 8. JVM中的永久代（方法区中的元空间）中会发生垃圾回收吗？
垃圾回收不会发生在永久代，如果永久代满了或者是超过了临界值，会触发完全垃圾回收(Full GC)。元空间与永久代之间最大的区别在于： 元空间并不在虚拟机中，而是使用本地内存。

---

### 9. 什么时间触发Full GC？
直接调用System.gc；创建过大的对象，在新生代中放不下，直接存到老年代中引起Full GC；老年代内存不足触发Full GC。

---


### 10. 方法区垃圾回收哪些东西？
方法区的垃圾收集主要回收两部分内容：

- 运行时常量池中废弃的常量（字面量和符号引用）
- 不再使用的类。需要满足：该类所有的实例都已经被回收、加载该类的类加载器已经被回收、对应的java.lang.Class对象没有在任何地方被引用。以上条件非常苛刻，基本上达不到！

---

### 11. 如何设置方法区内存的大小？
通过设置参数 `-XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 来设置元空间的初始分配空间和最大可分配空间。如果不指定元空间大小，使用默认值，方法区可能耗尽所有的可用系统内存。设置的初始元空间大小是一个初始的高水位线，一旦触及这个水位线， Full GC将会被触发并卸载不再使用的类，然后这个高水位线将会重置。

---

### 12. 什么时候分配对象到老年代中？
- 伊甸区内存不够，发起Minor GC，还不够存放到老年区
- 大对象直接分配到老年区
- 长期存活对象分配老年区

---



### 13. 什么是GC停顿(GC pause)? GC停顿与STW停顿有什么区别？
因为GC过程中，有一部分操作需要等所有应用线程都到达安全点，暂停之后才能执行。 STW指的是垃圾回收时需要停止所有工作线程，等待GC线程完成垃圾回收。一般可以认为是一个意思。

---

### 14. 如果CPU使用率突然飙升，你会怎么排查？
首先我觉得应该知道基本的CPU飙升的原因有哪些，例如：大量上下文切换——线程池开启的线程数不合理，分析IO密集型还是CPU密集型；还有是写了死循环导致的CPU飙升。这些情况会导致线程无法及时获得CPU使用权而阻塞，严重导致宕机。通过top命令找到CPU占用率高的进程，这里情况分两种：

- 一直是一个进程CPU利用率过高，可能是死锁，可以通过jstack获取Dump日志定位到线程日志。
- 利用率过高的进程不断变化，可能是线程创建过多，也可以通过通过 jstack 去线程 dump 日志中排查

---


