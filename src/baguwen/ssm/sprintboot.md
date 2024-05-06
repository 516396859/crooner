---
title: SpringBoot
icon: file
author: Cheney
date: 2024-05-07
isOriginal: true
category: Java
order: 2
---


### 1. 简单介绍一下 Spring? 有什么缺点？
虽然 Spring 的组件代码是轻量级的，但它的配置却是重量级的（需要大量 XML 配置） 。Spring Boot 不需要编写大量样板代码、XML 配置和注释。Spring Boot 提供了多种插件，可以使用内置工具(如 Maven 和 Gradle)开发和测试 Spring Boot应用程序。

---

### 2. 什么是 Spring Boot Starters？
Spring Boot Starters 是一系列依赖关系的集合，因为它的存在，项目的依赖之间的关系对我们来说变的更加简单了。在没有 Spring Boot Starters 之前，开发Web 应用程序时; 我们需要使用像 Spring MVC，Tomcat 和 Jackson 这样的库，这些依赖我们需要手动一个一个添加。但是，有了Spring Boot Starters 我们只需要一个只需添加一个spring-boot-starter-web一个依赖就可以了，这个依赖包含的子依赖中包含了我们开发Web 服务需要的所有依赖。

---

### 3. Spring Boot 支持哪些内嵌 Servlet 容器？
Tomcat、Jetty，Undertow

---

### 4. 如何在 Spring Boot 应用程序中使用 Jetty 而不是 Tomcat？
Spring Boot （spring-boot-starter-web）使用 Tomcat 作为默认的嵌入式 servlet 容器, 如果你想使用Jetty 的话只需要修改pom.xml(Maven)中的坐标就可以了。


---



### 5. 介绍一下@SpringBootApplication 注解
可以看出大概可以把 @SpringBootApplication 看作是 @Configuration、@EnableAutoConfiguration、@ComponentScan  注解的集合。根据 SpringBoot 官网，这三个注解的作用分别是： 
- @EnableAutoConfiguration ：启用 SpringBoot 的自动配置机制
- @ComponentScan  ： 扫描被 @Component  ( @Service,@Controller  )注解的 bean ，注解默认会扫描该类所在的包下所有的类。 
- @Configuration  ：允许在上下文中注册额外的 bean 或导入其他配置类。 


---

### 6. Spring Boot 的自动配置是如何实现的?
@EnableAutoConfiguration是启动自动配置的关键 。@EnableAutoConfiguration 注解通过 Spring 提供的 @Import  注解导入了AutoConfigurationImportSelector 类（ @Import  注解可以导入配置类或者 Bean 到当前类中） 。 通过@EnableAutoConfiguration注解在类路径的META-INF/spring.factories文件中找到所有的对应配置类，然后将这些自动配置类加载到spring容器中。 

---

### 7. 开发 RESTful Web 服务常用的注解有哪些？
Spring Bean 相关：
- @Autowired  : 自动导入对象到类中，被注入进的类同样要被 Spring 容器管理。 
- @RestController  : @RestController注解是@Controller和@ResponseBody的合集,表示这是个控制器 bean,并且是将函数的返回值直 接填入 HTTP 响应体中,是 REST 风格的控制器。 
- @Component  ：通用的注解，可标注任意类为 Spring 组件。如果一个 Bean 不知道属于哪个层，可以使用@Component  注解标注。 
- @Repository  : 对应持久层即 Dao 层，主要用于数据库相关操作。 
- @Service  : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。 
- @Controller  : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 Service 层返回数据给前端页面。 

---

### 8. 前后端参数传递的注解了解吗？
- @RequestParam以及@Pathvairable  ：@PathVariable用于获取路径参数，@RequestParam用于获取查询参数。 
- @RequestBody  ：用于读取 Request 请求（可能是 POST,PUT,DELETE,GET 请求）的 body 部分并且 Content-Type 为 application/json 格式的数据，接收到数据之后会自动将数据绑定到 Java 对象上去。系统会使用HttpMessageConverter或者自定义的HttpMessageConverter将请求的 body中的 json 字符串转换为 java 对象。 

---



### 9. Spirng Boot 常用的两种配置文件？
我们可以通过 application.properties或者 application.yml 对 Spring Boot 程序进行简单的配置。如果，你不进行配置的话，就是使用的默认配置。加载顺序如下：
- .properties 结尾的优先级大于 .yml 结尾的配置文件
- 项目根目录中config目录下的配置文件的优先级大于项目根目录下的配置文件
- 项目根目录下的配置文件优先级大于项目的resources目录下的配置文件

---

### 10. 什么是 YAML？YAML 配置的优势在哪里？
YAML 是一种人类可读的数据序列化语言。它通常用于配置文件。与属性文件相比，如果我们想要在配置文件中添加复杂的属性，YAML 文件就更加结构化，而且更少混淆。可以看出 YAML 具有分层配置数据。相比于 Properties 配置的方式，YAML 配置的方式更加直观清晰，简介明了，有层次感。

---




### 11. 常用的 Bean 映射工具有哪些？
我们经常在代码中会对一个数据结构封装成DO、DTO等，  常用的 Bean 映射工具有：Spring BeanUtils  ，ModelMapper 。

---

### 12. 如何使用 Spring Boot 实现全局异常处理？
可以使用 @ControllerAdvice  和 @ExceptionHandler  处理全局异常。 

---

### 13. 聊聊Spirng，SpringMVC，SpringBoot的区别
- Spring 是最基础的一套Java开发框架，最重要的特性是IOC和依赖注入。这些特性有利于开发低耦合的代码。
- SpringMVC是Spring的Web开发框架，将数据模型和视图与控制分离，可以很快搭建Web应用。
- Spring和SpringMVC有太多的配置需要写，而SpringBoot提供了自动配置与启动项来解决这个问题，开箱即用，无需繁琐的配置。


---

### 14. SpringBoot 的优点
- 减少繁琐的配置，解决依赖冲突。
- 内嵌servlet容器，不用war包形式部署项目，直接打成jar包运行。


---



### 15. jar包和war包的区别
- 以前的项目都是web前端和后端都放在一个项目目录中然后打成一个war包，然后将war包放到指定的服务器指定目录，启动就能通过url访问。
- 现在使用springBoot直接打成jar包，里面只需要包括java类和配置文件，每个jar都可以单独启动作为微服务，也可以作为依赖提供给其他应用调用。jar包更相当于一个个微型可运行的模块，也是微服务的基础。


---

### 16. 什么是SpringBoot Starter？
起步依赖，SpringBoot之所以好用，导进依赖即可使用的背后是Starter。起步依赖，其实就是将具备某种功能的坐标打包到一起，可以简化依赖导入的过程。例如，我们导入spring-boot-starter-web这个starter，则和web开发相关的jar包都一起导入到项目中了，包括web，webmvc，tomcat等。spring-boot-starter-test，spring-boot-starter-web，spring-boot-starter-jdbc。


---

### 17. SpringBoot 核心注解|特有注解
- @SpringBootApplication  , 启动类上面的注解
- @SpringBootConfiguration  , 配置类
- @EnableAutoConfiguration：打开自动配置的功能，给容器导入META-INF/spring.factories 里定义的自动配置类
- @ComponentScan：Spring组件扫描。


---

### 18. bootstrap.properties 和application.properties 有何区别 ?
- bootstrap (. yml 或者 . properties)：由父 ApplicationContext 加载的，比 application优先加载，配置在应用程序上下文的引导阶段生效。
- application (. yml 或者 . properties)： 由ApplicationContext 加载，用于 spring boot 项目的自动化配置。


---



### 19. 什么是 Spring Profiles？
Spring Profiles 允许用户根据不同配置文件（dev，test，prod 等）来注册 bean。因此，当应用程序在开发中运行时，只有某些 bean 可以加载。


---

### 20. spring-boot-starter-parent 有什么用 ?
新创建一个 Spring Boot 项目，默认都是有 parent 的，这个 parent 就是 spring-bootstarter-parent ，spring-boot-starter-parent 主要有如下作用：
- 使用 UTF-8 格式编码。
- 定义了Java编译版本
- 继承自 spring-boot-dependencies，这个里边定义了依赖的版本，也正是因为继承了这个依赖，所以我们在写依赖时才不需要写版本号。


---



### 21. Spring Boot 打成的 jar 和普通的 jar 有什么区别 ?
Spring Boot 项目最终打包成的 jar 是可执行 jar ，这种 jar 可以直接通过 java -jar xxx.jar 命令来运行，这种 jar 不可以作为普通的 jar 被其他项目依赖，即使依赖了也无法使用其中的类。  普通的 jar 包，解压后直接就是包名，包里就是我们的代码。如果非要引用，可以在 pom.xml 文件中增加配置，将 Spring Boot 项目打包成两个 jar ，一个可执行，一个可引用。


---

### 22. 为什么我们需要 spring-boot-maven-plugin?
pring-boot-maven-plugin 提供了一些像 jar 一样打包或者运行应用程序的命令。
- repackage  重新打包你的 jar 包
- run 运行你的 SpringBoot应用程序


---

### 23. SprintBoot 自动配置原理
想要自动配置生效，需要注册自动配置类。在 src/main/resources 下新建 META-INF/spring.factories。
1. @EnableConfigurationProperties 注解开启属性注入，将带有@ConfigurationProperties 注解的类注入为Spring 容器的 Bean。
2. 写配置文件，配置文件读取类。


---

### 24. springboot中的循环依赖它是怎么解决的？
使用三级缓存和提前暴露来解决的！我们都知道使用Spring的@Autowired非常方便就能实例化一个对象，但是有三种情况可能会导致循环依赖，例如A类中依赖了A；A、B类互相依赖；A、B、C三个类相互依赖。这里以A、B互相依赖为例来讲，首先我们调用A的getBean()方法的时候，这个时候去实例化A发现里面的B也没有实例化，于是去实例化B，发现A没有实例化，那这样不就死循环了吗？Spring 使用三级缓存解决，**首先规定：一级缓存中存放所有成熟的Bean（完全初始化好了，成品Bean），二级缓存中存放所有早期的Bean（某些所依赖的Bean还没有初始化，可以理解为一个空壳Bean或者半成品Bean），先取一级缓存，再去二级缓存。三级缓存存的是每个Bean对应的ObjectFactory对象，通过调用这个对象的getObject方法，就可以获取到早期暴露出去的Bean。** 那么就拿上面AB相互依赖来说，其流程如下：
1. 首先创建A对象，从一级缓存找没找到，然后从二级缓存找发现也没有，那么就会把A的beanFactory存入三级缓存进行提前暴露。然后接着就注入依赖B。
2. 同样发现B在缓存中都没有，于是也会把B的beanFactory存入三级缓存进行提前暴露，然后注入B中的A，这个时候就从三级缓存中找到A的BeanFactory，调用getObject方法获得实例A，并加入到二级缓存，于是B实例化成功（初始化完成了，加入到一级缓存）。其实此时A还没有成功，只是让B拿到了A的引用。此时B是成功了的，于是递归回去A注入B，A也初始化成功了加入到一级缓存。（注意：早期Bean和成熟Bean其实都是同一个对象，引用是相同的）；
