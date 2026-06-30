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

一份以 **STD Template Mod 开发过程为实战案例**的 RimWorld 1.6 Mod 制作教学指南。704 行，最核心的价值是 **18 个真实 Bug 的精确诊断**——不是理论读物，而是踩完坑之后的复盘笔记。

每一个 Bug 都标注了：错误现象、根因、涉及的具体 XML 标签、修复方式、以及如何防止再次踩坑。

## 内容结构

### 第一部分：Bug 百科全书（350+ 行，4 类 18 例）

#### XML 字段名错误（5 例）

| Bug | 错误 | 正确 | 教训 |
|-----|------|------|------|
| 护盾不充能 | `<layer>` | `<layers>` | RimWorld XML 中几乎所有列表型字段都使用**复数形式**。`layer` 是 RimWorld 内部枚举，不是 XML 标签 |
| 研究项目不显示 | `<researchTab>` | `<tab>` | `researchTab` 是研究项目的**分类标签值**，不是 XML 字段名。正确的字段是 `<tab>`，值才是类别字符串 |
| 建筑技能需求无效 | `constructionSkillPrerequisite` 写在 ThingDef 根级别 | 写在 `<recipeMaker>` 内部 | 字段嵌套层级比字段名更重要。外层只识别 `recipeMaker` 对象，skill 相关字段必须在其内部作用域 |
| 技能需求不生效 | `<skillRequirements>采矿 8</skillRequirements>` | `<li>采矿 8</li>` | RimWorld XML 使用 `<li>` 作列表项标签。直接写入文本字符串被解析器忽略 |
| 社交判定异常 | `socialPropernessMatters` | 在 1.6 被移除 | 版本升级会**静默**删除字段，不报错也不警告。需要查看官方更新日志 |

**XML 字段名错误的核心教训**：RimWorld 的 XML 解析器对无效字段**静默忽略**——不会报错，不会警告，但功能就是不起作用。这使得字段名错误成为最难排查的 Bug 类型。

#### 贴图与渲染（4 例）

| Bug | 根因 | 修复 |
|-----|------|------|
| 装备贴图不显示 | `Graphic_StackCount` 需要多张贴图变体但当只有一张时渲染失败 | 改用 `Graphic_Single` |
| 穿戴贴图缺失 | 穿戴贴图需要 5 体型 × 3 方向 = 15 张完整变体集 | 使用 `useWornGraphicMask=true` 或生成完整贴图集 |
| 图标在 UI 中"肥大" | 512×512 贴图在 UI 中显示过大 | 标准 UI 图标分辨率 256×256 |
| 侧面贴图左右颠倒 | RimWorld 的侧面渲染不会自动镜像 | 贴图制作时手动翻转 → 重命名 |

**贴图命名规范：**
```
正确：STD_FieldGun.png, STD_FieldGun_back.png, STD_FieldGun_side.png
错误：STD-Field-Gun.png, fieldGun.png, 力场枪.png
```

#### 武器/装备（4 例）

| Bug | 根因 | 修复 |
|-----|------|------|
| 近战武器添加远程 Verb → 崩溃 | VerbProperties 在近战武器上是无效的。`<weaponTags>` 决定武器类型的互斥性 | 移除 `<verbs>` 节点或改为纯远程武器 |
| 护甲穿透无效 | `armorPenetrationSharp` 只在 Weapon 层（statBases）有效，在 Tool 层（近战攻击动作）无效 | 移至 `<statBases>` 而非 `<tools>/<li>/<capacities>/<li>` |
| MiningSpeed/PlantWorkSpeed 无效 | 这两个 stat 不在 `statBases` 的白名单中 | 使用 Hediff 的 `statOffsets` 间接提供加成 |
| 护盾不充能 | 缺少 `tickerType="Normal"` | 添加 `<tickerType>Normal</tickerType>` 确保护盾 Comp 的 Tick 方法被调用 |

#### 数据格式（3 例）

| Bug | 修复 |
|-----|------|
| `MedicalQualityMax` 为字符串 `"2.5"` | 改为浮点数格式 `2.5`（无引号） |
| defName 以数字结尾（如 `Ration_3`） | 改为 `Ration_III` 或 `Ration_T3` |
| 装备渲染溢出 | 添加 `useWornGraphicMask=true` |

### 第二部分：XML 字段速查表（150+ 行）

覆盖 7 大 Def 类型的完整字段映射，以下为每类中最常出错的字段：

**Apparel（装备）**

| 字段 | 位置 | 类型 | 示例 |
|------|------|------|------|
| `apparelLayers` | ThingDef 根 | 列表 | `<li>Belt</li>` |
| `armorRating` | statBases | 浮点 | `<Sharp>0.40</Sharp>` |
| `insulationCold` | statBases | 浮点 | `<Insulation_Cold>-50</Insulation_Cold>` |
| `wornGraphicPath` | graphicData | 路径 | `Things/Item/STD_ShieldBelt` |

**Weapon（武器）**

| 字段 | 位置 | 类型 | 示例 |
|------|------|------|------|
| `verbs` | ThingDef → verbs → li | 嵌套对象 | 含 `verbClass`, `defaultProjectile`, `warmupTime`, `range` 等子字段 |
| `weaponTags` | ThingDef 根 | 列表 | `<li>Gun</li>` |

**Research（研究）**

| 字段 | 位置 | 类型 | 示例 |
|------|------|------|------|
| `tab` | ResearchProjectDef | 字符串 | `STD` |
| `baseCost` | ResearchProjectDef | 整数 | `1500` |
| `prerequisites` | ResearchProjectDef | 列表 | `<li>STD_BasicDecoding</li>` |
| `requiredResearchFacilities` | ResearchProjectDef | 列表 | `<li>HiTechResearchBench</li>` |

### 第三部分：贴图管线

完整的工作流：

```text
Blender 建模（精确几何体 + 材质）
  → Cycles 渲染为高分辨率 PNG（1024×1024）
    → AI 工具转风格（统一为 RimWorld 水彩/手绘风格）
      → Python PIL 批处理（裁剪 256×256、格式转换、命名规范化）
        → 放入 Textures/ 对应子目录
          → 游戏内验证（UI 图标 + 世界渲染 + 穿戴效果）
```

**Python 批处理脚本模板：**
```python
from PIL import Image, ImageFilter
import os

for f in os.listdir('output/'):
    img = Image.open(f'output/{f}')
    img = img.resize((256, 256), Image.LANCZOS)
    # 轻微锐化补偿缩放损失
    img = img.filter(ImageFilter.SHARPEN)
    img.save(f'textures/Things/Item/{f}', 'PNG', optimize=True)
```

### 第四部分：扩展路线图

| 阶段 | 内容 | 技术门槛 | 预期工作量 |
|------|------|---------|-----------|
| 纯 XML | 四级产物、更多 DamageDef、自定义 Trait | 低 | 1-2 周 |
| 纯 XML | 更多 Hediff 效果（临时变形、元素免疫） | 低 | 1 周 |
| 需要 C# | 武器远程模式切换 | 中 | 3-5 天 |
| 需要 C# | 护盾过载机制（消耗充能换取爆发效果） | 中 | 1 周 |
| 需要 C# | 套装共鸣系统（装备 2/3/4 件同系列触发额外效果） | 高 | 2-3 周 |
| 远期 | 模板觉醒事件——世界中随机刷出 STD 遗迹 | 高（需自定义 WorldObject + Incident） | 4-6 周 |
| 远期 | 起源任务线——完整叙事链引导玩家探索 STD 科技 | 高（需自定义 Quest + Faction） | 8-12 周 |

## 教程特色

- **不是"教你做 Mod"的泛泛之谈**——每个知识点都来自一个具体踩过的、修好了的 Bug
- **Bug 被编号和分类**——查找方便，类似"Bug 速查手册"
- **配合代码示例**——每个 Bug 附带错误的 XML 片段和修复后的对比
- **版本锁定**——明确标注"RimWorld 1.6"，避免跨版本信息误导
- **可直接作为新 Mod 的启动参考**——XML 速查表 + 贴图命名规范 + 最佳实践 = 新建 Mod 的快速起步指南

## 目标读者

- 有基本 XML 知识但刚接触 RimWorld Mod 开发的初学者
- 踩过坑后想系统复盘的中级开发者
- 需要快速查阅字段格式和命名规范的 Mod 维护者

## 文件统计

| 项目 | 数值 |
|------|------|
| 总行数 | 704 |
| Bug 案例 | 18 |
| XML 字段速查覆盖 | 7 大 Def 类型，30+ 字段 |
| 参考代码片段 | 12+ |
| 贴图管线步骤 | 5 步全流程 |
| 扩展路线图阶段 | 7 个阶段 |

## 相关项目
- **STD Template Mod**——本教程的实战案例
- **STD Mod 审查报告 v2**——对应质量评估

## 完成时间
约 **2026 年 6 月**
