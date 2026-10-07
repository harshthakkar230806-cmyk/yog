# Yojana Finder

Answer a few questions, see central government schemes you may qualify for. English and Hindi. Static site, no backend, no data leaves the browser.

## Architecture
- `schemes.js`: scheme data with structured eligibility rules (SAMPLE DATA, verify before real use)
- `engine.js`: deterministic rule engine (no AI decides eligibility)
- `app.js`: question flow, results, Hindi/English, read-aloud
- `tests/engine.test.js`: run `node tests/engine.test.js`

## Run locally
    npx serve .

## Deploy on Vercel
Push to GitHub, import at vercel.com/new (Framework: Other, no build command). Or `npx vercel --prod`.

## Before you show it to real people
1. Verify each scheme on its official site, fix the rules, set `verified: '2026-10-07'` on it.
2. Add state-level schemes: add a `state` question and a `states` rule field.
3. Add an LLM layer that only *explains* results and parses free text into the profile.
