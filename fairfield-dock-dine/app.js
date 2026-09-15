const STATIONS={
  greenwich:{id:'8469549',name:'Cos Cob Harbor / Greenwich'},
  stamford:{id:'8469198',name:'Stamford Harbor'},
  rowayton:{id:'8468609',name:'Rowayton / Five Mile River'},
  norwalk:{id:'8468448',name:'South Norwalk'},
  saugatuck:{id:'8468191',name:'Saugatuck River'},
  blackrock:{id:'8467373',name:'Black Rock Harbor'},
  bridgeport:{id:'8467150',name:'Bridgeport'},
  stratford:{id:'8466797',name:'Stratford / I-95 Bridge'}
};

const PLACES=[
{id:'lescale',name:"L'escale at Delamar",town:'Greenwich',water:'Greenwich Harbor',lat:41.01783,lon:-73.62383,kind:'direct',station:'greenwich',access:'Delamar private marina · 15 transient slips reported',dockDepth:8,approachDepth:9,confidence:'medium',phone:'Marina 203-733-5320',vhf:'9 / working 78',maxDraft:null,url:'https://lescalerestaurant.com/',evidenceUrl:'https://www.delamar.com/hotels/delamar-greenwich-harbor/greenwich-marina',evidenceLabel:'Delamar Greenwich Harbor Marina · official',depthSourceUrl:'https://www.waterwayguide.com/marina/1-1180/delamar-greenwich-harbor-marina',depthSource:'Waterway Guide: 9 ft approach / 8 ft dockside',note:'Delamar publishes more than 500 ft of private dockage and accepts yachts up to 180 ft. The low-water depths are secondary marina-directory figures; confirm current slip assignment and sounding with the dockmaster.'},
{id:'prime',name:'Prime: An American Kitchen & Bar',town:'Stamford',water:'Stamford Harbor · West Branch',lat:41.03833,lon:-73.54500,kind:'marina',station:'stamford',access:'Harbor Point West Dock & Dine',dockDepth:8,approachDepth:12,confidence:'medium',phone:'Dockmaster 203-355-6045',vhf:'9',maxDraft:null,url:'https://stamford.restaurantprime.com/',evidenceUrl:'https://harborpointmarinas.com/transient-slips-stamford-ct/',evidenceLabel:'Harbor Point Marinas Dock & Dine · official',depthSourceUrl:'https://www.waterwayguide.com/marina/stamford-landing-marina',depthSource:'Waterway Guide: 12 ft approach / 8 ft dockside',note:'Harbor Point explicitly lists Prime as a Dock & Dine option. Slips are first-come and assigned by the dockmaster; do not enter an unassigned slip.'},
{id:'wheel',name:'The Wheel',town:'Stamford',water:'Stamford Harbor · East Marina',lat:41.04130,lon:-73.53086,kind:'marina',station:'stamford',access:'Harbor Point East / Village marina',dockDepth:6,approachDepth:10,confidence:'medium',phone:'Dockmaster 203-355-6045',vhf:'9',maxDraft:null,url:'https://www.thevillagewheel.com/',evidenceUrl:'https://harborpointmarinas.com/transient-slips-stamford-ct/',evidenceLabel:'Harbor Point Marinas Dock & Dine · official',depthSourceUrl:'https://marinas.com/view/marina/z4c2r2_Harbor_Point_East_Marina_Stamford_CT_United_States',depthSource:'Marinas.com: 10 ft approach / 6 ft MLW dock depth',note:'Harbor Point lists The Wheel as a Dock & Dine destination. The restaurant/marina cautions against deep-draft vessels; the directory sounding is a planning baseline, not a guaranteed slip depth.'},
{id:'fortina',name:'Fortina Stamford',town:'Stamford',water:'Harbor Point · North Marina',lat:41.04050,lon:-73.54370,kind:'marina',station:'stamford',access:'Harbor Point North Dock & Dine',dockDepth:6,approachDepth:10,confidence:'medium',phone:'Dockmaster 203-355-6045',vhf:'9',maxDraft:null,url:'https://fortinapizza.com/',evidenceUrl:'https://harborpointmarinas.com/transient-slips-stamford-ct/',evidenceLabel:'Harbor Point Marinas Dock & Dine · official',depthSourceUrl:'https://marinas.com/view/marina/8qcw2p_Harbor_Point_North_Marina_Stamford_CT_United_States',depthSource:'Marinas.com: 10 ft approach / 6 ft MLW dock depth',note:'Harbor Point explicitly lists Fortina among its Dock & Dine options. Slip assignment comes from the marina; the restaurant is reached from the Harbor Point waterfront.'},
{id:'whale',name:'Sign of the Whale',town:'Stamford',water:'Harbor Point · North Marina',lat:41.04015,lon:-73.54325,kind:'marina',station:'stamford',access:'Harbor Point North Dock & Dine',dockDepth:6,approachDepth:10,confidence:'medium',phone:'Dockmaster 203-355-6045',vhf:'9',maxDraft:null,url:'https://www.signofthewhalect.com/',evidenceUrl:'https://harborpointmarinas.com/transient-slips-stamford-ct/',evidenceLabel:'Harbor Point Marinas Dock & Dine · official',depthSourceUrl:'https://marinas.com/view/marina/8qcw2p_Harbor_Point_North_Marina_Stamford_CT_United_States',depthSource:'Marinas.com: 10 ft approach / 6 ft MLW dock depth',note:'This is marina-access dining rather than a restaurant-owned slip. Harbor Point officially includes Sign of the Whale in its Dock & Dine list.'},
{id:'bareburger',name:'Bareburger Stamford',town:'Stamford',water:'Harbor Point · North Marina',lat:41.03985,lon:-73.54280,kind:'marina',station:'stamford',access:'Harbor Point North Dock & Dine',dockDepth:6,approachDepth:10,confidence:'medium',phone:'Dockmaster 203-355-6045',vhf:'9',maxDraft:null,url:'https://bareburger.com/locations/stamford/',evidenceUrl:'https://harborpointmarinas.com/transient-slips-stamford-ct/',evidenceLabel:'Harbor Point Marinas Dock & Dine · official',depthSourceUrl:'https://marinas.com/view/marina/8qcw2p_Harbor_Point_North_Marina_Stamford_CT_United_States',depthSource:'Marinas.com: 10 ft approach / 6 ft MLW dock depth',note:'Harbor Point explicitly lists Bareburger as a Dock & Dine option. Call or hail the marina for a real-time slip assignment.'},
{id:'rowayton',name:'Rowayton Seafood',town:'Rowayton / Norwalk',water:'Five Mile River',lat:41.06470,lon:-73.44520,kind:'direct',station:'rowayton',access:'Restaurant boat slips · reservation required',dockDepth:null,approachDepth:7,confidence:'low',phone:'Restaurant 203-866-4488',vhf:'68 at peak',maxDraft:null,url:'https://www.rowaytonseafood.com/',evidenceUrl:'https://www.rowaytonseafood.com/dock-1',evidenceLabel:'Rowayton Seafood boat-slip policy · official',depthSourceUrl:'https://nauticalcharts.noaa.gov/publications/coast-pilot/index.html',depthSource:'Conservative local approach context; restaurant dock sounding not published',note:'Boat slips are very limited, require confirmation and carry a strict two-hour limit. Do not arrive by boat without a confirmed slip. The card does not claim a restaurant dock depth because no current primary sounding was found.'},
{id:'harborlights',name:'Harbor Lights',town:'Norwalk',water:'Norwalk Harbor',lat:41.09110,lon:-73.41400,kind:'direct',station:'norwalk',access:'Restaurant customer dock',dockDepth:null,approachDepth:null,confidence:'unknown',phone:'203-866-3364',vhf:'Call venue',maxDraft:null,url:'https://harborlightsrestaurant-ct.com/',evidenceUrl:'https://harborlightsrestaurant-ct.com/',evidenceLabel:'Harbor Lights · official boat-arrival statement',depthSourceUrl:'https://nauticalcharts.noaa.gov/publications/coast-pilot/index.html',depthSource:'No defensible restaurant-dock baseline found',note:'Harbor Lights explicitly welcomes boaters to its dock just beyond the restaurant. Tide is shown, but the site will not invent a dock depth; call for current water alongside the dock.'},
{id:'sunset',name:'Sunset Grille at Norwalk Cove',town:'Norwalk',water:'Norwalk Harbor',lat:41.08395,lon:-73.39999,kind:'marina',station:'norwalk',access:'Norwalk Cove Marina transient access',dockDepth:9,approachDepth:9,confidence:'medium',phone:'Marina 203-838-5899',vhf:'9 / 72',maxDraft:null,url:'https://www.sunsetgrille.net/',evidenceUrl:'https://www.norwalkcove.com/',evidenceLabel:'Norwalk Cove Marina + on-site restaurant',depthSourceUrl:'https://www.waterwayguide.com/marina/norwalk-cove-marina-inc',depthSource:'Waterway Guide: 9 ft approach / 9 ft dockside',note:'Sunset Grille sits inside Norwalk Cove Marina. The marina is a protected basin with transient dockage; confirm the assigned berth and current depth before arrival.'},
{id:'sono',name:'SoNo Seaport Seafood',town:'South Norwalk',water:'Norwalk River',lat:41.09820,lon:-73.41350,kind:'marina',station:'norwalk',access:'Norwalk Visitor’s Docks · short walk',dockDepth:8,approachDepth:12,confidence:'medium',phone:'Boating Center 203-866-8810',vhf:'9',maxDraft:null,url:'https://www.sonoseaportseafood.com/',evidenceUrl:'https://www.norwalkct.gov/306/Norwalk-Visitors-Docks',evidenceLabel:'City of Norwalk Visitor’s Docks',depthSourceUrl:'https://www.waterwayguide.com/marina/david-s-dunavan-visitors-dock',depthSource:'Waterway Guide: 12 ft approach / 8 ft dockside at municipal visitor docks',note:'This card uses the nearby municipal visitor docks as the verified access path, not an assumed restaurant-owned slip. Walk from the transient dock to the restaurant.'},
{id:'bridge',name:'The Bridge at Saugatuck',town:'Westport',water:'Saugatuck River',lat:41.11950,lon:-73.36950,kind:'direct',station:'saugatuck',access:'8 private restaurant slips · first-come',dockDepth:null,approachDepth:1,confidence:'low',phone:'203-557-0984',vhf:'Call on approach',maxDraft:null,url:'https://www.thebridgesaugatuck.com/',evidenceUrl:'https://www.thebridgesaugatuck.com/blog/dock-dine-at-the-bridge-boat-up-restaurant-westport-connecticut-x2cdg',evidenceLabel:'The Bridge Dock & Dine · official',depthSourceUrl:'https://nauticalcharts.noaa.gov/publications/coast-pilot/index.html',depthSource:'NOAA Coast Pilot controlling-depth warning; dock sounding unpublished',note:'The Bridge offers eight dining-only slips. Saugatuck is the most conservative waterway in this guide: NOAA Coast Pilot reports severe shoaling and very shallow controlling depth farther upriver. Favor a rising tide and local knowledge.'},
{id:'whelk',name:'The Whelk',town:'Westport',water:'Saugatuck River',lat:41.12230,lon:-73.37020,kind:'direct',station:'saugatuck',access:'3 customer slips · vessels to 33 ft',dockDepth:null,approachDepth:1,confidence:'low',phone:'203-557-0902',vhf:'Call ahead',maxDraft:null,url:'https://thewhelkwestport.com/',evidenceUrl:'https://thewhelkwestport.com/contact',evidenceLabel:'The Whelk dock policy · official',depthSourceUrl:'https://nauticalcharts.noaa.gov/publications/coast-pilot/index.html',depthSource:'NOAA Coast Pilot controlling-depth warning; dock sounding unpublished',note:'The Whelk publishes three first-come customer slips for boats up to 33 ft. The 1-ft low-water approach baseline is intentionally conservative and reflects the Coast Pilot’s controlling-depth warning, not a measured restaurant-slip depth.'},
{id:'captains',name:"Captain's Cove Seaport Restaurant",town:'Bridgeport',water:'Black Rock Harbor',lat:41.15733,lon:-73.21417,kind:'marina',station:'blackrock',access:'Captain’s Cove transient dock',dockDepth:13,approachDepth:18,confidence:'medium',phone:'Marina 203-335-1433',vhf:'18',maxDraft:null,url:'https://www.captainscoveseaport.com/lower-deck-menu',evidenceUrl:'https://www.captainscoveseaport.com/marina',evidenceLabel:'Captain’s Cove transient dock · official',depthSourceUrl:'https://www.waterwayguide.com/marina/captains-cove-seaport',depthSource:'Waterway Guide: 18 ft approach / 13 ft dockside',note:'The Seaport publishes transient dock availability and has its seasonal waterfront restaurant on site. Black Rock Harbor’s NOAA station is unusually local to this destination.'},
{id:'boca',name:'Boca Oyster Bar',town:'Bridgeport',water:'Bridgeport Harbor · Steelpointe',lat:41.17420,lon:-73.18040,kind:'direct',station:'bridgeport',access:'Bridgeport Harbor Marina Dock & Dine · Dock A',dockDepth:12,approachDepth:25,confidence:'medium',phone:'Dockmaster 203-330-8787',vhf:'9',maxDraft:null,url:'https://bocaoysterbar.com/',evidenceUrl:'https://bridgeportharbormarina.com/service/dock-and-dine/',evidenceLabel:'Bridgeport Harbor Marina Dock & Dine · official',depthSourceUrl:'https://www.waterwayguide.com/featured-marina/steeelpointe-harbor-marina',depthSource:'Waterway Guide: 25 ft approach / 12 ft dockside',note:'No dockage reservation is required for Dock & Dine; proceed to Dock A and contact the dockmaster. Restaurant reservations are recommended.'},
{id:'outriggers',name:'Outriggers',town:'Stratford',water:'Housatonic River',lat:41.18893,lon:-73.12077,kind:'marina',station:'stratford',access:'Safe Harbor Stratford transient slips',dockDepth:12,approachDepth:15,confidence:'medium',phone:'Marina 203-377-4477',vhf:'9',maxDraft:8,url:'https://outriggersrestaurant.com/',evidenceUrl:'https://safeharbor.com/locations/safe-harbor-stratford/',evidenceLabel:'Safe Harbor Stratford · official on-site restaurant',depthSourceUrl:'https://www.waterwayguide.com/marina/safe-harbor-stratford',depthSource:'Waterway Guide: 15 ft approach / 12 ft dockside',note:'Outriggers is on site at Safe Harbor Stratford. The marina accepts transient boats; current can be strong. The planner also enforces an 8-ft transient-draft ceiling as a conservative policy check.'},
{id:'joey',name:"Joey C's Boathouse",town:'Stratford',water:'Housatonic River',lat:41.20250,lon:-73.11100,kind:'marina',station:'stratford',access:'Boardwalk Marina · on-site dining',dockDepth:12,approachDepth:13,confidence:'medium',phone:'Marina 203-378-9300',vhf:'9',maxDraft:null,url:'https://www.joeycsboathouse.com/',evidenceUrl:'https://boardwalkmarinact.com/',evidenceLabel:'Boardwalk Marina · official on-site dining',depthSourceUrl:'https://www.waterwayguide.com/marina/marina-at-the-dock',depthSource:'Waterway Guide: 13 ft approach / 12 ft dockside',note:'Boardwalk Marina identifies Joey C’s as its on-site waterfront restaurant and links directly to NOAA Stratford tides. Call the marina for transient availability and current river conditions.'}
];

const tideCache={};
let markers={};
let map;
let tideLoadSerial=0;
const $=id=>document.getElementById(id);
const HOUR=3600e3;

function easternParts(ms){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ms));
  const get=t=>parts.find(p=>p.type===t)?.value||'';
  return{year:get('year'),month:get('month'),day:get('day'),hour:get('hour'),minute:get('minute')};
}
function easternYmd(ms){const p=easternParts(ms);return `${p.year}${p.month}${p.day}`}
function easternMs(s){
  const m=s.match(/(\d{4})-(\d\d)-(\d\d)[ T](\d\d):(\d\d)/);if(!m)return NaN;
  const guess=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5]);
  const p=easternParts(guess);
  const represented=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);
  return guess-(represented-guess);
}
function defaultArrival(){const ms=Math.ceil(Date.now()/(30*60e3))*(30*60e3),p=easternParts(ms);return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`}
function arrivalMs(){const v=$('arrivalTime').value;return v?easternMs(v):Date.now()}
function fmtArrival(ms){return new Date(ms).toLocaleString([],{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
function fmtTime(ms){return new Date(ms).toLocaleTimeString([],{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'})}
function requirement(){return (+$('draft').value||0)+(+$('margin').value||0)}

function normalize(points){return(points||[]).map(p=>({t:easternMs(p.t),v:Number(p.v),type:p.type||''})).filter(p=>Number.isFinite(p.t)&&Number.isFinite(p.v)).sort((a,b)=>a.t-b.t)}
function valueAt(series,ms){
  const pts=series?.points||[];if(!pts.length)return NaN;
  if(ms<=pts[0].t)return pts[0].v;if(ms>=pts[pts.length-1].t)return pts[pts.length-1].v;
  let a=pts[0],b=pts[pts.length-1];for(let i=1;i<pts.length;i++){if(pts[i].t>=ms){a=pts[i-1];b=pts[i];break}}
  if(b.t===a.t)return a.v;let x=(ms-a.t)/(b.t-a.t);if(series.mode==='hilo')x=(1-Math.cos(Math.PI*x))/2;return a.v+(b.v-a.v)*x;
}
async function requestNoaa(stationId,center,interval){
  const start=center-18*HOUR,end=center+30*HOUR;
  const q=new URLSearchParams({product:'predictions',application:'fairfield-dock-dine',begin_date:easternYmd(start),end_date:easternYmd(end),datum:'MLLW',station:stationId,time_zone:'lst_ldt',units:'english',format:'json',interval});
  const r=await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?'+q.toString());
  const j=await r.json().catch(()=>null);if(!r.ok||!Array.isArray(j?.predictions)||!j.predictions.length)throw new Error(j?.error?.message||`NOAA ${r.status}`);return j.predictions;
}
async function fetchSeries(stationId,center){
  try{return{points:normalize(await requestNoaa(stationId,center,'6')),mode:'6'}}catch(first){
    const pts=normalize(await requestNoaa(stationId,center,'hilo'));return{points:pts,mode:'hilo',fallback:true};
  }
}
async function loadTides(){
  const serial=++tideLoadSerial,center=arrivalMs();$('feedCount').textContent='Loading…';
  await Promise.all(Object.entries(STATIONS).map(async([key,s])=>{try{const series=await fetchSeries(s.id,center);tideCache[key]={...series,name:s.name,id:s.id}}catch(error){tideCache[key]={points:[],mode:'error',name:s.name,id:s.id,error:String(error)}}}));
  if(serial!==tideLoadSerial)return;
  $('feedCount').textContent=Object.values(tideCache).filter(s=>s.points?.length).length+'/'+Object.keys(STATIONS).length+' live';renderCards();
}

function depthStatus(p,tide){
  const draft=+$('draft').value||0,margin=+$('margin').value||0,req=draft+margin;
  if(p.maxDraft&&draft>p.maxDraft)return{cls:'no',text:`Boat draft exceeds this marina's ${p.maxDraft.toFixed(1)} ft planning limit`,dock:NaN,approach:NaN,control:NaN};
  if(!Number.isFinite(tide))return{cls:'unknown',text:'NOAA prediction unavailable for selected arrival',dock:NaN,approach:NaN,control:NaN};
  const dock=Number.isFinite(p.dockDepth)?p.dockDepth+tide:NaN;
  const approach=Number.isFinite(p.approachDepth)?p.approachDepth+tide:NaN;
  const vals=[dock,approach].filter(Number.isFinite);if(!vals.length)return{cls:'unknown',text:'Tide available · no defensible depth baseline for this dock',dock,approach,control:NaN};
  const control=Math.min(...vals),delta=control-req;
  const scope=Number.isFinite(dock)&&Number.isFinite(approach)?'Controlling dock/approach estimate':Number.isFinite(dock)?'Dock-depth estimate':'Approach-depth estimate only';
  return{cls:delta>=1?'ok':delta>=0?'caution':'no',text:delta>=1?`${scope} clears draft + UKC by ${delta.toFixed(1)} ft`:delta>=0?`${scope} narrowly clears selected minimum by ${delta.toFixed(1)} ft`:`${scope} is ${Math.abs(delta).toFixed(1)} ft below draft + UKC`,dock,approach,control};
}
function confidenceLabel(c){return c==='medium'?'Medium-confidence planning baseline':c==='low'?'Low-confidence / conservative baseline':'No dock-depth baseline'}
function showPlace(p,filter,q){const text=(p.name+' '+p.town+' '+p.water).toLowerCase();if(q&&!text.includes(q))return false;if(filter==='direct')return p.kind==='direct';if(filter==='marina')return p.kind==='marina';if(filter==='depth')return Number.isFinite(p.dockDepth);return true}
function pillLabel(p){return p.kind==='direct'?'Direct customer dock':'Verified marina access'}

function chartHtml(p,series,center){
  if(!series?.points?.length)return'';
  const start=center-12*HOUR,end=center+12*HOUR,samples=[];for(let t=start;t<=end;t+=15*60e3){const v=valueAt(series,t);if(Number.isFinite(v))samples.push({t,v})}if(!samples.length)return'';
  const baselines=[p.dockDepth,p.approachDepth].filter(Number.isFinite),controllingBaseline=baselines.length?Math.min(...baselines):NaN;
  const thresholdTide=Number.isFinite(controllingBaseline)?requirement()-controllingBaseline:NaN;
  const vals=samples.map(s=>s.v);if(Number.isFinite(thresholdTide))vals.push(thresholdTide);let min=Math.min(...vals),max=Math.max(...vals);const pad=Math.max(.25,(max-min)*.12);min-=pad;max+=pad;
  const x=t=>10+300*(t-start)/(end-start),y=v=>88-72*(v-min)/(max-min||1);
  const path=samples.map((s,i)=>`${i?'L':'M'}${x(s.t).toFixed(1)},${y(s.v).toFixed(1)}`).join(' ');
  const threshold=Number.isFinite(thresholdTide)&&thresholdTide>=min&&thresholdTide<=max?`<line x1="10" y1="${y(thresholdTide).toFixed(1)}" x2="310" y2="${y(thresholdTide).toFixed(1)}" stroke="#b66a2c" stroke-width="1.5" stroke-dasharray="5 4"/><text x="306" y="${Math.max(11,y(thresholdTide)-3).toFixed(1)}" text-anchor="end" font-size="8.5" fill="#8a5529">draft + UKC threshold</text>`:'';
  const events=series.points.filter(a=>(a.type==='H'||a.type==='L')&&a.t>=center).slice(0,2).map(a=>`${a.type==='H'?'High':'Low'} ${fmtTime(a.t)} · ${a.v.toFixed(1)} ft`).join(' · ');
  return `<div class="tidechart"><div class="charthead"><b>24-hour tide window</b><span>${series.mode==='hilo'?'NOAA H/L · curve interpolated':'NOAA 6-minute prediction'}</span></div><svg viewBox="0 0 320 100" role="img" aria-label="24-hour predicted tide chart"><line x1="10" y1="88" x2="310" y2="88" stroke="#cbd6d8" stroke-width="1"/>${threshold}<line x1="160" y1="10" x2="160" y2="90" stroke="#617a80" stroke-width="1" stroke-dasharray="3 4"/><path d="${path}" fill="none" stroke="#15718a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><text x="10" y="99" font-size="9" fill="#667b80">−12h</text><text x="160" y="99" text-anchor="middle" font-size="9" fill="#425f66">arrival</text><text x="310" y="99" text-anchor="end" font-size="9" fill="#667b80">+12h</text></svg>${events?`<div class="nexttides">${events}</div>`:''}</div>`;
}

function renderCards(){
  const q=$('search').value.trim().toLowerCase(),filter=$('statusFilter').value,center=arrivalMs();
  const shown=PLACES.filter(p=>showPlace(p,filter,q));$('countLabel').textContent=`${shown.length} shown · ${PLACES.length} verified dining-access paths`;
  $('helmDraft').textContent=(+$('draft').value||0).toFixed(1)+' ft';$('helmRequired').textContent=requirement().toFixed(1)+' ft';$('helmArrival').textContent=fmtArrival(center);
  $('cards').innerHTML=shown.length?shown.map(p=>{
    const series=tideCache[p.station],tide=valueAt(series,center),d=depthStatus(p,tide);
    const tideText=Number.isFinite(tide)?tide.toFixed(2)+' ft MLLW':'—';
    const dockText=Number.isFinite(d.dock)?d.dock.toFixed(1)+' ft':'—';const approachText=Number.isFinite(d.approach)?d.approach.toFixed(1)+' ft':'—';
    return `<article class="card"><div class="cardtop"><div class="titleline"><div><h3>${p.name}</h3><div class="town">${p.town} · ${p.water}</div></div><span class="pill ${p.kind}">${pillLabel(p)}</span></div></div><div class="cardbody"><div class="stats"><div class="stat"><span>Access</span><b>${p.access}</b></div><div class="stat"><span>Dockmaster / venue</span><b>${p.phone}</b></div><div class="stat"><span>VHF / arrival</span><b>${p.vhf}</b></div></div><div class="verifybox ${p.kind}"><b>${p.evidenceLabel}</b><br><a href="${p.evidenceUrl}" target="_blank" rel="noopener">Access evidence</a> · <a href="${p.depthSourceUrl}" target="_blank" rel="noopener">Depth basis</a></div><div class="water"><div class="waterrow"><div class="watermetric"><div class="waterlabel">Predicted tide at arrival</div><div class="waternum">${tideText}</div></div><div class="watermetric right"><div class="waterlabel">Est. dock depth</div><div class="waternum">${dockText}</div></div><div class="watermetric"><div class="waterlabel">Est. approach depth</div><div class="waternum">${approachText}</div></div><div class="watermetric right"><div class="waterlabel">Required depth</div><div class="waternum">${requirement().toFixed(1)} ft</div></div></div><div class="go ${d.cls}">${d.text}</div><div class="depthmeta">${confidenceLabel(p.confidence)} · ${p.depthSource}</div>${chartHtml(p,series,center)}</div><div class="notes">${p.note}</div><div class="cardactions"><button class="smallbtn" onclick="focusPlace('${p.id}')">Map</button><a class="smallbtn secondary" href="${p.url}" target="_blank" rel="noopener">Venue</a><a class="smallbtn source" href="${p.evidenceUrl}" target="_blank" rel="noopener">Access source</a></div></div></article>`;
  }).join(''):'<div class="filterempty">No destinations match this filter.</div>';
  syncMap(filter,q);
}

function initMap(){
  map=L.map('map',{zoomControl:true}).setView([41.085,-73.39],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',{maxZoom:18,opacity:.9,attribution:'© OpenSeaMap'}).addTo(map);
  PLACES.forEach(p=>{const c=p.kind==='direct'?'green':'blue';const icon=L.divIcon({className:'',html:`<div class="marker ${c}"><i></i></div>`,iconSize:[22,22],iconAnchor:[11,22]});markers[p.id]=L.marker([p.lat,p.lon],{icon}).bindPopup(`<div class="popup-name">${p.name}</div><div class="popup-meta">${p.town} · ${p.water}</div><div class="popup-status">${pillLabel(p)}</div>`).addTo(map)});
}
function syncMap(filter,q){if(!map)return;PLACES.forEach(p=>{const m=markers[p.id],want=showPlace(p,filter,q);if(want&&!map.hasLayer(m))m.addTo(map);if(!want&&map.hasLayer(m))map.removeLayer(m)})}
window.focusPlace=id=>{const p=PLACES.find(x=>x.id===id);if(p&&map){map.setView([p.lat,p.lon],16);markers[id]?.openPopup();$('map').scrollIntoView({behavior:'smooth',block:'center'})}};
window.zoomRoute=r=>{const b={west:[[40.995,-73.66],[41.06,-73.50]],norwalk:[[41.045,-73.47],[41.115,-73.385]],westport:[[41.095,-73.395],[41.145,-73.345]],east:[[41.135,-73.24],[41.22,-73.08]]};if(map&&b[r])map.fitBounds(b[r])};

$('arrivalTime').value=defaultArrival();
['search','statusFilter','draft','margin'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',renderCards));
$('arrivalTime').addEventListener('change',()=>{renderCards();loadTides()});
initMap();renderCards();loadTides();
setInterval(()=>loadTides(),600000);
