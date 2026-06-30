---
title: "JHD 站点"
date: 2026-06-30T12:36:13+08:00
description: "Hugo + LoveIt 星空主题个人站点，记录每一个完成的成品"
tags: ["网站", "Hugo", "GitHub Pages"]
categories: ["项目"]
image: ""
draft: false
---

## 概述

基于 **Hugo 0.163 + LoveIt** 主题构建的星空行星风格个人站点。经历了从"Blender 作品展示"到"通用成品记录"的定位转变。用于记录所有完成的成品——代码项目、设计方案、世界观设定、游戏 Mod 等。

## 核心构成

| 模块 | 说明 |
|------|------|
| Hugo 站点引擎 | Go 语言静态站点生成器，单二进制文件，零数据库 |
| LoveIt 主题 | 深度定制，添加自定义 section 模板 |
| 星空 CSS 主题 | 纯 CSS 星空背景（多层径向渐变 + 数十个星点）、玻璃拟态卡片、行星主题色 |
| 动态行星头像 | SVG 矢量动画（光环 30 秒旋转 + 星点闪烁 + 呼吸光效） |
| 自定义 Shortcode | Sketchfab 3D 模型嵌入组件 |
| GitHub Pages 托管 | 永久免费，自定义域名就绪 |
| GitHub Actions 自动部署 | push 即部署，1 分钟更新 |

## 设计理念

- **极简运维**：Markdown 写作，Git push 部署，无后台管理
- **视觉辨识度**：深空暗色 + 金星色点缀，行星意象隐喻"每个成品都是一颗星球"
- **快速可靠**：构建 < 200ms，纯静态 HTML，无服务器依赖

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Hugo 0.163.3 (Extended) |
| 主题 | LoveIt（自定义 section 模板 + CSS 主题） |
| 部署 | GitHub Pages + GitHub Actions |
| 内容 | Markdown + HTML Shortcodes |

## 完成时间

2026 年 6 月 30 日

## 亮点

- 动态行星 SVG 头像（光环旋转 + 星点闪烁 + 呼吸光效）
- 纯 CSS 星空背景（无外部资源依赖）
- 玻璃拟态横行项目卡片（毛玻璃 + 悬停滑入效果）
- 自定义 Section 模板支持 _index.md 内容渲染
- 零成本永久托管
