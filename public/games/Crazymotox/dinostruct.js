var oe = Object.defineProperty;
var ce = (s, e, t) => e in s ? oe(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var c = (s, e, t) => ce(s, typeof e != "symbol" ? e + "" : e, t);
var ue = Object.defineProperty, le = (s, e, t) => e in s ? ue(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, m = (s, e, t) => le(s, typeof e != "symbol" ? e + "" : e, t), k;
typeof process < "u" && ((k = process.versions) != null && k.node);
var R;
typeof self == "object" && ((R = self.constructor) == null || R.name);
var j, N;
class p extends (N = Error, j = Symbol.toStringTag, N) {
  /**
   * Initializes a new instance of the {@link Exception} class.
   *
   * ```ts
   * throw new Exception("An error occurred while processing the request.");
   * ```
   *
   * @param message The message that describes the error.
   * @param cause The previous caught error that caused this one, if any.
   * @param name The name of the exception. Default is `"Exception"`.
   */
  constructor(e, t, n = "Exception") {
    super(e), m(this, j, "Exception"), this.cause = t, this.name = n, t && (t instanceof Error ? this.stack += `

Caused by ${t.stack}` : this.stack += `

Caused by ${t}`);
  }
  /**
   * A static method to convert a generic caught error, ensuring it's an instance of the {@link Exception} class.
   *
   * ```ts
   * try { [...] }
   * catch (error)
   * {
   *     const exc = Exception.FromUnknown(error);
   *
   *     [...]
   * }
   * ```
   *
   * @param error The caught error to convert.
   *
   * @returns An instance of the {@link Exception} class.
   */
  static FromUnknown(e) {
    if (e instanceof p)
      return e;
    if (e instanceof Error) {
      const t = new p(e.message);
      return t.stack = e.stack, t.name = e.name, t;
    }
    return new p(`${e}`);
  }
}
var z, $;
class de extends ($ = p, z = Symbol.toStringTag, $) {
  /**
   * Initializes a new instance of the {@link TimeoutException} class.
   *
   * ```ts
   * throw new TimeoutException("The task took too long to complete.");
   * ```
   *
   * @param message The message that describes the error.
   * @param cause The previous caught error that caused this one, if any.
   * @param name The name of the exception. Default is `"TimeoutException"`.
   */
  constructor(e, t, n = "TimeoutException") {
    super(e, t, n), m(this, z, "TimeoutException");
  }
}
var C, V;
class fe extends (V = p, C = Symbol.toStringTag, V) {
  /**
   * Initializes a new instance of the {@link ValueException} class.
   *
   * ```ts
   * throw new ValueException("The 'grade' argument cannot be negative.");
   * ```
   *
   * @param message The message that describes the error.
   * @param cause The previous caught error that caused this one, if any.
   * @param name The name of the exception. Default is `"ValueException"`.
   */
  constructor(e, t, n = "ValueException") {
    super(e, t, n), m(this, C, "ValueException");
  }
}
var ne;
ne = Symbol.toStringTag;
const he = class re {
  /**
   * Initializes a new instance of the {@link SmartPromise} class.
   *
   * ```ts
   * const promise = new SmartPromise<string>((resolve, reject) =>
   * {
   *     setTimeout(() => resolve("Hello, World!"), 1_000);
   * });
   * ```
   *
   * @param executor
   * The function responsible for eventually resolving or rejecting the promise.  
   * Similarly to the native {@link Promise} object, it's immediately executed after the promise is created.
   */
  constructor(e) {
    m(this, "_isPending"), m(this, "_isFulfilled"), m(this, "_isRejected"), m(this, "_promise"), m(this, ne, "SmartPromise"), this._isPending = !0, this._isFulfilled = !1, this._isRejected = !1;
    const t = (r) => (this._isPending = !1, this._isFulfilled = !0, r), n = (r) => {
      throw this._isPending = !1, this._isRejected = !0, r;
    };
    this._promise = new Promise(e).then(t, n);
  }
  /**
   * Wraps a new {@link SmartPromise} object around an existing native {@link Promise} object.
   *
   * ```ts
   * const request = fetch("https://api.example.com/data");
   * const smartRequest = SmartPromise.FromPromise(request);
   *
   * console.log(request.isPending); // Throws an error: `isPending` is not a property of `Promise`.
   * console.log(smartRequest.isPending); // true
   *
   * const response = await request;
   * console.log(smartRequest.isFulfilled); // true
   * ```
   *
   * @param promise The promise to wrap.
   *
   * @returns A new {@link SmartPromise} object that wraps the provided promise.
   */
  static FromPromise(e) {
    return new re((t, n) => e.then(t, n));
  }
  /**
   * A flag indicating whether the promise is still pending or not.
   */
  get isPending() {
    return this._isPending;
  }
  /**
   * A flag indicating whether the promise has been fulfilled or not.
   */
  get isFulfilled() {
    return this._isFulfilled;
  }
  /**
   * A flag indicating whether the promise has been rejected or not.
   */
  get isRejected() {
    return this._isRejected;
  }
  then(e, t) {
    return this._promise.then(e, t);
  }
  catch(e) {
    return this._promise.catch(e);
  }
  /**
   * Attaches a callback that executes right after the promise is settled, regardless of the outcome.
   *
   * ```ts
   * const promise = new SmartPromise((resolve, reject) =>
   * {
   *     setTimeout(resolve, Math.random() * 1_000);
   *     setTimeout(reject, Math.random() * 1_000);
   * });
   *
   *
   * promise
   *     .then(() => console.log("OK!")) // Logs "OK!" if the promise is fulfilled.
   *     .catch(() => console.log("KO!")) // Logs "KO!" if the promise is rejected.
   *     .finally(() => console.log("Done!")); // Always logs "Done!".
   * ```
   *
   * @param onFinally The callback to execute when once promise is settled.
   *
   * @returns A new {@link Promise} that executes the callback once the promise is settled.
   */
  finally(e) {
    return this._promise.finally(e);
  }
};
let me = he;
var O, M;
class ge extends (M = me, O = Symbol.toStringTag, M) {
  /**
   * Initializes a new instance of the {@link TimedPromise} class.
   *
   * ```ts
   * const promise = new TimedPromise<string>((resolve, reject) =>
   * {
   *    setTimeout(() => resolve("Hello, World!"), Math.random() * 10_000);
   *
   * }, 5_000);
   * ```
   *
   * @param executor
   * The function responsible for eventually resolving or rejecting the promise.  
   * Similarly to the native {@link Promise} object, it's immediately executed after the promise is created.
   *
   * @param timeout The maximum time in milliseconds that the operation can take before timing out.
   */
  constructor(e, t) {
    super((n, r) => {
      const a = (l) => {
        clearTimeout(u), n(l);
      }, o = (l) => {
        clearTimeout(u), r(l);
      }, u = setTimeout(() => o(new de("The operation has timed out.")), t);
      e(a, o);
    }), m(this, O, "TimedPromise");
  }
}
function be(s) {
  let e = 0;
  for (let t = 0; t < s.length; t += 1) {
    const n = s.charCodeAt(t);
    e = (e << 5) - e + n, e |= 0;
  }
  return e;
}
function T(s) {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}
const d = [];
for (let s = 0; s < 256; ++s)
  d.push((s + 256).toString(16).slice(1));
function ye(s, e = 0) {
  return (d[s[e + 0]] + d[s[e + 1]] + d[s[e + 2]] + d[s[e + 3]] + "-" + d[s[e + 4]] + d[s[e + 5]] + "-" + d[s[e + 6]] + d[s[e + 7]] + "-" + d[s[e + 8]] + d[s[e + 9]] + "-" + d[s[e + 10]] + d[s[e + 11]] + d[s[e + 12]] + d[s[e + 13]] + d[s[e + 14]] + d[s[e + 15]]).toLowerCase();
}
let S;
const pe = new Uint8Array(16);
function Ue() {
  if (!S) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    S = crypto.getRandomValues.bind(crypto);
  }
  return S(pe);
}
const we = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), J = { randomUUID: we };
function H(s, e, t) {
  var r;
  if (J.randomUUID && !s)
    return J.randomUUID();
  s = s || {};
  const n = s.random ?? ((r = s.rng) == null ? void 0 : r.call(s)) ?? Ue();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, ye(n);
}
function I(s, e, ...t) {
  return s.callFunction(e, ...t);
}
function ve(s, e, t) {
  return s.globalVars[e] ?? t;
}
function Ee(s, e, t) {
  s.globalVars[e] = t;
}
async function Se(s, e, t) {
  return await s.objects[e].getFirstPickedInstance().setJsonDataCopy(t);
}
var W, Y;
class _ extends (Y = fe, W = Symbol.toStringTag, Y) {
  constructor(t, n, r = "UserException") {
    super(t, n, r);
    c(this, W, "UserException");
  }
}
var q, X;
class F extends (X = _, q = Symbol.toStringTag, X) {
  constructor(t, n, r = "UserNotLoggedInException") {
    super(t, n, r);
    c(this, q, "UserNotLoggedInException");
  }
}
var Z, ee;
class Ie extends (ee = _, Z = Symbol.toStringTag, ee) {
  constructor(t, n, r = "UserAlreadyExistsException") {
    super(t, n, r);
    c(this, Z, "UserAlreadyExistsException");
  }
}
var se, te;
class De extends (te = _, se = Symbol.toStringTag, te) {
  constructor(t, n, r = "UserNotExistsException") {
    super(t, n, r);
    c(this, se, "UserNotExistsException");
  }
}
let D;
function h(s) {
  if (s)
    return globalThis.sparshaFirebase.myAuth[s];
  if (D)
    return D;
  const e = globalThis.sparshaFirebase.myAuth, t = Object.keys(e);
  if (!t.length)
    throw new Error("No `Auth` instances found. Please, enable the `Auth` on the FirebaseSDK.");
  if (t.length !== 1)
    throw new Error("Multiple `Auth` instances found. Please, specify the `sdkName` name.");
  return D = e[t[0]];
}
function xe(s) {
  return globalThis.sparshaFirebase.auth.signInAnonymously(s);
}
function Te(s) {
  return globalThis.sparshaFirebase.auth.signOut(s);
}
let x;
function b(s) {
  if (s)
    return globalThis.sparshaFirebase.myFirestore[s];
  if (x)
    return x;
  const e = globalThis.sparshaFirebase.myFirestore, t = Object.keys(e);
  if (!t.length)
    throw new Error("No `Firestore` instances found. Please, enable the `Firestore` on the FirebaseSDK.");
  if (t.length !== 1)
    throw new Error("Multiple `Firestore` instances found. Please, specify the `sdkName` name.");
  return x = e[t[0]];
}
function v(s, e, ...t) {
  return globalThis.sparshaFirebase.firestore.collection(s, e, ...t);
}
function y(s, e, ...t) {
  return globalThis.sparshaFirebase.firestore.doc(s, e, ...t);
}
function ae(s, e) {
  return globalThis.sparshaFirebase.firestore.addDoc(s, e);
}
function U(s) {
  return globalThis.sparshaFirebase.firestore.getDoc(s);
}
function Fe(s, e, t) {
  return globalThis.sparshaFirebase.firestore.setDoc(s, e, t);
}
function Le(s, e, t, ...n) {
  const r = e;
  return globalThis.sparshaFirebase.firestore.updateDoc(s, r, t, ...n);
}
function _e(s) {
  return globalThis.sparshaFirebase.firestore.getDocs(s);
}
function Ae(s, e) {
  return globalThis.sparshaFirebase.firestore.onSnapshot(s, e);
}
async function G(s, e = 5e3) {
  let t = () => {
  };
  try {
    let n = !0;
    return await new ge((r) => {
      t = Ae(s, (a) => {
        n || r(a), n = !1;
      });
    }, e);
  } finally {
    t();
  }
}
function A() {
  return globalThis.sparshaFirebase.firestore.serverTimestamp();
}
const Pe = [
  "anonymousLogin",
  "completeEmailLogin",
  "login",
  "logout",
  "loadUser",
  "generatePath",
  "getImageUrl",
  "getLeaderboard",
  "getQuestions",
  "register",
  "saveScore",
  "sendVerificationEmail",
  "startEmailLogin",
  "startResetPassword",
  "submitAnswer",
  "submitQuestion",
  "updateUser",
  "uploadImage"
], ke = [
  "Balls",
  "Leaderboard",
  "Questions",
  "Path"
], Re = [
  "APP_ID",
  "EmailAddress",
  "ImageUrl",
  "ImageUuid",
  "PlayerSkin",
  "Username",
  "UserId"
];
class w {
  constructor() {
    c(this, "_runtime");
    c(this, "_logEvent");
    c(this, "deviceId");
    c(this, "sessionId");
    c(this, "sdkName");
    c(this, "defaultRegion");
    c(this, "functions");
    c(this, "jsonDatas");
    c(this, "variables");
    c(this, "useId");
    c(this, "storeUser");
    c(this, "useEmail");
    c(this, "verifyEmail");
    c(this, "useUsername");
    c(this, "hashLimit");
    c(this, "usernameLimit");
    c(this, "usernameCapitalize");
    c(this, "usernameUppercase");
    c(this, "sanitizeUsername");
    c(this, "usePlayerSkin");
    c(this, "useAnalytics");
    c(this, "analyticsCustomHost");
    c(this, "timeout");
  }
  static _InitializeFunctions(e, t = {}) {
    const n = {};
    for (const r of Pe) {
      let { onSuccess: a, onError: o } = t[r] ?? {};
      a === void 0 && (a = `On${T(r)}Success`), o === void 0 && (o = `On${T(r)}Error`);
      const u = {
        onSuccess: a ? (...l) => I(e, a, ...l) : () => {
        },
        onError: o ? (l) => {
          l instanceof Error && (l = l.message);
          try {
            I(e, o, l);
          } catch (f) {
            console.error(f);
          }
        } : () => {
        }
      };
      n[r] = u;
    }
    return n;
  }
  static _InitializeJsonDatas(e, t = {}) {
    const n = {};
    for (const r of ke) {
      const a = t[r] ?? `${r}JsonData`, o = { save: (u) => Se(e, a, u) };
      n[r] = o;
    }
    return n;
  }
  static _InitializeVariables(e, t = {}) {
    const n = {};
    for (const r of Re) {
      let a = t[r];
      a === void 0 && (a = r);
      const o = {
        get: a ? () => ve(e, a) : () => {
        },
        set: a ? (u) => Ee(e, a, u) : () => {
        }
      };
      n[r] = o;
    }
    return n;
  }
  async _logInitEvent() {
    const t = await (await fetch("https://api.ipify.org/")).text();
    let n;
    globalThis.matchMedia("(display-mode: standalone)").matches ? n = "standalone" : globalThis.matchMedia("(display-mode: minimal-ui)").matches ? n = "minimal-ui" : globalThis.matchMedia("(display-mode: fullscreen)").matches ? n = "fullscreen" : n = "browser";
    const r = {
      displayMode: n,
      ipAddress: t,
      language: navigator.language,
      screen: {
        width: globalThis.screen.width,
        height: globalThis.screen.height,
        orientation: globalThis.screen.orientation.type,
        colorDepth: globalThis.screen.colorDepth,
        pixelDepth: globalThis.screen.pixelDepth,
        maxTouchPoints: globalThis.navigator.maxTouchPoints
      },
      userAgent: navigator.userAgent,
      version: 2
    };
    await this.logEvent("game:init", r, !1);
  }
  async initialize(e, t = {}) {
    this._runtime = e;
    let n = await this._runtime.storage.getItem("dinostruct:internal:deviceId");
    n || (n = H(), await this._runtime.storage.setItem("dinostruct:internal:deviceId", n)), this.deviceId = n, this.sessionId = H(), this.sdkName = t.sdkName ?? "FirebaseSDK", this.defaultRegion = t.defaultRegion ?? "europe-west8", this.functions = w._InitializeFunctions(e, t.functions), this.jsonDatas = w._InitializeJsonDatas(e, t.jsonDatas), this.variables = w._InitializeVariables(e, t.variables), this.useId = t.useId ?? !1, this.storeUser = t.storeUser ?? !1, this.useEmail = t.useEmail ?? !1, this.verifyEmail = t.verifyEmail ?? !1, this.useUsername = t.useUsername ?? !1, this.hashLimit = t.hashLimit ?? 5, this.usernameLimit = t.usernameLimit ?? 20, this.usernameCapitalize = t.usernameCapitalize ?? !0, this.usernameUppercase = t.usernameUppercase ?? !1, this.sanitizeUsername = t.sanitizeUsername ?? !0, this.usePlayerSkin = t.usePlayerSkin ?? !1, this.useAnalytics = t.useAnalytics ?? !0, this.analyticsCustomHost = t.analyticsCustomHost, this.timeout = t.timeout ?? 5e3, this.useAnalytics && (this.analyticsCustomHost ? this._logEvent = async (r, a = !0) => {
      const o = {
        ...r,
        deviceId: this.deviceId,
        sessionId: this.sessionId
      }, l = h(this.sdkName).currentUser;
      if (l)
        o.userId = l.uid;
      else if (a)
        throw new F("User not yet logged in");
      const f = await fetch(this.analyticsCustomHost, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(o)
      });
      if (!f.ok)
        throw new Error(`Failed to log event: ${f.statusText}`);
    } : this._logEvent = async (r, a = !0) => {
      const o = b(this.sdkName), u = v(o, "rawEvents"), l = {
        ...r,
        deviceId: this.deviceId,
        sessionId: this.sessionId,
        timestamp: A()
      }, P = h(this.sdkName).currentUser;
      if (P)
        l.userId = P.uid;
      else if (a)
        throw new F("User not yet logged in");
      await ae(u, l);
    }, this._logInitEvent());
  }
  callFunction(e, ...t) {
    return I(this._runtime, e, ...t);
  }
  async logEvent(e, t = {}, n = !0) {
    this.useAnalytics && (await this._logEvent({ type: e, payload: t }, n), console.log(`Event logged: "${e}"`));
  }
}
const i = new w();
function E(s) {
  const e = { dateStyle: "short", timeStyle: "short" };
  return new Intl.DateTimeFormat(void 0, e).format(s);
}
function L(s) {
  return s.toDate ? E(s.toDate()) : s._seconds ? E(new Date(s._seconds * 1e3)) : E();
}
function g(s, e) {
  if (!i.sanitizeUsername)
    return s;
  let t = s.replaceAll(/((?![a-z]).)+/gi, "-").replaceAll(/-$/g, "").split("-");
  i.usernameUppercase ? t = t.map((o) => o.toUpperCase()) : i.usernameCapitalize && (t = t.map(T));
  const n = t.join("-").substring(0, i.usernameLimit), r = be(e), a = `${Math.abs(r)}`.substring(0, i.hashLimit);
  return `${n}#${a}`;
}
const K = (s) => {
  if (s.exists())
    return { id: s.id, ...s.data() };
}, je = ({ username: s, rank: e, count: t, score: n, payload: r, timestamp: a }) => ({
  username: s,
  rank: e,
  count: t,
  score: n,
  payload: r,
  timestamp: L(a)
});
async function ie(s, e) {
  const t = y(s.ref, "bestScores", e.uid), [n, r] = await Promise.all([
    U(s.ref).then(K),
    U(t).then(K)
  ]), a = {
    lastUpdate: E(),
    topScores: [],
    user: {
      username: e.username,
      rank: -1,
      count: 0,
      score: 0,
      payload: {},
      timestamp: "--/--/-- --:--:--"
    }
  };
  return n && (a.lastUpdate = L(n.lastUpdate), a.topScores = n.topScores.map(je), r && (a.user.username = r.username, a.user.rank = r.rank, a.user.count = r.count, a.user.score = r.score, a.user.payload = r.payload, a.user.timestamp = L(r.timestamp))), a;
}
async function Ne(s = null) {
  try {
    const e = h().currentUser;
    if (e === null)
      throw new Error("User isn't yet logged in.");
    const t = b(), n = y(t, "leaderboards", s ?? "global");
    let r;
    i.useUsername ? r = i.variables.Username.get() ?? g("User", e.uid) : r = g("User", e.uid);
    const a = { uid: e.uid, username: r }, o = await U(n), u = { [o.id]: await ie(o, a) };
    await i.jsonDatas.Leaderboard.save(u), console.log("Leaderboard retrieved successfully."), i.functions.getLeaderboard.onSuccess();
  } catch (e) {
    throw i.functions.getLeaderboard.onError(e), e;
  }
}
async function Oe() {
  try {
    const s = h().currentUser;
    if (s === null)
      throw new Error("User isn't yet logged in.");
    const e = b(), t = v(e, "leaderboards");
    let n;
    i.useUsername ? n = i.variables.Username.get() ?? g("User", s.uid) : n = g("User", s.uid);
    const r = await _e(t), a = { uid: s.uid, username: n }, o = {};
    for (const u of r.docs)
      o[u.id] = await ie(u, a);
    await i.jsonDatas.Leaderboard.save(o), console.log("Leaderboard retrieved successfully."), i.functions.getLeaderboard.onSuccess();
  } catch (s) {
    throw i.functions.getLeaderboard.onError(s), s;
  }
}
async function ze(s, e) {
  try {
    const t = h().currentUser;
    if (t === null)
      throw new Error("User isn't yet logged in.");
    const n = b(), r = v(n, "rawScores");
    let a;
    i.useUsername ? a = i.variables.Username.get() ?? g("User", t.uid) : a = g("User", t.uid), delete e.level, await ae(r, {
      username: a,
      level: e.level ?? null,
      value: s,
      payload: e,
      timestamp: A(),
      userId: t.uid
    }), console.log("Score saved successfully."), i.functions.saveScore.onSuccess();
  } catch (t) {
    throw i.functions.saveScore.onError(t), t;
  }
}
async function Me(s, e) {
  const t = h().currentUser;
  if (t === null)
    throw new Error("User isn't yet logged in.");
  await ze(s, e);
  const n = e.level, r = b(), a = y(r, "leaderboards", n ?? "global"), o = y(a, "bestScores", t.uid), u = await U(o);
  u.exists() && u.data().score >= s ? await G(a, i.timeout) : await G(o, i.timeout), await Ne();
}
var Q;
typeof process < "u" && (Q = process.versions) != null && Q.node;
var B;
typeof self == "object" && ((B = self.constructor) == null || B.name);
async function $e(s, { email: e, username: t, provider: n }, r = !0) {
  const a = b(), o = v(a, "users"), u = y(o, s.uid);
  if (!(await U(u)).exists()) {
    const f = {
      provider: n,
      timestamp: A()
    };
    return i.useEmail && (f.email = e), i.useUsername && (f.username = t), await Fe(u, f);
  }
  if (r)
    throw new Ie(`User "${s.uid}" already exists.`);
}
async function Je(s, e) {
  try {
    const t = h(), { user: n } = await xe(t);
    console.log("Logged in anonymously successfully.");
    const r = { provider: "anonymous" };
    return i.useEmail && (i.variables.EmailAddress.set(e), r.email = e), i.useUsername && (s = g(s ?? "Anonymous", n.uid), i.variables.Username.set(s), r.username = s), i.useId && i.variables.UserId.set(n.uid), i.storeUser && await $e(n, r), i.verifyEmail ? i.functions.anonymousLogin.onSuccess(n.emailVerified) : i.functions.anonymousLogin.onSuccess(), n;
  } catch (t) {
    throw i.functions.anonymousLogin.onError(t), t;
  }
}
async function He() {
  try {
    const s = h().currentUser;
    if (!s)
      throw new F("User isn't yet logged in.");
    const e = b(), t = v(e, "users"), n = y(t, s.uid), r = await U(n);
    if (!r.exists())
      throw new De(`User "${s.uid}" doesn't exist.`);
    let { email: a, username: o, provider: u, skin: l } = r.data();
    const f = { provider: u };
    i.useEmail && (i.variables.EmailAddress.set(a), f.email = a), i.useUsername && (o = g(o ?? "User", s.uid), i.variables.Username.set(o), f.username = o), i.useId && i.variables.UserId.set(s.uid), i.usePlayerSkin && i.variables.PlayerSkin.set(l ?? ""), await i.logEvent("user:login", {
      email: a ?? null,
      username: o ?? null,
      provider: s.isAnonymous ? "anonymous" : "email"
    }), i.functions.loadUser.onSuccess();
  } catch (s) {
    throw i.functions.loadUser.onError(s), s;
  }
}
async function Ge() {
  try {
    const s = h();
    await Te(s), console.log("Logged out successfully."), i.functions.logout.onSuccess();
  } catch (s) {
    throw i.functions.logout.onError(s), s;
  }
}
async function Ke(s) {
  try {
    const e = h().currentUser;
    if (e === null)
      throw new Error("User isn't yet logged in.");
    const t = b(), n = y(t, "users", e.uid);
    await Le(n, s), console.log("User's details saved successfully."), i.functions.updateUser.onSuccess();
  } catch (e) {
    throw i.functions.updateUser.onError(e), e;
  }
}
const Ce = "1.4.5";
async function Qe(s, e = {}) {
  await i.initialize(s, e), console.log(`Dinostruct engine initialized successfully. (v${Ce})`);
}
function Be(s, e) {
  return i.logEvent(s, e, !0);
}
export {
  Je as anonymousLogin,
  Oe as getAllLeaderboards,
  Ne as getLeaderboard,
  Qe as initialize,
  He as loadUser,
  Be as logEvent,
  Ge as logout,
  ze as saveScore,
  Me as saveScoreAndGetLeaderboard,
  Ke as updateUser
};
//# sourceMappingURL=dinostruct.js.map
