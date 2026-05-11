# 学习通助手 🎓

> 超星学习通自动答题油猴脚本 | 题目导出 + AI 提示词 + 一键填入答案

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-1.0+-green?logo=tampermonkey)](https://www.tampermonkey.net/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/252408/chaoxing-helper)](https://github.com/252408/chaoxing-helper)
[![Issues](https://img.shields.io/github/issues/252408/chaoxing-helper)](https://github.com/252408/chaoxing-helper/issues)

## 📋 功能特性

| 功能 | 说明 |
|------|------|
| 📤 **题目导出** | 一键提取页面所有题目，生成 AI 提示词 |
| 🤖 **自动答题** | 支持单选、多选、判断题自动填入 |
| 📝 **简答填入** | 自动填充 UEditor 富文本编辑器 |
| 🎯 **智能识别** | 自动识别题型，匹配答案格式 |
| 📊 **进度显示** | 实时进度条，答题状态一目了然 |
| 🖱️ **可拖拽弹窗** | UI 美观，支持最小化/最大化 |
| 🔒 **本地运行** | 纯前端脚本，数据不上传 |

## 🚀 安装方法

### 1. 安装油猴扩展

- [Tampermonkey](https://www.tampermonkey.net/) (推荐)
- [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)

### 2. 安装脚本

点击下方按钮直接安装：

[📥 点击安装](https://github.com/252408/chaoxing-helper/raw/main/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%E5%90%88%E9%9B%86%E7%89%88-1.8.user.js)

或者：

1. 打开 Tampermonkey 面板
2. 创建新脚本
3. 粘贴 学习通助手合集版-1.8.user.js 的内容
4. 保存

### 3. 使用方法

1. 打开超星学习通作业/考试页面
2. 页面右上角会出现「学习通助手」弹窗
3. 点击「📋 导出题目」提取题目和 AI 提示词
4. 将提示词发送给 AI（ChatGPT、Claude 等）
5. 复制 AI 返回的答案
6. 粘贴到弹窗文本框
7. 点击「🚀 一键填入全部」完成答题

## 📖 使用示例

### 导出题目

点击「📋 导出题目」按钮，脚本会自动：

- 提取页面所有题目
- 识别题型（单选/多选/判断/简答）
- 生成格式化的 AI 提示词
- 一键复制提示词

### 填入答案

将 AI 返回的答案粘贴到文本框，支持多种格式：

`
1.A
2.C
3.B
26.对
27.错
41.全面深化改革的总目标是完善和发展中国特色社会主义制度，推进国家治理体系和治理能力现代化
`

## 🔧 支持的平台

- 超星学习通 (*.chaoxing.com)
- 学习通 (*.xuexi360.com)
- MOOC (mooc1.chaoxing.com)

## ⚠️ 免责声明

本脚本仅供学习交流使用。使用本脚本产生的任何后果由用户自行承担。请遵守学校相关规定。

## 🤝 加入交流群

欢迎加入 **校园网免认证交流群**，获取最新版本、反馈问题、交流使用心得：

### QQ 群：1105227632

> 🔓 **校园网免认证** — 群内提供校园网免认证方案，让你的校园网使用更自由！

扫码或搜索群号加入：

<img src="https://raw.githubusercontent.com/252408/chaoxing-helper/main/qr-1105227632.png" alt="QQ群二维码" width="200">

## 📝 更新日志

### v1.8 (2026-05-11)
- 🎨 全新 UI 设计，渐变色弹窗
- 📊 新增答题进度条
- 🔧 优化答案解析，支持多行简答合并
- 🐛 修复判断题填入逻辑

### v1.7
- 📋 新增题目导出功能
- 🤖 新增 AI 提示词生成
- 📝 支持简答题 UEditor 填入

### v1.6
- 🎯 支持单选/多选/判断题
- 🖱️ 弹窗可拖拽、最小化

## 📄 License

[MIT](LICENSE) © 2026 Echo

## 💬 常见问题

### Q: 脚本安装后没有显示弹窗？
A: 请确保在作业/考试页面使用，普通课程页面不会触发脚本。

### Q: 简答题填入失败？
A: 请等待页面完全加载后再操作，UEditor 需要一定时间初始化。

### Q: 支持哪些 AI？
A: 任何 AI 都可以，只要能按照格式返回答案即可（ChatGPT、Claude、文心一言等）。

---

⭐ 如果这个项目对你有帮助，请点个 Star 支持一下！

**校园网免认证群：1105227632** | 加群获取最新版本和校园网免认证方案
