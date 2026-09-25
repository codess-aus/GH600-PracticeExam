/*
 * GH-600 Practice Exam question bank
 *
 * UMD-style wrapper: exports via module.exports under Node (for tests)
 * and attaches to globalThis.GH600_QUESTIONS in the browser.
 *
 * Question shape (multiple-choice):
 *   id             Unique id, "gh600-d<domain>-<number>"
 *   topic          Exam domain label, used for grouping and filtering
 *   type           "multiple-choice" or "drag-drop"
 *   multiple       true if more than one answer is correct
 *   prompt         The question text
 *   choices        Array of { id, text }
 *   correctAnswers Array of correct choice ids
 *   explanation    Why the right answer is right, why the others are wrong, plus a Spark fact
 *   choiceExplanations  Object keyed by choice id, explaining why that specific choice
 *                       is correct or incorrect (shown per-choice on the review screen)
 *   spark          Optional bonus fact shown once alongside the per-choice breakdown
 *
 * Note: answer positions are deliberately spread across a to d so the
 * letter never gives the answer away.
 */
(function (root, factory) {
  var questions = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = questions;
  } else {
    root.GH600_QUESTIONS = questions;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Shared domain label so every Domain 1 question groups together
  var D1 = 'Domain 1: Prepare agent architecture and SDLC processes';

  return [
    // ---------------------------------------------------------------
    // Domain 1: Prepare agent architecture and SDLC processes (15-20%)
    // ---------------------------------------------------------------
    {
      id: 'gh600-d1-001',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: "A team wants Copilot's coding agent to follow repo-wide conventions (test framework, naming, build commands) on every task, with no need to repeat them in each issue. Where should they put this guidance?",
      choices: [
        { id: 'a', text: '.github/copilot-instructions.md' },
        { id: 'b', text: '.github/prompts/conventions.prompt.md' },
        { id: 'c', text: 'A pinned issue labelled "copilot"' },
        { id: 'd', text: '.github/workflows/copilot-setup-steps.yml' }
      ],
      correctAnswers: ['a'],
      explanation: "copilot-instructions.md is the repo-wide instructions file that Copilot applies automatically. A prompt file only runs when someone invokes it. Issues are not loaded as standing context. The setup-steps workflow prepares the environment, it does not hold guidance. Spark: Copilot also reads AGENTS.md files, a cross-tool convention shared with other coding agents.",
      choiceExplanations: {
        a: "copilot-instructions.md is the repo-wide instructions file Copilot loads automatically for every task, so this convention only needs to be written once.",
        b: "A prompt file only runs when a developer explicitly invokes it, so it will not apply automatically to every task.",
        c: "Issues are not loaded as standing context for the agent, so conventions placed there will not be applied to future work.",
        d: "The setup-steps workflow prepares the agent's environment (installing tools and dependencies); it is not a place to store coding conventions."
      },
      spark: "Copilot also reads AGENTS.md files, a cross-tool convention shared with other coding agents."
    },
    {
      id: 'gh600-d1-002',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'A developer wants TypeScript rules that apply only to files under src/frontend/**. Which approach is correct?',
      choices: [
        { id: 'a', text: 'Add a section headed "## Frontend" to copilot-instructions.md' },
        { id: 'b', text: 'Create src/frontend/.copilotignore' },
        { id: 'c', text: 'Create a prompt file with "mode: frontend"' },
        { id: 'd', text: 'Create .github/instructions/frontend.instructions.md with applyTo: "src/frontend/**" frontmatter' }
      ],
      correctAnswers: ['d'],
      explanation: "Path-specific instruction files use applyTo glob frontmatter to target certain files. A heading inside copilot-instructions.md gives no scoping, so the rules still apply everywhere. .copilotignore is not the mechanism for scoped rules. Prompt files are for on-demand tasks, not scoped rules. Spark: scoped rules keep the context window lean, so the model only sees what matters for the file in hand.",
      choiceExplanations: {
        a: "A heading inside copilot-instructions.md gives no scoping, so the rules there still apply everywhere, not just to src/frontend/**.",
        b: ".copilotignore controls what Copilot can see, it is not the mechanism for applying scoped rules.",
        c: "Prompt files are invoked on demand for a specific task; they are not automatically scoped to a path.",
        d: "Instructions files with applyTo glob frontmatter (for example src/frontend/**) are exactly the mechanism for path-scoped rules."
      },
      spark: "Scoped rules keep the context window lean, so the model only sees what matters for the file in hand."
    },
    {
      id: 'gh600-d1-003',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: "The coding agent keeps failing because it can't install a private package before running tests. What is the most appropriate fix?",
      choices: [
        { id: 'a', text: 'Add install steps to the issue description' },
        { id: 'b', text: 'Add the package name to copilot-instructions.md' },
        { id: 'c', text: 'Define a copilot-setup-steps job in .github/workflows/copilot-setup-steps.yml' },
        { id: 'd', text: "Increase the agent's model temperature" }
      ],
      correctAnswers: ['c'],
      explanation: "The setup-steps workflow preinstalls dependencies in the agent's ephemeral GitHub Actions environment before it starts work. Text in an issue or instructions file cannot give the agent credentials or preinstalled packages. Temperature affects output randomness, not dependency installation. Spark: the agent's environment is built fresh for each task, so anything it needs must be reproducible.",
      choiceExplanations: {
        a: "Install steps written in an issue description are just text to the agent, they cannot install a private package before tests run.",
        b: "Adding the package name to copilot-instructions.md is still just text; the agent has no way to fetch or install it from an instructions file.",
        c: "The setup-steps workflow preinstalls dependencies in the agent's ephemeral GitHub Actions environment before it starts work.",
        d: "Temperature affects output randomness, not dependency installation."
      },
      spark: "The agent's environment is built fresh for each task, so anything it needs must be reproducible."
    },
    {
      id: 'gh600-d1-004',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'In copilot-setup-steps.yml, what must be true for Copilot to pick up the setup?',
      choices: [
        { id: 'a', text: 'The job must be named copilot-setup-steps' },
        { id: 'b', text: 'The workflow must trigger on pull_request' },
        { id: 'c', text: 'The file must sit in .github/agents/' },
        { id: 'd', text: 'It must use a self-hosted runner' }
      ],
      correctAnswers: ['a'],
      explanation: "Copilot looks for a job with exactly the name copilot-setup-steps in .github/workflows/copilot-setup-steps.yml. The trigger event is not what Copilot checks for. .github/agents/ holds custom agent profiles, not workflows. Self-hosted runners are optional. Spark: adding a workflow_dispatch trigger lets you run the setup by hand and test it before the agent ever uses it.",
      choiceExplanations: {
        a: "Copilot looks for a job with exactly the name copilot-setup-steps in .github/workflows/copilot-setup-steps.yml.",
        b: "The trigger event is not what Copilot checks for when deciding whether to run the setup workflow.",
        c: ".github/agents/ holds custom agent profiles, not the setup workflow.",
        d: "A self-hosted runner is optional, it is not a requirement for the setup workflow to be recognized."
      },
      spark: "Adding a workflow_dispatch trigger lets you run the setup by hand and test it before the agent ever uses it."
    },
    {
      id: 'gh600-d1-005',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'Which statement best describes the agent loop that underpins Copilot agent mode and the coding agent?',
      choices: [
        { id: 'a', text: 'A single prompt produces a complete answer with no feedback' },
        { id: 'b', text: 'The agent runs only predefined scripts in sequence' },
        { id: 'c', text: 'The agent trains its model weights on the repository before acting' },
        { id: 'd', text: 'The agent plans, takes an action with a tool, observes the result, and repeats until the goal is met' }
      ],
      correctAnswers: ['d'],
      explanation: "Agents work in a loop: reason, act, observe, then reason again. A single reply with no feedback is plain chat. Running fixed scripts is automation, not an agent. Agents do not retrain model weights per task. Spark: this is the ReAct pattern (Reason + Act), from a 2022 research paper.",
      choiceExplanations: {
        a: "A single reply with no feedback is plain chat, not an agent loop.",
        b: "Running fixed scripts in sequence is automation, not an agent that reasons between steps.",
        c: "Agents do not retrain model weights per task.",
        d: "The agent plans, takes an action with a tool, observes the result, and repeats: this reason, act, observe cycle is the agent loop."
      },
      spark: "This is the ReAct pattern (Reason + Act), from a 2022 research paper."
    },
    {
      id: 'gh600-d1-006',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'A developer needs fast, synchronous, interactive multi-file changes in the IDE and wants to watch each step and approve terminal commands. Which option fits best?',
      choices: [
        { id: 'a', text: 'Copilot agent mode in the IDE' },
        { id: 'b', text: 'The Copilot coding agent, assigned via an issue' },
        { id: 'c', text: 'Copilot code review' },
        { id: 'd', text: 'A scheduled GitHub Actions workflow' }
      ],
      correctAnswers: ['a'],
      explanation: "Agent mode runs locally and synchronously, with the developer approving each step. The coding agent works asynchronously, so it does not suit hands-on work. Code review gives feedback, it does not write changes. A scheduled workflow is not interactive. Spark: many teams use agent mode to explore and the coding agent to deliver well-scoped backlog items.",
      choiceExplanations: {
        a: "Agent mode runs locally and synchronously, with the developer watching and approving each step, including terminal commands.",
        b: "The coding agent works asynchronously, so it does not suit hands-on, step-by-step work in the IDE.",
        c: "Code review gives feedback on existing changes, it does not make multi-file edits itself.",
        d: "A scheduled workflow runs unattended, it is not interactive."
      },
      spark: "Many teams use agent mode to explore and the coding agent to deliver well-scoped backlog items."
    },
    {
      id: 'gh600-d1-007',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'A team wants to hand off a well-scoped backlog issue and get a pull request back asynchronously, without keeping a local session open. Which option fits best?',
      choices: [
        { id: 'a', text: 'Copilot Chat ask mode' },
        { id: 'b', text: 'Copilot edit mode' },
        { id: 'c', text: 'The Copilot coding agent' },
        { id: 'd', text: 'Inline code completions' }
      ],
      correctAnswers: ['c'],
      explanation: "The coding agent is built for asynchronous work: assign an issue, get a PR back. Ask mode and edit mode are interactive IDE experiences that need an open session. Inline completions suggest code as you type and cannot complete a whole task. Spark: the coding agent runs inside GitHub Actions, which is why its environment is configured with a workflow file.",
      choiceExplanations: {
        a: "Copilot Chat ask mode is an interactive conversation that needs an open session; it does not hand back a PR asynchronously.",
        b: "Copilot edit mode is also an interactive IDE experience that needs an open session.",
        c: "The coding agent is built for asynchronous work: assign an issue, get a PR back, with no local session to keep open.",
        d: "Inline code completions suggest code as you type and cannot complete a whole task."
      },
      spark: "The coding agent runs inside GitHub Actions, which is why its environment is configured with a workflow file."
    },
    {
      id: 'gh600-d1-008',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'Which issue is best suited for delegation to the coding agent?',
      choices: [
        { id: 'a', text: 'Redesign our authentication architecture' },
        { id: 'b', text: 'Add unit tests for parseInvoice() covering null totals and negative quantities; tests must pass with npm test' },
        { id: 'c', text: 'Improve performance' },
        { id: 'd', text: 'Fix the production incident happening now in the payments service' }
      ],
      correctAnswers: ['b'],
      explanation: "The parseInvoice() issue is well scoped, testable, and has clear acceptance criteria. An architecture redesign is too broad, and 'Improve performance' is too vague to finish well. A live incident needs immediate human judgement. Spark: write a good agent issue the way you would brief a new teammate: context, scope, and how to verify the result.",
      choiceExplanations: {
        a: "An architecture redesign is too broad and open-ended for an agent to scope and validate on its own.",
        b: "The parseInvoice() issue is well scoped, testable, and has clear acceptance criteria (npm test must pass).",
        c: "'Improve performance' is too vague, there is no way to know what to change or how to confirm success.",
        d: "A live production incident needs immediate human judgement, not asynchronous delegation."
      },
      spark: "Write a good agent issue the way you would brief a new teammate: context, scope, and how to verify the result."
    },
    {
      id: 'gh600-d1-009',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'What is the main SDLC benefit of spec-driven development with agents?',
      choices: [
        { id: 'a', text: "A clear specification and plan become durable artifacts that guide, constrain, and verify the agent's implementation" },
        { id: 'b', text: 'It removes the need for code review' },
        { id: 'c', text: 'It lets agents skip writing tests' },
        { id: 'd', text: 'It guarantees deterministic model output' }
      ],
      correctAnswers: ['a'],
      explanation: "The spec and plan become reviewable artifacts the implementation is checked against. Spec-driven work does not remove review or tests, and nothing makes LLM output fully deterministic. Spark: GitHub's open-source Spec Kit puts this workflow into practice.",
      choiceExplanations: {
        a: "A clear specification and plan become durable artifacts that guide, constrain, and verify the agent's implementation.",
        b: "Spec-driven work does not remove the need for code review.",
        c: "It does not let agents skip writing tests.",
        d: "Nothing about spec-driven development makes LLM output fully deterministic."
      },
      spark: "GitHub's open-source Spec Kit puts this workflow into practice."
    },
    {
      id: 'gh600-d1-010',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'Where does the coding agent push its changes?',
      choices: [
        { id: 'a', text: 'Directly to the default branch' },
        { id: 'b', text: 'To a fork owned by GitHub' },
        { id: 'c', text: 'To any branch named in the issue' },
        { id: 'd', text: 'To a branch prefixed copilot/, opened as a pull request' }
      ],
      correctAnswers: ['d'],
      explanation: "The agent is limited to copilot/ branches and delivers work as a PR. Pushing to the default branch would bypass review. It does not use a GitHub-owned fork or arbitrary branches from the issue. Spark: restricting where the agent can write is a simple, powerful guardrail.",
      choiceExplanations: {
        a: "Pushing directly to the default branch would bypass review, which the agent does not do.",
        b: "The agent does not use a GitHub-owned fork to push its work.",
        c: "The agent cannot push to an arbitrary branch just because it is named in the issue.",
        d: "The agent is limited to branches prefixed copilot/, and it delivers its work as a pull request."
      },
      spark: "Restricting where the agent can write is a simple, powerful guardrail."
    },
    {
      id: 'gh600-d1-011',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: "The coding agent opens a PR. Why don't the repository's CI workflows run straight away?",
      choices: [
        { id: 'a', text: 'Copilot PRs can never trigger GitHub Actions' },
        { id: 'b', text: 'CI only runs after merge' },
        { id: 'c', text: "By default, Actions workflows on the agent's PR need approval from a user with write access" },
        { id: 'd', text: 'The agent disables Actions for the repository' }
      ],
      correctAnswers: ['c'],
      explanation: "Requiring approval stops untrusted, agent-written code running with your secrets. Copilot PRs can trigger Actions once someone approves the run. CI running only after merge, and the agent disabling Actions, are both false. Spark: this mirrors how GitHub treats workflows from first-time outside contributors.",
      choiceExplanations: {
        a: "It is false that Copilot PRs can never trigger Actions, they can once a run is approved.",
        b: "CI does not run only after merge, it can run before merge once approved.",
        c: "By default, Actions workflows on the agent's PR need approval from a user with write access before they run, which stops untrusted, agent-written code from running with your secrets.",
        d: "The agent does not disable Actions for the repository."
      },
      spark: "This mirrors how GitHub treats workflows from first-time outside contributors."
    },
    {
      id: 'gh600-d1-012',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'A developer assigns an issue to Copilot, and Copilot opens a PR. The branch needs one approving review. Can that developer supply it?',
      choices: [
        { id: 'a', text: 'No, because the person who asked Copilot to create the PR cannot provide the required approval' },
        { id: 'b', text: 'Yes, because they are a maintainer' },
        { id: 'c', text: 'Yes, provided they comment /approve' },
        { id: 'd', text: 'Only if they are an organization owner' }
      ],
      correctAnswers: ['a'],
      explanation: "This enforces a genuine two-person rule for agent work. Role does not change it, and there is no /approve override. Spark: without this rule, one person could effectively author and approve their own change through the agent.",
      choiceExplanations: {
        a: "The person who asked Copilot to create the PR cannot also supply the required approval, this enforces a genuine two-person rule for agent work.",
        b: "Being a maintainer does not change the rule, role alone does not grant an exception.",
        c: "There is no /approve comment override that bypasses the review requirement.",
        d: "Being an organization owner does not create an exception either."
      },
      spark: "Without this rule, one person could effectively author and approve their own change through the agent."
    },
    {
      id: 'gh600-d1-013',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'A team wants a reusable "security reviewer" persona with its own instructions and a restricted set of tools, selectable by developers. What should they create?',
      choices: [
        { id: 'a', text: 'A new GitHub App' },
        { id: 'b', text: 'A custom agent profile, for example .github/agents/security-reviewer.agent.md' },
        { id: 'c', text: 'A branch protection rule' },
        { id: 'd', text: 'A .gitattributes entry' }
      ],
      correctAnswers: ['b'],
      explanation: "A custom agent profile sets a persona, its instructions, and the tools it may use. A GitHub App is far heavier than needed. Branch protection and .gitattributes have nothing to do with agent personas. Spark: limiting tools per agent applies least privilege to AI.",
      choiceExplanations: {
        a: "A new GitHub App is far heavier than needed just to define a reusable persona.",
        b: "A custom agent profile, for example .github/agents/security-reviewer.agent.md, sets a persona, its instructions, and the tools it may use.",
        c: "A branch protection rule controls merge requirements, it has nothing to do with agent personas.",
        d: "A .gitattributes entry has nothing to do with agent personas either."
      },
      spark: "Limiting tools per agent applies least privilege to AI."
    },
    {
      id: 'gh600-d1-014',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'What is the purpose of a prompt file (*.prompt.md)?',
      choices: [
        { id: 'a', text: 'To store secrets for the agent' },
        { id: 'b', text: "To configure the agent's firewall" },
        { id: 'c', text: 'To replace copilot-instructions.md' },
        { id: 'd', text: 'To define a reusable, on-demand task prompt that developers can invoke' }
      ],
      correctAnswers: ['d'],
      explanation: "Prompt files are reusable task prompts run on demand. Never store secrets in them. Firewall settings live elsewhere. They complement the instructions file rather than replacing it. Spark: prompt files live in version control, so your best prompts get reviewed and improved like code.",
      choiceExplanations: {
        a: "Secrets should never be stored in a prompt file.",
        b: "Prompt files do not configure the agent's firewall, that lives elsewhere.",
        c: "Prompt files complement copilot-instructions.md rather than replacing it.",
        d: "A prompt file defines a reusable, on-demand task prompt that developers can invoke."
      },
      spark: "Prompt files live in version control, so your best prompts get reviewed and improved like code."
    },
    {
      id: 'gh600-d1-015',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: "Which choice most directly raises an agent's chance of success on a repository?",
      choices: [
        { id: 'a', text: 'Longer issue titles' },
        { id: 'b', text: 'Disabling linting' },
        { id: 'c', text: 'A reliable build and test setup the agent can run to validate its own changes' },
        { id: 'd', text: 'Removing the README' }
      ],
      correctAnswers: ['c'],
      explanation: "Build and test feedback is how the agent loop detects and fixes its own mistakes. Longer titles add nothing. Disabling linting removes a useful signal. Removing the README removes context. Spark: a fast, trustworthy test suite is one of the best investments you can make before adopting agents.",
      choiceExplanations: {
        a: "Longer issue titles add nothing to the agent's chance of success.",
        b: "Disabling linting removes a useful signal the agent could use to catch its own mistakes.",
        c: "A reliable build and test setup lets the agent validate its own changes, which is how the agent loop detects and fixes mistakes.",
        d: "Removing the README removes context the agent needs, it does not help."
      },
      spark: "A fast, trustworthy test suite is one of the best investments you can make before adopting agents."
    },
    {
      id: 'gh600-d1-016',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'An architect is choosing an autonomy level. The task changes billing logic in a regulated system. What is the best design?',
      choices: [
        { id: 'a', text: 'The agent drafts the change, with mandatory human review and approval gates before merge' },
        { id: 'b', text: 'Full autonomy, with auto-merge on green CI' },
        { id: 'c', text: 'No agent involvement at all' },
        { id: 'd', text: 'The agent merges, and humans audit monthly' }
      ],
      correctAnswers: ['a'],
      explanation: "Match autonomy to risk: higher risk means more human gates. Auto-merge and monthly audits give the agent too much trust for a regulated system. Excluding the agent entirely is overly cautious, since it can still speed up drafting safely. Spark: this is often called human-in-the-loop design.",
      choiceExplanations: {
        a: "Drafting the change with mandatory human review and approval gates matches the higher risk of a regulated billing system, more risk means more human gates.",
        b: "Full autonomy with auto-merge on green CI gives the agent too much trust for a regulated system.",
        c: "Excluding the agent entirely is overly cautious, it can still speed up drafting safely under the right gates.",
        d: "Merging with only a monthly audit still lets risky, regulated changes ship without a human gate beforehand."
      },
      spark: "This is often called human-in-the-loop design."
    },
    {
      id: 'gh600-d1-017',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: "A team notices that the agent's output quality drops as they add ever more rules to copilot-instructions.md. What is the most likely cause, and what should they do?",
      choices: [
        { id: 'a', text: 'There are too few rules, so they should add more' },
        { id: 'b', text: 'The model is out of date, so they should switch repositories' },
        { id: 'c', text: 'Instructions only work when written as Markdown tables' },
        { id: 'd', text: 'The instructions are long, conflicting, or irrelevant to most tasks, so keep them concise and move scoped rules into path-specific instruction files' }
      ],
      correctAnswers: ['d'],
      explanation: "Bloated or conflicting instructions dilute the model's context. Adding more rules makes it worse. Switching repositories and Markdown tables are not the cause. Spark: treat instructions like code, and refactor them when they grow.",
      choiceExplanations: {
        a: "There are not too few rules, adding more rules makes the dilution worse, not better.",
        b: "The model is not simply 'out of date' in a way that switching repositories would fix.",
        c: "Instructions do not only work when written as Markdown tables, that is not the cause.",
        d: "The instructions are likely long, conflicting, or irrelevant to most tasks, diluting the model's context; keep them concise and move scoped rules into path-specific instruction files."
      },
      spark: "Treat instructions like code, and refactor them when they grow."
    },
    {
      id: 'gh600-d1-018',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'During planning, why ask the agent to produce a plan before it writes code?',
      choices: [
        { id: 'a', text: 'Plans are required by the GitHub API' },
        { id: 'b', text: 'Plans make the model run faster' },
        { id: 'c', text: 'Reviewing the plan early catches misunderstanding cheaply, before implementation effort is spent' },
        { id: 'd', text: 'It stops the agent from using tools' }
      ],
      correctAnswers: ['c'],
      explanation: "Checking the plan early is the cheapest place to catch a misunderstanding. Plans are not required by any API, they add a step rather than speeding things up, and they do not stop tool use. Spark: fixing a wrong plan costs a sentence; fixing a wrong implementation costs a rewrite.",
      choiceExplanations: {
        a: "Plans are not required by the GitHub API.",
        b: "Producing a plan does not make the model run faster, it adds a step rather than speeding things up.",
        c: "Reviewing the plan early catches a misunderstanding cheaply, before implementation effort is spent.",
        d: "Producing a plan does not stop the agent from using tools afterward."
      },
      spark: "Fixing a wrong plan costs a sentence; fixing a wrong implementation costs a rewrite."
    },
    {
      id: 'gh600-d1-019',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'How can a developer ask the coding agent to revise its open PR?',
      choices: [
        { id: 'a', text: 'Close the PR and open a new issue' },
        { id: 'b', text: 'Leave PR review comments mentioning @copilot, which the agent picks up and iterates on' },
        { id: 'c', text: "Edit the agent's session logs" },
        { id: 'd', text: 'Force-push to the branch' }
      ],
      correctAnswers: ['b'],
      explanation: "Mentioning @copilot in review comments triggers another iteration. Closing the PR loses its context. Session logs are read-only. Force-pushing can clash with the agent's own pushes. Spark: batching several comments into one review gives the agent a clearer, single round of feedback.",
      choiceExplanations: {
        a: "Closing the PR and opening a new issue loses the existing context and history.",
        b: "Mentioning @copilot in review comments triggers another iteration, which the agent picks up and iterates on.",
        c: "Session logs are read-only, editing them does not instruct the agent to do anything.",
        d: "Force-pushing to the branch can clash with the agent's own pushes."
      },
      spark: "Batching several comments into one review gives the agent a clearer, single round of feedback."
    },
    {
      id: 'gh600-d1-020',
      topic: D1,
      type: 'multiple-choice',
      multiple: false,
      prompt: 'Where can a reviewer see the reasoning and steps the coding agent took?',
      choices: [
        { id: 'a', text: 'Nowhere, because it is a black box' },
        { id: 'b', text: 'Only in the organization audit log' },
        { id: 'c', text: 'Only in the commit messages' },
        { id: 'd', text: 'In the agent session logs linked from the PR' }
      ],
      correctAnswers: ['d'],
      explanation: "Session logs show the agent's reasoning and tool calls, which gives traceability. It is not a black box. The audit log and commit messages each show only part of the picture. Spark: this transparency links directly to Domain 6, Guardrails and Accountability.",
      choiceExplanations: {
        a: "It is not a black box, its reasoning is visible, just not nowhere at all.",
        b: "The organization audit log shows only part of the picture, not the full reasoning.",
        c: "Commit messages also show only part of the picture, not the step-by-step reasoning.",
        d: "The agent session logs, linked from the PR, show the agent's reasoning and tool calls, which gives full traceability."
      },
      spark: "This transparency links directly to Domain 6, Guardrails and Accountability."
    }
  ];
});
