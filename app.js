// ─── FIREBASE SETUP ─────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzyWV43V_tjlJAV_NyYCJ2Cxy_Zq7pZoQ",
  authDomain: "venneys.firebaseapp.com",
  projectId: "venneys",
  storageBucket: "venneys.firebasestorage.app",
  messagingSenderId: "574978601696",
  appId: "1:574978601696:web:1a2f89cd195d1bf4ffd685"
};
function isConfigured() { return !FIREBASE_CONFIG.apiKey.includes('YOUR_'); }

// ─── APP STATE ───────────────────────────────────────────────
let db, currentUser = null, currentTableId = null, selectedUserId = null, pinBuffer = '';
let tableData = {}, usersData = {};
let firebaseMenuData = null;
let testMode = false;

// Current selection indices for order modal
let selSection = 0, selCat = 0, selSubCat = 0;

// ─── HELPERS ─────────────────────────────────────────────────
function enc(str) { return encodeURIComponent(str).replace(/'/g, '%27'); }
function getMenu() { return firebaseMenuData || MENU_DATA; }
function getEditMenu() { return JSON.parse(JSON.stringify(getMenu())); }
function getSections() { return getMenu().sections || []; }
function getSection(i) { return getSections()[i]; }
function getCat(si, ci) { return getSection(si)?.categories?.[ci]; }

function findItemGlobal(itemId) {
  for (const sec of getSections()) {
    for (const cat of (sec.categories||[])) {
      if (cat.items) { const f = cat.items.find(i=>i.id===itemId); if(f) return f; }
      if (cat.subcategories) for (const sub of cat.subcategories) {
        const f = sub.items?.find(i=>i.id===itemId); if(f) return f;
      }
    }
  }
  return null;
}

// ─── FIREBASE INIT ───────────────────────────────────────────
function initFirebase() {
  if (!isConfigured()) { document.getElementById('user-select-list').innerHTML='<div style="color:var(--danger);padding:1rem;">⚠ Firebase not configured</div>'; return; }
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
  loadUsers(); listenToTables(); listenToMenu();
}

function listenToTables() {
  db.collection('_data').doc('tables').onSnapshot(doc => {
    tableData = doc.exists ? doc.data() : {};
    renderTables();
    if (currentTableId && showScreen.current === 'table') renderOrders(currentTableId);
  });
}

function loadUsers() {
  db.collection('_data').doc('users').onSnapshot(doc => {
    usersData = {};
    if (doc.exists) { const raw = doc.data(); Object.keys(raw).forEach(uid => { usersData[uid] = { id: uid, ...raw[uid] }; }); }
    renderUserList();
    if (showScreen.current === 'vault') renderVault();
  }, err => {
    const el = document.getElementById('user-select-list');
    if (el) el.innerHTML = `<div style="color:var(--danger);padding:1rem;">⚠ ${err.message}</div>`;
  });
}

function listenToMenu() {
  db.collection('_data').doc('menu').onSnapshot(doc => {
    firebaseMenuData = doc.exists ? doc.data() : null;
  });
}

async function saveMenuToFirebase(m) { await db.collection('_data').doc('menu').set(m); }
async function saveTable(tId, d) { await db.collection('_data').doc('tables').set({ [tId]: d }, { merge: true }); }
function userForSave(uid) { const u={...usersData[uid]}; delete u.id; return u; }
async function saveUser(uid, d) { await db.collection('_data').doc('users').set({ [uid]: d }, { merge: true }); }
async function deleteUserDoc(uid) { await db.collection('_data').doc('users').update({ [uid]: firebase.firestore.FieldValue.delete() }); }

// Smart sync — merges bundled data into Firebase without reordering
async function pushBundledMenuToFirebase() {
  const current = getEditMenu();
  const bundled = JSON.parse(JSON.stringify(MENU_DATA));
  if (!current.sections || !current.sections.length) {
    await saveMenuToFirebase(bundled); toast('✓ Menu synced'); return;
  }
  let added=0, updated=0;
  const curByKey = {}; current.sections.forEach(s => { curByKey[s.key] = s; });
  bundled.sections.forEach(bs => {
    if (!curByKey[bs.key]) { current.sections.push(bs); added++; return; }
    const cs = curByKey[bs.key];
    if (!cs.hours && bs.hours) cs.hours = bs.hours;
    const cCatByName = {}; (cs.categories||[]).forEach(c => { cCatByName[c.name] = c; });
    (bs.categories||[]).forEach(bc => {
      if (!cCatByName[bc.name]) { cs.categories.push(bc); added++; return; }
      const cc = cCatByName[bc.name];
      if (bc.items && cc.items) { updated += mergeItems(cc.items, bc.items); }
      if (bc.subcategories && cc.subcategories) {
        const cSubByName = {}; cc.subcategories.forEach(s => { cSubByName[s.name]=s; });
        bc.subcategories.forEach(bsub => {
          if (!cSubByName[bsub.name]) { cc.subcategories.push(bsub); added++; }
          else { updated += mergeItems(cSubByName[bsub.name].items, bsub.items); }
        });
      }
    });
  });
  await saveMenuToFirebase(current);
  toast(`✓ Synced — ${added} new, ${updated} updated`);
}

function mergeItems(existing, bundled) {
  let c=0; const byId={}; existing.forEach(i=>{if(i.id)byId[i.id]=i;});
  bundled.forEach(bi => {
    const ei=byId[bi.id];
    if(ei){let ch=false;['desc','mods','flavours','isFishChips','isSteak','isBurger'].forEach(f=>{if(bi[f]!==undefined&&JSON.stringify(ei[f])!==JSON.stringify(bi[f])){ei[f]=bi[f];ch=true;}});if(ch)c++;}
    else{existing.push(bi);c++;}
  }); return c;
}

// ─── SCREEN MANAGEMENT ───────────────────────────────────────
const showScreen = { current: null };
function goTo(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('screen-' + name);
  if (s) { s.classList.add('active'); showScreen.current = name; }
}

// ─── AUTH ────────────────────────────────────────────────────
function renderUserList() {
  const el = document.getElementById('user-select-list'); if (!el) return;
  el.innerHTML = '';
  const users = Object.values(usersData).sort((a,b)=>a.name.localeCompare(b.name));
  if(!users.length){el.innerHTML='<div style="color:var(--text-dim);text-align:center;padding:1.5rem;grid-column:1/-1;">No users. Visit <strong style="color:var(--gold)">/vault</strong> to add.</div>';return;}
  users.forEach(u=>{const btn=document.createElement('button');btn.className='user-btn';btn.textContent=u.name;btn.onclick=()=>selectUser(u.id,btn);el.appendChild(btn);});
}
function selectUser(uid,btn){selectedUserId=uid;pinBuffer='';document.querySelectorAll('.user-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');document.getElementById('pin-popup-user').textContent=usersData[uid]?.name||'';document.getElementById('pin-overlay').classList.add('show');updatePinDots();}
function closePinOverlay(){document.getElementById('pin-overlay').classList.remove('show');selectedUserId=null;pinBuffer='';document.querySelectorAll('.user-btn').forEach(b=>b.classList.remove('selected'));}
function updatePinDots(){document.querySelectorAll('.pin-dot').forEach((d,i)=>{d.classList.toggle('filled',i<pinBuffer.length);});}
function pinPress(val){if(!selectedUserId)return;if(val==='del'){pinBuffer=pinBuffer.slice(0,-1);}else if(pinBuffer.length<4){pinBuffer+=val;}updatePinDots();if(pinBuffer.length===4)setTimeout(attemptLogin,150);}
function attemptLogin(){const user=usersData[selectedUserId];if(!user)return;if(pinBuffer===(user.pin||'1234')){currentUser={...user};closePinOverlay();goTo('tables');renderTables();toast(`Welcome, ${currentUser.name}!`);}else{pinBuffer='';updatePinDots();toast('Incorrect PIN');}}
function logout(){currentUser=null;selectedUserId=null;pinBuffer='';closePinOverlay();goTo('login');}
function showPinChange(){openModal(`<h3>Change PIN</h3><p>New 4-digit PIN for <strong style="color:var(--gold)">${currentUser.name}</strong></p><span class="modal-label">New PIN</span><input class="modal-input" id="new-pin" type="password" inputmode="numeric" maxlength="4" placeholder="4 digits"><span class="modal-label">Confirm</span><input class="modal-input" id="confirm-pin" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm"><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="savePinChange()">Save</button></div>`);}
async function savePinChange(){const p1=document.getElementById('new-pin').value,p2=document.getElementById('confirm-pin').value;if(!/^\d{4}$/.test(p1))return toast('PIN must be 4 digits');if(p1!==p2)return toast('PINs do not match');const u=userForSave(currentUser.id);u.pin=p1;await saveUser(currentUser.id,u);currentUser.pin=p1;closeModal();toast('PIN updated!');}

// ─── TABLES ─────────────────────────────────────────────────
function renderTables(){const el=document.getElementById('tables-grid');if(!el)return;el.innerHTML='';if(currentUser){const un=document.getElementById('header-user-name');if(un)un.textContent=currentUser.name;}
TABLES.forEach(t=>{const td=tableData[String(t.id)]||{open:false,orders:[],allergens:[]};const tile=document.createElement('div');tile.className='table-tile '+(td.open?'open':'closed');let count=0;(td.orders||[]).forEach(o=>{if(o.items&&Array.isArray(o.items))count+=o.items.length;else count++;});const hasA=(td.allergens||[]).length>0||td.otherAllergen;
tile.innerHTML=`<span class="t-number">${t.label.replace('Table ','')}</span><span class="t-word">Table</span>${count>0?`<span class="t-count">${count} item${count>1?'s':''}</span>`:'<span class="t-count t-empty">Empty</span>'}${td.open&&hasA?'<div class="allergen-dot">!</div>':''}`;
tile.onclick=()=>openTable(t.id);el.appendChild(tile);});}

function openTable(id){currentTableId=String(id);const td=tableData[currentTableId]||{};if(!td.open)showAllergenModal(id,true);else{goTo('table');renderTableDetail(currentTableId);}}
function showAllergenModal(tableId,isOpening=false){const tId=String(tableId),td=tableData[tId]||{allergens:[],otherAllergen:''},label=TABLES.find(t=>t.id==tableId)?.label||`Table ${tableId}`,checked=td.allergens||[];openModal(`<h3>${isOpening?`Open ${label}`:`Allergens — ${label}`}</h3><p>Does anyone have any of the 14 allergens?</p><div class="allergen-grid">${ALLERGENS.map(a=>`<label class="allergen-check ${checked.includes(a)?'checked':''}" data-allergen="${a}" onclick="toggleAllergenCheck(this)"><div class="check-mark"></div><span class="check-label">${a}</span></label>`).join('')}</div><span class="modal-label">Other allergies / notes</span><input class="modal-input" id="other-allergen" placeholder="e.g. latex, kiwi..." value="${td.otherAllergen||''}"><div class="modal-actions"><button class="btn-secondary" onclick="saveAllergens('${tId}',${isOpening},true)">Skip</button><button class="btn-primary" onclick="saveAllergens('${tId}',${isOpening},false)">${isOpening?'Open Table':'Save'}</button></div>`);}
function toggleAllergenCheck(el){el.classList.toggle('checked');}
async function saveAllergens(tId,isOpening,skip){const a=skip?[]:Array.from(document.querySelectorAll('.allergen-check.checked')).map(el=>el.dataset.allergen);const o=skip?'':(document.getElementById('other-allergen')?.value||'');const ex=tableData[tId]||{};await saveTable(tId,{...ex,open:true,allergens:a,otherAllergen:o,openedAt:ex.openedAt||new Date().toISOString(),orders:ex.orders||[]});closeModal();currentTableId=tId;goTo('table');renderTableDetail(tId);}
async function closeTable(id){openModal(`<h3>Close Table?</h3><p>Clear all orders?</p><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-danger" onclick="confirmCloseTable('${id}')">Close</button></div>`);}
async function confirmCloseTable(id){await saveTable(String(id),{open:false,orders:[],allergens:[],otherAllergen:''});closeModal();goTo('tables');toast('Table closed');}
function showCloseAll(){openModal(`<h3>Close All Tables?</h3><p>Cannot be undone.</p><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-danger" onclick="confirmCloseAll()">Close All</button></div>`);}
async function confirmCloseAll(){const u={};Object.keys(tableData).forEach(t=>{if(tableData[t].open)u[t]={open:false,orders:[],allergens:[],otherAllergen:''};});if(Object.keys(u).length)await db.collection('_data').doc('tables').set(u,{merge:true});closeModal();toast('All tables closed');}
function renderTableDetail(tId){const td=tableData[tId]||{},label=TABLES.find(t=>t.id==tId)?.label||`Table ${tId}`;document.getElementById('table-detail-title').textContent=label;const badge=document.getElementById('allergen-badge');badge.style.display=((td.allergens||[]).length>0||td.otherAllergen)?'inline-flex':'none';renderOrders(tId);}

// ─── ACTIVE MENUS ────────────────────────────────────────────
function toggleTestMode(){testMode=!testMode;const btn=document.getElementById('test-mode-btn');if(btn){btn.textContent=testMode?'🧪 Test ON':'🧪 Test Mode';btn.style.background=testMode?'rgba(76,175,80,0.2)':'';btn.style.borderColor=testMode?'var(--success)':'';btn.style.color=testMode?'var(--success)':'';}toast(testMode?'Test mode ON':'Test mode OFF');}

function getActiveSectionIndices(){
  const secs=getSections();if(testMode)return secs.map((_,i)=>i);
  const now=new Date(),day=now.getDay(),mins=now.getHours()*60+now.getMinutes();
  const active=[];
  secs.forEach((sec,i)=>{
    if(!sec.hours){active.push(i);return;}
    for(const s of (sec.hours.schedules||[])){if(s.days.includes(day)&&mins>=s.start&&mins<=s.end){active.push(i);return;}}
  });
  return active;
}

// ─── ORDER MODAL ─────────────────────────────────────────────
let pendingOrderItems = [];

function showAddOrderModal(){
  pendingOrderItems=[];
  const activeIdxs=getActiveSectionIndices();
  if(!activeIdxs.length){toast('No menus available right now');return;}
  selSection=activeIdxs[0];selCat=0;selSubCat=0;
  closeOrderModal();
  const overlay=document.createElement('div');overlay.className='modal-overlay modal-overlay-large';overlay.id='order-modal-overlay';
  overlay.innerHTML=`<div class="modal modal-large"><div class="order-modal-layout">
    <div class="order-modal-header"><div class="quick-actions-bar">
      <button class="quick-btn drink-btn" onclick="showDrinkSubModal()"><span class="quick-icon">🍷</span> Add Drink</button>
      <button class="quick-btn misc-btn" onclick="showMiscSubModal()"><span class="quick-icon">✏️</span> Misc Item</button>
    </div><button class="order-close-btn" onclick="closeOrderModal()">✕</button></div>
    <div id="order-section-tabs" class="order-menu-tabs"></div>
    <div class="order-split-body">
      <div class="order-menu-side"><div class="order-modal-body" id="order-modal-body"></div></div>
      <div class="order-pending-side">
        <div class="pending-side-header"><span class="pending-side-title">Your Order</span><span class="pending-side-count" id="pending-count">0 items</span></div>
        <div class="pending-side-list" id="pending-list"><div class="pending-empty">Tap menu items to add them</div></div>
        <div class="pending-side-footer"><button class="btn-primary pending-done-btn" id="pending-done-btn" onclick="submitOrderBatch()" disabled>Done</button></div>
      </div>
    </div>
  </div></div>`;
  overlay.onclick=e=>{if(e.target===overlay)closeOrderModal();};
  document.body.appendChild(overlay);
  renderOrderSectionTabs();
}

function closeOrderModal(){document.getElementById('order-modal-overlay')?.remove();pendingOrderItems=[];}

function renderOrderSectionTabs(){
  const el=document.getElementById('order-section-tabs');if(!el)return;
  const idxs=getActiveSectionIndices();
  el.innerHTML=idxs.map(i=>{const s=getSection(i);return`<button class="order-menu-tab ${i===selSection?'active':''}" onclick="switchSection(${i})">${s.label}</button>`;}).join('');
  renderOrderBody();
}

function switchSection(i){selSection=i;selCat=0;selSubCat=0;document.querySelectorAll('.order-menu-tab').forEach((t,idx)=>{const idxs=getActiveSectionIndices();t.classList.toggle('active',idxs[idx]===i);});renderOrderBody();}

function renderOrderBody(){
  const body=document.getElementById('order-modal-body');if(!body)return;
  const sec=getSection(selSection);if(!sec)return;
  const cats=sec.categories||[];
  if(selCat>=cats.length)selCat=0;
  body.innerHTML=`
    <div class="cat-tabs">${cats.map((c,i)=>`<button class="cat-tab ${i===selCat?'active':''}" onclick="switchCat(${i})">${c.name}</button>`).join('')}</div>
    <div id="sub-cat-area"></div>
    <div class="cat-items" id="cat-items-list"></div>`;
  renderCatContent();
}

function switchCat(i){selCat=i;selSubCat=0;renderOrderBody();}

function renderCatContent(){
  const cat=getCat(selSection,selCat);if(!cat)return;
  const subArea=document.getElementById('sub-cat-area');
  const el=document.getElementById('cat-items-list');if(!el)return;

  if(cat.subcategories&&cat.subcategories.length){
    const subs=cat.subcategories;
    if(selSubCat>=subs.length)selSubCat=0;
    // Default to "Coffee & More" if exists
    if(selSubCat===0){const coffeeIdx=subs.findIndex(s=>s.name==='Coffee & More');if(coffeeIdx>=0)selSubCat=coffeeIdx;}
    if(subArea)subArea.innerHTML=`<div class="cat-tabs sub-level">${subs.map((s,i)=>`<button class="cat-tab sub ${i===selSubCat?'active':''}" onclick="switchSubCat(${i})">${s.name}</button>`).join('')}</div>`;
    renderItemList(el,subs[selSubCat]?.items||[]);
  } else {
    if(subArea)subArea.innerHTML='';
    renderItemList(el,cat.items||[]);
  }
}

function switchSubCat(i){selSubCat=i;const cat=getCat(selSection,selCat);if(!cat||!cat.subcategories)return;
  document.querySelectorAll('.cat-tab.sub').forEach((t,idx)=>t.classList.toggle('active',idx===i));
  const el=document.getElementById('cat-items-list');if(el)renderItemList(el,cat.subcategories[i]?.items||[]);}

function renderItemList(el,items){
  if(!items.length){el.innerHTML='<div class="empty-state">No items</div>';return;}
  el.innerHTML=items.map(item=>`<button class="menu-item-btn" onclick="addItem('${item.id}')"><span class="item-name">${item.name}</span>${item.desc?`<span class="item-desc">${item.desc}</span>`:''}</button>`).join('');
}

// ─── PENDING SIDE ────────────────────────────────────────────
function renderPendingSide(){const list=document.getElementById('pending-list'),countEl=document.getElementById('pending-count'),doneBtn=document.getElementById('pending-done-btn');if(!list)return;const n=pendingOrderItems.length;if(countEl)countEl.textContent=`${n} item${n!==1?'s':''}`;if(doneBtn)doneBtn.disabled=n===0;if(n===0){list.innerHTML='<div class="pending-empty">Tap menu items to add them</div>';return;}
list.innerHTML=pendingOrderItems.map((item,i)=>`<div class="pending-item" style="animation:pendingSlide 0.15s ease"><span class="pending-item-icon">${item.icon}</span><div class="pending-item-body"><div class="pending-item-name">${item.name}</div>${item.optSummary?`<div class="pending-item-opts">${item.optSummary}</div>`:''}</div><button class="pending-item-remove" onclick="removePendingItem(${i})">✕</button></div>`).join('');list.scrollTop=list.scrollHeight;}
function removePendingItem(i){pendingOrderItems.splice(i,1);renderPendingSide();}

async function submitOrderBatch(){if(!pendingOrderItems.length)return toast('Add items first');const tId=currentTableId,ex=tableData[tId]||{open:true,orders:[]};const now=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});const types=[...new Set(pendingOrderItems.map(i=>i.type))];let gt='food';if(types.length===1)gt=types[0];
const grp={id:'grp_'+Date.now(),type:gt,user:currentUser.name,time:now,items:pendingOrderItems.map(i=>({id:i.id,name:i.name,type:i.type,opts:i.opts||{},extraNote:i.extraNote||'',icon:i.icon}))};
await saveTable(tId,{...ex,orders:[...(ex.orders||[]),grp]});toast(`Order added: ${pendingOrderItems.length} item${pendingOrderItems.length>1?'s':''}`);closeOrderModal();}

// ─── ADD ITEM ROUTING ────────────────────────────────────────
function itemIsBurger(item){return item.isBurger||/burger/i.test(item.name);}
function itemNeedsCheeseChoice(item){const sec=getSection(selSection);return itemIsBurger(item)&&sec?.key==='evening';}

function addItem(itemId){
  const item=findItemGlobal(itemId);if(!item)return;
  if(item.isFishChips)showFishChipsSubModal(item);
  else if(item.isSteak)showSteakSubModal(item);
  else if(itemNeedsCheeseChoice(item))showBurgerCheeseSubModal(item);
  else if(item.mods==='draught')showDraughtSubModal(item);
  else if(item.mods==='spirit')showSpiritSubModal(item);
  else if(item.mods==='softdrink')showSoftDrinkSubModal(item);
  else if(item.mods==='tap_soda')showTapSodaSubModal(item);
  else if(item.mods==='flavour_ice')showFlavourIceSubModal(item);
  else if(item.mods==='flavour')showFlavourSubModal(item);
  else if(item.mods==='cordial')showCordialSubModal(item);
  else if(item.mods==='scoops')showScoopsSubModal(item);
  else showNotesSubModal(item);
}

// ─── SUB-MODALS ──────────────────────────────────────────────
function openSubModal(html){closeSubModal();const o=document.createElement('div');o.className='sub-modal-overlay';o.id='sub-modal-overlay';o.innerHTML=`<div class="sub-modal">${html}</div>`;o.onclick=e=>{if(e.target===o)closeSubModal();};document.body.appendChild(o);}
function closeSubModal(){document.getElementById('sub-modal-overlay')?.remove();}
function selectOpt(btn){const root=btn.closest('#sub-modal-overlay')||document;root.querySelectorAll(`.opt-btn[data-group="${btn.dataset.group}"]`).forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');}
function toggleFlag(btn){btn.classList.toggle('selected');}

function addToPending(item,type,opts,extraNote){
  const optSummary=Object.values(opts).join(' · ');
  pendingOrderItems.push({id:`${item.id}_${Date.now()}`,name:item.name,type,opts,extraNote,optSummary,icon:type==='drink'?'🍷':type==='misc'?'✏️':'🍽'});
  closeSubModal();renderPendingSide();toast(`Added: ${item.name}`);
}

function confirmDrinkMods(itemId){const item=findItemGlobal(itemId);if(!item)return;const opts={};['size','measure','ice','flavour'].forEach(g=>{const el=document.querySelector(`#sub-modal-overlay .opt-btn.selected[data-group="${g}"]`);if(el)opts[g]=el.dataset.val;});addToPending(item,'drink',opts,document.getElementById('item-extra-note')?.value||'');}

function showNotesSubModal(item){openSubModal(`<h3>${item.name}</h3>${item.desc?`<p>${item.desc}</p>`:''}<span class="modal-label">Extra notes (optional)</span><input class="modal-input" id="item-extra-note" placeholder="Any extra requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmNotes('${item.id}')">Add</button></div>`);setTimeout(()=>document.getElementById('item-extra-note')?.focus(),100);}
function confirmNotes(itemId){const item=findItemGlobal(itemId);addToPending(item,'food',{},document.getElementById('item-extra-note')?.value||'');}

function showFishChipsSubModal(item){openSubModal(`<h3>${item.name}</h3><p>${item.desc}</p><span class="modal-label">Peas</span><div class="modal-options"><button class="opt-btn" data-group="peas" data-val="Mushy Peas" onclick="selectOpt(this)">Mushy Peas</button><button class="opt-btn" data-group="peas" data-val="Garden Peas" onclick="selectOpt(this)">Garden Peas</button></div><span class="modal-label">Chips or Fries?</span><div class="modal-options"><button class="opt-btn" data-group="chips" data-val="Chips" onclick="selectOpt(this)">Chips</button><button class="opt-btn" data-group="chips" data-val="Fries" onclick="selectOpt(this)">Fries</button></div><span class="modal-label">Tartar Sauce?</span><div class="modal-options"><button class="opt-btn" data-group="tartar" data-val="Tartar Sauce" onclick="selectOpt(this)">Tartar Sauce</button><button class="opt-btn" data-group="tartar" data-val="No Tartar" onclick="selectOpt(this)">No Tartar</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any extra requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmFishChips('${item.id}')">Add</button></div>`);}
function confirmFishChips(itemId){const item=findItemGlobal(itemId);const opts={};['peas','chips','tartar'].forEach(g=>{const el=document.querySelector(`#sub-modal-overlay .opt-btn.selected[data-group="${g}"]`);if(el)opts[g]=el.dataset.val;});addToPending(item,'food',opts,document.getElementById('item-extra-note')?.value||'');}

function showSteakSubModal(item){const temps=['Rare','Medium Rare','Medium','Medium Well','Well Done'];openSubModal(`<h3>${item.name}</h3><p>${item.desc}</p><span class="modal-label">How cooked?</span><div class="modal-options">${temps.map(t=>`<button class="opt-btn" data-group="temp" data-val="${t}" onclick="selectOpt(this)">${t}</button>`).join('')}</div><span class="modal-label">Sauce</span><div class="modal-options">${STEAK_SAUCES.map(s=>`<button class="opt-btn" data-group="sauce" data-val="${s}" onclick="selectOpt(this)">${s}</button>`).join('')}</div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmSteak('${item.id}')">Add</button></div>`);}
function confirmSteak(itemId){const item=findItemGlobal(itemId);const opts={};['temp','sauce'].forEach(g=>{const el=document.querySelector(`#sub-modal-overlay .opt-btn.selected[data-group="${g}"]`);if(el)opts[g]=el.dataset.val;});addToPending(item,'food',opts,document.getElementById('item-extra-note')?.value||'');}

function showBurgerCheeseSubModal(item){openSubModal(`<h3>${item.name}</h3><p>${item.desc}</p><span class="modal-label">Cheese</span><div class="modal-options"><button class="opt-btn" data-group="cheese" data-val="Monterey Jack" onclick="selectOpt(this)">Monterey Jack</button><button class="opt-btn" data-group="cheese" data-val="Blue Cheese" onclick="selectOpt(this)">Blue Cheese</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmBurger('${item.id}')">Add</button></div>`);}
function confirmBurger(itemId){const item=findItemGlobal(itemId);const el=document.querySelector('#sub-modal-overlay .opt-btn.selected[data-group="cheese"]');addToPending(item,'food',el?{cheese:el.dataset.val}:{},document.getElementById('item-extra-note')?.value||'');}

function showDraughtSubModal(item){openSubModal(`<h3>${item.name}</h3><span class="modal-label">Size</span><div class="modal-options"><button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button><button class="opt-btn" data-group="size" data-val="Half Pint" onclick="selectOpt(this)">Half Pint</button><button class="opt-btn" data-group="size" data-val="Shandy" onclick="selectOpt(this)">Shandy</button><button class="opt-btn" data-group="size" data-val="Half Shandy" onclick="selectOpt(this)">Half Shandy</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

function showSpiritSubModal(item){const fl=item.flavours||[];openSubModal(`<h3>${item.name}</h3>${item.desc?`<p>${item.desc}</p>`:''}${fl.length?`<span class="modal-label">Variant</span><div class="modal-options">${fl.map(f=>`<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}</div>`:''}<span class="modal-label">Measure</span><div class="modal-options"><button class="opt-btn" data-group="measure" data-val="Single" onclick="selectOpt(this)">Single</button><button class="opt-btn" data-group="measure" data-val="Double" onclick="selectOpt(this)">Double</button></div><span class="modal-label">Ice</span><div class="modal-options"><button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button><button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button></div><span class="modal-label">Mixer</span><input class="modal-input" id="item-extra-note" placeholder="e.g. Lemonade, Coke, Tonic..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

function showSoftDrinkSubModal(item){openSubModal(`<h3>${item.name}</h3><span class="modal-label">Ice</span><div class="modal-options"><button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button><button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

function showTapSodaSubModal(item){openSubModal(`<h3>${item.name}</h3><span class="modal-label">Size</span><div class="modal-options"><button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button><button class="opt-btn" data-group="size" data-val="Regular" onclick="selectOpt(this)">Regular</button><button class="opt-btn" data-group="size" data-val="Dash" onclick="selectOpt(this)">Dash</button></div><span class="modal-label">Ice</span><div class="modal-options"><button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button><button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

function showFlavourIceSubModal(item){const fl=item.flavours||[];openSubModal(`<h3>${item.name}</h3>${fl.length?`<span class="modal-label">Flavour</span><div class="modal-options">${fl.map(f=>`<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}</div>`:''}<span class="modal-label">Ice</span><div class="modal-options"><button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button><button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

function showFlavourSubModal(item){const fl=item.flavours||[];openSubModal(`<h3>${item.name}</h3>${fl.length?`<span class="modal-label">Flavour</span><div class="modal-options">${fl.map(f=>`<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}</div>`:''}<span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

function showCordialSubModal(item){const fl=item.flavours||[];openSubModal(`<h3>${item.name}</h3>${fl.length?`<span class="modal-label">Flavour</span><div class="modal-options">${fl.map(f=>`<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}</div>`:''}<span class="modal-label">Size</span><div class="modal-options"><button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button><button class="opt-btn" data-group="size" data-val="Half" onclick="selectOpt(this)">Half</button></div><span class="modal-label">Ice</span><div class="modal-options"><button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button><button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="Any requests..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmDrinkMods('${item.id}')">Add</button></div>`);}

// ─── SCOOPS ──────────────────────────────────────────────────
let scoopSelections=[];
function showScoopsSubModal(item){scoopSelections=[];const fl=item.flavours||[];openSubModal(`<h3>${item.name}</h3><p>Tap a flavour to add a scoop.</p><div class="modal-options" style="margin-bottom:0.75rem">${fl.map(f=>`<button class="opt-btn" onclick="addScoop('${f.replace(/'/g,"\\'")}')">${f}</button>`).join('')}</div><span class="modal-label">Scoops selected</span><div id="scoop-list" style="min-height:2rem;margin-bottom:0.5rem"><span style="color:var(--text-dim);font-size:0.82rem;font-style:italic">None yet</span></div><span class="modal-label">Extra notes</span><input class="modal-input" id="item-extra-note" placeholder="e.g. in a bowl..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmScoops('${item.id}')">Add</button></div>`);}
function addScoop(f){scoopSelections.push(f);renderScoopList();}
function removeScoop(i){scoopSelections.splice(i,1);renderScoopList();}
function renderScoopList(){const el=document.getElementById('scoop-list');if(!el)return;if(!scoopSelections.length){el.innerHTML='<span style="color:var(--text-dim);font-size:0.82rem;font-style:italic">None yet</span>';return;}el.innerHTML=scoopSelections.map((f,i)=>`<div style="display:inline-flex;align-items:center;gap:0.3rem;background:rgba(200,151,58,0.15);border:1px solid var(--gold-dark);border-radius:6px;padding:0.2rem 0.5rem;margin:0.15rem;font-size:0.82rem;color:var(--gold);">${f}<button onclick="removeScoop(${i})" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:0.7rem;padding:0 0.15rem;">✕</button></div>`).join('')+`<div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.3rem;">${scoopSelections.length} scoop${scoopSelections.length!==1?'s':''}</div>`;}
function confirmScoops(itemId){if(!scoopSelections.length)return toast('Add at least one scoop');const item=findItemGlobal(itemId);const counts={};scoopSelections.forEach(f=>{counts[f]=(counts[f]||0)+1;});const summary=Object.entries(counts).map(([f,n])=>n>1?`${n}× ${f}`:f).join(', ');addToPending(item,'food',{scoops:`${scoopSelections.length} scoop${scoopSelections.length!==1?'s':''}: ${summary}`},document.getElementById('item-extra-note')?.value||'');}

// ─── QUICK ADD DRINK / MISC ─────────────────────────────────
function showDrinkSubModal(){openSubModal(`<h3>Add Drink</h3><span class="modal-label">Drink name</span><input class="modal-input" id="drink-name-input" placeholder="e.g. Coke, Peroni..."><span class="modal-label">Size</span><div class="modal-options"><button class="opt-btn" data-group="size" data-val="Half Pint" onclick="selectOpt(this)">Half Pint</button><button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button><button class="opt-btn selected" data-group="size" data-val="Regular" onclick="selectOpt(this)">Regular</button></div><div class="toggle-row"><label class="toggle-switch"><input type="checkbox" id="drink-ice-toggle"><span class="toggle-slider"></span></label><span class="toggle-label">Ice</span></div><span class="modal-label">Extra notes</span><input class="modal-input" id="drink-note-input" placeholder="e.g. with lime..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmQuickDrink()">Add</button></div>`);setTimeout(()=>document.getElementById('drink-name-input')?.focus(),100);}
function confirmQuickDrink(){const name=document.getElementById('drink-name-input')?.value?.trim();if(!name)return toast('Enter a drink name');const sizeEl=document.querySelector('#sub-modal-overlay .opt-btn.selected[data-group="size"]');const size=sizeEl?.dataset.val||'Regular';const ice=document.getElementById('drink-ice-toggle')?.checked;const note=document.getElementById('drink-note-input')?.value?.trim()||'';const opts={size};if(ice)opts.ice='With Ice';const optSummary=[size,ice?'Ice':'',note].filter(Boolean).join(' · ');pendingOrderItems.push({id:'drink_'+Date.now(),name,type:'drink',opts,extraNote:note,optSummary,icon:'🍷'});closeSubModal();renderPendingSide();toast(`Added: ${name}`);}

function showMiscSubModal(){openSubModal(`<h3>Miscellaneous Item</h3><input class="modal-input" id="misc-name" placeholder="e.g. Extra bread..."><span class="modal-label">Extra notes</span><input class="modal-input" id="misc-note" placeholder="Any details..."><div class="modal-actions"><button class="btn-secondary" onclick="closeSubModal()">Cancel</button><button class="btn-primary" onclick="confirmMisc()">Add</button></div>`);setTimeout(()=>document.getElementById('misc-name')?.focus(),100);}
function confirmMisc(){const name=document.getElementById('misc-name')?.value?.trim();if(!name)return toast('Enter item name');const note=document.getElementById('misc-note')?.value?.trim()||'';pendingOrderItems.push({id:'misc_'+Date.now(),name,type:'misc',opts:{},extraNote:note,optSummary:note,icon:'✏️'});closeSubModal();renderPendingSide();toast(`Added: ${name}`);}

// ─── EXTRA NOTE / DELETE ─────────────────────────────────────
function addExtraNote(groupId,itemIndex){openModal(`<h3>Add Note</h3><input class="modal-input" id="extra-note-input" placeholder="Extra note..."><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="saveExtraNote('${groupId}',${itemIndex})">Save</button></div>`);setTimeout(()=>document.getElementById('extra-note-input')?.focus(),100);}
async function saveExtraNote(groupId,itemIndex){const note=document.getElementById('extra-note-input')?.value?.trim();if(!note)return closeModal();const tId=currentTableId,ex=tableData[tId]||{};const orders=(ex.orders||[]).map(o=>{if(o.id===groupId&&o.items&&o.items[itemIndex]!==undefined){const items=[...o.items];items[itemIndex]={...items[itemIndex],extraNote:items[itemIndex].extraNote?items[itemIndex].extraNote+'; '+note:note};return{...o,items};}return o;});await saveTable(tId,{...ex,orders});closeModal();toast('Note added');}
async function deleteOrderItem(groupId,itemIndex){const tId=currentTableId,ex=tableData[tId]||{};let orders=(ex.orders||[]).map(o=>{if(o.id===groupId&&o.items){const items=o.items.filter((_,i)=>i!==itemIndex);if(!items.length)return null;return{...o,items};}return o;}).filter(Boolean);await saveTable(tId,{...ex,orders});toast('Removed');}
async function deleteOrderGroup(groupId){const tId=currentTableId,ex=tableData[tId]||{};await saveTable(tId,{...ex,orders:(ex.orders||[]).filter(o=>o.id!==groupId)});toast('Removed');}

// ─── RENDER ORDERS (NEWEST FIRST) ───────────────────────────
function renderOrders(tId){
  const td=tableData[tId]||{},orders=td.orders||[];
  const infoBar=document.getElementById('allergen-info-bar'),allergens=td.allergens||[],other=td.otherAllergen||'';
  if(allergens.length||other){infoBar.style.display='flex';infoBar.innerHTML=`<span>⚠ <strong>Allergens:</strong> ${[...allergens,other].filter(Boolean).join(', ')}</span><button onclick="showAllergenModal(currentTableId,false)" style="background:none;border:1px solid rgba(255,193,7,0.5);color:#ffc107;font-size:0.7rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;font-family:Lato,sans-serif;margin-left:auto;flex-shrink:0;">Edit</button>`;}else{infoBar.style.display='none';}
  const el=document.getElementById('order-cards');if(!el)return;
  if(!orders.length){el.innerHTML=`<div class="empty-orders"><div class="empty-icon">🍽</div><div class="empty-title">No orders yet</div><div class="empty-sub">Tap Add Order to begin</div></div>`;return;}
  const reversed=[...orders].reverse();
  el.innerHTML=reversed.map(o=>{
    if(o.items&&Array.isArray(o.items)){const tl=o.type==='drink'?'Drinks':o.type==='misc'?'Misc':'Food';const tc=o.type==='drink'?'drink':o.type==='misc'?'misc':'';
    return`<div class="order-group"><div class="order-group-header"><span class="order-group-type ${tc}">${tl}</span><span class="order-group-user">${o.user}</span><span class="order-group-time">${o.time}</span><div class="order-group-actions"><button class="card-action-btn del" onclick="deleteOrderGroup('${o.id}')">Remove All</button></div></div><div class="order-group-items">${o.items.map((item,idx)=>{const ol=Object.values(item.opts||{}).join(' · ');const ic=item.type==='drink'?'🍷':item.type==='misc'?'✏️':'🍽';return`<div class="order-group-item"><span class="ogi-icon">${ic}</span><div class="ogi-body"><div class="ogi-name">${item.name}</div>${ol?`<div class="ogi-options">${ol}</div>`:''}${item.extraNote?`<div class="ogi-note">📝 ${item.extraNote}</div>`:''}</div><div class="ogi-actions"><button class="card-action-btn" onclick="addExtraNote('${o.id}',${idx})">+ Note</button><button class="card-action-btn del" onclick="deleteOrderItem('${o.id}',${idx})">✕</button></div></div>`;}).join('')}</div></div>`;}
    return'';
  }).join('');
}

// ─── VAULT ───────────────────────────────────────────────────
function renderVault(){const el=document.getElementById('vault-user-list');if(!el)return;const users=Object.values(usersData).sort((a,b)=>a.name.localeCompare(b.name));el.innerHTML=users.length?users.map(u=>`<div class="admin-user-row"><span class="u-name">${u.name}</span><span class="u-role">${u.role||'Staff'}</span><button class="reset-pin-btn" onclick="adminResetPin('${u.id}')">Reset PIN</button><button class="del-user-btn" onclick="adminDeleteUser('${u.id}')">✕</button></div>`).join(''):'<div class="empty-state">No users yet</div>';}
async function adminAddUser(){const name=document.getElementById('new-user-name')?.value?.trim(),role=document.getElementById('new-user-role')?.value?.trim()||'Staff';if(!name)return toast('Enter a name');await saveUser(name.toLowerCase().replace(/\s+/g,'_')+'_'+Date.now(),{name,role,pin:'1234'});document.getElementById('new-user-name').value='';document.getElementById('new-user-role').value='';toast(`${name} added — PIN 1234`);}
async function adminResetPin(uid){const u=userForSave(uid);u.pin='1234';await saveUser(uid,u);toast('PIN reset to 1234');}
async function adminDeleteUser(uid){openModal(`<h3>Delete User?</h3><p>Remove <strong style="color:var(--gold)">${usersData[uid]?.name}</strong>?</p><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-danger" onclick="confirmDeleteUser('${uid}')">Delete</button></div>`);}
async function confirmDeleteUser(uid){await deleteUserDoc(uid);closeModal();toast('Deleted');}

// ─── MODAL SYSTEM ────────────────────────────────────────────
function openModal(html){closeModal();const o=document.createElement('div');o.className='modal-overlay';o.id='modal-overlay';o.innerHTML=`<div class="modal">${html}</div>`;o.onclick=e=>{if(e.target===o)closeModal();};document.body.appendChild(o);}
function closeModal(){document.getElementById('modal-overlay')?.remove();}

let toastTimer;
function toast(msg){document.querySelector('.toast')?.remove();clearTimeout(toastTimer);const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);toastTimer=setTimeout(()=>t.remove(),2400);}

// ─── ROUTING ─────────────────────────────────────────────────
function checkRoute(){const p=window.location.pathname;if(p.endsWith('/vault')||p.endsWith('/vault.html')){initFirebase();renderVaultScreen();goTo('vault');}else{goTo('login');initFirebase();}}

// ─── VAULT SCREEN ────────────────────────────────────────────
let edSec=0,edCat=0,edSub=0;
const DAY_NAMES=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function minsToTime(m){return`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
function timeToMins(t){const[h,m]=t.split(':').map(Number);return h*60+(m||0);}

function renderVaultScreen(){
  document.getElementById('screen-vault').innerHTML=`
    <div class="app-header"><h2>⚙ VG Orders — Admin</h2><a href="/" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;margin-left:auto;">← Back</a></div>
    <div class="vault-content">
      <div class="vault-section"><h3>Staff</h3><div id="vault-user-list" class="user-list-admin"></div>
        <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;"><input class="modal-input" id="new-user-name" placeholder="Full name" style="flex:1;margin:0;"><input class="modal-input" id="new-user-role" placeholder="Role" style="flex:1;margin:0;"><button class="btn-primary" onclick="adminAddUser()" style="flex:none;padding:0.65rem 1.2rem;">Add</button></div>
        <p style="margin-top:0.6rem;font-size:0.8rem;color:var(--text-dim)">Default PIN: 1234</p></div>
      <div class="vault-section"><h3>Menu Editor</h3>
        <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.75rem;line-height:1.5">Smart Sync updates modifiers and adds new items without changing your order.</p>
        <button class="btn-primary" onclick="pushBundledMenuToFirebase()" style="padding:0.55rem 1rem;font-size:0.85rem;margin-bottom:1rem;">↻ Smart Sync</button>
        <div id="menu-editor"></div></div>
      <div class="vault-section"><h3>Migration</h3><button class="btn-primary" onclick="migrateOldData()" style="padding:0.55rem 1rem;">Migrate Old Data</button><div id="migrate-status" style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim);"></div></div>
    </div>`;
  setTimeout(()=>{renderVault();renderMenuEditor();},500);
}

function renderMenuEditor(){
  const c=document.getElementById('menu-editor');if(!c)return;
  const secs=getSections();if(edSec>=secs.length)edSec=0;
  c.innerHTML=`
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;align-items:center;">
      ${secs.map((s,i)=>`<div style="display:flex;align-items:center;">${i>0?`<button class="reset-pin-btn" style="padding:0.15rem 0.25rem;font-size:0.6rem;border-radius:4px 0 0 4px;border-right:none;" onclick="moveSection(${i},-1)">◀</button>`:''}
        <button class="cat-tab ${i===edSec?'active':''}" onclick="edSec=${i};edCat=0;edSub=0;renderMenuEditor();" style="border-radius:${i>0?'0':'6px'} ${i<secs.length-1?'0':'6px'} ${i<secs.length-1?'0':'6px'} ${i>0?'0':'6px'};">${s.label}</button>
        ${i<secs.length-1?`<button class="reset-pin-btn" style="padding:0.15rem 0.25rem;font-size:0.6rem;border-radius:0 4px 4px 0;border-left:none;" onclick="moveSection(${i},1)">▶</button>`:''}</div>`).join('')}
      <button class="cat-tab" style="color:var(--success);border-color:var(--success);" onclick="addSection()">+ Section</button>
    </div>
    <div id="ed-body"></div>`;
  renderEdBody();
}

function renderEdBody(){
  const c=document.getElementById('ed-body');if(!c)return;
  const sec=getSection(edSec);if(!sec)return;
  const cats=sec.categories||[];if(edCat>=cats.length)edCat=0;
  const h=sec.hours;let schedHTML='<span style="color:var(--success);font-size:0.8rem;">Always available</span>';
  if(h&&h.schedules)schedHTML=h.schedules.map(s=>`<span style="font-size:0.78rem;color:var(--text-dim);background:var(--dark3);padding:0.2rem 0.5rem;border-radius:4px;border:1px solid var(--mid);">${s.days.map(d=>DAY_NAMES[d]).join(', ')} ${minsToTime(s.start)}–${minsToTime(s.end)}</span>`).join(' ');
  c.innerHTML=`
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">
      <strong style="color:var(--gold);font-size:0.9rem;">${sec.label}</strong>
      <button class="reset-pin-btn" onclick="renameSection()">Rename</button>
      <button class="reset-pin-btn" onclick="editSchedule()">⏰ Hours</button>
      <button class="del-user-btn" onclick="deleteSection()">✕</button>
    </div>
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;">${schedHTML}</div>
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;align-items:center;">
      ${cats.map((cat,i)=>`<div style="display:flex;align-items:center;">${i>0?`<button class="reset-pin-btn" style="padding:0.1rem 0.2rem;font-size:0.55rem;border-radius:3px 0 0 3px;border-right:none;" onclick="moveCat(${i},-1)">◀</button>`:''}
        <button class="cat-tab ${i===edCat?'active':''}" onclick="edCat=${i};edSub=0;renderEdBody();" style="border-radius:${i>0?'0':'6px'} ${i<cats.length-1?'0':'6px'} ${i<cats.length-1?'0':'6px'} ${i>0?'0':'6px'};">${cat.name}</button>
        ${i<cats.length-1?`<button class="reset-pin-btn" style="padding:0.1rem 0.2rem;font-size:0.55rem;border-radius:0 3px 3px 0;border-left:none;" onclick="moveCat(${i},1)">▶</button>`:''}</div>`).join('')}
      <button class="cat-tab" style="color:var(--success);border-color:var(--success);" onclick="addCat()">+ Cat</button>
    </div>
    <div id="ed-items"></div>`;
  renderEdItems();
}

function renderEdItems(){
  const c=document.getElementById('ed-items');if(!c)return;
  const cat=getCat(edSec,edCat);if(!cat){c.innerHTML='';return;}
  let html=`<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">
    <span style="font-size:0.82rem;color:var(--text-dim);">${cat.name}</span>
    <button class="reset-pin-btn" onclick="renameCat()">Rename</button>
    <button class="del-user-btn" onclick="deleteCat()">✕</button></div>`;

  if(cat.subcategories&&cat.subcategories.length){
    const subs=cat.subcategories;if(edSub>=subs.length)edSub=0;
    html+=`<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;align-items:center;">
      ${subs.map((s,i)=>`<div style="display:flex;align-items:center;">${i>0?`<button class="reset-pin-btn" style="padding:0.1rem 0.2rem;font-size:0.5rem;border-radius:3px 0 0 3px;border-right:none;" onclick="moveSubCat(${i},-1)">◀</button>`:''}
        <button class="cat-tab sub ${i===edSub?'active':''}" onclick="edSub=${i};renderEdItems();" style="border-radius:${i>0?'0':'6px'} ${i<subs.length-1?'0':'6px'} ${i<subs.length-1?'0':'6px'} ${i>0?'0':'6px'};">${s.name}</button>
        ${i<subs.length-1?`<button class="reset-pin-btn" style="padding:0.1rem 0.2rem;font-size:0.5rem;border-radius:0 3px 3px 0;border-left:none;" onclick="moveSubCat(${i},1)">▶</button>`:''}</div>`).join('')}
      <button class="cat-tab" style="color:var(--success);border-color:var(--success);font-size:0.75rem;" onclick="addSubCat()">+ Sub</button></div>`;
    if(subs[edSub]){
      html+=`<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.5rem;"><span style="font-size:0.78rem;color:var(--text-dim);">${subs[edSub].name}</span><button class="reset-pin-btn" style="font-size:0.72rem;" onclick="renameSubCat()">Rename</button><button class="del-user-btn" style="font-size:0.8rem;" onclick="deleteSubCat()">✕</button></div>`;
      html+=renderItemRows(subs[edSub].items||[],'sub');
    }
  } else {
    html+=`<div style="margin-bottom:0.5rem;"><button class="reset-pin-btn" onclick="convertToSubs()">Convert to subcategories</button></div>`;
    html+=renderItemRows(cat.items||[],'flat');
  }
  c.innerHTML=html;
}

function renderItemRows(items,mode){
  return items.map((item,i)=>`<div class="admin-user-row" style="flex-wrap:wrap;">
    <div style="display:flex;flex-direction:column;gap:0.15rem;flex-shrink:0;">
      <button class="reset-pin-btn" style="padding:0.1rem 0.3rem;font-size:0.65rem;${i===0?'visibility:hidden':''}" onclick="moveItem('${mode}',${i},-1)">▲</button>
      <button class="reset-pin-btn" style="padding:0.1rem 0.3rem;font-size:0.65rem;${i===items.length-1?'visibility:hidden':''}" onclick="moveItem('${mode}',${i},1)">▼</button>
    </div>
    <span class="u-name" style="flex:1;min-width:120px;">${item.name}</span>
    <span class="u-role" style="flex:2;min-width:80px;">${item.desc||'—'}</span>
    <span class="u-role">${[item.isFishChips?'🐟':'',item.isSteak?'🥩':'',item.isBurger?'🍔':'',item.mods||''].filter(Boolean).join(' ')}</span>
    <button class="reset-pin-btn" onclick="editItemEd('${mode}',${i})">Edit</button>
    <button class="del-user-btn" onclick="deleteItemEd('${mode}',${i})">✕</button>
  </div>`).join('')+`<div style="margin-top:0.5rem;"><button class="btn-primary" onclick="addItemEd('${mode}')" style="padding:0.45rem 0.85rem;font-size:0.82rem;">+ Add Item</button></div>`;
}

function getItemsRef(mode){
  const m=getEditMenu();
  if(mode==='sub')return{menu:m,items:m.sections[edSec].categories[edCat].subcategories[edSub].items};
  return{menu:m,items:m.sections[edSec].categories[edCat].items};
}

// ─── EDITOR ACTIONS ──────────────────────────────────────────
async function sav(m){await saveMenuToFirebase(m);firebaseMenuData=m;renderMenuEditor();}

async function moveSection(i,dir){const m=getEditMenu(),a=m.sections,j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];if(edSec===i)edSec=j;else if(edSec===j)edSec=i;await sav(m);}
async function moveCat(i,dir){const m=getEditMenu(),a=m.sections[edSec].categories,j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];if(edCat===i)edCat=j;else if(edCat===j)edCat=i;await sav(m);}
async function moveSubCat(i,dir){const m=getEditMenu(),a=m.sections[edSec].categories[edCat].subcategories,j=i+dir;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];if(edSub===i)edSub=j;else if(edSub===j)edSub=i;await sav(m);}
async function moveItem(mode,i,dir){const{menu,items}=getItemsRef(mode);const j=i+dir;if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];await sav(menu);}

function addSection(){openModal(`<h3>Add Section</h3><span class="modal-label">Key</span><input class="modal-input" id="ns-key" placeholder="lowercase"><span class="modal-label">Label</span><input class="modal-input" id="ns-label" placeholder="Display name"><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmAddSection()">Add</button></div>`);}
async function confirmAddSection(){const key=document.getElementById('ns-key')?.value?.trim().toLowerCase().replace(/\s+/g,'_'),label=document.getElementById('ns-label')?.value?.trim();if(!key||!label)return toast('Fill both fields');const m=getEditMenu();m.sections.push({key,label,hours:null,categories:[]});edSec=m.sections.length-1;await sav(m);closeModal();toast(`Added: ${label}`);}
function renameSection(){const sec=getSection(edSec);openModal(`<h3>Rename</h3><input class="modal-input" id="rs-input" value="${sec?.label||''}"><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmRenameSection()">Save</button></div>`);}
async function confirmRenameSection(){const v=document.getElementById('rs-input')?.value?.trim();if(!v)return;const m=getEditMenu();m.sections[edSec].label=v;await sav(m);closeModal();}
async function deleteSection(){const m=getEditMenu();m.sections.splice(edSec,1);edSec=0;edCat=0;await sav(m);toast('Deleted');}

function addCat(){openModal(`<h3>Add Category</h3><input class="modal-input" id="nc-name" placeholder="Name"><span class="modal-label">Type</span><div class="modal-options"><button class="opt-btn selected" data-group="ctype" data-val="flat" onclick="selectOpt(this)">Flat</button><button class="opt-btn" data-group="ctype" data-val="nested" onclick="selectOpt(this)">Nested (sub-cats)</button></div><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmAddCat()">Add</button></div>`);}
async function confirmAddCat(){const name=document.getElementById('nc-name')?.value?.trim();if(!name)return toast('Enter name');const nested=document.querySelector('.opt-btn.selected[data-group="ctype"]')?.dataset.val==='nested';const m=getEditMenu();m.sections[edSec].categories.push(nested?{name,subcategories:[]}:{name,items:[]});edCat=m.sections[edSec].categories.length-1;await sav(m);closeModal();}
function renameCat(){const cat=getCat(edSec,edCat);openModal(`<h3>Rename</h3><input class="modal-input" id="rc-input" value="${cat?.name||''}"><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmRenameCat()">Save</button></div>`);}
async function confirmRenameCat(){const v=document.getElementById('rc-input')?.value?.trim();if(!v)return;const m=getEditMenu();m.sections[edSec].categories[edCat].name=v;await sav(m);closeModal();}
async function deleteCat(){const m=getEditMenu();m.sections[edSec].categories.splice(edCat,1);edCat=0;await sav(m);toast('Deleted');}

function addSubCat(){openModal(`<h3>Add Sub-Category</h3><input class="modal-input" id="nsc-name" placeholder="Name"><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmAddSubCat()">Add</button></div>`);}
async function confirmAddSubCat(){const name=document.getElementById('nsc-name')?.value?.trim();if(!name)return toast('Enter name');const m=getEditMenu();m.sections[edSec].categories[edCat].subcategories.push({name,items:[]});edSub=m.sections[edSec].categories[edCat].subcategories.length-1;await sav(m);closeModal();}
function renameSubCat(){const sub=getCat(edSec,edCat)?.subcategories?.[edSub];openModal(`<h3>Rename</h3><input class="modal-input" id="rsc-input" value="${sub?.name||''}"><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmRenameSubCat()">Save</button></div>`);}
async function confirmRenameSubCat(){const v=document.getElementById('rsc-input')?.value?.trim();if(!v)return;const m=getEditMenu();m.sections[edSec].categories[edCat].subcategories[edSub].name=v;await sav(m);closeModal();}
async function deleteSubCat(){const m=getEditMenu();m.sections[edSec].categories[edCat].subcategories.splice(edSub,1);edSub=0;await sav(m);toast('Deleted');}
async function convertToSubs(){const m=getEditMenu();const cat=m.sections[edSec].categories[edCat];const existing=cat.items||[];cat.subcategories=[{name:'Default',items:existing}];delete cat.items;edSub=0;await sav(m);}

function addItemEd(mode){openModal(`<h3>Add Item</h3><span class="modal-label">Name</span><input class="modal-input" id="ei-name"><span class="modal-label">Description</span><input class="modal-input" id="ei-desc"><span class="modal-label">Modifier type</span><input class="modal-input" id="ei-mods" placeholder="e.g. spirit, draught, flavour, scoops..."><span class="modal-label">Flavours (comma separated)</span><input class="modal-input" id="ei-flavours" placeholder="e.g. Vanilla, Strawberry"><span class="modal-label">Flags</span><div class="modal-options"><button class="opt-btn" data-group="flag" data-val="isFishChips" onclick="toggleFlag(this)">🐟</button><button class="opt-btn" data-group="flag" data-val="isSteak" onclick="toggleFlag(this)">🥩</button><button class="opt-btn" data-group="flag" data-val="isBurger" onclick="toggleFlag(this)">🍔</button></div><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmAddItemEd('${mode}')">Add</button></div>`);}
async function confirmAddItemEd(mode){const name=document.getElementById('ei-name')?.value?.trim();if(!name)return toast('Enter name');const desc=document.getElementById('ei-desc')?.value?.trim()||'';const mods=document.getElementById('ei-mods')?.value?.trim()||undefined;const flRaw=document.getElementById('ei-flavours')?.value?.trim();const flavours=flRaw?flRaw.split(',').map(s=>s.trim()).filter(Boolean):undefined;const flags={};document.querySelectorAll('.opt-btn.selected[data-group="flag"]').forEach(b=>{flags[b.dataset.val]=true;});const{menu,items}=getItemsRef(mode);const item={id:Date.now().toString(),name,desc};if(mods)item.mods=mods;if(flavours&&flavours.length)item.flavours=flavours;if(flags.isFishChips)item.isFishChips=true;if(flags.isSteak)item.isSteak=true;if(flags.isBurger)item.isBurger=true;items.push(item);await sav(menu);closeModal();}

function editItemEd(mode,i){const{items}=getItemsRef(mode);const item=items[i];if(!item)return;openModal(`<h3>Edit Item</h3><span class="modal-label">Name</span><input class="modal-input" id="ei-name" value="${item.name}"><span class="modal-label">Description</span><input class="modal-input" id="ei-desc" value="${item.desc||''}"><span class="modal-label">Modifier type</span><input class="modal-input" id="ei-mods" value="${item.mods||''}"><span class="modal-label">Flavours (comma separated)</span><input class="modal-input" id="ei-flavours" value="${(item.flavours||[]).join(', ')}"><span class="modal-label">Flags</span><div class="modal-options"><button class="opt-btn ${item.isFishChips?'selected':''}" data-group="flag" data-val="isFishChips" onclick="toggleFlag(this)">🐟</button><button class="opt-btn ${item.isSteak?'selected':''}" data-group="flag" data-val="isSteak" onclick="toggleFlag(this)">🥩</button><button class="opt-btn ${item.isBurger?'selected':''}" data-group="flag" data-val="isBurger" onclick="toggleFlag(this)">🍔</button></div><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-primary" onclick="confirmEditItemEd('${mode}',${i})">Save</button></div>`);}
async function confirmEditItemEd(mode,i){const name=document.getElementById('ei-name')?.value?.trim();if(!name)return toast('Enter name');const{menu,items}=getItemsRef(mode);const item=items[i];item.name=name;item.desc=document.getElementById('ei-desc')?.value?.trim()||'';const mods=document.getElementById('ei-mods')?.value?.trim();item.mods=mods||undefined;const flRaw=document.getElementById('ei-flavours')?.value?.trim();item.flavours=flRaw?flRaw.split(',').map(s=>s.trim()).filter(Boolean):undefined;const flags={};document.querySelectorAll('.opt-btn.selected[data-group="flag"]').forEach(b=>{flags[b.dataset.val]=true;});item.isFishChips=!!flags.isFishChips;item.isSteak=!!flags.isSteak;item.isBurger=!!flags.isBurger;await sav(menu);closeModal();}
async function deleteItemEd(mode,i){const{menu,items}=getItemsRef(mode);items.splice(i,1);await sav(menu);}

// ─── SCHEDULE EDITOR ─────────────────────────────────────────
function editSchedule(){const sec=getSection(edSec);const h=sec?.hours;const scheds=h?.schedules||[];let rows=scheds.map((s,i)=>`<div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;" class="sched-row">${DAY_NAMES.map((d,di)=>`<label style="font-size:0.75rem;cursor:pointer;padding:0.2rem 0.35rem;border-radius:4px;border:1px solid var(--mid);background:${s.days.includes(di)?'rgba(200,151,58,0.2)':'var(--dark3)'};color:${s.days.includes(di)?'var(--gold)':'var(--text-dim)'};" onclick="this.dataset.on=this.dataset.on==='1'?'0':'1';this.style.background=this.dataset.on==='1'?'rgba(200,151,58,0.2)':'var(--dark3)';this.style.color=this.dataset.on==='1'?'var(--gold)':'var(--text-dim)';" data-day="${di}" data-on="${s.days.includes(di)?'1':'0'}">${d}</label>`).join('')}<input type="time" class="modal-input sched-start" value="${minsToTime(s.start)}" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;"><span style="color:var(--text-dim);">–</span><input type="time" class="modal-input sched-end" value="${minsToTime(s.end)}" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;"><button class="del-user-btn" onclick="this.closest('.sched-row').remove()">✕</button></div>`).join('');
openModal(`<h3>Hours — ${sec?.label}</h3><p>Leave empty for always available.</p><div id="sched-rows">${rows}</div><button class="reset-pin-btn" onclick="addSchedRow()" style="margin:0.5rem 0;">+ Time Slot</button><div class="modal-actions"><button class="btn-secondary" onclick="closeModal()">Cancel</button><button class="btn-secondary" onclick="confirmSchedule(true)">Always</button><button class="btn-primary" onclick="confirmSchedule(false)">Save</button></div>`);}
function addSchedRow(){const c=document.getElementById('sched-rows');if(!c)return;const d=document.createElement('div');d.style.cssText='display:flex;gap:0.4rem;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;';d.className='sched-row';d.innerHTML=DAY_NAMES.map((dn,di)=>`<label style="font-size:0.75rem;cursor:pointer;padding:0.2rem 0.35rem;border-radius:4px;border:1px solid var(--mid);background:var(--dark3);color:var(--text-dim);" onclick="this.dataset.on=this.dataset.on==='1'?'0':'1';this.style.background=this.dataset.on==='1'?'rgba(200,151,58,0.2)':'var(--dark3)';this.style.color=this.dataset.on==='1'?'var(--gold)':'var(--text-dim)';" data-day="${di}" data-on="0">${dn}</label>`).join('')+`<input type="time" class="modal-input sched-start" value="12:00" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;"><span style="color:var(--text-dim);">–</span><input type="time" class="modal-input sched-end" value="22:00" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;"><button class="del-user-btn" onclick="this.closest('.sched-row').remove()">✕</button>`;c.appendChild(d);}
async function confirmSchedule(always){const m=getEditMenu();if(always){m.sections[edSec].hours=null;}else{const rows=document.querySelectorAll('.sched-row');const schedules=[];rows.forEach(row=>{const days=[];row.querySelectorAll('[data-day]').forEach(l=>{if(l.dataset.on==='1')days.push(parseInt(l.dataset.day));});const start=timeToMins(row.querySelector('.sched-start')?.value||'12:00'),end=timeToMins(row.querySelector('.sched-end')?.value||'22:00');if(days.length)schedules.push({days,start,end});});m.sections[edSec].hours=schedules.length?{schedules}:null;}await sav(m);closeModal();toast('Hours updated');}

// ─── MIGRATION ───────────────────────────────────────────────
async function migrateOldData(){const s=document.getElementById('migrate-status');if(s)s.textContent='Migrating...';try{let mu=0,mt=0;const us=await db.collection('users').get();if(!us.empty){const o={};us.forEach(d=>{o[d.id]=d.data();});await db.collection('_data').doc('users').set(o,{merge:true});mu=us.size;}const ts=await db.collection('tables').get();if(!ts.empty){const o={};ts.forEach(d=>{o[d.id]=d.data();});await db.collection('_data').doc('tables').set(o,{merge:true});mt=ts.size;}if(s)s.innerHTML=`<span style="color:var(--success)">✓</span> ${mu} users, ${mt} tables`;}catch(e){if(s)s.innerHTML=`<span style="color:var(--danger)">⚠</span> ${e.message}`;}}

document.addEventListener('DOMContentLoaded',()=>{if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});checkRoute();});
