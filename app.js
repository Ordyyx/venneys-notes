// ─── FIREBASE SETUP ─────────────────────────────────────────
// Replace these with your actual Firebase config
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzyWV43V_tjlJAV_NyYCJ2Cxy_Zq7pZoQ",
  authDomain: "venneys.firebaseapp.com",
  projectId: "venneys",
  storageBucket: "venneys.firebasestorage.app",
  messagingSenderId: "574978601696",
  appId: "1:574978601696:web:1a2f89cd195d1bf4ffd685"
};

// ─── APP STATE ───────────────────────────────────────────────
let db;
let currentUser = null;
let currentTableId = null;
let currentMenuTab = null;
let tableData = {}; // { [tableId]: { open, orders, allergens, otherAllergen } }
let usersData = {}; // { [userId]: { name, pin, role } }
let selectedUserId = null;
let pinBuffer = '';

// ─── FIREBASE INIT ───────────────────────────────────────────
function initFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
  loadUsers();
  listenToTables();
}

function listenToTables() {
  db.collection('tables').onSnapshot(snap => {
    snap.forEach(doc => {
      tableData[doc.id] = doc.data();
    });
    renderTables();
    if (currentTableId) renderTableDetail(currentTableId);
  });
}

function loadUsers() {
  db.collection('users').onSnapshot(snap => {
    usersData = {};
    snap.forEach(doc => { usersData[doc.id] = { id: doc.id, ...doc.data() }; });
    renderUserList();
    if (showScreen.current === 'vault') renderVault();
  });
}

// ─── SCREEN MANAGEMENT ──────────────────────────────────────
const showScreen = { current: null };
function goTo(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById('screen-' + name);
  if (s) { s.classList.add('active'); showScreen.current = name; }
}

// ─── AUTH ────────────────────────────────────────────────────
function renderUserList() {
  const el = document.getElementById('user-select-list');
  el.innerHTML = '';
  const users = Object.values(usersData).sort((a,b) => a.name.localeCompare(b.name));
  if (!users.length) {
    el.innerHTML = '<div style="color:var(--text-dim);font-size:0.85rem;text-align:center;padding:1rem;">No users found. Visit <strong style="color:var(--gold)">/vault</strong> to add users.</div>';
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
  document.querySelector('.pin-section').classList.add('show');
  updatePinDots();
}

function updatePinDots() {
  document.querySelectorAll('.pin-dot').forEach((d, i) => {
    d.classList.toggle('filled', i < pinBuffer.length);
  });
}

function pinPress(val) {
  if (!selectedUserId) return;
  if (val === 'del') {
    pinBuffer = pinBuffer.slice(0, -1);
  } else if (pinBuffer.length < 4) {
    pinBuffer += val;
  }
  updatePinDots();
  if (pinBuffer.length === 4) setTimeout(attemptLogin, 150);
}

function attemptLogin() {
  const user = usersData[selectedUserId];
  if (!user) return;
  const correctPin = user.pin || '1234';
  if (pinBuffer === correctPin) {
    currentUser = { ...user };
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
  currentUser = null;
  selectedUserId = null;
  pinBuffer = '';
  document.querySelectorAll('.user-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('.pin-section').classList.remove('show');
  updatePinDots();
  goTo('login');
}

// ─── PIN CHANGE ──────────────────────────────────────────────
function showPinChange() {
  openModal(`
    <h3>Change PIN</h3>
    <p>Enter a new 4-digit PIN for <strong style="color:var(--gold)">${currentUser.name}</strong></p>
    <span class="modal-label">New PIN</span>
    <input class="modal-input" id="new-pin" type="password" inputmode="numeric" maxlength="4" placeholder="4 digits" pattern="[0-9]*">
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
  await db.collection('users').doc(currentUser.id).update({ pin: p1 });
  currentUser.pin = p1;
  closeModal();
  toast('PIN updated!');
}

// ─── TABLES ──────────────────────────────────────────────────
function renderTables() {
  const el = document.getElementById('tables-grid');
  if (!el) return;
  el.innerHTML = '';
  if (currentUser) {
    document.getElementById('header-user-name').textContent = currentUser.name;
  }
  TABLES.forEach(t => {
    const tData = tableData[String(t.id)] || { open: false, orders: [], allergens: [] };
    const tile = document.createElement('div');
    tile.className = 'table-tile ' + (tData.open ? 'open' : 'closed');
    tile.dataset.id = t.id;
    const orderCount = (tData.orders || []).length;
    const hasAllergens = (tData.allergens || []).length > 0 || tData.otherAllergen;
    tile.innerHTML = `
      <span class="t-label">${t.label.replace('Table ', 'T')}</span>
      ${orderCount > 0 ? `<span class="t-count">${orderCount} item${orderCount>1?'s':''}</span>` : ''}
      ${tData.open && hasAllergens ? '<div class="allergen-dot"></div>' : ''}
    `;
    tile.onclick = () => openTable(t.id);
    el.appendChild(tile);
  });
}

function openTable(tableId) {
  currentTableId = String(tableId);
  const tData = tableData[currentTableId] || { open: false, orders: [], allergens: [] };
  if (!tData.open) {
    showAllergenModal(tableId, true);
  } else {
    goTo('table');
    renderTableDetail(currentTableId);
  }
}

function showAllergenModal(tableId, isOpening = false) {
  const tId = String(tableId);
  const tData = tableData[tId] || { open: false, orders: [], allergens: [], otherAllergen: '' };
  const tableLabel = TABLES.find(t => t.id == tableId)?.label || `Table ${tableId}`;
  const checked = tData.allergens || [];

  openModal(`
    <h3>${isOpening ? `Open ${tableLabel}` : `Allergens — ${tableLabel}`}</h3>
    <p>Does anyone in this party have any of the 14 allergens?</p>
    <div class="allergen-grid">
      ${ALLERGENS.map(a => `
        <label class="allergen-check ${checked.includes(a) ? 'checked' : ''}" data-allergen="${a}" onclick="toggleAllergenCheck(this)">
          <div class="check-mark"></div>
          <span class="check-label">${a}</span>
        </label>
      `).join('')}
    </div>
    <span class="modal-label">Other allergies / notes</span>
    <input class="modal-input" id="other-allergen" placeholder="e.g. latex, kiwi..." value="${tData.otherAllergen || ''}">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="saveAllergens('${tId}', ${isOpening}, true)">Skip</button>
      <button class="btn-primary" onclick="saveAllergens('${tId}', ${isOpening}, false)">
        ${isOpening ? 'Open Table' : 'Save'}
      </button>
    </div>
  `);
}

function toggleAllergenCheck(el) {
  el.classList.toggle('checked');
}

async function saveAllergens(tId, isOpening, skip) {
  const allergens = skip ? [] : Array.from(document.querySelectorAll('.allergen-check.checked')).map(el => el.dataset.allergen);
  const otherAllergen = skip ? '' : (document.getElementById('other-allergen')?.value || '');
  const existing = tableData[tId] || {};
  await db.collection('tables').doc(tId).set({
    ...existing,
    open: true,
    allergens,
    otherAllergen,
    openedAt: existing.openedAt || new Date().toISOString(),
    orders: existing.orders || []
  }, { merge: true });
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
  await db.collection('tables').doc(String(tableId)).set({ open: false, orders: [], allergens: [], otherAllergen: '' });
  closeModal();
  goTo('tables');
  toast(`Table closed`);
}

function showCloseAll() {
  openModal(`
    <h3>Close All Tables?</h3>
    <p>This will close all open tables and clear their orders. This cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-danger" onclick="confirmCloseAll()">Close All</button>
    </div>
  `);
}

async function confirmCloseAll() {
  const batch = db.batch();
  Object.keys(tableData).forEach(tId => {
    if (tableData[tId].open) {
      batch.set(db.collection('tables').doc(tId), { open: false, orders: [], allergens: [], otherAllergen: '' });
    }
  });
  await batch.commit();
  closeModal();
  toast('All tables closed');
}

// ─── TABLE DETAIL ────────────────────────────────────────────
function renderTableDetail(tId) {
  const tData = tableData[tId] || {};
  const tableLabel = TABLES.find(t => t.id == tId)?.label || `Table ${tId}`;

  document.getElementById('table-detail-title').textContent = tableLabel;

  const allergenCount = (tData.allergens || []).length;
  const hasOther = tData.otherAllergen;
  const allergenBadge = document.getElementById('allergen-badge');
  if (allergenCount > 0 || hasOther) {
    allergenBadge.style.display = 'inline-block';
    allergenBadge.textContent = `⚠ Allergens`;
  } else {
    allergenBadge.style.display = 'none';
  }

  renderMenuTabs(tId);
  renderOrders(tId);
}

function getActiveMenus() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const mins = now.getHours() * 60 + now.getMinutes();

  const active = [];
  // Always available
  active.push('dessert', 'children');

  // Breakfast: Sat & Sun 9-11:30
  if ([0, 6].includes(day) && mins >= 9*60 && mins <= 11*60+30) active.push('breakfast');
  // Lunch: Mon-Sat 12-4
  if (day >= 1 && day <= 6 && mins >= 12*60 && mins < 16*60) active.push('lunch');
  // Evening: Mon-Sat from 4pm; last orders Mon-Thu 19:45, Fri-Sat 20:15
  if (day >= 1 && day <= 6 && mins >= 16*60) {
    const lastOrder = [5, 6].includes(day) ? 20*60+15 : 19*60+45;
    if (mins <= lastOrder) active.push('evening');
  }
  // Sunday: Sun 12-18:15
  if (day === 0 && mins >= 12*60 && mins <= 18*60+15) active.push('sunday');

  return active;
}

function renderMenuTabs(tId) {
  const tabs = document.getElementById('menu-tabs');
  const activeMenus = getActiveMenus();
  const allMenuKeys = ['breakfast', 'lunch', 'evening', 'sunday', 'dessert', 'children'];

  tabs.innerHTML = '';
  allMenuKeys.forEach(key => {
    const menu = MENU_DATA[key];
    const isAvail = activeMenus.includes(key);
    const btn = document.createElement('button');
    btn.className = 'menu-tab' + (isAvail ? '' : ' unavailable');
    btn.textContent = menu.label;
    btn.dataset.key = key;
    btn.onclick = () => switchMenuTab(key, tId);
    tabs.appendChild(btn);
  });

  // Pick first available tab
  if (!currentMenuTab || !allMenuKeys.includes(currentMenuTab)) {
    currentMenuTab = activeMenus.find(k => allMenuKeys.includes(k)) || 'evening';
  }
  switchMenuTab(currentMenuTab, tId);
}

function switchMenuTab(key, tId) {
  currentMenuTab = key;
  document.querySelectorAll('.menu-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.key === key);
  });
  renderMenuPanel(key, tId);
}

function renderMenuPanel(menuKey, tId) {
  const panel = document.getElementById('menu-panel');
  const menu = MENU_DATA[menuKey];
  const activeMenus = getActiveMenus();
  let html = '';

  if (!activeMenus.includes(menuKey) && menu.hours !== null) {
    let hoursText = getMenuHoursText(menuKey);
    html += `<div class="menu-availability-notice">⏰ ${menu.label} menu is currently unavailable.<br>${hoursText}</div>`;
  }

  Object.entries(menu.categories).forEach(([cat, items]) => {
    html += `<div class="menu-category"><h3>${cat}</h3><div class="menu-items-list">`;
    items.forEach(item => {
      html += `
        <button class="menu-item-btn" onclick="addItem('${item.id}','${menuKey}')">
          <span class="item-name">${item.name}</span>
          ${item.desc ? `<span class="item-desc">${item.desc}</span>` : ''}
        </button>`;
    });
    html += '</div></div>';
  });

  panel.innerHTML = html || '<div class="empty-state">No items available</div>';
}

function getMenuHoursText(key) {
  const texts = {
    breakfast: 'Served Saturday & Sunday, 9am – 11:30am',
    lunch: 'Served Monday – Saturday, 12pm – 4pm',
    evening: 'Served Mon–Sat from 4pm. Last orders: Mon–Thu 7:45pm, Fri–Sat 8:15pm',
    sunday: 'Served Sunday 12pm – 6:15pm',
    dessert: 'Available at any time',
    children: 'Available at any time'
  };
  return texts[key] || '';
}

// ─── ADDING ITEMS ────────────────────────────────────────────
function findMenuItem(menuKey, itemId) {
  const menu = MENU_DATA[menuKey];
  for (const items of Object.values(menu.categories)) {
    const found = items.find(i => i.id === itemId);
    if (found) return found;
  }
  return null;
}

function addItem(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  if (!item) return;

  if (item.isFishChips) {
    showFishChipsModal(item, menuKey);
  } else if (item.isSteak) {
    showSteakModal(item, menuKey);
  } else {
    showItemConfirmModal(item, menuKey, {});
  }
}

function showFishChipsModal(item, menuKey) {
  openModal(`
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
      <button class="opt-btn" data-group="tartar" data-val="No Tartar Sauce" onclick="selectOpt(this)">No Tartar Sauce</button>
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmFishChips('${item.id}','${menuKey}')">Add to Order</button>
    </div>
  `);
}

function confirmFishChips(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  const opts = {};
  ['peas','chips','tartar'].forEach(g => {
    const el = document.querySelector(`.opt-btn.selected[data-group="${g}"]`);
    if (el) opts[g] = el.dataset.val;
  });
  const note = document.getElementById('item-extra-note')?.value || '';
  addOrderEntry(item, menuKey, opts, note);
}

function showSteakModal(item, menuKey) {
  openModal(`
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <span class="modal-label">Steak Sauce</span>
    <div class="modal-options">
      ${STEAK_SAUCES.map(s => `<button class="opt-btn" data-group="sauce" data-val="${s}" onclick="selectOpt(this)">${s}</button>`).join('')}
    </div>
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="e.g. well done, rare...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmSteak('${item.id}','${menuKey}')">Add to Order</button>
    </div>
  `);
}

function confirmSteak(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  const sauceEl = document.querySelector('.opt-btn.selected[data-group="sauce"]');
  const opts = sauceEl ? { sauce: sauceEl.dataset.val } : {};
  const note = document.getElementById('item-extra-note')?.value || '';
  addOrderEntry(item, menuKey, opts, note);
}

function showItemConfirmModal(item, menuKey, opts) {
  openModal(`
    <h3>${item.name}</h3>
    ${item.desc ? `<p>${item.desc}</p>` : ''}
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="item-extra-note" placeholder="Any extra requests...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmAddItem('${item.id}','${menuKey}')">Add to Order</button>
    </div>
  `);
}

function confirmAddItem(itemId, menuKey) {
  const item = findMenuItem(menuKey, itemId);
  const note = document.getElementById('item-extra-note')?.value || '';
  addOrderEntry(item, menuKey, {}, note);
}

function selectOpt(btn) {
  const group = btn.dataset.group;
  document.querySelectorAll(`.opt-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function addDrink() {
  const order = {
    id: 'drink_' + Date.now(),
    type: 'drink',
    name: 'Drink',
    menuKey: 'drinks',
    opts: {},
    extraNote: '',
    user: currentUser.name,
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };
  pushOrder(order);
  toast('Drink added');
}

function showMiscModal() {
  openModal(`
    <h3>Miscellaneous Food Item</h3>
    <p>Enter the item description below.</p>
    <input class="modal-input" id="misc-name" placeholder="e.g. Extra bread, no onion on burger...">
    <span class="modal-label">Extra notes (optional)</span>
    <input class="modal-input" id="misc-note" placeholder="Any extra details...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="confirmMisc()">Add Item</button>
    </div>
  `);
  setTimeout(() => document.getElementById('misc-name')?.focus(), 100);
}

function confirmMisc() {
  const name = document.getElementById('misc-name')?.value?.trim();
  if (!name) return toast('Please enter an item name');
  const note = document.getElementById('misc-note')?.value || '';
  addOrderEntry({ id: 'misc', name }, 'misc', {}, note);
}

async function addOrderEntry(item, menuKey, opts, extraNote) {
  const order = {
    id: `${item.id}_${Date.now()}`,
    type: menuKey === 'misc' ? 'misc' : menuKey === 'drinks' ? 'drink' : 'food',
    name: item.name,
    menuKey,
    opts,
    extraNote,
    user: currentUser.name,
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };
  closeModal();
  pushOrder(order);
}

async function pushOrder(order) {
  const tId = currentTableId;
  const existing = tableData[tId] || { open: true, orders: [] };
  const orders = [...(existing.orders || []), order];
  await db.collection('tables').doc(tId).set({ ...existing, orders }, { merge: true });
  toast('Added: ' + order.name);
}

// ─── EXTRA NOTE ON ORDER ─────────────────────────────────────
function addExtraNote(orderId) {
  openModal(`
    <h3>Add Note</h3>
    <input class="modal-input" id="extra-note-input" placeholder="Extra note for this item...">
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveExtraNote('${orderId}')">Save Note</button>
    </div>
  `);
  setTimeout(() => document.getElementById('extra-note-input')?.focus(), 100);
}

async function saveExtraNote(orderId) {
  const note = document.getElementById('extra-note-input')?.value?.trim();
  if (!note) return closeModal();
  const tId = currentTableId;
  const existing = tableData[tId] || {};
  const orders = (existing.orders || []).map(o =>
    o.id === orderId ? { ...o, extraNote: o.extraNote ? o.extraNote + '; ' + note : note } : o
  );
  await db.collection('tables').doc(tId).set({ ...existing, orders }, { merge: true });
  closeModal();
  toast('Note added');
}

async function deleteOrder(orderId) {
  const tId = currentTableId;
  const existing = tableData[tId] || {};
  const orders = (existing.orders || []).filter(o => o.id !== orderId);
  await db.collection('tables').doc(tId).set({ ...existing, orders }, { merge: true });
  toast('Item removed');
}

// ─── RENDER ORDERS ───────────────────────────────────────────
function renderOrders(tId) {
  const tData = tableData[tId] || {};
  const orders = tData.orders || [];
  const el = document.getElementById('order-cards');

  // Allergen info bar
  const infoBar = document.getElementById('allergen-info-bar');
  const allergens = tData.allergens || [];
  const other = tData.otherAllergen || '';
  if (allergens.length > 0 || other) {
    infoBar.style.display = 'block';
    infoBar.innerHTML = `<strong style="color:#ffc107">⚠ Allergens:</strong> ${allergens.join(', ')}${other ? '; ' + other : ''}`;
  } else {
    infoBar.style.display = 'none';
  }

  if (!orders.length) {
    el.innerHTML = '<div class="empty-state">No orders yet — select from the menu above</div>';
    return;
  }

  el.innerHTML = orders.map(o => {
    const optLines = Object.entries(o.opts || {}).map(([k, v]) => v).join(' · ');
    return `
      <div class="order-card ${o.type}">
        <div class="card-header">
          <span class="card-name">${o.name}</span>
          <div class="card-meta">
            <span class="card-time">${o.time}</span>
            <span class="card-user">${o.user}</span>
          </div>
        </div>
        ${optLines ? `<div class="card-options">${optLines}</div>` : ''}
        ${o.extraNote ? `<div class="card-extra-note">📝 ${o.extraNote}</div>` : ''}
        <div class="card-actions">
          <button class="card-action-btn" onclick="addExtraNote('${o.id}')">+ Note</button>
          <button class="card-action-btn del" onclick="deleteOrder('${o.id}')">Remove</button>
        </div>
      </div>`;
  }).join('');
}

// ─── VAULT / ADMIN ────────────────────────────────────────────
function renderVault() {
  const el = document.getElementById('vault-user-list');
  if (!el) return;
  const users = Object.values(usersData).sort((a,b) => a.name.localeCompare(b.name));
  el.innerHTML = users.length ? users.map(u => `
    <div class="admin-user-row">
      <span class="u-name">${u.name}</span>
      <span class="u-role">${u.role || 'Staff'}</span>
      <button class="reset-pin-btn" onclick="adminResetPin('${u.id}')">Reset PIN</button>
      <button class="del-user-btn" onclick="adminDeleteUser('${u.id}')">✕</button>
    </div>
  `).join('') : '<div class="empty-state">No users yet</div>';
}

async function adminAddUser() {
  const name = document.getElementById('new-user-name')?.value?.trim();
  const role = document.getElementById('new-user-role')?.value?.trim() || 'Staff';
  if (!name) return toast('Enter a name');
  const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
  await db.collection('users').doc(id).set({ name, role, pin: '1234' });
  document.getElementById('new-user-name').value = '';
  document.getElementById('new-user-role').value = '';
  toast(`${name} added with PIN 1234`);
}

async function adminResetPin(uid) {
  await db.collection('users').doc(uid).update({ pin: '1234' });
  toast('PIN reset to 1234');
}

async function adminDeleteUser(uid) {
  const user = usersData[uid];
  openModal(`
    <h3>Delete User?</h3>
    <p>Remove <strong style="color:var(--gold)">${user?.name}</strong>? This cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-danger" onclick="confirmDeleteUser('${uid}')">Delete</button>
    </div>
  `);
}

async function confirmDeleteUser(uid) {
  await db.collection('users').doc(uid).delete();
  closeModal();
  toast('User deleted');
}

// ─── MODAL SYSTEM ────────────────────────────────────────────
function openModal(html) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  document.body.appendChild(overlay);
}

function closeModal() {
  const existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();
}

// ─── TOAST ────────────────────────────────────────────────────
let toastTimer;
function toast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  if (toastTimer) clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  toastTimer = setTimeout(() => t.remove(), 2200);
}

// ─── ROUTE: /vault ────────────────────────────────────────────
function checkRoute() {
  const path = window.location.pathname;
  if (path.endsWith('/vault') || path.endsWith('/vault/') || path.endsWith('/vault.html')) {
    initFirebase();
    renderVaultScreen();
    goTo('vault');
  } else {
    initFirebase();
    goTo('login');
  }
}

function renderVaultScreen() {
  // Vault screen needs its own simple auth
  const vaultEl = document.getElementById('screen-vault');
  vaultEl.innerHTML = `
    <div class="app-header">
      <h2>⚙ Admin Vault</h2>
      <a href="/" style="color:var(--text-dim);font-size:0.75rem;text-decoration:none;">← Back to App</a>
    </div>
    <div class="vault-content">
      <div class="vault-section">
        <h3>Staff Members</h3>
        <div id="vault-user-list" class="user-list-admin"></div>
        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;flex-wrap:wrap;">
          <input class="modal-input" id="new-user-name" placeholder="Full name" style="flex:1;margin:0;">
          <input class="modal-input" id="new-user-role" placeholder="Role (e.g. Waiter)" style="flex:1;margin:0;">
          <button class="btn-primary" onclick="adminAddUser()" style="flex:none;padding:0.6rem 1rem;">Add User</button>
        </div>
        <p style="margin-top:0.75rem;font-size:0.75rem;color:var(--text-dim)">New users default to PIN 1234. They can change it from the tables screen.</p>
      </div>
      <div class="vault-section">
        <h3>About</h3>
        <p style="font-size:0.85rem;color:var(--text-dim);line-height:1.6">
          Venney's Order Notes PWA<br>
          Menu data sourced from venneysatthegranby.co.uk<br>
          Built for internal use only.
        </p>
      </div>
    </div>
  `;
  // wait for usersData then render
  setTimeout(renderVault, 1000);
  db && db.collection('users').onSnapshot(() => renderVault());
}

// ─── DOM READY ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
  checkRoute();
});
