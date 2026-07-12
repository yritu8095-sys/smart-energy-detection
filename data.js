// data.js - Mock data for Energy Theft Detection System

const DATA = {
  summary: {
    totalConsumers: 1247,
    unitsSupplied: 84320,
    lossPercent: 9.4,
    lossUnits: 7926,
    activeAlerts: 14,
    revenueLoss: 68400,
    lastSync: "2 min ago",
    systemStatus: "active"
  },

  zones: [
    { id: "A", name: "Sector A", type: "Residential", consumers: 312, loss: 4.1, units: 18200, status: "normal", lat: 23.03, lng: 72.58 },
    { id: "B", name: "Sector B", type: "Commercial",  consumers: 198, loss: 6.7, units: 22400, status: "warn",   lat: 23.04, lng: 72.59 },
    { id: "C", name: "Sector C", type: "Industrial",  consumers: 87,  loss: 2.3, units: 31000, status: "normal", lat: 23.02, lng: 72.57 },
    { id: "D", name: "Sector D", type: "Mixed",       consumers: 274, loss: 14.8,units: 8100,  status: "alert",  lat: 23.05, lng: 72.56 },
    { id: "E", name: "Sector E", type: "Slum",        consumers: 243, loss: 18.2,units: 3200,  status: "alert",  lat: 23.01, lng: 72.60 },
    { id: "F", name: "Sector F", type: "Rural",       consumers: 133, loss: 3.9, units: 1420,  status: "normal", lat: 23.06, lng: 72.55 }
  ],

  consumers: [
    { id: "C4-201", name: "Ramesh Yadav",    zone: "D", address: "Plot 201, Sector D", usage: 182, expected: 94,  status: "theft",  meterNo: "MT-98231", lastBill: 840,  phone: "98XXXXXXXX" },
    { id: "E2-087", name: "Sunita Devi",     zone: "E", address: "House 87, Sector E", usage: 134, expected: 71,  status: "theft",  meterNo: "MT-77612", lastBill: 620,  phone: "97XXXXXXXX" },
    { id: "B1-012", name: "Bharat Stores",   zone: "B", address: "Shop 12, Main Rd",   usage: 410, expected: 310, status: "warn",   meterNo: "MT-44320", lastBill: 3100, phone: "96XXXXXXXX" },
    { id: "D3-044", name: "Rani Kumari",     zone: "D", address: "Flat 44, Block D3",  usage: 99,  expected: 68,  status: "warn",   meterNo: "MT-55891", lastBill: 680,  phone: "95XXXXXXXX" },
    { id: "C2-005", name: "Mehta Textiles",  zone: "C", address: "GIDC Plot 5, Sec C", usage: 1840,expected: 1810,status: "normal", meterNo: "MT-11042", lastBill: 18100,phone: "94XXXXXXXX" },
    { id: "A7-013", name: "Om Prakash",      zone: "A", address: "H.No 13, Sector A",  usage: 48,  expected: 51,  status: "normal", meterNo: "MT-33281", lastBill: 510,  phone: "93XXXXXXXX" },
    { id: "E5-031", name: "Kamlesh Nagar",   zone: "E", address: "Chawl 31, Sector E", usage: 211, expected: 88,  status: "theft",  meterNo: "MT-66743", lastBill: 880,  phone: "92XXXXXXXX" },
    { id: "B3-078", name: "Pooja Restaurant",zone: "B", address: "Market Lane, B3",    usage: 560, expected: 490, status: "warn",   meterNo: "MT-22198", lastBill: 4900, phone: "91XXXXXXXX" }
  ],

  alerts: [
    { id: 1, type: "theft",   title: "Direct bypass detected",         desc: "Meter tampered at E2-087, Sector E. Immediate field inspection required.", time: "11 min ago", consumer: "E2-087", priority: "high"   },
    { id: 2, type: "theft",   title: "Hook connection found",           desc: "Illegal hook from transformer line near C4-201. Power disconnected.",       time: "38 min ago", consumer: "C4-201", priority: "high"   },
    { id: 3, type: "warn",    title: "Abnormal consumption pattern",    desc: "Load factor 93% above baseline at C4-201 for 3 consecutive days.",          time: "43 min ago", consumer: "C4-201", priority: "medium" },
    { id: 4, type: "warn",    title: "Neutral wire manipulation",       desc: "Irregular phase imbalance at D3-044. Possible partial meter bypass.",       time: "2 hr ago",   consumer: "D3-044", priority: "medium" },
    { id: 5, type: "info",    title: "Meter read failure",              desc: "Smart meter B1-012 failed to transmit. Manual verification scheduled.",     time: "4 hr ago",   consumer: "B1-012", priority: "low"    },
    { id: 6, type: "theft",   title: "Night-time spike detected",       desc: "E5-031 shows 240% usage surge between 11pm-4am for 5 days.",               time: "6 hr ago",   consumer: "E5-031", priority: "high"   },
    { id: 7, type: "info",    title: "New smart meter installed",       desc: "Meter upgrade complete at A7-013. Baseline recalibration in progress.",      time: "1 day ago",  consumer: "A7-013", priority: "low"    }
  ],

  hourlyUsage: {
    labels: ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"],
    baseline: [410,380,350,340,340,420,680,850,920,880,910,870,840,820,830,860,880,900,950,910,840,780,700,580],
    anomaly:  [null,null,null,null,null,null,null,null,null,1820,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
  },

  weeklyLoss: {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    values: [7.2, 8.1, 9.4, 8.8, 10.2, 9.1, 9.4]
  },

  inspections: [
    { id: "INS-001", consumer: "E2-087", officer: "Sub-Engineer Patel", date: "2024-01-15", status: "completed", finding: "Bypass wire found", action: "FIR registered" },
    { id: "INS-002", consumer: "C4-201", officer: "Sub-Engineer Sharma", date: "2024-01-16", status: "pending",   finding: "Under investigation", action: "Scheduled" },
    { id: "INS-003", consumer: "E5-031", officer: "Sub-Engineer Kumar",  date: "2024-01-17", status: "scheduled", finding: "—", action: "Field visit pending" }
  ]
};
