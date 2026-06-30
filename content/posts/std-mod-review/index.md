---
title: "STD Template Mod 审查报告 v2"
date: 2026-06-30T12:36:14+08:00
description: "参考 Mod 优先对比法的代码审查——以 6 个已发布 Mod 为基准，12 项待整改清单，三级健康度评分"
tags: ["RimWorld", "代码审查", "质量评估", "Mod"]
categories: ["项目"]
image: ""
draft: false
---

## 这是什么

一份针对 **STD Template Mod** 的代码审查报告。采用"**参考 Mod 优先对比法**"——不是凭空编造标准，而是以 6 个实际发布且稳定运行的 Mod 作为对比基准，逐项审查 STD 的代码质量。

审查日期：**2026-06-29**。共 663 行。发现 12 项待整改问题（P0 → P3）。

## 方法论：参考 Mod 优先对比法

### 为什么需要特殊方法

传统审查的问题：审查者自己设定"正确标准"，但这个标准可能与社区实际不符——审查者认为的"错误"可能是社区广泛接受的"惯例"。

**参考 Mod 优先对比法** 的核心：选取已在 Steam Workshop 发布、有数千订阅的 Mod 作为**基准模板**。对于 STD 的每个 XML 文件，找到参考 Mod 中对应的同类文件，逐字段对比差异。差异不一定都是错误，但每个差异都会被追问"为什么不同"。

### 参考 Mod 选取理由

| 参考 Mod | 选取理由 | 订阅数参考 |
|----------|---------|-----------|
| **UF Heavy Industries**（联合重工） | 主要参考——同为国产 Mod，也含工作台/能量武器/护盾/研究/Hediff/完整翻译 | 高 |
| **Ancot Library** | 辅助参考——护盾 Hediff/WorkGiver 实现/翻译结构 | 中 |
| **Glitterworld Destroyer 5** | 辅助参考——机械族扩展，DLC 兼容处理 | 中 |
| Humanoid Alien Races | 参考大型框架 Mod 的 About.xml 规范 | 极高 |
| HugsLib | 参考通用库的依赖声明方式 | 极高 |
| Vanilla Expanded Framework | 参考 VEF 系列的代码组织 | 极高 |

### 对比流程

```text
1. 定位文件   → 在 STD Mod 中找到每个 XML 文件
2. 匹配参照   → 在参考 Mod 中找到功能最接近的对应文件
3. 逐字比对   → 字段名/嵌套层级/属性值/缺失字段
4. 差异分类   → 标记为 P0(致命)/P1(严重)/P2(影响体验)/P3(优化建议)
5. 改进方案   → 每个 P0/P1 问题附带具体修复建议
```

## 健康度评估

| 评估维度 | 评分(1-10) | 风险等级 | 核心问题 |
|----------|-----------|---------|---------|
| XML 规范性 | 6/10 | 🟡 黄 | 存在字段名错误、弃用字段、格式不规范 |
| DLC 兼容性 | 4/10 | 🔴 红 | 使用 Anomaly 专属类但未声明依赖 |
| 本地化完整性 | 3/10 | 🔴 红 | 完全无 Languages 翻译文件夹 |
| 代码复用度 | 5/10 | 🟡 黄 | 有 Abstract 基类但提取不够充分 |
| 贴图规范性 | 7/10 | 🟢 绿 | 命名正确，分辨率部分过大 |
| 发布就绪度 | 4/10 | 🔴 红 | P0 和 P1 问题需先修复 |

## 问题清单（完整）

### P0 —— 必须立即修复

| # | 问题 | 具体位置 | 影响 |
|---|------|---------|------|
| P0-1 | 未声明 Anomaly DLC 依赖 | `About.xml` 的 `loadAfter` 仅含 `Ludeon.RimWorld`，但 `09_Resurrection.xml` 使用 `CompUseEffect_Resurrect` 等 Anomaly 专属类 | 无 Anomaly 玩家加载 Mod 时**直接崩溃** |
| P0-2 | 无 Languages 翻译文件夹 | 所有 `label`/`description` 文本硬编码在 XML 中 | 不符合发布规范，社区翻译工具无法识别 |

### P1 —— 发布前务必修复

| # | 问题 | 对比参考 | 修复建议 |
|---|------|---------|---------|
| P1-1 | `STD_FieldCut` 的 `armorCategory` 为 Heat 但 `hediff` 为 Cut | UF Heavy Industries 所有 DamageDef 的类型完全匹配 | 统一为 Cut，或分别设 Cut/Burn/Bolt |
| P1-2 | 分析台缺少 `minifiedDef`/`Flickable`/`Power`/`placeWorkers` | UF 的所有工作台完整包含这些字段 | 逐字段添加，参考 UF 的实现 |
| P1-3 | EC-I/II/III 护盾充能速度完全相同时 | UF 护盾每级充能递增 | 按等级设充能：8.5/15.0/28.0 |
| P1-4 | 缺少 `Abstract` 基类提取 | Ancot Library 大量使用 Abstract 减少重复 | 提取 Alloy/Weapon/Apparel/Ingestible 四个基类 |

### P2 —— 影响用户体验

| # | 问题 | 建议 |
|---|------|------|
| P2-1 | Preview.png 547KB | 压缩至 ≤ 100KB（参考 Mod 平均 ~60KB） |
| P2-2 | III 级研究只要求 STD 分析台 | 添加 HiTechResearchBench + MultiAnalyzer 要求 |
| P2-3 | 物品标签中英文混杂 | 统一使用中文或提供中英双语 |

### P3 —— 优化建议

| # | 问题 | 建议 |
|---|------|------|
| P3-1 | 独立 RecipeDef 过多 | 使用 `<recipeMaker>` 内嵌方式减少文件数 |
| P3-2 | 护盾腰带缺少 `wornGraphicPath` | 添加穿戴渲染路径 |
| P3-3 | ResearchProjectDef 可提取 Abstract | 公共字段提取到基类，具体项目继承 |

## 审查统计

| 统计项 | 数值 |
|--------|------|
| 审查 XML 文件数 | 9（全部 Def 文件） |
| 审查非 XML 文件 | 1（About.xml） |
| 参考 Mod 数量 | 6 |
| 发现问题总数 | 12 |
| P0（致命） | 2 |
| P1（严重） | 4 |
| P2（体验） | 3 |
| P3（优化） | 3 |
| 代码行数 | 663 |
| 引用参考代码段 | 6 |

## 方法论可复用性

这份审查报告的框架——参考 Mod 优先对比 + 三级评分 + P0→P3 优先级——可以直接用于审查其他 RimWorld Mod。复用步骤：

1. 根据目标 Mod 的功能选取 3-6 个功能相似的已发布 Mod 作为参考
2. 逐 XML 文件对比字段差异
3. 每个差异标注严重等级和建议修复方式
4. 汇总为健康度评分和问题清单

## 审查者

审查者身份待确认（报告中未注明审查者姓名或身份）。

## 相关项目
- **STD Template Mod**——被审查的目标
- **RimWorld Mod 制作完全指南**——对应开发教程

## 完成时间
**2026 年 6 月 29 日**
