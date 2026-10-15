/* Meal Prep CEO dashboard.
   Pattern: CEO-DASHBOARD-PATTERN.md v2. Shapes: CEO-DATA-CONTRACTS.md.
   Hard rules held here:
   - Aggregates only. This app never reads a user folder,
     never renders a person's record, and holds no list of people.
   - The door is sign-in only. No account is ever created here.
   - Access rests on the owner record alone (_owner/config).
   - Reads: the owner aggregate record, the reviews, outreach
     and groups feeds the rules open to the owner, and the
     Avatars feed file. Nothing else.
   While the accounts config is empty (the Firebase project
   does not exist yet) the app runs in fixture mode on
   invented numbers, watermarked on screen. */
"use strict";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));
const money = (cents, currency) => cents == null ? "could not verify" :
  new Intl.NumberFormat("en-AU", { style: "currency", currency: currency || "AUD" }).format(cents / 100);
const pct = (r) => Math.round((r || 0) * 100) + "%";

const cfg = window.MP_ACCOUNT_CONFIG || {};
const configEmpty = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  .every((k) => !cfg[k]);
const fixtureMode = configEmpty || new URLSearchParams(location.search).get("fixture") === "1";

const AVATAR_CAST = [
  { id: "MP1", name: "Mia" },
  { id: "MP2", name: "Rosa" },
  { id: "MP3", name: "Jay" }
];
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "people", label: "People" },
  { id: "money", label: "Money" },
  { id: "reviews", label: "Reviews" },
  { id: "outreach", label: "Outreach" },
  { id: "community", label: "Community" },
  { id: "avatars", label: "Avatars" }
];

let state = null;
let currentSection = "overview";

/* ---------- rendering ---------- */

function show(view) {
  $("doorView").hidden = view !== "door";
  $("closedView").hidden = view !== "closed";
  $("dashView").hidden = view !== "dash";
}

function stat(num, label, note) {
  return `<div class="stat"><div class="stat-num">${esc(num)}</div>` +
    `<div class="stat-label">${esc(label)}</div>` +
    (note ? `<div class="stat-note">${esc(note)}</div>` : "") + `</div>`;
}

function renderNav() {
  $("sideNav").innerHTML = SECTIONS.map((s) =>
    `<button type="button" class="side-link" data-section="${s.id}" aria-current="${s.id === currentSection}">${s.label}</button>`
  ).join("");
  $("sideNav").querySelectorAll(".side-link").forEach((b) => {
    b.addEventListener("click", () => { currentSection = b.dataset.section; renderDash(); });
  });
}

function renderDash() {
  renderNav();
  const main = $("dashMain");
  const fn = {
    overview: viewOverview, people: viewPeople, money: viewMoney,
    reviews: viewReviews, outreach: viewOutreach,
    community: viewCommunity, avatars: viewAvatars
  }[currentSection];
  main.innerHTML = fn(state);
  main.focus({ preventScroll: true });
}

function viewOverview(s) {
  const a = s.aggregates;
  const weeks = a.signups.weeklySeries || [];
  let running = a.signups.total - weeks.reduce((t, w) => t + w.count, 0);
  const rows = weeks.map((w) => {
    running += w.count;
    return `<tr><td>Week of ${esc(w.week)}</td><td class="num">${w.count}</td><td class="num">${running}</td></tr>`;
  }).join("");
  return `<h2>Overview</h2>
    <p class="section-sub">Three questions, answered at a glance.</p>
    <div class="card-row">
      ${stat(a.signups.total, "How many joined", "+" + a.signups.newThisWeek + " this week")}
      ${stat(a.money.paying, "How is the money", "Paying plans, " + money(a.money.mrrEstimateCents, a.money.currency) + " a month (estimate)")}
      ${stat(a.money.pendingCancels + a.money.endedCancels, "Who is leaving", a.money.pendingCancels + " pending, " + a.money.endedCancels + " ended")}
    </div>
    <div class="panel"><h3>Week by week</h3>
      <table><thead><tr><th>Week</th><th class="num">Joined</th><th class="num">Total</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="3" class="honest">No weeks yet.</td></tr>'}</tbody></table>
    </div>`;
}

function viewPeople(s) {
  const a = s.aggregates;
  const series = a.signups.weeklySeries || [];
  const max = Math.max(1, ...series.map((w) => w.count));
  const bars = series.map((w) =>
    `<div class="bar-row"><div class="bar-label">${esc(w.week)}</div>` +
    `<div class="bar-track"><div class="bar-fill" style="width:${Math.round(w.count / max * 100)}%"></div></div>` +
    `<div class="bar-num">${w.count}</div></div>`).join("");
  return `<h2>People</h2>
    <p class="section-sub">Signups and the first steps that matter. Counts only, never a list of people.</p>
    <div class="card-row">
      ${stat(a.signups.total, "Signups, all time")}
      ${stat(a.signups.newThisWeek, "New this week")}
      ${stat(pct(a.people.activationRate), "Activated in 7 days", a.people.activated + " people planned a first meal")}
      ${stat(a.people.returning7d, "Returning in 7 days", "Activated, then back on days 2 to 7")}
    </div>
    <div class="panel"><h3>Activation</h3>
      <p>Activation for Meal Prep means <strong>first meal planned</strong>: the first meal a person puts on a day themselves, by adding, swapping, or running Plan my first week, within 7 days of signing up. Fills nobody chose do not count.</p>
    </div>
    <div class="panel"><h3>Signups by week</h3>${bars || '<p class="honest">No signups yet.</p>'}</div>`;
}

function viewMoney(s) {
  const m = s.aggregates.money;
  const reasons = (m.cancelReasons || []).map((r) =>
    `<div class="reason-line"><span class="tag">${r.status === "pending" ? "Pending" : "Ended"}</span> ${esc(r.reason)} <span class="honest">(${esc(r.week)})</span></div>`).join("");
  return `<h2>Money</h2>
    <p class="section-sub">Every subscription for Meal Prep lands here, and in no other app's dashboard.</p>
    <div class="card-row">
      ${stat(m.paying, "On a paying plan")}
      ${stat(money(m.mrrEstimateCents, m.currency), "Monthly income", "Estimate")}
      ${stat(m.failedPayments, "Failed payments", "Counted apart from cancels")}
      ${stat(money(m.netMovementCents, m.currency), "Net movement", "New minus cancelled, this period")}
    </div>
    <div class="panel"><h3>Cancels</h3>
      <div class="card-row">
        ${stat(m.pendingCancels, "Pending", "Still running to period end, not churn yet")}
        ${stat(m.endedCancels, "Ended")}
      </div>
      <h3>Reason lines</h3>
      ${reasons || '<p class="honest">No cancel reasons yet.</p>'}
    </div>
    <p class="estimate-note">The monthly income figure is an estimate for steering. The payment provider stays the accounting truth.</p>`;
}

function viewReviews(s) {
  const r = s.reviews;
  const rows = (r.inbox || []).map((v) =>
    `<tr><td>${esc(v.platform)}</td><td class="num">${esc(v.rating)} / 5</td>` +
    `<td><strong>${esc(v.title)}</strong><br>${esc(v.body)}<br><span class="honest">${esc(v.author)}, ${esc(v.date)}</span></td>` +
    `<td>${v.replied ? '<span class="tag">Replied</span>' : '<span class="tag tag-flag">Waiting</span>'}</td></tr>`).join("");
  return `<h2>Reviews</h2>
    <p class="section-sub">Store reviews for Meal Prep. Written by the stores' feeds when connected, by hand until then, never made up.</p>
    <div class="card-row">
      ${stat(r.count, "Reviews")}
      ${stat(r.unreplied, "Waiting for a reply")}
      ${stat(r.strangerReplies, "Stranger replies", "Notes from people we do not know")}
    </div>
    <div class="panel"><h3>Inbox</h3>
      <table><thead><tr><th>Store</th><th class="num">Rating</th><th>Review</th><th>Reply</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4" class="honest">No reviews yet.</td></tr>'}</tbody></table>
    </div>`;
}

function viewOutreach(s) {
  const c = (s.outreach && s.outreach.campaigns) || [];
  if (!c.length) {
    return `<h2>Outreach</h2>
      <p class="section-sub">The cold email area for Meal Prep.</p>
      <div class="panel"><p class="honest">Not running yet. This area opens when the first cold email campaign runs for Meal Prep, and fills with its campaigns, sends, and replies.</p></div>`;
  }
  const rows = c.map((x) =>
    `<tr><td>${esc(x.name)}</td><td>${esc(x.status)}</td><td class="num">${x.sent}</td><td class="num">${x.replies}</td><td>${esc(x.updatedAt || "")}</td></tr>`).join("");
  return `<h2>Outreach</h2>
    <p class="section-sub">Cold email campaigns for Meal Prep.</p>
    <div class="panel"><table><thead><tr><th>Campaign</th><th>Status</th><th class="num">Sent</th><th class="num">Replies</th><th>Updated</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

function viewCommunity(s) {
  const rows = (s.groups || []).map((g) => {
    const growth = g.members - g.membersLastWeek;
    return `<tr><td>${esc(g.name)}</td><td class="num">${g.members}</td>` +
      `<td class="num">${growth >= 0 ? "+" : ""}${growth}</td><td class="num">${g.postsThisWeek}</td>` +
      `<td><span class="tag">${g.source === "connected" ? "Connected feed" : "By hand"}</span></td></tr>`;
  }).join("");
  return `<h2>Community</h2>
    <p class="section-sub">Facebook community groups for Meal Prep. Every number is labelled by where it came from.</p>
    <div class="panel"><table><thead><tr><th>Group</th><th class="num">Members</th><th class="num">Growth this week</th><th class="num">Posts this week</th><th>Source</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" class="honest">No groups tracked yet.</td></tr>'}</tbody></table></div>`;
}

function railsOk(p) {
  return p.disclosure === "y" && p.aiLabel === "y" && p.metadataZero === "y";
}
function railTags(p) {
  const t = (ok, label) => `<span class="tag ${ok ? "" : "tag-flag"}">${label}: ${ok ? "yes" : "no"}</span>`;
  return t(p.disclosure === "y", "Disclosure") + " " + t(p.aiLabel === "y", "AI label") + " " + t(p.metadataZero === "y", "Metadata zero");
}
function viewsThisWeek(pieces, refDate) {
  const ref = new Date(refDate);
  const start = new Date(ref); start.setDate(ref.getDate() - 6);
  return pieces.filter((p) => { const d = new Date(p.date); return d >= start && d <= ref; })
    .reduce((t, p) => t + (p.views || 0), 0);
}

function viewAvatars(s) {
  const pieces = s.avatarPieces || [];
  const refDate = fixtureMode
    ? pieces.reduce((max, p) => (p.date > max ? p.date : max), "1970-01-01")
    : new Date().toISOString().slice(0, 10);
  const cards = AVATAR_CAST.map((a) => {
    const mine = pieces.filter((p) => p.presenterId === a.id);
    const shipped = mine.filter(railsOk);
    const verifiable = shipped.filter((p) => p.salesCount != null);
    const viewsTotal = shipped.reduce((t, p) => t + (p.views || 0), 0);
    const tapsCount = verifiable.reduce((t, p) => t + p.salesCount, 0);
    const tapsAmount = verifiable.reduce((t, p) => t + (p.salesAmountCents || 0), 0);
    const rows = mine.map((p) => {
      const ok = railsOk(p);
      const taps = p.salesCount == null ? "could not verify" : p.salesCount + " (" + money(p.salesAmountCents, p.currency) + ")";
      return `<tr${ok ? "" : ' class="piece-held"'}>
        <td><strong>${esc(p.contentLine)}</strong><br><span class="honest">${esc(p.platform)}, ${esc(p.date)}</span>` +
        (ok ? "" : `<br><span class="piece-flag">Held back: a trust rail is missing, so this piece is left out of the totals.</span>`) +
        `<br>${railTags(p)}</td>
        <td class="num">${p.views}</td><td class="num">${pct(p.watchRate)}</td>
        <td class="num">${p.sends}</td><td class="num">${p.saves}</td><td class="num">${esc(taps)}</td></tr>`;
    }).join("");
    return `<div class="panel"><h3>${esc(a.name)} <span class="honest">(${esc(a.id)})</span></h3>
      <div class="card-row">
        ${stat(viewsTotal, "Views, all time", "Shipped pieces only")}
        ${stat(viewsThisWeek(shipped, refDate), "Views, this week")}
        ${stat(tapsCount, "Site taps", "Sales, while the stores are not open yet")}
        ${stat(money(tapsAmount, "AUD"), "Site tap amount")}
      </div>
      <table><thead><tr><th>Piece</th><th class="num">Views</th><th class="num">Watched</th><th class="num">Sends</th><th class="num">Saves</th><th class="num">Site taps</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6" class="honest">No pieces yet.</td></tr>'}</tbody></table>
    </div>`;
  }).join("");
  return `<h2>Avatars</h2>
    <p class="section-sub">Meal Prep's own presenters only. A sale counts as a site tap only when the payment record names the piece; anything else reads could not verify and stays out of the totals.</p>
    ${cards}`;
}

/* ---------- fixture mode ---------- */

function startFixture() {
  state = structuredClone(window.MP_FIXTURES);
  $("fixtureRibbon").hidden = false;
  $("fixtureMark").hidden = false;
  $("dashSignOut").hidden = true;
  $("weekLabel").textContent = "Fixture data";
  show("dash");
  renderDash();
}

/* ---------- live mode (Firebase) ---------- */

let auth = null, db = null, fb = null;

async function loadFirebase() {
  const base = "https://www.gstatic.com/firebasejs/10.12.2/";
  const [appM, authM, fsM] = await Promise.all([
    import(base + "firebase-app.js"),
    import(base + "firebase-auth.js"),
    import(base + "firebase-firestore.js")
  ]);
  const app = appM.initializeApp(cfg);
  auth = authM.getAuth(app);
  db = fsM.getFirestore(app);
  fb = { authM, fsM };
  return authM.onAuthStateChanged(auth, onUser);
}

async function onUser(user) {
  if (!user) { show("door"); return; }
  let owner = false;
  try {
    const snap = await fb.fsM.getDoc(fb.fsM.doc(db, "_owner", "config"));
    const uids = snap.exists() ? (snap.data().uids || []) : [];
    owner = uids.includes(user.uid);
  } catch (e) { owner = false; }
  if (!owner) { show("closed"); return; }
  state = await loadLiveState();
  $("weekLabel").textContent = "Live data";
  show("dash");
  renderDash();
}

async function loadLiveState() {
  const { getDoc, getDocs, doc, collection } = fb.fsM;
  const out = {
    aggregates: { signups: { total: 0, newThisWeek: 0, weeklySeries: [] },
      people: { activated: 0, activationRate: 0, returning7d: 0 },
      money: { currency: "AUD", paying: 0, pendingCancels: 0, endedCancels: 0,
        failedPayments: 0, mrrEstimateCents: 0, netMovementCents: 0, cancelReasons: [] } },
    reviews: { count: 0, unreplied: 0, strangerReplies: 0, inbox: [] },
    outreach: { campaigns: [] }, groups: [], avatarPieces: []
  };
  const aggSnap = await getDoc(doc(db, "_owner", "aggregates"));
  if (aggSnap.exists()) {
    const a = aggSnap.data();
    if (a.signups) out.aggregates.signups = a.signups;
    if (a.people) out.aggregates.people = a.people;
    if (a.money) out.aggregates.money = a.money;
    if (a.reviewsMeta && a.reviewsMeta.strangerReplies != null) {
      out.reviews.strangerReplies = a.reviewsMeta.strangerReplies;
    }
  }
  const revSnap = await getDocs(collection(db, "reviews"));
  out.reviews.inbox = revSnap.docs.map((d) => d.data());
  out.reviews.count = out.reviews.inbox.length;
  out.reviews.unreplied = out.reviews.inbox.filter((v) => !v.replied).length;
  const outSnap = await getDocs(collection(db, "outreach"));
  out.outreach.campaigns = outSnap.docs.map((d) => d.data());
  const grpSnap = await getDocs(collection(db, "groups"));
  out.groups = grpSnap.docs.map((d) => d.data());
  try {
    const res = await fetch("avatars-feed.json", { cache: "no-store" });
    if (res.ok) {
      const feed = await res.json();
      out.avatarPieces = Array.isArray(feed) ? feed : (feed.pieces || []);
    }
  } catch (e) { /* no feed file yet: the cast renders its honest empty state */ }
  return out;
}

function doorError(msg) {
  const el = $("doorError");
  el.textContent = msg;
  el.hidden = !msg;
}

function wireDoor() {
  const { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } = fb.authM;
  const attempt = async (p) => {
    doorError("");
    try { await p; } catch (e) {
      doorError("That sign-in did not work. Check the details and try again.");
    }
  };
  $("doorGoogle").addEventListener("click", () => attempt(signInWithPopup(auth, new GoogleAuthProvider())));
  $("doorApple").addEventListener("click", () => attempt(signInWithPopup(auth, new OAuthProvider("apple.com"))));
  $("doorForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    attempt(signInWithEmailAndPassword(auth, $("doorEmail").value.trim(), $("doorPassword").value));
  });
  const out = () => signOut(auth);
  $("closedSignOut").addEventListener("click", out);
  $("dashSignOut").addEventListener("click", out);
}

/* ---------- boot ---------- */

if (fixtureMode) {
  startFixture();
} else {
  show("door");
  loadFirebase()
    .then(wireDoor)
    .catch(() => doorError("Could not reach the sign-in service. Try again in a moment."));
}
