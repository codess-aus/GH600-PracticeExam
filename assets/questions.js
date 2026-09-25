(function (root, factory) {
  var questions = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = questions;
  } else {
    root.GH600_QUESTIONS = questions;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return [
    {
      id: 'gh600-001',
      topic: 'GitHub Foundations',
      type: 'multiple-choice',
      prompt: 'Which features help teams keep protected branches stable before changes are merged?',
      choices: [
        { id: 'a', text: 'Required pull request reviews' },
        { id: 'b', text: 'Required status checks' },
        { id: 'c', text: 'Unlimited force pushes to the default branch' },
        { id: 'd', text: 'Ignoring CODEOWNERS review requests' }
      ],
      correctAnswers: ['a', 'b'],
      explanation: 'Branch protection rules commonly require reviews and passing checks before merge. Force pushes and ignored ownership checks undermine that protection.'
    },
    {
      id: 'gh600-002',
      topic: 'GitHub Actions',
      type: 'multiple-choice',
      prompt: 'A workflow should run whenever a pull request targets the main branch. Which event is most appropriate?',
      choices: [
        { id: 'a', text: 'pull_request' },
        { id: 'b', text: 'release' },
        { id: 'c', text: 'fork' },
        { id: 'd', text: 'watch' }
      ],
      correctAnswers: ['a'],
      explanation: 'The pull_request event is designed for workflows that validate proposed changes before they are merged.'
    },
    {
      id: 'gh600-003',
      topic: 'Security',
      type: 'multiple-choice',
      prompt: 'Which GitHub features can help find vulnerable dependencies or exposed credentials?',
      choices: [
        { id: 'a', text: 'Dependabot alerts' },
        { id: 'b', text: 'Secret scanning' },
        { id: 'c', text: 'Repository insights traffic graphs only' },
        { id: 'd', text: 'Pinned issue templates only' }
      ],
      correctAnswers: ['a', 'b'],
      explanation: 'Dependabot alerts report known vulnerable dependencies. Secret scanning detects supported secrets committed to a repository.'
    },
    {
      id: 'gh600-004',
      topic: 'Collaboration',
      type: 'multiple-choice',
      prompt: 'What is the main purpose of a CODEOWNERS file?',
      choices: [
        { id: 'a', text: 'Automatically request reviews from owners of changed files' },
        { id: 'b', text: 'Encrypt repository files' },
        { id: 'c', text: 'Replace all branch protection rules' },
        { id: 'd', text: 'Disable pull request discussions' }
      ],
      correctAnswers: ['a'],
      explanation: 'CODEOWNERS maps paths to owners so GitHub can request relevant reviewers when matching files change.'
    },
    {
      id: 'gh600-005',
      topic: 'GitHub Actions',
      type: 'drag-drop',
      prompt: 'Match each Actions concept to its role.',
      options: [
        { id: 'workflow', text: 'Workflow' },
        { id: 'job', text: 'Job' },
        { id: 'step', text: 'Step' }
      ],
      targets: [
        { id: 'definition-1', label: 'Automated process defined by a YAML file', correct: 'workflow' },
        { id: 'definition-2', label: 'Set of steps that runs on the same runner', correct: 'job' },
        { id: 'definition-3', label: 'Individual command or action inside a job', correct: 'step' }
      ],
      explanation: 'A workflow contains jobs, and each job contains ordered steps that run commands or actions.'
    },
    {
      id: 'gh600-006',
      topic: 'Security',
      type: 'drag-drop',
      prompt: 'Match each security control with the risk it reduces.',
      options: [
        { id: 'least-privilege', text: 'Least-privilege permissions' },
        { id: 'codeql', text: 'CodeQL code scanning' },
        { id: 'reviews', text: 'Required peer review' }
      ],
      targets: [
        { id: 'risk-1', label: 'A workflow token has broader access than it needs', correct: 'least-privilege' },
        { id: 'risk-2', label: 'A code pattern may introduce a vulnerability', correct: 'codeql' },
        { id: 'risk-3', label: 'A risky change is merged without another person checking it', correct: 'reviews' }
      ],
      explanation: 'Permissions, scanning, and reviews address different parts of secure software delivery.'
    }
  ];
});
