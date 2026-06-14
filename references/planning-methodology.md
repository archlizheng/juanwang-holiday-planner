<planning_methodology>
**Core planning thesis**: 用户不是缺计划，用户缺的是在低状态下依然能启动的系统。Every methodology below must become a generation rule, not a theory label.

**Input collection**:
- Duration: 30 / 45 / 60 / 90 days or a user-provided number
- Start date: required `YYYY-MM-DD`; ask if missing and do not default to today/tomorrow
- Main direction: 卷玩 / 卷学习 / 卷实习 / 卷兴趣 / 卷健康
- Specific main goal and measurable outcome
- Optional side goals: maximum 2; side goals must not crowd out the main goal
- Optional available daily time and current baseline; if provided, schedule only 70%-80% of it
- Optional identity anchor: “这个假期结束时，你希望自己变成什么样的人？” If absent, infer one gentle sentence from the goals
- Optional high-risk failure scenarios: e.g. 熬夜, 手机刷太久, 王者太久, 下雨, 家里临时安排, 情绪低落

**Five-layer methodology stack and generation rules**:

| Layer | Method | Skill generation rule |
|---|---|---|
| Why | HARD Goals / identity anchor | Add a warm identity sentence in `config.user` or plan copy: “我在练习成为……的人”. Do not use shame or comparison. |
| What | OKR | Translate the main goal into one objective and 2-4 measurable key results for phase themes and review criteria. KRs measure outcomes, not just tasks. |
| How | GTD + timeboxing + Pomodoro + If-Then | Convert every goal into the next physical action; give a fixed timebox; include scenario-specific If-Then. |
| Loop | AAR / PDCA | Split phases so the user can review every 7-10 days; reviews adjust future workload based on real data. |
| Stay | Progress principle + small wins | Tips and reviews highlight visible progress, starter-task continuity, better rhythm, and health improvements before gaps. |

**Phase splitting**:
- 30 days: default 4 phases: Day 1-7, Day 8-15, Day 16-23, Day 24-30
- 31-60 days: 4-6 phases, usually 7-10 day blocks where possible; avoid one long 15+ day phase without review
- >60 days: 6-9 phases; may include a `trophy` closing phase
- First phase is deliberately lighter for rhythm building
- Every 7-10 days, include a low-load review/recovery day or make the phase ending day lighter
- For all durations, compute review readiness from actual task phase membership

**Daily task design**:
- Main task: concrete action + quantity + timebox, usually 25-60 minutes. Prefer “做 1 个 IELTS Listening Section 1 并错题复盘 10 分钟” over “提升听力”.
- Starter task: a 2-minute action that makes starting easy. It must be easier than the main task and executable even at low motivation.
- Elastic task: optional 10-25 minutes, explicitly marked as `允许放弃`; side goals usually live here.
- If-Then plan: scenario-specific fallback for the user's risk pattern; bind it to one real trigger and one tiny replacement action.
- Health target: conservative progression for steps, water, exercise, and sleep; never trade sleep for extra tasks.
- Tip: encourage the starter and small win, not “加油坚持”.

**Workload and buffer rules**:
- Default to realistic planning, not the user’s optimistic estimate.
- If user reports available time, schedule only 70%-80% and leave 20%-30% as buffer. Example: 120 minutes available → 60-75 minutes main task + 15-25 minutes optional elastic task + remaining buffer.
- If no available time is provided, keep the first week light: one main timebox plus one optional task only.
- Make the plan barely challenging: current ability × 1.0-1.1, not “爆改”.
- Main goal owns the main task; side goals should usually appear as elastic or low-frequency tasks.
- If the user is behind or health is down, shrink future tasks before adding catch-up work.
- Never design punitive make-up days or compensation marathons.

**If-Then generation rules**:
- Use the user’s own collapse scenarios first.
- If no scenarios are provided, include common holiday risks: late-night scrolling, long gaming sessions, family interruptions, low mood, and weather.
- The fallback action should preserve continuity, not complete the full task.
- Good format: “如果 [specific trigger], 那么 [tiny physical action]，并允许今天只算启动版。”

**2-minute starter examples**:
- IELTS reading: 打开题目，只圈标题和 3 个关键词。
- IELTS listening: 播放音频前 30 秒，写下听到的 3 个词。
- IELTS speaking: 打开录音，读 1 个题目并说 30 秒。
- Guitar: 把吉他拿出来，按 2 次 C 和弦。
- Health: 穿好鞋，走到楼下；或倒一杯水并站立拉伸 1 分钟。

**Review method**:
Use AAR/PDCA in warm prose, but prioritize adjustment over summary:
1. Original intent for the phase
2. What actually happened, using specific numbers from checkins
3. At least one concrete progress signal or small win
4. Which task/trigger created the most friction
5. Whether If-Then and starter tasks helped the user restart
6. One or two lower-friction next actions for the next phase

**Small-win feedback rules**:
- Do not define the user by completion rate.
- Mention “没有完全断掉”, “启动版也算保留节奏”, “作息提前了”, “某个时间锚点有效” when supported by data.
- If there is no data, say “暂无数据，先从 Day 1 的 2 分钟启动版开始” rather than inventing progress.
</planning_methodology>
