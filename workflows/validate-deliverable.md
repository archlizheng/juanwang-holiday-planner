<required_reading>
Read these before validation:
1. `references/app-data-schema.md`
2. `references/failure-mechanisms.md`
3. `references/planning-methodology.md`
4. `references/html-runtime-contract.md`
</required_reading>

<process>
1. **Run validation scripts**: `node scripts/validate.mjs <html>` (static invariants) and `node scripts/smoke-test.mjs <html>` (runs real template logic: today mapping, streak, review merge, progress day). Run both on the template and on any generated `juanwang-skill.html`. Fix all reported errors before delivery.
2. **Check package shape**: market package should have `SKILL.md`, `workflows/`, `references/`, `scripts/` (`validate.mjs` + `smoke-test.mjs`), and `templates/juanwang-skill.html`. Do not include zip, preview image, QR code, manifest, or service worker as delivery assets.
3. **Check SKILL.md**: frontmatter `name` is lowercase and matches the skill folder name; description says when to use it; body uses XML tags and no markdown headings; routed files exist; `SKILL.md` stays under 500 lines.
4. **Browser smoke test (required before delivery)**: actually open the generated HTML in a browser (or headless Chrome with `--virtual-time-budget` so the fadeIn animation settles), and confirm:
   - the page renders fully with NO raw JS/source text leaking onto the page — a literal `</script>` anywhere in the script block (even inside a JS comment or string) closes the script early and breaks the whole page; `validate.mjs` guards this by checking `<script>`/`</script>` stay balanced
   - new plan opens on today (not a stale selected day), 0 streak, 0% completion
   - starter-only check-in counts toward streak
   - manual jump to Day 30 does not mark all phases ready for review
   - sync-to-HTML download works without fetch (including `file://`)
   - embedded `APP_DATA.reviews` survives when localStorage reviews are empty
</process>

<success_criteria>
- All package, schema, runtime, behavior, and low-friction methodology checks pass.
- Any failure includes the exact file and invariant to fix.
</success_criteria>
