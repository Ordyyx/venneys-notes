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
let db;
let currentUser = null;
let currentTableId = null;
let currentMenuTab = null;
let currentCategoryTab = null;
let tableData = {};
let usersData = {};
let selectedUserId = null;
let pinBuffer = '';
let firebaseMenuData = null; // Menu stored in Firebase

// ─── FIREBASE INIT ───────────────────────────────────────────
function initFirebase() {
  if (!isConfigured()) { showConfigError(); return; }
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
  loadUsers();
  listenToTables();
  listenToMenu();
}

function showConfigError() {
  const el = document.getElementById('user-select-list');
  if (el) el.innerHTML = `
    <div style="color:#ef9a9a;font-size:0.85rem;line-height:1.7;padding:0.5rem 0;">
      <strong style="color:var(--danger);font-size:1rem;">⚠ Firebase not configured</strong><br>
      Open <code style="background:var(--dark3);padding:0.1rem 0.3rem;border-radius:3px;">app.js</code>
      and replace the placeholder values at the top with your actual Firebase config.
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
    } else { usersData = {}; }
    renderUserList();
    if (showScreen.current === 'vault') renderVault();
  }, err => {
    console.error('Firestore error:', err);
    const el = document.getElementById('user-select-list');
    if (el) el.innerHTML = `
      <div style="color:#ef9a9a;font-size:0.82rem;line-height:1.6;padding:0.5rem 0;">
        <strong style="color:var(--danger);">⚠ Database error</strong><br>
        ${err.code === 'permission-denied'
          ? 'Firestore rules are blocking reads.'
          : 'Could not connect to Firebase.<br>Error: ' + err.message}
      </div>`;
  });
}

// ─── MENU: FIREBASE AS SOURCE OF TRUTH ───────────────────────
function listenToMenu() {
  db.collection('_data').doc('menu').onSnapshot(doc => {
    if (doc.exists) {
      firebaseMenuData = doc.data();
      console.log('[Menu] Loaded from Firebase');
    } else {
      firebaseMenuData = null;
      console.log('[Menu] No menu in Firebase, using bundled fallback');
    }
  });
}

function getMenuData() {
  return firebaseMenuData || MENU_DATA;
}

async function saveMenuToFirebase(menuData) {
  await db.collection('_data').doc('menu').set(menuData);
}

// Push bundled MENU_DATA to Firebase (one-time bootstrap or sync)
async function pushBundledMenuToFirebase() {
  await saveMenuToFirebase(MENU_DATA);
  toast('✓ Bundled menu pushed to Firebase');
}

// ─── SINGLE-DOC WRITE HELPERS ────────────────────────────────
async function saveTable(tId, data) {
  await db.collection('_data').doc('tables').set({ [tId]: data }, { merge: true });
}

async function saveAllTables(allData) {
  await db.collection('_data').doc('tables').set(allData);
}

function userForSave(uid) {
  const u = { ...usersData[uid] };
  delete u.id;
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

// ─── SCREEN MANAGEMENT ───────────────────────────────────────
const showScreen = { current: null };
function goTo(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('screen-' + name);
  if (s) { s.classList.add('active'); showScreen.current = name; }
}

// Safe encode for use inside onclick="" attribute strings — escapes apostrophes
function enc(str) { return encodeURIComponent(str).replace(/'/g, '%27'); }

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
  const user = usersData[uid];
  document.getElementById('pin-popup-user').textContent = user?.name || '';
  document.getElementById('pin-overlay').classList.add('show');
  updatePinDots();
}

function closePinOverlay() {
  document.getElementById('pin-overlay').classList.remove('show');
  selectedUserId = null; pinBuffer = '';
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
  closePinOverlay(); goTo('login');
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
  closeModal(); toast('PIN updated!');
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
    let count = 0;
    orders.forEach(o => {
      if (o.items && Array.isArray(o.items)) count += o.items.length;
      else count += 1;
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
  closeModal(); currentTableId = tId;
  goTo('table'); renderTableDetail(tId);
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
  const menu = getMenuData();
  const active = [];
  Object.keys(menu).forEach(key => {
    const h = menu[key].hours;
    if (!h) { active.push(key); return; } // null = always available
    const schedules = h.schedules || [];
    for (const s of schedules) {
      if (s.days.includes(day) && mins >= s.start && mins <= s.end) {
        active.push(key);
        return;
      }
    }
  });
  return active;
}

// ─── ADD ORDER MODAL ──────────────────────────────────────────
let pendingOrderItems = [];

function showAddOrderModal() {
  pendingOrderItems = [];
  const menuData = getMenuData();
  const activeMenus = getActiveMenus();
  const allKeys = Object.keys(menuData);
  const visibleMenus = allKeys.filter(k => activeMenus.includes(k));
  const defaultTab = (currentMenuTab && visibleMenus.includes(currentMenuTab))
    ? currentMenuTab : (visibleMenus[0] || 'evening');

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
    id: 'grp_' + Date.now(), type: groupType,
    user: currentUser.name, time: now,
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
  currentMenuTab = key; currentCategoryTab = null;
  document.querySelectorAll('.order-menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key===key));
  renderOrderModalBody(key);
}

let currentSubCatTab = null;

function renderOrderModalBody(menuKey) {
  const menuData = getMenuData();
  const menu = menuData[menuKey];
  if (!menu) return;
  const cats = Object.keys(menu.categories);
  if (!cats.length) return;
  if (!currentCategoryTab || !cats.includes(currentCategoryTab)) { currentCategoryTab = cats[0]; currentSubCatTab = null; }
  const body = document.getElementById('order-modal-body');
  if (!body) return;
  body.innerHTML = `
    <div class="cat-tabs">
      ${cats.map(c => `
        <button class="cat-tab ${c===currentCategoryTab?'active':''}" data-cat="${c}"
          onclick="switchCategoryTab('${menuKey}','${enc(c)}')">
          ${c}
        </button>`).join('')}
    </div>
    <div id="sub-cat-tabs-area"></div>
    <div class="cat-items" id="cat-items-list"></div>
  `;
  renderCategoryContent(menuKey, currentCategoryTab);
}

function switchCategoryTab(menuKey, catEncoded) {
  const cat = decodeURIComponent(catEncoded);
  currentCategoryTab = cat;
  currentSubCatTab = null;
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat===cat));
  renderCategoryContent(menuKey, cat);
}

function renderCategoryContent(menuKey, cat) {
  const menuData = getMenuData();
  const catData = menuData[menuKey]?.categories[cat];
  if (!catData) return;

  const subArea = document.getElementById('sub-cat-tabs-area');
  const el = document.getElementById('cat-items-list');
  if (!el) return;

  // Check if this category has subcategories (3rd level)
  if (catData.subcategories) {
    const subKeys = Object.keys(catData.subcategories);
    if (!currentSubCatTab || !subKeys.includes(currentSubCatTab)) {
      // Default to "Coffee & More" if it exists (for Hot Drinks)
      currentSubCatTab = subKeys.includes('Coffee & More') ? 'Coffee & More' : (subKeys[0] || null);
    }
    if (subArea) {
      subArea.innerHTML = `
        <div class="cat-tabs sub-level">
          ${subKeys.map(sc => `
            <button class="cat-tab sub ${sc===currentSubCatTab?'active':''}" data-subcat="${sc}"
              onclick="switchSubCatTab('${menuKey}','${enc(cat)}','${enc(sc)}')">
              ${sc}
            </button>`).join('')}
        </div>`;
    }
    const items = currentSubCatTab ? catData.subcategories[currentSubCatTab] || [] : [];
    renderItemList(el, items, menuKey);
  } else {
    // Flat items — support both new {items:[]} and old plain array format
    if (subArea) subArea.innerHTML = '';
    currentSubCatTab = null;
    const items = Array.isArray(catData) ? catData : (catData.items || []);
    renderItemList(el, items, menuKey);
  }
}

function switchSubCatTab(menuKey, catEncoded, subCatEncoded) {
  currentSubCatTab = decodeURIComponent(subCatEncoded);
  document.querySelectorAll('.cat-tab.sub').forEach(t => t.classList.toggle('active', t.dataset.subcat===currentSubCatTab));
  const menuData = getMenuData();
  const cat = decodeURIComponent(catEncoded);
  const items = menuData[menuKey]?.categories[cat]?.subcategories?.[currentSubCatTab] || [];
  const el = document.getElementById('cat-items-list');
  if (el) renderItemList(el, items, menuKey);
}

function renderItemList(el, items, menuKey) {
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
  const cats = menuData[menuKey]?.categories || {};
  for (const catData of Object.values(cats)) {
    // Old format: plain array
    if (Array.isArray(catData)) {
      const found = catData.find(i => i.id === itemId);
      if (found) return found;
    }
    // New format: {items: [...]}
    if (catData.items) {
      const found = catData.items.find(i => i.id === itemId);
      if (found) return found;
    }
    // Subcategories
    if (catData.subcategories) {
      for (const subItems of Object.values(catData.subcategories)) {
        const found = subItems.find(i => i.id === itemId);
        if (found) return found;
      }
    }
  }
  return null;
}

function itemIsBurger(item) { return item.isBurger || /burger/i.test(item.name); }

function itemNeedsCheeseChoice(item, menuKey) {
  if (!itemIsBurger(item)) return false;
  if (menuKey === 'evening') return true;
  return false;
}

function addItem(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  if (!item) return;
  // Food modifiers
  if (item.isFishChips) showFishChipsSubModal(item, menuKey);
  else if (item.isSteak) showSteakSubModal(item, menuKey);
  else if (itemNeedsCheeseChoice(item, menuKey)) showBurgerCheeseSubModal(item, menuKey);
  // Drink modifiers
  else if (item.mods === 'draught') showDraughtSubModal(item, menuKey);
  else if (item.mods === 'spirit') showSpiritSubModal(item, menuKey);
  else if (item.mods === 'softdrink') showSoftDrinkSubModal(item, menuKey);
  else if (item.mods === 'flavour_ice') showFlavourIceSubModal(item, menuKey);
  else if (item.mods === 'flavour') showFlavourSubModal(item, menuKey);
  else if (item.mods === 'cordial') showCordialSubModal(item, menuKey);
  // Scoop builder (ice cream / sorbet)
  else if (item.mods === 'scoops') showScoopsSubModal(item, menuKey);
  // Everything else
  else showItemNotesSubModal(item, menuKey);
}

// ─── DRINK SUB-MODALS ────────────────────────────────────────

function showDraughtSubModal(item, menuKey) {
  openSubModal(`
    <h3>${item.name}</h3>
    <span class="modal-label">Size</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button>
      <button class="opt-btn" data-group="size" data-val="Half Pint" onclick="selectOpt(this)">Half Pint</button>
      <button class="opt-btn" data-group="size" data-val="Shandy" onclick="selectOpt(this)">Shandy</button>
      <button class="opt-btn" data-group="size" data-val="Half Shandy" onclick="selectOpt(this)">Half Shandy</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrinkMods('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function showSpiritSubModal(item, menuKey) {
  openSubModal(`
    <h3>${item.name}</h3>
    ${item.desc ? `<p>${item.desc}</p>` : ''}
    <span class="modal-label">Measure</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="measure" data-val="Single" onclick="selectOpt(this)">Single</button>
      <button class="opt-btn" data-group="measure" data-val="Double" onclick="selectOpt(this)">Double</button>
    </div>
    <span class="modal-label">Ice</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button>
      <button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button>
    </div>
    <span class="modal-label">Mixer (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="e.g. Lemonade, Coke, Tonic...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrinkMods('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function showSoftDrinkSubModal(item, menuKey) {
  openSubModal(`
    <h3>${item.name}</h3>
    <span class="modal-label">Ice</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button>
      <button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrinkMods('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function showFlavourIceSubModal(item, menuKey) {
  const flavours = item.flavours || [];
  openSubModal(`
    <h3>${item.name}</h3>
    ${flavours.length ? `
      <span class="modal-label">Flavour</span>
      <div class="modal-options">
        ${flavours.map(f => `<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}
      </div>` : ''}
    <span class="modal-label">Ice</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button>
      <button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrinkMods('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function showFlavourSubModal(item, menuKey) {
  const flavours = item.flavours || [];
  openSubModal(`
    <h3>${item.name}</h3>
    ${flavours.length ? `
      <span class="modal-label">Flavour</span>
      <div class="modal-options">
        ${flavours.map(f => `<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}
      </div>` : ''}
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrinkMods('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function showCordialSubModal(item, menuKey) {
  const flavours = item.flavours || [];
  openSubModal(`
    <h3>${item.name}</h3>
    ${flavours.length ? `
      <span class="modal-label">Flavour</span>
      <div class="modal-options">
        ${flavours.map(f => `<button class="opt-btn" data-group="flavour" data-val="${f}" onclick="selectOpt(this)">${f}</button>`).join('')}
      </div>` : ''}
    <span class="modal-label">Size</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="size" data-val="Pint" onclick="selectOpt(this)">Pint</button>
      <button class="opt-btn" data-group="size" data-val="Half" onclick="selectOpt(this)">Half</button>
    </div>
    <span class="modal-label">Ice</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="ice" data-val="Ice" onclick="selectOpt(this)">Ice</button>
      <button class="opt-btn" data-group="ice" data-val="No Ice" onclick="selectOpt(this)">No Ice</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmDrinkMods('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

// ─── SCOOP BUILDER (Ice Cream / Sorbet) ──────────────────────
let scoopSelections = []; // array of chosen flavours

function showScoopsSubModal(item, menuKey) {
  scoopSelections = [];
  const flavours = item.flavours || [];
  openSubModal(`
    <h3>${item.name}</h3>
    <p>Tap a flavour to add a scoop. Tap multiple times for multiple scoops of the same flavour.</p>
    <div class="modal-options" style="margin-bottom:0.75rem;">
      ${flavours.map(f => `<button class="opt-btn" onclick="addScoop('${f.replace(/'/g,"\\'")}',this)">${f}</button>`).join('')}
    </div>
    <span class="modal-label">Scoops selected</span>
    <div id="scoop-list" style="min-height:2rem;margin-bottom:0.5rem;">
      <span style="color:var(--text-dim);font-size:0.82rem;font-style:italic;">None yet — tap flavours above</span>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="e.g. in a bowl, with wafer...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmScoops('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
}

function addScoop(flavour) {
  scoopSelections.push(flavour);
  renderScoopList();
}

function removeScoop(index) {
  scoopSelections.splice(index, 1);
  renderScoopList();
}

function renderScoopList() {
  const el = document.getElementById('scoop-list');
  if (!el) return;
  if (!scoopSelections.length) {
    el.innerHTML = '<span style="color:var(--text-dim);font-size:0.82rem;font-style:italic;">None yet — tap flavours above</span>';
    return;
  }
  el.innerHTML = scoopSelections.map((f, i) => `
    <div style="display:inline-flex;align-items:center;gap:0.3rem;background:rgba(200,151,58,0.15);border:1px solid var(--gold-dark);border-radius:6px;padding:0.2rem 0.5rem;margin:0.15rem 0.15rem;font-size:0.82rem;color:var(--gold);">
      ${f}
      <button onclick="removeScoop(${i})" style="background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:0.7rem;padding:0 0.15rem;">✕</button>
    </div>
  `).join('') + `<div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.3rem;">${scoopSelections.length} scoop${scoopSelections.length!==1?'s':''}</div>`;
}

function confirmScoops(itemId, menuKey) {
  if (!scoopSelections.length) return toast('Add at least one scoop');
  const item = findMenuItem(menuKey, itemId);
  if (!item) return;
  // Count flavours for a clean summary
  const counts = {};
  scoopSelections.forEach(f => { counts[f] = (counts[f]||0) + 1; });
  const summary = Object.entries(counts).map(([f, n]) => n > 1 ? `${n}× ${f}` : f).join(', ');
  const opts = { scoops: `${scoopSelections.length} scoop${scoopSelections.length!==1?'s':''}: ${summary}` };
  addToPending(item, 'food', opts, document.getElementById('item-extra-note')?.value || '');
}

// Unified confirm for all drink modifiers
function confirmDrinkMods(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  if (!item) return;
  const opts = {};
  ['size','measure','ice','flavour'].forEach(g => {
    const el = document.querySelector(`#sub-modal-overlay .opt-btn.selected[data-group="${g}"]`);
    if (el) opts[g] = el.dataset.val;
  });
  addToPending(item, 'drink', opts, document.getElementById('item-extra-note')?.value || '');
}

function showItemNotesSubModal(item, menuKey) {
  openSubModal(`
    <h3>${item.name}</h3>
    ${item.desc ? `<p>${item.desc}</p>` : ''}
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeSubModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmItemNotes('${item.id}','${menuKey}')">Add</button>
    </div>
  `);
  setTimeout(() => document.getElementById('item-extra-note')?.focus(), 100);
}

function confirmItemNotes(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  addToPending(item, 'food', {}, document.getElementById('item-extra-note')?.value || '');
}

// ─── SUB-MODAL SYSTEM ────────────────────────────────────────
function openSubModal(html) {
  closeSubModal();
  const overlay = document.createElement('div');
  overlay.className = 'sub-modal-overlay';
  overlay.id = 'sub-modal-overlay';
  overlay.innerHTML = `<div class="sub-modal">${html}</div>`;
  overlay.onclick = e => { if (e.target === overlay) closeSubModal(); };
  document.body.appendChild(overlay);
}

function closeSubModal() { document.getElementById('sub-modal-overlay')?.remove(); }

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
    id: `${item.id}_${Date.now()}`, name: item.name, type, opts, extraNote, optSummary,
    icon: type === 'drink' ? '🍷' : type === 'misc' ? '✏️' : '🍽'
  });
  closeSubModal();
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
    id: 'drink_' + Date.now(), name, type: 'drink', opts, extraNote: note, optSummary, icon: '🍷'
  });
  closeSubModal(); renderPendingSide(); toast(`Added: ${name}`);
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
    id: 'misc_' + Date.now(), name, type: 'misc', opts: {}, extraNote: note, optSummary: note, icon: '✏️'
  });
  closeSubModal(); renderPendingSide(); toast(`Added: ${name}`);
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
      if (items.length === 0) return null;
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

// ─── RENDER ORDERS (NEWEST FIRST) ────────────────────────────
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
  } else { infoBar.style.display = 'none'; }

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

  // REVERSED — newest first
  const reversed = [...orders].reverse();

  el.innerHTML = reversed.map(o => {
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
    // Legacy single-item
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

function closeModal() { document.getElementById('modal-overlay')?.remove(); }

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

// ─── VAULT SCREEN ────────────────────────────────────────────
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
        <h3>Menu Editor</h3>
        <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.75rem;line-height:1.5">
          Edit the food menu below. Changes are saved to Firebase and sync to all devices instantly.
          Use "Sync from Bundled" to reset the menu to the built-in default for major menu changes.
        </p>
        <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
          <button class="btn-primary" onclick="pushBundledMenuToFirebase()" style="flex:none;padding:0.55rem 1rem;font-size:0.85rem;">↻ Sync from Bundled Menu</button>
        </div>
        <div id="menu-editor"></div>
      </div>

      <div class="vault-section">
        <h3>Data Migration</h3>
        <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:0.75rem;line-height:1.5">
          If upgrading from the old version, migrate existing data. Safe to run multiple times.
        </p>
        <button class="btn-primary" onclick="migrateOldData()" style="padding:0.65rem 1.2rem;">↻ Migrate Old Data</button>
        <div id="migrate-status" style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim);"></div>
      </div>
    </div>
  `;
  setTimeout(() => {
    renderVault();
    renderMenuEditor();
  }, 800);
}

// ─── MENU EDITOR ─────────────────────────────────────────────
let editorMenuKey = null;
let editorCatKey = null;
let editorSubCatKey = null;

function renderMenuEditor() {
  const container = document.getElementById('menu-editor');
  if (!container) return;
  const menu = getMenuData();
  const menuKeys = Object.keys(menu);
  if (!editorMenuKey || !menu[editorMenuKey]) editorMenuKey = menuKeys[0] || null;

  container.innerHTML = `
    <div class="editor-menu-tabs" style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;align-items:center;">
      ${menuKeys.map((k, idx) => `
        <div style="display:flex;align-items:center;gap:0;">
          ${idx > 0 ? `<button class="reset-pin-btn" style="padding:0.15rem 0.25rem;font-size:0.6rem;border-radius:4px 0 0 4px;border-right:none;" onclick="moveMenu('${k}',-1)">◀</button>` : ''}
          <button class="cat-tab ${k===editorMenuKey?'active':''}" onclick="switchEditorMenu('${k}')" style="border-radius:${idx>0?'0':'6px'} ${idx<menuKeys.length-1?'0':'6px'} ${idx<menuKeys.length-1?'0':'6px'} ${idx>0?'0':'6px'};">${menu[k]?.label || k}</button>
          ${idx < menuKeys.length-1 ? `<button class="reset-pin-btn" style="padding:0.15rem 0.25rem;font-size:0.6rem;border-radius:0 4px 4px 0;border-left:none;" onclick="moveMenu('${k}',1)">▶</button>` : ''}
        </div>
      `).join('')}
      <button class="cat-tab" style="color:var(--success);border-color:var(--success);" onclick="addMenuSection()">+ Section</button>
    </div>
    <div id="editor-body"></div>
  `;
  if (editorMenuKey) renderEditorBody();
}

function switchEditorMenu(key) {
  editorMenuKey = key; editorCatKey = null; editorSubCatKey = null;
  renderMenuEditor();
}

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function minsToTime(m) {
  const h = Math.floor(m/60), mi = m%60;
  return `${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}`;
}
function timeToMins(t) {
  const [h,m] = t.split(':').map(Number);
  return h*60+(m||0);
}

function renderEditorBody() {
  const container = document.getElementById('editor-body');
  if (!container || !editorMenuKey) return;
  const menu = getMenuData();
  const section = menu[editorMenuKey];
  if (!section) return;
  const cats = Object.keys(section.categories || {});
  if (!editorCatKey || !cats.includes(editorCatKey)) { editorCatKey = cats[0] || null; editorSubCatKey = null; }

  // Build schedule display
  const hours = section.hours;
  let scheduleHTML = '<span style="color:var(--success);font-size:0.8rem;">Always available</span>';
  if (hours && hours.schedules) {
    scheduleHTML = hours.schedules.map((s, i) => `
      <span style="font-size:0.78rem;color:var(--text-dim);background:var(--dark3);padding:0.2rem 0.5rem;border-radius:4px;border:1px solid var(--mid);">
        ${s.days.map(d => DAY_NAMES[d]).join(', ')} ${minsToTime(s.start)}–${minsToTime(s.end)}
      </span>`).join(' ');
  }

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0;flex-wrap:wrap;">
      <strong style="color:var(--gold);font-size:0.9rem;">${section.label}</strong>
      <button class="reset-pin-btn" onclick="renameMenuSection('${editorMenuKey}')">Rename</button>
      <button class="reset-pin-btn" onclick="editSchedule('${editorMenuKey}')">⏰ Hours</button>
      <button class="del-user-btn" onclick="deleteMenuSection('${editorMenuKey}')">✕</button>
    </div>
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;">${scheduleHTML}</div>
    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.75rem;">
      ${cats.map(c => `
        <button class="cat-tab ${c===editorCatKey?'active':''}" onclick="switchEditorCat('${enc(c)}')">${c}</button>
      `).join('')}
      <button class="cat-tab" style="color:var(--success);border-color:var(--success);" onclick="addCategory('${editorMenuKey}')">+ Category</button>
    </div>
    <div id="editor-items"></div>
  `;
  if (editorCatKey) renderEditorItems();
}

function switchEditorCat(catEncoded) {
  editorCatKey = decodeURIComponent(catEncoded);
  editorSubCatKey = null;
  renderEditorBody();
}

function renderEditorItems() {
  const container = document.getElementById('editor-items');
  if (!container || !editorMenuKey || !editorCatKey) return;
  const menu = getMenuData();
  const catData = menu[editorMenuKey]?.categories?.[editorCatKey];
  if (!catData) return;

  let html = `
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">
      <span style="font-size:0.82rem;color:var(--text-dim);">${editorCatKey}</span>
      <button class="reset-pin-btn" onclick="moveCat('${editorMenuKey}','${enc(editorCatKey)}',-1)">◀</button>
      <button class="reset-pin-btn" onclick="moveCat('${editorMenuKey}','${enc(editorCatKey)}',1)">▶</button>
      <button class="reset-pin-btn" onclick="renameCategory('${editorMenuKey}','${enc(editorCatKey)}')">Rename</button>
      <button class="del-user-btn" onclick="deleteCategory('${editorMenuKey}','${enc(editorCatKey)}')">✕</button>
    </div>`;

  if (catData.subcategories) {
    // 3-level: show subcategory tabs then items
    const subKeys = Object.keys(catData.subcategories);
    if (!editorSubCatKey || !subKeys.includes(editorSubCatKey)) editorSubCatKey = subKeys[0] || null;
    html += `
      <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;align-items:center;">
        ${subKeys.map((sc, si) => `
          <div style="display:flex;align-items:center;gap:0;">
            ${si > 0 ? `<button class="reset-pin-btn" style="padding:0.1rem 0.2rem;font-size:0.55rem;border-radius:3px 0 0 3px;border-right:none;" onclick="moveSubCat('${editorMenuKey}','${enc(editorCatKey)}','${enc(sc)}',-1)">◀</button>` : ''}
            <button class="cat-tab sub ${sc===editorSubCatKey?'active':''}" onclick="switchEditorSubCat('${enc(sc)}')" style="border-radius:${si>0?'0':'6px'} ${si<subKeys.length-1?'0':'6px'} ${si<subKeys.length-1?'0':'6px'} ${si>0?'0':'6px'};">${sc}</button>
            ${si < subKeys.length-1 ? `<button class="reset-pin-btn" style="padding:0.1rem 0.2rem;font-size:0.55rem;border-radius:0 3px 3px 0;border-left:none;" onclick="moveSubCat('${editorMenuKey}','${enc(editorCatKey)}','${enc(sc)}',1)">▶</button>` : ''}
          </div>
        `).join('')}
        <button class="cat-tab" style="color:var(--success);border-color:var(--success);font-size:0.75rem;" onclick="addSubCategory('${editorMenuKey}','${enc(editorCatKey)}')">+ Sub</button>
      </div>`;
    if (editorSubCatKey) {
      html += `
        <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem;align-items:center;">
          <span style="font-size:0.78rem;color:var(--text-dim);">${editorSubCatKey}</span>
          <button class="reset-pin-btn" style="font-size:0.72rem;" onclick="renameSubCat('${editorMenuKey}','${enc(editorCatKey)}','${enc(editorSubCatKey)}')">Rename</button>
          <button class="del-user-btn" style="font-size:0.8rem;" onclick="deleteSubCat('${editorMenuKey}','${enc(editorCatKey)}','${enc(editorSubCatKey)}')">✕</button>
        </div>`;
      const items = catData.subcategories[editorSubCatKey] || [];
      html += renderItemListEditor(items, editorMenuKey, editorCatKey, editorSubCatKey);
    }
  } else {
    // 2-level: flat items — support old array format too
    editorSubCatKey = null;
    const items = Array.isArray(catData) ? catData : (catData.items || []);
    html += `
      <div style="margin-bottom:0.5rem;">
        <button class="reset-pin-btn" onclick="convertToSubcategories('${editorMenuKey}','${enc(editorCatKey)}')">Convert to subcategories</button>
      </div>`;
    html += renderItemListEditor(items, editorMenuKey, editorCatKey, null);
  }

  container.innerHTML = html;
}

function switchEditorSubCat(subEncoded) {
  editorSubCatKey = decodeURIComponent(subEncoded);
  renderEditorItems();
}

function renderItemListEditor(items, menuKey, cat, subCat) {
  const catEnc = enc(cat);
  const subEnc = subCat ? enc(subCat) : '';
  const path = subCat ? `'${menuKey}','${catEnc}','${subEnc}'` : `'${menuKey}','${catEnc}',null`;
  return items.map((item, i) => `
    <div class="admin-user-row" style="flex-wrap:wrap;">
      <div style="display:flex;flex-direction:column;gap:0.15rem;flex-shrink:0;">
        <button class="reset-pin-btn" style="padding:0.1rem 0.3rem;font-size:0.65rem;${i===0?'visibility:hidden':''}" onclick="moveItem(${path},${i},-1)">▲</button>
        <button class="reset-pin-btn" style="padding:0.1rem 0.3rem;font-size:0.65rem;${i===items.length-1?'visibility:hidden':''}" onclick="moveItem(${path},${i},1)">▼</button>
      </div>
      <span class="u-name" style="flex:1;min-width:120px;">${item.name}</span>
      <span class="u-role" style="flex:2;min-width:100px;">${item.desc||'—'}</span>
      <span class="u-role">${[item.isFishChips?'🐟':'', item.isSteak?'🥩':'', item.isBurger?'🍔':''].filter(Boolean).join(' ')}</span>
      <button class="reset-pin-btn" onclick="editItem_ed(${path},${i})">Edit</button>
      <button class="del-user-btn" onclick="deleteItem_ed(${path},${i})">✕</button>
    </div>
  `).join('') + `
    <div style="margin-top:0.5rem;">
      <button class="btn-primary" onclick="addItem_ed(${path})" style="padding:0.45rem 0.85rem;font-size:0.82rem;">+ Add Item</button>
    </div>`;
}

// ─── EDITOR: get/set items at the right path ────────────────
function getItemsPath(menu, menuKey, cat, subCat) {
  const catData = menu[menuKey].categories[cat];
  if (subCat) return catData.subcategories[subCat];
  // Support old array format and new {items:[]} format
  if (Array.isArray(catData)) return catData;
  return catData.items;
}
function setItemsPath(menu, menuKey, cat, subCat, items) {
  if (subCat) menu[menuKey].categories[cat].subcategories[subCat] = items;
  else if (Array.isArray(menu[menuKey].categories[cat])) menu[menuKey].categories[cat] = items;
  else menu[menuKey].categories[cat].items = items;
}

// ─── MENU EDITOR ACTIONS ─────────────────────────────────────
function getEditableMenu() { return JSON.parse(JSON.stringify(getMenuData())); }

async function saveEditedMenu(menu) {
  await saveMenuToFirebase(menu);
  firebaseMenuData = menu;
  renderMenuEditor();
}

// ── Schedule editor ──
function editSchedule(menuKey) {
  const menu = getMenuData();
  const hours = menu[menuKey]?.hours;
  const schedules = hours?.schedules || [];
  let rows = schedules.map((s, i) => `
    <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;" class="sched-row">
      ${DAY_NAMES.map((d, di) => `
        <label style="font-size:0.75rem;cursor:pointer;padding:0.2rem 0.35rem;border-radius:4px;border:1px solid var(--mid);background:${s.days.includes(di)?'rgba(200,151,58,0.2)':'var(--dark3)'};color:${s.days.includes(di)?'var(--gold)':'var(--text-dim)'};" onclick="this.dataset.on=this.dataset.on==='1'?'0':'1';this.style.background=this.dataset.on==='1'?'rgba(200,151,58,0.2)':'var(--dark3)';this.style.color=this.dataset.on==='1'?'var(--gold)':'var(--text-dim)';" data-day="${di}" data-on="${s.days.includes(di)?'1':'0'}">${d}</label>
      `).join('')}
      <input type="time" class="modal-input sched-start" value="${minsToTime(s.start)}" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;">
      <span style="color:var(--text-dim);">–</span>
      <input type="time" class="modal-input sched-end" value="${minsToTime(s.end)}" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;">
      <button class="del-user-btn" onclick="this.closest('.sched-row').remove()">✕</button>
    </div>
  `).join('');

  openModal(`
    <h3>Edit Hours — ${menu[menuKey]?.label}</h3>
    <p>Set when this menu is available. Leave empty for always available.</p>
    <div id="sched-rows">${rows}</div>
    <button class="reset-pin-btn" onclick="addScheduleRow()" style="margin:0.5rem 0;">+ Add Time Slot</button>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-secondary" onclick="confirmSchedule('${menuKey}',true)">Always Available</button>
      <button class="btn-primary" onclick="confirmSchedule('${menuKey}',false)">Save</button>
    </div>
  `);
}

function addScheduleRow() {
  const container = document.getElementById('sched-rows');
  if (!container) return;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:0.4rem;align-items:center;margin-bottom:0.4rem;flex-wrap:wrap;';
  div.className = 'sched-row';
  div.innerHTML = DAY_NAMES.map((d, di) => `
    <label style="font-size:0.75rem;cursor:pointer;padding:0.2rem 0.35rem;border-radius:4px;border:1px solid var(--mid);background:var(--dark3);color:var(--text-dim);" onclick="this.dataset.on=this.dataset.on==='1'?'0':'1';this.style.background=this.dataset.on==='1'?'rgba(200,151,58,0.2)':'var(--dark3)';this.style.color=this.dataset.on==='1'?'var(--gold)':'var(--text-dim)';" data-day="${di}" data-on="0">${d}</label>
  `).join('') + `
    <input type="time" class="modal-input sched-start" value="12:00" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;">
    <span style="color:var(--text-dim);">–</span>
    <input type="time" class="modal-input sched-end" value="22:00" style="width:auto;flex:none;margin:0;padding:0.3rem 0.5rem;font-size:0.8rem;">
    <button class="del-user-btn" onclick="this.closest('.sched-row').remove()">✕</button>`;
  container.appendChild(div);
}

async function confirmSchedule(menuKey, alwaysAvailable) {
  const menu = getEditableMenu();
  if (alwaysAvailable) {
    menu[menuKey].hours = null;
  } else {
    const rows = document.querySelectorAll('.sched-row');
    const schedules = [];
    rows.forEach(row => {
      const days = [];
      row.querySelectorAll('[data-day]').forEach(lbl => {
        if (lbl.dataset.on === '1') days.push(parseInt(lbl.dataset.day));
      });
      const start = timeToMins(row.querySelector('.sched-start')?.value || '12:00');
      const end = timeToMins(row.querySelector('.sched-end')?.value || '22:00');
      if (days.length) schedules.push({ days, start, end });
    });
    menu[menuKey].hours = schedules.length ? { schedules } : null;
  }
  await saveEditedMenu(menu);
  closeModal(); toast('Hours updated');
}

// ── Section actions ──
function addMenuSection() {
  openModal(`
    <h3>Add Menu Section</h3>
    <span class="modal-label">Section key (e.g. "specials")</span>
    <input class="modal-input" id="new-section-key" placeholder="lowercase, no spaces">
    <span class="modal-label">Display label</span>
    <input class="modal-input" id="new-section-label" placeholder="e.g. Specials">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmAddSection()">Add</button>
    </div>
  `);
}

async function confirmAddSection() {
  const key = document.getElementById('new-section-key')?.value?.trim().toLowerCase().replace(/\s+/g,'_');
  const label = document.getElementById('new-section-label')?.value?.trim();
  if (!key || !label) return toast('Fill in both fields');
  const menu = getEditableMenu();
  if (menu[key]) return toast('Section already exists');
  menu[key] = { label, hours: null, categories: {} };
  await saveEditedMenu(menu);
  editorMenuKey = key;
  closeModal(); toast(`Added: ${label}`);
}

function renameMenuSection(key) {
  const menu = getMenuData();
  openModal(`
    <h3>Rename Section</h3>
    <input class="modal-input" id="rename-section-input" value="${menu[key]?.label || key}">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmRenameSection('${key}')">Save</button>
    </div>
  `);
}

async function confirmRenameSection(key) {
  const label = document.getElementById('rename-section-input')?.value?.trim();
  if (!label) return;
  const menu = getEditableMenu();
  menu[key].label = label;
  await saveEditedMenu(menu);
  closeModal(); toast('Renamed');
}

async function deleteMenuSection(key) {
  const menu = getEditableMenu();
  delete menu[key];
  editorMenuKey = null; editorCatKey = null; editorSubCatKey = null;
  await saveEditedMenu(menu);
  toast('Section deleted');
}

// ── Category actions ──
function addCategory(menuKey) {
  openModal(`
    <h3>Add Category</h3>
    <input class="modal-input" id="new-cat-name" placeholder="e.g. Starters, Spirits...">
    <span class="modal-label">Type</span>
    <div class="modal-options">
      <button class="opt-btn selected" data-group="cattype" data-val="flat" onclick="selectOpt(this)">Flat (items only)</button>
      <button class="opt-btn" data-group="cattype" data-val="nested" onclick="selectOpt(this)">Nested (has sub-categories)</button>
    </div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmAddCategory('${menuKey}')">Add</button>
    </div>
  `);
}

async function confirmAddCategory(menuKey) {
  const name = document.getElementById('new-cat-name')?.value?.trim();
  if (!name) return toast('Enter a name');
  const typeEl = document.querySelector('.opt-btn.selected[data-group="cattype"]');
  const isNested = typeEl?.dataset.val === 'nested';
  const menu = getEditableMenu();
  if (menu[menuKey].categories[name]) return toast('Already exists');
  menu[menuKey].categories[name] = isNested ? { subcategories: {} } : { items: [] };
  await saveEditedMenu(menu);
  editorCatKey = name; editorSubCatKey = null;
  closeModal(); toast(`Added: ${name}`);
}

function renameCategory(menuKey, catEncoded) {
  const cat = decodeURIComponent(catEncoded);
  openModal(`
    <h3>Rename Category</h3>
    <input class="modal-input" id="rename-cat-input" value="${cat}">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmRenameCategory('${menuKey}','${catEncoded}')">Save</button>
    </div>
  `);
}

async function confirmRenameCategory(menuKey, catEncoded) {
  const oldName = decodeURIComponent(catEncoded);
  const newName = document.getElementById('rename-cat-input')?.value?.trim();
  if (!newName || newName === oldName) return closeModal();
  const menu = getEditableMenu();
  menu[menuKey].categories[newName] = menu[menuKey].categories[oldName];
  delete menu[menuKey].categories[oldName];
  editorCatKey = newName;
  await saveEditedMenu(menu);
  closeModal(); toast('Renamed');
}

async function deleteCategory(menuKey, catEncoded) {
  const cat = decodeURIComponent(catEncoded);
  const menu = getEditableMenu();
  delete menu[menuKey].categories[cat];
  editorCatKey = null; editorSubCatKey = null;
  await saveEditedMenu(menu);
  toast('Deleted');
}

async function convertToSubcategories(menuKey, catEncoded) {
  const cat = decodeURIComponent(catEncoded);
  const menu = getEditableMenu();
  const existing = menu[menuKey].categories[cat].items || [];
  menu[menuKey].categories[cat] = { subcategories: { "Default": existing } };
  await saveEditedMenu(menu);
  editorSubCatKey = "Default";
  toast('Converted — move items into subcategories');
}

// ── Subcategory actions ──
function addSubCategory(menuKey, catEncoded) {
  openModal(`
    <h3>Add Sub-Category</h3>
    <input class="modal-input" id="new-subcat-name" placeholder="e.g. Vodka, Gin, Rum...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmAddSubCat('${menuKey}','${catEncoded}')">Add</button>
    </div>
  `);
}

async function confirmAddSubCat(menuKey, catEncoded) {
  const cat = decodeURIComponent(catEncoded);
  const name = document.getElementById('new-subcat-name')?.value?.trim();
  if (!name) return toast('Enter a name');
  const menu = getEditableMenu();
  if (menu[menuKey].categories[cat].subcategories[name]) return toast('Already exists');
  menu[menuKey].categories[cat].subcategories[name] = [];
  await saveEditedMenu(menu);
  editorSubCatKey = name;
  closeModal(); toast(`Added: ${name}`);
}

// ── Item actions (unified for flat and nested) ──
function addItem_ed(menuKey, catEnc, subCatEnc) {
  const cat = decodeURIComponent(catEnc);
  const subCat = subCatEnc ? decodeURIComponent(subCatEnc) : null;
  const label = subCat || cat;
  openModal(`
    <h3>Add Item to ${label}</h3>
    <span class="modal-label">Name</span>
    <input class="modal-input" id="ei-name" placeholder="Item name">
    <span class="modal-label">Description</span>
    <input class="modal-input" id="ei-desc" placeholder="Description (optional)">
    <span class="modal-label">Food Flags</span>
    <div class="modal-options">
      <button class="opt-btn" data-group="flag" data-val="isFishChips" onclick="toggleFlag(this)">🐟 Fish & Chips</button>
      <button class="opt-btn" data-group="flag" data-val="isSteak" onclick="toggleFlag(this)">🥩 Steak</button>
      <button class="opt-btn" data-group="flag" data-val="isBurger" onclick="toggleFlag(this)">🍔 Burger</button>
    </div>
    <span class="modal-label">Drink Modifier</span>
    <select class="modal-input" id="ei-mods" style="margin-bottom:0.5rem;">
      <option value="">None</option>
      <option value="draught">Draught (pint/half/shandy)</option>
      <option value="spirit">Spirit (single/double, ice)</option>
      <option value="softdrink">Soft Drink (ice)</option>
      <option value="flavour_ice">Flavour + Ice</option>
      <option value="flavour">Flavour only</option>
      <option value="cordial">Cordial (flavour, size, ice)</option>
    </select>
    <span class="modal-label">Flavours (comma separated, if applicable)</span>
    <input class="modal-input" id="ei-flavours" placeholder="e.g. Orange, Lime, Blackcurrant">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmAddItem_ed('${menuKey}','${catEnc}',${subCatEnc?`'${subCatEnc}'`:'null'})">Add</button>
    </div>
  `);
}

function toggleFlag(btn) { btn.classList.toggle('selected'); }

async function confirmAddItem_ed(menuKey, catEnc, subCatEnc) {
  const cat = decodeURIComponent(catEnc);
  const subCat = subCatEnc ? decodeURIComponent(subCatEnc) : null;
  const name = document.getElementById('ei-name')?.value?.trim();
  if (!name) return toast('Enter a name');
  const desc = document.getElementById('ei-desc')?.value?.trim() || '';
  const flags = {};
  document.querySelectorAll('.opt-btn.selected[data-group="flag"]').forEach(b => { flags[b.dataset.val] = true; });
  const mods = document.getElementById('ei-mods')?.value || '';
  const flavoursRaw = document.getElementById('ei-flavours')?.value?.trim() || '';
  const flavours = flavoursRaw ? flavoursRaw.split(',').map(f => f.trim()).filter(Boolean) : undefined;
  const menu = getEditableMenu();
  const items = getItemsPath(menu, menuKey, cat, subCat);
  const newItem = { id: menuKey.slice(0,2)+'_'+Date.now(), name, desc, isFishChips:!!flags.isFishChips, isSteak:!!flags.isSteak, isBurger:!!flags.isBurger };
  if (mods) newItem.mods = mods;
  if (flavours) newItem.flavours = flavours;
  items.push(newItem);
  await saveEditedMenu(menu);
  closeModal(); toast(`Added: ${name}`);
}

function editItem_ed(menuKey, catEnc, subCatEnc, index) {
  const cat = decodeURIComponent(catEnc);
  const subCat = subCatEnc ? decodeURIComponent(subCatEnc) : null;
  const menu = getMenuData();
  const items = getItemsPath(menu, menuKey, cat, subCat);
  const item = items?.[index];
  if (!item) return;
  const modsVal = item.mods || '';
  const flavoursVal = (item.flavours || []).join(', ');
  openModal(`
    <h3>Edit Item</h3>
    <span class="modal-label">Name</span>
    <input class="modal-input" id="ei-name" value="${item.name}">
    <span class="modal-label">Description</span>
    <input class="modal-input" id="ei-desc" value="${item.desc||''}">
    <span class="modal-label">Food Flags</span>
    <div class="modal-options">
      <button class="opt-btn ${item.isFishChips?'selected':''}" data-group="flag" data-val="isFishChips" onclick="toggleFlag(this)">🐟 Fish & Chips</button>
      <button class="opt-btn ${item.isSteak?'selected':''}" data-group="flag" data-val="isSteak" onclick="toggleFlag(this)">🥩 Steak</button>
      <button class="opt-btn ${item.isBurger?'selected':''}" data-group="flag" data-val="isBurger" onclick="toggleFlag(this)">🍔 Burger</button>
    </div>
    <span class="modal-label">Drink Modifier</span>
    <select class="modal-input" id="ei-mods" style="margin-bottom:0.5rem;">
      <option value="" ${!modsVal?'selected':''}>None</option>
      <option value="draught" ${modsVal==='draught'?'selected':''}>Draught (pint/half/shandy)</option>
      <option value="spirit" ${modsVal==='spirit'?'selected':''}>Spirit (single/double, ice)</option>
      <option value="softdrink" ${modsVal==='softdrink'?'selected':''}>Soft Drink (ice)</option>
      <option value="flavour_ice" ${modsVal==='flavour_ice'?'selected':''}>Flavour + Ice</option>
      <option value="flavour" ${modsVal==='flavour'?'selected':''}>Flavour only</option>
      <option value="cordial" ${modsVal==='cordial'?'selected':''}>Cordial (flavour, size, ice)</option>
    </select>
    <span class="modal-label">Flavours (comma separated, if applicable)</span>
    <input class="modal-input" id="ei-flavours" value="${flavoursVal}">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmEditItem_ed('${menuKey}','${catEnc}',${subCatEnc?`'${subCatEnc}'`:'null'},${index})">Save</button>
    </div>
  `);
}

async function confirmEditItem_ed(menuKey, catEnc, subCatEnc, index) {
  const cat = decodeURIComponent(catEnc);
  const subCat = subCatEnc ? decodeURIComponent(subCatEnc) : null;
  const name = document.getElementById('ei-name')?.value?.trim();
  if (!name) return toast('Enter a name');
  const desc = document.getElementById('ei-desc')?.value?.trim() || '';
  const flags = {};
  document.querySelectorAll('.opt-btn.selected[data-group="flag"]').forEach(b => { flags[b.dataset.val] = true; });
  const mods = document.getElementById('ei-mods')?.value || '';
  const flavoursRaw = document.getElementById('ei-flavours')?.value?.trim() || '';
  const flavours = flavoursRaw ? flavoursRaw.split(',').map(f => f.trim()).filter(Boolean) : null;
  const menu = getEditableMenu();
  const items = getItemsPath(menu, menuKey, cat, subCat);
  const item = items[index];
  item.name = name; item.desc = desc;
  item.isFishChips = !!flags.isFishChips;
  item.isSteak = !!flags.isSteak;
  item.isBurger = !!flags.isBurger;
  if (mods) item.mods = mods; else delete item.mods;
  if (flavours) item.flavours = flavours; else delete item.flavours;
  await saveEditedMenu(menu);
  closeModal(); toast('Updated');
}

async function deleteItem_ed(menuKey, catEnc, subCatEnc, index) {
  const cat = decodeURIComponent(catEnc);
  const subCat = subCatEnc ? decodeURIComponent(subCatEnc) : null;
  const menu = getEditableMenu();
  const items = getItemsPath(menu, menuKey, cat, subCat);
  items.splice(index, 1);
  await saveEditedMenu(menu);
  toast('Deleted');
}

// ─── REORDER ─────────────────────────────────────────────────
async function moveMenu(key, direction) {
  const menu = getEditableMenu();
  const keys = Object.keys(menu);
  const idx = keys.indexOf(key);
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= keys.length) return;
  [keys[idx], keys[newIdx]] = [keys[newIdx], keys[idx]];
  const newMenu = {};
  keys.forEach(k => { newMenu[k] = menu[k]; });
  await saveEditedMenu(newMenu);
}

async function moveCat(menuKey, catEnc, direction) {
  const cat = decodeURIComponent(catEnc);
  const menu = getEditableMenu();
  const cats = Object.keys(menu[menuKey].categories);
  const idx = cats.indexOf(cat);
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= cats.length) return;
  [cats[idx], cats[newIdx]] = [cats[newIdx], cats[idx]];
  const newCats = {};
  cats.forEach(k => { newCats[k] = menu[menuKey].categories[k]; });
  menu[menuKey].categories = newCats;
  await saveEditedMenu(menu);
}

async function moveSubCat(menuKey, catEnc, subEnc, direction) {
  const cat = decodeURIComponent(catEnc);
  const sub = decodeURIComponent(subEnc);
  const menu = getEditableMenu();
  const subs = Object.keys(menu[menuKey].categories[cat].subcategories);
  const idx = subs.indexOf(sub);
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= subs.length) return;
  [subs[idx], subs[newIdx]] = [subs[newIdx], subs[idx]];
  const newSubs = {};
  subs.forEach(k => { newSubs[k] = menu[menuKey].categories[cat].subcategories[k]; });
  menu[menuKey].categories[cat].subcategories = newSubs;
  await saveEditedMenu(menu);
}

async function moveItem(menuKey, catEnc, subCatEnc, index, direction) {
  const cat = decodeURIComponent(catEnc);
  const subCat = subCatEnc ? decodeURIComponent(subCatEnc) : null;
  const menu = getEditableMenu();
  const items = getItemsPath(menu, menuKey, cat, subCat);
  const newIdx = index + direction;
  if (newIdx < 0 || newIdx >= items.length) return;
  [items[index], items[newIdx]] = [items[newIdx], items[index]];
  await saveEditedMenu(menu);
}

// ─── SUBCATEGORY RENAME / DELETE ─────────────────────────────
function renameSubCat(menuKey, catEnc, subEnc) {
  const sub = decodeURIComponent(subEnc);
  openModal(`
    <h3>Rename Sub-Category</h3>
    <input class="modal-input" id="rename-subcat-input" value="${sub}">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmRenameSubCat('${menuKey}','${catEnc}','${subEnc}')">Save</button>
    </div>
  `);
}

async function confirmRenameSubCat(menuKey, catEnc, subEnc) {
  const cat = decodeURIComponent(catEnc);
  const oldName = decodeURIComponent(subEnc);
  const newName = document.getElementById('rename-subcat-input')?.value?.trim();
  if (!newName || newName === oldName) return closeModal();
  const menu = getEditableMenu();
  const subs = menu[menuKey].categories[cat].subcategories;
  // Rebuild preserving order with new name
  const newSubs = {};
  Object.keys(subs).forEach(k => { newSubs[k === oldName ? newName : k] = subs[k]; });
  menu[menuKey].categories[cat].subcategories = newSubs;
  editorSubCatKey = newName;
  await saveEditedMenu(menu);
  closeModal(); toast('Renamed');
}

async function deleteSubCat(menuKey, catEnc, subEnc) {
  const cat = decodeURIComponent(catEnc);
  const sub = decodeURIComponent(subEnc);
  const menu = getEditableMenu();
  delete menu[menuKey].categories[cat].subcategories[sub];
  editorSubCatKey = null;
  await saveEditedMenu(menu);
  toast('Deleted');
}

// ─── DATA MIGRATION ──────────────────────────────────────────
async function migrateOldData() {
  const statusEl = document.getElementById('migrate-status');
  if (statusEl) statusEl.textContent = 'Migrating...';
  let migratedUsers = 0, migratedTables = 0;
  try {
    const usersSnap = await db.collection('users').get();
    if (!usersSnap.empty) {
      const usersObj = {};
      usersSnap.forEach(doc => { usersObj[doc.id] = doc.data(); });
      await db.collection('_data').doc('users').set(usersObj, { merge: true });
      migratedUsers = usersSnap.size;
    }
    const tablesSnap = await db.collection('tables').get();
    if (!tablesSnap.empty) {
      const tablesObj = {};
      tablesSnap.forEach(doc => { tablesObj[doc.id] = doc.data(); });
      await db.collection('_data').doc('tables').set(tablesObj, { merge: true });
      migratedTables = tablesSnap.size;
    }
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--success);">✓ Done!</span> Migrated ${migratedUsers} users and ${migratedTables} tables.`;
  } catch(e) {
    console.error('Migration error:', e);
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger);">⚠ Error:</span> ${e.message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
  checkRoute();
});
