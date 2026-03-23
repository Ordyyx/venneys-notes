// ─── FIREBASE SETUP ─────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzyWV43V_tjlJAV_NyYCJ2Cxy_Zq7pZoQ",
  authDomain: "venneys.firebaseapp.com",
  projectId: "venneys",
  storageBucket: "venneys.firebasestorage.app",
  messagingSenderId: "574978601696",
  appId: "1:574978601696:web:1a2f89cd195d1bf4ffd685"
};

function isConfigured() {
  return !FIREBASE_CONFIG.apiKey.includes('YOUR_');
}

// ─── APP STATE ───────────────────────────────────────────────
let db;
let currentUser = null;
let currentTableId = null;
let currentMenuTab = null;
let currentCategoryTab = null;
let tableData = {};
let usersData = {};
let selectedUserId = null;
let pinBuffer = '';
let liveMenuData = null;
let menuLoadState = 'idle';

// ─── FIREBASE INIT ───────────────────────────────────────────
function initFirebase() {
  if (!isConfigured()) {
    showConfigError();
    return;
  }
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
  loadUsers();
  listenToTables();
  loadLiveMenu();
}

function showConfigError() {
  const el = document.getElementById('user-select-list');
  if (el) el.innerHTML = `
    <div style="color:#ef9a9a;font-size:0.85rem;line-height:1.7;padding:0.5rem 0;">
      <strong style="color:var(--danger);font-size:1rem;">⚠ Firebase not configured</strong><br>
      Open <code style="background:var(--dark3);padding:0.1rem 0.3rem;border-radius:3px;">app.js</code>
      and replace the placeholder values at the top with your actual Firebase config.<br><br>
      Find them at:<br>
      <strong>Firebase Console → Project Settings → Your Apps</strong>
    </div>`;
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
    if (doc.exists) {
      usersData = {};
      const raw = doc.data();
      Object.keys(raw).forEach(uid => { usersData[uid] = { id: uid, ...raw[uid] }; });
    } else {
      usersData = {};
    }
    renderUserList();
    if (showScreen.current === 'vault') renderVault();
  }, err => {
    console.error('Firestore error:', err);
    const el = document.getElementById('user-select-list');
    if (el) el.innerHTML = `
      <div style="color:#ef9a9a;font-size:0.82rem;line-height:1.6;padding:0.5rem 0;">
        <strong style="color:var(--danger);">⚠ Database error</strong><br>
        ${err.code === 'permission-denied'
          ? 'Firestore rules are blocking reads. Go to Firebase Console → Firestore → Rules and publish the open rules from the README.'
          : 'Could not connect to Firebase. Check your config values in app.js are correct.<br><br>Error: ' + err.message}
      </div>`;
  });
}

// ─── SINGLE-DOC WRITE HELPERS ────────────────────────────────
// All table data lives in _data/tables, all user data in _data/users.
// Each write updates only the relevant key using merge.

async function saveTable(tId, data) {
  await db.collection('_data').doc('tables').set({ [tId]: data }, { merge: true });
}

async function saveAllTables(allData) {
  await db.collection('_data').doc('tables').set(allData);
}

function userForSave(uid) {
  const u = { ...usersData[uid] };
  delete u.id; // id is derived from the key, don't store it
  return u;
}

async function saveUser(uid, data) {
  await db.collection('_data').doc('users').set({ [uid]: data }, { merge: true });
}

async function deleteUser(uid) {
  await db.collection('_data').doc('users').update({
    [uid]: firebase.firestore.FieldValue.delete()
  });
}
const MENU_URL = 'https://www.venneysatthegranby.co.uk/menus/';
const CORS_PROXY = 'https://corsproxy.io/?';
const MENU_CACHE_TTL = 30 * 60 * 1000;

async function loadLiveMenu() {
  try {
    const cached = await db.collection('_config').doc('menu_cache').get();
    if (cached.exists) {
      const d = cached.data();
      if (d.timestamp && (Date.now() - d.timestamp) < MENU_CACHE_TTL && d.menu) {
        liveMenuData = d.menu;
        menuLoadState = 'loaded';
        console.log('[Menu] Loaded from Firestore cache');
        return;
      }
    }
  } catch(e) { /* non-fatal */ }

  menuLoadState = 'loading';
  try {
    const resp = await fetch(CORS_PROXY + encodeURIComponent(MENU_URL));
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const html = await resp.text();
    const parsed = parseMenuHTML(html);
    if (parsed) {
      liveMenuData = parsed;
      menuLoadState = 'loaded';
      try {
        await db.collection('_config').doc('menu_cache').set({
          menu: parsed, timestamp: Date.now(), url: MENU_URL
        });
      } catch(e) { /* non-fatal */ }
      console.log('[Menu] Scraped and cached from live site');
    } else {
      throw new Error('Parse returned null');
    }
  } catch(e) {
    console.warn('[Menu] Fetch failed, using bundled data:', e.message);
    menuLoadState = 'failed';
    liveMenuData = null;
  }
}

function getMenuData() {
  return (menuLoadState === 'loaded' && liveMenuData) ? liveMenuData : MENU_DATA;
}

function parseMenuHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const MENU_KEY_MAP = {
    'breakfast menu': 'breakfast',
    'lunch menu': 'lunch',
    'evening menu': 'evening',
    'dessert menu': 'dessert',
    "children's menu": 'children',
    'sunday menu': 'sunday',
  };

  const result = {};
  let currentMenuKey = null;
  let currentCat = null;
  let idCounter = 0;
  const uid = prefix => `${prefix}_${++idCounter}`;

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();

  while (node) {
    const tag = node.tagName?.toLowerCase();

    if (tag === 'h2') {
      const text = node.textContent.trim().toLowerCase();
      const key = MENU_KEY_MAP[text];
      if (key) {
        currentMenuKey = key;
        currentCat = null;
        if (!result[key]) {
          result[key] = {
            label: MENU_DATA[key]?.label || key,
            hours: MENU_DATA[key]?.hours ?? null,
            categories: {}
          };
        }
      }
    }

    if (tag === 'h3' && currentMenuKey) {
      const raw = node.textContent.trim();
      const stripped = raw.replace(/^(breakfast|lunch|evening|sunday|dessert|children['s]*)\s*/i, '').replace(/\s*menu$/i, '').trim();
      currentCat = stripped || raw;
      if (!result[currentMenuKey].categories[currentCat]) {
        result[currentMenuKey].categories[currentCat] = [];
      }
    }

    if (currentMenuKey && currentCat) {
      const isItem = node.classList?.contains('menu-item') ||
                     node.classList?.contains('pricelisto-menu-item') ||
                     (tag === 'tr' && node.closest?.('table'));
      if (isItem) {
        const nameEl = node.querySelector('strong, .menu-item-title, h4, td:first-child');
        const descEl = node.querySelector('p, .menu-item-desc, td:nth-child(2)');
        const name = nameEl?.textContent?.trim();
        const desc = descEl?.textContent?.trim() || '';
        if (name && name.length > 2) {
          result[currentMenuKey].categories[currentCat].push({
            id: uid(currentMenuKey.slice(0,2)),
            name, desc,
            isFishChips: /haddock|scampi|fish platter|goujons/i.test(name),
            isSteak: /steak$/i.test(name) && !/sauce|pie/i.test(name),
            isBurger: /burger/i.test(name)
          });
        }
      }
    }

    node = walker.nextNode();
  }

  const totalItems = Object.values(result).reduce((sum, menu) =>
    sum + Object.values(menu.categories).reduce((s, items) => s + items.length, 0), 0);

  if (totalItems < 20) {
    console.warn('[Menu] Parse found only', totalItems, 'items — falling back to bundled data');
    return null;
  }

  Object.keys(result).forEach(k => {
    Object.keys(result[k].categories).forEach(cat => {
      if (!result[k].categories[cat].length) delete result[k].categories[cat];
    });
    if (!Object.keys(result[k].categories).length) delete result[k];
  });

  return Object.keys(result).length >= 3 ? result : null;
}

async function forceRefreshMenu() {
  try { await db.collection('_config').doc('menu_cache').delete(); } catch(e) {}
  menuLoadState = 'idle';
  liveMenuData = null;
  toast('Refreshing menu from website...');
  await loadLiveMenu();
  toast(menuLoadState === 'loaded' ? '✓ Menu refreshed from live site' : '⚠ Refresh failed — using bundled data');
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
  const el = document.getElementById('user-select-list');
  if (!el) return;
  el.innerHTML = '';
  const users = Object.values(usersData).sort((a,b) => a.name.localeCompare(b.name));
  if (!users.length) {
    el.innerHTML = '<div style="color:var(--text-dim);font-size:0.9rem;text-align:center;padding:1.5rem;grid-column:1/-1;">No users found.<br>Visit <strong style="color:var(--gold)">/vault</strong> to add users.</div>';
    return;
  }
  users.forEach(u => {
    const btn = document.createElement('button');
    btn.className = 'user-btn';
    btn.textContent = u.name;
    btn.dataset.id = u.id;
    btn.onclick = () => selectUser(u.id, btn);
    el.appendChild(btn);
  });
}

function selectUser(uid, btn) {
  selectedUserId = uid;
  pinBuffer = '';
  document.querySelectorAll('.user-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  // Show floating pin overlay
  const user = usersData[uid];
  document.getElementById('pin-popup-user').textContent = user?.name || '';
  document.getElementById('pin-overlay').classList.add('show');
  updatePinDots();
}

function closePinOverlay() {
  document.getElementById('pin-overlay').classList.remove('show');
  selectedUserId = null;
  pinBuffer = '';
  document.querySelectorAll('.user-btn').forEach(b => b.classList.remove('selected'));
}

function updatePinDots() {
  document.querySelectorAll('.pin-dot').forEach((d, i) => {
    d.classList.toggle('filled', i < pinBuffer.length);
  });
}

function pinPress(val) {
  if (!selectedUserId) return;
  if (val === 'del') { pinBuffer = pinBuffer.slice(0, -1); }
  else if (pinBuffer.length < 4) { pinBuffer += val; }
  updatePinDots();
  if (pinBuffer.length === 4) setTimeout(attemptLogin, 150);
}

function attemptLogin() {
  const user = usersData[selectedUserId];
  if (!user) return;
  if (pinBuffer === (user.pin || '1234')) {
    currentUser = { ...user };
    closePinOverlay();
    goTo('tables');
    renderTables();
    toast(`Welcome, ${currentUser.name}!`);
  } else {
    pinBuffer = '';
    updatePinDots();
    toast('Incorrect PIN — try again');
  }
}

function logout() {
  currentUser = null; selectedUserId = null; pinBuffer = '';
  closePinOverlay();
  goTo('login');
}

function showPinChange() {
  openModal(`
    <h3>Change PIN</h3>
    <p>New 4-digit PIN for <strong style="color:var(--gold)">${currentUser.name}</strong></p>
    <span class="modal-label">New PIN</span>
    <input class="modal-input" id="new-pin" type="password" inputmode="numeric" maxlength="4" placeholder="4 digits">
    <span class="modal-label">Confirm PIN</span>
    <input class="modal-input" id="confirm-pin" type="password" inputmode="numeric" maxlength="4" placeholder="Confirm">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="savePinChange()">Save PIN</button>
    </div>
  `);
}

async function savePinChange() {
  const p1 = document.getElementById('new-pin').value;
  const p2 = document.getElementById('confirm-pin').value;
  if (!/^\d{4}$/.test(p1)) return toast('PIN must be 4 digits');
  if (p1 !== p2) return toast('PINs do not match');
  const userData = userForSave(currentUser.id);
  userData.pin = p1;
  await saveUser(currentUser.id, userData);
  currentUser.pin = p1;
  closeModal();
  toast('PIN updated!');
}

// ─── TABLES GRID ─────────────────────────────────────────────
function renderTables() {
  const el = document.getElementById('tables-grid');
  if (!el) return;
  el.innerHTML = '';
  if (currentUser) {
    const un = document.getElementById('header-user-name');
    if (un) un.textContent = currentUser.name;
  }
  TABLES.forEach(t => {
    const tData = tableData[String(t.id)] || { open: false, orders: [], allergens: [] };
    const tile = document.createElement('div');
    tile.className = 'table-tile ' + (tData.open ? 'open' : 'closed');
    const orders = tData.orders || [];
    // Count total individual items across all order groups
    let count = 0;
    orders.forEach(o => {
      if (o.items && Array.isArray(o.items)) count += o.items.length;
      else count += 1; // legacy single-item order
    });
    const hasAllergens = (tData.allergens||[]).length > 0 || tData.otherAllergen;
    tile.innerHTML = `
      <span class="t-number">${t.label.replace('Table ','')}</span>
      <span class="t-word">Table</span>
      ${count > 0
        ? `<span class="t-count">${count} item${count>1?'s':''}</span>`
        : '<span class="t-count t-empty">Empty</span>'}
      ${tData.open && hasAllergens ? '<div class="allergen-dot">!</div>' : ''}
    `;
    tile.onclick = () => openTable(t.id);
    el.appendChild(tile);
  });
}

// ─── TABLE OPEN / ALLERGENS ───────────────────────────────────
function openTable(tableId) {
  currentTableId = String(tableId);
  const tData = tableData[currentTableId] || {};
  if (!tData.open) showAllergenModal(tableId, true);
  else { goTo('table'); renderTableDetail(currentTableId); }
}

function showAllergenModal(tableId, isOpening = false) {
  const tId = String(tableId);
  const tData = tableData[tId] || { allergens: [], otherAllergen: '' };
  const tableLabel = TABLES.find(t => t.id == tableId)?.label || `Table ${tableId}`;
  const checked = tData.allergens || [];
  openModal(`
    <h3>${isOpening ? `Open ${tableLabel}` : `Allergens — ${tableLabel}`}</h3>
    <p>Does anyone in this party have any of the 14 allergens?</p>
    <div class="allergen-grid">
      ${ALLERGENS.map(a => `
        <label class="allergen-check ${checked.includes(a)?'checked':''}" data-allergen="${a}" onclick="toggleAllergenCheck(this)">
          <div class="check-mark"></div>
          <span class="check-label">${a}</span>
        </label>`).join('')}
    </div>
    <span class="modal-label">Other allergies / notes</span>
    <input class="modal-input" id="other-allergen" placeholder="e.g. latex, kiwi..." value="${tData.otherAllergen||''}">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="saveAllergens('${tId}',${isOpening},true)">Skip</button>
      <button class="btn-primary" onclick="saveAllergens('${tId}',${isOpening},false)">${isOpening?'Open Table':'Save'}</button>
    </div>
  `);
}

function toggleAllergenCheck(el) { el.classList.toggle('checked'); }

async function saveAllergens(tId, isOpening, skip) {
  const allergens = skip ? [] : Array.from(document.querySelectorAll('.allergen-check.checked')).map(el => el.dataset.allergen);
  const otherAllergen = skip ? '' : (document.getElementById('other-allergen')?.value || '');
  const existing = tableData[tId] || {};
  await saveTable(tId, {
    ...existing, open: true, allergens, otherAllergen,
    openedAt: existing.openedAt || new Date().toISOString(),
    orders: existing.orders || []
  });
  closeModal();
  currentTableId = tId;
  goTo('table');
  renderTableDetail(tId);
}

async function closeTable(tableId) {
  openModal(`
    <h3>Close Table?</h3>
    <p>This will clear all orders for this table. Are you sure?</p>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-danger" onclick="confirmCloseTable('${tableId}')">Close Table</button>
    </div>
  `);
}

async function confirmCloseTable(tableId) {
  await saveTable(String(tableId), { open:false, orders:[], allergens:[], otherAllergen:'' });
  closeModal(); goTo('tables'); toast('Table closed');
}

function showCloseAll() {
  openModal(`
    <h3>Close All Tables?</h3>
    <p>Closes all open tables and clears their orders. Cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-danger" onclick="confirmCloseAll()">Close All</button>
    </div>
  `);
}

async function confirmCloseAll() {
  const update = {};
  Object.keys(tableData).forEach(tId => {
    if (tableData[tId].open)
      update[tId] = { open:false, orders:[], allergens:[], otherAllergen:'' };
  });
  if (Object.keys(update).length) {
    await db.collection('_data').doc('tables').set(update, { merge: true });
  }
  closeModal(); toast('All tables closed');
}

// ─── TABLE DETAIL ─────────────────────────────────────────────
function renderTableDetail(tId) {
  const tData = tableData[tId] || {};
  const tableLabel = TABLES.find(t => t.id == tId)?.label || `Table ${tId}`;
  document.getElementById('table-detail-title').textContent = tableLabel;
  const allergenBadge = document.getElementById('allergen-badge');
  const hasAllergens = (tData.allergens||[]).length > 0 || tData.otherAllergen;
  allergenBadge.style.display = hasAllergens ? 'inline-flex' : 'none';
  renderOrders(tId);
}

// ─── TIME-BASED MENU AVAILABILITY ────────────────────────────
function getActiveMenus() {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours()*60 + now.getMinutes();
  const active = ['dessert','children'];
  if ([0,6].includes(day) && mins >= 9*60 && mins <= 11*60+30) active.push('breakfast');
  if (day>=1 && day<=6 && mins>=12*60 && mins<16*60) active.push('lunch');
  if (day>=1 && day<=6 && mins>=16*60) {
    const last = [5,6].includes(day) ? 20*60+15 : 19*60+45;
    if (mins<=last) active.push('evening');
  }
  if (day===0 && mins>=12*60 && mins<=18*60+15) active.push('sunday');
  return active;
}

// ─── ADD ORDER MODAL ──────────────────────────────────────────
// Split-panel layout: menu on left, pending items on right.
// Sub-modals overlay on top without destroying the main order modal.

let pendingOrderItems = [];

function showAddOrderModal() {
  pendingOrderItems = [];
  const menuData = getMenuData();
  const activeMenus = getActiveMenus();
  const allKeys = ['breakfast','lunch','evening','sunday','dessert','children'];
  const visibleMenus = allKeys.filter(k => activeMenus.includes(k));
  const defaultTab = (currentMenuTab && visibleMenus.includes(currentMenuTab))
    ? currentMenuTab : (visibleMenus[0] || 'evening');

  // Use dedicated order modal (not the generic modal system)
  closeOrderModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay modal-overlay-large';
  overlay.id = 'order-modal-overlay';
  overlay.innerHTML = `<div class="modal modal-large">
    <div class="order-modal-layout">
      <div class="order-modal-header">
        <div class="quick-actions-bar">
          <button class="quick-btn drink-btn" onclick="showDrinkSubModal()">
            <span class="quick-icon">🍷</span> Add Drink
          </button>
          <button class="quick-btn misc-btn" onclick="showMiscSubModal()">
            <span class="quick-icon">✏️</span> Misc Item
          </button>
        </div>
        <button class="order-close-btn" onclick="closeOrderModal()">✕</button>
      </div>

      <div class="order-menu-tabs" id="order-menu-tabs">
        ${visibleMenus.map(k => `
          <button class="order-menu-tab ${k===defaultTab?'active':''}" data-key="${k}" onclick="switchOrderMenuTab('${k}')">
            ${menuData[k]?.label || k}
          </button>`).join('')}
      </div>

      <div class="order-split-body">
        <div class="order-menu-side">
          <div class="order-modal-body" id="order-modal-body"></div>
        </div>
        <div class="order-pending-side" id="order-pending-side">
          <div class="pending-side-header">
            <span class="pending-side-title">Your Order</span>
            <span class="pending-side-count" id="pending-count">0 items</span>
          </div>
          <div class="pending-side-list" id="pending-list">
            <div class="pending-empty">Tap menu items to add them</div>
          </div>
          <div class="pending-side-footer">
            <button class="btn-primary pending-done-btn" id="pending-done-btn" onclick="submitOrderBatch()" disabled>Done</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  overlay.onclick = e => { if (e.target === overlay) closeOrderModal(); };
  document.body.appendChild(overlay);

  currentMenuTab = defaultTab;
  currentCategoryTab = null;
  renderOrderModalBody(defaultTab);
}

function closeOrderModal() {
  document.getElementById('order-modal-overlay')?.remove();
  pendingOrderItems = [];
}

function renderPendingSide() {
  const list = document.getElementById('pending-list');
  const countEl = document.getElementById('pending-count');
  const doneBtn = document.getElementById('pending-done-btn');
  if (!list) return;

  const n = pendingOrderItems.length;
  if (countEl) countEl.textContent = `${n} item${n !== 1 ? 's' : ''}`;
  if (doneBtn) doneBtn.disabled = n === 0;

  if (n === 0) {
    list.innerHTML = '<div class="pending-empty">Tap menu items to add them</div>';
    return;
  }

  list.innerHTML = pendingOrderItems.map((item, i) => `
    <div class="pending-item" style="animation:pendingSlide 0.15s ease">
      <span class="pending-item-icon">${item.icon}</span>
      <div class="pending-item-body">
        <div class="pending-item-name">${item.name}</div>
        ${item.optSummary ? `<div class="pending-item-opts">${item.optSummary}</div>` : ''}
      </div>
      <button class="pending-item-remove" onclick="removePendingItem(${i})">✕</button>
    </div>
  `).join('');
  // Auto-scroll to bottom
  list.scrollTop = list.scrollHeight;
}

function removePendingItem(index) {
  pendingOrderItems.splice(index, 1);
  renderPendingSide();
}

async function submitOrderBatch() {
  if (pendingOrderItems.length === 0) return toast('Add some items first');
  const tId = currentTableId;
  const existing = tableData[tId] || { open:true, orders:[] };
  const now = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});

  const types = [...new Set(pendingOrderItems.map(i => i.type))];
  let groupType = 'food';
  if (types.length === 1) groupType = types[0];
  else if (types.includes('food')) groupType = 'food';

  const orderGroup = {
    id: 'grp_' + Date.now(),
    type: groupType,
    user: currentUser.name,
    time: now,
    items: pendingOrderItems.map(item => ({
      id: item.id, name: item.name, type: item.type,
      opts: item.opts || {}, extraNote: item.extraNote || '', icon: item.icon
    }))
  };

  const orders = [...(existing.orders||[]), orderGroup];
  await saveTable(tId, { ...existing, orders });
  toast(`Order added: ${pendingOrderItems.length} item${pendingOrderItems.length>1?'s':''}`);
  closeOrderModal();
}

function switchOrderMenuTab(key) {
  currentMenuTab = key;
  currentCategoryTab = null;
  document.querySelectorAll('.order-menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key===key));
  renderOrderModalBody(key);
}

function renderOrderModalBody(menuKey) {
  const menuData = getMenuData();
  const menu = menuData[menuKey];
  if (!menu) return;
  const cats = Object.keys(menu.categories);
  if (!cats.length) return;
  if (!currentCategoryTab || !cats.includes(currentCategoryTab)) currentCategoryTab = cats[0];

  const body = document.getElementById('order-modal-body');
  if (!body) return;

  body.innerHTML = `
    <div class="cat-tabs">
      ${cats.map(c => `
        <button class="cat-tab ${c===currentCategoryTab?'active':''}" data-cat="${c}"
          onclick="switchCategoryTab('${menuKey}','${encodeURIComponent(c)}')">
          ${c}
        </button>`).join('')}
    </div>
    <div class="cat-items" id="cat-items-list"></div>
  `;
  renderCategoryItems(menuKey, currentCategoryTab);
}

function switchCategoryTab(menuKey, catEncoded) {
  const cat = decodeURIComponent(catEncoded);
  currentCategoryTab = cat;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat===cat));
  renderCategoryItems(menuKey, cat);
}

function renderCategoryItems(menuKey, cat) {
  const menuData = getMenuData();
  const items = menuData[menuKey]?.categories[cat] || [];
  const el = document.getElementById('cat-items-list');
  if (!el) return;
  if (!items.length) { el.innerHTML = '<div class="empty-state">No items</div>'; return; }
  el.innerHTML = items.map(item => `
    <button class="menu-item-btn" onclick="addItem('${item.id}','${menuKey}')">
      <span class="item-name">${item.name}</span>
      ${item.desc ? `<span class="item-desc">${item.desc}</span>` : ''}
    </button>`).join('');
}

// ─── ADDING ITEMS ─────────────────────────────────────────────
function findMenuItem(menuKey, itemId) {
  const menuData = getMenuData();
  for (const items of Object.values(menuData[menuKey]?.categories || {})) {
    const found = items.find(i => i.id === itemId);
    if (found) return found;
  }
  return null;
}

function itemIsBurger(item) {
  return item.isBurger || /burger/i.test(item.name);
}

function itemHasCheese(item) {
  return itemIsBurger(item) && /(blue\s*cheese|monterey|jack)/i.test(item.desc || item.name);
}

function addItem(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  if (!item) return;
  // Items that need option selection get a sub-modal
  if (item.isFishChips) showFishChipsSubModal(item, menuKey);
  else if (item.isSteak) showSteakSubModal(item, menuKey);
  else if (itemHasCheese(item)) showBurgerCheeseSubModal(item, menuKey);
  else {
    // Simple items go straight into pending — no sub-modal needed
    addToPending(item, 'food', {}, '');
  }
}

// ─── SUB-MODAL SYSTEM ────────────────────────────────────────
// These overlay on TOP of the order modal, using a separate element

function openSubModal(html) {
  closeSubModal();
  const overlay = document.createElement('div');
  overlay.className = 'sub-modal-overlay';
  overlay.id = 'sub-modal-overlay';
  overlay.innerHTML = `<div class="sub-modal">${html}</div>`;
  overlay.onclick = e => { if (e.target === overlay) closeSubModal(); };
  document.body.appendChild(overlay);
}

function closeSubModal() {
  document.getElementById('sub-modal-overlay')?.remove();
}

function showFishChipsSubModal(item, menuKey) {
  openSubModal(`
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <span class="modal-label">Peas</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="peas" data-val="Mushy Peas" onclick="selectOpt(this)">Mushy Peas</button>
      <button class="opt-btn" data-group="peas" data-val="Garden Peas" onclick="selectOpt(this)">Garden Peas</button>
    </div>
    <span class="modal-label">Chips or Fries?</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="chips" data-val="Chips" onclick="selectOpt(this)">Chips</button>
      <button class="opt-btn" data-group="chips" data-val="Fries" onclick="selectOpt(this)">Fries</button>
    </div>
    <span class="modal-label">Tartar Sauce?</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="tartar" data-val="Tartar Sauce" onclick="selectOpt(this)">Tartar Sauce</button>
      <button class="opt-btn" data-group="tartar" data-val="No Tartar" onclick="selectOpt(this)">No Tartar</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmFishChipsPending('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function confirmFishChipsPending(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  const opts = {};
  ['peas','chips','tartar'].forEach(g => {
    const el = document.querySelector(`#sub-modal-overlay .opt-btn.selected[data-group="${g}"]`);
    if (el) opts[g] = el.dataset.val;
  });
  addToPending(item, 'food', opts, document.getElementById('item-extra-note')?.value || '');
}

function showSteakSubModal(item, menuKey) {
  const STEAK_TEMPS = ['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done'];
  openSubModal(`
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <span class="modal-label">How would they like it cooked?</span>
    <div class="modal-options">
      ${STEAK_TEMPS.map(t => `<button class="opt-btn" data-group="temp" data-val="${t}" onclick="selectOpt(this)">${t}</button>`).join('')}
    </div>
    <span class="modal-label">Steak Sauce</span>
    <div class="modal-options">
      ${STEAK_SAUCES.map(s => `<button class="opt-btn" data-group="sauce" data-val="${s}" onclick="selectOpt(this)">${s}</button>`).join('')}
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any other requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmSteakPending('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function confirmSteakPending(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  const opts = {};
  const tempEl = document.querySelector('#sub-modal-overlay .opt-btn.selected[data-group="temp"]');
  const sauceEl = document.querySelector('#sub-modal-overlay .opt-btn.selected[data-group="sauce"]');
  if (tempEl) opts.temp = tempEl.dataset.val;
  if (sauceEl) opts.sauce = sauceEl.dataset.val;
  addToPending(item, 'food', opts, document.getElementById('item-extra-note')?.value || '');
}

function showBurgerCheeseSubModal(item, menuKey) {
  openSubModal(`
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <span class="modal-label">Cheese Choice</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="cheese" data-val="Monterey Jack" onclick="selectOpt(this)">Monterey Jack</button>
      <button class="opt-btn" data-group="cheese" data-val="Blue Cheese" onclick="selectOpt(this)">Blue Cheese</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmBurgerPending('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function confirmBurgerPending(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  const cheeseEl = document.querySelector('#sub-modal-overlay .opt-btn.selected[data-group="cheese"]');
  addToPending(item, 'food', cheeseEl ? { cheese: cheeseEl.dataset.val } : {}, document.getElementById('item-extra-note')?.value || '');
}

function addToPending(item, type, opts, extraNote) {
  const optSummary = Object.values(opts).join(' · ');
  pendingOrderItems.push({
    id: `${item.id}_${Date.now()}`,
    name: item.name, type, opts, extraNote, optSummary,
    icon: type === 'drink' ? '🍷' : type === 'misc' ? '✏️' : '🍽'
  });
  closeSubModal(); // Close sub-modal only, order modal stays open
  renderPendingSide();
  toast(`Added: ${item.name}`);
}

function selectOpt(btn) {
  const root = btn.closest('#sub-modal-overlay') || document;
  root.querySelectorAll(`.opt-btn[data-group="${btn.dataset.group}"]`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// ─── DRINK SUB-MODAL ─────────────────────────────────────────
function showDrinkSubModal() {
  openSubModal(`
    <h3>Add Drink</h3>
    <span class="modal-label">Drink name</span>
    <input class="modal-input" id="drink-name-input" placeholder="e.g. Coke, Peroni, Gin & Tonic...">
    <span class="modal-label">Size</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="size" data-val="Half Pint" onclick="selectOpt(this)">Half Pint</button>
      <button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button>
      <button class="opt-btn selected" data-group="size" data-val="Regular" onclick="selectOpt(this)">Regular</button>
      <button class="opt-btn" data-group="size" data-val="175ml" onclick="selectOpt(this)">175ml</button>
      <button class="opt-btn" data-group="size" data-val="250ml" onclick="selectOpt(this)">250ml</button>
    </div>
    <div class="toggle-row">
      <label class="toggle-switch">
        <input type="checkbox" id="drink-ice-toggle">
        <span class="toggle-slider"></span>
      </label>
      <span class="toggle-label">Ice</span>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="drink-note-input" placeholder="e.g. with lime, no lemon...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrink()">Add</button>
    </div>
  `);
  setTimeout(() => document.getElementById('drink-name-input')?.focus(), 100);
}

function confirmDrink() {
  const name = document.getElementById('drink-name-input')?.value?.trim();
  if (!name) return toast('Enter a drink name');
  const sizeEl = document.querySelector('#sub-modal-overlay .opt-btn.selected[data-group="size"]');
  const size = sizeEl?.dataset.val || 'Regular';
  const ice = document.getElementById('drink-ice-toggle')?.checked;
  const note = document.getElementById('drink-note-input')?.value?.trim() || '';
  const opts = { size };
  if (ice) opts.ice = 'With Ice';
  const optSummary = [size, ice ? 'Ice' : '', note].filter(Boolean).join(' · ');
  pendingOrderItems.push({
    id: 'drink_' + Date.now(),
    name, type: 'drink', opts, extraNote: note, optSummary, icon: '🍷'
  });
  closeSubModal();
  renderPendingSide();
  toast(`Added: ${name}`);
}

// ─── MISC SUB-MODAL ─────────────────────────────────────────
function showMiscSubModal() {
  openSubModal(`
    <h3>Miscellaneous Item</h3>
    <input class="modal-input" id="misc-name" placeholder="e.g. Extra bread, no onion...">
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="misc-note" placeholder="Any extra details...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmMisc()">Add</button>
    </div>
  `);
  setTimeout(() => document.getElementById('misc-name')?.focus(), 100);
}

function confirmMisc() {
  const name = document.getElementById('misc-name')?.value?.trim();
  if (!name) return toast('Please enter an item name');
  const note = document.getElementById('misc-note')?.value?.trim() || '';
  pendingOrderItems.push({
    id: 'misc_' + Date.now(),
    name, type: 'misc', opts: {}, extraNote: note, optSummary: note, icon: '✏️'
  });
  closeSubModal();
  renderPendingSide();
  toast(`Added: ${name}`);
}

// ─── EXTRA NOTE / DELETE ──────────────────────────────────────
function addExtraNote(groupId, itemIndex) {
  openModal(`
    <h3>Add Note</h3>
    <input class="modal-input" id="extra-note-input" placeholder="Extra note for this item...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveExtraNote('${groupId}',${itemIndex})">Save</button>
    </div>
  `);
  setTimeout(() => document.getElementById('extra-note-input')?.focus(), 100);
}

async function saveExtraNote(groupId, itemIndex) {
  const note = document.getElementById('extra-note-input')?.value?.trim();
  if (!note) return closeModal();
  const tId = currentTableId;
  const existing = tableData[tId] || {};
  const orders = (existing.orders||[]).map(o => {
    if (o.id === groupId && o.items && o.items[itemIndex] !== undefined) {
      const items = [...o.items];
      items[itemIndex] = { ...items[itemIndex], extraNote: items[itemIndex].extraNote ? items[itemIndex].extraNote + '; ' + note : note };
      return { ...o, items };
    }
    return o;
  });
  await saveTable(tId, { ...existing, orders });
  closeModal(); toast('Note added');
}

async function deleteOrderItem(groupId, itemIndex) {
  const tId = currentTableId;
  const existing = tableData[tId] || {};
  let orders = (existing.orders||[]).map(o => {
    if (o.id === groupId && o.items) {
      const items = o.items.filter((_, i) => i !== itemIndex);
      if (items.length === 0) return null; // Remove entire group
      return { ...o, items };
    }
    return o;
  }).filter(Boolean);
  await saveTable(tId, { ...existing, orders });
  toast('Item removed');
}

async function deleteOrderGroup(groupId) {
  const tId = currentTableId;
  const existing = tableData[tId] || {};
  const orders = (existing.orders||[]).filter(o => o.id !== groupId);
  await saveTable(tId, { ...existing, orders });
  toast('Order removed');
}

// ─── RENDER ORDERS ────────────────────────────────────────────
function renderOrders(tId) {
  const tData = tableData[tId] || {};
  const orders = tData.orders || [];

  const infoBar = document.getElementById('allergen-info-bar');
  const allergens = tData.allergens || [];
  const other = tData.otherAllergen || '';
  if (allergens.length || other) {
    infoBar.style.display = 'flex';
    infoBar.innerHTML = `<span>⚠ <strong>Allergens:</strong> ${[...allergens, other].filter(Boolean).join(', ')}</span>
      <button onclick="showAllergenModal(currentTableId,false)" style="background:none;border:1px solid rgba(255,193,7,0.5);color:#ffc107;font-size:0.7rem;padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;font-family:Lato,sans-serif;margin-left:auto;flex-shrink:0;">Edit</button>`;
  } else {
    infoBar.style.display = 'none';
  }

  const el = document.getElementById('order-cards');
  if (!el) return;

  if (!orders.length) {
    el.innerHTML = `<div class="empty-orders">
      <div class="empty-icon">🍽</div>
      <div class="empty-title">No orders yet</div>
      <div class="empty-sub">Tap Add Order to begin</div>
    </div>`;
    return;
  }

  el.innerHTML = orders.map(o => {
    // New grouped order format
    if (o.items && Array.isArray(o.items)) {
      const typeLabel = o.type === 'drink' ? 'Drinks' : o.type === 'misc' ? 'Misc' : 'Food';
      const typeClass = o.type === 'drink' ? 'drink' : o.type === 'misc' ? 'misc' : '';
      return `
        <div class="order-group">
          <div class="order-group-header">
            <span class="order-group-type ${typeClass}">${typeLabel}</span>
            <span class="order-group-user">${o.user}</span>
            <span class="order-group-time">${o.time}</span>
            <div class="order-group-actions">
              <button class="card-action-btn del" onclick="deleteOrderGroup('${o.id}')">Remove All</button>
            </div>
          </div>
          <div class="order-group-items">
            ${o.items.map((item, idx) => {
              const optLines = Object.values(item.opts||{}).join(' · ');
              const icon = item.type==='drink'?'🍷':item.type==='misc'?'✏️':'🍽';
              return `
                <div class="order-group-item">
                  <span class="ogi-icon">${icon}</span>
                  <div class="ogi-body">
                    <div class="ogi-name">${item.name}</div>
                    ${optLines ? `<div class="ogi-options">${optLines}</div>` : ''}
                    ${item.extraNote ? `<div class="ogi-note">📝 ${item.extraNote}</div>` : ''}
                  </div>
                  <div class="ogi-actions">
                    <button class="card-action-btn" onclick="addExtraNote('${o.id}',${idx})">+ Note</button>
                    <button class="card-action-btn del" onclick="deleteOrderItem('${o.id}',${idx})">✕</button>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }
    // Legacy single-item format (backward compat)
    const optLines = Object.values(o.opts||{}).join(' · ');
    const icon = o.type==='drink'?'🍷':o.type==='misc'?'✏️':'🍽';
    return `
      <div class="order-group">
        <div class="order-group-header">
          <span class="order-group-type ${o.type==='drink'?'drink':o.type==='misc'?'misc':''}">${o.type==='drink'?'Drink':o.type==='misc'?'Misc':'Food'}</span>
          <span class="order-group-user">${o.user}</span>
          <span class="order-group-time">${o.time}</span>
        </div>
        <div class="order-group-items">
          <div class="order-group-item">
            <span class="ogi-icon">${icon}</span>
            <div class="ogi-body">
              <div class="ogi-name">${o.name}</div>
              ${optLines ? `<div class="ogi-options">${optLines}</div>` : ''}
              ${o.extraNote ? `<div class="ogi-note">📝 ${o.extraNote}</div>` : ''}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ─── VAULT / ADMIN ─────────────────────────────────────────────
function renderVault() {
  const el = document.getElementById('vault-user-list');
  if (!el) return;
  const users = Object.values(usersData).sort((a,b) => a.name.localeCompare(b.name));
  el.innerHTML = users.length ? users.map(u => `
    <div class="admin-user-row">
      <span class="u-name">${u.name}</span>
      <span class="u-role">${u.role||'Staff'}</span>
      <button class="reset-pin-btn" onclick="adminResetPin('${u.id}')">Reset PIN</button>
      <button class="del-user-btn" onclick="adminDeleteUser('${u.id}')">✕</button>
    </div>`).join('') : '<div class="empty-state">No users yet</div>';
}

async function adminAddUser() {
  const name = document.getElementById('new-user-name')?.value?.trim();
  const role = document.getElementById('new-user-role')?.value?.trim() || 'Staff';
  if (!name) return toast('Enter a name');
  const uid = name.toLowerCase().replace(/\s+/g,'_')+'_'+Date.now();
  await saveUser(uid, { name, role, pin:'1234' });
  document.getElementById('new-user-name').value = '';
  document.getElementById('new-user-role').value = '';
  toast(`${name} added — PIN is 1234`);
}

async function adminResetPin(uid) {
  const userData = userForSave(uid);
  userData.pin = '1234';
  await saveUser(uid, userData);
  toast('PIN reset to 1234');
}

async function adminDeleteUser(uid) {
  const user = usersData[uid];
  openModal(`
    <h3>Delete User?</h3>
    <p>Remove <strong style="color:var(--gold)">${user?.name}</strong>? Cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-danger" onclick="confirmDeleteUser('${uid}')">Delete</button>
    </div>
  `);
}

async function confirmDeleteUser(uid) {
  await deleteUser(uid);
  closeModal(); toast('User deleted');
}

// ─── MODAL SYSTEM ─────────────────────────────────────────────
function openModal(html) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.onclick = e => { if (e.target===overlay) closeModal(); };
  document.body.appendChild(overlay);
}

function openLargeModal(html) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay modal-overlay-large';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal modal-large">${html}</div>`;
  overlay.onclick = e => { if (e.target===overlay) closeModal(); };
  document.body.appendChild(overlay);
}

function closeModal() {
  document.getElementById('modal-overlay')?.remove();
}

// ─── TOAST ────────────────────────────────────────────────────
let toastTimer;
function toast(msg) {
  document.querySelector('.toast')?.remove();
  clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  toastTimer = setTimeout(() => t.remove(), 2400);
}

// ─── ROUTING ──────────────────────────────────────────────────
function checkRoute() {
  const path = window.location.pathname;
  if (path.endsWith('/vault') || path.endsWith('/vault.html')) {
    initFirebase();
    renderVaultScreen();
    goTo('vault');
  } else {
    goTo('login');
    initFirebase();
  }
}

function renderVaultScreen() {
  document.getElementById('screen-vault').innerHTML = `
    <div class="app-header">
      <h2>⚙ VG Orders — Admin Vault</h2>
      <a href="/" style="color:var(--text-dim);font-size:0.85rem;text-decoration:none;margin-left:auto;">← Back to App</a>
    </div>
    <div class="vault-content">
      <div class="vault-section">
        <h3>Staff Members</h3>
        <div id="vault-user-list" class="user-list-admin"></div>
        <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;">
          <input class="modal-input" id="new-user-name" placeholder="Full name" style="flex:1;margin:0;">
          <input class="modal-input" id="new-user-role" placeholder="Role (e.g. Waiter)" style="flex:1;margin:0;">
          <button class="btn-primary" onclick="adminAddUser()" style="flex:none;padding:0.65rem 1.2rem;">Add User</button>
        </div>
        <p style="margin-top:0.6rem;font-size:0.8rem;color:var(--text-dim)">New users default to PIN 1234.</p>
      </div>
      <div class="vault-section">
        <h3>Live Menu</h3>
        <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.75rem;line-height:1.5">
          Menu data is automatically fetched from <strong style="color:var(--gold)">venneysatthegranby.co.uk</strong> and cached for 30 minutes.
          Any changes you make to the website menu will appear here within 30 minutes automatically.
          Use this button to force an immediate refresh.
        </p>
        <button class="btn-primary" onclick="forceRefreshMenu()" style="padding:0.65rem 1.2rem;">↻ Refresh Menu Now</button>
      </div>
      <div class="vault-section">
        <h3>Data Migration</h3>
        <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.75rem;line-height:1.5">
          If you're upgrading from the old version, use this button to migrate your existing users and table data to the new optimised format.
          This only needs to be done <strong style="color:var(--gold)">once</strong>. It's safe to run multiple times.
        </p>
        <button class="btn-primary" onclick="migrateOldData()" style="padding:0.65rem 1.2rem;">↻ Migrate Old Data</button>
        <div id="migrate-status" style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim);"></div>
      </div>
    </div>
  `;
  setTimeout(renderVault, 800);
}

// ─── DATA MIGRATION ──────────────────────────────────────────
// Migrates old collection-per-document format to single-doc format.
async function migrateOldData() {
  const statusEl = document.getElementById('migrate-status');
  if (statusEl) statusEl.textContent = 'Migrating...';
  let migratedUsers = 0, migratedTables = 0;

  try {
    // Migrate users collection → _data/users
    const usersSnap = await db.collection('users').get();
    if (!usersSnap.empty) {
      const usersObj = {};
      usersSnap.forEach(doc => { usersObj[doc.id] = doc.data(); });
      await db.collection('_data').doc('users').set(usersObj, { merge: true });
      migratedUsers = usersSnap.size;
    }

    // Migrate tables collection → _data/tables
    const tablesSnap = await db.collection('tables').get();
    if (!tablesSnap.empty) {
      const tablesObj = {};
      tablesSnap.forEach(doc => { tablesObj[doc.id] = doc.data(); });
      await db.collection('_data').doc('tables').set(tablesObj, { merge: true });
      migratedTables = tablesSnap.size;
    }

    if (statusEl) statusEl.innerHTML = `<span style="color:var(--success);">✓ Done!</span> Migrated ${migratedUsers} users and ${migratedTables} tables. You can now delete the old <code>users</code> and <code>tables</code> collections from the Firebase Console to save space.`;
  } catch(e) {
    console.error('Migration error:', e);
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger);">⚠ Error:</span> ${e.message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
  checkRoute();
});
