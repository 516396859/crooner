---
title: MySQL 日志
icon: file
author: Cheney
date: 2024-05-05
isOriginal: true
category: MySQL
order: 2
---


### 1. MySQL 中常见的日志？
- bin log：记录修改数据库的SQL语句，逻辑日志，数据库的备份与数据同步，保证数据的一致性；
- redo log：恢复日志，物理日志，InnoDB独有的崩溃恢复能力，保证数据的持久性与完整性；
- undo log：回滚日志，所有事务的修改先记录到回滚日志中，然后再执行对应操作，保证事务的原子性；
- 慢查询日志：解决SQL慢查询问题，需要开启慢查询

MySQL InnoDB 引擎使用 redo log(重做日志)保证事务的持久性，使用 undo log(回滚日志)来保证事务的原子性。MySQL数据库的数据备份、主备、主主、主从都离不开binlog，需要依靠binlog来同步数据，保证数据一致性。

---

### 2. 谈谈redo log 的数据刷盘原理？
MySQL中数据以页为单位，每查询一条记录会从硬盘中加载整页的数据到缓冲池中，后续的查找都从缓冲池中查询如果没查到再从硬盘查找，减少IO次数。如果有修改就直接修改缓冲池中的数据，然后将修改记录到redo日志缓存中，最后按照某种刷盘策略刷到redo文件中。

>[!tip]
>记忆技巧：数据库引擎首先查找缓冲池，否则如下：
`---查找---> 硬盘 ---写入---> 缓冲池 ---修改数据直接修改缓冲池---> redo日志缓存修改日志 ---> redo持久化文件`

---

### 3. redo log的三种刷盘策略了解吗？
redo log 的刷盘策略提供了 三种策略，以下刷盘策略后台都会每隔一秒刷盘一次：

- 每次事务提交时不进行刷盘操作；MySQL挂了或者主机宕机了丢失一秒的数据；
- 每次事务提交都刷到硬盘中（默认），不会任何数据丢失；
- 每次事务提交都刷到内存缓存中，MySQL挂了不会任何数据丢失，但是主机宕机了丢失一秒数据；

---

### 4. bin log 日志了解吗？
而 bin log 是逻辑日志，记录内容是语句的原始逻辑。可以说 MySQL 数据库的数据备份、主备、主主、主从都离不开bin log，需要依靠 bin log 来同步数据，保证数据一致性。bin log会记录所有涉及更新数据的逻辑操作，并且是顺序写。

---

### 5. bin log 日志记录格式了解吗？
bin log 日志有三种记录格式，可以通过binlog_format参数指定。

- statement：记录SQL语句原文，但是如果语句中有 set time = now() 等引起数据不一致的语法时，如果进行主从备份同步将无法保证数据一致性。
- row：不直接记录SQL语句原文，而是需要经过一个类似编译的操作，需要通过 bin log 工具解析，记录的是 now() 的值，给数据库同步带来可靠性保证。但是占用空间，执行效率不高。
- mixed：MySQL 会判断这条 SQL 语句是否可能引起数据不一致，如果是，就用 row 格式，否则就用 statement 格式。

---

### 6. bin log 写入机制？
bin log 的写入时机也非常简单，事务执行过程中，先把日志写到binlog cache，事务提交的时候，再把binlog cache写到 bin log 文件中。因为一个事务的 bin log 不能被拆开，无论这个事务多大，也要确保一次性写入，所以系统会给每个线程分配一个块内存作为 binlog cache。

---


### 7. 两阶段提交机制了解吗？
redo log与bin log两份日志之间的逻辑不一致，会出现最终数据不一致的问题。为了解决两份日志之间的逻辑一致问题，InnoDB存储引擎使用两阶段提交方案。原理很简单，将redo log的写入拆成了两个步骤prepare和commit，这就是两阶段提交。使用两阶段提交后，写入bin log时发生异常也不会有影响，因为MySQL根据redo log日志恢复数据时，发现redo log还处于prepare阶段，并且没有对应bin log日志，就会回滚该事务。（详细描述请参考 难点终结篇第2问！）

---

### 8. undo log 日志了解吗？
在 MySQL 中，恢复机制是通过回滚日志（undo log）实现的，所有事务进行的修改都会先记录到这个回滚日志中，然后再执行相关的操作。如果执行过程中遇到异常的话，我们直接利用回滚日志中的信息将数据回滚到修改之前的样子即可！并且，回滚日志会先于数据持久化到磁盘上。这样就保证了即使遇到数据库突然宕机等情况，当用户再次启动数据库的时候，数据库还能够通过查询回滚日志来回滚将之前未完成的事务。

---


### 9. 慢查询日志有什么用？
慢查询记录的是响应时间超过设置的阈值long query time的查询，该值默认为10秒，默认情况不开启慢查询，需要手动开启show query log。通过慢查询日志找到慢查询SQL语句进行分析，可以看见使用的索引和优化策略。

---

### 10. redo log 如何保证事务的持久性？
InnoDB 存储引擎是以页为单位来管理存储空间的，为了减少磁盘 IO 开销，还有一个叫做 Buffer Pool(缓冲池)的区域，存在于内存中。当我们的数据对应的页不存在于 Buffer Pool 中的话， MySQL 会先将磁盘上的页缓存到 Buffer Pool 中，这样后面我们直接操作的就是 Buffer Pool 中的页，这样大大提高了读写性能 。一个事务提交之后，我们对 Buffer Pool 中对应的页的修改可能还未持久化到磁盘。这个时候，如果MySQL 突然宕机的话，这个事务的更改是不是直接就消失了呢？ MySQL InnoDB 引擎使用 redo log 来保证事务的持久性。redo log 主要做的事情就是记录页的修改，比如某个页面某个偏移量处修改了几个字节的值以及具体被修改的内容是什么。redo log 中的每一条记录包含了表空间号、数据页号、偏移量、具体修改的数据，甚至还可能会记录修改数据的长度（取决于redo log 类型）。在事务提交时，我们会将 redo log 按照刷盘策略刷到磁盘上去，这样即使 MySQL 宕机了，重启之后也能恢复未能写入磁盘的数据，从而保证事务的持久性。也就是说，redo log 让 MySQL 具备了崩溃回复能力。

---

### 11. 页修改之后为什么不直接刷盘呢？
每一个事务对数据的修改都会被记录到 undo log ，当执行事务过程中出现错误或者需要执行回滚操作的话，MySQL 可以利用 undo log 将数据恢复到事务开始之前的状态。undo log 属于逻辑日志，记录的是 SQL 语句，比如说事务执行一条 DELETE 语句，那 undo log 就会记录一条与之可以恢复的 INSERT 语句。

---

### 12. bin log 和 redo log 有什么区别？
bin log 记录的是修改数据库的SQL语句，属于逻辑日志，主从同步需要使用bin log，主要保证数据的一致性；而redo log主要记录的是某个页的修改，属于物理日志，用于数据库崩溃恢复，保证数据的持久性与完整性；bin log很多存储引擎都有的，而redo log只是InnoDB独有。

---

### 13. undo log 如何保证事务的原子性？
每一个事务对数据的修改都会被记录到 undo log ，当执行事务过程中出现错误或者需要执行回滚操作的话，MySQL 可以利用 undo log 将数据恢复到事务开始之前的状态。undo log 属于逻辑日志，记录的是 SQL 语句，比如说事务执行一条 DELETE 语句，那 undo log 就会记录一条与之可以恢复的 INSERT 语句。

---

### 14. InnoDB一次更新事务的流程是怎么样的？
InnoDB在更新记录的时候会现在缓存池中查找数据是否在内存，如果不在的话从磁盘读取到内存；然后在修改操作前会记录undolog，保证事务的原子性和一致性（undo log可以用来回滚，MVCC机制也是用undo log来实现）；第三步的是执行update语句的时候，InnoDB会先更新已经读到缓存中的数据，同时将修改操作写入redo log中；然后提交事务，InnoDB将Redo Log写入磁盘，并且将页状态设置为"脏页"，表示该页修改了但是未刷盘；紧接着把脏页写入磁盘，保证数据的持久性；最后记录Binlog。

