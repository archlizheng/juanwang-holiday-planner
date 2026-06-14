<html_runtime_contract>
The HTML template must remain a self-contained browser file.

**Must not contain**:
- `<link rel="manifest" href="manifest.json">`
- `navigator.serviceWorker.register(...)`
- `beforeinstallprompt` install banner logic
- hardcoded Day 8 default selection
- fake `checkins` in new-plan `APP_DATA`
- hardcoded phase review end days such as Day 7/15/23/30 in runtime logic

**Must contain**:
- `/*__APP_DATA_START__*/` … `/*__APP_DATA_END__*/` boundary markers around `const APP_DATA = ...;`
- `const STATE_KEY = computeStateKey();` with per-plan fingerprint (`startDate` + goal hash)
- data exchange UI for export JSON, sync to HTML, and import JSON (sync must work on `file://` without fetch)
- check-in UI renders `starterTask` (stores `starterDone`) and `ifThenPlan`
- mood buttons for exactly `😄`, `🙁`, `😝`, `😭`, `😡`
- `getTodayDay()` auto-aligns selected day; phase review readiness uses progress day, not manual selected day
- dynamic calculations for streak (backwards from today; starter counts), completion rates, dashboard stats, calendar title, phase countdown, and phase review readiness

**Validation scenarios**:
- A new 60-day plan starting `2026-07-01` yields Day 1 = `2026-07-01` and Day 60 = `2026-08-29`
- Initial dashboard displays 0 streak, 0 check-in days, 0.0% completion, and “暂无数据” for mood summary
- Saving Day 1 main task changes streak to 1 and completion rate to 100.0% when it is the only checkin
- Setting selectedDay to the last day of a phase makes exactly that phase review ready
</html_runtime_contract>
