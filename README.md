# Nat Grad Trivia

A simple, mobile-friendly trivia app for **Natalie's graduation party** — pair it with Hammerschlagen. One host runs the app; the group shouts answers; correct answers earn a swing. No scores or player tracking.

**Topics:** Harry Potter, Soccer, Germany, Bluey, Disney, Basketball — **50 questions each** (300 total).

## Run locally

GitHub Pages and `fetch()` require a local web server (opening `index.html` directly will not load questions).

```bash
cd nat-grad-trivia
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

## Deploy to GitHub Pages

1. Create a repo on GitHub (e.g. `nat-grad-trivia`).
2. Push this folder to the `main` branch.
3. In the repo: **Settings → Pages → Build and deployment**
   - **Source:** Deploy from a branch
   - **Branch:** `main` / **`/` (root)**
4. Your site will be at `https://<username>.github.io/nat-grad-trivia/`

## Assets

- `assets/marquette-logo.png` — Marquette Golden Eagles logo (from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Marquette_Golden_Eagles_logo.svg)), used as a translucent background watermark.

## Project structure

```
index.html          # Intro, topic picker, quiz UI
style.css           # Marquette blue & gold theme
app.js              # Screen flow and question logic
topics.json         # Topic list and question file paths
questions/
  harry-potter.json
  soccer.json
  germany.json
  bluey.json
  disney.json
  basketball.json
```

## How to play

1. Tap **Let's Play** on the intro screen.
2. Choose a topic.
3. Read the question aloud.
4. Tap **Too hard? Show choices** if the group wants multiple choice.
5. Tap **Show answer**, then **Next question** for another random question in that topic.

Questions won't repeat until all 50 in the topic have been shown, then the deck reshuffles.
