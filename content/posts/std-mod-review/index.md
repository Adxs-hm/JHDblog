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

## 方法论

### 参考 Mod 优先对比法

传统审查的问题在于：审查者自己设定"正确标准"，但这个标准可能与社区实际不符。

本报告的创新做法：选取 6 个已经在 Steam Workshop 发布、有数千订阅的 Mod 作为**基准模板**：

| 参考 Mod | 选取理由 |
|----------|----------|
| **UF Heavy Industries**（联合重工） | 主要参考——同为国产 Mod，也含工作台/能量武器/护盾/研究/Hediff/完整翻译 |
| **Ancot Library** | 辅助参考——护盾 Hediff/WorkGiver 实现/翻译结构 |
| **Glitterworld Destroyer 5** | 辅助参考——机械族扩展，DLC 兼容处理 |
| Humanoid Alien Races | 参考大型框架 Mod 的 About.xml 规范 |
| HugsLib | 参考通用库的依赖声明方式 |
| Vanilla Expanded Framework | 参考 VEF 系列的代码组织 |

审查方法：对于 STD 的每个 XML 文件，**找到参考 Mod 中对应的同类文件，逐字段对比差异**。差异不一定都是错误，但每个差异都会被追问"为什么不同"。

### 三级评分体系

| 维度 | 评分 | 风险 | 说明 |
|------|------|------|------|
| XML 规范性 | 6/10 | 🟡 | 存在字段名错误、弃用字段使用、格式不规范 |
| DLC 兼容性 | 4/10 | 🔴 | 使用了 Anomaly 专属类但未声明依赖 |
| 本地化完整性 | 3/10 | 🔴 | 完全没有 Languages 翻译文件夹 |

## 问题清单

### P0 —— 必须立即修复

| # | 问题 | 影响 |
|---|------|------|
| P0-1 | **未声明 Anomaly DLC 依赖**——About.xml 的 `loadAfter` 仅含 `Ludeon.RimWorld`，但 `09_Resurrection.xml` 使用了 `CompUseEffect_Resurrect` 等 Anomaly 专属类 | 无 Anomaly DLC 的玩家加载 Mod 时直接崩溃 |
| P0-2 | **无 Languages 翻译文件夹**——所有文本硬编码在 XML 的 `<label>` 和 `<description>` 中，没有独立的翻译文件 | 不符合 RimWorld Mod 发布规范，无法被社区翻译工具识别 |

### P1 —— 应在发布前修复

| # | 问题 |
|---|------|
| P1-1 | `STD_FieldCut`：`armorCategory` 设为 `Heat`（热），但 `hediff` 为 `Cut`（切割）——伤害类型与护甲抗性不匹配 |
| P1-2 | STD 分析台（`01_Analyzer.xml`）：缺少 `minifiedDef`、`Flickable`、`Power`、`placeWorkers` 等标准 Building 组件 |
| P1-3 | 护盾充能速度在所有等级相同——III 级护盾腰带应该有更快的充能速度 |
| P1-4 | `00_Core.xml` 缺少 `Abstract` 基类提取——合金的多个 statBases 可提取为基类供其他物品复用 |

### P2 —— 影响用户体验

| # | 问题 |
|---|------|
| P2-1 | `Preview.png` 文件达 547KB——参考 Mod 的 Preview 普遍 ≤ 100KB。Steam Workshop 页面的预览图不需要超高分辨率 |
| P2-2 | III 级研究项目全部只要求 `STD_Analyzer` 作为研究设施——最高科技应该要求 `HiTechResearchBench` 和 `MultiAnalyzer` |
| P2-3 | 物品标签中英文混杂——`<label>` 中一些是中文，一些是英文缩写 |

### P3 —— 优化建议

| # | 问题 |
|---|------|
| P3-1 | 建议使用 `<recipeMaker>` 内嵌方式替代独立 RecipeDef——更现代，减少文件数量 |
| P3-2 | 建议为护盾腰带添加 `wornGraphicPath` 和完整 `bodyPartGroups` |
| P3-3 | 建议提取 ResearchProjectDef 的公共 Abstract 基类 |

## 核心建议

1. **添加 `Languages/` 文件夹**——同时支持中文和英文（中文默认 + 英文备用）
2. **声明 DLC 依赖**——在 About.xml 中添加 Anomaly 相关的 `modDependencies` 或 `loadAfter`
3. **修复 P0 和 P1 级问题**再公开发布
4. **压缩 Preview.png**——使用 TinyPNG 或类似工具压至 100KB 以下

## 审查统计

| 统计项 | 数值 |
|--------|------|
| 审查文件数 | 10（9 XML + 1 About.xml） |
| 参考 Mod 数 | 6 |
| 发现问题 | 12（P0:2 + P1:4 + P2:3 + P3:3） |
| 总行数 | 663 |

## 方法论可复用性

这份报告的框架——参考 Mod 优先对比 + 三级评分 + P0→P3 优先级——可以直接用于审查其他 RimWorld Mod。只需要更换参考 Mod 名单和对应的基准文件即可。

## 审查者

审查者身份待确认（报告中未注明审查者姓名或身份）。

## 相关项目

- **STD Template Mod**——被审查的目标
- **RimWorld Mod 制作完全指南**——对应开发教程

## 完成时间

**2026 年 6 月 29 日**
