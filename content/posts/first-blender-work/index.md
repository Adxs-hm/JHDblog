---
title: "机械姬角色渲染全流程"
date: 2026-06-29
description: "使用 Blender 4.0 Cycles 渲染器的完整角色制作流程，从建模到最终渲染"
tags: ["角色", "Cycles", "赛博朋克", "渲染"]
categories: ["作品集"]
image: "cover.jpg"
draft: false
---

## 作品概述

这次的作品是一个赛博朋克风格的机械角色，使用 **Blender 4.0 + Cycles** 渲染器制作。整体风格参考了《攻壳机动队》和《银翼杀手》的视觉语言——冷色调金属质感配合暖色霓虹灯光。

## 最终效果

这是本次作品的最终渲染图：

![机械姬最终渲染](final-render.webp "机械姬 · Cycles 4K 渲染")

## 多角度展示

| 正面视图 | 侧面视图 | 背面视图 |
|:---:|:---:|:---:|
| ![正面](front.webp) | ![侧面](side.webp) | ![背面](back.webp) |

## 制作过程

### 1. 粗模阶段

先搭建基础体块，确定角色比例关系。这个阶段不使用任何细分，保持几何体简洁以便调整。

**关键操作：**
- `Shift + A` 添加基本几何体（Cube、Cylinder、Sphere）
- `G` / `R` / `S` 移动、旋转、缩放
- `Ctrl + R` 添加环切线

> 💡 **提示：** 粗模阶段最重要的是比例，不要纠结细节。反复对比参考图，确保头部、躯干、四肢的比例正确。

### 2. 中模细化

确定比例后开始细化结构。添加机械关节、装甲板块、线缆等细节元素。

**常用修改器：**
| 修改器 | 用途 |
|--------|------|
| Mirror | 对称建模 |
| Subdivision Surface | 平滑曲面 |
| Solidify | 增加厚度 |
| Boolean | 切割复杂形状 |

### 3. 材质节点

```text
原理化 BSDF（金属基底）
    ↓
混合着色器
    ↓ ← 划痕纹理（Roughness 遮罩）
混合着色器
    ↓ ← 污渍纹理（Color Ramp 控制）
材质输出
```

**关键参数：**
- 金属度（Metallic）：`0.85 - 0.95`
- 糙度（Roughness）：`0.1 - 0.25`
- 清漆（Clearcoat）：`0.3`（模拟涂装表面）

### 4. 灯光设置

使用了**三点光照**方案：

- **主光**（Key Light）：Area Light，暖色调 4500K，强度 500W
- **辅光**（Fill Light）：Area Light，冷色调 6500K，强度 150W
- **轮廓光**（Rim Light）：Spot Light，从后方斜上方打来，强调角色轮廓

### 5. 渲染设置

| 参数 | 值 |
|------|-----|
| 渲染器 | Cycles |
| 采样数 | 4096 |
| 分辨率 | 3840 × 2160 (4K) |
| 降噪 | OpenImageDenoise |
| 色彩空间 | Filmic (Very High Contrast) |

## 查看 3D 模型

下面可以交互式查看模型的 3D 预览（如果已上传到 Sketchfab）：

<iframe title="机械姬 3D 模型"
  src="https://sketchfab.com/models/你的模型ID/embed?autostart=1&preload=1&ui_controls=1&ui_infos=1&ui_stop=1"
  width="100%" height="500" frameborder="0"
  allow="autoplay; fullscreen; xr-spatial-tracking"
  allowfullscreen>
</iframe>

> 🔗 如果你还没有 Sketchfab，可以在 [sketchfab.com](https://sketchfab.com) 免费注册并上传模型。

## 总结

这个项目让我对机械硬表面建模和金属材质有了更深的理解。最大的收获是学会了**参考图的合理使用**——不是照抄，而是理解其设计语言后再创作。

**下次改进的方向：**
- 增加更多可动关节的机械细节
- 尝试用 Geometry Nodes 生成线缆
- 探索 NPR（非真实感）渲染风格
