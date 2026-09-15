// Arrival-time tide planner for Monmouth Dock & Dine.
// Loaded after app.js. Adds an arrival selector and per-card 24-hour tide/depth plots
// without changing the underlying dock-access verification ledger.
(() => {
  const plannerCache = {};
  let plannerLoading = false;
  let observer;
  const HOUR = 3600e3;

  function easternParts(ms) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(ms));
    const get = t => parts.find(p => p.type === t)?.value || '';
    return { year:get('year'), month:get('month'), day:get('day'), hour:get('hour'), minute:get('minute') };
  }

  function easternYmd(ms) {
    const p = easternParts(ms);
    return `${p.year}${p.month}${p.day}`;
  }

  function defaultArrivalValue() {
    const rounded = Math.ceil(Date.now() / (30 * 60e3)) * (30 * 60e3);
    const p = easternParts(rounded);
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  }

  function arrivalMs() {
    const v = document.getElementById('arrivalTime')?.value;
    if (!v) return Date.now();
    return easternMs(v.replace('T', ' '));
  }

  function fmtArrival(ms) {
    return new Date(ms).toLocaleString([], {
      timeZone:'America/New_York', month:'short', day:'numeric', hour:'numeric', minute:'2-digit'
    });
  }

  function fmtTime(ms) {
    return new Date(ms).toLocaleTimeString([], {
      timeZone:'America/New_York', hour:'numeric', minute:'2-digit'
    });
  }

  function normalize(points) {
    return (points || []).map(p => ({
      t: easternMs(p.t), v: Number(p.v), type: p.type || ''
    })).filter(p => Number.isFinite(p.t) && Number.isFinite(p.v)).sort((a,b) => a.t-b.t);
  }

  function valueAt(series, ms) {
    const pts = series?.points || [];
    if (!pts.length) return NaN;
    if (ms <= pts[0].t) return pts[0].v;
    if (ms >= pts[pts.length-1].t) return pts[pts.length-1].v;
    let a = pts[0], b = pts[pts.length-1];
    for (let i=1;i<pts.length;i++) {
      if (pts[i].t >= ms) { a = pts[i-1]; b = pts[i]; break; }
    }
    if (b.t === a.t) return a.v;
    let x = (ms-a.t)/(b.t-a.t);
    if (series.mode === 'hilo') x = (1-Math.cos(Math.PI*x))/2;
    return a.v + (b.v-a.v)*x;
  }

  async function getPredictions(stationId, centerMs) {
    const start = centerMs - 18*HOUR;
    const end = centerMs + 30*HOUR;
    const build = interval => {
      const q = new URLSearchParams({
        product:'predictions', application:'monmouth-dock-dine',
        begin_date:easternYmd(start), end_date:easternYmd(end), datum:'MLLW',
        station:stationId, time_zone:'lst_ldt', units:'english', format:'json', interval
      });
      return 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?' + q;
    };

    let response = await fetch(build('6'));
    let json = await response.clone().json().catch(() => null);
    if (!response.ok || !Array.isArray(json?.predictions) || !json.predictions.length) {
      response = await fetch(build('hilo'));
      json = await response.json().catch(() => null);
    }
    const points = normalize(json?.predictions || []);
    if (!points.length) throw new Error('No NOAA predictions');
    const mode = points.some(p => p.type === 'H' || p.type === 'L') ? 'hilo' : '6';
    return { points, mode };
  }

  async function refreshPlannerTides() {
    const center = arrivalMs();
    plannerLoading = true;
    enhanceCards();
    await Promise.all(Object.entries(STATIONS).map(async ([key, station]) => {
      try {
        plannerCache[key] = await getPredictions(station.id, center);
        plannerCache[key].name = station.name;
      } catch (error) {
        plannerCache[key] = {points:[], mode:'error', name:station.name, error:String(error)};
      }
    }));
    plannerLoading = false;
    enhanceCards();
  }

  function polylinePath(samples, start, end, min, max) {
    const x = t => 10 + 300*(t-start)/(end-start);
    const y = v => 88 - 72*(v-min)/(max-min || 1);
    return samples.map((s,i) => `${i?'L':'M'}${x(s.t).toFixed(1)},${y(s.v).toFixed(1)}`).join(' ');
  }

  function chartHtml(p, series, center) {
    const start = center - 12*HOUR, end = center + 12*HOUR;
    const samples = [];
    for (let t=start;t<=end;t+=15*60e3) {
      const v=valueAt(series,t); if(Number.isFinite(v)) samples.push({t,v});
    }
    if (!samples.length) return '';
    const requiredTide = Number.isFinite(p.depth) ? requirement()-p.depth : NaN;
    const vals=samples.map(s=>s.v);
    if(Number.isFinite(requiredTide)) vals.push(requiredTide);
    let min=Math.min(...vals),max=Math.max(...vals); const pad=Math.max(.25,(max-min)*.12); min-=pad;max+=pad;
    const path=polylinePath(samples,start,end,min,max);
    const y=v=>88-72*(v-min)/(max-min||1);
    const threshold = Number.isFinite(requiredTide) && requiredTide>=min && requiredTide<=max
      ? `<line x1="10" y1="${y(requiredTide).toFixed(1)}" x2="310" y2="${y(requiredTide).toFixed(1)}" stroke="#b66a2c" stroke-width="1.5" stroke-dasharray="5 4"/><text x="306" y="${Math.max(12,y(requiredTide)-3).toFixed(1)}" text-anchor="end" font-size="9" fill="#8a5529">draft + UKC threshold</text>` : '';
    return `<div style="margin-top:10px;border-top:1px solid rgba(9,47,59,.12);padding-top:9px"><div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;color:#587078"><b>24-hour tide window</b><span>${series.mode==='hilo'?'NOAA H/L · curve estimated':'NOAA 6-minute predictions'}</span></div><svg viewBox="0 0 320 100" role="img" aria-label="24 hour predicted tide curve" style="width:100%;height:105px;display:block;margin-top:3px"><line x1="10" y1="88" x2="310" y2="88" stroke="#cbd6d8" stroke-width="1"/>${threshold}<line x1="160" y1="10" x2="160" y2="90" stroke="#617a80" stroke-width="1" stroke-dasharray="3 4"/><path d="${path}" fill="none" stroke="#15718a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="10" y="99" font-size="9" fill="#667b80">−12h</text><text x="160" y="99" text-anchor="middle" font-size="9" fill="#425f66">arrival</text><text x="310" y="99" text-anchor="end" font-size="9" fill="#667b80">+12h</text></svg></div>`;
  }

  function plannerHtml(p) {
    const center=arrivalMs(), series=plannerCache[p.station];
    if(plannerLoading && !series) return `<div class="arrival-planner" style="margin-top:10px;padding:10px;border-radius:9px;background:#f4f8f8"><b>Selected-arrival planner</b><br><span style="font-size:12px;color:#61747a">Loading NOAA predictions…</span></div>`;
    if(!series || !series.points.length) return `<div class="arrival-planner" style="margin-top:10px;padding:10px;border-radius:9px;background:#f8f4ee"><b>Selected-arrival planner</b><br><span style="font-size:12px;color:#6c645a">NOAA prediction unavailable for the selected time.</span></div>`;
    const tide=valueAt(series,center);
    const tideText=Number.isFinite(tide)?`${tide.toFixed(2)} ft MLLW`:'—';
    let depthText='Baseline dock depth not published';
    let clearanceText='Tide shown; call dockmaster for controlling depth';
    let tone='#eef5f6';
    if(p.verify.startsWith('verified') && Number.isFinite(p.depth) && Number.isFinite(tide)) {
      const est=p.depth+tide, clearance=est-(+$('draft').value||0), margin=(+$('margin').value||0);
      depthText=`Est. dock depth ${est.toFixed(1)} ft`;
      clearanceText=`Est. under-keel clearance ${clearance.toFixed(1)} ft · selected minimum ${margin.toFixed(1)} ft`;
      tone=clearance>=margin+1?'#edf6ef':clearance>=margin?'#fbf4e5':'#f8e9e7';
    }
    const events=series.points.filter(x=>(x.type==='H'||x.type==='L')&&x.t>=center).slice(0,2).map(x=>`${x.type==='H'?'High':'Low'} ${fmtTime(x.t)} · ${x.v.toFixed(1)} ft`).join(' · ');
    return `<div class="arrival-planner" style="margin-top:10px;padding:11px;border-radius:9px;background:${tone};border:1px solid rgba(9,47,59,.1)"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#60767b">Selected arrival · ${fmtArrival(center)}</div><div style="font-size:18px;font-weight:700;margin-top:2px">${tideText}</div></div><div style="text-align:right"><div style="font-size:14px;font-weight:700">${depthText}</div><div style="font-size:11px;color:#5e7277;margin-top:2px">${clearanceText}</div></div></div>${events?`<div style="font-size:11px;color:#5e7277;margin-top:7px">${events}</div>`:''}${chartHtml(p,series,center)}<div style="font-size:10px;line-height:1.35;color:#6b7c80;margin-top:5px">Planning estimate only. For subordinate NOAA stations, values between official highs/lows are interpolated; actual water level can differ because of weather, surge, river flow and local shoaling.</div></div>`;
  }

  function visiblePlaces() {
    const q=$('search').value.trim().toLowerCase(), filter=$('statusFilter').value;
    return PLACES.filter(p=>showPlace(p,filter,q));
  }

  function enhanceCards() {
    const cards=document.querySelectorAll('#cards .card');
    if(!cards.length) return;
    if(observer) observer.disconnect();
    const lookup=new Map(PLACES.map(p=>[p.name,p]));
    cards.forEach(card=>{
      const name=card.querySelector('h3')?.textContent?.trim(); const p=lookup.get(name); if(!p)return;
      card.querySelector('.arrival-planner')?.remove();
      const water=card.querySelector('.water'); if(!water)return;
      water.insertAdjacentHTML('afterend',plannerHtml(p));
    });
    if(observer) observer.observe(document.getElementById('cards'),{childList:true,subtree:true});
  }

  function installControl() {
    const controls=document.querySelector('.controls'); if(!controls || document.getElementById('arrivalTime'))return;
    const box=document.createElement('div'); box.className='panel control';
    box.innerHTML='<label for="arrivalTime">Arrival date & time (New Jersey)</label><input id="arrivalTime" type="datetime-local" step="1800" />';
    controls.insertBefore(box,controls.children[1] || null);
    const input=document.getElementById('arrivalTime'); input.value=defaultArrivalValue();
    input.addEventListener('change',refreshPlannerTides);
  }

  installControl();
  observer=new MutationObserver(()=>enhanceCards());
  observer.observe(document.getElementById('cards'),{childList:true,subtree:true});
  ['draft','margin','search','statusFilter'].forEach(id=>$(id)?.addEventListener(id==='search'?'input':'change',()=>setTimeout(enhanceCards,0)));
  refreshPlannerTides();
})();
