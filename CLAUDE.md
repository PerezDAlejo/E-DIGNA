# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-DIGNA is a static HTML/JS cybersecurity awareness toolkit deployed on GitHub Pages. No build step — all tools run client-side with zero backend.

Deploy: push to `main` branch → GitHub Pages serves from repo root.
Live site: `https://perezdAlejo.github.io/E-DIGNA/` (or similar).

## Structure

```
index.html              # Landing page — links to all tools
styles.css              # Shared glassmorphism design system
comprobador-passwords/  # Password strength checker
espejo-digital/         # Browser fingerprint / digital mirror
simulador-phishing/     # Interactive phishing detection game
visor-exif/             # EXIF metadata reader (drag & drop)
```

Each sub-tool is self-contained: its own `index.html`, `script.js`, `styles.css`. No shared JS modules between tools — copy patterns, don't import.

## Tool Architecture

**comprobador-passwords** — uses `zxcvbn.js` (CDN) for real-time strength scoring (0–4). Simulated "AI" feedback is local pattern matching (regex), not a real API. The "improved password" suggestion uses leetspeak substitution + suffix appending.

**espejo-digital** — reads `navigator`, `screen`, and browser APIs client-side; calls `https://api.ipify.org` (free, no key) to get public IP. No other external API calls.

**simulador-phishing** — purely data-driven: all phishing scenarios are JS objects in `script.js`. Add new levels by appending to the `scenarios` array. Each scenario needs `title`, `desc`, `type` (email/sms), `flagsNeeded`, `html` (inline clickable elements with `data-desc`/`data-safe`), and `feedback`.

**visor-exif** — uses `exif-js` (CDN) to parse image EXIF client-side. Drop-zone accepts images; GPS coords are converted to decimal degrees and shown.

## Design System

Glass-morphism aesthetic shared across all tools:
- CSS vars: `--primary-color`, `--glass-bg`, `--glass-border`, `--text-color`
- Classes: `.glass-panel`, `.glass-nav`, `.glass-footer`, `.btn`, `.btn-primary`, `.btn-secondary`
- Each sub-tool has its own `styles.css` that redefines these — they are NOT linked to root `styles.css`

## External Dependencies (CDN only)

- `zxcvbn.js` — password entropy library (comprobador-passwords)
- `exif-js` — EXIF parser (visor-exif)
- Font Awesome 6.4.0
- Google Fonts (Inter)
- `api.ipify.org` — public IP lookup (espejo-digital)

## Deployment Notes

- All paths are relative (`./tool/index.html`) — works both locally and on GH Pages
- `comprobador-passwords/github-pages-version.html` is an alternate standalone build for direct GH Pages embedding
- `E-DIGNA.docx` / `E-DIGNA.pdf` are the research paper — linked from landing page for download
