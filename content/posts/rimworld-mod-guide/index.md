---
title: "RimWorld Mod 制作完全指南（STD 实战版）"
date: 2026-06-30T12:36:14+08:00
description: "基于 18 个真实 Bug 的 RimWorld 1.6 Mod 开发实战教程，704 行"
tags: ["RimWorld", "教程", "Mod", "技术文档"]
categories: ["项目"]
image: ""
draft: false
---

## 概述

以 STD Template Mod 开发过程为实战案例的 RimWorld 1.6 Mod 制作教学指南。共 704 行，核心特色是**18 个真实 Bug 的精确剖析**——不是泛泛的理论教学，而是精确到"哪个标签写在哪、写错会报什么错"的踩坑经验总结。

## 内容结构

### 1. Bug 百科全书（18 个 Bug，分 4 类）

| 类别 | Bug 数 | 典型问题 |
|------|--------|----------|
| XML 字段名错误 | 5 | `<layer>` 应为 `<layers>` 复数格式；`<researchTab>` 应为 `<tab>`；`constructionSkillPrerequisite` 位置错误；`socialPropernessMatters` 在 1.6 被移除 |
| 贴图与渲染 | 4 | `Graphic_StackCount` 需多张贴图变体；穿戴贴图需 5 体型 x 3 方向 = 15 张；512px 分辨率致"肥大"（应 256px）；侧面贴图左右颠倒 |
| 武器/装备 | 5 | 近战武器添加远程 Verb 致崩溃；`armorPenetrationSharp` 在 Tool 上不存在；护盾不充能（缺 tickerType）；CompProperties_Shield 子参数陷阱 |
| 数据格式 | 3 | `MedicalQualityMax` 应为浮点数非字符串；defName 不能以数字结尾；缺失 `useWornGraphicMask` 致渲染溢出 |

### 2. XML 字段速查表

覆盖 Apparel、Weapon、Medicine、Ingestible、Recipe、Building、Research 7 类定义的完整字段映射。

### 3. 贴图管线

Blender 建模 → AI 工具转风格 → Python 批处理调整 → 最终贴图。

### 4. 最佳实践与工作流

开发流程、XML 规范、测试检查清单。

### 5. 中后期扩展路线图

从纯 XML 四级产物到需要 C# 的远程模式切换/护盾过载，再到远期大型系统（模板觉醒事件/起源任务线/自定义系统）。

## 相关项目

- **STD Template Mod** — 本教程的实战案例
- **STD Mod 审查报告 v2** — 对应代码审查

## 完成时间

约 2026 年 6 月
