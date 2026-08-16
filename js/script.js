const DATA = {
  SITES: [
    { id: 'SITE-01', name: 'Downtown Central Exchange', region: 'North' },
    { id: 'SITE-02', name: 'Metro Substation B', region: 'East' },
    { id: 'SITE-03', name: 'Airport Fiber Hub', region: 'West' }
  ],
  DEVICES: [
    { id: 'CORE-RT-01', name: 'Core Router Alpha', ip: '10.100.1.1', site: 'SITE-01', status: 'Online' },
    { id: 'AGG-SW-02', name: 'Aggregation Switch West', ip: '10.100.2.14', site: 'SITE-02', status: 'Degraded' },
    { id: 'OLT-GPON-03', name: 'GPON Optical Line Terminal', ip: '10.100.5.8', site: 'SITE-03', status: 'Online' }
  ],
  MANUAL: [
    { id: 'm1', title: 'Fiber Link Loss Troubleshooting', category: 'Transmission', body: '1. Check optical power meters at both RX and TX endpoints.\n2. Inspect patch cords for dust or micro-bends.\n3. Verify OTDR trace for high attenuation spikes or breaks.' },
    { id: 'm2', title: 'BGP Peer Flapping Resolution', category: 'Routing', body: '1. Check keepalive and hold timers on both routers.\n2. Verify interface error counters for CRC drops.\n3. Confirm firewall ACLs are not rate-limiting BGP port 179.' },
    { id: 'm3', title: 'Power Rectifier Failure Procedure', category: 'Power', body: '1. Verify AC mains input voltage.\n2. Inspect DC breaker panel and alarm relays.\n3. Dispatch field engineer if rectifier module replacement is required.' }
  ],
  SCENARIOS: [
    { id: 'sc1', title: 'Submarine Cable Cut Simulation', desc: 'Simulates multiple upstream BGP peer drops and massive packet loss across region.' },
    { id: 'sc2', title: 'Power Grid Blackout at Metro Substation', desc: 'AC failure cascading into battery backup depletion and site isolation.' }
  ]
};

const Store = {
  state: {
    currentView: 'dashboard',
    _searchQuery: '',
    _manualQuery: '',
    _selectedManualId: 'm1',
    mode: 'training',
    alarms: [
      { id: 'ALM-101', device: 'AGG-SW-02', site: 'SITE-02', type: 'High Optical Attenuation', severity: 'Critical', status: 'Active', time: '10:14 AM' },
      { id: 'ALM-102', device: 'CORE-RT-01', site: 'SITE-01', type: 'BGP Peer Flapping', severity: 'Major', status: 'Active', time: '10:22 AM' }
    ],
    tickets: [
      { id: 'INC-5001', title: 'Optical drop at Metro Substation', site: 'SITE-02', severity: 'Critical', status: 'Open', requiredSkill: 'Fiber Splicing', assignedEng: null, description: 'High bit error rate reported on aggregation uplink.' },
      { id: 'INC-5002', title: 'Router BGP instability', site: 'SITE-01', severity: 'Major', status: 'In Progress', requiredSkill: 'Routing & BGP', assignedEng: 'ENG-01', description: 'BGP session dropping every 30 minutes.' }
    ],
    engineers: [
      { id: 'ENG-01', name: 'Marcus Vance', skills: ['Routing & BGP', 'Core Switching'], status: 'Available', location: 'SITE-01' },
      { id: 'ENG-02', name: 'Elena Rostova', skills: ['Fiber Splicing', 'Transmission'], status: 'Available', location: 'SITE-03' },
      { id: 'ENG-03', name: 'David Kim', skills: ['Power Systems', 'RF Engineering'], status: 'On Site', location: 'SITE-02' }
    ],
    activity: [
      { time: '10:00 AM', message: 'Simulator initialized successfully.' },
      { time: '10:14 AM', message: 'Alarm ALM-101 triggered on AGG-SW-02.' }
    ]
  },
  dispatch(action, payload) {
    if (action === 'navigate') {
      this.state.currentView = payload;
    } else if (action === 'ack-alarm') {
      const alm = this.state.alarms.find(a => a.id === payload);
      if (alm) { alm.status = 'Acknowledged'; this.log(`Acknowledged alarm ${payload}`); }
    } else if (action === 'assign-fm') {
      const t = this.state.tickets.find(tk => tk.id === payload.ticket);
      if (t) { t.assignedEng = payload.eng; t.status = 'In Progress'; this.log(`Assigned ${payload.eng} to ticket ${payload.ticket}`); }
    } else if (action === 'launch-scenario') {
      const sc = DATA.SCENARIOS.find(s => s.id === payload);
      if (sc) {
        this.state.alarms.push({ id: 'ALM-' + Math.floor(Math.random()*900+100), device: 'CORE-RT-01', site: 'SITE-01', type: sc.title, severity: 'Critical', status: 'Active', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
        this.log(`Launched training scenario: ${sc.title}`);
        alert(`Scenario "${sc.title}" launched! New alarm generated.`);
      }
    } else if (action === 'select-manual') {
      this.state._selectedManualId = payload;
    }
    render();
  },
  log(msg) {
    this.state.activity.unshift({ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: msg });
  }
};

const FmEngine = {
  scoreEngineer(eng, ticket) {
    let score = 50;
    let reason = "Base allocation score.";
    if (eng.skills.includes(ticket.requiredSkill)) {
      score += 35;
      reason = `Matching skill found: ${ticket.requiredSkill}.`;
    } else {
      score -= 20;
      reason = `Missing primary skill (${ticket.requiredSkill}).`;
    }
    if (eng.status === 'Available') { score += 15; reason += " Engineer is available."; }
    return { total: Math.max(0, Math.min(100, score)), travelMins: 25, reason };
  }
};

const Views = {
  dashboard() {
    const st = Store.state;
    return `
      <div class="page-head"><div><div class="page-title">Network Operations Dashboard</div><div class="page-sub">Real-time telemetry and fault overview</div></div></div>
      <div class="grid grid-4" style="margin-bottom:20px;">
        <div class="stat"><div class="stat-label">Active Alarms</div><div class="stat-value" style="color:var(--danger)">${st.alarms.filter(a=>a.status==='Active').length}</div></div>
        <div class="stat"><div class="stat-label">Open Tickets</div><div class="stat-value">${st.tickets.filter(t=>t.status==='Open').length}</div></div>
        <div class="stat"><div class="stat-label">Network Availability</div><div class="stat-value" style="color:var(--ok)">99.94%</div></div>
        <div class="stat"><div class="stat-label">Field Engineers</div><div class="stat-value">${st.engineers.length}</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">Recent Alarms</div>
          <table><thead><tr><th>ID</th><th>Device</th><th>Severity</th><th>Status</th></tr></thead><tbody>
          ${st.alarms.map(a=>`<tr><td>${a.id}</td><td>${a.device}</td><td><span class="chip chip-danger">${a.severity}</span></td><td>${a.status}</td></tr>`).join('')}
          </tbody></table>
        </div>
        <div class="card">
          <div class="card-title">Active Incident Tickets</div>
          <table><thead><tr><th>ID</th><th>Title</th><th>Severity</th><th>Status</th></tr></thead><tbody>
          ${st.tickets.map(t=>`<tr><td>${t.id}</td><td>${t.title}</td><td><span class="chip chip-warning">${t.severity}</span></td><td>${t.status}</td></tr>`).join('')}
          </tbody></table>
        </div>
      </div>`;
  },
  alarms() {
    const st = Store.state;
    return `
      <div class="page-head"><div><div class="page-title">Active Alarms</div><div class="page-sub">Real-time fault monitoring &amp; event acknowledgment</div></div></div>
      <div class="card">
        <table><thead><tr><th>Alarm ID</th><th>Device</th><th>Site</th><th>Alarm Type</th><th>Severity</th><th>Time</th><th>Action</th></tr></thead><tbody>
        ${st.alarms.map(a=>`
          <tr>
            <td><b>${a.id}</b></td>
            <td>${a.device}</td>
            <td>${a.site}</td>
            <td>${a.type}</td>
            <td><span class="chip chip-danger">${a.severity}</span></td>
            <td>${a.time}</td>
            <td>${a.status==='Active'?`<button class="btn btn-sm btn-primary" onclick="Store.dispatch('ack-alarm','${a.id}')">Acknowledge</button>`:'<span class="chip chip-ok">Acknowledged</span>'}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>`;
  },
  tickets() {
    const st = Store.state;
    return `
      <div class="page-head"><div><div class="page-title">Incident Tickets</div><div class="page-sub">Tracking and lifecycle management for network incidents</div></div></div>
      <div class="card">
        <table><thead><tr><th>Ticket ID</th><th>Title</th><th>Site</th><th>Required Skill</th><th>Severity</th><th>Status</th><th>Assigned Engineer</th></tr></thead><tbody>
        ${st.tickets.map(t=>`
          <tr>
            <td><b>${t.id}</b></td>
            <td>${t.title}</td>
            <td>${t.site}</td>
            <td>${t.requiredSkill}</td>
            <td><span class="chip chip-warning">${t.severity}</span></td>
            <td>${t.status}</td>
            <td>${t.assignedEng || '<span style="color:var(--ink-500)">Unassigned</span>'}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>`;
  },
  fm() {
    const st = Store.state;
    const needing = st.tickets.filter(t => t.status === 'Open');
    const focusTicket = needing[0];
    let recommendation = null;
    let scores = [];
    if(focusTicket) {
      scores = st.engineers.map(eng => ({ eng, res: FmEngine.scoreEngineer(eng, focusTicket) })).sort((a,b)=>b.res.total - a.res.total);
      recommendation = scores[0];
    }
    return `
      <div class="page-head"><div><div class="page-title">FM Optimization</div><div class="page-sub">Weighted field engineer assignment model</div></div></div>
      <div class="split">
        <div class="list-col">
          <div style="font-size:12px;font-weight:700;color:var(--ink-500);margin-bottom:8px;text-transform:uppercase;">Tickets Needing Field Work</div>
          ${needing.map(t=>`
          <div class="list-item active">
            <div class="list-item-title">${t.id} — ${t.title}</div>
            <div class="list-item-meta">Skill required: ${t.requiredSkill}</div>
          </div>`).join('') || '<div class="empty-state">No tickets currently require field work.</div>'}
        </div>
        <div class="card">
          ${focusTicket && recommendation ? `
            <div class="card-title">Recommended Engineer for ${focusTicket.id}</div>
            <div style="background:var(--pink-50);border:1px solid var(--pink-200);padding:12px;border-radius:8px;margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-size:16px;font-weight:700;color:var(--pink-800);">${recommendation.eng.name}</div>
                <div style="font-size:14px;font-weight:700;color:var(--ok);">Score: ${recommendation.res.total} / 100</div>
              </div>
              <div style="font-size:12.5px;color:var(--ink-700);margin-top:4px;">${recommendation.res.reason}</div>
              <div style="margin-top:10px;">
                <button class="btn btn-primary btn-sm" onclick="Store.dispatch('assign-fm', {ticket:'${focusTicket.id}', eng:'${recommendation.eng.id}'})">Assign Recommended Engineer</button>
              </div>
            </div>
            <div class="card-title">All Candidates</div>
            <table><thead><tr><th>Engineer</th><th>Status</th><th>Score</th></tr></thead><tbody>
            ${scores.map(s=>`<tr><td><b>${s.eng.name}</b></td><td>${s.eng.status}</td><td><b>${s.res.total}</b></td></tr>`).join('')}
            </tbody></table>
          ` : `<div class="detail-empty">All open tickets have been assigned field engineers.</div>`}
        </div>
      </div>`;
  },
  topology() {
    return `
      <div class="page-head"><div><div class="page-title">Network Topology</div><div class="page-sub">Interactive node layout across regional telecom sites</div></div></div>
      <div class="grid grid-3">
        ${DATA.SITES.map(s=>`
          <div class="card">
            <div class="card-title">${s.name}</div>
            <div style="font-size:12.5px;color:var(--ink-500);margin-bottom:10px;">Region: ${s.region} | ID: ${s.id}</div>
            ${DATA.DEVICES.filter(d=>d.site===s.id).map(d=>`
              <div style="background:#f7fafc;padding:8px;border-radius:6px;margin-top:6px;font-size:13px;display:flex;justify-content:space-between;align-items:center;">
                <div><b>${d.name}</b><br><span style="font-size:11.5px;color:var(--ink-500)">IP: ${d.ip}</span></div>
                <span class="chip chip-ok">${d.status}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>`;
  },
  workorders() {
    return `<div class="page-head"><div><div class="page-title">Work Orders</div><div class="page-sub">Scheduled maintenance and site access permits</div></div></div><div class="card"><div class="empty-state">No active work orders scheduled for today.</div></div>`;
  },
  emails() {
    return `<div class="page-head"><div><div class="page-title">Dispatcher Emails</div><div class="page-sub">Communications with field crews and external vendors</div></div></div><div class="card"><div class="empty-state">Inbox is fully synchronized. No pending messages.</div></div>`;
  },
  kpi() {
    return `
      <div class="page-head"><div><div class="page-title">KPI &amp; Performance</div><div class="page-sub">Trainee operational metrics &amp; scorecards</div></div></div>
      <div class="grid grid-4" style="margin-bottom:20px;">
        <div class="stat"><div class="stat-label">SLA Compliance</div><div class="stat-value" style="color:var(--ok)">100%</div></div>
        <div class="stat"><div class="stat-label">Tickets Resolved</div><div class="stat-value">1 / 2</div></div>
        <div class="stat"><div class="stat-label">Active Alarms</div><div class="stat-value">2</div></div>
        <div class="stat"><div class="stat-label">Network Availability</div><div class="stat-value" style="color:var(--ok)">99.94%</div></div>
      </div>`;
  },
  manual() {
    const st = Store.state;
    const art = DATA.MANUAL.find(m => m.id === st._selectedManualId) || DATA.MANUAL[0];
    return `
      <div class="page-head"><div><div class="page-title">Manual &amp; Knowledge Base</div><div class="page-sub">Standard operating procedures &amp; telecom guides</div></div></div>
      <div class="grid" style="grid-template-columns:1fr 2fr;gap:16px;">
        <div class="card" style="max-height:500px;overflow-y:auto;">
          ${DATA.MANUAL.map(m=>`<div style="padding:8px 0;border-bottom:1px solid var(--line);cursor:pointer;" onclick="Store.dispatch('select-manual','${m.id}')"><div style="font-weight:600;font-size:13px;color:var(--primary);">${m.title}</div><div style="font-size:11.5px;color:var(--ink-500);">${m.category}</div></div>`).join('')}
        </div>
        <div class="card">
          <div class="breadcrumb" style="font-size:11px;color:var(--ink-500);margin-bottom:4px;">MANUAL / ${art.category.toUpperCase()}</div>
          <div class="page-title" style="font-size:18px;margin-bottom:10px;">${art.title}</div>
          <div style="font-size:13.5px;line-height:1.7;color:var(--ink-700);white-space:pre-line;">${art.body}</div>
        </div>
      </div>`;
  },
  scenarios() {
    return `
      <div class="page-head"><div><div class="page-title">Training Scenarios</div><div class="page-sub">Select and launch specialized fault scenarios</div></div></div>
      <div class="grid grid-2">
        ${DATA.SCENARIOS.map(sc=>`
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div class="card-title">${sc.title}</div>
            <p style="font-size:13px;color:var(--ink-700);margin-bottom:14px;">${sc.desc}</p>
          </div>
          <div class="btn-row"><button class="btn btn-primary" onclick="Store.dispatch('launch-scenario','${sc.id}')">Launch Scenario</button></div>
        </div>`).join('')}
      </div>`;
  },
  activity() {
    const st = Store.state;
    return `
      <div class="page-head"><div><div class="page-title">Activity Log</div><div class="page-sub">Audit trail of all system events and trainee actions</div></div></div>
      <div class="card">
        <table><thead><tr><th>Time</th><th>Event / Action</th></tr></thead><tbody>
        ${st.activity.map(a=>`<tr><td style="width:140px;color:var(--ink-500);">${a.time}</td><td>${a.message}</td></tr>`).join('')}
        </tbody></table>
      </div>`;
  },
  settings() {
    return `
      <div class="page-head"><div><div class="page-title">Settings</div><div class="page-sub">Simulator mode, difficulty, and audio/visual preferences</div></div></div>
      <div class="card" style="max-width:500px;">
        <div class="card-title">Training Mode</div>
        <div class="field"><label>Mode</label>
          <select><option selected>Training Mode (with hints)</option><option>Assessment Mode (strict scoring)</option></select>
        </div>
        <button class="btn btn-primary" onclick="alert('Settings saved successfully!')">Apply Settings</button>
      </div>`;
  }
};

function render() {
  const st = Store.state;
  document.querySelectorAll('.nav-item').forEach(el => {
    if(el.dataset.view === st.currentView) el.classList.add('active');
    else el.classList.remove('active');
  });

  const contentEl = document.getElementById('content');
  const viewFn = Views[st.currentView] || Views.dashboard;
  contentEl.innerHTML = viewFn();
}

document.addEventListener('click', e => {
  const nav = e.target.closest('[data-view]');
  if(nav) {
    e.preventDefault();
    Store.dispatch('navigate', nav.dataset.view);
  }
});

render();
