<required_reading>
Read these before writing a phase review:
1. `references/app-data-schema.md`
2. `references/failure-mechanisms.md`
3. `references/planning-methodology.md`
4. `references/safety-and-tone.md`
5. `references/html-runtime-contract.md`
</required_reading>

<process>
1. **Require synced data**: if the user provides an original HTML without `APP_DATA.checkins`, ask them to open the file and use `📦 数据交换 → 同步到 HTML` first.
2. **Parse APP_DATA**: extract JSON with `/const APP_DATA = (\{[\s\S]*?\});/` (between `/*__APP_DATA_START__*/` and `/*__APP_DATA_END__*/` when present) and parse it. Do not invent missing checkins.
3. **Find progress**: use the latest checkin date when checkins exist; otherwise use `selectedDay` if present, or Day 1.
4. **Find reviewable phases**: for each phase, compute end day from `dailyTasks`; skip phases with existing `reviews[phaseId]` unless the user explicitly asks to rewrite.
5. **Analyze friction and small wins**: compute completion, starter/continuity signals when available, health trends, mood/notes, and repeated collapse scenarios. If no checkins exist, state that there is no data and do not generate a fake review.
6. **Write review text**: 200-300 Chinese characters per phase, 4-5 `<p>` paragraphs (literal `<p>...</p>` HTML tags, not escaped entities), with AAR/PDCA content and specific checkin numbers. Each review must name at least one concrete progress signal, one friction source, whether If-Then/starter tasks helped, and 1-2 lower-friction next actions. If completion is low, recommend smaller tasks or fewer side goals before extra discipline.
7. **Write back HTML**: merge new reviews into `APP_DATA.reviews`, preserve checkins and existing reviews, update generated metadata if present, and output a new timestamped HTML.
</process>

<success_criteria>
- Review uses only parsed user data.
- Existing checkins and reviews are preserved.
- No phase is reviewed before its dynamically computed end day.
- Review tone is supportive and non-shaming.
- Review reinforces small wins and gives load-reduction suggestions when friction is high.
</success_criteria>
