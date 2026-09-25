const test = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../assets/exam-engine');
const questions = require('../assets/questions');

test('getTopics returns sorted unique topics', () => {
  assert.deepEqual(engine.getTopics(questions), [
    'Collaboration',
    'GitHub Actions',
    'GitHub Foundations',
    'Security'
  ]);
});

test('shuffle supports deterministic ordering with an injected random function', () => {
  assert.deepEqual(engine.shuffle(['a', 'b', 'c'], () => 0), ['b', 'c', 'a']);
});

test('selectQuestions filters by topic and supports deterministic random selection', () => {
  const selected = engine.selectQuestions(questions, {
    topic: 'Security',
    count: 1,
    randomize: true,
    random: () => 0
  });

  assert.equal(selected.length, 1);
  assert.equal(selected[0].topic, 'Security');
});

test('selectQuestions respects an explicit zero count', () => {
  const selected = engine.selectQuestions(questions, {
    topic: 'Security',
    count: 0,
    randomize: false
  });

  assert.deepEqual(selected, []);
});

test('selectQuestions treats invalid explicit counts as zero', () => {
  const selected = engine.selectQuestions(questions, {
    topic: 'Security',
    count: 'not-a-number',
    randomize: false
  });

  assert.deepEqual(selected, []);
});

test('resolveRequestedCount defaults blank counts and rejects invalid counts', () => {
  assert.equal(engine.resolveRequestedCount('', 6), 6);
  assert.equal(engine.resolveRequestedCount(undefined, 6), 6);
  assert.equal(engine.resolveRequestedCount('3.8', 6), 3);
  assert.equal(engine.resolveRequestedCount('not-a-number', 6), 0);
});

test('scoreExam grades multiple-answer questions independent of answer order', () => {
  const question = questions.find((item) => item.id === 'gh600-001');
  const score = engine.scoreExam([question], {
    [question.id]: ['b', 'a']
  }, 70);

  assert.equal(score.correctCount, 1);
  assert.equal(score.percent, 100);
  assert.equal(score.passed, true);
});

test('scoreExam marks unanswered multiple-choice questions incorrect', () => {
  const question = questions.find((item) => item.id === 'gh600-002');
  const score = engine.scoreExam([question], {}, 70);

  assert.equal(engine.isCorrect(question, undefined), false);
  assert.equal(engine.isCorrect(question, null), false);
  assert.equal(score.correctCount, 0);
  assert.equal(score.percent, 0);
  assert.equal(score.passed, false);
});

test('hasResponse distinguishes unanswered and selected choice questions', () => {
  const question = questions[0];

  assert.equal(engine.hasResponse(question, undefined), false);
  assert.equal(engine.hasResponse(question, []), false);
  assert.equal(engine.hasResponse(question, ['a']), true);
});

test('multiple-choice questions declare whether they allow multiple selections', () => {
  const multipleChoiceQuestions = questions.filter((question) => question.type === 'multiple-choice');

  assert.ok(multipleChoiceQuestions.length > 0);
  multipleChoiceQuestions.forEach((question) => {
    assert.equal(typeof question.multiple, 'boolean');
  });
});

test('scoreExam grades drag-and-drop matches and reports failed attempts', () => {
  const question = questions.find((item) => item.type === 'drag-drop');
  const correctResponse = Object.fromEntries(question.targets.map((target) => [target.id, target.correct]));
  const incorrectResponse = { ...correctResponse, [question.targets[0].id]: 'not-the-answer' };

  assert.equal(engine.isCorrect(question, correctResponse), true);
  assert.equal(engine.isCorrect(question, incorrectResponse), false);

  const score = engine.scoreExam([question], { [question.id]: incorrectResponse }, 70);
  assert.equal(score.passed, false);
  assert.equal(score.percent, 0);
});
