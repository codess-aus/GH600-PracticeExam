# GH600 Practice Exam Simulator

A dependency-free static practice exam app for GH600 preparation. It supports:

- Timed exam mode with a 90-minute countdown, or learning mode without a timer
- Immediate answer feedback in learning mode: reveal the correct answer, result, and explanation after answering each question
- Random question selection or topic-specific sessions
- Multiple-choice and drag-and-drop style questions
- Automatic scoring with pass/fail feedback and explanations
- A modern GitHub-inspired interface

## Run locally

Open `index.html` in a browser, or serve the repository with any static file server.

## Publish with GitHub Pages

This repository includes a GitHub Pages workflow at `.github/workflows/pages.yml`. In the repository settings, set Pages to use **GitHub Actions** as the source. The app will deploy when changes are pushed to `main`, or when the workflow is run manually.

## Update questions

Edit `assets/questions.js` to add the official questions, answer keys, and explanations. Questions can use `multiple-choice` or `drag-drop` types.

## Test

```bash
npm test
```
