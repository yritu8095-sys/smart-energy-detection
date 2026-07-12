// app.js — Vidyut Suraksha Energy Theft Detection System

let charts = {};

// ===== NAVIGATION =====
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  const titles = { dashboard:'Dashboard', consumers:'Consumer Monitor', alerts:'Alert Center', analytics:'Analytics', inspections:'Field Inspections', map:'Zone Heat Map' };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  initPage(page);
}

function initPage(page) {
  if (page === 'dashboard') initDashboard();
  if (page === 'consumers') renderConsumers(DATA.consumers);
  if (page === 'alerts') renderAlerts();
  if (page === 'analytics') initAnalytics();
  if (page === 'inspections') renderInspections();
  if (page === 'map') initMap();
}

// ===== SIDEBAR =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== DASHBOARD =====
function initDashboard() {
  renderDashZones();
  renderDashSuspects();
  renderDashAlerts();
  if (!charts.hourly) initHourlyChart();
}

function renderDashZones() {
  const el = document.getElementById('dashZoneList');
  if (!el) return;
  el.innerHTML = DATA.zones.map(z => {
    const cls = z.loss > 12 ? 'bad' : z.loss > 5 ? 'warn' : 'good';
    const color = z.loss > 12 ? '#ef4444' : z.loss > 5 ? '#f59e0b' : '#10b981';
    const pct = Math.min(100, z.loss * 5);
    return `<div class="zone-row">
      <div class="zone-name-cell">${z.name} <span style="font-size:10px;color:var(--text3);">${z.type}</span></div>
      <div class="zone-bar-wrap"><div class="zone-bar-fill" style="width:${pct}%;background:${color};"></div></div>
      <div class="zone-pct ${cls}">${z.loss}%</div>
    </div>`;
  }).join('');
}

function renderDashSuspects() {
  const el = document.getElementById('dashSuspects');
  if (!el) return;
  const suspects = DATA.consumers.filter(c => c.status !== 'normal').slice(0,4);
  el.innerHTML = suspects.map(c => {
    const dev = Math.round(((c.usage - c.expected) / c.expected) * 100);
    const initials = c.name.split(' ').map(w=>w[0]).join('').slice(0,2);
    return `<div class="suspect-item" onclick="showConsumerModal('${c.id}')" style="cursor:pointer;">
      <div class="suspect-avatar ${c.status}">${initials}</div>
      <div>
        <div class="suspect-name">${c.name}</div>
        <div class="suspect-id">${c.id} · Zone ${c.zone}</div>
      </div>
      <div class="suspect-dev ${c.status}">+${dev}%</div>
    </div>`;
  }).join('');
}

function renderDashAlerts() {
  const el = document.getElementById('dashAlerts');
  if (!el) return;
  el.innerHTML = DATA.alerts.slice(0,4).map(a => `
    <div class="alert-item-dash">
      <div class="alert-dot ${a.type}"></div>
      <div class="alert-text">
        <div class="alert-title-dash">${a.title}</div>
        <div class="alert-time-dash">${a.time} · ${a.consumer}</div>
      </div>
    </div>`).join('');
}

function initHourlyChart() {
  const ctx = document.getElementById('hourlyChart');
  if (!ctx) return;
  charts.hourly = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA.hourlyUsage.labels,
      datasets: [
        {
          label: 'Baseline (kWh)',
          data: DATA.hourlyUsage.baseline,
          backgroundColor: 'rgba(59,130,246,0.35)',
          borderColor: 'rgba(59,130,246,0.7)',
          borderWidth: 1,
          borderRadius: 3
        },
        {
          label: 'Anomaly (kWh)',
          data: DATA.hourlyUsage.anomaly,
          backgroundColor: 'rgba(239,68,68,0.8)',
          borderColor: '#ef4444',
          borderWidth: 1,
          borderRadius: 3
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }, grid: { display: false } },
        y: { ticks: { color: '#64748b', font: { size: 11 }, callback: v => v+'kWh' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

// ===== CONSUMERS PAGE =====
function renderConsumers(list) {
  const tbody = document.getElementById('consumersTbody');
  if (!tbody) return;
  tbody.innerHTML = list.map(c => {
    const dev = Math.round(((c.usage - c.expected) / c.expected) * 100);
    const devColor = dev > 30 ? '#ef4444' : dev > 15 ? '#f59e0b' : '#64748b';
    return `<tr class="row-${c.status}">
      <td class="mono">${c.id}</td>
      <td style="font-weight:500;color:var(--text);">${c.name}</td>
      <td>Zone ${c.zone}</td>
      <td class="mono">${c.usage} kWh</td>
      <td class="mono">${c.expected} kWh</td>
      <td class="mono" style="color:${devColor};font-weight:600;">${dev > 0?'+':''}${dev}%</td>
      <td><span class="badge ${c.status}">${c.status==='theft'?'⚡ Suspected Theft':c.status==='warn'?'⚠ High Usage':'✓ Normal'}</span></td>
      <td><button class="btn-sm primary" onclick="showConsumerModal('${c.id}')">Details</button></td>
    </tr>`;
  }).join('');
}

function filterConsumers() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const zone = document.getElementById('zoneFilter').value;
  const filtered = DATA.consumers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search) || c.id.toLowerCase().includes(search);
    const matchStatus = status === 'all' || c.status === status;
    const matchZone = zone === 'all' || c.zone === zone;
    return matchSearch && matchStatus && matchZone;
  });
  renderConsumers(filtered);
}

function showConsumerModal(id) {
  const c = DATA.consumers.find(x => x.id === id);
  if (!c) return;
  const dev = Math.round(((c.usage - c.expected) / c.expected) * 100);
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-title">Consumer Details — ${c.id}</div>
    <div class="modal-row"><div class="modal-label">Name</div><div class="modal-value" style="font-weight:600;">${c.name}</div></div>
    <div class="modal-row"><div class="modal-label">Meter No.</div><div class="modal-value mono">${c.meterNo}</div></div>
    <div class="modal-row"><div class="modal-label">Address</div><div class="modal-value">${c.address}</div></div>
    <div class="modal-row"><div class="modal-label">Zone</div><div class="modal-value">Sector ${c.zone}</div></div>
    <div class="modal-row"><div class="modal-label">Today's Usage</div><div class="modal-value mono" style="color:${c.status==='theft'?'#ef4444':c.status==='warn'?'#f59e0b':'var(--green)'};">${c.usage} kWh</div></div>
    <div class="modal-row"><div class="modal-label">Expected</div><div class="modal-value mono">${c.expected} kWh</div></div>
    <div class="modal-row"><div class="modal-label">Deviation</div><div class="modal-value mono" style="font-weight:600;color:${dev>30?'#ef4444':dev>15?'#f59e0b':'var(--green)'};">${dev>0?'+':''}${dev}%</div></div>
    <div class="modal-row"><div class="modal-label">Last Bill</div><div class="modal-value">₹${c.lastBill.toLocaleString()}</div></div>
    <div class="modal-row"><div class="modal-label">Status</div><div class="modal-value"><span class="badge ${c.status}">${c.status==='theft'?'⚡ Suspected Theft':c.status==='warn'?'⚠ High Usage':'✓ Normal'}</span></div></div>
    <div style="margin-top:20px;display:flex;gap:10px;">
      <button class="btn-primary" onclick="scheduleInspection('${c.id}');closeModalEl()">Schedule Inspection</button>
      <button class="btn-sm" onclick="closeModalEl()">Close</button>
    </div>`;
  document.getElementById('modal').classList.add('show');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalEl();
}
function closeModalEl() { document.getElementById('modal').classList.remove('show'); }

// ===== ALERTS PAGE =====
function renderAlerts() {
  const el = document.getElementById('alertsList');
  if (!el) return;
  const icons = { theft: '⚡', warn: '⚠', info: 'ℹ' };
  el.innerHTML = DATA.alerts.map(a => `
    <div class="alert-full-item ${a.type}">
      <div class="alert-icon-lg ${a.type}">${icons[a.type]||'!'}</div>
      <div class="alert-content">
        <div class="alert-full-title">${a.title}</div>
        <div class="alert-full-desc">${a.desc}</div>
        <div class="alert-meta">
          <span>🕐 ${a.time}</span>
          <span>📍 Consumer: ${a.consumer}</span>
          <span><span class="badge ${a.priority}">${a.priority.toUpperCase()}</span></span>
        </div>
      </div>
      <div class="alert-actions">
        <button class="btn-sm primary" onclick="showConsumerModal('${a.consumer}')">View</button>
        <button class="btn-sm" onclick="dismissAlert(${a.id}, this)">Dismiss</button>
      </div>
    </div>`).join('');
}

function dismissAlert(id, btn) {
  btn.closest('.alert-full-item').style.opacity = '0.4';
  btn.textContent = 'Dismissed';
  btn.disabled = true;
  showToast('Alert dismissed', 'success');
}

// ===== ANALYTICS PAGE =====
function initAnalytics() {
  setTimeout(() => {
    initWeeklyChart();
    initDonutChart();
    initZoneBarChart();
  }, 50);
}

function initWeeklyChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx || charts.weekly) return;
  charts.weekly = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DATA.weeklyLoss.labels,
      datasets: [{
        label: 'Loss %',
        data: DATA.weeklyLoss.values,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b', font:{size:12} }, grid: { display: false } },
        y: { ticks: { color: '#64748b', callback: v=>v+'%' }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function initDonutChart() {
  const ctx = document.getElementById('donutChart');
  if (!ctx || charts.donut) return;
  charts.donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Direct Bypass', 'Hook Connection', 'Meter Tampering', 'Night Spike', 'Phase Imbalance'],
      datasets: [{
        data: [35, 22, 18, 15, 10],
        backgroundColor: ['#ef4444','#f59e0b','#8b5cf6','#3b82f6','#14b8a6'],
        borderWidth: 2,
        borderColor: '#111827'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font:{size:11}, padding: 12, boxWidth: 12 }
        }
      }
    }
  });
}

function initZoneBarChart() {
  const ctx = document.getElementById('zoneBarChart');
  if (!ctx || charts.zonebar) return;
  charts.zonebar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA.zones.map(z => z.name + ' (' + z.type + ')'),
      datasets: [
        {
          label: 'Supplied (kWh)',
          data: DATA.zones.map(z => z.units),
          backgroundColor: 'rgba(59,130,246,0.4)',
          borderRadius: 4
        },
        {
          label: 'Lost (kWh)',
          data: DATA.zones.map(z => Math.round(z.units * z.loss / 100)),
          backgroundColor: 'rgba(239,68,68,0.7)',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font:{size:12}, boxWidth: 12 }
        }
      },
      scales: {
        x: { ticks: { color: '#64748b', font:{size:10}, maxRotation: 30 }, grid: { display: false } },
        y: { ticks: { color: '#64748b', callback: v => v>=1000 ? (v/1000).toFixed(1)+'k' : v }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

// ===== INSPECTIONS =====
function renderInspections() {
  const tbody = document.getElementById('inspectionsTbody');
  if (!tbody) return;
  tbody.innerHTML = DATA.inspections.map(i => `
    <tr>
      <td class="mono">${i.id}</td>
      <td>${i.consumer}</td>
      <td>${i.officer}</td>
      <td>${i.date}</td>
      <td><span class="badge ${i.status}">${i.status.charAt(0).toUpperCase()+i.status.slice(1)}</span></td>
      <td style="color:var(--text2);">${i.finding}</td>
      <td style="color:var(--text2);">${i.action}</td>
    </tr>`).join('');
}

function submitInspection(e) {
  e.preventDefault();
  const id = document.getElementById('newConsumerId').value;
  const officer = document.getElementById('newOfficer').value;
  const date = document.getElementById('newDate').value;
  if (!id || !officer || !date) { showToast('Please fill all fields', 'error'); return false; }
  DATA.inspections.unshift({ id: 'INS-00'+( DATA.inspections.length+1), consumer: id, officer, date, status: 'scheduled', finding: '—', action: 'Field visit pending' });
  renderInspections();
  document.getElementById('newConsumerId').value = '';
  document.getElementById('newOfficer').value = '';
  document.getElementById('newDate').value = '';
  showToast('Inspection scheduled for ' + id, 'success');
  return false;
}

function scheduleInspection(consumerId) {
  navigate('inspections');
  setTimeout(() => {
    document.getElementById('newConsumerId').value = consumerId;
    document.getElementById('newConsumerId').focus();
  }, 100);
}

// ===== MAP PAGE =====
function initMap() {
  const el = document.getElementById('mapViz');
  if (!el || el.dataset.init) return;
  el.dataset.init = '1';

  const svg = `<svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="gA" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></radialGradient>
      <radialGradient id="gB" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
      <radialGradient id="gD" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.45"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
      <radialGradient id="gE" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.55"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0"/></radialGradient>
    </defs>

    <!-- Grid lines -->
    <line x1="0" y1="0" x2="700" y2="0" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="0" y1="95" x2="700" y2="95" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="0" y1="190" x2="700" y2="190" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="0" y1="285" x2="700" y2="285" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="0" y1="380" x2="700" y2="380" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="0" y1="0" x2="0" y2="380" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="175" y1="0" x2="175" y2="380" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="350" y1="0" x2="350" y2="380" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="525" y1="0" x2="525" y2="380" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <line x1="700" y1="0" x2="700" y2="380" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>

    <!-- Zone heat blobs -->
    <ellipse cx="160" cy="120" rx="80" ry="70" fill="url(#gA)" />
    <ellipse cx="400" cy="100" rx="90" ry="75" fill="url(#gB)" />
    <ellipse cx="560" cy="200" rx="75" ry="65" fill="url(#gA)" />
    <ellipse cx="280" cy="260" rx="95" ry="80" fill="url(#gD)" />
    <ellipse cx="460" cy="300" rx="100" ry="85" fill="url(#gE)" />
    <ellipse cx="100" cy="300" rx="70" ry="60" fill="url(#gA)" />

    <!-- Transmission lines -->
    <line x1="160" y1="120" x2="400" y2="100" stroke="rgba(59,130,246,0.25)" stroke-width="1.5" stroke-dasharray="6,4"/>
    <line x1="400" y1="100" x2="560" y2="200" stroke="rgba(59,130,246,0.25)" stroke-width="1.5" stroke-dasharray="6,4"/>
    <line x1="280" y1="260" x2="460" y2="300" stroke="rgba(239,68,68,0.3)" stroke-width="1.5" stroke-dasharray="6,4"/>
    <line x1="160" y1="120" x2="280" y2="260" stroke="rgba(59,130,246,0.2)" stroke-width="1.5" stroke-dasharray="6,4"/>
    <line x1="100" y1="300" x2="280" y2="260" stroke="rgba(59,130,246,0.2)" stroke-width="1.5" stroke-dasharray="6,4"/>

    <!-- Zone A -->
    <circle cx="160" cy="120" r="36" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="160" cy="120" r="6" fill="#10b981"/>
    <text x="160" y="105" text-anchor="middle" fill="#10b981" font-size="12" font-family="Space Grotesk" font-weight="600">Sec A</text>
    <text x="160" y="165" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Space Grotesk">4.1% loss</text>

    <!-- Zone B -->
    <circle cx="400" cy="100" r="36" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="400" cy="100" r="6" fill="#f59e0b"/>
    <text x="400" y="85" text-anchor="middle" fill="#f59e0b" font-size="12" font-family="Space Grotesk" font-weight="600">Sec B</text>
    <text x="400" y="145" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Space Grotesk">6.7% loss</text>

    <!-- Zone C -->
    <circle cx="560" cy="200" r="36" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="560" cy="200" r="6" fill="#10b981"/>
    <text x="560" y="185" text-anchor="middle" fill="#10b981" font-size="12" font-family="Space Grotesk" font-weight="600">Sec C</text>
    <text x="560" y="245" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Space Grotesk">2.3% loss</text>

    <!-- Zone D — ALERT -->
    <circle cx="280" cy="260" r="42" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2"/>
    <circle cx="280" cy="260" r="42" fill="none" stroke="rgba(239,68,68,0.3)" stroke-width="8"/>
    <circle cx="280" cy="260" r="7" fill="#ef4444"/>
    <text x="280" y="243" text-anchor="middle" fill="#ef4444" font-size="12" font-family="Space Grotesk" font-weight="600">Sec D ⚠</text>
    <text x="280" y="313" text-anchor="middle" fill="rgba(239,100,100,0.8)" font-size="10" font-family="Space Grotesk">14.8% loss</text>

    <!-- Zone E — HIGH ALERT -->
    <circle cx="460" cy="300" r="46" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="2.5"/>
    <circle cx="460" cy="300" r="46" fill="none" stroke="rgba(239,68,68,0.25)" stroke-width="12"/>
    <circle cx="460" cy="300" r="8" fill="#ef4444"/>
    <text x="460" y="283" text-anchor="middle" fill="#ef4444" font-size="13" font-family="Space Grotesk" font-weight="600">Sec E ⚡</text>
    <text x="460" y="355" text-anchor="middle" fill="rgba(239,100,100,0.8)" font-size="10" font-family="Space Grotesk">18.2% loss</text>

    <!-- Zone F -->
    <circle cx="100" cy="300" r="32" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="100" cy="300" r="6" fill="#10b981"/>
    <text x="100" y="285" text-anchor="middle" fill="#10b981" font-size="12" font-family="Space Grotesk" font-weight="600">Sec F</text>
    <text x="100" y="340" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="10" font-family="Space Grotesk">3.9% loss</text>

    <!-- Legend -->
    <rect x="20" y="20" width="130" height="60" rx="6" fill="rgba(17,24,39,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
    <circle cx="38" cy="38" r="5" fill="#10b981"/>
    <text x="50" y="42" fill="rgba(255,255,255,0.7)" font-size="10" font-family="Space Grotesk">Normal (&lt;6%)</text>
    <circle cx="38" cy="56" r="5" fill="#f59e0b"/>
    <text x="50" y="60" fill="rgba(255,255,255,0.7)" font-size="10" font-family="Space Grotesk">Warning (6–12%)</text>
    <circle cx="38" cy="70" r="5" fill="#ef4444"/>
    <text x="50" y="74" fill="rgba(255,255,255,0.7)" font-size="10" font-family="Space Grotesk">Critical (&gt;12%)</text>
  </svg>`;

  el.innerHTML = svg;

  const zoneGrid = document.getElementById('zoneCardsGrid');
  if (!zoneGrid) return;
  zoneGrid.innerHTML = DATA.zones.map(z => {
    const cls = z.loss > 12 ? 'alert-zone' : z.loss > 5 ? 'warn-zone' : '';
    const lossCls = z.loss > 12 ? 'bad' : z.loss > 5 ? 'warn' : 'good';
    return `<div class="zone-card-full ${cls}">
      <div class="zcf-header">
        <div><div class="zcf-name">${z.name}</div><div class="zcf-type">${z.type}</div></div>
        <div class="zcf-loss ${lossCls}">${z.loss}%</div>
      </div>
      <div class="zcf-stats">
        <span>👥 ${z.consumers} consumers</span>
        <span>⚡ ${z.units.toLocaleString()} kWh</span>
      </div>
    </div>`;
  }).join('');
}

// ===== REFRESH =====
function refreshData() {
  const btn = document.querySelector('.refresh-btn svg');
  if (btn) btn.style.animation = 'spin 0.8s linear infinite';
  setTimeout(() => {
    if (btn) btn.style.animation = '';
    document.getElementById('syncTime').textContent = 'Just now';
    showToast('Data refreshed successfully', 'success');
  }, 900);
}

// ===== TOAST =====
function showToast(msg, type='success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== SPIN KEYFRAMES =====
const style = document.createElement('style');
style.textContent = `@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`;
document.head.appendChild(style);

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});
