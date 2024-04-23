import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "歌者笔记（Crooner Note）",
  description: "vuepress-theme-hope 的文档演示",
  // navbar: ["/baguwen/README.md"],
  // sidebar:["baguwen/README.md"],

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
