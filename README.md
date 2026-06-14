# juanwang-holiday-planner

**卷王·假期成长规划** — 用 AI 编程助手把模糊的假期目标，变成一份可打卡、可复盘、可保存的 **单文件 HTML 假期成长仪表盘**。

> 不靠意志力，靠可执行的规划。产品语气温暖、反焦虑：不贩卖「弯道超车」「卷死同学」式压力，优先睡眠、恢复与可持续节奏。

---

## 快速开始

你 **不需要会写代码**。装好 Skill 后，在对话里说明假期目标并 **必须提供开始日期**；AI 会按本仓库规则生成 `juanwang-skill.html`，双击即可在浏览器打开（手机也可传文件后用浏览器打开）。

### 路径 A：已安装 Skill

1. **新开一次 AI 对话**（让 Skill 生效）。
2. **复制下面模板，改成你的信息**，发送给 AI。
3. 等待生成 **单个 HTML 文件** `juanwang-skill.html`。

```text
/juanwang-holiday-planner 帮我做一份暑假成长规划

开始日期: 2026-07-01
假期长度: 45 天
主要方向: 英语 + 运动恢复节奏
具体目标: 每天背 20 个四级词，每周跑 2 次
副目标: 读完一本非虚构书（可选）
每天可用时间: 约 2 小时
```

触发方式因环境而异：优先用 **`/juanwang-holiday-planner`**；若未注册斜杠命令，可在对话里说明「请严格按 `juanwang-holiday-planner` skill 生成单文件 HTML 计划」，或用 **`@`** 引用已安装目录下的 `SKILL.md`。

**重要**：若未提供 `YYYY-MM-DD` 格式的开始日期，Skill 会要求你补充，不会擅自编造日期。

### 路径 B：尚未安装 Skill

1. **先安装**（推荐一条命令，见下文 [安装方式](#安装方式)）。
2. **新开一次 AI 对话**。
3. **复制 [路径 A](#路径-a已安装-skill) 中的对话模板**，改成你的信息后发送。

---

## 安装方式

思路：**让 AI 能读到本仓库的 `SKILL.md` 及 `workflows/`、`references/`、`templates/` 等配套文件**。

`npx skills install` 与 `npx skills add` **等价**（`install` 是 `add` 的别名）。CLI 会从 GitHub 拉取仓库并写入各 Agent 约定的 skills 目录，**不必先手动 clone**。

> 以下命令假设仓库已发布为 `archlizheng/juanwang-holiday-planner`。若你 fork 了仓库，把 `owner/repo` 换成自己的即可。

### 推荐：一条命令安装

安装到**当前项目**（便于团队共享）：

```bash
npx skills install archlizheng/juanwang-holiday-planner -y
```

安装到**本机所有项目**（个人常用）：

```bash
npx skills install archlizheng/juanwang-holiday-planner -g -y
```

仅安装到 **Cursor**：

```bash
npx skills install archlizheng/juanwang-holiday-planner -a cursor -y
```

仅安装到 **Codex**：

```bash
npx skills install archlizheng/juanwang-holiday-planner -a codex -y
```

安装后请 **新开对话**。Skill 名称为 **`juanwang-holiday-planner`**（与 `SKILL.md` 的 `name` 字段一致）。

### 更新与查看

更新已安装的 skill：

```bash
npx skills update juanwang-holiday-planner
```

仅查看本仓库里有哪些 skill、不实际安装：

```bash
npx skills install archlizheng/juanwang-holiday-planner --list
```

### 备选：手动克隆或复制

若环境不支持 skills CLI，可将本仓库克隆或复制到 Agent 的 skills 目录：

| Agent | 常见路径 |
|-------|----------|
| Cursor（项目级） | `.cursor/skills/juanwang-holiday-planner/` |
| Cursor（用户级） | `~/.cursor/skills/juanwang-holiday-planner/` |
| Codex（项目级） | `.codex/skills/juanwang-holiday-planner/` |
| Claude Code | `~/.claude/skills/` 或项目内 `.claude/skills/` |

目录内须包含 **`SKILL.md`** 及完整的 `workflows/`、`references/`、`templates/`、`scripts/`。

---

## 你会得到什么

生成物是 **一个 HTML 文件** `juanwang-skill.html`，内含：

| 模块 | 说明 |
|------|------|
| 规划 | 阶段路线图、每日任务、If-Then 预案、2 分钟启动版 |
| 打卡 | 主任务 / 弹性任务、健康数据、心情（5 个 emoji）、备注 |
| 仪表盘 | 连续打卡、完成率、日历、趋势（均由真实打卡数据计算） |
| 复盘 | 阶段复盘卡片（可让 AI 根据同步后的 HTML 写回复盘） |

新计划 **不会预填假进度**：`checkins` 与 `reviews` 初始为空，Day 1 选中，连续天数与完成率为 0。

---

## 还能做什么

在已安装 Skill 的前提下，你可以继续对话：

| 意图 | 示例说法 |
|------|----------|
| 调整未来任务 / 减负 | 「我落后了，帮我把后面 7 天的任务减载，保留已打卡记录」 |
| 阶段复盘 | 「根据我同步出来的 HTML，写第 1 阶段复盘并写回文件」 |
| 校验产物 | 「帮我检查这份 juanwang-skill.html 是否符合 skill 规范」 |

---

## 字段说明（照抄格式最稳）

| 信息 | 怎么填 |
|------|--------|
| 开始日期 | **必填**，`YYYY-MM-DD`，例如 `2026-07-01` |
| 假期长度 | 天数，例如 `45` |
| 主要方向 | 一句话概括，例如「英语 + 运动」 |
| 具体目标 | 可衡量的主目标 |
| 副目标 | 最多 2 个，可选 |
| 每天可用时间 | 可选；Skill 会按 70%–80% 留 buffer |
| 身份锚点 / 高风险场景 | 可选；用于生成 If-Then 预案 |

---

## 验证（开发者 / 维护者）

在 skill 目录下执行：

```bash
node scripts/validate.mjs templates/juanwang-skill.html
node scripts/smoke-test.mjs templates/juanwang-skill.html
```

---

## 仓库结构

- `SKILL.md` — 路由与核心原则
- `workflows/` — 生成、调整、复盘、校验流程
- `references/` — 产品原则、数据 schema、规划方法论、安全语气、运行时契约
- `scripts/` — `validate.mjs`（静态不变量）、`smoke-test.mjs`（运行时逻辑测试）
- `templates/juanwang-skill.html` — 生成时唯一使用的 HTML 模板

请勿将 legacy PWA 文件、二维码、预览图、zip 包或 `.DS_Store` 纳入发布包。

---

## Author release checklist

发布新版本前确认：

- YAML frontmatter 中 `name` 为小写且与目录名一致；`description` 为第三人称并含中文触发词
- `SKILL.md` 使用 XML 结构，正文无 markdown 标题，且少于 500 行
- 所有 workflow、reference、template、script 文件存在
- 上述两条 validate / smoke-test 命令均通过
- 发布包仅包含上文「仓库结构」所列资源

---

## 许可证

[MIT](./LICENSE)
