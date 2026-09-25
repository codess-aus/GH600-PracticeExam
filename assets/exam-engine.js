(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ExamEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalize(values) {
    return Array.isArray(values) ? values.map(String).sort() : [];
  }

  function shuffle(items, random) {
    var source = items.slice();
    var rng = typeof random === 'function' ? random : Math.random;
    for (var index = source.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(rng() * (index + 1));
      var value = source[index];
      source[index] = source[swapIndex];
      source[swapIndex] = value;
    }
    return source;
  }

  function getTopics(questions) {
    return Array.from(new Set(questions.map(function (question) {
      return question.topic;
    }))).sort();
  }

  function selectQuestions(questions, options) {
    var settings = options || {};
    var filtered = questions.filter(function (question) {
      return settings.topic === 'all' || !settings.topic || question.topic === settings.topic;
    });
    var ordered = settings.randomize ? shuffle(filtered, settings.random) : filtered.slice();
    var requestedCount = Number(settings.count) || ordered.length;
    return ordered.slice(0, Math.max(1, Math.min(requestedCount, ordered.length)));
  }

  function isCorrect(question, response) {
    if (question.type === 'drag-drop') {
      return question.targets.every(function (target) {
        return response && response[target.id] === target.correct;
      });
    }

    return JSON.stringify(normalize(response)) === JSON.stringify(normalize(question.correctAnswers));
  }

  function scoreExam(questions, responses, passingPercent) {
    var results = questions.map(function (question) {
      return {
        id: question.id,
        correct: isCorrect(question, responses[question.id])
      };
    });
    var correctCount = results.filter(function (result) {
      return result.correct;
    }).length;
    var percent = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);

    return {
      correctCount: correctCount,
      total: questions.length,
      percent: percent,
      passed: percent >= (passingPercent || 70),
      results: results
    };
  }

  return {
    getTopics: getTopics,
    isCorrect: isCorrect,
    scoreExam: scoreExam,
    selectQuestions: selectQuestions,
    shuffle: shuffle
  };
});
