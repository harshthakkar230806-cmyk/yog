const T = {
 en:{title:'Yojana Finder',tag:'Answer a few questions. See government schemes you may qualify for. Nothing is stored or sent anywhere.',
  switch:'हिन्दी',next:'Next',back:'Back',yes:'Yes',no:'No',start:'Start over',speak:'Read aloud',print:'Save as PDF',
  bad:'Please enter a valid number.',
  foot:'This is guidance, not a guarantee. Rules change, so always confirm on the official site before applying. Scheme data here is sample data and has not been verified.',
  res:n=>n?`You may qualify for ${n} scheme${n>1?'s':''}`:'No match found',none:'Try changing an answer. Many schemes also depend on your state, so check myScheme.gov.in too.',
  docs:'Documents to keep ready',apply:'Open official site',unver:'Not verified yet. Check the official site.',
  q:{age:['How old are you?','Age in years'],income:['What is your family’s yearly income?','Total of all earning members, in ₹'],
   gender:['What is your gender?'],occ:['What do you do?'],cat:['Which category do you belong to?'],
   pucca:['Do you own a pucca (concrete) house?'],girl:['Do you have a daughter under 10 years old?'],
   pregnant:['Are you pregnant or breastfeeding?'],disability:['Do you or a family member have a disability certificate?']},
  o:{female:'Woman',male:'Man',other:'Other',student:'Student',farmer:'Farmer',selfemployed:'Self-employed or artisan',worker:'Daily-wage or unorganised worker',salaried:'Salaried job',unemployed:'Looking for work',homemaker:'Homemaker',general:'General',obc:'OBC',sc:'SC',st:'ST',minority:'Minority community'},
  why:{age:'Your age fits',income:'Your income fits',gender:'Gender fits',occ:'Your occupation fits',cat:'Your category fits',pucca:'You have no pucca house',girl:'You have a daughter under 10',pregnant:'Pregnancy or nursing',disability:'Disability in family'}},
 hi:{title:'योजना खोजक',tag:'कुछ सवालों के जवाब दें। जानें किन सरकारी योजनाओं के लिए आप पात्र हो सकते हैं। कोई जानकारी सेव या भेजी नहीं जाती।',
  switch:'English',next:'आगे',back:'पीछे',yes:'हाँ',no:'नहीं',start:'फिर से शुरू करें',speak:'सुनें',print:'PDF सेव करें',
  bad:'कृपया सही संख्या लिखें।',
  foot:'यह सिर्फ मार्गदर्शन है, गारंटी नहीं। नियम बदलते रहते हैं, इसलिए आवेदन से पहले आधिकारिक साइट पर जाँच करें। यहाँ का डेटा नमूना है और सत्यापित नहीं है।',
  res:n=>n?`आप ${n} योजना${n>1?'ओं':''} के लिए पात्र हो सकते हैं`:'कोई योजना नहीं मिली',none:'किसी जवाब को बदलकर देखें। कई योजनाएँ राज्य पर भी निर्भर हैं, इसलिए myScheme.gov.in भी देखें।',
  docs:'ये दस्तावेज़ तैयार रखें',apply:'आधिकारिक साइट खोलें',unver:'अभी सत्यापित नहीं। आधिकारिक साइट देखें।',
  q:{age:['आपकी उम्र कितनी है?','उम्र (साल में)'],income:['आपके परिवार की सालाना आय कितनी है?','सभी कमाने वालों की कुल आय, ₹ में'],
   gender:['आपका लिंग क्या है?'],occ:['आप क्या करते हैं?'],cat:['आप किस श्रेणी से हैं?'],
   pucca:['क्या आपके पास पक्का मकान है?'],girl:['क्या आपकी 10 साल से छोटी बेटी है?'],
   pregnant:['क्या आप गर्भवती हैं या स्तनपान करा रही हैं?'],disability:['क्या आपके या परिवार में किसी के पास दिव्यांगता प्रमाणपत्र है?']},
  o:{female:'महिला',male:'पुरुष',other:'अन्य',student:'छात्र',farmer:'किसान',selfemployed:'स्वरोज़गार या कारीगर',worker:'दिहाड़ी या असंगठित मज़दूर',salaried:'नौकरीपेशा',unemployed:'काम की तलाश में',homemaker:'गृहिणी',general:'सामान्य',obc:'ओबीसी',sc:'एससी',st:'एसटी',minority:'अल्पसंख्यक समुदाय'},
  why:{age:'आपकी उम्र उपयुक्त है',income:'आपकी आय उपयुक्त है',gender:'लिंग उपयुक्त है',occ:'आपका पेशा उपयुक्त है',cat:'आपकी श्रेणी उपयुक्त है',pucca:'आपके पास पक्का मकान नहीं है',girl:'10 साल से छोटी बेटी है',pregnant:'गर्भावस्था या स्तनपान',disability:'परिवार में दिव्यांगता'}}
};
const STEPS = [
 {k:'age',t:'num'},{k:'income',t:'num'},
 {k:'gender',t:'ch',o:['female','male','other']},
 {k:'occ',t:'ch',o:['student','farmer','selfemployed','worker','salaried','unemployed','homemaker']},
 {k:'cat',t:'ch',o:['general','obc','sc','st','minority']},
 {k:'pucca',t:'yn'},{k:'girl',t:'yn'},
 {k:'pregnant',t:'yn',skip:p=>p.gender!=='female'},{k:'disability',t:'yn'}
];
let lang = localStorage.getItem('lang') || 'en', i = 0, p = {}, done = false;
const $ = id => document.getElementById(id), L = () => T[lang];
const act = () => STEPS.filter(s => !(s.skip && s.skip(p)));

function chrome() {
  document.documentElement.lang = lang; $('title').textContent = L().title; $('tag').textContent = L().tag;
  $('lang').textContent = L().switch; $('foot').textContent = L().foot;
}
$('lang').onclick = () => { lang = lang === 'en' ? 'hi' : 'en'; try{localStorage.setItem('lang', lang)}catch{} chrome(); render(); };

function render() {
  const a = act(), s = a[i], app = $('app');
  if (i >= a.length) done = true;
  if (done || !s) return results();
  const [q, h] = L().q[s.k];
  app.innerHTML = `<div class="prog"><div style="width:${i / a.length * 100}%"></div></div><h2 class="q">${q}</h2>${h ? `<p class="help">${h}</p>` : ''}<div id="in"></div><div class="err" id="err" role="alert"></div>`;
  const box = $('in');
  if (s.t === 'num') {
    box.innerHTML = `<input id="n" name="${s.k}" type="text" inputmode="numeric" autocomplete="off" aria-label="${q}" value="${p[s.k] ?? ''}">`;
    const go = () => {
      const raw = $('n').value.trim().replace(/,/g, '');
      const v = Number(raw);
      const invalid = raw === '' || !/^\d+(?:\.\d+)?$/.test(raw) || !Number.isFinite(v) || v < 0 || (s.k === 'age' && v > 120);
      if (invalid) { $('err').textContent = L().bad; $('n').focus(); return; }
      p[s.k] = v; i++; render();
    };
    $('n').focus();
    $('n').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); go(); } };
    box.insertAdjacentHTML('afterend', `<div class="nav"><button class="primary" id="nx">${L().next}</button></div>`); $('nx').onclick = go;
  } else {
    const opts = s.t === 'yn' ? [['yes', L().yes, true], ['no', L().no, false]] : s.o.map(o => [o, L().o[o], o]);
    box.className = 'opts';
    opts.forEach(([, label, val]) => { const b = document.createElement('button'); b.textContent = label; b.onclick = () => { p[s.k] = val; i++; render(); }; box.appendChild(b); });
  }
  if (i > 0) app.insertAdjacentHTML('beforeend', `<div class="nav"><button id="bk">${L().back}</button></div>`), $('bk').onclick = () => { i--; render(); };
}

function results() {
  const r = Engine.evaluate(p, SCHEMES), t = L();
  $('app').innerHTML = `<p class="big">${r.length}</p><h2 class="q">${t.res(r.length)}</h2>${r.length ? '' : `<p class="help">${t.none}</p>`}
  <div class="row"><button class="primary" id="sp">${t.speak}</button><button id="pr">${t.print}</button><button id="rs">${t.start}</button></div>` +
  r.map(({ s, why }) => `<article class="card"><h3>${s.name[lang]}</h3><div>${s.benefit}</div>
    <div class="why">✓ ${why.map(w => t.why[w]).join(' · ')}</div>
    <strong>${t.docs}</strong><ul class="docs">${s.docs.map(d => `<li><label><input type="checkbox"> ${d}</label></li>`).join('')}</ul>
    <a href="${s.url}" target="_blank" rel="noopener">${t.apply} ↗</a>
    <div class="warn">${s.verified ? '' : t.unver}</div></article>`).join('');
  $('rs').onclick = () => { i = 0; p = {}; done = false; render(); };
  $('pr').onclick = () => window.print();
  $('sp').onclick = () => {
    if (!('speechSynthesis' in window)) return; speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${t.res(r.length)}. ${r.map(x => x.s.name[lang]).join(', ')}`);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; speechSynthesis.speak(u);
  };
}
// after the last question, show results
chrome(); render();
