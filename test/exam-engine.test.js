const test = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../assets/exam-engine');
const questions = require('../assets/questions');

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

test('scoreExam grades multiple-answer questions independent of answer order', () => {
  const question = questions.find((item) => item.id === 'gh600-001');
  const score = engine.scoreExam([question], {
    [question.id]: ['b', 'a']
  }, 70);

  assert.equal(score.correctCount, 1);
  assert.equal(score.percent, 100);
  assert.equal(score.passed, true);
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
