<required_reading>
Read these before generating a new plan:
1. `references/product-principles.md`
2. `references/app-data-schema.md`
3. `references/failure-mechanisms.md`
4. `references/planning-methodology.md`
5. `references/safety-and-tone.md`
6. `references/html-runtime-contract.md`
</required_reading>

<process>
1. **Collect required inputs**: duration, start date, main direction, specific main goal, up to 2 side goals, optional available daily time/baseline, optional identity anchor, and optional high-risk scenarios. If start date is missing, ask for it and stop. Do not block generation for missing optional fields; infer gentle defaults.
2. **Create the low-friction strategy**: convert the user’s goals and collapse scenarios into a P0 execution system: identity anchor, realistic workload, 2-minute starters, If-Then fallbacks, timeboxes, buffer, and review cadence.
3. **Create phases**: split the duration into phase ranges, choose phase icons, themes, and warm tips. Prefer 7-10 day review loops and make the first phase/light review days deliberately easier. Keep phase ids stable and sequential.
4. **Create daily tasks**: for every day, generate `date`, `phaseId`, `mainTask`, `starterTask`, `elasticTask`, `ifThenPlan`, `estimatedMinutes`, `tip`, and `healthTarget`. Every `mainTask` must be a next physical action with a timebox; every `starterTask` must be completable in 2 minutes; every `ifThenPlan` must bind to a real or default risk scenario.
5. **Apply workload buffer**: if the user reports available time, use only 70%-80% of it; otherwise keep the first week to one main timebox plus one optional elastic task. Mark elastic tasks as optional/允许放弃.
6. **Build APP_DATA**: include `config`, `phases`, `dailyTasks`, `checkins: {}`, and `reviews: {}`. Do not include sample progress. Preserve compatible fields; optional methodology notes may live under `config.user` or copy text, not required schema fields.
7. **Create the HTML**: copy `templates/juanwang-skill.html`, replace only the content between `/*__APP_DATA_START__*/` and `/*__APP_DATA_END__*/` (keep the markers), and write only `juanwang-skill.html`. When injecting `APP_DATA`, escape every `</` inside string values as `<\/` (a goal or note containing `</script>` MUST be written as `<\/script>`) — the initial block is not auto-escaped, and an unescaped `</script>` will close the script block early and break the whole page.
8. **Validate (mandatory gate, do not skip)**: run `node scripts/validate.mjs <path>` and `node scripts/smoke-test.mjs <path>`; both must pass before delivery. If validate reports a `<script>/</script>` mismatch, locate the literal `</` in your `APP_DATA`, escape it to `<\/`, and re-run. Then do the browser render check in `workflows/validate-deliverable.md`: open the file and confirm no raw source text leaks onto the page.
9. **Deliver**: provide the absolute path to `juanwang-skill.html` and tell the user they can double-click it or send it to a phone and open it in a browser.
</process>

<success_criteria>
- User provided a concrete start date.
- Generated HTML contains exactly one initialized plan and no fake checkins.
- The plan includes scenario-bound If-Then plans, 2-minute starters, realistic timeboxes, buffer, and 7-10 day review loops.
- Day 1 and final day dates match duration and start date.
- Only `juanwang-skill.html` is delivered.
</success_criteria>
