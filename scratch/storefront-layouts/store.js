const categories = [
  { id: "phone", name: "Điện thoại", well: "#e3f2fd" },
  { id: "laptop", name: "Laptop", well: "#ede7f6" },
  { id: "home", name: "Nhà cửa", well: "#fff3e0" },
  { id: "beauty", name: "Làm đẹp", well: "#fce4ec" },
  { id: "fashion", name: "Thời trang", well: "#e8f5e9" },
  { id: "book", name: "Sách", well: "#fff8e1" },
  { id: "grocery", name: "Bách hóa", well: "#f1f8e9" },
  { id: "baby", name: "Mẹ và bé", well: "#f3e5f5" },
];

const products = [
  { id: "p1", category: "phone", name: "Điện thoại A17 128GB", price: 8990000, listPrice: 10990000, sold: 2140, rating: 4.8, blurb: "Màn 6.1 inch, pin khoảng hai ngày, hai SIM." },
  { id: "p2", category: "phone", name: "Điện thoại C9 256GB", price: 6490000, listPrice: 7990000, sold: 860, rating: 4.6, blurb: "Bộ nhớ lớn, sạc nhanh, mặt lưng nhám." },
  { id: "p3", category: "laptop", name: "Laptop văn phòng 14 inch", price: 13490000, listPrice: 15990000, sold: 430, rating: 4.7, blurb: "Nhẹ, bàn phím êm, đủ cho họp và soạn thảo." },
  { id: "p4", category: "laptop", name: "Laptop học tập 15.6 inch", price: 11290000, listPrice: 12990000, sold: 275, rating: 4.5, blurb: "Màn lớn, khe RAM trống, pin một buổi học." },
  { id: "p5", category: "home", name: "Nồi chiên không dầu 5 lít", price: 1290000, listPrice: 1890000, sold: 3200, rating: 4.9, blurb: "Lòng nồi chống dính, hẹn giờ, dễ rửa." },
  { id: "p6", category: "home", name: "Bộ ga gối cotton đơn", price: 459000, listPrice: 620000, sold: 980, rating: 4.4, blurb: "Cotton mát, bo chun, giặt máy được." },
  { id: "p7", category: "beauty", name: "Serum vitamin C 30ml", price: 289000, listPrice: 420000, sold: 5400, rating: 4.8, blurb: "Dùng buổi sáng, thấm nhanh, không nhờn." },
  { id: "p8", category: "beauty", name: "Kem chống nắng 50ml", price: 199000, listPrice: 265000, sold: 4100, rating: 4.7, blurb: "SPF 50, không để lại vệt trắng." },
  { id: "p9", category: "fashion", name: "Áo thun cotton basic", price: 159000, listPrice: 249000, sold: 2300, rating: 4.6, blurb: "Form suông, cổ tròn, vài màu trơn." },
  { id: "p10", category: "fashion", name: "Giày sneaker trắng", price: 499000, listPrice: 790000, sold: 760, rating: 4.5, blurb: "Đế cao su, đi bộ cả ngày." },
  { id: "p11", category: "book", name: "Sách Làm ra việc", price: 89000, listPrice: 120000, sold: 6100, rating: 4.9, blurb: "Cách chia buổi làm và buổi nghỉ." },
  { id: "p12", category: "book", name: "Sách Ngủ ngon hơn", price: 76000, listPrice: 98000, sold: 1500, rating: 4.6, blurb: "Thói quen tối ngắn, dễ thử trong một tuần." },
  { id: "p13", category: "grocery", name: "Cà phê hạt 1kg", price: 189000, listPrice: 240000, sold: 2700, rating: 4.8, blurb: "Rang vừa, pha phin hoặc máy đều được." },
  { id: "p14", category: "grocery", name: "Nước rửa chén 3.8kg", price: 99000, listPrice: 135000, sold: 8900, rating: 4.7, blurb: "Can lớn, mùi chanh, hết bọt nhanh." },
  { id: "p15", category: "baby", name: "Tã quần size M 60 miếng", price: 239000, listPrice: 310000, sold: 4500, rating: 4.8, blurb: "Mỏng, thấm tốt, đai co giãn." },
  { id: "p16", category: "baby", name: "Bình sữa 240ml", price: 129000, listPrice: 175000, sold: 1200, rating: 4.6, blurb: "Cổ rộng, núm chậm, rửa bằng chổi." },
];

const strokes = {
  phone: '<rect x="22" y="8" width="20" height="48" rx="3"/><path d="M28 48h8"/>',
  laptop: '<rect x="12" y="14" width="40" height="28" rx="2"/><path d="M8 46h48"/>',
  home: '<path d="M10 30 32 12l22 18v22H10Z"/><path d="M28 52V36h8v16"/>',
  beauty: '<path d="M28 14h8l2 8H26l2-8z"/><rect x="26" y="22" width="12" height="28" rx="4"/>',
  fashion: '<path d="M22 16 32 24 42 16l8 12-8 4v20H22V32l-8-4 8-12z"/>',
  book: '<path d="M16 14h32v38H16z"/><path d="M16 14c6 6 12 6 16 0"/>',
  grocery: '<path d="M20 24h24l-4 26H24L20 24z"/><path d="M26 24c1-8 4-12 6-12s5 4 6 12"/>',
  baby: '<circle cx="32" cy="22" r="8"/><path d="M18 50c2-12 8-16 14-16s12 4 14 16"/>',
};

const state = {
  layout: "rail",
  view: "home",
  productId: null,
  query: "",
  category: "all",
  sort: "popular",
  cart: {},
  user: null,
  qty: 1,
  notice: "",
  order: null,
  form: { name: "", phone: "", password: "", address: "", note: "" },
  loginError: "",
  checkoutError: "",
  returnView: "home",
};

let noticeTimer = 0;

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function vnd(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

function soldLabel(count) {
  return new Intl.NumberFormat("vi-VN").format(count);
}

function off(product) {
  return Math.round((1 - product.price / product.listPrice) * 100);
}

function categoryById(id) {
  return categories.find((category) => category.id === id);
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function mark(categoryId) {
  return `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#27272a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${strokes[categoryId]}</svg>`;
}

function cartLines() {
  return Object.entries(state.cart)
    .map(([id, qty]) => ({ product: productById(id), qty }))
    .filter((line) => line.product && line.qty > 0);
}

function cartCount() {
  return cartLines().reduce((sum, line) => sum + line.qty, 0);
}

function cartTotal() {
  return cartLines().reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

function visibleProducts() {
  const query = state.query.trim().toLowerCase();
  const list = products.filter((product) => {
    const categoryOk = state.category === "all" || product.category === state.category;
    const queryOk = !query || product.name.toLowerCase().includes(query);
    return categoryOk && queryOk;
  });
  if (state.sort === "price") list.sort((a, b) => a.price - b.price);
  if (state.sort === "sold") list.sort((a, b) => b.sold - a.sold);
  return list;
}

function bagIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>';
}

function userIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.5-3 3.8-4.5 7-4.5S17.5 16 19 19"/></svg>';
}

function readHash() {
  const [layout, view, id] = location.hash.replace(/^#/, "").split("/");
  if (layout === "rail" || layout === "shelf" || layout === "search") state.layout = layout;
  if (["home", "product", "cart", "login", "checkout", "done"].includes(view)) state.view = view;
  if (id) state.productId = id;
}

function writeHash() {
  const parts = [state.layout, state.view];
  if (state.view === "product" && state.productId) parts.push(state.productId);
  const next = "#" + parts.join("/");
  if (location.hash !== next) history.replaceState(null, "", next);
}

function go(view) {
  state.view = view;
  window.scrollTo(0, 0);
  render();
}

function flash(text) {
  state.notice = text;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    state.notice = "";
    render();
  }, 1600);
  render();
}

function header() {
  const count = cartCount();
  const account = state.user
    ? `<button class="nav-btn" type="button" data-act="goto" data-view="login">${userIcon()} ${esc(state.user.phone)}</button>
       <button class="logout" type="button" data-act="logout">Thoát</button>`
    : `<button class="nav-btn" type="button" data-act="goto" data-view="login">${userIcon()} Đăng nhập</button>`;
  return `
    <header class="top">
      <div class="top-row">
        <button class="logo" type="button" data-act="home">${'<span class="logo-mark">' + bagIcon() + "</span>"}Mua</button>
        <form class="search" id="search-form">
          <input id="q" name="q" type="search" placeholder="Tìm sản phẩm" value="${esc(state.query)}" data-field="query">
          <button type="submit">Tìm kiếm</button>
        </form>
        <div class="actions">
          ${account}
          <button class="nav-btn" type="button" data-act="goto" data-view="cart">${bagIcon()} Giỏ hàng<span class="badge-count" data-empty="${count === 0}">${count}</span></button>
        </div>
      </div>
      <div class="loc">Giao đến <strong>Phường Bến Nghé, Quận 1</strong></div>
    </header>
    ${state.notice ? `<div class="notice" role="status">${esc(state.notice)}</div>` : ""}`;
}

function allMark() {
  return `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#27272a" stroke-width="2.2"><rect x="14" y="14" width="14" height="14"/><rect x="36" y="14" width="14" height="14"/><rect x="14" y="36" width="14" height="14"/><rect x="36" y="36" width="14" height="14"/></svg>`;
}

function categoryButtons(kind) {
  const items = [{ id: "all", name: "Tất cả", well: "#e7f1fd" }, ...categories];
  return items.map((category) => {
    const pressed = state.category === category.id;
    if (kind === "icon") {
      const icon = category.id === "all" ? allMark() : mark(category.id);
      return `<button type="button" class="icon-cat" data-act="category" data-id="${category.id}" aria-pressed="${pressed}"><span class="bubble" style="background:${category.well}">${icon}</span><span class="icon-label">${esc(category.name)}</span></button>`;
    }
    return `<button type="button" data-act="category" data-id="${category.id}" aria-pressed="${pressed}">${esc(category.name)}</button>`;
  }).join("");
}

function card(product) {
  const well = categoryById(product.category).well;
  return `
    <button class="card" type="button" data-act="open" data-id="${product.id}">
      <span class="art" style="--well:${well}">
        <span class="off">-${off(product)}%</span>
        ${mark(product.category)}
      </span>
      <span class="card-body">
        <span class="card-name">${esc(product.name)}</span>
        <span class="price-row"><span class="price">${vnd(product.price)}</span><span class="was">${vnd(product.listPrice)}</span></span>
        <span class="meta"><span class="star">★</span> ${product.rating} · Đã bán ${soldLabel(product.sold)}</span>
      </span>
    </button>`;
}

function heading() {
  const category = categoryById(state.category);
  if (state.query.trim()) return `Kết quả cho “${state.query.trim()}”`;
  if (category) return category.name;
  return state.layout === "search" ? "Tất cả sản phẩm" : "Gợi ý hôm nay";
}

function homeView() {
  const list = visibleProducts();
  const grid = list.length
    ? `<div class="grid">${list.map(card).join("")}</div>`
    : `<div class="empty"><h1>Không có sản phẩm khớp</h1><p>Thử từ khóa khác hoặc chọn Tất cả.</p></div>`;
  const sorts = [
    ["popular", "Phổ biến"],
    ["price", "Giá thấp"],
    ["sold", "Bán chạy"],
  ].map(([id, label]) => `<button type="button" data-act="sort" data-id="${id}" aria-pressed="${state.sort === id}">${label}</button>`).join("");
  return `
    ${header()}
    <div class="wrap">
      <div class="home-rail">
        <aside class="rail">
          <h2>Danh mục</h2>
          ${categoryButtons("list")}
        </aside>
        <div>
          <div class="shelf-only icons">${categoryButtons("icon")}</div>
          <section class="hero hero-rail">
            <div>
              <h2>Freeship mọi đơn</h2>
              <p>Thanh toán tiền mặt khi nhận hàng.</p>
            </div>
            <div class="hero-pills"><span>Nội thành</span><span>COD</span></div>
          </section>
          <section class="hero hero-shelf shelf-only">
            <div>
              <h2>Hàng sẵn, giao nội thành</h2>
              <p>Chọn danh mục hoặc tìm theo tên sản phẩm.</p>
            </div>
            <div class="hero-pills"><span>8 danh mục</span><span>COD</span></div>
          </section>
          <div class="search-only chips">${categoryButtons("list")}</div>
          <div class="search-only sortbar"><span>Sắp xếp</span>${sorts}</div>
          <div class="section-head">
            <h1>${esc(heading())}</h1>
            <span class="count">${list.length} sản phẩm</span>
          </div>
          ${grid}
        </div>
      </div>
    </div>`;
}

function productView() {
  const product = productById(state.productId);
  if (!product) {
    return `${header()}<div class="wrap"><div class="empty"><h1>Không thấy sản phẩm</h1><button class="btn btn-primary" type="button" data-act="home">Về trang chủ</button></div></div>`;
  }
  const category = categoryById(product.category);
  return `
    ${header()}
    <div class="wrap">
      <p class="crumb">
        <button type="button" data-act="home">Trang chủ</button>
        /
        <button type="button" data-act="category" data-id="${category.id}">${esc(category.name)}</button>
        / ${esc(product.name)}
      </p>
      <div class="product-layout">
        <div class="gallery-main" style="--well:${category.well}">${mark(product.category)}</div>
        <div class="buy">
          <h1>${esc(product.name)}</h1>
          <p class="meta"><span class="star">★</span> ${product.rating} · Đã bán ${soldLabel(product.sold)}</p>
          <div class="price-plate">
            <span class="price big">${vnd(product.price)}</span>
            <span class="was">${vnd(product.listPrice)}</span>
            <span class="off-chip">-${off(product)}%</span>
          </div>
          <dl class="specs">
            <dt>Danh mục</dt><dd>${esc(category.name)}</dd>
            <dt>Đã bán</dt><dd>${soldLabel(product.sold)}</dd>
            <dt>Thanh toán</dt><dd>Tiền mặt khi nhận hàng</dd>
          </dl>
          <p class="blurb">${esc(product.blurb)}</p>
          <div class="qty-row">
            <span>Số lượng</span>
            <div class="stepper">
              <button type="button" data-act="qty" data-dir="-1" aria-label="Giảm">−</button>
              <b>${state.qty}</b>
              <button type="button" data-act="qty" data-dir="1" aria-label="Tăng">+</button>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn btn-ghost" type="button" data-act="add">Thêm vào giỏ</button>
            <button class="btn btn-primary" type="button" data-act="buy">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>`;
}

function lineView(line) {
  const well = categoryById(line.product.category).well;
  return `
    <article class="line">
      <div class="thumb" style="--well:${well}">${mark(line.product.category)}</div>
      <div>
        <h3>${esc(line.product.name)}</h3>
        <span class="price">${vnd(line.product.price)}</span>
      </div>
      <div class="stepper">
        <button type="button" data-act="line" data-id="${line.product.id}" data-dir="-1" aria-label="Giảm">−</button>
        <b>${line.qty}</b>
        <button type="button" data-act="line" data-id="${line.product.id}" data-dir="1" aria-label="Tăng">+</button>
      </div>
      <div class="line-end">
        <span class="price">${vnd(line.product.price * line.qty)}</span>
        <button class="linkish" type="button" data-act="remove" data-id="${line.product.id}">Xóa</button>
      </div>
    </article>`;
}

function summaryBlock(buttonLabel, action) {
  const lines = cartLines();
  return `
    <aside class="summary">
      <div class="stack">
        <h2>Tạm tính</h2>
        <div class="sum-row"><span>${cartCount()} sản phẩm</span><span>${vnd(cartTotal())}</span></div>
        <div class="total-row"><span>Thành tiền</span><strong>${vnd(cartTotal())}</strong></div>
      </div>
      <button class="btn btn-primary" type="button" data-act="${action}" ${lines.length ? "" : "disabled"}>${buttonLabel}</button>
    </aside>`;
}

function cartView() {
  const lines = cartLines();
  const body = lines.length
    ? `<div class="cart-layout"><div class="lines">${lines.map(lineView).join("")}</div>${summaryBlock("Mua hàng", "checkout")}</div>`
    : `<div class="empty"><h1>Giỏ hàng trống</h1><p>Chọn một sản phẩm ở trang chủ.</p><button class="btn btn-primary" type="button" data-act="home">Tiếp tục mua sắm</button></div>`;
  return `${header()}<div class="wrap"><div class="cart-page"><h1 class="page-title">Giỏ hàng</h1>${body}</div></div>`;
}

function loginView() {
  return `
    ${header()}
    <div class="login-wrap">
      <div class="login-split">
        <aside class="login-aside">
          <h2>Mua hàng, trả khi nhận.</h2>
          <p>Đăng nhập để giữ số điện thoại cho đơn thanh toán tiền mặt.</p>
        </aside>
        <form class="login-card" id="login-form">
          <h1>Đăng nhập</h1>
          <p class="hint">Bản thử nhận mọi mật khẩu và không lưu tài khoản.</p>
          <label class="field">Số điện thoại
            <input id="login-phone" data-field="phone" inputmode="tel" autocomplete="off" value="${esc(state.form.phone)}">
          </label>
          <label class="field">Mật khẩu
            <input id="login-password" data-field="password" type="password" autocomplete="off" value="${esc(state.form.password)}">
          </label>
          ${state.loginError ? `<p class="error">${esc(state.loginError)}</p>` : ""}
          <button class="btn btn-primary" type="submit" style="width:100%;margin-top:16px">Đăng nhập</button>
        </form>
      </div>
    </div>`;
}

function checkoutView() {
  const lines = cartLines();
  if (!lines.length) {
    return `${header()}<div class="wrap"><div class="empty"><h1>Chưa có sản phẩm để đặt</h1><button class="btn btn-primary" type="button" data-act="home">Về trang chủ</button></div></div>`;
  }
  const loginHint = state.user
    ? ""
    : `<p class="hint"><button type="button" data-act="goto" data-view="login">Đăng nhập</button> để điền nhanh số điện thoại.</p>`;
  return `
    ${header()}
    <div class="wrap">
      <form id="checkout-form" class="checkout-layout">
        <div class="panel">
          <h1>Thanh toán</h1>
          ${loginHint}
          <h2>1. Địa chỉ giao hàng</h2>
          <label class="field">Họ và tên
            <input id="ship-name" data-field="name" autocomplete="off" value="${esc(state.form.name)}">
          </label>
          <label class="field">Số điện thoại
            <input id="ship-phone" data-field="phone" inputmode="tel" autocomplete="off" value="${esc(state.form.phone)}">
          </label>
          <label class="field">Địa chỉ
            <textarea id="ship-address" data-field="address">${esc(state.form.address)}</textarea>
          </label>
          <label class="field">Ghi chú
            <input id="ship-note" data-field="note" autocomplete="off" value="${esc(state.form.note)}">
          </label>
          <h2>2. Thanh toán khi nhận hàng</h2>
          <div class="pay">
            <span class="pay-mark" aria-hidden="true">✓</span>
            <span>Thanh toán tiền mặt khi nhận hàng<small>Trả shipper khi nhận được hàng. Không trừ tiền trước.</small></span>
          </div>
          ${state.checkoutError ? `<p class="error">${esc(state.checkoutError)}</p>` : ""}
        </div>
        <aside class="summary">
          <h2>3. Kiểm tra đơn</h2>
          ${lines.map((line) => `<div class="order-row"><span>${line.qty} × ${esc(line.product.name)}</span><span>${vnd(line.product.price * line.qty)}</span></div>`).join("")}
          <div class="total-row"><span>Thành tiền</span><strong>${vnd(cartTotal())}</strong></div>
          <button class="btn btn-primary" type="submit">Đặt hàng</button>
        </aside>
      </form>
    </div>`;
}

function doneView() {
  const order = state.order;
  if (!order) {
    return `${header()}<div class="wrap"><div class="empty"><h1>Chưa có đơn</h1><button class="btn btn-primary" type="button" data-act="home">Về trang chủ</button></div></div>`;
  }
  return `
    ${header()}
    <div class="wrap">
      <div class="done-card">
        <div class="check" aria-hidden="true">✓</div>
        <h1>Đặt hàng thành công</h1>
        <p>Mã đơn ${esc(order.id)}. Thanh toán tiền mặt khi nhận hàng.</p>
        <div class="order-row" style="margin-top:16px"><span>Người nhận</span><span>${esc(order.name)}</span></div>
        <div class="order-row"><span>Điện thoại</span><span>${esc(order.phone)}</span></div>
        <div class="order-row"><span>Địa chỉ</span><span>${esc(order.address)}</span></div>
        <div class="total-row"><span>Thành tiền</span><strong>${vnd(order.total)}</strong></div>
        <button class="btn btn-primary" type="button" data-act="home">Về trang chủ</button>
      </div>
    </div>`;
}

const views = {
  home: homeView,
  product: productView,
  cart: cartView,
  login: loginView,
  checkout: checkoutView,
  done: doneView,
};

function render() {
  const focus = document.activeElement;
  const focusId = focus && focus.id ? focus.id : "";
  const caret = focus && typeof focus.selectionStart === "number" ? focus.selectionStart : null;
  document.body.dataset.layout = state.layout;
  document.getElementById("app").innerHTML = views[state.view]();
  document.querySelectorAll("[data-layout-btn]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.layoutBtn === state.layout));
  });
  writeHash();
  if (!focusId) return;
  const next = document.getElementById(focusId);
  if (!next) return;
  next.focus();
  if (caret !== null && next.setSelectionRange) next.setSelectionRange(caret, caret);
}

function addCurrent(qty) {
  const product = productById(state.productId);
  if (!product) return;
  state.cart[product.id] = (state.cart[product.id] || 0) + qty;
}

function setLayout(layout) {
  state.layout = layout;
  window.scrollTo(0, 0);
  render();
}

document.addEventListener("click", (event) => {
  const layoutButton = event.target.closest("[data-layout-btn]");
  if (layoutButton) {
    setLayout(layoutButton.dataset.layoutBtn);
    return;
  }
  const target = event.target.closest("[data-act]");
  if (!target) return;
  const act = target.dataset.act;
  if (act === "home") {
    state.view = "home";
    window.scrollTo(0, 0);
    render();
  }
  if (act === "goto") {
    if (target.dataset.view === "login" && state.view !== "login") state.returnView = state.view;
    go(target.dataset.view);
  }
  if (act === "category") {
    state.category = target.dataset.id;
    state.query = "";
    state.view = "home";
    window.scrollTo(0, 0);
    render();
  }
  if (act === "open") {
    state.productId = target.dataset.id;
    state.qty = 1;
    go("product");
  }
  if (act === "qty") {
    state.qty = Math.max(1, state.qty + Number(target.dataset.dir));
    render();
  }
  if (act === "add" || act === "buy") addCurrent(state.qty);
  if (act === "add") flash("Đã thêm vào giỏ");
  if (act === "buy") go("checkout");
  if (act === "line") {
    const next = (state.cart[target.dataset.id] || 1) + Number(target.dataset.dir);
    if (next >= 1) state.cart[target.dataset.id] = next;
    render();
  }
  if (act === "remove") {
    delete state.cart[target.dataset.id];
    render();
  }
  if (act === "checkout") go("checkout");
  if (act === "logout") {
    state.user = null;
    render();
  }
  if (act === "sort") {
    state.sort = target.dataset.id;
    render();
  }
});

document.addEventListener("input", (event) => {
  const field = event.target.dataset.field;
  if (!field) return;
  if (field === "query") state.query = event.target.value;
  else state.form[field] = event.target.value;
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "search-form") {
    event.preventDefault();
    state.query = new FormData(event.target).get("q").trim();
    state.category = "all";
    go("home");
  }
  if (event.target.id === "login-form") {
    event.preventDefault();
    const phone = state.form.phone.trim();
    const password = state.form.password.trim();
    if (!phone || !password) {
      state.loginError = "Nhập số điện thoại và mật khẩu.";
      render();
      return;
    }
    state.user = { phone };
    state.loginError = "";
    state.form.password = "";
    go(state.returnView || "home");
  }
  if (event.target.id === "checkout-form") {
    event.preventDefault();
    const name = state.form.name.trim();
    const phone = state.form.phone.trim();
    const address = state.form.address.trim();
    if (!name || !phone || !address) {
      state.checkoutError = "Nhập họ tên, số điện thoại, và địa chỉ.";
      render();
      return;
    }
    const lines = cartLines();
    if (!lines.length) return;
    state.order = {
      id: "DH" + String(Date.now()).slice(-6),
      name,
      phone,
      address,
      total: cartTotal(),
      lines: lines.map((line) => ({ name: line.product.name, qty: line.qty, amount: line.product.price * line.qty })),
    };
    state.cart = {};
    state.checkoutError = "";
    go("done");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea")) return;
  if (event.key === "1") setLayout("rail");
  if (event.key === "2") setLayout("shelf");
  if (event.key === "3") setLayout("search");
});

readHash();
render();
