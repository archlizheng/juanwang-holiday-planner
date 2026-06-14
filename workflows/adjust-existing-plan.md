<required_reading>
Read these before adjusting a plan:
1. `references/app-data-schema.md`
2. `references/failure-mechanisms.md`
3. `references/planning-methodology.md`
4. `references/safety-and-tone.md`
5. `references/html-runtime-contract.md`
</required_reading>

<process>
1. **Parse the synced HTML**: extract `APP_DATA`, `checkins`, selected day, and reviews. If localStorage data is missing, ask the user to sync to HTML first.
2. **Identify history boundary**: treat days with checkins as history. Do not alter those daily tasks unless the user explicitly asks for a historical correction.
3. **Diagnose load and friction**: use completion, health, notes, and the user's stated issue to identify failed mechanisms: intention-behavior gap, emotion avoidance, goal-action mismatch, planning fallacy, or completion shame.
4. **Choose the lowest-friction fix**: prefer smaller main tasks, clearer 2-minute starters, stronger scenario-bound If-Then plans, more buffer, fewer side goals, or lighter review days before changing the goal itself.
5. **Adjust only future tasks**: preserve day numbers, dates, phase ids where possible, checkins, and reviews. Keep the main goal prioritized.
6. **Write back HTML**: replace `APP_DATA` with the adjusted future tasks and preserved history.
7. **Validate**: confirm no historical checkins/reviews were dropped and the HTML still passes deliverable validation.
</process>

<success_criteria>
- Past completed/check-in days remain unchanged.
- Future tasks are more executable, lower-friction, and not punitive.
- Adjustments preserve or improve daily 2-minute starters, If-Then plans, timeboxes, and buffer.
- Health downturns produce lower load, not higher pressure.
- The adjusted HTML remains a single file with preserved data.
</success_criteria>
