---
title: Redis 基础
icon: file
author: Cheney
date: 2024-05-05
isOriginal: true
category: 中间件
order: 1
---


### 1. Redis缓存的优点是什么？
- 存储在内存中，存取速度极快，避免频繁访问数据库
- 单线程，保证线程安全
- 多样的数据结构
- 提供了集群和持久化功能保证高并发和高可用。

---


### 2. Redis缓存的缺点是什么？
- 单机内存有限
- 单线程不能执行阻塞式的操作例如keys
- 虽然有持久化机制但是依旧存在数据丢失，并且可能性比MySQL要高。
- 最新的版本不开源了

--- 


### 3. 为什么Redis单线程效率也很高？
- 基于内存的缓存数据库，支持多种数据结构
- 单线程可以避免上下文频繁切换，提高效率
- I/O多路复用技术：多路-指的是多个 socket网络连接，复用-指的是复用一个线程。 多路复用主要有三种技术：select，poll，epoll。 采用多路 I/O 复用技术,可以让单个线程高效处理多个连接请求（尽量减少网络 IO 的时间消耗）

---


### 4. Redis分布式锁原理了解吗？
setnx命令争抢锁、并使用expire指令设置过期时间，这两条命令最好在一条命令中(保证原子性)。
```
# 非原子性写法，先抢锁再设置过期时间
setnx key value
expire key 100
# 原子性写法：
# EX seconds：设置失效时长，单位秒
# NX：key不存在时设置value，成功返回OK，失败返回(nil)
set key value  EX 100 NX
```

--- 


### 5. Redis的同步机制了解吗？
在主从同步时保证数据一致性，分为两个主要的步骤全量复制和部分复制两个过程。全量复制通过bgsave命令保存RDB缓存传输到从服务器，部分复制是复制缓冲区的命令到从服务器。

---


### 6. pipeline管道机制的好处？
Redis客户端发送一次命令，服务器需要一次IO，每次命令执行完成才能执行下一个命令；使用 pipeline 管道可以一次提交多个命令，缩短为一次IO，客户端只需要最后一步从服务器读取处理结果就好。提高执行效率，前提是指令之间没有因果关系。

--- 


### 7. Redis的缓存过期删除策略？
- 惰性删除：过期了不删除等到用的时候进行判断是否过期了，好处是节省CPU性能，缺点是内存压力非常过大。
- 定时删除：只要剩余时间TTL到了0就立即删除。非常消耗CPU。
- 定期删除：每隔100ms就轮询访问一个哈希槽，进行随机抽样如果过期占比超过25%就进行删除过期，否则跳过轮询下一个；权衡了CPU压力和内存压力；

---


### 8. Redis的缓存淘汰策略了解吗？
- LRU：淘汰最近不常用的数据，实现算法是LinkedHashMap，新数据放在链表头，不常用的数据放在链表尾；使用时间戳作为权重。
- LFU：淘汰最近使用频率最少的，使用次数作为权重；
- TTL：淘汰将要过期的数据；
- Random：随机删除

--- 


### 9. Redis持久化方式及其区别？
- RDB，数据库快照持久化，每隔一段时间使用子线程进行持久化，适合数据要求不严格的场景。二进制形式保存，文件小，恢复速度快，适合全量复制。
- AOF，每次命令都追加到AOF文件中。保存命令指令，文件更大，恢复速度慢，但是可以保证数据一致性。

---


### 10. RDB的一些基础命令了解吗？
阻塞式保存快照 sava，子线程保存快照 bgsave； 例如 `save 60 100` 60秒内修改了100次就触发快照保存；scan 可以异步快速查找符合规则的键，而keys是通过同步的方式阻塞式查找符合规则的键。 

---

### 11. AOF有安全性问题吗？ | AOF的刷盘机制策略了解吗？
有，当指令追加到AOF文件中并不是立即刷盘到硬盘，而是先存入到操作系统缓冲区中。如果这时宕机了就丢失了数据，因此提供了三种策略：

- always：每次修改就立即写入AOF文件，最多丢失一个事件循环的数据
- everysec：每隔一秒写入AOF文件，最多丢失一秒数据
- no：以操作系统刷盘时间决定，丢失不可控

---


### 12. AOF文件过大恢复时间过长怎么办？
AOF文件会定期重写，对AOF文件进行压缩；AOF重写就是把无效的指令取出，例如过期的指令、被覆盖的指令、被删除的指令等。保证结果是幂等性的，重写AOF文件是读取redis内存中的数据重写AOF文件。新的指令保存在缓存中，等重写完后合并。

--- 


### 13. 持久化的两种方式如何选择？
- 非重要的数据：RDB，启动快，占用小
- 重要数据：RDB+AOF，RDB做冷备份，优先使用AOF恢复

---


### 14. 如何使用Redis实现消息队列？
使用 list 数据结构，blpop 和 brpush 命令阻塞式消费和生产数据；可以使用 pub/sub 主题订阅模式实现1对多的消息队列，但是消费者下线了会导致生产的消息丢失。要实现**延时队列**可以使用sortedSet，使用**时间戳**作为score，消息内容为key-value调用**zadd生产消息**，消费者使用**zrangebyscore**指令获取前N秒数据轮询处理。

--- 


### 15. Redis的事务了解吗？
redis中事务是一组redis命令组成的集合，使用**MULTI命令**开启一个事务，**EXEC命令**按照顺序执行事务中所有的命令。需要注意的是Redis事务**不支持回滚**，如果是语法错误Redis事务会执行失败，如果是其他错误则正确的指令依旧会执行。不支持回滚可以保证简单快速的特点。

---


### 16. 为什么Redis选择了单线程？
避免上下文切换；多线程涉及到线程安全性问题，需要加锁保证线程安全，而加锁就会导致频繁上下文切换导致效率低下，其实Redis的瓶颈不是CPU，而是存储大小，单机Redis服务器单线程完全够应付30w左右的QPS；

--- 


### 17. 什么是非阻塞IO多路复用？
Redis中的非阻塞IO多路复用只用在了网络连接模块中，客户端通过socket请求redis，不同操作也称为不同事件，IO多路复用程序监听多个socket，将产生的事件放入队列中排队，然后事件分派器从队列中取出根据事件类型交给事件处理器处理。可以IO多路复用可以理解为一个餐馆只配备一个服务员，谁需要服务就帮谁，帮完后就立即去帮别人，这个服务的速度是很快的。而不是为每个客人配备一位服务器。

---


### 18. 什么是BigKey？还存在什么影响？
bigkey 就是存储的value太大了，例如存了一个二机制文件200M，这会造成网络传输阻塞和IO阻塞，也会导致内存空间不平衡。

--- 


### 19. 集群的作用了解吗？
- 提高并发量，负载均衡，减轻单个服务器的压力
- 提高可用性，提高容灾能力，降低单台服务器宕机风险

---


### 20. Redis的集群模式有哪些？
- Sentinel ：体量较小时，选择 Redis Sentinel ，单主 Redis 足以支撑业务 。
- Cluster ： Redis 官方提供的集群化方案，体量较大时，选择 Redis Cluster ，通过分片，使用更多内存。

---

### 21. 说说Redis哈希曹的概念？
Redis 集群并没有使用一致性 Hash，而是引入了哈希槽的概念。Redis 集群有 16384（2^14）个哈希槽，每个 key 通过 CRC16 校验后对 16384 取模来决定放置哪个槽，集群的每个节点负责一部分 Hash槽。

---


### 22. 主从复制的流程知道吗？| 什么是主从复制？
1. slave 向 master 发送 SYNC 命令请求启动复制流程；
2. master 收到 SYNC 命令之后执行 BGSAVE命令（子线程执行，不会阻塞主线程）生成 RDB 文件（dump.rdb）；
3. master 将生成的 RDB 文件发送给 slave；
4. slave 收到 RDB 文件之后就开始加载解析 RDB 同步更新本地数据；
5. 更新完成之后，slave 的状态相当于是 master 执行 BGSAVE 命令时的状态。master 会将 BGSAVE 命令之后接受的写命令缓存起来，因为这部分写命令 slave 还未同步；
6. master 将自己缓存的这些写命令发送给 slave，slave 执行这些写命令同步 master 的最新状态；注意如果是断网重连：如果 master 发现 slave 缺少的数据自己刚好缓存了的话，就会直接发给 slave。如果没有的话，那就没办法了，还是要进行全量同步操作
7. slave 到这个时候已经完成全量复制，后续会通过和 master 维护的长连接来进行命令传播，同步最新的写命令。

--- 


### 23. 部分复制的工作流程知道吗？
也就是命令传播阶段，三个重要参数，偏移量offet、运行ID、缓冲区，从节点将offset发送给主节点后，主节点根据offset和缓冲区大小决定能否执行部分复制：

- 如果offset偏移量之后的数据，仍然都在复制积压缓冲区里，则执行部分复制；
- 如果offset偏移量之后的数据已不在复制积压缓冲区中（数据已被挤出），则执行全量复制
在命令传播阶段，主节点除了将写命令发送给从节点，还会发送一份给积压缓冲区，作为写命令的备份； 当主从节点之间网络出现中断时，如果超过了 repl-timeout 时间，主节点会认为从节点故障并中断复制连接。这期间无法同步命令到从节点，直到从节点网络恢复再次请求主节点：
- 由于从节点之前保存了自身已复制的偏移量和主节点的运行ID。因此会把它们作为 psync 参数发送给主节点，要求进行补发复制操作
- 主节点核对运行ID和偏移量是否和自身一致，一致则根据偏移量把复制积压缓冲区里的数据发送给从节点，保证主从复制进入正常状态。

---


### 24. AOF 工作基本流程是怎样的？
- 命令追加：将命令追加到AOF缓存区。
- 文件写入：AOF缓存区数据写入到系统内核缓冲区。
- 文件同步：将缓冲区中数据刷盘到硬盘中。
- 文件重写：随着AOF变大，需要定时重写压缩AOF；
- 启动加载：当 Redis 重启时，可以加载 AOF 文件进行数据恢复。
>[!note]
>几乎不会问，了解即可。

--- 


### 25. 为什么Redis操作是原子性的？
因为Redis是单线程的，Redis本身提供的API操作都是原子操作，而Redis的事务是要保证批量操作的原子性。

---


### 26. 缓存雪崩、缓存穿透、缓存击穿、缓存预热、缓存降级等问题了解吗？
- 缓存雪崩：很多缓存同时过期，导致很多缓存失效从而访问数据库。解决方法：设置不同的失效时间，多级缓存，熔断降级。
- 缓存穿透：Mysql数据库中不存在的一些数据被频繁访问，是一种攻击手段，防御方法是缓存null值和布隆过滤器，或者考虑加锁；
- 缓存击穿：缓存击穿是单个超级热点数据被大量访问，而这个热点数据没有缓存，导致全都访问到了数据库上；解决办法是逻辑过期，或者设置超热数据不过期；
- 缓存预热：就是将可能的一些高并发访问的数据事先通过脚本刷入到reids中。
- 缓存降级：当访问量剧增的话，保证核心服务可用，对不重要的数据不缓存直接返回空值。

--- 


### 27. 如何保证本地缓存(JVM缓存或者Coffee缓存)和分布式缓存的一致性？
- 本地缓存和分布式缓存通过加锁达到同步修改，严格保证一致性，但是效率非常低。
- 事件驱动一致性： 当数据在后端数据源中被修改时，可以发布一个事件，通知所有缓存节点更新对应数据。本地缓存和分布式缓存可以通过订阅这些事件来保持一致。一般使用阿里的Canel中间件实现。

---


### 28. 如何保证缓存与数据库的双写一致性？
读的时候先读缓存，缓存没有再读数据库。写的时候先更新数据库，再删除缓存；

- 不更新缓存是因为可能频繁修改这个字段，但是却不读取，导致频繁更新缓存却不读缓存，懒加载节省性能。
- 为什么不先删除缓存再更新数据库？删除缓存很快，更新数据库很慢，万一大量请求发现缓存不在而去读取数据库，此时数据库还没有更新完毕，则读到旧数据放在缓存上。另外，可能导致MySQL击穿。其实先更新数据库再删除缓存也会导致数据一致性问题，例如删除缓存失败。只是概率低一点；
- 保证强一致性的话只能将更新缓存和更新数据库进行加锁同步。但这会影响高并发和高可用性。
使用消息队列（Canal）的重试机制保证删除对应的key。延时双删，先删缓存，如果更新数据库期间脏读了旧数据，最后更新完数据库还会进行一次删除缓存。

--- 


### 29. 热key如何处理？
- 最重要就是监控热点key，通过京东的插件hotkeys发现热点key
- 对热点key分散到不同的服务器，降低压力
- 加入JVM本地缓存，提前预热热点key
- 使用逻辑过期，当过期了返回过期值勉强用一下，然后新建一个线程去查找新的数据重置TTL

---


### 30. Redis内存不足怎么办？
- 修改配置文件，增加Redis可用内存，治标不治本
- 修改内存淘汰策略，及时释放空间，治标不治本
- 使用Redis Cluster集群，增加物理机器，钞能力治本

---

### 31. 哪些情况会发生Redis阻塞？
- 操作大key，例如删除大key
- 使用阻塞命令，keys，save
- AOF刷盘阻塞，硬盘或者CPU压力大时，需要等待。

---


### 32. redis 的并发竞争问题是什么？
Redis并发竞争是多个客户端并发写一个key，本来应该是先到的请求先写key，但可能由于网络环境差异，先发起的请求后到了，导致value最终被后发起的请求修改，最终数据错乱了。或者是多个客户端同时获取一个key，修改值后再写回去，只要顺序错了，数据纠错了。解决方案是使用分布式锁、CAS乐观锁。

--- 


### 33. redis中的布隆过滤器？
创建布隆过滤器，bf.reserve userid 0.01 1000000 创建userid过滤器，给定错误率，数据大小。自动创建布隆过滤器，可以使用命令add添加，exists命令查询是否存在某个值。redis 的 bf 需要去github上面下载配置。

---


### 34. Redis 如何解决 key 冲突？
如果两个key名字一样，后一个会覆盖前一个，因此需要按照不同的业务和参数使用：区分开，避免冲突。

--- 


### 35. 怎么提高缓存命中率？
- 提前加载数据到缓存中
- 增加缓存存储空间，提高缓存数据量

---


### 36. 什么情况下可能会导致 Redis 阻塞？
- 外部原因：服务器CPU、内存满载、网络出现问题
- 内部原因：持久化占用资源过多，使用阻塞式命令 save keys

--- 


### 37.  假如 Redis 里面有100万个key，其中有 1w 个 key 是以某个固定的已知的前缀开头的，如果将它们全部找出来？
使用scan的match key* 匹配出来，使用keys会导致线程阻塞，scan使用子线程去查找，相对来说会花费更多的时间但不阻塞Reids主线程。

---


### 38. Redis过期时间怎么设置，Redis怎么续期？
`EXPIRE mykey 60`，也可以使用`setex key value 60`，通过`ttl key`获取剩余过期时间，通过`expire key time`重设过期时间。

--- 


### 39. Redis数据类型知道哪些？
- 5 种基础数据结构：String（字符串）、List（列表）、Set（集合）、Hash（散列）、Zset（有序集合）。
- 3 种特殊数据结构：HyperLogLogs（基数统计）、Bitmap （位存储）、Geospatial (地理位置)。

---


### 40. 如何找到大key？
使用 bigkeys 命令

---

### 41. redis如果一个key特别大，如果要删除掉会有什么问题，比如删除一个特别大的 ZSet，怎么删？
key太大了，删除时间很长会导致单线程阻塞。可以分批进行删除，例如每次获取500个字段进行删除。新的版本可以使用unlink异步删除，删除操作时在后台进行的。

---


### 42. Redis异步队列知道吗？
主要是使用list的blpop和brpush两个指令；

--- 


### 43. Redis 除了做缓存还能做什么？
分布式锁、消息队列、排行榜、签到、统计访问量

---


### 44. String 还是 Hash 存储对象数据更好呢？
String 存储的是对象序列化后的数据，或者存储json数据；Hash是存储对象的每个字段；String节省内存，但是Hash可以修改对象；

--- 


### 45. 购物车信息用 String 还是 Hash 存储更好呢？
由于购物车中的商品频繁修改和变动，购物车信息建议使用 Hash 存储：

- 用户 id 为 key
- 商品 id 为 field，商品数量为 value

---


### 46. 使用 Redis 实现一个排行榜怎么做？
Redis 中有一个叫做 `sorted set zset` 的数据结构经常被用在各种排行榜的场景，比如直播间送礼物的排行榜、朋友圈的微信步数排行榜、王者荣耀中的段位排行榜、话题热度排行榜等等。

--- 


### 47. 使用 Set 实现抽奖系统怎么做？
`spop key count` ：随机移除并获取指定集合中一个或多个元素，适合不允许重复中奖的场景。

---


### 48. 使用 Bitmap 统计活跃用户（签到）怎么做？
以月为key，例如key为 `202306:user1`，`setbit key index value`，`setbit 202306:user1 0 1`第一天签到 ，`bitcount202306:user1` 获取user1的六月签到数量。

--- 


### 49. RDB 创建快照时会阻塞主线程吗？
使用save命令会，使用bgsave会使用子线程不会阻塞主线程。

---


### 50. 什么是 AOF 持久化？
AOF 持久化的实时性更好，开启 AOF 持久化后每执行一条会更改 Redis 中的数据的命令，Redis 就会将该命令写入到 AOF 缓冲区。默认情况下 Redis 没有开启 AOF（append only file）方式的持久化（Redis 6.0 之后已经默认是开启了），可以通过 `appendonly yes` 参数开启。

---

### 51. AOF 为什么是在执行完命令之后记录日志？
避免额外的检查开销，AOF 记录日志就不会对命令进行语法检查；在命令执行完之后再记录，不会阻塞当前的命令执行。但是也有风险：如果刚执行完命令 Redis 就宕机会导致对应的修改丢失；而且可能阻塞后面的命令。（AOF是主线程记录日志）

---


### 52. AOF 校验机制了解吗？
在AOF二进制文件末尾追加循环冗余编码

--- 


### 53. Redis6.0 之后为何引入了多线程？
Redis6.0 引入多线程主要是为了提高网络 IO 读写性能，因为这个算是 Redis 中的一个性能瓶颈（Redis 的瓶颈主要受限于内存和网络）。但是 Redis 的多线程只是在网络数据的读写这类耗时操作上使用了，执行命令仍然是单线程顺序执行。因此，你也不需要担心线程安全问题。

---


### 54. Redis 单线程模型了解吗？
Redis 基于 Reactor 模式设计开发了一套高效的事件处理模型（Netty 的线程模型也基于 Reactor 模式）。通过 IO 多路复用程序 来监听来自客户端的大量连接。：I/O 多路复用技术的使用让 Redis 不需要额外创建多余的线程来监听客户端的大量连接，降低了资源的消耗（和 NIO 中的 Selector 组件很像）。

--- 


### 55. Redis6.0 之前为什么不使用多线程？
纠正一下，6.0之后也是单线程的，只不过是网络IO读写是多线程了，因为单线程更加容易维护，没有上下文切换性能更高，Redis的瓶颈不在CPU主要在网络和内存。

---


### 56. Redis 后台线程了解吗？
- close_file 后台线程来释放 AOF / RDB 等过程中产生的临时文件资源。
- aof_fsync 后台线程调用 fsync 函数将系统内核缓冲区还未同步到到磁盘的数据强制刷到磁盘（ AOF 文件）。
- lazy_free后台线程释放大对象（已删除）占用的内存空间.

--- 


### 57. Redis 是如何判断数据是否过期的呢？
通过 ttl key 命令判断，Redis 通过一个叫做过期字典（可以看作是 hash 表）来保存数据过期的时间。过期字典的键指向 Redis 数据库中一个 long long 类型的整数。

---


### 58. 如何发现和解决 hotkey ？
使用命令 hotkeys 查找，借助第三方京东零售的hotkey插件查找；分散hotkey到不同服务器，读写分离，使用集群分散压力，二级缓存将hotkey缓存在本地JVM缓存中。

--- 


### 59. 为什么主从全量复制使用 RDB 而不是 AOF？
- RDB 文件存储的内容是经过压缩的二进制数据，文件很小。传输 RDB 文件更节省带宽，速度也更快。
- 使用 RDB 文件恢复数据，直接解析还原数据即可，不需要一条一条地执行命令，速度非常快。
- AOF 缓存的是命令需要解析运行，需要选择合适的刷盘策略，如果刷盘策略选择不当的话，会影响 Redis 的正常运行。

---


### 60. 主从复制下从节点会主动删除过期数据吗？
- 客户端读从库会先判断数据是否过期，如果过期的话，就会删除对应的数据并返回空值。主从复制的过程中，从节点是不能向主节点发送任何命令的，所有的数据都是主动推送到从节点。因此在 Redis 主从复制机制中，过期键的过期处理完全由主节点来执行，主节点会在自身的内存中删除过期键，并向所有从节点发送删除指令，从节点会在处理完主节点的删除指令后删除自己的过期键。从节点在读取数据时，增加了对数据是否过期的判断：如果该数据已过期，则不返回给客户端；
- 对于过期键的过期时间，主从节点之间的缓存时间差异是一定存在的，但只要在合理的时间周期内进行同步，应用程序既可以自行判断失效的键是否存在，避免读取无用的过期键。


### 61. 缓存更新为什么删除 Redis，而不是更新 Redis？
- 采用懒加载方式避免内存空间的浪费
- 高并发更新Redis可能产生数据不一致问题

---


### 62. 在写数据的过程中，可以先删除 Redis，后更新数据库么？
不行的！因为这样可能会造成 数据库和缓存数据不一致的问题。因为删除了Redis，后面的线程从数据库读取数据是旧的数据，而更新数据库时间更长；如果非要这样做那只能进行延迟双删了。

--- 


### 63. 在写数据的过程中，先更新数据库，后删除 Redis 就没有问题了么？
理论上来说还是可能会出现数据不一致性的问题，不过概率非常小，因为缓存的写入速度是比数据库的写入速度快很多。

---


### 64. Redis的数据结构及其实现? 
待补充...

--- 