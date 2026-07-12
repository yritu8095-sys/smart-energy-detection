# ⚡ Vidyut Suraksha — Smart Energy Theft Detection System

> A real-time electricity theft detection and monitoring dashboard for Indian power distribution networks (DISCOMs).

![License](https://img.shields.io/badge/license-MIT-blue)
![HTML](https://img.shields.io/badge/HTML5-pure-orange)
![CSS](https://img.shields.io/badge/CSS3-custom-blue)
![JS](https://img.shields.io/badge/JavaScript-vanilla-yellow)

---

## 🎯 Problem Statement

India loses **₹20,000+ crore annually** due to electricity theft. Distribution companies (DISCOMs) struggle to detect and act on theft quickly. This system provides an intelligent monitoring dashboard for field engineers and government electricity boards.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📊 **Real-time Dashboard** | Live metrics — units supplied, loss %, theft alerts, revenue loss |
| 🗺️ **Zone Heat Map** | Visual SVG map showing theft risk zones across sectors |
| 👥 **Consumer Monitor** | Per-consumer usage deviation with search, filter, and details modal |
| 🔔 **Alert Center** | Prioritized theft and anomaly notifications with dismiss actions |
| 📈 **Analytics** | Trend charts — weekly loss, alert type distribution, zone comparison |
| 📋 **Inspection Manager** | Schedule and track field inspection visits |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (no framework needed)
- **Charts**: Chart.js 4.4
- **Fonts**: Space Grotesk (Google Fonts), JetBrains Mono
- **Data**: Mock data in `src/data/data.js` (replace with real API)

---

## 📁 Project Structure

```
energy-theft-detection/
├── index.html              # Main SPA entry point
├── styles.css              # Full dark-theme design system
├── app.js                  # Application logic, navigation, charts
├── src/
│   └── data/
│       └── data.js         # Mock data (consumers, zones, alerts)
├── package.json
└── README.md
```

---

## ▶️ How to Run

### Option 1 — Python (no install needed)
```bash
cd energy-theft-detection
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 2 — VS Code Live Server
- Install **Live Server** extension
- Right-click `index.html` → "Open with Live Server"

### Option 3 — Node.js
```bash
npx serve .
```

---

## 🔌 Integrating Real Data

Replace mock data in `src/data/data.js` with your API:

```javascript
// Example: fetch from DISCOM API
async function loadData() {
  const response = await fetch('https://your-api.gov.in/consumption');
  const real = await response.json();
  DATA.consumers = real.consumers;
  renderConsumers(DATA.consumers);
}
```

---

## 📸 Pages

1. **Dashboard** — Summary metrics + hourly chart + zone overview
2. **Consumer Monitor** — Full table with search/filter + detail modal
3. **Alert Center** — Live feed with priority badges + dismiss
4. **Analytics** — Weekly trends, donut chart, zone bar chart
5. **Field Inspections** — Table + schedule new inspection form
6. **Zone Map** — SVG heat map of theft risk zones

---

## 🏛️ Government Use Case

This system is designed for:
- **State Electricity Boards** (e.g., UGVCL, MSEDCL, BESCOM)
- **DISCOM field teams** for inspection priority
- **Energy Audit departments** for monthly reporting
- **Smart meter integration** (IoT data → this dashboard)

---

## 📄 License

MIT — Free to use, modify, and deploy.

---

*Built for India's Electricity Distribution Sector | Vidyut Suraksha Team*
