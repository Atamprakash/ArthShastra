# 📊 ArthShastra — Indian Economics Learning Platform
 
> **"Arth" (अर्थ) = Economy/Meaning | "Shastra" (शास्त्र) = Science/Knowledge**
>
> A free, interactive web platform that teaches Indian macroeconomics clearly —
> designed for Class 11–12 students and UPSC Civil Services aspirants.
 
---
 
## 🌐 Live Demo
 
Deploy your own → see [Deployment Guide](#-deployment-guide) below.
 
---
 
## 📌 Project Description
 
**ArthShastra** is a single-page educational website that breaks down complex Indian
economic concepts into clear, structured, and interactive learning experiences.
 
The project was built with a specific gap in mind — most economics study material is
either too textbook-dry or too shallow. ArthShastra sits in the middle: academically
accurate, student-friendly, and visually engaging.
 
### Who is it for?
- 🎓 **Class 11–12 students** studying Economics (CBSE / State Board)
- 📝 **UPSC / State PSC aspirants** covering GS Paper 3 (Indian Economy)
- 👨‍💻 **Anyone curious** about how India's economy actually works
### What makes it different?
- Real MoSPI data and RBI policy figures — not made-up examples
- A working **CPI Calculator** that mirrors the actual Laspeyres Index formula
- Every concept comes with real-world examples and policy implications
- No login, no signup, no ads — completely free and open
---
 
## ✨ Features
 
| Feature | Details |
|---|---|
| 📊 **CPI & Inflation Deep Dive** | Concept explanation, basket weights, 4 inflation types |
| 🧮 **Interactive CPI Calculator** | Adjust 6 category prices with sliders, see live CPI & inflation rate |
| ⛽ **Fuel Price Chain Reaction** | 5-stage visual showing how oil prices affect the entire economy |
| 💰 **Union Budget Simplified** | Revenue vs Capital budget, donut chart, fiscal deficit metrics |
| 🧠 **Knowledge Quiz** | 7 questions with detailed explanations after each answer |
| 🎨 **Premium Dark UI** | Animated hero, particle canvas, smooth scroll, micro-animations |
| 📱 **Fully Responsive** | Works on mobile (360px), tablet, and desktop |
| ♿ **Accessible** | ARIA labels, semantic HTML, keyboard navigable |
 
---
 
## 🗂️ Project Structure
 
```
arthshastra/
│
├── index.html          ← Main page (all sections, semantic HTML5)
│
├── css/
│   ├── styles.css      ← Core styles: layout, components, dark theme, colors
│   ├── animations.css  ← All keyframes, transitions, scroll-reveal effects
│   └── responsive.css  ← Mobile & tablet breakpoints (768px, 480px, 360px)
│
└── js/
    ├── main.js         ← Page loader, navbar, particle canvas, scroll observer
    ├── calculator.js   ← CPI calculator: sliders, Laspeyres formula, gauge, charts
    └── quiz.js         ← Quiz engine: questions, scoring, explanations, results
```
 
**Why split into separate files?**
Each file has one clear job. If you want to change the quiz questions, open only `quiz.js`.
If you want to change colors, open only `styles.css`. This makes future edits much easier.
 
---
 
## 📐 How the CPI Calculator Works
 
The calculator uses the **Laspeyres Price Index** method — the same formula used by
India's Ministry of Statistics & Programme Implementation (MoSPI).
 
```
CPI = Σ (Current Price of Category ÷ Base Year Price) × Category Weight
```
 
- **Base Year** = 2012 (all base prices normalised to 100)
- **6 Categories** with official MoSPI weights (Food: 45.86%, Misc: 28.32%, etc.)
- **Inflation Rate** = ((CPI − 100) ÷ 100) × 100%
- RBI's target zone: **4% ± 2%** (i.e., 2%–6%)
Adjust any slider → CPI recalculates instantly → gauge and status update live.
 
---
 
## 📚 Content Covered
 
### Section 1 — CPI & Inflation
- What CPI is and how MoSPI calculates it
- Inflation formula with real numbers
- RBI's Inflation Targeting Framework (2016)
- CPI vs WPI vs GDP Deflator
- India's CPI basket with all 6 category weights
- 4 types of inflation: Demand-Pull, Cost-Push, Built-In, Structural
### Section 2 — CPI Calculator *(Interactive)*
- Live price adjustment for all 6 CPI categories
- Real-time CPI index value and inflation rate
- Animated gauge showing RBI tolerance zones
- Category contribution bars
- Contextual interpretation text that changes with inflation level
### Section 3 — Fuel Price Impact
- India's 85% oil import dependency
- 5-stage chain reaction: crude oil → OMCs → freight → retail → RBI response
- Real data: Brent crude impact, petrol price history, RBI rate hike timeline
### Section 4 — Union Budget
- Revenue Budget vs Capital Budget explained
- Where India's money comes from (GST 27%, Income Tax 18%, etc.)
- Expenditure donut chart (FY 2024–25)
- Fiscal Deficit, Revenue Deficit, Capex figures
- FRBM Act 2003 and its escape clause
### Section 5 — Quiz *(7 Questions)*
- Full-form and definition questions
- Application-based scenario questions
- Detailed explanation shown after every answer
- Score screen with performance breakdown
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | CSS3 (custom properties, Grid, Flexbox) |
| Animations | CSS keyframes + JS IntersectionObserver |
| Interactivity | Vanilla JavaScript (ES6+) |
| Fonts | DM Serif Display + Plus Jakarta Sans (Google Fonts) |
| Icons | Unicode emoji (no icon library needed) |
| Charts | SVG (hand-coded, no Chart.js or D3) |
| Build Tool | None — open `index.html` directly |
 
**Zero dependencies. Zero npm install. Zero build step.**
 
---
 
## 🚀 Deployment Guide
 
### Option 1 — Netlify (Easiest, Recommended)
1. Go to [netlify.com](https://netlify.com) and sign up free
2. Unzip your project folder
3. Drag and drop the `arthshastra/` folder onto the Netlify dashboard
4. Your site goes live instantly at `yourname.netlify.app`
5. Optional: rename to `arthshastra.netlify.app` in Site Settings
**Total time: ~2 minutes. No Git required.**
 
---
 
### Option 2 — GitHub Pages (Best for developers)
 
```bash
# Step 1: Create a new repository on github.com
# Name it: arthshastra  (make it Public)
 
# Step 2: Open terminal in your project folder
git init
git add .
git commit -m "first commit: ArthShastra launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/arthshastra.git
git push -u origin main
 
# Step 3: On GitHub.com
# Go to your repo → Settings → Pages
# Source: Deploy from a branch
# Branch: main → / (root) → Save
 
# Your site will be live at:
# https://YOUR_USERNAME.github.io/arthshastra
```
 
**Total time: ~5 minutes.**
 
---
 
### Option 3 — Cloudflare Pages (Best performance)
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub account
3. Select your `arthshastra` repository
4. Build settings: leave blank (static site, no build command)
5. Deploy → live on Cloudflare's global CDN (300+ locations)
**Best choice if you expect high traffic.**
 
---
 
### ❌ Do NOT use these for this project
| Platform | Why Not |
|---|---|
| **Streamlit** | Only for Python apps — won't work with HTML/CSS/JS |
| **Heroku** | Designed for backend servers — unnecessary here |
| **Render (free tier)** | Static hosting works, but GitHub Pages is simpler |
 
---
 
## 🖥️ Running Locally
 
No installation needed:
 
```bash
# Just open the file in your browser
# On Windows:
start arthshastra/index.html
 
# On Mac:
open arthshastra/index.html
 
# On Linux:
xdg-open arthshastra/index.html
```
 
Or if you want a local server (optional, for development):
 
```bash
# Using Python (if installed)
cd arthshastra
python -m http.server 3000
# Open: http://localhost:3000
 
# Using Node.js (if installed)
npx serve arthshastra
```
 
---
 
## ✏️ How to Customise
 
### Change quiz questions
Open `js/quiz.js` → find the `QUIZ_DATA` array at the top → add/edit question objects:
```js
{
  q: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correct: 1,           // index of correct option (0-based)
  explanation: "Detailed explanation shown after the answer."
}
```
 
### Change CPI category weights
Open `js/calculator.js` → find the `CPI_CATEGORIES` array → update the `weight` values.
Make sure all weights add up to 100.
 
### Change colors / theme
Open `css/styles.css` → find the `:root { }` block at the top:
```css
:root {
  --saffron:  #FF6B2B;   /* Primary orange-red */
  --gold:     #F5B742;   /* Accent yellow */
  --emerald:  #00D9A5;   /* Success green */
  --sky:      #38BDF8;   /* Info blue */
}
```
Change any hex value and every component using that color updates automatically.
 
### Add a new section
1. Add a `<section id="your-section">` block in `index.html`
2. Add a nav link: `<li><a href="#your-section" class="nav-link">Label</a></li>`
3. Style it in `css/styles.css`
---
 
## 📊 Data Sources
 
All economic data used in this project is sourced from official Government of India publications:
 
- **CPI Weights** — Ministry of Statistics & Programme Implementation (MoSPI), 2012 Base Series
- **Inflation Targets** — Reserve Bank of India (RBI) Monetary Policy Framework
- **Budget Figures** — Union Budget 2024–25, Ministry of Finance
- **Repo Rate History** — RBI Monetary Policy Committee statements
- **Crude Oil Data** — Petroleum Planning & Analysis Cell (PPAC), MoPNG
> ⚠️ Data is for **educational purposes only**. Always refer to official sources for current figures.
 
---
 
## 🤝 Contributing
 
This is an open educational project. Contributions are welcome:
 
1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add: your feature description"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request
### Ideas for contributions
- Add more quiz questions
- Add a new section (e.g., GST, Monetary Policy tools, Balance of Payments)
- Add Hindi/regional language toggle
- Add a "Download Notes" button for each section
- Dark/light mode toggle
---
 
## 📄 License
 
This project is open-source under the **MIT License** — free to use, modify,
and distribute for educational purposes.
 
```
MIT License — Copyright (c) 2025 ArthShastra
Permission is granted to use, copy, modify, and distribute this project freely,
provided the original credit is retained.
```
 
---
 
## 👨‍💻 Built With
 
- 💡 Concept & Design — built as a Google-style frontend developer project
- 📐 UI Framework — zero dependencies, pure web standards
- 🇮🇳 Data — all from Government of India public documents
---
 
*Made with ❤️ for every student who found economics boring — it doesn't have to be.*
