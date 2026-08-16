import { DATA } from './data.js';

export const Store = {
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
  dispatch(action, payload, renderCallback) {
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
    if (renderCallback) renderCallback();
  },
  log(msg) {
    this.state.activity.unshift({ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), message: msg });
  }
};
