(() => {
  const CURRENT_STATIONS = {
    hellGate: { id: 'NYH1924', name: 'Hell Gate' },
    brooklyn: { id: 'NYH1920', name: 'Brooklyn Bridge' },
    robbins: { id: 'NYH1915', name: 'Robbins Reef' },
    highlands: { id: 'NYH1933', name: 'Highlands Bridge' }
  };

  const ROUTE_ANCHORS = {
    throgs: { name: 'Throgs Neck', lat: 40.8050, lon: -73.7930 },
    hellGate: { name: 'Hell Gate', lat: 40.7790, lon: -73.9360 },
    brooklyn: { name: 'Brooklyn Bridge', lat: 40.7060, lon: -73.9977 },
    robbins: { name: 'Robbins Reef', lat: 40.6552, lon: -74.0507 },
    verrazzano: { name: 'Verrazzano-Narrows', lat: 40.6060, lon: -74.0440 },
    sandyHook: { name: 'Sandy Hook', lat: 40.4660, lon: -74.0010 }
  };

  const currentCache = {};
  const tideSeriesCache = {};
  let tripLayer = null;
  const HOUR = 3600e3;
  const MINUTE = 60e3;
  const qs = id => document.getElementById(id);

  function easternParts(ms) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(ms));
    const get = t => parts.find(p => p.type === t)?.value || '';
    return { year:get('year'), month:get('month'), day:get('day'), hour:get('hour'), minute:get('minute') };
  }
  function easternDateString(ms = Date.now()) { const p = easternParts(ms); return `${p.year}-${p.month}-${p.day}`; }
  function easternMs(text) {
    const m = String(text).match(/(\d{4})-(\d\d)-(\d\d)[ T](\d\d):(\d\d)/); if (!m) return NaN;
    const target = Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5]); let guess = target;
    for (let i=0; i<3; i++) { const p = easternParts(guess); const wall = Date.UTC(+p.year, +p.month-1, +p.day, +p.hour, +p.minute); guess += target - wall; }
    return guess;
  }
  function fmtTime(ms) { return new Date(ms).toLocaleTimeString([], { timeZone:'America/New_York', hour:'numeric', minute:'2-digit' }); }
  function fmtDateTime(ms) { return new Date(ms).toLocaleString([], { timeZone:'America/New_York', month:'short', day:'numeric', hour:'numeric', minute:'2-digit' }); }
  function addDaysYmd(ymd, days) { const [y,m,d] = ymd.split('-').map(Number); return new Date(Date.UTC(y,m-1,d+days)).toISOString().slice(0,10); }
  function apiYmd(ymd) { return ymd.replaceAll('-',''); }

  function nmBetween(a,b) {
    const R = 3440.065, r = Math.PI/180, p1=a.lat*r,p2=b.lat*r,dp=(b.lat-a.lat)*r,dl=(b.lon-a.lon)*r;
    const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2; return 2*R*Math.asin(Math.sqrt(h));
  }
  function bearing(a,b) {
    const r=Math.PI/180, p1=a.lat*r,p2=b.lat*r,dl=(b.lon-a.lon)*r;
    const y=Math.sin(dl)*Math.cos(p2), x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
    return (Math.atan2(y,x)/r+360)%360;
  }
  function vectorFrom(speed, dirDeg) { const r=dirDeg*Math.PI/180; return { east:speed*Math.sin(r), north:speed*Math.cos(r) }; }
  function projection(vector, bearingDeg) { const r=bearingDeg*Math.PI/180; return vector.east*Math.sin(r)+vector.north*Math.cos(r); }

  function normalizeCurrentJson(json) {
    let rows = json?.current_predictions?.cp || json?.current_predictions || json?.predictions || []; if (!Array.isArray(rows)) rows = [];
    return rows.map(row => {
      const t = easternMs(row.Time || row.t || row.time || '');
      let speed = Number(row.Speed ?? row.speed ?? row.s), dir = Number(row.Direction ?? row.direction ?? row.d);
      const major = Number(row.Velocity_Major ?? row.velocity_major ?? row.v), floodDir = Number(row.meanFloodDir ?? row.MeanFloodDir ?? row.mean_flood_dir), ebbDir = Number(row.meanEbbDir ?? row.MeanEbbDir ?? row.mean_ebb_dir);
      if ((!Number.isFinite(speed) || !Number.isFinite(dir)) && Number.isFinite(major)) { speed = Math.abs(major); dir = major >= 0 ? floodDir : ebbDir; }
      if (!Number.isFinite(t) || !Number.isFinite(speed) || !Number.isFinite(dir)) return null;
      const v = vectorFrom(speed, dir); return { t, speed, dir, east:v.east, north:v.north };
    }).filter(Boolean).sort((a,b)=>a.t-b.t);
  }
  async function fetchCurrentSeries(key, ymd) {
    const cacheKey = `${key}:${ymd}`; if (currentCache[cacheKey]) return currentCache[cacheKey]; const st = CURRENT_STATIONS[key];
    const params = new URLSearchParams({ product:'currents_predictions', application:'dock-dine-trip-lab', begin_date:apiYmd(ymd), end_date:apiYmd(addDaysYmd(ymd,1)), station:st.id, time_zone:'lst_ldt', interval:'10', units:'english', vel_type:'speed_dir', format:'json' });
    const response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params}`); const json = await response.json().catch(()=>null);
    if (!response.ok) throw new Error(`${st.name}: NOAA ${response.status}`); const rows = normalizeCurrentJson(json); if (!rows.length) throw new Error(`${st.name}: no predictions returned`);
    currentCache[cacheKey] = rows; return rows;
  }
  function currentVectorAt(rows, ms) {
    if (!rows?.length) return {east:0,north:0,speed:0,dir:0,missing:true}; if (ms <= rows[0].t) return {...rows[0], missing:false}; if (ms >= rows[rows.length-1].t) return {...rows[rows.length-1], missing:false};
    let a=rows[0], b=rows[rows.length-1]; for (let i=1;i<rows.length;i++) if (rows[i].t>=ms) { a=rows[i-1]; b=rows[i]; break; }
    const x=(ms-a.t)/(b.t-a.t||1), east=a.east+(b.east-a.east)*x, north=a.north+(b.north-a.north)*x;
    return {east,north,speed:Math.hypot(east,north),dir:(Math.atan2(east,north)*180/Math.PI+360)%360,missing:false};
  }

  function normalizeTide(points) { return (points||[]).map(p=>({t:easternMs(p.t),v:Number(p.v),type:p.type||''})).filter(p=>Number.isFinite(p.t)&&Number.isFinite(p.v)).sort((a,b)=>a.t-b.t); }
  async function fetchTideSeries(stationId, ymd) {
    const cacheKey=`${stationId}:${ymd}`; if(tideSeriesCache[cacheKey]) return tideSeriesCache[cacheKey];
    const build=interval=>new URLSearchParams({product:'predictions',application:'dock-dine-trip-lab',begin_date:apiYmd(ymd),end_date:apiYmd(addDaysYmd(ymd,1)),datum:'MLLW',station:stationId,time_zone:'lst_ldt',units:'english',format:'json',interval});
    let r=await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${build('6')}`), j=await r.json().catch(()=>null), mode='6';
    if(!r.ok||!Array.isArray(j?.predictions)||!j.predictions.length){ r=await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${build('hilo')}`); j=await r.json().catch(()=>null); mode='hilo'; }
    const points=normalizeTide(j?.predictions||[]); if(!points.length) throw new Error('Destination tide unavailable'); const out={points,mode}; tideSeriesCache[cacheKey]=out; return out;
  }
  function tideAt(series, ms) {
    const pts=series?.points||[]; if(!pts.length)return NaN; if(ms<=pts[0].t)return pts[0].v; if(ms>=pts[pts.length-1].t)return pts[pts.length-1].v;
    let a=pts[0],b=pts[pts.length-1]; for(let i=1;i<pts.length;i++)if(pts[i].t>=ms){a=pts[i-1];b=pts[i];break;}
    let x=(ms-a.t)/(b.t-a.t||1); if(series.mode==='hilo')x=(1-Math.cos(Math.PI*x))/2; return a.v+(b.v-a.v)*x;
  }

  function getPlaces() {
    const rows = typeof P !== 'undefined' ? P : [];
    return { stamford: rows.filter(p=>p.r==='fairfield' && ['prime','wheel','fortina','whale','bareburger'].includes(p.id)), highlands: rows.filter(p=>p.r==='monmouth' && ['onewillow','bahrs','mobys','seafarer'].includes(p.id)) };
  }
  function buildRoute(start, end, southbound) {
    const fixed = [ROUTE_ANCHORS.throgs,ROUTE_ANCHORS.hellGate,ROUTE_ANCHORS.brooklyn,ROUTE_ANCHORS.robbins,ROUTE_ANCHORS.verrazzano,ROUTE_ANCHORS.sandyHook];
    const pts = southbound ? [start,...fixed,end] : [start,...fixed.slice().reverse(),end];
    return pts.slice(0,-1).map((a,i)=>{
      const b=pts[i+1]; let key=null, scale=1;
      if (a.name==='Throgs Neck'||b.name==='Throgs Neck') { key='hellGate'; scale=.45; }
      if (a.name==='Hell Gate'||b.name==='Hell Gate') { key='hellGate'; scale=.90; }
      if (a.name==='Brooklyn Bridge'||b.name==='Brooklyn Bridge') { key='brooklyn'; scale=.85; }
      if (a.name==='Robbins Reef'||b.name==='Robbins Reef') { key='robbins'; scale=.85; }
      if (a.name==='Verrazzano-Narrows'||b.name==='Verrazzano-Narrows') { key='robbins'; scale=.45; }
      if (a.name==='Sandy Hook'||b.name==='Sandy Hook') { key='highlands'; scale=.45; }
      if ((southbound && i===0) || (!southbound && i===pts.length-2)) { key=null; scale=0; }
      return {a,b,key,scale,distance:nmBetween(a,b),bearing:bearing(a,b)};
    });
  }
  function simulate(departMs, cruise, route, currents) {
    let t=departMs,totalNm=0,weightedAssist=0; const legs=[];
    for(const leg of route){
      let dt=leg.distance/Math.max(3,cruise)*HOUR,assist=0,vector=null;
      for(let k=0;k<3;k++){ const mid=t+dt/2; vector=leg.key ? currentVectorAt(currents[leg.key]||[],mid) : {east:0,north:0,speed:0,dir:0,missing:true}; assist=leg.key ? projection(vector,leg.bearing)*leg.scale : 0; dt=leg.distance/Math.max(3,cruise+assist)*HOUR; }
      const start=t; t+=dt; totalNm+=leg.distance; weightedAssist+=assist*leg.distance; legs.push({...leg,start,end:t,assist,currentSpeed:vector?.speed||0,currentDir:vector?.dir||0,sog:leg.distance/(dt/HOUR)});
    }
    return {depart:departMs,arrival:t,duration:t-departMs,totalNm,avgAssist:weightedAssist/Math.max(.01,totalNm),legs};
  }
  function baseline(place) { const vals=[place?.dock,place?.approach].filter(Number.isFinite); return vals.length?Math.min(...vals):NaN; }
  async function evaluateDepth(place, ms, ymd) {
    const st = STATIONS?.[place?.s], base=baseline(place); if(!st||!Number.isFinite(base))return {known:false}; const series=await fetchTideSeries(st.id,ymd), tide=tideAt(series,ms), depth=base+tide;
    return {known:Number.isFinite(depth),tide,depth,baseline:base,mode:series.mode};
  }
  function buildCandidates(ymd, startTime, endTime, cruise, route, currents) {
    const start=easternMs(`${ymd} ${startTime}`), end=easternMs(`${ymd} ${endTime}`), out=[]; for(let t=start;t<=end;t+=10*MINUTE) out.push(simulate(t,cruise,route,currents)); return out;
  }
  function hellGateSnapshot(result) { const leg=result.legs.find(l=>l.a.name==='Hell Gate'||l.b.name==='Hell Gate'); return leg?{time:(leg.start+leg.end)/2,assist:leg.assist,sog:leg.sog,currentSpeed:leg.currentSpeed,currentDir:leg.currentDir}:null; }

  function renderCurve(candidates,best) {
    if(!candidates.length)return ''; const w=680,h=170,pad=28,minT=candidates[0].depart,maxT=candidates[candidates.length-1].depart,mins=candidates.map(c=>c.duration/MINUTE); let lo=Math.min(...mins),hi=Math.max(...mins);
    if(hi-lo<5){lo-=2;hi+=2;} else {const p=(hi-lo)*.12;lo-=p;hi+=p;}
    const x=t=>pad+(w-2*pad)*(t-minT)/(maxT-minT||1), y=v=>h-pad-(h-2*pad)*(v-lo)/(hi-lo||1), path=candidates.map((c,i)=>`${i?'L':'M'}${x(c.depart).toFixed(1)},${y(c.duration/MINUTE).toFixed(1)}`).join(' '), bx=x(best.depart),by=y(best.duration/MINUTE);
    return `<div class="tripcurve"><div class="curvehead"><b>Departure-time curve</b><span>lower is faster</span></div><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Trip duration by departure time"><line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}"/><path d="${path}"/><circle cx="${bx}" cy="${by}" r="5"/><text x="${pad}" y="${h-7}">${fmtTime(minT)}</text><text x="${w-pad}" y="${h-7}" text-anchor="end">${fmtTime(maxT)}</text><text x="${Math.min(w-115,bx+8)}" y="${Math.max(14,by-8)}">best ${fmtTime(best.depart)}</text></svg></div>`;
  }
  function renderResult(best,candidates,startPlace,endPlace,startDepth,endDepth,cruise) {
    const hg=hellGateSnapshot(best),still=best.totalNm/cruise*HOUR,savings=(still-best.duration)/MINUTE,req=(Number(qs('draft')?.value)||0)+(Number(qs('ukc')?.value)||0);
    const depthLine=d=>!d.known?'Depth baseline unavailable':`${d.depth.toFixed(1)} ft est. · ${d.depth>=req?'meets':'below'} ${req.toFixed(1)} ft required`, gateText=hg?`${hg.assist>=0?'+':''}${hg.assist.toFixed(1)} kt along-route assist · ${hg.currentSpeed.toFixed(1)} kt current`:'—';
    const stops=[['Depart',startPlace.name,best.depart],['Hell Gate','Hell Gate',hg?.time],['Brooklyn Bridge','East River',best.legs.find(l=>l.b.name==='Brooklyn Bridge')?.end || best.legs.find(l=>l.a.name==='Brooklyn Bridge')?.start],['Sandy Hook','Lower Harbor',best.legs.find(l=>l.b.name==='Sandy Hook')?.end || best.legs.find(l=>l.a.name==='Sandy Hook')?.start],['Arrive',endPlace.name,best.arrival]].filter(x=>Number.isFinite(x[2]));
    return `<div class="triphero"><div><span>Recommended departure</span><b>${fmtTime(best.depart)}</b><small>${fmtDateTime(best.arrival)} arrival</small></div><div><span>Trip time</span><b>${Math.round(best.duration/MINUTE)} min</b><small>${best.totalNm.toFixed(1)} nm modeled</small></div><div><span>Hell Gate</span><b>${hg?fmtTime(hg.time):'—'}</b><small>${gateText}</small></div><div><span>Current benefit</span><b>${savings>=0?`${Math.round(savings)} min saved`:`${Math.round(-savings)} min added`}</b><small>vs. still water at ${cruise.toFixed(0)} kt</small></div></div><div class="tripdepth"><div><span>Departure water</span><b>${depthLine(startDepth)}</b></div><div><span>Arrival water</span><b>${depthLine(endDepth)}</b></div></div><div class="tripstops">${stops.map(s=>`<div><i></i><span>${s[0]}</span><b>${s[1]}</b><em>${fmtTime(s[2])}</em></div>`).join('')}</div>${renderCurve(candidates,best)}<div class="tripdisclaimer"><b>Beta routing model:</b> NOAA tidal currents are applied to a fixed planning corridor and projected onto vessel heading. This is not a route to steer and does not yet account for traffic, wind/waves, security zones, bridge openings, local speed restrictions, no-wake zones, vessel handling, or real-time current anomalies. Confirm the route with current NOAA ENC/Coast Pilot and normal seamanship.</div>`;
  }
  function drawRoute(route) {
    if(typeof map==='undefined'||!map)return; if(tripLayer){map.removeLayer(tripLayer);tripLayer=null;} const latlngs=[route[0].a,...route.map(l=>l.b)].map(p=>[p.lat,p.lon]); tripLayer=L.polyline(latlngs,{weight:4,opacity:.75,dashArray:'8 7'}).addTo(map); map.fitBounds(tripLayer.getBounds(),{padding:[28,28]});
  }
  function updateEndpointOptions() {
    const places=getPlaces(),south=qs('tripDirection').value==='south',origin=south?places.stamford:places.highlands,dest=south?places.highlands:places.stamford;
    qs('tripOrigin').innerHTML=origin.map((p,i)=>`<option value="${p.id}" ${i===0?'selected':''}>${p.name}</option>`).join(''); qs('tripDestination').innerHTML=dest.map((p,i)=>`<option value="${p.id}" ${p.id==='onewillow'||p.id==='prime'?'selected':''}>${p.name}</option>`).join('');
  }
  function selectedPlace(id){return (typeof P!=='undefined'?P:[]).find(p=>p.id===id);}

  async function optimize() {
    const status=qs('tripStatus'),resultBox=qs('tripResults'),ymd=qs('tripDate').value,cruise=Number(qs('tripSpeed').value)||24,startTime=qs('tripEarliest').value||'06:00',endTime=qs('tripLatest').value||'16:00'; if(!ymd)return;
    const south=qs('tripDirection').value==='south',startPlace=selectedPlace(qs('tripOrigin').value),endPlace=selectedPlace(qs('tripDestination').value); if(!startPlace||!endPlace)return;
    status.textContent='Loading NOAA currents and testing departure windows…'; resultBox.innerHTML='';
    try{
      const keys=Object.keys(CURRENT_STATIONS),settled=await Promise.allSettled(keys.map(k=>fetchCurrentSeries(k,ymd))),currents={},failed=[];
      settled.forEach((r,i)=>{if(r.status==='fulfilled')currents[keys[i]]=r.value;else{currents[keys[i]]=[];failed.push(CURRENT_STATIONS[keys[i]].name)}});
      const route=buildRoute({name:startPlace.name,lat:startPlace.lat,lon:startPlace.lon},{name:endPlace.name,lat:endPlace.lat,lon:endPlace.lon},south),candidates=buildCandidates(ymd,startTime,endTime,cruise,route,currents); if(!candidates.length)throw new Error('Departure window is empty');
      const req=(Number(qs('draft')?.value)||0)+(Number(qs('ukc')?.value)||0),startStation=STATIONS?.[startPlace.s],endStation=STATIONS?.[endPlace.s]; let startSeries=null,endSeries=null;
      try{if(startStation&&Number.isFinite(baseline(startPlace)))startSeries=await fetchTideSeries(startStation.id,ymd)}catch{} try{if(endStation&&Number.isFinite(baseline(endPlace)))endSeries=await fetchTideSeries(endStation.id,ymd)}catch{}
      for(const c of candidates){ const sd=Number.isFinite(baseline(startPlace))&&startSeries?baseline(startPlace)+tideAt(startSeries,c.depart):NaN,ed=Number.isFinite(baseline(endPlace))&&endSeries?baseline(endPlace)+tideAt(endSeries,c.arrival):NaN; c.depthFeasible=(!Number.isFinite(sd)||sd>=req)&&(!Number.isFinite(ed)||ed>=req); c.score=c.duration+(c.depthFeasible?0:24*HOUR); }
      candidates.sort((a,b)=>a.depart-b.depart); const best=[...candidates].sort((a,b)=>a.score-b.score)[0],startDepth=await evaluateDepth(startPlace,best.depart,ymd).catch(()=>({known:false})),endDepth=await evaluateDepth(endPlace,best.arrival,ymd).catch(()=>({known:false}));
      resultBox.innerHTML=renderResult(best,candidates,startPlace,endPlace,startDepth,endDepth,cruise); status.textContent=failed.length?`Route solved with NOAA current fallback at: ${failed.join(', ')}.`:'NOAA current predictions loaded · 10-minute departure search complete.'; drawRoute(route);
    }catch(err){ status.textContent=`Trip Lab could not solve this window: ${err.message||err}`; }
  }
  function init() {
    if(!qs('tripLab'))return; qs('tripDate').value=easternDateString(); updateEndpointOptions(); qs('tripDirection').addEventListener('change',()=>{updateEndpointOptions();qs('tripResults').innerHTML='';}); qs('optimizeTrip').addEventListener('click',optimize);
  }
  init();
})();