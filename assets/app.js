(function () {
  'use strict';

  var PASSING_PERCENT = 70;
  var DEFAULT_MINUTES = 90;
  var DEFAULT_QUESTION_COUNT = 10;
  var questions = window.GH600_QUESTIONS;
  var engine = window.ExamEngine;
  var state = {
    activeQuestions: [],
    currentIndex: 0,
    responses: {},
    timerId: null,
    remainingSeconds: 0,
    finished: false
  };

  var els = {
    setup: document.querySelector('[data-screen="setup"]'),
    exam: document.querySelector('[data-screen="exam"]'),
    results: document.querySelector('[data-screen="results"]'),
    topic: document.getElementById('topic'),
    count: document.getElementById('count'),
    mode: document.getElementById('mode'),
    timedOption: document.getElementById('timed-option'),
    randomize: document.getElementById('randomize'),
    start: document.getElementById('start-exam'),
    restart: document.getElementById('restart-exam'),
    questionCard: document.getElementById('question-card'),
    questionProgress: document.getElementById('question-progress'),
    timer: document.getElementById('timer'),
    prev: document.getElementById('prev-question'),
    next: document.getElementById('next-question'),
    finish: document.getElementById('finish-exam'),
    score: document.getElementById('score'),
    passFail: document.getElementById('pass-fail'),
    review: document.getElementById('review'),
    encouragement: document.getElementById('encouragement')
  };

  function showScreen(name) {
    [els.setup, els.exam, els.results].forEach(function (screen) {
      screen.hidden = screen.dataset.screen !== name;
    });
  }

  function initSetup() {
    els.timedOption.textContent = 'Timed exam (' + DEFAULT_MINUTES + ' minutes)';
    engine.getTopics(questions).forEach(function (topic) {
      var option = document.createElement('option');
      option.value = topic;
      option.textContent = topic;
      els.topic.appendChild(option);
    });
    els.count.max = questions.length;
    els.count.value = Math.min(DEFAULT_QUESTION_COUNT, questions.length);
  }

  function startTimer() {
    window.clearInterval(state.timerId);
    if (els.mode.value !== 'timed') {
      els.timer.textContent = 'Untimed practice';
      return;
    }

    state.remainingSeconds = DEFAULT_MINUTES * 60;
    updateTimerLabel();
    state.timerId = window.setInterval(function () {
      state.remainingSeconds -= 1;
      updateTimerLabel();
      if (state.remainingSeconds <= 0) {
        finishExam();
      }
    }, 1000);
  }

  function updateTimerLabel() {
    var minutes = Math.floor(state.remainingSeconds / 60);
    var seconds = String(state.remainingSeconds % 60).padStart(2, '0');
    els.timer.textContent = minutes + ':' + seconds + ' remaining';
  }

  function startExam() {
    state.activeQuestions = engine.selectQuestions(questions, {
      topic: els.topic.value,
      count: els.count.value,
      randomize: els.randomize.checked
    });
    state.currentIndex = 0;
    state.responses = {};
    state.finished = false;
    showScreen('exam');
    startTimer();
    renderQuestion();
  }

  function renderQuestion() {
    var question = state.activeQuestions[state.currentIndex];
    els.questionProgress.textContent = 'Question ' + (state.currentIndex + 1) + ' of ' + state.activeQuestions.length;
    els.questionCard.innerHTML = '';

    var topic = document.createElement('p');
    topic.className = 'eyebrow';
    topic.textContent = question.topic + ' · ' + (question.type === 'drag-drop' ? 'Drag and drop' : 'Multiple choice');

    var heading = document.createElement('h2');
    heading.textContent = question.prompt;

    els.questionCard.append(topic, heading);

    if (question.type === 'drag-drop') {
      renderDragDrop(question);
    } else {
      renderMultipleChoice(question);
    }

    els.prev.disabled = state.currentIndex === 0;
    els.next.disabled = state.currentIndex === state.activeQuestions.length - 1;
  }

  function renderMultipleChoice(question) {
    if (question.type !== 'multiple-choice') {
      return;
    }

    var fieldset = document.createElement('fieldset');
    var legend = document.createElement('legend');
    var isMulti = question.multiple === true;
    if (!Array.isArray(state.responses[question.id])) {
      state.responses[question.id] = [];
    }
    var selectedAnswers = state.responses[question.id];
    legend.textContent = isMulti ? 'Choose all that apply.' : 'Choose one answer.';
    fieldset.appendChild(legend);

    question.choices.forEach(function (choice) {
      var label = document.createElement('label');
      label.className = 'choice';
      var input = document.createElement('input');
      input.type = isMulti ? 'checkbox' : 'radio';
      input.name = question.id;
      input.value = choice.id;
      input.checked = selectedAnswers.indexOf(choice.id) !== -1;
      input.addEventListener('change', function () {
        if (isMulti) {
          state.responses[question.id] = Array.from(fieldset.querySelectorAll('input:checked')).map(function (selected) {
            return selected.value;
          });
        } else {
          state.responses[question.id] = [input.value];
        }
      });
      label.append(input, document.createTextNode(choice.text));
      fieldset.appendChild(label);
    });

    els.questionCard.appendChild(fieldset);
  }

  function renderDragDrop(question) {
    var instructions = document.createElement('p');
    instructions.className = 'muted';
    instructions.textContent = 'Drag each item to a matching target, or use the dropdowns for keyboard-friendly selection.';
    var board = document.createElement('div');
    board.className = 'drag-board';
    var tray = document.createElement('div');
    tray.className = 'drag-tray';
    tray.setAttribute('aria-label', 'Draggable options');

    question.options.forEach(function (option) {
      var token = document.createElement('button');
      token.type = 'button';
      token.className = 'drag-token';
      token.draggable = true;
      token.dataset.optionId = option.id;
      token.textContent = option.text;
      token.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', option.id);
      });
      tray.appendChild(token);
    });

    var targets = document.createElement('div');
    targets.className = 'drop-targets';
    question.targets.forEach(function (target) {
      var wrapper = document.createElement('label');
      wrapper.className = 'drop-target';
      wrapper.dataset.targetId = target.id;
      wrapper.addEventListener('dragover', function (event) {
        event.preventDefault();
      });
      wrapper.addEventListener('drop', function (event) {
        event.preventDefault();
        setDragResponse(question, target.id, event.dataTransfer.getData('text/plain'));
        renderQuestion();
      });

      var span = document.createElement('span');
      span.textContent = target.label;
      var select = document.createElement('select');
      select.dataset.targetId = target.id;
      select.innerHTML = '<option value="">Select a match</option>';
      question.options.forEach(function (option) {
        var optionEl = document.createElement('option');
        optionEl.value = option.id;
        optionEl.textContent = option.text;
        select.appendChild(optionEl);
      });
      select.value = (state.responses[question.id] || {})[target.id] || '';
      select.addEventListener('change', function () {
        setDragResponse(question, target.id, select.value);
      });

      wrapper.append(span, select);
      targets.appendChild(wrapper);
    });

    board.append(tray, targets);
    els.questionCard.append(instructions, board);
  }

  function setDragResponse(question, targetId, optionId) {
    var response = Object.assign({}, state.responses[question.id] || {});
    Object.keys(response).forEach(function (key) {
      if (response[key] === optionId) {
        delete response[key];
      }
    });
    if (optionId) {
      response[targetId] = optionId;
    } else {
      delete response[targetId];
    }
    state.responses[question.id] = response;
  }

  function finishExam() {
    if (state.finished) {
      return;
    }
    state.finished = true;
    window.clearInterval(state.timerId);
    var score = engine.scoreExam(state.activeQuestions, state.responses, PASSING_PERCENT);
    renderResults(score);
    showScreen('results');
  }

  function renderResults(score) {
    els.score.textContent = score.percent + '%';
    els.passFail.textContent = score.passed ? 'Passed' : 'Not passed yet';
    els.passFail.className = score.passed ? 'badge success' : 'badge attention';
    els.encouragement.textContent = score.passed
      ? 'Great work — review the explanations below to reinforce your strengths before exam day.'
      : 'Keep going. Use the explanations below to focus your next practice session and try again when ready.';
    els.review.innerHTML = '';

    state.activeQuestions.forEach(function (question, index) {
      var result = score.results.find(function (item) {
        return item.id === question.id;
      });
      var article = document.createElement('article');
      article.className = 'review-card';
      var title = document.createElement('h3');
      title.textContent = (index + 1) + '. ' + question.prompt;
      var outcome = document.createElement('p');
      outcome.className = result.correct ? 'correct' : 'incorrect';
      outcome.textContent = result.correct ? 'Correct' : 'Review this topic';
      var explanation = document.createElement('p');
      explanation.textContent = question.explanation;
      article.append(title, outcome, explanation);
      els.review.appendChild(article);
    });
  }

  els.start.addEventListener('click', startExam);
  els.restart.addEventListener('click', function () {
    showScreen('setup');
  });
  els.prev.addEventListener('click', function () {
    state.currentIndex -= 1;
    renderQuestion();
  });
  els.next.addEventListener('click', function () {
    state.currentIndex += 1;
    renderQuestion();
  });
  els.finish.addEventListener('click', finishExam);

  initSetup();
})();
