/* =============================================================
   calculator.js — ArthShastra CPI Calculator
   Computes weighted CPI from user-adjusted category prices.
   Methodology mirrors MoSPI's Laspeyres Price Index approach.
   ============================================================= */

/* ---------------------------------------------------------------
   CPI Categories: official weights from MoSPI (Base Year 2012)
   Each "base" price is normalised to 100 (= base year index).
   User adjusts "current" price via slider (range: 80–200).
--------------------------------------------------------------- */
const CPI_CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Beverages',
    icon: '🌾',
    weight: 45.86,
    color: '#FF6B2B',
    default: 100,
    min: 80, max: 200,
    note: 'Cereals, pulses, vegetables, oil, milk'
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    icon: '📦',
    weight: 28.32,
    color: '#38BDF8',
    default: 100,
    min: 80, max: 180,
    note: 'Education, health, transport'
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    weight: 10.07,
    color: '#00D9A5',
    default: 100,
    min: 80, max: 175,
    note: 'Rent & maintenance (Urban only)'
  },
  {
    id: 'fuel',
    name: 'Fuel & Light',
    icon: '⛽',
    weight: 6.84,
    color: '#F5B742',
    default: 100,
    min: 80, max: 220,
    note: 'LPG, kerosene, firewood'
  },
  {
    id: 'clothing',
    name: 'Clothing & Footwear',
    icon: '👕',
    weight: 6.53,
    color: '#a78bfa',
    default: 100,
    min: 80, max: 175,
    note: 'Garments, footwear, tailoring'
  },
  {
    id: 'tobacco',
    name: 'Pan, Tobacco & Intoxicants',
    icon: '🚭',
    weight: 2.38,
    color: '#fb7185',
    default: 100,
    min: 80, max: 200,
    note: 'Bidis, cigarettes, pan masala'
  }
];

/* Current prices state (initialised at base = 100) */
const prices = {};
CPI_CATEGORIES.forEach(c => { prices[c.id] = c.default; });

/* ---------------------------------------------------------------
   DOM INJECTION — render slider rows
--------------------------------------------------------------- */
function buildCalculatorRows() {
  const container = document.getElementById('calcRows');
  if (!container) return;

  container.innerHTML = CPI_CATEGORIES.map(cat => `
    <div class="calc-row" id="row-${cat.id}">
      <div class="cr-icon">${cat.icon}</div>
      <div class="cr-info">
        <span class="cr-name">${cat.name}</span>
        <span class="cr-weight">Weight: ${cat.weight}% &nbsp;|&nbsp; ${cat.note}</span>
      </div>
      <div class="cr-controls">
        <div class="cr-slider-wrap">
          <input
            type="range"
            id="slider-${cat.id}"
            min="${cat.min}"
            max="${cat.max}"
            value="${cat.default}"
            step="1"
            aria-label="${cat.name} price index"
            oninput="onSliderChange('${cat.id}', this.value)"
            style="accent-color:${cat.color}"
          />
          <span class="cr-price-display" id="price-${cat.id}">₹100</span>
        </div>
        <span class="cr-delta neutral" id="delta-${cat.id}">0.0%</span>
      </div>
    </div>
  `).join('');

  buildContribBars();
  updateResults(); // initial render
}

/* Build contribution bar placeholders */
function buildContribBars() {
  const container = document.getElementById('contribBars');
  if (!container) return;

  container.innerHTML = CPI_CATEGORIES.map(cat => `
    <div class="cb-item" id="contrib-${cat.id}">
      <div class="cb-meta">
        <span>${cat.icon} ${cat.name}</span>
        <span id="contrib-val-${cat.id}">0.00 pts</span>
      </div>
      <div class="cb-bar-track">
        <div class="cb-bar" id="contrib-bar-${cat.id}" style="background:${cat.color};width:0%"></div>
      </div>
    </div>
  `).join('');
}

/* ---------------------------------------------------------------
   SLIDER CHANGE HANDLER
--------------------------------------------------------------- */
function onSliderChange(id, value) {
  prices[id] = parseFloat(value);

  // Update price display
  const priceEl = document.getElementById(`price-${id}`);
  if (priceEl) priceEl.textContent = `₹${parseFloat(value).toFixed(0)}`;

  // Update delta badge
  const delta = ((value - 100) / 100) * 100;
  const deltaEl = document.getElementById(`delta-${id}`);
  if (deltaEl) {
    deltaEl.textContent = (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%';
    deltaEl.className = 'cr-delta ' + (delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral');
  }

  updateResults();
}

/* ---------------------------------------------------------------
   CORE CALCULATION — Laspeyres CPI formula
   CPI = Σ (Price_i / BasePrice_i) × Weight_i
   Since BasePrice = 100 for all, ratio = currentPrice / 100
--------------------------------------------------------------- */
function calculateCPI() {
  let cpi = 0;
  const contributions = {};

  CPI_CATEGORIES.forEach(cat => {
    const ratio = prices[cat.id] / 100;           // price relative
    const contribution = ratio * cat.weight;       // weighted contribution
    cpi += contribution;
    contributions[cat.id] = contribution;
  });

  return { cpi, contributions };
}

/* ---------------------------------------------------------------
   UPDATE UI — results panel, gauge, contribution bars
--------------------------------------------------------------- */
function updateResults() {
  const { cpi, contributions } = calculateCPI();
  const inflationRate = ((cpi - 100) / 100) * 100; // % change from base

  // --- CPI Value display ---
  const cpiEl = document.getElementById('cpiValue');
  if (cpiEl) {
    cpiEl.textContent = cpi.toFixed(2);
    cpiEl.style.color = inflationRate > 6 ? '#FF6B2B' :
                        inflationRate > 0 ? '#F5B742' : '#00D9A5';
  }

  // --- Inflation rate display ---
  const rateEl = document.getElementById('inflationRate');
  if (rateEl) {
    rateEl.textContent = (inflationRate >= 0 ? '+' : '') + inflationRate.toFixed(2) + '%';
    rateEl.style.color = inflationRate > 6 ? '#FF6B2B' :
                         inflationRate > 2 ? '#F5B742' : '#00D9A5';
  }

  // --- Status badge ---
  const statusEl = document.getElementById('inflationStatus');
  if (statusEl) {
    const { label, color, bg } = getInflationStatus(inflationRate);
    statusEl.textContent = label;
    statusEl.style.background = bg;
    statusEl.style.color = color;
  }

  // --- RBI Response ---
  const rbiEl = document.getElementById('rbiResponse');
  if (rbiEl) rbiEl.textContent = getRBIResponse(inflationRate);

  // --- Interpretation text ---
  const interpEl = document.getElementById('calcInterpretation');
  if (interpEl) interpEl.textContent = getInterpretation(inflationRate, cpi);

  // --- Gauge update ---
  updateGauge(inflationRate);

  // --- Contribution bars ---
  const maxContrib = Math.max(...Object.values(contributions));
  CPI_CATEGORIES.forEach(cat => {
    const val = contributions[cat.id];
    const barPct = maxContrib > 0 ? (val / maxContrib) * 100 : 0;

    const valEl = document.getElementById(`contrib-val-${cat.id}`);
    if (valEl) valEl.textContent = val.toFixed(2) + ' pts';

    const barEl = document.getElementById(`contrib-bar-${cat.id}`);
    if (barEl) barEl.style.width = barPct + '%';
  });
}

/* ---------------------------------------------------------------
   GAUGE SVG NEEDLE & ARC ANIMATION
   Needle rotates from -90° (left) to +90° (right) = 0–15% inflation
--------------------------------------------------------------- */
function updateGauge(inflationRate) {
  const needle = document.getElementById('gaugeNeedle');
  const activeArc = document.getElementById('gaugeActive');
  if (!needle || !activeArc) return;

  // Clamp rotation: -90° (0%) to +90° (>12%)
  const clampedRate = Math.max(-2, Math.min(inflationRate, 12));
  const rotation = ((clampedRate + 2) / 14) * 180 - 90; // map [-2,12] → [-90,90]

  needle.setAttribute('transform', `rotate(${rotation} 110 110)`);

  // Active arc color based on inflation zone
  const arcColor = inflationRate < 2 ? '#38BDF8' :
                   inflationRate <= 6 ? '#00D9A5' :
                   inflationRate <= 9 ? '#F5B742' : '#FF6B2B';
  activeArc.setAttribute('stroke', arcColor);

  // Draw arc proportional to inflation (0% = no arc, 12% = full arc)
  const pct = Math.max(0, Math.min(inflationRate / 12, 1));
  const circumHalf = Math.PI * 90; // half circumference of r=90 semicircle ≈ 282.7
  const dashLen = pct * circumHalf;
  activeArc.setAttribute('stroke-dasharray', `${dashLen} ${circumHalf}`);
}

/* ---------------------------------------------------------------
   HELPER FUNCTIONS — labels and text
--------------------------------------------------------------- */
function getInflationStatus(rate) {
  if (rate < 0)  return { label: 'Deflation ⚠️',        color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' };
  if (rate < 2)  return { label: 'Very Low',             color: '#38BDF8', bg: 'rgba(56,189,248,0.15)' };
  if (rate <= 4) return { label: 'On Target ✅',         color: '#00D9A5', bg: 'rgba(0,217,165,0.15)'  };
  if (rate <= 6) return { label: 'Tolerable',            color: '#F5B742', bg: 'rgba(245,183,66,0.15)' };
  if (rate <= 9) return { label: 'High ⚠️',              color: '#FB923C', bg: 'rgba(251,146,60,0.15)' };
  return             { label: 'Critical 🚨',             color: '#FF6B2B', bg: 'rgba(255,107,43,0.2)'  };
}

function getRBIResponse(rate) {
  if (rate < 0)  return 'May cut Repo Rate to stimulate demand';
  if (rate < 2)  return 'Possible Repo Rate cut; watch growth data';
  if (rate <= 4) return 'No immediate action needed — target zone';
  if (rate <= 6) return 'MPC on alert; may signal rate pause';
  if (rate <= 9) return 'Likely Repo Rate hike; tighten liquidity';
  return             'Emergency tightening; multiple rate hikes likely';
}

function getInterpretation(rate, cpi) {
  if (rate < 0) return `CPI at ${cpi.toFixed(2)} signals deflation (${rate.toFixed(2)}%). Prices are falling, which sounds good but can hurt producers and slow the economy. RBI may cut rates to stimulate spending.`;
  if (rate < 2) return `CPI at ${cpi.toFixed(2)} — inflation of ${rate.toFixed(2)}% is below RBI's comfort zone. While consumers benefit short-term, persistently low inflation can signal weak demand.`;
  if (rate <= 4) return `CPI at ${cpi.toFixed(2)} — inflation of ${rate.toFixed(2)}% is within RBI's target range of 2–6%. This is the ideal scenario: moderate price growth supports economic activity without eroding purchasing power significantly.`;
  if (rate <= 6) return `CPI at ${cpi.toFixed(2)} — inflation of ${rate.toFixed(2)}% is within the tolerance band (up to 6%). RBI will monitor closely. If sustained above 5%, expect a hawkish tone at MPC meetings.`;
  if (rate <= 9) return `CPI at ${cpi.toFixed(2)} — inflation of ${rate.toFixed(2)}% has breached the 6% upper tolerance. RBI is legally obligated to respond. Expect Repo Rate hikes, reducing money supply and credit growth.`;
  return `CPI at ${cpi.toFixed(2)} — inflation of ${rate.toFixed(2)}% is critically high. Real purchasing power is eroding rapidly. Emergency monetary tightening, possible import duty changes, and supply-side interventions become necessary.`;
}

/* ---------------------------------------------------------------
   RESET — restore all sliders to base year (100)
--------------------------------------------------------------- */
function resetCalculator() {
  CPI_CATEGORIES.forEach(cat => {
    prices[cat.id] = cat.default;
    const slider = document.getElementById(`slider-${cat.id}`);
    if (slider) slider.value = cat.default;

    const priceEl = document.getElementById(`price-${cat.id}`);
    if (priceEl) priceEl.textContent = '₹100';

    const deltaEl = document.getElementById(`delta-${cat.id}`);
    if (deltaEl) { deltaEl.textContent = '0.0%'; deltaEl.className = 'cr-delta neutral'; }
  });
  updateResults();
}

/* ---------------------------------------------------------------
   INIT — animate basket weight bars on scroll entry
--------------------------------------------------------------- */
function initWeightBars() {
  const bars = document.querySelectorAll('.wr-bar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w = bar.style.getPropertyValue('--w') ||
                  bar.closest('.weight-row')?.dataset.w || 0;
        // Animate width from 0 to correct % of 100 (max weight ~46)
        setTimeout(() => {
          bar.style.width = ((parseFloat(w) / 46) * 100) + '%';
        }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

function initFiscalBars() {
  const bars = document.querySelectorAll('.fm-bar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Width already set inline in HTML — just trigger transition
        const bar = entry.target;
        const target = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = target; }, 80);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/* ---------------------------------------------------------------
   ENTRY POINT
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  buildCalculatorRows();
  initWeightBars();
  initFiscalBars();
});
