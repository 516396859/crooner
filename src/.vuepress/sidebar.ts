import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "八股文",
      icon: "book",
      prefix: "baguwen/",
      link: "baguwen/",
      children: "structure",
      // children: [
      //   {
      //     prefix: "java/",
      //     text: "Java 专项",
      //     children:["base","thread","lock"],
      //   },
      //   {
      //     prefix: "mysql/",
      //     text: "MySQL 专项",
      //     children:["base","log","index"],
      //   }
        // "database",
        // "jvm",
        // "middleware",
        // "hard",
      // ],
    },
    {
      text: "案例",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://plugin-md-enhance.vuejs.press/zh/guide/content/revealjs/demo.html",
    },
  ],
});
