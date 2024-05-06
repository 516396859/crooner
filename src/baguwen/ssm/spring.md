---
title: Spring
icon: file
author: Cheney
date: 2024-05-07
isOriginal: true
category: Java
order: 1
---


### 1. 什么是Spring框架？
我们说的Spring框架一般指Spring Framework，它是一款开源的轻量级Java开发框架。它集成了很多模块协助我们开发，核心功能是IoC（控制反转）和AOP（面向切面编程）思想，其中控制反转实现了降低对象之间的耦合性。

---

### 2. Spring,Spring MVC,Spring Boot 之间什么关系？
Spring MVC只是Spring框架的一个模块，依赖于Spring。主要赋予 Spring 快速构建 MVC 架构的 Web 程序的能力。MVC 是模型(Model)、视图(View)、控制器(Controller)的简写，其核心思想是通过将业务逻辑、数据、显示分离来组织代码。使用 Spring 进行开发各种配置过于麻烦比如开启某些 Spring 特性时，需要用 XML 或 Java 进行显式配置。于是，Spring Boot 诞生了！Spring 旨在简化 J2EE 企业应用程序开发。Spring Boot 旨在简化 Spring 开发（减少配置文件，开箱即用！）。

---


### 3. 谈谈对Spring IoC的了解？
IoC（Inverse of Control:控制反转） 是⼀种设计思想，不仅仅在Spring框架中有。IoC 的思想就是将原本在程序中⼿动创建对象的控制权，交由 Spring 框架来统一管理。控制 ：指的是对象创建（实例化、管理）的权力。反转：控制权交给外部环境（Spring 框架、 IoC 容器）。在没有IoC容器下，我们需要某个对象来实现功能的时候需要手动new一个对象实例，这种依赖关系耦合在类中。而在使用IoC容器下，将对象之间的相互依赖关系交给 IoC 容器来管理，并由 IoC 容器完成对象的注⼊。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。IoC 容器就像是一个工厂⼀样，当我们需要创建⼀个对象的时候，只需要配置好配置⽂件/注解即可，完全不用考虑对象是如何被创建出来的 。在 Spring 中，  IoC 容器实际上就是个 Map（key， value）， Map 中存放的是各种对象。Spring 时代我们⼀般通过 XML ⽂件来配置 Bean，后来开发⼈员觉得 XML ⽂件来配置不太好，于是SpringBoot 注解配置就慢慢开始流行起来。

---

### 4. 什么是Spring Bean？
简单来说， Bean 代指的就是那些被 IoC 容器所管理的对象。我们需要告诉 IoC 容器帮助我们管理哪些对象，这个是通过配置元数据来定义的。配置元数据可以是 XML 文件、注解或者 Java 配置类。

---



### 5. 将⼀个类声明为 Bean 的注解有哪些?
- @Component  ：通⽤的注解，可标注任意类为 Spring 组件。如果一个Bean 不知道属于哪个层，可以使用@Component  注解标注。 
- @Repository  : 对应持久层即 Dao 层，主要用于数据库相关操作。 
- @Service  : 对应服务层，主要涉及⼀些复杂的逻辑，需要用到 Dao 层。 
- @Controller  : 对应 Spring MVC 控制层，主要用户接受⽤户请求并调用 Service 层返回数据给前端页面。 

---

### 6. @Component  和 @Bean  的区别是什么？ 
- @Component  注解作用于类，而 @Bean  注解作用于方法。  
-  @Component  通常是通过类路径扫描来自动侦测以及自动装配到 Spring 容器中（我们可以使用@ComponentScan  注解定义要扫描的路径从中找出标识了需要装配的类自动装配到 Spring 的bean 容器中）。 @Bean  注解通常是我们在标有该注解的方法中定义产⽣这个 bean, @Bean告诉了 Spring 这是某个类的实例，当我需要用它的时候还给我。  
-  @Bean  注解⽐ @Component  注解的自定义性更强，而且很多地方我们只能通过 @Bean  注解来注册 bean。⽐如当我们引用第三方库中的类需要装配到 Spring 容器时，则只能通过@Bean  来实现。  

---

### 7. 注入 Bean 的注解有哪些？  区别是什么？
其中 @Autowired 是 Spring 定义的注解，而 @Resource 是 Java 定义的注解。@Autowired 支持属性注入、构造方法注入和 Setter 注入，而 @Resource 只支持属性注入和 Setter 注入。
- Autowired，先按照类型查，如果有多个再按照名字查。
- Resource，先按照名称查，找不到的话再按照类型查。

---

### 8. Bean 的作用域有哪些？
Spring 中 Bean 的作用域通常有下面几种：
- singleton : IoC 容器中只有唯⼀的 bean 实例。 Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。 
- prototype : 每次获取都会创建⼀个新的 bean 实例。也就是说，连续 getBean() 两次，得到的是不同的 Bean 实例。 
- request （仅 Web 应用可用） : 每⼀次 HTTP 请求都会产生⼀个新的 bean（请求 bean），该bean 仅在当前 HTTP request 内有效。 
- session （仅 Web 应用可用） : 每⼀次来自新 session 的 HTTP 请求都会产生⼀个新的 bean （会话 bean），该 bean 仅在当前 HTTP session 内有效。 

---



### 9. 单例 Bean 的线程安全问题了解吗？
单例 Bean 存在线程问题，主要是因为当多个线程操作同⼀个对象的时候是存在资源竞争的。不过，大部分 Bean 实际都是无状态（没有实例变量）的（⽐如 Dao、 Service），这种情况下， Bean 是线程安全的。  常见的有两种解决办法：
- 在 Bean 中尽量避免定义可变的成员变量。
- 在类中定义⼀个 ThreadLocal 成员变量，将需要的可变成员变量保存在 ThreadLocal 中（推荐的⼀种方式）。ThreadLocal 是线程私有的。

---

### 10. Bean 的生命周期了解么？
**请参考难点终结第一篇第3问！**


---



### 11. 谈谈自己对于 AOP 的了解？
AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。 Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接⼝，那么 Spring AOP 会使⽤JDK Proxy，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 Cglib 生成⼀个被代理对象的⼦类来作为代理 。

 术语	| 含义 
------ | ------
目标(Target)	|被通知的对象
代理(Proxy) |向目标对象应用通知之后创建的代理对象
连接点(JoinPoint)	|目标对象的类中定义的所有方法均为连接点
切入点(Pointcut)	|被增强的连接点|方法（切入点一定是连接点，连接点不一定是切入点）
通知(Advice)	|增强的逻辑 / 代码，也即拦截到目标对象的连接点之后要做的事情
切面(Aspect)	|切入点(Pointcut)+通知(Advice)
Weaving(织入)	|将通知应用到目标对象，进而生成代理对象的过程动作

---

### 12. AspectJ 定义的通知类型有哪些？
- Before（前置通知）：目标对象的方法调用之前触发 
- After （后置通知）：目标对象的方法调用之后触发 
- AfterReturning（返回通知）：目标对象的方法调用完成，在返回结果值之后触发 
- AfterThrowing（异常通知） ：目标对象的方法运行中抛出 / 触发异常后触发。AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。 
- Around （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法。 

---



### 13. 多个切面的执行顺序如何控制？
通常使用 @Order 注解直接定义切面顺序 
```java
// 值越小优先级越高
@Order(3)
@Component
@Aspect
public class LoggingAspect implements Ordered {
```

---

### 14. Spring 框架中都用到了哪些设计模式？
- 工厂模式：BeanFactory就是简单工厂模式的体现，用来创建对象的实例；
- 单例模式：Bean默认为单例模式。
- 代理模式：Spring的AOP功能用到了JDK的动态代理和CGLIB字节码生成技术；
- 模板方法：用来解决代码重复的问题。比如. RestTemplate, JmsTemplate, JpaTemplate。

---



### 15. 控制反转(IoC)有什么作用
- 管理对象的创建和依赖关系的维护。  主要就是对象让容器来管理，依赖让容器来管理。
- IOC 或 依赖注入把应用的代码量降到最低。耦合度大大降低。

---

### 16. 依赖注入的两种方式
- 构造器依赖注入：构造器依赖注入通过容器触发一个类的构造器来实现的，该类有一系列参数，每个参数代表一个对其他类的依赖 。
- Setter方法注入：Setter方法注入是容器通过调用无参构造器或无参static工厂 方法实例化bean之后，调用该bean的setter方法，即实现了基于setter的依赖注入。

区别是用构造器参数实现强制依赖，setter方法实现可选依赖。任何一次构造器注入都会重新创建一个对象，而Setter不会。

---
 

