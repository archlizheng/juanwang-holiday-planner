#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = process.argv[2] || resolve('templates/juanwang-skill.html');
const html = readFileSync(file, 'utf8');
const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function extractAppData(source) {
  const markerMatch = source.match(/\/\*__APP_DATA_START__\*\/[\s\S]*?const APP_DATA = (\{[\s\S]*?\});[\s\S]*?\/\*__APP_DATA_END__\*\//);
  if (markerMatch) return JSON.parse(markerMatch[1]);
  const legacy = source.match(/const APP_DATA = (\{[\s\S]*?\});\s*(?:const STATE_KEY|\/\*__APP_DATA_END__\*\/)/);
  if (legacy) return JSON.parse(legacy[1]);
  throw new Error('无法解析 APP_DATA');
}

let data;
try {
  data = extractAppData(html);
} catch (err) {
  fail(`APP_DATA 解析失败: ${err.message}`);
  report();
  process.exit(1);
}

// 与 references/safety-and-tone.md 的禁用语保持同步
const banned = [
  '弯道超车', '卷死同学', '同龄人正在抛弃你',
  '变态计划', '邪修', '爆改',
  '震惊', '绝绝子', '刷爆',
  'manifest.json', 'serviceWorker', 'beforeinstallprompt'
];
for (const word of banned) {
  if (html.includes(word)) fail(`包含禁词/禁依赖: ${word}`);
}

const requiredRuntime = [
  'function getTodayDay',
  'function computeStateKey',
  'function sanitizeFileNameBase',
  'function getFileNameBase',
  'starterTask',
  'ifThenPlan',
  'buildSyncedHtml',
  'mergeReviews',
  'checkin-nudge',
  'phase-countdown',
  '/*__APP_DATA_START__*/',
  '/*__APP_DATA_END__*/'
];
for (const token of requiredRuntime) {
  if (!html.includes(token)) fail(`运行时缺少: ${token}`);
}

const moods = ['😄', '🙁', '😝', '😭', '😡'];
for (const mood of moods) {
  if (!html.includes(`data-mood="${mood}"`)) fail(`缺少心情按钮: ${mood}`);
}
const moodMatches = html.match(/data-mood="([^"]+)"/g) || [];
if (moodMatches.length !== 5) fail(`心情按钮数量应为 5，实际 ${moodMatches.length}`);

// HTML 解析层：<script> 与 </script> 必须成对。任何字面 </script>（即便在 JS 注释或字符串里）
// 都会被浏览器解析器当作脚本结束，使后续 JS 暴露成页面文本、页面崩坏。
// 正则提取式的 smoke-test 跑的是 node、不经过 HTML 解析器，发现不了这一点，故在此把守。
const openScripts = (html.match(/<script\b/gi) || []).length;
const closeScripts = (html.match(/<\/script>/gi) || []).length;
if (openScripts !== closeScripts) {
  fail(`<script> 与 </script> 数量不匹配（${openScripts} vs ${closeScripts}）：可能有字面 </script> 提前闭合脚本块，会导致页面渲染崩坏`);
}

if (!data.config?.user?.startDate) fail('缺少 config.user.startDate');
if (!Array.isArray(data.phases) || !data.phases.length) fail('phases 为空');
if (!Array.isArray(data.dailyTasks) || !data.dailyTasks.length) fail('dailyTasks 为空');

const startDate = data.config.user.startDate;
const duration = data.config.user.duration;
if (data.config.output?.fileNameBase != null) {
  validateFileNameBase(data.config.output.fileNameBase);
}
if (data.dailyTasks.length !== duration) {
  warn(`dailyTasks 数量 (${data.dailyTasks.length}) 与 duration (${duration}) 不一致`);
}

for (let i = 0; i < data.dailyTasks.length; i++) {
  const t = data.dailyTasks[i];
  const expectedDay = i + 1;
  if (t.day !== expectedDay) fail(`Day ${expectedDay} 的 day 字段错误: ${t.day}`);
  const expectedDate = addDays(startDate, i);
  if (t.date !== expectedDate) fail(`Day ${expectedDay} 日期应为 ${expectedDate}，实际 ${t.date}`);
  for (const field of ['mainTask', 'starterTask', 'elasticTask', 'ifThenPlan', 'estimatedMinutes', 'tip', 'healthTarget']) {
    if (t[field] == null || t[field] === '') fail(`Day ${expectedDay} 缺少 ${field}`);
  }
  if (!String(t.elasticTask).includes('允许放弃')) fail(`Day ${expectedDay} elasticTask 未标注允许放弃`);
  if (!String(t.ifThenPlan).includes('如果')) fail(`Day ${expectedDay} ifThenPlan 缺少场景绑定`);
}

// 自动区分新计划与同步文件：checkins 非空视为同步文件，校验形状而非报错
const checkinDates = Object.keys(data.checkins || {});
const isSyncedFile = checkinDates.length > 0;
if (isSyncedFile) {
  const validDates = new Set(data.dailyTasks.map((t) => t.date));
  const validMoods = new Set(['😄', '🙁', '😝', '😭', '😡', '']);
  for (const date of checkinDates) {
    const c = data.checkins[date];
    if (!validDates.has(date)) fail(`checkin 日期 ${date} 不在计划范围内`);
    if (c.mood != null && !validMoods.has(c.mood)) fail(`checkin ${date} 的 mood 非法: ${c.mood}`);
    for (const flag of ['mainDone', 'elasticDone', 'starterDone']) {
      if (c[flag] != null && typeof c[flag] !== 'boolean') fail(`checkin ${date} 的 ${flag} 应为布尔值`);
    }
  }
  console.log(`  ℹ 同步文件模式：${checkinDates.length} 天打卡数据`);
}
for (const [id, r] of Object.entries(data.reviews || {})) {
  if (r == null) continue;
  if (!r.text || !r.generatedAt) fail(`review ${id} 缺少 text 或 generatedAt`);
  if (!isSyncedFile) fail(`新计划不应包含 review ${id}`);
}
if (!isSyncedFile && checkinDates.length) fail('新计划模板 checkins 应为空');

for (const phase of data.phases) {
  const days = data.dailyTasks.filter((t) => t.phaseId === phase.id).map((t) => t.day);
  if (!days.length) fail(`阶段 ${phase.id} 没有对应 dailyTasks`);
}

function addDays(iso, offset) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + offset);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function validateFileNameBase(value) {
  if (typeof value !== 'string' || !value.trim()) {
    fail('config.output.fileNameBase 应为非空字符串');
    return;
  }
  if (/\.html$/i.test(value)) fail('config.output.fileNameBase 不应包含 .html 后缀');
  if (/[\/\\:*?"<>|]/.test(value)) fail(`config.output.fileNameBase 含危险文件名字符: ${value}`);
  if (value.length > 80) warn(`config.output.fileNameBase 超过 80 字符: ${value.length}`);
}

function report() {
  if (errors.length) {
    console.error(`❌ 验证失败 (${file})`);
    errors.forEach((e) => console.error(`  - ${e}`));
  } else {
    console.log(`✅ 验证通过 (${file})`);
    console.log(`  - ${data.dailyTasks.length} 天任务，${data.phases.length} 个阶段`);
  }
  if (warnings.length) warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
}

report();
process.exit(errors.length ? 1 : 0);
