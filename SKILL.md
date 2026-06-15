---
name: juanwang-holiday-planner
description: Use when the user wants a 卷王 holiday growth plan (假期成长规划 / 暑假计划 / 寒假计划 / 假期自律打卡) — creating, reviewing, or updating a saveable single-file HTML dashboard with daily check-ins (每日打卡), phase reviews (阶段复盘), and data sync.
---

<objective>
Create, review, and update a saveable single-file HTML holiday growth-plan dashboard. The skill turns a user's holiday goals into a phased daily plan, supports daily check-ins, and can write phase-level AI reviews back into the HTML data bundle.

The product voice is Chinese-first and warm: it helps users stop vague flag-setting without selling anxiety, peer pressure, or unhealthy transformation promises.
</objective>

<essential_principles>
- **Single HTML is the deliverable**: output exactly one `.html` file. Use a personalized safe filename by default (`juanwang-{nickname}-{goal-keyword}-{startDate}.html`) and respect an explicit user filename after sanitizing it and adding `.html` if needed. Do not create zip files, preview images, QR codes, `manifest.json`, or `sw.js` for normal delivery.
- **Start date is required**: never invent a start date. If the user does not provide a concrete `YYYY-MM-DD` start date, ask for it before generating a plan.
- **Nickname is optional**: ask for a preferred nickname/name at intake when natural, store it in `config.user.name`, and fall back to `小卷` without blocking generation.
- **No fake progress**: new plans initialize with `checkins: {}`, `reviews: {}`, selected Day 1, 0 streak, 0% completion, and no placeholder dashboard data.
- **Data drives UI**: dates, calendars, streaks, completion rates, phase review readiness, and report stats must be computed from `APP_DATA.dailyTasks` and `checkins`.
- **Health-first workload**: protect sleep, recovery, and sustainable effort. If health data declines or the user reports overload, reduce future load before adding tasks.
- **Low-friction execution is the core**: every generated plan must help the user start when motivation is low through If-Then plans, 2-minute starter tasks, timeboxes, buffer, stage reviews, and small-win feedback.
- **No anxiety marketing**: avoid “弯道超车”, “卷死同学”, shame, public-pressure tactics, extreme weight loss, and miracle-result promises.
- **Mood is emoji data**: mood options are exactly `😄`, `🙁`, `😝`, `😭`, `😡`; store the selected emoji string directly in `checkins[date].mood`.
</essential_principles>

<routing>
Route by user intent and then follow the selected workflow exactly:

| User intent | Workflow |
|---|---|
| Create a new holiday plan, growth plan, summer/winter plan, or HTML dashboard | `workflows/generate-plan.md` |
| Generate or write back a phase review from a synced HTML file | `workflows/generate-phase-review.md` |
| Modify an existing plan, reduce workload, change future tasks, or recover from falling behind | `workflows/adjust-existing-plan.md` |
| Audit/check a generated HTML or verify the skill deliverable | `workflows/validate-deliverable.md` |

If intent is mixed, prioritize in this order: validate existing data → phase review → adjust existing plan → generate new plan. Ask one concise clarification only when the required artifact or intent is missing.
</routing>

<reference_index>
Load only the references required by the selected workflow:

- `references/product-principles.md` — product scope, users, tone, and delivery model
- `references/app-data-schema.md` — `APP_DATA`, localStorage, review data, and compatibility rules
- `references/failure-mechanisms.md` — why holiday plans fail and the product responses that lower execution friction
- `references/planning-methodology.md` — phase design, daily task construction, If-Then plans, timeboxing, buffer, AAR/PDCA
- `references/safety-and-tone.md` — prohibited language, health boundaries, review tone
- `references/html-runtime-contract.md` — template/runtime requirements and validation invariants
</reference_index>

<workflows_index>
| Workflow | Purpose |
|---|---|
| `generate-plan.md` | Create a new initialized single-file HTML plan |
| `generate-phase-review.md` | Parse synced HTML and write phase review text into `APP_DATA.reviews` |
| `adjust-existing-plan.md` | Preserve history and adjust only future tasks |
| `validate-deliverable.md` | Verify structure, data, runtime behavior, and market-ready constraints |
</workflows_index>

<success_criteria>
A task handled by this skill succeeds when:

- Generated plans deliver one HTML file with no PWA dependency and no fake progress.
- Generated plans include the P0 low-friction system: scenario-bound If-Then, daily 2-minute starter, realistic timebox with buffer, 7-10 day review cadence, and small-win feedback language.
- Validation confirms Day 1 initialization, dynamic dates, dynamic phase review readiness, and five emoji mood options.
- Phase reviews use only real synced data, preserve existing checkins/reviews, and keep a supportive, non-shaming tone.
</success_criteria>
