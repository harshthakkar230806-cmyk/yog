// Deterministic eligibility engine. No AI here on purpose: eligibility must be testable.
(function (root) {
  function check(p, s) {
    const r = s.rules, why = [];
    if (r.age) { if (p.age < r.age[0] || p.age > r.age[1]) return null; why.push('age'); }
    if (r.income != null) { if (p.income > r.income) return null; why.push('income'); }
    if (r.gender) { if (!r.gender.includes(p.gender)) return null; why.push('gender'); }
    if (r.occ) { if (!r.occ.includes(p.occ)) return null; why.push('occ'); }
    if (r.cat) { if (!r.cat.includes(p.cat)) return null; why.push('cat'); }
    if (r.flags) for (const k in r.flags) { if (!!p[k] !== r.flags[k]) return null; why.push(k); }
    if (r.any) {
      const m = r.any.map(sub => check(p, { rules: sub })).find(Boolean);
      if (!m) return null; why.push(...m);
    }
    return [...new Set(why)];
  }
  function evaluate(p, schemes) {
    return schemes.map(s => ({ s, why: check(p, s) })).filter(x => x.why);
  }
  const api = { check, evaluate };
  if (typeof module !== 'undefined') module.exports = api; else root.Engine = api;
})(this);
