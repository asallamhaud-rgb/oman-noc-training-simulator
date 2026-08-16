export const SlaEngine = {
  slaStatus(ticket) {
    if (ticket.status === 'Resolved' || ticket.status === 'Closed') return 'Resolved';
    return ticket.severity === 'Critical' ? 'At Risk (< 2h)' : 'Within SLA';
  }
};

export const FmEngine = {
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
