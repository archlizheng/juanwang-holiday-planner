#!/usr/bin/env node
/**
 * Logic-layer smoke tests. Extracts the REAL function source from the template
 * HTML and runs it in a vm with a mocked clock, so tests fail if template code breaks.
 *
 * Test data is SYNTHETIC (fixed 7-day plan starting 2026-06-09) and independent
 * of the template's embedded sample APP_DATA — the sample plan can be replaced
 * freely without breaking these tests.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { resolve } from 'node:path';

const file = process.argv[2] || resolve('templates/juanwang-skill.html');
const html = readFileSync(file, 'utf8');
const errors = [];

function fail(msg) {
  errors.push(msg);
}

// 仅校验边界块存在；测试数据用下方合成计划，不依赖模板内嵌示例
const appMatch = html.match(/\/\*__APP_DATA_START__\*\/[\s\S]*?const APP_DATA = (\{[\s\S]*?\});[\s\S]*?\/\*__APP_DATA_END__\*\//);
if (!appMatch) {
  console.error('❌ 找不到 APP_DATA 边界块');
  process.exit(1);
}
try {
  JSON.parse(appMatch[1]);
} catch (err) {
  console.error('❌ 模板内嵌 APP_DATA 不是合法 JSON: ' + err.message);
  process.exit(1);
}

function addDays(iso, offset) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + offset);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

const START = '2026-06-09';
const APP_DATA = {
  config: {
    output: { fileNameBase: 'juanwang-测试-测试目标-2026-06-09' },
    user: { name: '测试', duration: 7, mainGoal: { subGoal: '测试目标', specific: '测试目标' }, startDate: START }
  },
  phases: [{ id: 1, title: '适应期', icon: 'sprout', range: 'Day 1-7', theme: '测试', tip: '测试' }],
  dailyTasks: Array.from({ length: 7 }, function (_, i) {
    return {
      day: i + 1,
      date: addDays(START, i),
      phaseId: 1,
      mainTask: '主线任务',
      starterTask: '启动版',
      elasticTask: '弹性任务（允许放弃）',
      ifThenPlan: '如果状态差，就只做启动版。',
      estimatedMinutes: 30,
      tip: '提示',
      healthTarget: { steps: 6000, sleepTarget: '23:30 前入睡', waterCups: 8, exerciseMinutes: 20 }
    };
  }),
  checkins: {},
  reviews: {}
};

// 从模板中提取真实函数源码（函数体以顶格 "}" 结束）
const FUNC_NAMES = [
  'parseLocalDate', 'getPlanDays', 'getTodayDay', 'getLatestCheckinDay',
  'getProgressDay', 'getSelectedDay', 'getTaskByDay', 'getPhaseEndDay',
  'sanitizeFileNameBase', 'getDisplayName', 'getGoalFileKeyword', 'getFileNameBase',
  'isCheckinActive', 'mergeReviews', 'initSelectedDay',
  'calcCurrentStreak', 'calcLongestStreak', 'countConsecutiveMissedBefore'
];
const extracted = [];
for (const name of FUNC_NAMES) {
  const re = new RegExp('function ' + name + '\\([^)]*\\) \\{[\\s\\S]*?\\n\\}', 'm');
  const m = html.match(re);
  if (!m) {
    fail(`模板缺少函数: ${name}`);
    continue;
  }
  extracted.push(m[0]);
}
if (errors.length) {
  console.error('❌ 冒烟测试失败');
  errors.forEach((e) => console.error('  -', e));
  process.exit(1);
}

function makeContext(fixedNowISO, checkins, appData = APP_DATA) {
  const ctx = createContext({});
  const setup = `
const __FIXED_NOW__ = ${JSON.stringify(fixedNowISO)};
const RealDate = Date;
Date = class extends RealDate {
  constructor(...args) {
    if (args.length === 0) { super(__FIXED_NOW__); } else { super(...args); }
  }
};
const APP_DATA = ${JSON.stringify(appData)};
let state = { checkins: ${JSON.stringify(checkins)}, selectedDay: 1, reviews: {} };
${extracted.join('\n')}
`;
  runInContext(setup, ctx);
  return ctx;
}

// Test 1: 开始当天 = Day 1
{
  const ctx = makeContext('2026-06-09T10:00:00', {});
  const d = runInContext('getTodayDay()', ctx);
  if (d !== 1) fail(`startDate 当天应为 Day 1，实际 Day ${d}`);
}

// Test 2: 第 4 天日期映射
{
  const ctx = makeContext('2026-06-12T10:00:00', {});
  const d = runInContext('getTodayDay()', ctx);
  if (d !== 4) fail(`2026-06-12 应为 Day 4，实际 Day ${d}`);
}

// Test 3: 漏打 Day1，打 Day2-3 → 连签 2（从今天往回数）
{
  const ctx = makeContext('2026-06-11T20:00:00', {
    '2026-06-10': { starterDone: true },
    '2026-06-11': { mainDone: true }
  });
  const s = runInContext('calcCurrentStreak()', ctx);
  if (s !== 2) fail(`漏 Day1 后 Day2-3 连签应为 2，实际 ${s}`);
}

// Test 4: 仅 starterDone 也算连签
{
  const ctx = makeContext('2026-06-09T20:00:00', { '2026-06-09': { starterDone: true } });
  const s = runInContext('calcCurrentStreak()', ctx);
  if (s !== 1) fail(`仅 starterDone 连签应为 1，实际 ${s}`);
}

// Test 5: mergeReviews — localStorage 空 reviews 不覆盖 Agent 写回
{
  const ctx = makeContext('2026-06-09T10:00:00', {});
  const merged = runInContext(
    `mergeReviews({ '1': { text: '<p>agent</p>', generatedAt: '2026-06-15T12:00:00' } }, { '1': null })`,
    ctx
  );
  if (!merged['1'] || merged['1'].text !== '<p>agent</p>') fail('Agent 写回的 reviews 被空 localStorage 覆盖');
}

// Test 6: mergeReviews — 较新的本地复盘优先
{
  const ctx = makeContext('2026-06-09T10:00:00', {});
  const merged = runInContext(
    `mergeReviews({ '1': { text: '<p>old</p>', generatedAt: '2026-06-10T12:00:00' } }, { '1': { text: '<p>newer</p>', generatedAt: '2026-06-16T12:00:00' } })`,
    ctx
  );
  if (merged['1'].text !== '<p>newer</p>') fail('mergeReviews 未按 generatedAt 取较新者');
}

// Test 7: 阶段结束日动态计算
{
  const ctx = makeContext('2026-06-09T10:00:00', {});
  const endDay = runInContext('getPhaseEndDay(1)', ctx);
  if (endDay !== APP_DATA.dailyTasks.length) fail(`阶段 1 结束日应为 ${APP_DATA.dailyTasks.length}，实际 ${endDay}`);
}

// Test 8: progress day 由今天与最新打卡共同驱动（手动切日不影响）
{
  const ctx = makeContext('2026-06-10T10:00:00', { '2026-06-12': { mainDone: true } });
  const p = runInContext('state.selectedDay = 7; getProgressDay()', ctx);
  if (p !== 4) fail(`progressDay 应为 max(today=2, checkin=4)=4，实际 ${p}`);
}

// Test 9: 过期 selectedDay 自动跳到今天
{
  const ctx = makeContext('2026-06-12T10:00:00', {});
  const d = runInContext('initSelectedDay(1)', ctx);
  if (d !== 4) fail(`stored Day 1 < today Day 4 应跳到 4，实际 ${d}`);
}

// Test 10: 连续 3 天未打卡检测
{
  const ctx = makeContext('2026-06-12T10:00:00', {});
  const missed = runInContext('countConsecutiveMissedBefore(4)', ctx);
  if (missed !== 3) fail(`Day 4 前应有 3 天未打卡，实际 ${missed}`);
}

// Test 11: config.output.fileNameBase 优先，且去掉危险字符和重复后缀
{
  const appData = structuredClone(APP_DATA);
  appData.config.output.fileNameBase = '暑假/英语:计划.html';
  const ctx = makeContext('2026-06-09T10:00:00', {}, appData);
  const name = runInContext('getFileNameBase()', ctx);
  if (name !== '暑假-英语-计划') fail(`fileNameBase 安全化失败，实际 ${name}`);
}

// Test 12: 旧 HTML 没有 config.output 时自动 fallback
{
  const appData = structuredClone(APP_DATA);
  delete appData.config.output;
  const ctx = makeContext('2026-06-09T10:00:00', {}, appData);
  const name = runInContext('getFileNameBase()', ctx);
  if (name !== 'juanwang-测试-测试目标-2026-06-09') fail(`旧数据 fallback 文件名错误，实际 ${name}`);
}

if (errors.length) {
  console.error('❌ 冒烟测试失败');
  errors.forEach((e) => console.error('  -', e));
  process.exit(1);
}
console.log('✅ 冒烟测试通过（12 项，运行模板真实函数源码 + 合成测试数据）');
