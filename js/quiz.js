/* =============================================================
   quiz.js — ArthShastra Knowledge Quiz
   7 questions covering CPI, inflation, monetary policy,
   budget terminology, and macroeconomics.
   Each question has a detailed explanation.
   ============================================================= */

const QUIZ_DATA = [
  {
    q: "What does CPI stand for, and which government body compiles it in India?",
    options: [
      "Central Price Index — Reserve Bank of India",
      "Consumer Price Index — Ministry of Statistics & Programme Implementation (MoSPI)",
      "Commodity Price Indicator — Ministry of Finance",
      "Consumer Purchasing Index — NITI Aayog"
    ],
    correct: 1,
    explanation: "CPI stands for Consumer Price Index. In India, it is compiled by the Ministry of Statistics and Programme Implementation (MoSPI) on a monthly basis. The RBI uses CPI (Combined) as the headline inflation benchmark for monetary policy since 2014. The base year is 2012 = 100."
  },
  {
    q: "India's CPI basket assigns the highest weight to which category?",
    options: [
      "Housing (10.07%)",
      "Fuel & Light (6.84%)",
      "Food & Beverages (45.86%)",
      "Miscellaneous (28.32%)"
    ],
    correct: 2,
    explanation: "Food & Beverages holds the highest weight at 45.86% in India's CPI basket (2012 base). This reflects the reality that a significant portion of an average Indian household's expenditure goes toward food — particularly in rural areas. This is why food inflation (called 'headline food inflation') has a disproportionately large impact on overall CPI."
  },
  {
    q: "Under the Inflation Targeting Framework (2016), the RBI's MPC is mandated to maintain CPI inflation at which target?",
    options: [
      "2% with a ±1% tolerance band",
      "6% with a ±1% tolerance band",
      "4% with a ±2% tolerance band (i.e., 2%–6%)",
      "3% with no tolerance band — strict FRBM mandate"
    ],
    correct: 2,
    explanation: "The Monetary Policy Committee (MPC) of the RBI is legally mandated to maintain CPI inflation at 4% ± 2%, meaning between 2% and 6%. This target was formalised through an amendment to the RBI Act, 1934, following the recommendations of the Urjit Patel Committee (2014). If inflation breaches 6% for three consecutive quarters, RBI must submit a written explanation to the Central Government."
  },
  {
    q: "When petrol prices rise and, as a result, food prices increase due to higher transportation costs — what type of inflation is this?",
    options: [
      "Demand-Pull Inflation — excess consumer demand driving prices up",
      "Hyperinflation — uncontrolled price spiral",
      "Cost-Push Inflation — rising input costs passed on to consumers",
      "Deflation — a temporary price correction"
    ],
    correct: 2,
    explanation: "This is Cost-Push Inflation — triggered when production or distribution costs increase, causing suppliers to raise prices. Fuel is a critical input cost across logistics, agriculture, and manufacturing. When diesel prices rise, freight rates rise, and those higher costs cascade through the supply chain, eventually raising consumer prices. This is distinct from Demand-Pull Inflation, which is driven by excess demand in the economy."
  },
  {
    q: "What is the Repo Rate, and what happens to home loan EMIs when RBI raises it?",
    options: [
      "Rate at which RBI borrows from banks; EMIs decrease when raised",
      "Rate at which RBI lends to commercial banks; EMIs increase when raised",
      "Rate at which banks lend to each other overnight; EMIs are unaffected",
      "Rate at which government borrows from RBI; EMIs are directly set by this rate"
    ],
    correct: 1,
    explanation: "The Repo Rate (Repurchase Agreement Rate) is the rate at which the Reserve Bank of India lends short-term funds to commercial banks, using government securities as collateral. When RBI raises the Repo Rate, the cost of funds for banks increases, which they pass on to borrowers as higher interest rates. This means home loan, auto loan, and business loan EMIs increase — reducing consumer spending and cooling inflationary demand. Between May 2022 and February 2023, RBI raised the Repo Rate by 250 basis points (2.5%) to combat post-COVID inflation."
  },
  {
    q: "What is 'Fiscal Deficit' as presented in India's Union Budget?",
    options: [
      "Total revenue earned by the government in a financial year",
      "The gap between the government's total expenditure and its total revenue receipts (excluding borrowings)",
      "The difference between exports and imports in a financial year",
      "The amount spent on defence and infrastructure combined"
    ],
    correct: 1,
    explanation: "Fiscal Deficit = Total Expenditure − (Revenue Receipts + Non-debt Capital Receipts). It represents the amount the government needs to borrow to finance its excess spending over income. For FY 2024–25, the fiscal deficit target is 4.9% of GDP. The FRBM Act, 2003 mandates a medium-term target of 3% of GDP. High fiscal deficit can crowd out private investment and put upward pressure on inflation."
  },
  {
    q: "The FRBM Act (2003) includes an 'escape clause.' When was it notably invoked in India, and what does it allow?",
    options: [
      "During the 2008 financial crisis; it allowed RBI to print currency without limit",
      "During the COVID-19 pandemic (2020–21); it allowed temporary deviation from deficit targets due to national calamity or structural reforms",
      "During the 1991 BoP crisis; it allowed emergency IMF borrowings",
      "It was never formally invoked; it exists only as a theoretical provision"
    ],
    correct: 1,
    explanation: "The FRBM Act's 'escape clause' (Section 4(3)) was prominently invoked during COVID-19 in FY 2020–21. It allows the government to deviate from the fiscal deficit target by up to 0.5% of GDP in circumstances of national security, calamity, far-reaching structural reforms, or a decline in real output. The NK Singh Committee (2017) formalised the escape clause provisions and recommended the creation of an independent Fiscal Council to monitor compliance — a recommendation still pending implementation."
  }
];

/* ---------------------------------------------------------------
   QUIZ STATE
--------------------------------------------------------------- */
let currentQuestion = 0;
let score = 0;
let answered = false;

/* ---------------------------------------------------------------
   RENDER QUESTION
--------------------------------------------------------------- */
function renderQuestion() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  answered = false;
  const total = QUIZ_DATA.length;
  const q = QUIZ_DATA[currentQuestion];

  // Build dot indicators
  const dots = QUIZ_DATA.map((_, i) => {
    const cls = i < currentQuestion ? 'qz-dot done' :
                i === currentQuestion ? 'qz-dot active' : 'qz-dot';
    return `<span class="${cls}" aria-hidden="true"></span>`;
  }).join('');

  const html = `
    <div class="quiz-card" id="quizCard">
      <!-- Progress -->
      <div class="qz-progress-wrap">
        <div class="qz-step-dots" role="progressbar" aria-valuenow="${currentQuestion + 1}" aria-valuemax="${total}">
          ${dots}
        </div>
        <span class="qz-counter">Question ${currentQuestion + 1} of ${total}</span>
      </div>

      <!-- Question text -->
      <div class="qz-question" id="qzQuestion">${q.q}</div>

      <!-- Options -->
      <div class="qz-options" role="list" id="qzOptions">
        ${q.options.map((opt, i) => `
          <button
            class="qz-option"
            role="listitem"
            onclick="selectAnswer(this, ${i})"
            aria-label="Option ${i + 1}: ${opt}"
          >
            <span class="qo-prefix">${String.fromCharCode(65 + i)}.</span>
            ${opt}
          </button>
        `).join('')}
      </div>

      <!-- Explanation (shown after answer) -->
      <div class="qz-explanation" id="qzExplanation"></div>

      <!-- Navigation -->
      <div class="qz-nav">
        <button
          class="btn-qz-next"
          id="qzNextBtn"
          onclick="nextQuestion()"
          aria-label="${currentQuestion < total - 1 ? 'Next question' : 'See results'}"
        >
          ${currentQuestion < total - 1 ? 'Next Question →' : 'See My Results 🎉'}
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Animate card entrance
  const card = document.getElementById('quizCard');
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
}

/* ---------------------------------------------------------------
   HANDLE ANSWER SELECTION
--------------------------------------------------------------- */
function selectAnswer(btn, selectedIndex) {
  if (answered) return;
  answered = true;

  const q = QUIZ_DATA[currentQuestion];
  const allOptions = document.querySelectorAll('.qz-option');
  const expEl = document.getElementById('qzExplanation');
  const nextBtn = document.getElementById('qzNextBtn');

  // Disable all buttons
  allOptions.forEach(opt => opt.disabled = true);

  const isCorrect = selectedIndex === q.correct;
  if (isCorrect) score++;

  // Highlight correct and wrong
  btn.classList.add(isCorrect ? 'correct' : 'wrong');
  allOptions[q.correct].classList.add('correct');

  // Show explanation
  if (expEl) {
    expEl.textContent = (isCorrect ? '✅ Correct! ' : '❌ Incorrect. ') + q.explanation;
    expEl.className = 'qz-explanation ' + (isCorrect ? 'correct-exp' : 'wrong-exp');
  }

  // Show next button
  if (nextBtn) nextBtn.classList.add('visible');
}

/* ---------------------------------------------------------------
   NEXT QUESTION
--------------------------------------------------------------- */
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= QUIZ_DATA.length) {
    renderScore();
  } else {
    renderQuestion();
  }
}

/* ---------------------------------------------------------------
   RENDER SCORE SCREEN
--------------------------------------------------------------- */
function renderScore() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const total = QUIZ_DATA.length;
  const pct = Math.round((score / total) * 100);

  const { trophy, message } = getScoreDetails(score, total);

  // Build per-question summary
  const summary = QUIZ_DATA.map((q, i) => `
    <div class="score-qa-item" style="margin-bottom:8px;padding:10px 16px;background:rgba(0,0,0,0.03);border-radius:10px;font-size:0.82rem;color:#475569;border-left:3px solid ${i < score ? '#00D9A5' : '#fb7185'}">
      <strong style="color:#0F172A">Q${i + 1}:</strong> ${q.q.substring(0, 70)}...
    </div>
  `).join('');

  container.innerHTML = `
    <div class="quiz-card">
      <div class="score-screen">
        <span class="score-trophy">${trophy}</span>
        <div class="score-fraction">${score} / ${total}</div>
        <div class="score-out-of">${pct}% Score</div>
        <div class="score-message">${message}</div>

        <!-- Score bar -->
        <div style="background:rgba(0,0,0,0.06);border-radius:99px;height:10px;width:100%;max-width:300px;margin:0 auto 28px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#FF6B2B,#F5B742);border-radius:99px;transition:width 1s ease;"></div>
        </div>

        <div class="score-actions">
          <button class="btn-retry" onclick="restartQuiz()">🔄 Try Again</button>
          <a href="#cpi" class="btn-review-link">📖 Review Notes</a>
        </div>

        <!-- Performance breakdown -->
        <div style="margin-top:32px;text-align:left;">
          <p style="font-size:0.75rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94A3B8;margin-bottom:12px;">Questions Covered</p>
          ${summary}
        </div>
      </div>
    </div>
  `;

  // Animate score bar (re-trigger after render)
  setTimeout(() => {
    const bar = container.querySelector('[style*="width:0"]');
    if (bar) bar.style.width = pct + '%';
  }, 200);
}

/* ---------------------------------------------------------------
   SCORE DETAILS HELPER
--------------------------------------------------------------- */
function getScoreDetails(score, total) {
  if (score === total) {
    return {
      trophy: '🏆',
      message: 'Perfect score! You have an outstanding grasp of Indian macroeconomics. UPSC ready!'
    };
  } else if (score >= total - 1) {
    return {
      trophy: '🥇',
      message: 'Excellent! Just one slip — you clearly understand the core concepts well.'
    };
  } else if (score >= Math.ceil(total * 0.7)) {
    return {
      trophy: '🥈',
      message: 'Good performance! Review the questions you missed to solidify your understanding.'
    };
  } else if (score >= Math.ceil(total * 0.5)) {
    return {
      trophy: '📚',
      message: 'A decent start. Revisit the CPI, Budget, and Monetary Policy sections for clarity.'
    };
  } else {
    return {
      trophy: '💡',
      message: 'Don\'t worry — economics concepts take time. Read each section carefully and retry!'
    };
  }
}

/* ---------------------------------------------------------------
   RESTART — reset state and re-render
--------------------------------------------------------------- */
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  renderQuestion();
}

/* ---------------------------------------------------------------
   ENTRY POINT — initialise when DOM is ready
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
});
