---
title: 易忘难点
icon: file
author: Cheney
date: 2024-04-15
isOriginal: true
category: Java
---


> [!tip]
> 本章节内容需要在你复习完一遍后阅读，需要具有一定的基础，采用模拟面试对话的形式给出。


### 1. MySQL的MVCC机制相关问题

==面试官==:punch:：**MySQL的MVCC机制是否了解？**

==面试者==:hand:：了解的，为了保证事务隔离性，一个最简单的办法就是加锁，当需要读数据时加读锁(share mode)，当写数据时加写锁(for update)。但是这样会导致并发性能下降，写锁属于重量级锁。**重点：MVCC并不是采用锁的方式解决事务隔离问题，而是通过版本链机制来解决的**。MVCC 可以解决不可重复读、修改丢失和脏读问题，但是**不能完全解决幻读**问题。要彻底解决幻读问题，需要使用间隙锁与临界锁（next-key-lock）。

==面试官==:punch:：**那MVCC机制你能详细介绍一下吗？**

==面试者==:hand:：当然，MVCC是多版本并发控制的简称，是一种不加锁来实现数据库事务隔离的算法，对于MVCC的实现机制我觉得最重要的点是**版本链、快照读。** 
+ 首先讲版本链：即MySQl数据库每次开启事务时会获取唯一一个事务ID，然后当它修改某个记录时，这时会记录事务ID、修改时间并将指针指向上一个版本。凡是修改数据和删除数据都会在版本链头部插入记录。其实版本链是通过空间换时间的角度来做到事务隔离的，对应的思想在CopyOnWriteArrayList中也有体现（知道的话可以讲，不知道别讲）。
+ 然后是快照读：事务第一次进行不加锁的select查询时将生成一个数据快照ReadView，即第一次读数据时会将读到的数据作为一个快照进行备份，实现方式是MVCC生成一个版本并将当前版本的指针指向上一个版本。这样就可以通过版本号和事务隔离级别沿着版本链找到正确的记录版本，避免脏读与不可重复读。

==面试官==:punch:：**讲了这么多，那你知道MVCC到底解决了一个什么问题吗？**

==面试者==:hand:：知道呀，我从两方面回答，如下：
+ MVCC在MySQL InnoDB中的实现主要是为了提高数据库并发性能，用更好的方式去处理读-写冲突，做到即使有读写冲突时，也能做到不加锁，非阻塞并发读。
+ 我们都知道并发访问数据库造成的四种问题（脏写（修改丢失）、脏读、不可重复读、幻读），MVCC就是在尽量减少锁使用的情况下高效避免这些问题


==面试官==:punch:：**那关于当前读你知道吗？**

==面试者==:hand:：知道的！
+ 当前读：当前读就是事务中进行**增删改**操作时读取最新数据的方式，当前读是需要加锁实现的，锁分为行锁、间隙锁、临键锁（MySQL中对数据加锁是加在B+树的节点索引上的）。例如 `where id = 1 for update` 是行锁，只对索引为1的记录加锁；`where id>=2 and id<=5`是间隙锁，对索引[2,5]加锁；`where id>5` 是临键锁，对大于5的索引所有间隙及其行加锁，如对 {[6,8],11,[13,+00]}加锁。
+ 注意：只有快照读才是MVCC机制的版本链实现的无锁读数据，当前读是加锁方式实现的可以读最新的数据来避免幻读。

==面试官==:punch:：**那MVCC机制能解决幻读吗？**

==面试者==:hand:：尽管MVCC可以减少幻读问题的出现，但是对于某些特定的读取场景，仍然可能会出现幻读问题。MVCC并不是采用锁的方式解决事务隔离问题，而是通过版本链机制来解决的。当连续多次快照读的情况下会复用第一次的ReadView ，没有幻读问题。但是当两次快照读之间存在当前读（增删,不是改），ReadView会重新生成（这时记录数可能发生变化），导致幻读。为了彻底解决幻读问题，可能需要结合其他技术，比如锁或一些特殊的隔离级别，以确保在事务执行期间数据的一致性。InnoDB默认隔离级别是可重复读，但是通过临键锁解决了幻读问题。也就是说，InnoDB引擎还是通过加锁解决的幻读！

==面试官==:punch:：**还可以啊，那MVCC解决脏读与不可重复读的原理知道吗？**

==面试者==:hand:：知道的，如下：
+ 首先是解决脏读即达到隔离级别读已提交：当其他事务对某个数据修改提交了版本链记录才会**标记为已提交**，如果是未提交的数据则对当前事务是不可见的，可以理解为未提交的数据不会被记录到版本链当中。因此，当一个事务开始时，MVCC会为该事务创建一个一致性视图，，其他事务尚未提交的数据对于当前事务是不可见的，从而避免了脏读的发生。
+ 解决不可重复读达到可重复读隔离级别：在一个事务当中，当第一次select时会通过版本链找到最近的已提交数据生成ReadView快照，在这个事务后续的select中都只从这个ReadView快照中读取数据，因此，无论数据被其他事务如何修改，其前后读到的数据版本都是第一次读取的数据。

==面试官==:punch:：**好的，关于MVCC的相关知识就问到这里吧！**

> [!note]
>  [点击观看MVCC更加详细的讲解！](https://www.bilibili.com/video/BV1hL411479T/?spm_id_from=333.337.search-card.all.click&vd_source=68cf9730933898eed7ba8e6f033fe17d)

### 2. InnoDB一次事务更新的流程及其日志

==面试官==:punch:：**InnoDB一次更新事务的流程是怎么样的知道吗？**

==面试者==:hand:：假设现在一个事务先读取数据库数据然后修改提交，那么在数据库InnoDB中的流程是：先在缓冲池中查找是否有该数据，如果不在则从磁盘读取数据到缓冲池中，然后从缓冲池中读取数据。之后需要修改此数据是直接修改缓冲池中的这个数据，在修改缓冲池数据之前先将此操作记录在undo log回滚日志当中，来保证事务的原子性，当事务后面出错了可以及时回滚到之前的版本。然后接下来是修改缓冲池中的数据，同时将修改操作写入到redo log崩溃恢复日志中。接着就是提交事务，然后将redo log根据刷盘策略写入磁盘，保证事务的持久性。最后要做的就是将这个事务的SQl语句记录在bin log逻辑日志中。


==面试官==:punch:：**那redo log的两阶段提交机制懂吗？**

==面试者==:hand:： 懂的，前面回答的其实对redo log的记录说的不太详细，因为先记录redo log后记录bin log，因此可能出现日志的不一致性问题，导致最终数据不一致。为了解决两份日志的一致性问题，InnoDB存储引擎使用两阶段提交方案。原理很简单，将redo log的写入拆成了两个步骤prepare和commit，这就是两阶段提交。修改缓冲池中的数据后，记录到redo log中标记为prepare阶段，当最终提交事务后才将其标记为commit阶段。当需要根据redo log日志恢复数据时，发现redo log还处于prepare阶段，并且没有对应bin log日志，意味着可能事务没有提交，于是就会回滚该事务。

==面试官==:punch:：**可以的，那关于日志这块就先到这里！**


### 3. Spring系列相关的难点

==面试官==:punch:：**Spring中是如何解决循环依赖的问题的呢？**

==面试者==:hand:： 使用三级缓存和提前暴露来解决的！我们都知道使用Spring的@Autowired非常方便就能实例化一个对象，但是有三种情况可能会导致循环依赖，例如A类中依赖了A；A、B类互相依赖；A、B、C三个类相互依赖。这里以A、B互相依赖为例来讲，首先我们调用A的getBean()方法的时候，这个时候去实例化A发现里面的B也没有实例化，于是去实例化B，发现A没有实例化，那这样不就死循环了吗？Spring 使用三级缓存解决，**首先规定：一级缓存中存放所有成熟的Bean（完全初始化好了，成品Bean），二级缓存中存放所有早期的Bean（某些所依赖的Bean还没有初始化，可以理解为一个空壳Bean或者半成品Bean），先取一级缓存，再去二级缓存。三级缓存存的是每个Bean对应的ObjectFactory对象，通过调用这个对象的getObject方法，就可以获取到早期暴露出去的Bean。**。那么就拿上面AB相互依赖来说，其流程如下：
1. 首先创建A对象，从一级缓存找没找到，然后从二级缓存找发现也没有，那么就会把A的beanFactory存入三级缓存进行提前暴露。然后接着就注入依赖B。
2. 同样发现B在缓存中都没有，于是也会把B的beanFactory存入三级缓存进行提前暴露，然后注入B中的A，这个时候就从三级缓存中找到A的BeanFactory，调用getObject方法获得实例A，并加入到二级缓存，于是B实例化成功（初始化完成了，加入到一级缓存）。其实此时A还没有成功，只是让B拿到了A的引用。此时B是成功了的，于是递归回去A注入B，A也初始化成功了加入到一级缓存。（注意：早期Bean和成熟Bean其实都是同一个对象，引用是相同的）；

==面试官==:punch:：**那么三级缓存是多余的吗？有一二级不就行了吗？**

==面试者==:hand:： 非也，三级缓存并不多余，三级缓存是提前暴露的基础。一级缓存存放成熟Bena，二级缓存存放早期Bean，三级缓存存放的是待初始化的BeanFactory，通过调用它的getObject可以得到它的早期Bean,如果没有三级缓存无法获得早期Bean。

注：三级缓存获得早期Bean放入到二级缓存，初始化完成（其实其中的依赖可能并未完成，但是马上递归回去就完成了，为什么可以延迟因为自始至终都是使用的同一个引用）就放入一级缓存。

==面试官==:punch:：**好的，那Spring Bean的生命周期知道吗？**

==面试者==:hand:： 首先创建一个Bean实例（实例化）， 然后设置属性（依赖注入），初始化，销毁。生命周期基本上是这个四个，其他的扩展方法的话是较多的，例如在实例化和初始化前后都可以有一个前置与后置方法，具体方法名这个只需要看下Spring文档就知道了。但是Bean也有自身的 init-method 和 destory-method 方法。那么这些结合起来就是Bean的生命周期。


==面试官==:punch:：**那Sprintboot的启动过程了解吗？**

==面试者==:hand:： 


### 4. SpringMVC系列的相关难点
==面试官==:punch:：**能说下SpringMVC的执行流程吗？**

==面试者==:hand:： 好的，MVC框架主要由控制器、模型、视图组成。控制器分为核心控制器DispatcherServlet和后端控制器Controller。首先一个请求首先交给核心控制器处理，然后通过HandlerMapping映射到后端控制器Controller进行处理，接着就调用Service处理数据获得数据模型ModeAndView并返回给前端控制器，然后前端控制器进行视图解析为html返回给浏览器显示。


==面试官==:punch:：**那知道拦截器和过滤器的区别吗？**

==面试者==:hand:： 知道的，其实拦截器和过滤器都是可以在Controller前后被调用。但有些不同如下：
+ 过滤器是在Servlet被调用之前运行的，也就意味着过滤器面向的是Servlet，例如执行链为：过滤器1->过滤器2->Servlet->过滤器2->过滤器1
+ 拦截器是在Servlet内部运行的，过滤器依赖于Servlet，执行方式为：preHandler()->Controller->postHandler()->afterCompletion()



==面试官==:punch:：****

==面试者==:hand:： 