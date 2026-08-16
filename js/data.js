export const DATA = {
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
