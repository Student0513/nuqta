(() => {
// ---------- symbols ----------
const ICON = {
  bulb:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6c-8 0-13 6-13 13 0 5 3 8 5 10 1.5 1.5 2 3 2 5h12c0-2 .5-3.5 2-5 2-2 5-5 5-10 0-7-5-13-13-13z"/><path d="M19 39h10M20 43h8"/><path d="M21 22l3 4 3-4M24 26v8"/><path d="M5 18H2M46 18h-3M9 6 7 4M39 6l2-2"/></svg>',
  knight:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 42h22M16 38h18l-2-6c-1-3 0-6 3-9 2-3 1-8-2-11-3-3-8-5-13-5l1 4-5 5-4 7 2 3 4-2 3 1-5 7z"/><circle cx="21" cy="15" r="1.4" fill="currentColor"/></svg>',
  globe:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c6 6 6 30 0 36M24 6c-6 6-6 30 0 36M10 13c8 4 20 4 28 0M10 35c8-4 20-4 28 0"/></svg>',
  masks:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8c6 3 14 3 20 0v12c0 7-4 12-10 12S6 27 6 20z"/><path d="M11 16h3M18 16h3M12 25c2-2 6-2 8 0"/><path d="M28 18c5 2 10 2 14 0v10c0 7-4 12-9 12-3 0-6-2-7-5"/><path d="M32 25h2M37 25h2M33 33c2 1 4 1 6 0"/></svg>',
  megaphone:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20v8h6l18 10V10L14 20z"/><path d="M14 28l3 11h5l-2-9"/><path d="M38 18c2 2 2 10 0 12M42 14c4 4 4 16 0 20"/></svg>',
  scale:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6v34M14 42h20M10 12h28"/><path d="M10 12 4 26h12zM38 12l-6 14h12z"/><path d="M4 26c0 4 12 4 12 0M32 26c0 4 12 4 12 0"/></svg>',
  book:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 32h36v6H6zM8 26h32v6H8zM5 20h34v6H5z"/><path d="M12 20v6M20 26v6M30 32v6"/></svg>',
  eye:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 24s8-13 21-13 21 13 21 13-8 13-21 13S3 24 3 24z"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="1.6" fill="currentColor"/></svg>',
  column:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16 24 6l18 10zM8 42h32M6 46h36"/><path d="M11 20v18M19 20v18M29 20v18M37 20v18M8 18h32"/></svg>',
  quill:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M40 6C26 8 16 18 12 34l-4 8"/><path d="M40 6c0 12-8 24-22 26M18 24l10 1M22 17l8 1"/></svg>',
  bubble:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10h36v22H22l-10 8v-8H6z"/><circle cx="16" cy="21" r="1.6" fill="currentColor"/><circle cx="24" cy="21" r="1.6" fill="currentColor"/><circle cx="32" cy="21" r="1.6" fill="currentColor"/></svg>',
  cal:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="36" height="32"/><path d="M6 19h36M15 5v9M33 5v9"/><circle cx="24" cy="30" r="3" fill="currentColor"/></svg>'
};
const sym = (k, cls='') => `<span class="sym ${cls}" aria-hidden="true">${ICON[k] || ICON.bulb}</span>`;
const SECTIONS = ['Politics','Culture','Media & Narratives','Society','Economy','World'];
const REGIONS = ['Pakistan','South Asia','Middle East','World','Economy','Climate','Tech'];
const STATUSES = ['Developing','Update','Explainer','Analysis'];
const SECTION_SYM = {'Politics':'column','Culture':'masks','Media & Narratives':'eye','Society':'bubble','Economy':'scale','World':'globe'};

// ---------- state ----------
const S = {
  news:[], articles:[], prompts:[], posts:[], stanceCounts:{},
  myDots:new Set(), myStances:{}, myReports:new Set(), mySubs:[],
  queue:[], decided:[], reports:[], words:[], team:[],
  loaded:false, session:null,
  me:{id:null, name:'', role:'guest'},
  view:'news', day:null, region:'All', calOpen:false, calMonth:null,
  section:'All', author:'All',
  layer:'pieces', thread:null, floorTab:'prompt', promptId:null, sort:'top',
  replyTo:null, replyDraft:'', deskTab:'queue', editId:null, approving:null, armed:null, errs:{},
  authMode:null, authMsg:null
};
const isEditor = () => S.me.role === 'editor' || S.me.role === 'owner';
const isOwner = () => S.me.role === 'owner';
const canPost = () => !!S.me.id && S.me.role !== 'banned';

// ---------- helpers ----------
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2,'0');
const dayKey = t => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const todayKey = () => dayKey(Date.now());
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmtDate = t => { const d = new Date(t); return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`; };
const fmtTime = t => { const d = new Date(t); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
function ago(t){
  const s = Math.max(1, Math.round((Date.now()-t)/1000));
  if (s < 60) return 'just now';
  const m = Math.round(s/60); if (m < 60) return m + 'm ago';
  const h = Math.round(m/60); if (h < 24) return h + 'h ago';
  const d = Math.round(h/24); if (d < 7) return d + 'd ago';
  return fmtDate(t);
}
const rot = (id, amp=1.2) => { let h=0; for (const c of String(id)) h = (h*31 + c.charCodeAt(0))|0; return ((Math.abs(h)%100)/100*2-1)*amp; };
const readMins = txt => Math.max(1, Math.round(String(txt||'').split(/\s+/).length / 220));
const letters = (w, start=0) => [...w].map((c,i)=>`<span style="--i:${i+start}">${esc(c)}</span>`).join('');
function keyToDate(key){ const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d); }
function addDays(key,n){ const d = keyToDate(key); d.setDate(d.getDate()+n); return dayKey(d); }
function mondayOf(key){ const d = keyToDate(key); d.setDate(d.getDate()-((d.getDay()+6)%7)); return dayKey(d); }
function dayLabel(k){ const t = todayKey(); if (k===t) return 'Today'; if (k===addDays(t,-1)) return 'Yesterday'; const d = keyToDate(k); return `${WD[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}`; }
function richBody(txt){
  return String(txt||'').trim().split(/\n\s*\n/).map(p => {
    p = p.trim();
    if (p.startsWith('> ')) return `<blockquote>${esc(p.slice(2))}</blockquote>`;
    if (p.startsWith('## ')) return `<h2>${esc(p.slice(3))}</h2>`;
    return `<p>${esc(p).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</p>`;
  }).join('');
}
let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(()=>t.hidden=true, 3400); }
const sampleTag = x => x.sample ? '<span class="sticker sample">Sample</span>' : '';
const guide = (txt, btn) => `<div class="guide"><span class="gl">${sym('bulb')} How it works</span><span class="gt">${txt}</span>${btn||''}</div>`;
const val = id => (document.getElementById(id)?.value || '').trim();
function friendly(err){
  const m = String(err?.message || err || '');
  if (m.includes('blocked_language')) return 'This contains language that breaks the house rules. Please rephrase it.';
  if (m.includes('too_many_links')) return 'Too many links. Keep it to two or fewer.';
  if (m.includes('rate_limited')) return 'You are posting very fast. Take a short break and try again.';
  if (m.includes('too_many_pending')) return 'You already have 5 articles in review. Wait for an editor first.';
  if (m.includes('only_owner')) return 'Only the site owner can change roles.';
  if (m.includes('row-level security') || m.includes('permission denied')) return 'Your account is not allowed to do that.';
  if (m.includes('Invalid login credentials')) return 'Email or password is wrong.';
  if (m.includes('Email not confirmed')) return 'Confirm your email first. Check your inbox for the link.';
  if (m.includes('Password should be')) return 'Password must be at least 6 characters.';
  if (m.includes('already registered')) return 'That email already has an account. Sign in instead.';
  return m || 'Something went wrong. Try again.';
}

// ---------- Supabase ----------
const CFG = window.NUQTA_CONFIG || {};
const configured = CFG.supabaseUrl && !CFG.supabaseUrl.includes('YOUR-PROJECT') && CFG.supabaseAnonKey && !CFG.supabaseAnonKey.includes('YOUR-');
const sb = configured && window.supabase ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey) : null;
const ts = x => Date.parse(x);

async function loadPublic(){
  const [n, a, p, sc] = await Promise.all([
    sb.from('news').select('*').order('created_at',{ascending:false}).limit(300),
    sb.from('articles').select('*').eq('status','published').order('published_at',{ascending:false}).limit(200),
    sb.from('prompts').select('*').order('week',{ascending:false}).limit(200),
    sb.from('stance_counts').select('*')
  ]);
  for (const r of [n,a,p,sc]) if (r.error) throw r.error;
  S.news = n.data.map(x => ({...x, ts: ts(x.created_at)}));
  S.articles = a.data.map(x => ({...x, ts: ts(x.published_at || x.created_at)}));
  S.prompts = p.data;
  S.stanceCounts = Object.fromEntries(sc.data.map(r => [r.article_id, r]));
  await loadPosts();
}
async function loadPosts(){
  const r = await sb.from('public_posts').select('*').order('created_at',{ascending:false}).limit(1000);
  if (r.error) throw r.error;
  S.posts = r.data.map(p => ({id:p.id, key:p.id, uid:p.user_id, name:p.author_name, mine:p.mine, space:p.space, ref:p.ref||'', parent:p.parent_id, text:p.body, anon:p.anon, ts:ts(p.created_at), dots:p.dots}));
}
async function loadMe(){
  S.myDots = new Set(); S.myStances = {}; S.myReports = new Set(); S.mySubs = [];
  S.queue = []; S.decided = []; S.reports = []; S.words = []; S.team = [];
  const u = S.session?.user;
  if (!u) { S.me = {id:null, name:'', role:'guest'}; return; }
  const prof = await sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
  S.me = {id:u.id, email:u.email, name: prof.data?.display_name || u.email, role: prof.data ? (prof.data.banned ? 'banned' : prof.data.role) : 'member'};
  const [d, st, rp, subs] = await Promise.all([
    sb.from('dots').select('post_id').eq('user_id', u.id),
    sb.from('stances').select('article_id,value').eq('user_id', u.id),
    sb.from('reports').select('post_id').eq('user_id', u.id),
    sb.from('articles').select('*').eq('submitted_by', u.id).order('created_at',{ascending:false})
  ]);
  S.myDots = new Set((d.data||[]).map(r=>r.post_id));
  S.myStances = Object.fromEntries((st.data||[]).map(r=>[r.article_id, r.value]));
  S.myReports = new Set((rp.data||[]).map(r=>r.post_id));
  S.mySubs = (subs.data||[]).map(x => ({...x, ts: ts(x.created_at)}));
  if (isEditor()) await loadDesk();
}
async function loadDesk(){
  const [q, dec, rep, w, team] = await Promise.all([
    sb.from('articles').select('*').eq('status','pending').order('created_at',{ascending:true}),
    sb.from('articles').select('id,title,author,status,decided_by').neq('status','pending').not('submitted_by','is',null).order('created_at',{ascending:false}).limit(10),
    sb.from('reports').select('post_id, posts(id, body, anon, hidden, created_at, user_id, profiles(display_name))').eq('resolved', false),
    sb.from('blocked_words').select('word').order('word'),
    isOwner() ? sb.from('profiles').select('*').order('created_at',{ascending:false}).limit(500) : Promise.resolve({data:[]})
  ]);
  S.queue = (q.data||[]).map(x => ({...x, ts: ts(x.created_at)}));
  S.decided = dec.data || [];
  const byPost = {};
  for (const r of (rep.data||[])) { if (!r.posts) continue; const k = r.post_id; byPost[k] = byPost[k] || {...r.posts, reports:0}; byPost[k].reports++; }
  S.reports = Object.values(byPost).sort((a,b)=>b.reports-a.reports);
  S.words = (w.data||[]).map(r=>r.word);
  S.team = team.data || [];
}
async function refresh(){ try { await loadPublic(); await loadMe(); S.loaded = true; setStatus('Live · updated ' + fmtTime(Date.now())); } catch (e) { S.loaded = true; setStatus('Could not reach the database. ' + friendly(e)); } render(); refreshReader(); maybeHash(); }
async function act(fn, ok){
  try { const r = await fn(); if (r && r.error) throw r.error; if (ok) toast(ok); return true; }
  catch (e) { toast(friendly(e)); return false; }
}

// ---------- derived ----------
function activePrompt(){ const tk = todayKey(); return S.prompts.filter(p => p.week && p.week <= tk).sort((a,b)=> a.week < b.week ? 1 : -1)[0] || null; }
const postsFor = (space, ref) => S.posts.filter(p => p.space === space && (p.ref||'') === (ref||''));
const stanceTally = aid => { const r = S.stanceCounts[aid] || {}; return {agree:r.agree||0, complicated:r.complicated||0, disagree:r.disagree||0}; };

// ---------- shell ----------
function renderTicker(){
  const items = S.news.slice(0,10); const el = $('#ticker');
  if (!items.length) { el.innerHTML = `<span>${S.loaded ? 'The desk is quiet. First headlines land here.' : 'Loading the latest from the desk'}</span>`; return; }
  const row = items.map(n => `<span><button data-act="open-news" data-id="${esc(n.id)}">${esc(n.title)}</button></span>`).join('');
  el.innerHTML = row + row;
}
function renderChrome(){
  const nav = $('#nav'); let ed = nav.querySelector('.ed');
  const q = S.queue.length + S.reports.length;
  if (isEditor() && !ed) { nav.insertAdjacentHTML('beforeend', `<button class="ed" data-act="nav" data-view="newsroom"></button>`); ed = nav.querySelector('.ed'); }
  if (!isEditor() && ed) { ed.remove(); ed = null; }
  if (ed) ed.textContent = 'Newsroom' + (q ? ` (${q})` : '');
  nav.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.dataset.view === S.view ? 'page' : 'false'));
  $('#foot-ed').hidden = !isEditor();
  const roleLabel = {owner:'Owner', editor:'Editor', member:'Member', banned:'Suspended'}[S.me.role] || '';
  $('#acct').innerHTML = S.me.id
    ? `<span><b>${esc(S.me.name)}</b><span class="role">${roleLabel} · Account</span></span>`
    : `<span><b>Sign in</b><span class="role">or create an account</span></span>`;
}
let lastView = null;
function render(){
  renderChrome(); renderTicker();
  const v = $('#view');
  const fresh = lastView !== S.view; lastView = S.view;
  v.innerHTML = S.view === 'articles' ? viewArticles() : S.view === 'forum' ? viewForum() : S.view === 'write' ? viewWrite() : S.view === 'newsroom' ? viewNewsroom() : viewNews();
  if (fresh) { v.classList.add('anim'); clearTimeout(render.t); render.t = setTimeout(()=>v.classList.remove('anim'), 1600); }
  if (S.replyTo) { const ta = $('#reply-ta'); if (ta) ta.value = S.replyDraft; }
}

// ---------- CURRENT AFFAIRS ----------
function viewNews(){
  const lead = S.news[0];
  const brief = S.news.filter(n => dayKey(n.ts) === (lead ? dayKey(lead.ts) : todayKey())).slice(0,5);
  const latestArt = S.articles[0];
  const now = new Date();
  const items = S.news.filter(n => (!S.day || dayKey(n.ts) === S.day) && (S.region === 'All' || n.region === S.region));
  const groups = []; items.forEach(n => { const k = dayKey(n.ts); let g = groups[groups.length-1]; if (!g || g.k !== k) groups.push(g = {k, items:[]}); g.items.push(n); });
  const ap = activePrompt();
  const filtered = S.day || S.region !== 'All';
  return `
  <section class="wrap" style="padding-bottom:10px">
    <div class="hero-grid">
      <div class="collage">
        <div class="c-piece c-blue torn slap" style="--r:-3deg;--i:1"></div>
        <div class="c-piece c-ht halftone slap" style="--i:2"></div>
        <div class="c-piece c-red slap" style="--i:3"></div>
        <span class="c-icon">${sym('globe')}</span>
        <div class="kick rise"><span class="sticker">Current affairs</span><span class="mono">${WD[now.getDay()]} · ${fmtDate(now)}</span></div>
        <h1 class="giant letters" aria-label="The world, today">${letters('THE')}<br><span class="blue">${letters('WORLD,',3)}</span><br><span class="out">${letters('TODAY',9)}</span></h1>
        ${lead ? `
        <article class="lead slap" style="--i:6" data-act="open-news" data-id="${esc(lead.id)}" tabindex="0" role="button" aria-label="Read: ${esc(lead.title)}">
          <div class="meta"><span class="sticker">Top story</span><span class="sticker status-${esc(lead.status)}">${esc(lead.status||'Update')}</span><span class="reg">${esc(lead.region)}</span>${sampleTag(lead)}</div>
          <h2>${esc(lead.title)}</h2><p>${esc(lead.dek)}</p>
          <div class="byline"><span>By ${esc(lead.author||'Nuqta Desk')}</span><span>${ago(lead.ts)}</span></div>
        </article>` : `<div class="lead" style="cursor:default"><div class="status-line">${S.loaded ? "The first story the editors post becomes today's lead." : "Fetching today's lead…"}</div></div>`}
      </div>
      <div>
        <div class="brief slap" style="--i:5"><span class="tape"></span><h3>The Brief</h3>
          ${brief.length ? `<ol>${brief.map(n=>`<li><button data-act="open-news" data-id="${esc(n.id)}">${esc(n.title)}<span class="when">${esc(n.region)} · ${fmtTime(n.ts)}</span></button></li>`).join('')}</ol>`
            : `<p style="padding:6px 0 10px 28px;color:var(--muted);font-style:italic">Five things to know before chai, once the day's stories are in.</p>`}
        </div>
        ${latestArt ? `<button class="nuqta-sticker slap" style="--i:7" data-act="open-article" data-id="${esc(latestArt.id)}"><span class="ring"><span class="dot live"></span></span><span><span class="big">TODAY'S NUQTA</span><q>${esc(latestArt.nuqta)}</q></span></button>` : ''}
      </div>
    </div>
  </section>
  <section class="wrap" id="stories">
    <div class="sec-head"><h2>All stories</h2></div>
    <div class="fbar">
      <span class="lbl">Filter</span>
      <div class="dd cal-wrap">
        <button class="ddbtn ${S.day?'set':''}" data-act="cal-toggle" aria-expanded="${S.calOpen}" aria-haspopup="dialog">${sym('cal')} ${S.day ? esc(dayLabel(S.day)) : 'All dates'} ▾</button>
        ${S.calOpen ? calHtml() : ''}
      </div>
      <label class="dd"><span class="sr">Region</span>
        <select class="fsel" id="region-sel">${['All',...REGIONS].map(r=>`<option value="${esc(r)}" ${r===S.region?'selected':''}>${r==='All'?'All regions':esc(r)}</option>`).join('')}</select>
      </label>
      <span class="showing">${items.length} ${items.length===1?'story':'stories'}${filtered?` <button class="link" data-act="clear-filters">Clear filters</button>`:''}</span>
    </div>
    ${groups.length ? groups.map(g => `<div class="daygroup"><div class="dayhead"><h3>${esc(dayLabel(g.k))}</h3><span>${g.items.length} ${g.items.length===1?'story':'stories'}</span></div><div class="feed">${g.items.map((n,i)=>newsCard(n,i)).join('')}</div></div>`).join('')
      : `<div class="empty"><b>${S.loaded ? 'No stories match' : 'Loading stories'}</b>${S.loaded ? (filtered ? 'Try another date or region, or clear the filters.' : 'Stories appear here as the editors post them.') : ''}</div>`}
  </section>
  <div class="floor-band"><div class="wrap">
    <div><span class="mono">Question of the week · The Floor</span><h2>${ap ? esc(ap.question) : 'A new question lands every Monday.'}</h2></div>
    <button class="btn" data-act="go-prompt">Answer it on The Floor →</button>
  </div></div>`;
}
function calHtml(){
  if (!S.calMonth) S.calMonth = (S.day || todayKey()).slice(0,7);
  const [y,m] = S.calMonth.split('-').map(Number);
  const lead = (new Date(y,m-1,1).getDay()+6)%7, dim = new Date(y,m,0).getDate();
  const counts = {}; S.news.forEach(n => { const k = dayKey(n.ts); counts[k] = (counts[k]||0)+1; });
  const tk = todayKey(); let cells = '';
  for (let i=0;i<lead;i++) cells += '<span></span>';
  for (let d=1; d<=dim; d++) {
    const k = `${y}-${pad(m)}-${pad(d)}`; const n = counts[k]||0;
    cells += `<button class="cal-d ${n?'has':''} ${k===tk?'today':''}" data-act="pick-day" data-k="${k}" aria-pressed="${S.day===k}" ${n?'':'disabled'} aria-label="${d} ${MONTHS[m-1]}: ${n} ${n===1?'story':'stories'}">${d}</button>`;
  }
  const monthTotal = Object.entries(counts).filter(([k])=>k.startsWith(S.calMonth)).reduce((a,[,v])=>a+v,0);
  return `<div class="cal" role="dialog" aria-label="Pick a date">
    <div class="cal-h"><button data-act="cal-month" data-d="-1" aria-label="Previous month">‹</button><b>${MONTHS[m-1]} ${y}</b><button data-act="cal-month" data-d="1" aria-label="Next month">›</button></div>
    <div class="cal-g">${['M','T','W','T','F','S','S'].map(d=>`<span class="wd">${d}</span>`).join('')}${cells}</div>
    <div class="cal-f"><span><span class="dot" style="width:7px;height:7px"></span> ${monthTotal} stories this month</span><button class="link" data-act="pick-day" data-k="">All dates</button></div>
  </div>`;
}
function newsCard(n,i){
  return `<article class="card slap" style="--r:${rot(n.id).toFixed(2)}deg;--i:${Math.min(i,8)}" data-act="open-news" data-id="${esc(n.id)}" tabindex="0" role="button" aria-label="Read: ${esc(n.title)}">
    <span class="tape"></span>
    <div class="meta"><span class="sticker status-${esc(n.status)}">${esc(n.status||'Update')}</span><span class="reg">${esc(n.region)}</span>${sampleTag(n)}</div>
    <h3>${esc(n.title)}</h3><p>${esc(n.dek)}</p>
    ${n.why ? `<details class="why"><summary>Why it matters</summary><p>${esc(n.why)}</p></details>` : ''}
    <div class="byline"><span>${esc(n.author||'Nuqta Desk')}</span><span>${fmtTime(n.ts)}</span></div>
  </article>`;
}

// ---------- ARTICLES ----------
function viewArticles(){
  const authors = [...new Set(S.articles.map(a=>a.author).filter(Boolean))].sort();
  const counts = {}; S.articles.forEach(a => counts[a.section] = (counts[a.section]||0)+1);
  const list = S.articles.filter(a => (S.section==='All'||a.section===S.section) && (S.author==='All'||a.author===S.author));
  const feat = list.find(a=>a.featured) || list[0];
  const rest = list.filter(a => a !== feat);
  return `<section class="wrap">
    <div class="page-h rise"><h1><span class="blk">ARTICLES</span></h1><p class="tagline">Opinion pieces by Nuqta writers. Each one opens with its <strong>nuqta</strong>: the single point the writer is arguing.</p></div>
    ${guide('Tap any article to read it, then say whether you agree and join its discussion on The Floor. Want to write one?', `<button class="gx" data-act="nav" data-view="write">Submit an article →</button>`)}
    <div class="filters">
      <div class="chips" role="group" aria-label="Section">${['All',...SECTIONS].map(s => `<button class="chip" data-act="section" data-s="${esc(s)}" aria-pressed="${s===S.section}">${esc(s)}${s!=='All'&&counts[s]?`<span class="n">${counts[s]}</span>`:''}</button>`).join('')}</div>
      <label class="mono" style="display:flex;gap:8px;align-items:center">Writer
        <select class="fsel" id="author-sel"><option value="All">Everyone</option>${authors.map(a=>`<option ${a===S.author?'selected':''}>${esc(a)}</option>`).join('')}</select></label>
    </div>
    ${feat ? featureCard(feat) : `<div class="empty"><b>${S.loaded ? 'No articles here yet' : 'Loading articles'}</b>${S.loaded ? 'Articles appear once an editor approves and publishes them.' : ''}</div>`}
    ${rest.length ? `<div class="op-grid">${rest.map((a,i)=>opCard(a,i)).join('')}</div>` : ''}
  </section>`;
}
function stanceBar(aid){
  const t = stanceTally(aid); const tot = t.agree+t.complicated+t.disagree;
  if (!tot) return `<div class="stancebar" title="No reader stances yet"></div>`;
  return `<div class="stancebar" title="${t.agree} agree · ${t.complicated} it's complicated · ${t.disagree} disagree"><i class="st-agree" style="width:${t.agree/tot*100}%"></i><i class="st-complicated" style="width:${t.complicated/tot*100}%"></i><i class="st-disagree" style="width:${t.disagree/tot*100}%"></i></div>`;
}
function featureCard(a){
  const s = a.symbol || SECTION_SYM[a.section] || 'bulb';
  return `<article class="feature slap" style="--i:2" data-act="open-article" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="Read: ${esc(a.title)}">
    <div class="art"><div class="halftone"></div><div class="blk torn"></div>${sym(s,'bigsym')}</div>
    <div class="txt">
      <div class="meta"><span class="sticker">${a.featured?'Featured':'Latest'}</span><span class="sticker blue">${esc(a.section)}</span>${sampleTag(a)}</div>
      <h2>${esc(a.title)}</h2>
      <div class="nuqta-line"><span class="lbl"><span class="dot"></span>THE NUQTA</span><q>${esc(a.nuqta)}</q></div>
      <div class="byline"><span>By ${esc(a.author)}</span><span>${readMins(a.body)} min read</span><span>${postsFor('article',a.id).length} comments</span></div>
      ${stanceBar(a.id)}
    </div>
  </article>`;
}
function opCard(a,i){
  const s = a.symbol || SECTION_SYM[a.section] || 'bulb';
  return `<article class="card op-card slap" style="--r:${rot(a.id,1).toFixed(2)}deg;--i:${Math.min(i+3,9)}" data-act="open-article" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="Read: ${esc(a.title)}">
    <span class="tape"></span>
    <div class="symhead"><div class="meta"><span class="sticker">${esc(a.section)}</span>${sampleTag(a)}</div>${sym(s)}</div>
    <h3>${esc(a.title)}</h3>
    <div class="nuqta-line"><q>${esc(a.nuqta)}</q></div>
    <div class="byline"><span>${esc(a.author)}</span><span>${readMins(a.body)} min</span><span>${postsFor('article',a.id).length} comments</span></div>
    ${stanceBar(a.id)}
  </article>`;
}

// ---------- THE FLOOR ----------
function viewForum(){
  return `<section class="wrap">
    <div class="page-h rise"><h1>THE FLOOR</h1><p class="tagline"><strong>Nuqta's discussion forum.</strong> Talk about the articles we publish, or answer the question of the week.</p></div>
    ${guide(S.me.id ? 'Pick a room below. Post, reply, and <b>dot</b> the posts that made you think. Abusive language is blocked; use Report for anything else.' : 'Anyone can read. To post, reply or dot, you need a free account.', S.me.id ? '' : `<button class="gx" data-act="auth" data-mode="signup">Create an account →</button>`)}
    <div class="seg" role="group" aria-label="Rooms">
      <button data-act="layer" data-l="pieces" aria-pressed="${S.layer==='pieces'}">${sym('quill')} Article discussions</button>
      <button data-act="layer" data-l="open" aria-pressed="${S.layer==='open'}">${sym('megaphone')} Open floor</button>
    </div>
    ${S.layer === 'pieces' ? viewPieces() : viewOpen()}
  </section>`;
}
function viewPieces(){
  if (!S.articles.length) return `<div class="empty"><b>${S.loaded?'No articles to discuss yet':'Loading'}</b>${S.loaded?'Every published article gets its own thread here.':''}</div>`;
  if (!S.thread || !S.articles.some(a=>a.id===S.thread)) S.thread = S.articles[0].id;
  const a = S.articles.find(x=>x.id===S.thread);
  return `<div class="pieces">
    <div class="idx" role="group" aria-label="Choose an article">
      ${S.articles.map(x => `<button data-act="thread" data-id="${esc(x.id)}" aria-pressed="${x.id===S.thread}"><span class="t">${esc(x.title)}</span><span class="s"><span>${esc(x.section)}</span><span>${postsFor('article',x.id).length} comments</span></span></button>`).join('')}
    </div>
    <div style="min-width:0">
      <div class="thread-head"><span class="tape"></span>
        <div class="meta"><span class="sticker blue">${esc(a.section)}</span><span class="reg">By ${esc(a.author)}</span></div>
        <h3>${esc(a.title)}</h3>
        <div class="nuqta-line"><span class="lbl"><span class="dot"></span>THE NUQTA</span><q>${esc(a.nuqta)}</q></div>
        <div style="display:flex;gap:14px;align-items:center;margin-top:12px;flex-wrap:wrap"><button class="link" data-act="open-article" data-id="${esc(a.id)}">Read the article</button><span style="flex:1;min-width:120px">${stanceBar(a.id)}</span></div>
      </div>
      ${composer('article', a.id, 'What do you make of this article?')}
      ${postList(postsFor('article', a.id), 'No comments yet. Start the conversation.')}
    </div>
  </div>`;
}
function viewOpen(){
  const ap = activePrompt();
  const shown = S.promptId ? S.prompts.find(p=>p.id===S.promptId) : ap;
  const tabs = [['prompt','Question of the week'],['wall','Open wall'],['archive','Past questions']];
  let body = '';
  if (S.floorTab === 'prompt') {
    if (!shown) body = `<div class="empty"><b>${S.loaded?'No question this week yet':'Loading'}</b>${S.loaded?'A fresh question goes up every Monday. The open wall is always open.':''}</div>`;
    else {
      const isPast = ap && shown.id !== ap.id;
      const daysLeft = Math.max(0, Math.round((keyToDate(addDays(mondayOf(todayKey()),7)) - keyToDate(todayKey()))/864e5));
      const ps = postsFor('prompt', shown.id);
      body = `<div class="prompt-card slap"><div class="halftone"></div>
        <div class="row"><span class="sticker red">${isPast?'Past question':'This week'}</span><span class="mono">Week of ${fmtDate(keyToDate(shown.week))}</span></div>
        <h3>${esc(shown.question)}</h3>${shown.context ? `<p>${esc(shown.context)}</p>` : ''}
        <div class="row" style="margin-top:14px"><span class="count"><b>${ps.length}</b> answers</span>${isPast?`<button class="btn" style="background:#fff;color:var(--ink);border-color:#fff" data-act="prompt-now">Back to this week</button>`:`<span class="count">New question in <b>${daysLeft}</b> ${daysLeft===1?'day':'days'}</span>`}</div>
      </div>
      ${composer('prompt', shown.id, 'Your answer, in your own words…')}
      ${postList(ps, 'No answers yet. Be the first to take a side.')}`;
    }
  } else if (S.floorTab === 'wall') {
    body = `${composer('open', '', 'Anything on your mind about politics, culture or the news…')}${postList(postsFor('open',''), 'The wall is empty. Put up the first take.')}`;
  } else {
    const past = S.prompts.filter(p=>p.week && p.week<=todayKey()).sort((a,b)=>a.week<b.week?1:-1);
    body = past.length ? `<div class="archive">${past.map(p=>`<button data-act="open-prompt" data-id="${esc(p.id)}"><span class="wk">${fmtDate(keyToDate(p.week))}</span><span class="q">${esc(p.question)}</span><span class="n">${postsFor('prompt',p.id).length} answers</span></button>`).join('')}</div>`
      : `<div class="empty"><b>No past questions yet</b>Every weekly question is kept here with its answers.</div>`;
  }
  return `<div class="subtabs" role="group" aria-label="Open floor">${tabs.map(([k,l])=>`<button data-act="floortab" data-t="${k}" aria-pressed="${S.floorTab===k}">${l}</button>`).join('')}</div>${body}`;
}
function composer(space, ref, ph){
  const id = `c-${space}-${ref||'wall'}`;
  if (!sb) return `<div class="composer"><span class="hint">Posting opens once the database is connected.</span></div>`;
  if (!S.me.id) return `<div class="composer"><span class="hint">Sign in to post. <button class="link" data-act="auth" data-mode="signin">Sign in</button> or <button class="link" data-act="auth" data-mode="signup">create an account</button></span></div>`;
  if (!canPost()) return `<div class="composer"><span class="hint">Your account is suspended from posting.</span></div>`;
  return `<div class="composer">
    <label class="sr" for="${id}">Your post</label>
    <textarea id="${id}" maxlength="2000" placeholder="${esc(ph)}"></textarea>
    ${S.errs[id] ? `<span class="err">${esc(S.errs[id])}</span>` : ''}
    <div class="row"><label><input type="checkbox" id="${id}-anon"> Post anonymously</label>
    <button class="btn blue" data-act="post" data-space="${space}" data-ref="${esc(ref)}" data-for="${id}">Post</button></div>
  </div>`;
}
function postList(posts, emptyMsg){
  const roots = posts.filter(p=>!p.parent);
  const kids = {}; posts.filter(p=>p.parent).forEach(p => (kids[p.parent] = kids[p.parent]||[]).push(p));
  const score = p => p.dots + (kids[p.key]||[]).length*.5;
  roots.sort((a,b) => S.sort==='top' ? (score(b)-score(a)) || (b.ts-a.ts) : b.ts-a.ts);
  if (!roots.length) return `<div class="empty"><b>${S.loaded?'Quiet in here':'Loading posts'}</b>${S.loaded?esc(emptyMsg):''}</div>`;
  return `<div class="sorter">Sort <button class="chip" data-act="sort" data-s="top" aria-pressed="${S.sort==='top'}">Top</button><button class="chip" data-act="sort" data-s="new" aria-pressed="${S.sort==='new'}">New</button></div>
  <div class="posts">${roots.map(p => postHtml(p) + (kids[p.key]||[]).sort((a,b)=>a.ts-b.ts).map(c=>postHtml(c,true)).join('') + (S.replyTo===p.key ? replyBox(p) : '')).join('')}</div>`;
}
function postHtml(p, isReply){
  const can = canPost(), dotted = S.myDots.has(p.id), reported = S.myReports.has(p.id);
  const armed = S.armed === 'post:'+p.key;
  return `<article class="post ${isReply?'reply':''}">
    <div class="who"><span class="av" style="background:${p.anon?'var(--ink)':`hsl(${Math.abs(rot(p.uid||p.id,180))|0} 55% 55%)`}"></span><b>${esc(p.name || 'Reader')}</b>${p.mine?'<span class="sticker blue" style="padding:1px 6px">you</span>':''}<time>${ago(p.ts)}</time></div>
    <div class="body">${esc(p.text)}</div>
    <div class="acts">
      <button class="dotit" data-act="dot" data-key="${esc(p.key)}" aria-pressed="${dotted}" ${can?'':'disabled'} title="Dot it: this made me think"><span class="dot"></span>${p.dots}</button>
      ${!isReply && can ? `<button class="link" data-act="reply" data-key="${esc(p.key)}">Reply</button>` : ''}
      ${can && !p.mine ? `<button class="link" data-act="report" data-key="${esc(p.key)}">${reported?'Reported':'Report'}</button>` : ''}
      ${p.mine || isEditor() ? `<button class="link danger" data-act="del-post" data-key="${esc(p.key)}">${armed?'Tap again to delete':'Delete'}</button>` : ''}
    </div>
  </article>`;
}
function replyBox(p){
  return `<div class="composer post reply" style="padding:12px">
    <label class="sr" for="reply-ta">Your reply</label>
    <textarea id="reply-ta" maxlength="1200" placeholder="Reply to this…"></textarea>
    ${S.errs.reply ? `<span class="err">${esc(S.errs.reply)}</span>` : ''}
    <div class="row"><label><input type="checkbox" id="reply-anon"> Anonymous</label>
    <span style="display:flex;gap:10px"><button class="link" data-act="reply-cancel">Cancel</button><button class="btn blue" data-act="post-reply" data-key="${esc(p.key)}" data-space="${esc(p.space)}" data-ref="${esc(p.ref||'')}">Reply</button></span></div>
  </div>`;
}

// ---------- WRITE FOR US ----------
function articleFields(a, prefix){
  return `<label>Title<input id="${prefix}-title" required maxlength="140" value="${esc(a?.title)}"></label>
    <label>The nuqta<span class="help">Your single point, in one sentence. It is shown on the article card and at the top of the piece.</span><textarea id="${prefix}-nuqta" required maxlength="220">${esc(a?.nuqta)}</textarea></label>
    <label>Standfirst<span class="help">One or two sentences that set up the piece.</span><textarea id="${prefix}-dek" maxlength="320">${esc(a?.dek)}</textarea></label>
    <div class="two"><label>Section<select id="${prefix}-section">${SECTIONS.map(s=>`<option ${a?.section===s?'selected':''}>${s}</option>`).join('')}</select></label>
    <label>Byline<input id="${prefix}-author" required maxlength="80" value="${esc(a?.author || (prefix==='s' ? S.me.name : ''))}" placeholder="Name as it should appear"></label></div>
    <label>Article<span class="help">Leave a blank line between paragraphs. Start a line with "> " for a pull quote or "## " for a subheading. **Bold** for emphasis.</span><textarea id="${prefix}-body" class="long" required>${esc(a?.body)}</textarea></label>`;
}
function viewWrite(){
  let form;
  if (!sb) form = `<div class="empty"><b>Not connected</b>Submissions open once the database is connected.</div>`;
  else if (!S.me.id) form = `<div class="empty"><b>Sign in to submit</b>You need a free account to send in an article.<div style="margin-top:12px;display:flex;gap:10px;justify-content:center"><button class="btn blue" data-act="auth" data-mode="signup">Create account</button><button class="btn ghost" data-act="auth" data-mode="signin">Sign in</button></div></div>`;
  else if (!canPost()) form = `<div class="empty"><b>Account suspended</b>Contact a Nuqta editor.</div>`;
  else form = `<form class="formcard" id="f-submit"><h3>Your article</h3>${articleFields(null,'s')}
    ${S.errs.submit ? `<span class="help" style="color:var(--red);font-weight:600">${esc(S.errs.submit)}</span>` : ''}
    <div class="row"><button class="btn blue" type="submit">Send for review</button><span class="help">Editors usually reply within a few days.</span></div></form>`;
  const statusLabel = {pending:'In review', published:'Published', rejected:'Sent back'};
  return `<section class="wrap">
    <div class="page-h rise">${sym('quill')}<h1>WRITE FOR US</h1><p class="tagline">Send in an opinion piece. A Nuqta editor reads every submission and publishes it on <strong>Articles</strong> once approved.</p></div>
    ${guide('1. Write your piece below. 2. An editor reviews it, and may send it back with notes. 3. Once approved it goes live on Articles with your byline.')}
    <div class="cols"><div style="min-width:0">${form}</div>
      <div class="mlist"><h4>My submissions</h4>${S.mySubs.length ? S.mySubs.map(s=>`<div class="mrow"><span class="t">${esc(s.title)}<small>${fmtDate(s.ts)}</small>${s.editor_note?`<span class="quote">Editor's note: ${esc(s.editor_note)}</span>`:''}</span><span class="pill ${s.status==='published'?'approved':s.status}">${statusLabel[s.status]}</span>${s.status==='published'?`<button class="link" data-act="open-article" data-id="${esc(s.id)}">Read</button>`:`<button class="link danger" data-act="withdraw" data-id="${esc(s.id)}">${S.armed==='wd:'+s.id?'Confirm':'Withdraw'}</button>`}</div>`).join('') : '<p class="help">Nothing sent yet.</p>'}</div>
    </div>
  </section>`;
}

// ---------- NEWSROOM ----------
function viewNewsroom(){
  if (!isEditor()) return `<section class="wrap"><div class="page-h"><h1>NEWSROOM</h1></div><div class="empty"><b>Editors only</b>This page is for Nuqta's editors.</div></section>`;
  const tabs = [['queue','Review queue',S.queue.length],['news','Post a story'],['article','Publish an article'],['prompt','Weekly questions'],['mod','Moderation',S.reports.length],['manage','Manage']];
  if (isOwner()) tabs.push(['team','Team']);
  const t = S.deskTab; let body = '';
  if (t === 'queue') {
    body = S.queue.length ? `<div class="mlist">${S.queue.map(s=>`<div class="mrow"><span class="t"><strong>${esc(s.title)}</strong><small>${esc(s.section)} · by ${esc(s.author)} · sent ${ago(s.ts)} · ${readMins(s.body)} min read</small><span class="quote">“${esc(s.nuqta)}”</span></span>
        <button class="btn green" data-act="review" data-id="${esc(s.id)}">Review & approve</button>
        <div class="inline-note"><input id="note-${esc(s.id)}" placeholder="Reason for sending back (shown to the writer)" maxlength="300"><button class="link danger" data-act="reject" data-id="${esc(s.id)}">Send back</button></div></div>`).join('')}</div>`
      : `<div class="empty"><b>Queue is clear</b>New submissions from writers show up here for an editor to approve.</div>`;
    if (S.decided.length) body += `<div class="mlist" style="margin-top:20px"><h4>Recently decided</h4>${S.decided.map(s=>`<div class="mrow"><span class="t">${esc(s.title)}<small>by ${esc(s.author)}</small></span><span class="pill ${s.status==='published'?'approved':s.status}">${s.status==='published'?'Published':'Sent back'}</span></div>`).join('')}</div>`;
  } else if (t === 'news') {
    const n = S.editId ? S.news.find(x=>x.id===S.editId) : null;
    body = `<form class="formcard" id="f-news"><h3>${n?'Edit story':'New story'}</h3>
      <label>Headline<input id="n-title" required maxlength="160" value="${esc(n?.title)}"></label>
      <label>One-line summary<textarea id="n-dek" required maxlength="300">${esc(n?.dek)}</textarea></label>
      <label>Why it matters<textarea id="n-why" maxlength="500">${esc(n?.why)}</textarea></label>
      <div class="two"><label>Region<select id="n-region">${REGIONS.map(r=>`<option ${n?.region===r?'selected':''}>${r}</option>`).join('')}</select></label>
      <label>Label<select id="n-status">${STATUSES.map(r=>`<option ${n?.status===r?'selected':''}>${r}</option>`).join('')}</select></label></div>
      <label>Byline<input id="n-author" maxlength="80" placeholder="Nuqta Desk" value="${esc(n?.author)}"></label>
      <label>Full story (optional)<span class="help">Blank line between paragraphs. "> " for a pull quote, "## " for a subheading.</span><textarea id="n-body" class="long">${esc(n?.body)}</textarea></label>
      <label>Sources<input id="n-sources" maxlength="400" value="${esc(n?.sources)}"></label>
      <div class="row"><button class="btn blue" type="submit">${n?'Save changes':'Publish story'}</button>${n?'<button class="btn ghost" type="button" data-act="desk-cancel">Cancel</button>':''}</div></form>`;
  } else if (t === 'article') {
    const a = S.approving ? S.queue.find(x=>x.id===S.approving) : S.editId ? S.articles.find(x=>x.id===S.editId) : null;
    body = `<form class="formcard" id="f-article"><h3>${S.approving ? 'Review submission' : a ? 'Edit article' : 'Publish an article'}</h3>
      ${S.approving ? `<p class="help">Make any edits, then approve. It goes live on Articles and the writer sees it as published.</p>` : ''}
      ${articleFields(a,'a')}
      <div class="two"><label>Symbol<select id="a-symbol">${['auto','bulb','knight','globe','masks','megaphone','scale','book','eye','column','quill','bubble'].map(s=>`<option ${(a?.symbol||'auto')===s?'selected':''}>${s}</option>`).join('')}</select></label>
      <label class="cb" style="align-self:end"><input type="checkbox" id="a-feat" ${a?.featured?'checked':''}> Feature at the top of Articles</label></div>
      <div class="row"><button class="btn ${S.approving?'green':'blue'}" type="submit">${S.approving?'Approve & publish':a?'Save changes':'Publish article'}</button>${a?'<button class="btn ghost" type="button" data-act="desk-cancel">Cancel</button>':''}</div></form>`;
  } else if (t === 'prompt') {
    const p = S.editId ? S.prompts.find(x=>x.id===S.editId) : null;
    const queued = S.prompts.filter(x=>x.week > todayKey()).sort((a,b)=>a.week<b.week?-1:1);
    body = `<div class="cols"><form class="formcard" id="f-prompt"><h3>${p?'Edit question':'Queue a question'}</h3>
      <p class="help">Each question goes live on the Monday of its week, and last week's moves to Past questions automatically.</p>
      <label>Question<textarea id="p-q" required maxlength="200">${esc(p?.question)}</textarea></label>
      <label>Context (optional)<textarea id="p-ctx" maxlength="500">${esc(p?.context)}</textarea></label>
      <label>Week starting<input type="date" id="p-week" required value="${esc(p?.week || addDays(mondayOf(todayKey()),7))}"></label>
      <div class="row"><button class="btn blue" type="submit">${p?'Save changes':'Queue question'}</button>${p?'<button class="btn ghost" type="button" data-act="desk-cancel">Cancel</button>':''}</div></form>
      <div class="mlist"><h4>Coming up (${queued.length})</h4>${queued.length?queued.map(x=>mrow('prompt',x,x.question,'Week of '+fmtDate(keyToDate(x.week)))).join(''):'<p class="help">Nothing queued. Add next week\'s question.</p>'}</div></div>`;
  } else if (t === 'mod') {
    body = `<div class="cols"><div class="mlist"><h4>Reported posts</h4><p class="help">Posts with 3 or more reports are already hidden from readers until you decide.</p>${S.reports.length ? S.reports.map(p=>`<div class="mrow"><span class="t">${esc(p.body)}<small>${p.reports} ${p.reports===1?'report':'reports'} · ${ago(ts(p.created_at))} · ${esc(p.profiles?.display_name||'Reader')}${p.anon?' (posted anonymously)':''}${p.hidden?' · hidden':''}</small></span>
        <button class="link danger" data-act="mod-remove" data-key="${esc(p.id)}">Remove post</button><button class="link" data-act="mod-keep" data-key="${esc(p.id)}">Keep</button></div>`).join('') : '<p class="help">No open reports.</p>'}</div>
      <form class="formcard" id="f-words"><h3>Blocked words</h3>
        <p class="help">Posts, replies and submissions containing these are refused by the database. One word or phrase per line, in any script. Common English and Roman Urdu abuse is already listed.</p>
        <label>Blocked words<textarea id="w-list" class="long">${esc(S.words.join('\n'))}</textarea></label>
        <div class="row"><button class="btn blue" type="submit">Save list</button></div></form></div>`;
  } else if (t === 'team') {
    body = `<div class="mlist team"><h4>People (${S.team.length})</h4><p class="help">Make up to three people editors. Editors run the Newsroom; members can post and submit; suspended accounts can only read.</p>
      ${S.team.map(p=>`<div class="mrow"><span class="t">${esc(p.display_name)}<small>Joined ${fmtDate(ts(p.created_at))}${p.id===S.me.id?' · you':''}</small></span>
        ${p.role==='owner' ? '<span class="pill approved">Owner</span>' : `<select data-act="set-role" data-id="${esc(p.id)}" aria-label="Role for ${esc(p.display_name)}"><option value="member" ${p.role==='member'?'selected':''}>Member</option><option value="editor" ${p.role==='editor'?'selected':''}>Editor</option></select>
        <button class="link ${p.banned?'':'danger'}" data-act="ban" data-id="${esc(p.id)}" data-b="${p.banned?'0':'1'}">${p.banned?'Restore':'Suspend'}</button>`}</div>`).join('')}</div>`;
  } else {
    const samples = [...S.news,...S.articles,...S.prompts].filter(x=>x.sample).length;
    body = `<div class="mlist">
      ${samples?`<div class="mrow" style="border-color:var(--red)"><span class="t">${samples} sample posts are on the site. Remove them once your own content is in.</span><button class="link danger" data-act="del-samples">${S.armed==='samples'?'Tap again to remove':'Remove samples'}</button></div>`:''}
      <h4>Stories (${S.news.length})</h4>${S.news.map(x=>mrow('news',x,x.title,fmtDate(x.ts)+' · '+x.region)).join('') || '<p class="help">None yet.</p>'}
      <h4>Articles (${S.articles.length})</h4>${S.articles.map(x=>mrow('article',x,x.title,(x.author||'')+' · '+fmtDate(x.ts))).join('') || '<p class="help">None yet.</p>'}
      <h4>Weekly questions (${S.prompts.length})</h4>${[...S.prompts].sort((a,b)=>a.week<b.week?1:-1).map(x=>mrow('prompt',x,x.question,'Week of '+fmtDate(keyToDate(x.week)))).join('') || '<p class="help">None yet.</p>'}
    </div>`;
  }
  return `<section class="wrap">
    <div class="page-h rise"><h1><span class="blk" style="background:var(--red)">NEWSROOM</span></h1><p class="tagline">Editors only. Approve articles, post the news, set the weekly question and keep The Floor civil.</p></div>
    <div class="subtabs" role="group" aria-label="Newsroom">${tabs.map(([k,l,n])=>`<button data-act="desk-tab" data-t="${k}" aria-pressed="${t===k}">${l}${n?`<span class="n">${n}</span>`:''}</button>`).join('')}</div>
    ${body}
  </section>`;
}
function mrow(kind, x, title, sub){
  const armed = S.armed === kind+':'+x.id;
  return `<div class="mrow"><span class="t">${esc(title)}<small>${esc(sub)}${x.sample?' · sample':''}${x.featured?' · featured':''}</small></span>
    <button class="link" data-act="desk-edit" data-kind="${kind}" data-id="${esc(x.id)}">Edit</button>
    <button class="link danger" data-act="desk-del" data-kind="${kind}" data-id="${esc(x.id)}">${armed?'Confirm':'Delete'}</button></div>`;
}

// ---------- reader ----------
function openReader(html, hash){
  const r = $('#reader');
  r.innerHTML = `<div class="progress"><i id="prog"></i></div>
    <div class="r-bar"><div class="wrap"><span class="brand-name">NUQTA <span class="brand-ur" lang="ur">نقطہ</span></span>
    <span style="display:flex;gap:8px"><button class="btn ghost" data-act="copy-link">Copy link</button><button class="btn" data-act="close-reader">Close ✕</button></span></div></div>
    <article class="r-in">${html}</article>`;
  r.hidden = false; r.scrollTop = 0; document.body.style.overflow = 'hidden';
  S.readerHash = hash; history.replaceState(null,'','#'+hash);
  r.onscroll = () => { const p = r.scrollTop / Math.max(1, r.scrollHeight - r.clientHeight); $('#prog').style.width = (p*100).toFixed(1)+'%'; };
  $('[data-act="close-reader"]', r).focus();
}
function closeReader(){
  const r = $('#reader'); r.hidden = true; r.innerHTML = ''; document.body.style.overflow = ''; S.readerHash = null;
  history.replaceState(null,'','#'+S.view);
}
function openNews(id){
  const n = S.news.find(x=>x.id===id); if (!n) return;
  openReader(`<div class="meta"><span class="sticker status-${esc(n.status)}">${esc(n.status||'Update')}</span><span class="reg">${esc(n.region)}</span>${sampleTag(n)}</div>
    <h1>${esc(n.title)}</h1><p class="dek">${esc(n.dek)}</p>
    <div class="byline"><span>By ${esc(n.author||'Nuqta Desk')}</span><span>${fmtDate(n.ts)}, ${fmtTime(n.ts)}</span></div>
    ${n.why ? `<div class="r-why"><span class="mono">Why it matters</span>${esc(n.why)}</div>` : ''}
    ${n.body ? `<div class="r-body">${richBody(n.body)}</div>` : ''}
    ${n.sources ? `<div class="r-why" style="border-style:solid"><span class="mono" style="color:var(--blue)">Sources</span>${esc(n.sources)}</div>` : ''}
    <div class="r-more"><button class="btn blue" data-act="go-wall">Discuss on the open wall →</button></div>`, 'news-'+id);
}
function articleHtml(a){
  const t = stanceTally(a.id); const tot = t.agree+t.complicated+t.disagree;
  const mine = S.myStances[a.id];
  const can = canPost();
  return `${sym(a.symbol || SECTION_SYM[a.section] || 'bulb','r-sym')}
    <div class="meta"><span class="sticker blue">${esc(a.section)}</span>${sampleTag(a)}</div>
    <h1>${esc(a.title)}</h1><p class="dek">${esc(a.dek)}</p>
    <div class="byline"><span>By <strong>${esc(a.author)}</strong></span><span>${fmtDate(a.ts)}</span><span>${readMins(a.body)} min read</span></div>
    <div class="r-nuqta"><span class="lbl"><span class="dot live"></span>THE NUQTA</span><q>${esc(a.nuqta)}</q></div>
    <div class="r-body">${richBody(a.body)}</div>
    <div class="stance" id="stance"><h3>Where do you stand?</h3>
      <div class="stance-btns" role="group" aria-label="Your stance">${[['agree','Agree'],['complicated',"It's complicated"],['disagree','Disagree']].map(([v,l])=>`<button data-act="stance" data-id="${esc(a.id)}" data-v="${v}" aria-pressed="${mine===v}" ${can?'':'disabled'}>${l}</button>`).join('')}</div>
      ${can ? '' : `<p class="status-line"><button class="link" data-act="auth" data-mode="signin">Sign in</button> to add your stance.</p>`}
      <div class="tally" style="margin-top:14px">${stanceBar(a.id)}<div class="legend"><span><i class="st-agree"></i>${t.agree} agree</span><span><i class="st-complicated"></i>${t.complicated} complicated</span><span><i class="st-disagree"></i>${t.disagree} disagree</span><span>${tot} readers</span></div></div>
    </div>
    <div class="r-more"><button class="btn blue" data-act="go-thread" data-id="${esc(a.id)}">Discuss on The Floor (${postsFor('article',a.id).length}) →</button>${S.articles.filter(x=>x.author===a.author).length>1?`<button class="btn ghost" data-act="by-author" data-a="${esc(a.author)}">More by ${esc(a.author)}</button>`:''}</div>`;
}
function openArticle(id){ const a = S.articles.find(x=>x.id===id); if (a) openReader(articleHtml(a), 'read-'+id); }
function refreshReader(){
  if (!S.readerHash || !S.readerHash.startsWith('read-')) return;
  const r = $('#reader'); const a = S.articles.find(x=>'read-'+x.id===S.readerHash); const st = $('#stance', r);
  if (a && st) { const tmp = document.createElement('div'); tmp.innerHTML = articleHtml(a); st.replaceWith($('#stance', tmp)); const m = $('.r-more', r); if (m) m.replaceWith($('.r-more', tmp)); }
}

// ---------- sign in / account ----------
function openAuth(mode, msg){ S.authMode = mode; S.authMsg = msg || null; renderAuth(); }
function closeAuth(){ S.authMode = null; $('#auth').hidden = true; $('#auth').innerHTML = ''; }
function renderAuth(){
  const m = S.authMode, el = $('#auth'); if (!m) return closeAuth();
  const msg = S.authMsg ? `<p class="msg ${S.authMsg.ok?'ok':'err'}">${esc(S.authMsg.text)}</p>` : '';
  let inner = '';
  if (!sb) inner = `<h2>Not connected</h2><p class="sub">The site owner still needs to connect the database in config.js.</p>`;
  else if (m === 'signin') inner = `<h2>Sign in</h2><p class="sub">Welcome back to Nuqta.</p>${msg}
    <form id="f-signin"><label>Email<input id="au-email" type="email" required autocomplete="email"></label><label>Password<input id="au-pass" type="password" required autocomplete="current-password"></label><button class="btn blue" type="submit">Sign in</button></form>
    <div class="alt"><button class="link" data-act="auth" data-mode="signup">Create an account</button><button class="link" data-act="auth" data-mode="forgot">Forgot password?</button></div>`;
  else if (m === 'signup') inner = `<h2>Create account</h2><p class="sub">Free. Lets you post on The Floor, vote, and submit articles.</p>${msg}
    <form id="f-signup"><label>Display name<input id="au-name" required minlength="2" maxlength="40" autocomplete="nickname"></label><label>Email<input id="au-email" type="email" required autocomplete="email"></label><label>Password<input id="au-pass" type="password" required minlength="8" autocomplete="new-password"><span class="help">At least 8 characters.</span></label>
    <label class="cb" style="display:flex;gap:8px;text-transform:none"><input type="checkbox" id="au-rules" required> I'll follow the house rules: argue with ideas, not people.</label>
    <button class="btn blue" type="submit">Create account</button></form>
    <div class="alt"><span>Already have one? <button class="link" data-act="auth" data-mode="signin">Sign in</button></span></div>`;
  else if (m === 'forgot') inner = `<h2>Reset password</h2><p class="sub">We'll email you a link to set a new one.</p>${msg}
    <form id="f-forgot"><label>Email<input id="au-email" type="email" required autocomplete="email"></label><button class="btn blue" type="submit">Send reset link</button></form>
    <div class="alt"><button class="link" data-act="auth" data-mode="signin">Back to sign in</button></div>`;
  else if (m === 'reset') inner = `<h2>New password</h2><p class="sub">Choose a new password for your account.</p>${msg}
    <form id="f-reset"><label>New password<input id="au-pass" type="password" required minlength="8" autocomplete="new-password"></label><button class="btn blue" type="submit">Save password</button></form>`;
  else if (m === 'account') inner = `<h2>Your account</h2><p class="sub">${esc(S.me.email||'')} · ${esc({owner:'Owner',editor:'Editor',member:'Member',banned:'Suspended'}[S.me.role]||'')}</p>${msg}
    <form id="f-name"><label>Display name<input id="au-name" required minlength="2" maxlength="40" value="${esc(S.me.name)}"></label><button class="btn blue" type="submit">Save name</button></form>
    <div class="alt"><button class="link" data-act="nav" data-view="write">My submissions</button><button class="link danger" data-act="signout">Sign out</button></div>`;
  el.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true" aria-label="Account"><button class="x" data-act="auth-close" aria-label="Close">✕</button>${inner}</div>`;
  el.hidden = false;
  el.querySelector('input')?.focus();
}
async function authSubmit(form){
  const redirectTo = location.origin + location.pathname;
  const say = (text, ok) => { S.authMsg = {text, ok}; renderAuth(); };
  const btn = form.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
  try {
    if (form.id === 'f-signin') {
      const { error } = await sb.auth.signInWithPassword({email: val('au-email'), password: $('#au-pass').value});
      if (error) throw error; closeAuth(); toast('Signed in.');
    } else if (form.id === 'f-signup') {
      const { data, error } = await sb.auth.signUp({email: val('au-email'), password: $('#au-pass').value, options:{data:{display_name: val('au-name')}, emailRedirectTo: redirectTo}});
      if (error) throw error;
      if (data.session) { closeAuth(); toast('Welcome to Nuqta.'); }
      else say('Almost there. Check your email and tap the confirmation link, then sign in.', true);
    } else if (form.id === 'f-forgot') {
      const { error } = await sb.auth.resetPasswordForEmail(val('au-email'), {redirectTo});
      if (error) throw error; say('If that email has an account, a reset link is on its way.', true);
    } else if (form.id === 'f-reset') {
      const { error } = await sb.auth.updateUser({password: $('#au-pass').value});
      if (error) throw error; closeAuth(); toast('Password updated.');
    } else if (form.id === 'f-name') {
      const { error } = await sb.from('profiles').update({display_name: val('au-name')}).eq('id', S.me.id);
      if (error) throw error; S.me.name = val('au-name'); say('Name saved.', true); refresh();
    }
  } catch (e) { say(friendly(e), false); }
  if (btn) btn.disabled = false;
}

// ---------- navigation ----------
function go(view){
  const doIt = () => { S.view = view; S.replyTo = null; S.calOpen = false; S.errs = {}; if (!$('#reader').hidden) closeReader(); render(); window.scrollTo({top:0}); history.replaceState(null,'','#'+view); };
  if (S.view === view || matchMedia('(prefers-reduced-motion: reduce)').matches) return doIt();
  const w = $('#wipe'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  setTimeout(doIt, 290);
}

// ---------- writes ----------
async function addPost({space, ref, text, anon, parent=null, errKey}){
  text = text.trim(); if (!text) { S.errs[errKey] = 'Write something first.'; render(); return false; }
  const { error } = await sb.from('posts').insert({space, ref: ref || null, parent_id: parent, body: text.slice(0,2000), anon: !!anon, user_id: S.me.id});
  if (error) { S.errs[errKey] = friendly(error); render(); const ta = errKey==='reply' ? $('#reply-ta') : document.getElementById(errKey); if (ta) ta.value = text; return false; }
  delete S.errs[errKey]; await loadPosts(); render(); return true;
}
async function deskArticleData(){
  const symv = val('a-symbol');
  return {title:val('a-title'), nuqta:val('a-nuqta'), dek:val('a-dek'), section:val('a-section'), author:val('a-author'), body:val('a-body'), symbol: symv==='auto'?'':symv, featured: $('#a-feat').checked};
}
async function onSubmit(form){
  if (form.closest('#auth')) return authSubmit(form);
  const btn = form.querySelector('button[type=submit]'); if (btn) btn.disabled = true;
  let ok = false;
  if (form.id === 'f-submit') {
    const data = {title:val('s-title'), nuqta:val('s-nuqta'), dek:val('s-dek'), section:val('s-section'), author:val('s-author'), body:val('s-body'), status:'pending', submitted_by:S.me.id};
    const { error } = await sb.from('articles').insert(data);
    if (error) { S.errs.submit = friendly(error); render(); return; }
    delete S.errs.submit; toast('Sent for review. Track it under My submissions.'); ok = true;
  } else if (form.id === 'f-news') {
    const data = {title:val('n-title'), dek:val('n-dek'), why:val('n-why'), region:val('n-region'), status:val('n-status'), author:val('n-author')||'Nuqta Desk', body:val('n-body'), sources:val('n-sources')};
    const prev = S.editId;
    ok = await act(() => prev ? sb.from('news').update(data).eq('id', prev) : sb.from('news').insert(data), prev ? 'Story updated.' : 'Story published.');
  } else if (form.id === 'f-article') {
    const data = await deskArticleData();
    if (S.approving) ok = await act(() => sb.from('articles').update({...data, status:'published', published_at:new Date().toISOString(), decided_by:S.me.id, editor_note:''}).eq('id', S.approving), 'Approved and published.');
    else if (S.editId) ok = await act(() => sb.from('articles').update(data).eq('id', S.editId), 'Article updated.');
    else ok = await act(() => sb.from('articles').insert({...data, status:'published', published_at:new Date().toISOString(), submitted_by:S.me.id, decided_by:S.me.id}), 'Article published.');
    if (ok && S.approving) { S.approving = null; S.deskTab = 'queue'; }
  } else if (form.id === 'f-prompt') {
    const data = {question:val('p-q'), context:val('p-ctx'), week: mondayOf(val('p-week'))};
    const prev = S.editId;
    ok = await act(() => prev ? sb.from('prompts').update(data).eq('id', prev) : sb.from('prompts').insert(data), prev ? 'Question updated.' : 'Question queued for ' + fmtDate(keyToDate(data.week)) + '.');
  } else if (form.id === 'f-words') {
    const want = [...new Set(val('w-list').split('\n').map(s=>s.trim().toLowerCase()).filter(s=>s.length>=2 && s.length<=60))];
    const add = want.filter(w=>!S.words.includes(w)), del = S.words.filter(w=>!want.includes(w));
    ok = await act(async () => {
      if (add.length) { const r = await sb.from('blocked_words').insert(add.map(word=>({word}))); if (r.error) throw r.error; }
      if (del.length) { const r = await sb.from('blocked_words').delete().in('word', del); if (r.error) throw r.error; }
    }, 'Blocked words saved.');
  }
  if (btn) btn.disabled = false;
  if (ok) { S.editId = null; await refresh(); }
}

// ---------- events ----------
const TABLE = {news:'news', article:'articles', prompt:'prompts'};
document.addEventListener('click', async e => {
  if (S.calOpen && !e.target.closest('.cal-wrap')) { S.calOpen = false; render(); }
  if (e.target.id === 'auth') { closeAuth(); return; }
  const el = e.target.closest('[data-act]'); if (!el || el.tagName === 'SELECT') return;
  if (e.target.closest('details')) return;
  const a = el.dataset.act, id = el.dataset.id;
  if (!['del-post','desk-del','del-samples','withdraw'].includes(a)) S.armed = null;
  switch (a) {
    case 'nav': closeAuth(); go(el.dataset.view); break;
    case 'account': openAuth(S.me.id ? 'account' : 'signin'); break;
    case 'auth': openAuth(el.dataset.mode); break;
    case 'auth-close': closeAuth(); break;
    case 'signout': await sb.auth.signOut(); closeAuth(); toast('Signed out.'); break;
    case 'open-news': openNews(id); break;
    case 'open-article': closeAuth(); openArticle(id); break;
    case 'close-reader': closeReader(); break;
    case 'copy-link': { const url = location.href.split('#')[0] + '#' + S.readerHash; try { await navigator.clipboard.writeText(url); toast('Link copied.'); } catch { toast('Copy this link: ' + url); } break; }
    case 'cal-toggle': S.calOpen = !S.calOpen; if (S.calOpen) S.calMonth = (S.day || todayKey()).slice(0,7); render(); break;
    case 'cal-month': { const [y,m] = S.calMonth.split('-').map(Number); const d = new Date(y, m-1+Number(el.dataset.d), 1); S.calMonth = `${d.getFullYear()}-${pad(d.getMonth()+1)}`; S.calOpen = true; render(); break; }
    case 'pick-day': S.day = el.dataset.k || null; S.calOpen = false; render(); break;
    case 'clear-filters': S.day = null; S.region = 'All'; render(); break;
    case 'section': S.section = el.dataset.s; render(); break;
    case 'by-author': S.author = el.dataset.a; S.section = 'All'; closeReader(); go('articles'); break;
    case 'layer': S.layer = el.dataset.l; S.replyTo = null; render(); break;
    case 'thread': S.thread = id; S.replyTo = null; render(); break;
    case 'floortab': S.floorTab = el.dataset.t; S.promptId = null; S.replyTo = null; render(); break;
    case 'open-prompt': S.promptId = id; S.floorTab = 'prompt'; render(); break;
    case 'prompt-now': S.promptId = null; render(); break;
    case 'go-prompt': S.layer = 'open'; S.floorTab = 'prompt'; S.promptId = null; go('forum'); break;
    case 'go-wall': S.layer = 'open'; S.floorTab = 'wall'; go('forum'); break;
    case 'go-thread': S.layer = 'pieces'; S.thread = id; go('forum'); break;
    case 'sort': S.sort = el.dataset.s; render(); break;
    case 'post': { const f = el.dataset.for; el.disabled = true;
      if (await addPost({space:el.dataset.space, ref:el.dataset.ref, text:document.getElementById(f).value, anon:document.getElementById(f+'-anon').checked, errKey:f})) toast('Posted.');
      break; }
    case 'reply': S.replyTo = S.replyTo === el.dataset.key ? null : el.dataset.key; S.replyDraft = ''; delete S.errs.reply; render(); $('#reply-ta')?.focus(); break;
    case 'reply-cancel': S.replyTo = null; render(); break;
    case 'post-reply': { const k = el.dataset.key; S.replyDraft = $('#reply-ta').value; el.disabled = true;
      if (await addPost({space:el.dataset.space, ref:el.dataset.ref, text:S.replyDraft, anon:$('#reply-anon').checked, parent:k, errKey:'reply'})) { S.replyTo = null; S.replyDraft = ''; render(); toast('Reply posted.'); }
      break; }
    case 'dot': {
      const k = el.dataset.key, on = S.myDots.has(k), p = S.posts.find(x=>x.id===k);
      if (on) { S.myDots.delete(k); if (p) p.dots--; } else { S.myDots.add(k); if (p) p.dots++; }
      render();
      if (!await act(() => on ? sb.from('dots').delete().eq('post_id', k).eq('user_id', S.me.id) : sb.from('dots').insert({post_id:k, user_id:S.me.id}))) refresh();
      break; }
    case 'report': {
      const k = el.dataset.key, on = S.myReports.has(k);
      if (on) S.myReports.delete(k); else S.myReports.add(k); render();
      if (!await act(() => on ? sb.from('reports').delete().eq('post_id', k).eq('user_id', S.me.id) : sb.from('reports').insert({post_id:k, user_id:S.me.id}), on ? 'Report withdrawn.' : 'Reported. An editor will take a look.')) refresh();
      else if (!on) { await loadPosts(); render(); }
      break; }
    case 'stance': {
      const v = el.dataset.v, cur = S.myStances[id], c = S.stanceCounts[id] = S.stanceCounts[id] || {agree:0,complicated:0,disagree:0};
      if (cur) c[cur]--; if (cur === v) delete S.myStances[id]; else { S.myStances[id] = v; c[v]++; }
      refreshReader(); render();
      await act(() => cur === v ? sb.from('stances').delete().eq('article_id', id).eq('user_id', S.me.id) : sb.from('stances').upsert({article_id:id, user_id:S.me.id, value:v}, {onConflict:'article_id,user_id'}));
      break; }
    case 'del-post': { const k = 'post:'+el.dataset.key;
      if (S.armed !== k) { S.armed = k; render(); break; }
      S.armed = null; if (await act(() => sb.from('posts').delete().eq('id', el.dataset.key), 'Post deleted.')) { await loadPosts(); render(); }
      break; }
    case 'withdraw': {
      if (S.armed !== 'wd:'+id) { S.armed = 'wd:'+id; render(); break; }
      S.armed = null; if (await act(() => sb.from('articles').delete().eq('id', id), 'Submission withdrawn.')) refresh(); break; }
    case 'desk-tab': S.deskTab = el.dataset.t; S.editId = null; S.approving = null; render(); break;
    case 'desk-cancel': S.editId = null; if (S.approving) { S.approving = null; S.deskTab = 'queue'; } render(); break;
    case 'desk-edit': S.deskTab = el.dataset.kind; S.editId = id; S.approving = null; render(); window.scrollTo({top:0,behavior:'smooth'}); break;
    case 'review': S.approving = id; S.deskTab = 'article'; render(); window.scrollTo({top:0,behavior:'smooth'}); break;
    case 'reject': if (await act(() => sb.from('articles').update({status:'rejected', editor_note:val('note-'+id), decided_by:S.me.id}).eq('id', id), 'Sent back to the writer.')) refresh(); break;
    case 'mod-remove': if (await act(() => sb.from('posts').delete().eq('id', el.dataset.key), 'Post removed.')) refresh(); break;
    case 'mod-keep': if (await act(async () => {
        const r1 = await sb.from('reports').update({resolved:true}).eq('post_id', el.dataset.key); if (r1.error) throw r1.error;
        const r2 = await sb.from('posts').update({hidden:false}).eq('id', el.dataset.key); if (r2.error) throw r2.error;
      }, 'Kept. Report closed.')) refresh(); break;
    case 'ban': if (await act(() => sb.from('profiles').update({banned: el.dataset.b === '1'}).eq('id', id), el.dataset.b === '1' ? 'Account suspended.' : 'Account restored.')) refresh(); break;
    case 'desk-del': {
      const k = el.dataset.kind + ':' + id;
      if (S.armed !== k) { S.armed = k; render(); break; }
      S.armed = null; if (await act(() => sb.from(TABLE[el.dataset.kind]).delete().eq('id', id), 'Deleted.')) refresh(); break; }
    case 'del-samples': {
      if (S.armed !== 'samples') { S.armed = 'samples'; render(); break; }
      S.armed = null;
      if (await act(async () => { for (const t of ['news','articles','prompts']) { const r = await sb.from(t).delete().eq('sample', true); if (r.error) throw r.error; } }, 'Samples removed.')) refresh();
      break; }
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (S.authMode) closeAuth(); else if (S.calOpen) { S.calOpen = false; render(); } else if (!$('#reader').hidden) closeReader(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
});
document.addEventListener('change', async e => {
  if (e.target.id === 'author-sel') { S.author = e.target.value; render(); }
  if (e.target.id === 'region-sel') { S.region = e.target.value; render(); }
  if (e.target.dataset.act === 'set-role') {
    const editors = S.team.filter(p=>p.role==='editor').length;
    if (e.target.value === 'editor' && editors >= 3 && !confirmMany) { toast('You already have 3 editors. Change one back to Member first.'); e.target.value = 'member'; return; }
    if (await act(() => sb.from('profiles').update({role:e.target.value}).eq('id', e.target.dataset.id), 'Role updated.')) refresh();
  }
});
const confirmMany = false; // set to true to allow more than three editors
document.addEventListener('input', e => { if (e.target.id === 'reply-ta') S.replyDraft = e.target.value; });
document.addEventListener('submit', e => { e.preventDefault(); onSubmit(e.target); });

// ---------- boot ----------
function setStatus(t){ $('#status').textContent = t; }
let hashDone = false;
function maybeHash(){
  if (hashDone || !S.loaded) return; hashDone = true;
  const h = (location.hash||'').slice(1);
  if (h.startsWith('read-') && S.articles.some(a=>a.id===h.slice(5))) openArticle(h.slice(5));
  else if (h.startsWith('news-') && S.news.some(a=>a.id===h.slice(5))) openNews(h.slice(5));
}
async function boot(){
  const h = (location.hash||'').slice(1);
  const map = {news:'news', articles:'articles', forum:'forum', write:'write', newsroom:'newsroom'};
  if (map[h]) S.view = map[h]; else if (h.startsWith('read-')) S.view = 'articles';
  render();
  if (!sb) { $('#setup').hidden = false; S.loaded = true; setStatus('Database not connected.'); render(); return; }
  sb.auth.onAuthStateChange((event, session) => {
    const changed = (session?.user?.id || null) !== (S.session?.user?.id || null);
    S.session = session;
    if (event === 'PASSWORD_RECOVERY') openAuth('reset');
    if (changed) setTimeout(refresh, 0);
  });
  const { data } = await sb.auth.getSession();
  S.session = data.session;
  await refresh();
  // keep The Floor fresh while someone is reading it
  setInterval(async () => {
    const typing = [...document.querySelectorAll('#view textarea')].some(t => t.value.trim());
    if (document.visibilityState === 'visible' && S.view === 'forum' && !S.replyTo && !typing) { try { await loadPosts(); render(); } catch {} }
  }, 30000);
}
boot();
})();
