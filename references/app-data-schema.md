<app_data_schema>
`APP_DATA` must be valid JSON injected into the HTML template as:

```js
/*__APP_DATA_START__*/
const APP_DATA = { ... };
/*__APP_DATA_END__*/
const STATE_KEY = computeStateKey(); // juanwang_state_v1_{startDate}_{goalHash}
```

Required top-level fields:
```json
{
  "config": {
    "output": {
      "fileNameBase": "juanwang-小卷-英语运动-2026-07-01"
    },
    "user": {
      "name": "小卷",
      "duration": 30,
      "mainGoal": {
        "category": "卷健康 | 卷学习 | 卷实习 | 卷兴趣 | 卷玩",
        "subGoal": "具体子目标",
        "specific": "用户可读的具体目标"
      },
      "sideGoals": [
        {"category": "卷学习", "subGoal": "英语四级"}
      ],
      "startDate": "YYYY-MM-DD",
      "identityAnchor": "optional gentle identity sentence",
      "availableDailyMinutes": 120
    }
  },
  "phases": [],
  "dailyTasks": [],
  "checkins": {},
  "reviews": {}
}
```

`config.output.fileNameBase` is optional for backward compatibility and must not include `.html`. For new plans, set it from the safe filename base used for delivery. Prefer user-requested filenames when provided; otherwise use `juanwang-{nickname}-{goal-keyword}-{startDate}`. If omitted in older files, runtime falls back to `config.user.name`, `config.user.mainGoal`, and `config.user.startDate`.

Required `phase` fields:
- `id`: number, stable phase id starting at 1
- `title`: Chinese phase name
- `icon`: current icon id such as `sprout`, `leaf`, `tree`, `rocket`, `trophy`
- `range`: e.g. `Day 1-7`
- `theme`: phase theme
- `tip`: warm phase-level prompt

Optional `config.user` methodology fields such as `identityAnchor`, `availableDailyMinutes`, `realisticDailyMinutes`, or `riskScenarios` may be included when useful. `config.user.name` should use the user's preferred nickname/name when provided, otherwise `小卷`; nickname is not a hard gate. The runtime must not depend on methodology fields.

Required `dailyTasks[]` fields:
- `day`: 1-based day number
- `date`: concrete `YYYY-MM-DD`, computed from `startDate`
- `phaseId`: matching phase id
- `mainTask`: 25-60 minute concrete next physical action with a timebox
- `starterTask`: 2-minute starter action
- `elasticTask`: optional ~10-25 minute action, explicitly says `允许放弃`
- `ifThenPlan`: high-risk scenario fallback bound to a specific trigger
- `estimatedMinutes`: number
- `tip`: daily warm prompt; may include starter and If-Then summary
- `healthTarget`: `{steps, sleepTarget, waterCups, exerciseMinutes}`

Initialization rules:
- New plan: `checkins: {}` and `reviews: {}`
- UI selected day defaults to Day 1
- Do not inject sample checkins or fake reviews

`localStorage` key is computed at runtime as `juanwang_state_v1_{startDate}_{goalHash}` so multiple plans do not overwrite each other.

`localStorage` shape:
```json
{
  "checkins": {
    "YYYY-MM-DD": {
      "starterDone": true,
      "mainDone": true,
      "elasticDone": false,
      "mood": "😄",
      "note": "...",
      "health": {
        "steps": 8000,
        "sleepTime": "23:30",
        "waterCups": 8,
        "exerciseMinutes": 20
      }
    }
  },
  "selectedDay": 1,
  "reviews": {
    "1": {
      "text": "<p>...</p>",
      "generatedAt": "ISO timestamp",
      "version": "vYYYYMMDD-HHMM"
    }
  }
}
```

Compatibility rules:
- Preserve existing `checkins` and `reviews` when modifying a synced HTML.
- Use `icon` as the phase display field; do not reintroduce legacy `emoji` as the primary field.
- Phase end day is `max(dailyTasks[].day where phaseId === phase.id)`, never a hardcoded formula.

Injection safety:
- The initial `APP_DATA` block written at generation time is NOT auto-escaped (only the in-app "sync to HTML" path escapes via `.replace(/<\//g, '<\\/')`). When you write `APP_DATA` into the template, escape every `</` in string values (goals, notes, tips, If-Then text) to `<\/`. An unescaped `</script>` anywhere in `APP_DATA` terminates the script block and breaks the page. `scripts/validate.mjs` enforces `<script>`/`</script>` balance as a backstop.
</app_data_schema>
