---
title: "RimWorld Mod 制作完全指南（STD 实战版）"
date: 2026-06-30T12:36:14+08:00
description: "以 STD Template Mod 为案例的 RimWorld 1.6 模组开发实战教程——18 个真实 Bug 剖析、XML 字段速查表、贴图管线全流程"
tags: ["RimWorld", "教程", "Mod", "技术文档"]
categories: ["项目"]
image: ""
draft: false
---

## 这是什么

一份以 **STD Template Mod 开发过程为实战案例**的 RimWorld 1.6 Mod 制作教学指南。704 行，最核心的价值是**18 个真实 Bug 的精确诊断**——不是理论读物，而是踩完坑之后的复盘笔记。

每一个 Bug 都标注了：错误现象、根因、涉及的具体 XML 标签、修复方式、以及如何防止再次踩坑。

## 内容结构

### 第一部分：Bug 百科全书（350+ 行，4 类 18 例）

#### XML 字段名错误（5 例）

| Bug | 错误 | 正确 | 教训 |
|-----|------|------|------|
| 护盾不充能 | `<layer>` | `<layers>` | RimWorld XML 中几乎所有列表型字段都使用**复数形式** |
| 研究项目不显示 | `<researchTab>` | `<tab>` | 不是所有看起来合理的标签名都是存在的字段 |
| 建筑需要建造技能但配置无效 | `constructionSkillPrerequisite` 写在了错误位置 | 应写在 `<recipeMaker>` 内 | 字段嵌套层级比字段名更重要 |
| 技能需求不生效 | 技能列表用单行格式 | `<li>采矿 8</li>` | RimWorld 使用 `li` 标签做列表项 |
| 社交判定异常 | 使用了 `socialPropernessMatters` | 该字段在 1.6 被移除 | 版本升级会**静默**删除字段 |

#### 贴图与渲染（4 例）

| Bug | 根因 | 修复 |
|-----|------|------|
| 装备贴图不显示 | 使用了 `Graphic_StackCount` 但只有一张贴图 | 改用 `Graphic_Single` |
| 穿戴后贴图缺失 | 穿戴贴图需要 5 种体型 × 3 个方向 = 15 张 | 生成完整贴图集或使用 `useWornGraphicMask` |
| 图标在 UI 中太大 | 贴图用了 512×512 | 标准 UI 图标应为 256×256 |
| 侧面贴图方向反 | RimWorld 的侧面贴图需要**手动镜像** | 在 PS 中翻转并重命名 |

#### 武器/装备（4 例）

- **近战武器添加远程 Verb → 崩溃**：VerbProperties 在近战武器上是无效的
- **护甲穿透不生效**：`armorPenetrationSharp` 在 Tool 上不存在，只在 Weapon 层级有效
- **工作速度加成无效**：`MiningSpeed`、`PlantWorkSpeed` 在 `statBases` 中无效——需要使用 Hediff 或 StatOffset
- **护盾不充能**：缺少 `tickerType="Normal"`——护盾 Comp 需要主动 Tick

#### 数据格式（3 例）

- `MedicalQualityMax` 必须是浮点数（`2.5`），不能是字符串（`"2.5"`）
- defName 不能以数字结尾（这是 XML Schema 约束，不是 RimWorld 特定）
- 缺失 `useWornGraphicMask` 导致装备图像溢出渲染

### 第二部分：XML 字段速查表（150+ 行）

覆盖 7 大 Def 类型的完整字段映射：

| Def 类型 | 内容 |
|----------|------|
| Apparel | 装备层、护甲值、温度调节、品质影响、耐久 |
| Weapon | 远程/近战、伤害、射程、精度、冷却 |
| Medicine | 医疗效力、最大品质、手术成功率 |
| Ingestible | 营养值、心情效果、Hediff 附加 |
| Recipe | 材料需求、产物数量、技能要求、研究前提 |
| Building | 尺寸、耗材、电力、可旋转、可拆除 |
| Research | 前置科技、研究消耗、Tab 分类、研究基准 |

### 第三部分：贴图管线

完整的工作流：

```text
Blender 建模（精确几何体 + 材质）
  → 渲染为高分辨率 PNG（512×512 或 1024×1024）
    → AI 工具转风格（统一为原版 RimWorld 的水彩/手绘风格）
      → Python 批处理（PIL 裁剪/缩放/格式转换）
        → 命名规范验证 + 放入 Textures 目录
```

关键教训：不要手动调整每一张贴图——写 Python 脚本批量处理。512×512 对 UI 图标来说太大（在游戏中"肥大"），256×256 是最佳分辨率。

### 第四部分：扩展路线图

| 阶段 | 内容 | 难度 |
|------|------|------|
| 纯 XML | 四级产物、更多 DamageDef、自定义 Thought | 低 |
| 需要 C# | 远程模式切换、护盾过载机制、套装共鸣 | 中 |
| 远期系统 | 模板觉醒事件、起源任务线、自定义世界生成 | 高 |

## 教程特色

- **不是"教你做 Mod"的泛泛之谈**——每个知识点都来自一个具体的、踩过的、修好了的 Bug
- **Bug 被编号和分类**——查找方便，类似一份"Bug 速查手册"
- **配合代码示例**——每个 Bug 都附带错误的 XML 片段和修复后的对比
- **版本锁定**——明确标注"RimWorld **1.6**"，避免跨版本信息误导

## 文件统计

- 总行数：704
- Bug 案例：18
- 字段速查覆盖：7 大 Def 类型
- 参考 Mod：STD Template Mod（完整实现）

## 相关项目

- **STD Template Mod**——本教程的实战案例
- **STD Mod 审查报告 v2**——对应质量评估

## 完成时间

约 **2026 年 6 月**
