---
title: "STD Template Mod 审查报告 v2"
date: 2026-06-30T12:36:14+08:00
description: "采用参考 Mod 优先对比法的代码审查报告，663 行，12 项待整改清单"
tags: ["RimWorld", "代码审查", "质量评估", "Mod"]
categories: ["项目"]
image: ""
draft: false
---

## 概述

针对 STD Template Mod 的代码审查报告（审查者身份待确认），采用"参考 Mod 优先对比法"，以 UF Heavy Industries（联合重工）、Ancot Library、Glitterworld Destroyer 5 等 6 个实际发布的 Mod 作为质量标准进行逐项比对。审查日期 2026-06-29，共 663 行。

## 健康度评分

| 评估维度 | 评分(1-10) | 风险等级 |
|----------|-----------|---------|
| XML 规范性 | 6/10 | 🟡 黄 |
| DLC 兼容性 | 4/10 | 🔴 红 |
| 本地化完整性 | 3/10 | 🔴 红 |

## 最紧急的 5 个问题

| 优先级 | 问题 |
|--------|------|
| **P0** | 未声明 Anomaly DLC 依赖（使用了 Anomaly 专属类但不声明会导致崩溃） |
| **P0** | 无 Languages 翻译文件夹（不符合发布规范） |
| **P1** | STD_FieldCut 的 armorCategory 设为 Heat 但 hediff 为 Cut（类型不匹配） |
| **P1** | 分析台缺少 minifiedDef/Flickable/Power/placeWorkers |
| **P2** | Preview.png 过大（547KB vs 参考 Mod ≤100KB） |

## 审查范围

逐文件对比了 About.xml、DamageDef、ThingDef（工作台/武器/护盾）、ResearchProjectDef、RecipeDef、HediffDef、WorkGiverDef。共发现 12 项待整改问题（P0→P3）。

## 关键建议

- 添加 Languages/ 文件夹同时支持中文/英文
- 使用 `<recipeMaker>` 内嵌方式替代独立 RecipeDef
- 提取 ResearchProjectDef Abstract 基类
- 为护盾腰带添加 wornGraphicPath 和完整 bodyPartGroups
- 所有 III 级科技要求 HiTechResearchBench + MultiAnalyzer

## 相关项目

- **STD Template Mod** — 被审查的目标项目
- **RimWorld Mod 制作完全指南** — 对应开发教程

## 完成时间

2026 年 6 月 29 日
