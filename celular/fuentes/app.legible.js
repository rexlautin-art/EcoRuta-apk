(() => {
  var Qg = Object.create;
  var Gr = Object.defineProperty;
  var Vg = Object.getOwnPropertyDescriptor;
  var Zg = Object.getOwnPropertyNames;
  var Kg = Object.getPrototypeOf,
    Jg = Object.prototype.hasOwnProperty;
  var Pe = (a, e) => () => (e || a((e = { exports: {} }).exports, e), e.exports);
  var $g = (a, e, t, l) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let n of Zg(e))
        !Jg.call(a, n) &&
          n !== t &&
          Gr(a, n, { get: () => e[n], enumerable: !(l = Vg(e, n)) || l.enumerable });
    return a;
  };
  var K = (a, e, t) => (
    (t = a != null ? Qg(Kg(a)) : {}),
    $g(e || !a || !a.__esModule ? Gr(t, "default", { value: a, enumerable: !0 }) : t, a)
  );
  var Ir = Pe((Sa) => {
    "use strict";
    function Vo(a, e) {
      var t = a.length;
      a.push(e);
      a: for (; 0 < t;) {
        var l = (t - 1) >>> 1,
          n = a[l];
        if (0 < Fi(n, e)) ((a[l] = e), (a[t] = n), (t = l));
        else break a;
      }
    }
    function at(a) {
      return a.length === 0 ? null : a[0];
    }
    function Pi(a) {
      if (a.length === 0) return null;
      var e = a[0],
        t = a.pop();
      if (t !== e) {
        a[0] = t;
        a: for (var l = 0, n = a.length, i = n >>> 1; l < i;) {
          var u = 2 * (l + 1) - 1,
            o = a[u],
            c = u + 1,
            d = a[c];
          if (0 > Fi(o, t))
            c < n && 0 > Fi(d, o)
              ? ((a[l] = d), (a[c] = t), (l = c))
              : ((a[l] = o), (a[u] = t), (l = u));
          else if (c < n && 0 > Fi(d, t)) ((a[l] = d), (a[c] = t), (l = c));
          else break a;
        }
      }
      return e;
    }
    function Fi(a, e) {
      var t = a.sortIndex - e.sortIndex;
      return t !== 0 ? t : a.id - e.id;
    }
    Sa.unstable_now = void 0;
    typeof performance == "object" && typeof performance.now == "function"
      ? ((Xr = performance),
        (Sa.unstable_now = function () {
          return Xr.now();
        }))
      : ((Go = Date),
        (Qr = Go.now()),
        (Sa.unstable_now = function () {
          return Go.now() - Qr;
        }));
    var Xr,
      Go,
      Qr,
      mt = [],
      qt = [],
      Wg = 1,
      De = null,
      Ia = 3,
      Zo = !1,
      jn = !1,
      Bn = !1,
      Ko = !1,
      Kr = typeof setTimeout == "function" ? setTimeout : null,
      Jr = typeof clearTimeout == "function" ? clearTimeout : null,
      Vr = typeof setImmediate < "u" ? setImmediate : null;
    function Ii(a) {
      for (var e = at(qt); e !== null;) {
        if (e.callback === null) Pi(qt);
        else if (e.startTime <= a) (Pi(qt), (e.sortIndex = e.expirationTime), Vo(mt, e));
        else break;
        e = at(qt);
      }
    }
    function Jo(a) {
      if (((Bn = !1), Ii(a), !jn))
        if (at(mt) !== null) ((jn = !0), Gl || ((Gl = !0), Yl()));
        else {
          var e = at(qt);
          e !== null && $o(Jo, e.startTime - a);
        }
    }
    var Gl = !1,
      Yn = -1,
      $r = 5,
      Wr = -1;
    function Fr() {
      return Ko ? !0 : !(Sa.unstable_now() - Wr < $r);
    }
    function Xo() {
      if (((Ko = !1), Gl)) {
        var a = Sa.unstable_now();
        Wr = a;
        var e = !0;
        try {
          a: {
            ((jn = !1), Bn && ((Bn = !1), Jr(Yn), (Yn = -1)), (Zo = !0));
            var t = Ia;
            try {
              e: {
                for (Ii(a), De = at(mt); De !== null && !(De.expirationTime > a && Fr());) {
                  var l = De.callback;
                  if (typeof l == "function") {
                    ((De.callback = null), (Ia = De.priorityLevel));
                    var n = l(De.expirationTime <= a);
                    if (((a = Sa.unstable_now()), typeof n == "function")) {
                      ((De.callback = n), Ii(a), (e = !0));
                      break e;
                    }
                    (De === at(mt) && Pi(mt), Ii(a));
                  } else Pi(mt);
                  De = at(mt);
                }
                if (De !== null) e = !0;
                else {
                  var i = at(qt);
                  (i !== null && $o(Jo, i.startTime - a), (e = !1));
                }
              }
              break a;
            } finally {
              ((De = null), (Ia = t), (Zo = !1));
            }
            e = void 0;
          }
        } finally {
          e ? Yl() : (Gl = !1);
        }
      }
    }
    var Yl;
    typeof Vr == "function"
      ? (Yl = function () {
          Vr(Xo);
        })
      : typeof MessageChannel < "u"
        ? ((Qo = new MessageChannel()),
          (Zr = Qo.port2),
          (Qo.port1.onmessage = Xo),
          (Yl = function () {
            Zr.postMessage(null);
          }))
        : (Yl = function () {
            Kr(Xo, 0);
          });
    var Qo, Zr;
    function $o(a, e) {
      Yn = Kr(function () {
        a(Sa.unstable_now());
      }, e);
    }
    Sa.unstable_IdlePriority = 5;
    Sa.unstable_ImmediatePriority = 1;
    Sa.unstable_LowPriority = 4;
    Sa.unstable_NormalPriority = 3;
    Sa.unstable_Profiling = null;
    Sa.unstable_UserBlockingPriority = 2;
    Sa.unstable_cancelCallback = function (a) {
      a.callback = null;
    };
    Sa.unstable_forceFrameRate = function (a) {
      0 > a || 125 < a
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : ($r = 0 < a ? Math.floor(1e3 / a) : 5);
    };
    Sa.unstable_getCurrentPriorityLevel = function () {
      return Ia;
    };
    Sa.unstable_next = function (a) {
      switch (Ia) {
        case 1:
        case 2:
        case 3:
          var e = 3;
          break;
        default:
          e = Ia;
      }
      var t = Ia;
      Ia = e;
      try {
        return a();
      } finally {
        Ia = t;
      }
    };
    Sa.unstable_requestPaint = function () {
      Ko = !0;
    };
    Sa.unstable_runWithPriority = function (a, e) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var t = Ia;
      Ia = a;
      try {
        return e();
      } finally {
        Ia = t;
      }
    };
    Sa.unstable_scheduleCallback = function (a, e, t) {
      var l = Sa.unstable_now();
      switch (
        (typeof t == "object" && t !== null
          ? ((t = t.delay), (t = typeof t == "number" && 0 < t ? l + t : l))
          : (t = l),
        a)
      ) {
        case 1:
          var n = -1;
          break;
        case 2:
          n = 250;
          break;
        case 5:
          n = 1073741823;
          break;
        case 4:
          n = 1e4;
          break;
        default:
          n = 5e3;
      }
      return (
        (n = t + n),
        (a = {
          id: Wg++,
          callback: e,
          priorityLevel: a,
          startTime: t,
          expirationTime: n,
          sortIndex: -1,
        }),
        t > l
          ? ((a.sortIndex = t),
            Vo(qt, a),
            at(mt) === null &&
              a === at(qt) &&
              (Bn ? (Jr(Yn), (Yn = -1)) : (Bn = !0), $o(Jo, t - l)))
          : ((a.sortIndex = n), Vo(mt, a), jn || Zo || ((jn = !0), Gl || ((Gl = !0), Yl()))),
        a
      );
    };
    Sa.unstable_shouldYield = Fr;
    Sa.unstable_wrapCallback = function (a) {
      var e = Ia;
      return function () {
        var t = Ia;
        Ia = e;
        try {
          return a.apply(this, arguments);
        } finally {
          Ia = t;
        }
      };
    };
  });
  var af = Pe((f1, Pr) => {
    "use strict";
    Pr.exports = Ir();
  });
  var df = Pe((X) => {
    "use strict";
    var Io = Symbol.for("react.transitional.element"),
      Fg = Symbol.for("react.portal"),
      Ig = Symbol.for("react.fragment"),
      Pg = Symbol.for("react.strict_mode"),
      av = Symbol.for("react.profiler"),
      ev = Symbol.for("react.consumer"),
      tv = Symbol.for("react.context"),
      lv = Symbol.for("react.forward_ref"),
      nv = Symbol.for("react.suspense"),
      iv = Symbol.for("react.memo"),
      uf = Symbol.for("react.lazy"),
      uv = Symbol.for("react.activity"),
      ef = Symbol.iterator;
    function ov(a) {
      return a === null || typeof a != "object"
        ? null
        : ((a = (ef && a[ef]) || a["@@iterator"]), typeof a == "function" ? a : null);
    }
    var of = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      cf = Object.assign,
      sf = {};
    function Ql(a, e, t) {
      ((this.props = a), (this.context = e), (this.refs = sf), (this.updater = t || of));
    }
    Ql.prototype.isReactComponent = {};
    Ql.prototype.setState = function (a, e) {
      if (typeof a != "object" && typeof a != "function" && a != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, a, e, "setState");
    };
    Ql.prototype.forceUpdate = function (a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    };
    function rf() {}
    rf.prototype = Ql.prototype;
    function Po(a, e, t) {
      ((this.props = a), (this.context = e), (this.refs = sf), (this.updater = t || of));
    }
    var ac = (Po.prototype = new rf());
    ac.constructor = Po;
    cf(ac, Ql.prototype);
    ac.isPureReactComponent = !0;
    var tf = Array.isArray;
    function Fo() {}
    var ga = { H: null, A: null, T: null, S: null },
      ff = Object.prototype.hasOwnProperty;
    function ec(a, e, t) {
      var l = t.ref;
      return { $$typeof: Io, type: a, key: e, ref: l !== void 0 ? l : null, props: t };
    }
    function cv(a, e) {
      return ec(a.type, e, a.props);
    }
    function tc(a) {
      return typeof a == "object" && a !== null && a.$$typeof === Io;
    }
    function sv(a) {
      var e = { "=": "=0", ":": "=2" };
      return (
        "$" +
        a.replace(/[=:]/g, function (t) {
          return e[t];
        })
      );
    }
    var lf = /\/+/g;
    function Wo(a, e) {
      return typeof a == "object" && a !== null && a.key != null ? sv("" + a.key) : e.toString(36);
    }
    function rv(a) {
      switch (a.status) {
        case "fulfilled":
          return a.value;
        case "rejected":
          throw a.reason;
        default:
          switch (
            (typeof a.status == "string"
              ? a.then(Fo, Fo)
              : ((a.status = "pending"),
                a.then(
                  function (e) {
                    a.status === "pending" && ((a.status = "fulfilled"), (a.value = e));
                  },
                  function (e) {
                    a.status === "pending" && ((a.status = "rejected"), (a.reason = e));
                  },
                )),
            a.status)
          ) {
            case "fulfilled":
              return a.value;
            case "rejected":
              throw a.reason;
          }
      }
      throw a;
    }
    function Xl(a, e, t, l, n) {
      var i = typeof a;
      (i === "undefined" || i === "boolean") && (a = null);
      var u = !1;
      if (a === null) u = !0;
      else
        switch (i) {
          case "bigint":
          case "string":
          case "number":
            u = !0;
            break;
          case "object":
            switch (a.$$typeof) {
              case Io:
              case Fg:
                u = !0;
                break;
              case uf:
                return ((u = a._init), Xl(u(a._payload), e, t, l, n));
            }
        }
      if (u)
        return (
          (n = n(a)),
          (u = l === "" ? "." + Wo(a, 0) : l),
          tf(n)
            ? ((t = ""),
              u != null && (t = u.replace(lf, "$&/") + "/"),
              Xl(n, e, t, "", function (d) {
                return d;
              }))
            : n != null &&
              (tc(n) &&
                (n = cv(
                  n,
                  t +
                    (n.key == null || (a && a.key === n.key)
                      ? ""
                      : ("" + n.key).replace(lf, "$&/") + "/") +
                    u,
                )),
              e.push(n)),
          1
        );
      u = 0;
      var o = l === "" ? "." : l + ":";
      if (tf(a))
        for (var c = 0; c < a.length; c++)
          ((l = a[c]), (i = o + Wo(l, c)), (u += Xl(l, e, t, i, n)));
      else if (((c = ov(a)), typeof c == "function"))
        for (a = c.call(a), c = 0; !(l = a.next()).done;)
          ((l = l.value), (i = o + Wo(l, c++)), (u += Xl(l, e, t, i, n)));
      else if (i === "object") {
        if (typeof a.then == "function") return Xl(rv(a), e, t, l, n);
        throw (
          (e = String(a)),
          Error(
            "Objects are not valid as a React child (found: " +
              (e === "[object Object]"
                ? "object with keys {" + Object.keys(a).join(", ") + "}"
                : e) +
              "). If you meant to render a collection of children, use an array instead.",
          )
        );
      }
      return u;
    }
    function au(a, e, t) {
      if (a == null) return a;
      var l = [],
        n = 0;
      return (
        Xl(a, l, "", "", function (i) {
          return e.call(t, i, n++);
        }),
        l
      );
    }
    function fv(a) {
      if (a._status === -1) {
        var e = a._result;
        ((e = e()),
          e.then(
            function (t) {
              (a._status === 0 || a._status === -1) && ((a._status = 1), (a._result = t));
            },
            function (t) {
              (a._status === 0 || a._status === -1) && ((a._status = 2), (a._result = t));
            },
          ),
          a._status === -1 && ((a._status = 0), (a._result = e)));
      }
      if (a._status === 1) return a._result.default;
      throw a._result;
    }
    var nf =
        typeof reportError == "function"
          ? reportError
          : function (a) {
              if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                var e = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof a == "object" && a !== null && typeof a.message == "string"
                      ? String(a.message)
                      : String(a),
                  error: a,
                });
                if (!window.dispatchEvent(e)) return;
              } else if (typeof process == "object" && typeof process.emit == "function") {
                process.emit("uncaughtException", a);
                return;
              }
              console.error(a);
            },
      dv = {
        map: au,
        forEach: function (a, e, t) {
          au(
            a,
            function () {
              e.apply(this, arguments);
            },
            t,
          );
        },
        count: function (a) {
          var e = 0;
          return (
            au(a, function () {
              e++;
            }),
            e
          );
        },
        toArray: function (a) {
          return (
            au(a, function (e) {
              return e;
            }) || []
          );
        },
        only: function (a) {
          if (!tc(a))
            throw Error("React.Children.only expected to receive a single React element child.");
          return a;
        },
      };
    X.Activity = uv;
    X.Children = dv;
    X.Component = Ql;
    X.Fragment = Ig;
    X.Profiler = av;
    X.PureComponent = Po;
    X.StrictMode = Pg;
    X.Suspense = nv;
    X.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ga;
    X.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (a) {
        return ga.H.useMemoCache(a);
      },
    };
    X.cache = function (a) {
      return function () {
        return a.apply(null, arguments);
      };
    };
    X.cacheSignal = function () {
      return null;
    };
    X.cloneElement = function (a, e, t) {
      if (a == null) throw Error("The argument must be a React element, but you passed " + a + ".");
      var l = cf({}, a.props),
        n = a.key;
      if (e != null)
        for (i in (e.key !== void 0 && (n = "" + e.key), e))
          !ff.call(e, i) ||
            i === "key" ||
            i === "__self" ||
            i === "__source" ||
            (i === "ref" && e.ref === void 0) ||
            (l[i] = e[i]);
      var i = arguments.length - 2;
      if (i === 1) l.children = t;
      else if (1 < i) {
        for (var u = Array(i), o = 0; o < i; o++) u[o] = arguments[o + 2];
        l.children = u;
      }
      return ec(a.type, n, l);
    };
    X.createContext = function (a) {
      return (
        (a = {
          $$typeof: tv,
          _currentValue: a,
          _currentValue2: a,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (a.Provider = a),
        (a.Consumer = { $$typeof: ev, _context: a }),
        a
      );
    };
    X.createElement = function (a, e, t) {
      var l,
        n = {},
        i = null;
      if (e != null)
        for (l in (e.key !== void 0 && (i = "" + e.key), e))
          ff.call(e, l) && l !== "key" && l !== "__self" && l !== "__source" && (n[l] = e[l]);
      var u = arguments.length - 2;
      if (u === 1) n.children = t;
      else if (1 < u) {
        for (var o = Array(u), c = 0; c < u; c++) o[c] = arguments[c + 2];
        n.children = o;
      }
      if (a && a.defaultProps)
        for (l in ((u = a.defaultProps), u)) n[l] === void 0 && (n[l] = u[l]);
      return ec(a, i, n);
    };
    X.createRef = function () {
      return { current: null };
    };
    X.forwardRef = function (a) {
      return { $$typeof: lv, render: a };
    };
    X.isValidElement = tc;
    X.lazy = function (a) {
      return { $$typeof: uf, _payload: { _status: -1, _result: a }, _init: fv };
    };
    X.memo = function (a, e) {
      return { $$typeof: iv, type: a, compare: e === void 0 ? null : e };
    };
    X.startTransition = function (a) {
      var e = ga.T,
        t = {};
      ga.T = t;
      try {
        var l = a(),
          n = ga.S;
        (n !== null && n(t, l),
          typeof l == "object" && l !== null && typeof l.then == "function" && l.then(Fo, nf));
      } catch (i) {
        nf(i);
      } finally {
        (e !== null && t.types !== null && (e.types = t.types), (ga.T = e));
      }
    };
    X.unstable_useCacheRefresh = function () {
      return ga.H.useCacheRefresh();
    };
    X.use = function (a) {
      return ga.H.use(a);
    };
    X.useActionState = function (a, e, t) {
      return ga.H.useActionState(a, e, t);
    };
    X.useCallback = function (a, e) {
      return ga.H.useCallback(a, e);
    };
    X.useContext = function (a) {
      return ga.H.useContext(a);
    };
    X.useDebugValue = function () {};
    X.useDeferredValue = function (a, e) {
      return ga.H.useDeferredValue(a, e);
    };
    X.useEffect = function (a, e) {
      return ga.H.useEffect(a, e);
    };
    X.useEffectEvent = function (a) {
      return ga.H.useEffectEvent(a);
    };
    X.useId = function () {
      return ga.H.useId();
    };
    X.useImperativeHandle = function (a, e, t) {
      return ga.H.useImperativeHandle(a, e, t);
    };
    X.useInsertionEffect = function (a, e) {
      return ga.H.useInsertionEffect(a, e);
    };
    X.useLayoutEffect = function (a, e) {
      return ga.H.useLayoutEffect(a, e);
    };
    X.useMemo = function (a, e) {
      return ga.H.useMemo(a, e);
    };
    X.useOptimistic = function (a, e) {
      return ga.H.useOptimistic(a, e);
    };
    X.useReducer = function (a, e, t) {
      return ga.H.useReducer(a, e, t);
    };
    X.useRef = function (a) {
      return ga.H.useRef(a);
    };
    X.useState = function (a) {
      return ga.H.useState(a);
    };
    X.useSyncExternalStore = function (a, e, t) {
      return ga.H.useSyncExternalStore(a, e, t);
    };
    X.useTransition = function () {
      return ga.H.useTransition();
    };
    X.version = "19.2.5";
  });
  var Pa = Pe((m1, mf) => {
    "use strict";
    mf.exports = df();
  });
  var gf = Pe((te) => {
    "use strict";
    var mv = Pa();
    function pf(a) {
      var e = "https://react.dev/errors/" + a;
      if (1 < arguments.length) {
        e += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var t = 2; t < arguments.length; t++)
          e += "&args[]=" + encodeURIComponent(arguments[t]);
      }
      return (
        "Minified React error #" +
        a +
        "; visit " +
        e +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function Ht() {}
    var ee = {
        d: {
          f: Ht,
          r: function () {
            throw Error(pf(522));
          },
          D: Ht,
          C: Ht,
          L: Ht,
          m: Ht,
          X: Ht,
          S: Ht,
          M: Ht,
        },
        p: 0,
        findDOMNode: null,
      },
      pv = Symbol.for("react.portal");
    function gv(a, e, t) {
      var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: pv,
        key: l == null ? null : "" + l,
        children: a,
        containerInfo: e,
        implementation: t,
      };
    }
    var Gn = mv.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function eu(a, e) {
      if (a === "font") return "";
      if (typeof e == "string") return e === "use-credentials" ? e : "";
    }
    te.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ee;
    te.createPortal = function (a, e) {
      var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)) throw Error(pf(299));
      return gv(a, e, null, t);
    };
    te.flushSync = function (a) {
      var e = Gn.T,
        t = ee.p;
      try {
        if (((Gn.T = null), (ee.p = 2), a)) return a();
      } finally {
        ((Gn.T = e), (ee.p = t), ee.d.f());
      }
    };
    te.preconnect = function (a, e) {
      typeof a == "string" &&
        (e
          ? ((e = e.crossOrigin),
            (e = typeof e == "string" ? (e === "use-credentials" ? e : "") : void 0))
          : (e = null),
        ee.d.C(a, e));
    };
    te.prefetchDNS = function (a) {
      typeof a == "string" && ee.d.D(a);
    };
    te.preinit = function (a, e) {
      if (typeof a == "string" && e && typeof e.as == "string") {
        var t = e.as,
          l = eu(t, e.crossOrigin),
          n = typeof e.integrity == "string" ? e.integrity : void 0,
          i = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
        t === "style"
          ? ee.d.S(a, typeof e.precedence == "string" ? e.precedence : void 0, {
              crossOrigin: l,
              integrity: n,
              fetchPriority: i,
            })
          : t === "script" &&
            ee.d.X(a, {
              crossOrigin: l,
              integrity: n,
              fetchPriority: i,
              nonce: typeof e.nonce == "string" ? e.nonce : void 0,
            });
      }
    };
    te.preinitModule = function (a, e) {
      if (typeof a == "string")
        if (typeof e == "object" && e !== null) {
          if (e.as == null || e.as === "script") {
            var t = eu(e.as, e.crossOrigin);
            ee.d.M(a, {
              crossOrigin: t,
              integrity: typeof e.integrity == "string" ? e.integrity : void 0,
              nonce: typeof e.nonce == "string" ? e.nonce : void 0,
            });
          }
        } else e == null && ee.d.M(a);
    };
    te.preload = function (a, e) {
      if (typeof a == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
        var t = e.as,
          l = eu(t, e.crossOrigin);
        ee.d.L(a, t, {
          crossOrigin: l,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0,
          type: typeof e.type == "string" ? e.type : void 0,
          fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
          referrerPolicy: typeof e.referrerPolicy == "string" ? e.referrerPolicy : void 0,
          imageSrcSet: typeof e.imageSrcSet == "string" ? e.imageSrcSet : void 0,
          imageSizes: typeof e.imageSizes == "string" ? e.imageSizes : void 0,
          media: typeof e.media == "string" ? e.media : void 0,
        });
      }
    };
    te.preloadModule = function (a, e) {
      if (typeof a == "string")
        if (e) {
          var t = eu(e.as, e.crossOrigin);
          ee.d.m(a, {
            as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
            crossOrigin: t,
            integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          });
        } else ee.d.m(a);
    };
    te.requestFormReset = function (a) {
      ee.d.r(a);
    };
    te.unstable_batchedUpdates = function (a, e) {
      return a(e);
    };
    te.useFormState = function (a, e, t) {
      return Gn.H.useFormState(a, e, t);
    };
    te.useFormStatus = function () {
      return Gn.H.useHostTransitionStatus();
    };
    te.version = "19.2.5";
  });
  var hf = Pe((g1, bf) => {
    "use strict";
    function vf() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(vf);
        } catch (a) {
          console.error(a);
        }
    }
    (vf(), (bf.exports = gf()));
  });
  var D0 = Pe((Ao) => {
    "use strict";
    var qa = af(),
      Qd = Pa(),
      vv = hf();
    function z(a) {
      var e = "https://react.dev/errors/" + a;
      if (1 < arguments.length) {
        e += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var t = 2; t < arguments.length; t++)
          e += "&args[]=" + encodeURIComponent(arguments[t]);
      }
      return (
        "Minified React error #" +
        a +
        "; visit " +
        e +
        " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
      );
    }
    function Vd(a) {
      return !(!a || (a.nodeType !== 1 && a.nodeType !== 9 && a.nodeType !== 11));
    }
    function Ci(a) {
      var e = a,
        t = a;
      if (a.alternate) for (; e.return;) e = e.return;
      else {
        a = e;
        do ((e = a), (e.flags & 4098) !== 0 && (t = e.return), (a = e.return));
        while (a);
      }
      return e.tag === 3 ? t : null;
    }
    function Zd(a) {
      if (a.tag === 13) {
        var e = a.memoizedState;
        if ((e === null && ((a = a.alternate), a !== null && (e = a.memoizedState)), e !== null))
          return e.dehydrated;
      }
      return null;
    }
    function Kd(a) {
      if (a.tag === 31) {
        var e = a.memoizedState;
        if ((e === null && ((a = a.alternate), a !== null && (e = a.memoizedState)), e !== null))
          return e.dehydrated;
      }
      return null;
    }
    function yf(a) {
      if (Ci(a) !== a) throw Error(z(188));
    }
    function bv(a) {
      var e = a.alternate;
      if (!e) {
        if (((e = Ci(a)), e === null)) throw Error(z(188));
        return e !== a ? null : a;
      }
      for (var t = a, l = e; ;) {
        var n = t.return;
        if (n === null) break;
        var i = n.alternate;
        if (i === null) {
          if (((l = n.return), l !== null)) {
            t = l;
            continue;
          }
          break;
        }
        if (n.child === i.child) {
          for (i = n.child; i;) {
            if (i === t) return (yf(n), a);
            if (i === l) return (yf(n), e);
            i = i.sibling;
          }
          throw Error(z(188));
        }
        if (t.return !== l.return) ((t = n), (l = i));
        else {
          for (var u = !1, o = n.child; o;) {
            if (o === t) {
              ((u = !0), (t = n), (l = i));
              break;
            }
            if (o === l) {
              ((u = !0), (l = n), (t = i));
              break;
            }
            o = o.sibling;
          }
          if (!u) {
            for (o = i.child; o;) {
              if (o === t) {
                ((u = !0), (t = i), (l = n));
                break;
              }
              if (o === l) {
                ((u = !0), (l = i), (t = n));
                break;
              }
              o = o.sibling;
            }
            if (!u) throw Error(z(189));
          }
        }
        if (t.alternate !== l) throw Error(z(190));
      }
      if (t.tag !== 3) throw Error(z(188));
      return t.stateNode.current === t ? a : e;
    }
    function Jd(a) {
      var e = a.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return a;
      for (a = a.child; a !== null;) {
        if (((e = Jd(a)), e !== null)) return e;
        a = a.sibling;
      }
      return null;
    }
    var ha = Object.assign,
      hv = Symbol.for("react.element"),
      tu = Symbol.for("react.transitional.element"),
      Wn = Symbol.for("react.portal"),
      Wl = Symbol.for("react.fragment"),
      $d = Symbol.for("react.strict_mode"),
      Uc = Symbol.for("react.profiler"),
      Wd = Symbol.for("react.consumer"),
      xt = Symbol.for("react.context"),
      Rs = Symbol.for("react.forward_ref"),
      qc = Symbol.for("react.suspense"),
      Hc = Symbol.for("react.suspense_list"),
      ws = Symbol.for("react.memo"),
      jt = Symbol.for("react.lazy"),
      jc = Symbol.for("react.activity"),
      yv = Symbol.for("react.memo_cache_sentinel"),
      Sf = Symbol.iterator;
    function Xn(a) {
      return a === null || typeof a != "object"
        ? null
        : ((a = (Sf && a[Sf]) || a["@@iterator"]), typeof a == "function" ? a : null);
    }
    var Sv = Symbol.for("react.client.reference");
    function Bc(a) {
      if (a == null) return null;
      if (typeof a == "function") return a.$$typeof === Sv ? null : a.displayName || a.name || null;
      if (typeof a == "string") return a;
      switch (a) {
        case Wl:
          return "Fragment";
        case Uc:
          return "Profiler";
        case $d:
          return "StrictMode";
        case qc:
          return "Suspense";
        case Hc:
          return "SuspenseList";
        case jc:
          return "Activity";
      }
      if (typeof a == "object")
        switch (a.$$typeof) {
          case Wn:
            return "Portal";
          case xt:
            return a.displayName || "Context";
          case Wd:
            return (a._context.displayName || "Context") + ".Consumer";
          case Rs:
            var e = a.render;
            return (
              (a = a.displayName),
              a ||
                ((a = e.displayName || e.name || ""),
                (a = a !== "" ? "ForwardRef(" + a + ")" : "ForwardRef")),
              a
            );
          case ws:
            return ((e = a.displayName || null), e !== null ? e : Bc(a.type) || "Memo");
          case jt:
            ((e = a._payload), (a = a._init));
            try {
              return Bc(a(e));
            } catch {}
        }
      return null;
    }
    var Fn = Array.isArray,
      B = Qd.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      la = vv.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      El = { pending: !1, data: null, method: null, action: null },
      Yc = [],
      Fl = -1;
    function it(a) {
      return { current: a };
    }
    function Ba(a) {
      0 > Fl || ((a.current = Yc[Fl]), (Yc[Fl] = null), Fl--);
    }
    function ma(a, e) {
      (Fl++, (Yc[Fl] = a.current), (a.current = e));
    }
    var nt = it(null),
      pi = it(null),
      Wt = it(null),
      Lu = it(null);
    function Uu(a, e) {
      switch ((ma(Wt, e), ma(pi, a), ma(nt, null), e.nodeType)) {
        case 9:
        case 11:
          a = (a = e.documentElement) && (a = a.namespaceURI) ? Ad(a) : 0;
          break;
        default:
          if (((a = e.tagName), (e = e.namespaceURI))) ((e = Ad(e)), (a = v0(e, a)));
          else
            switch (a) {
              case "svg":
                a = 1;
                break;
              case "math":
                a = 2;
                break;
              default:
                a = 0;
            }
      }
      (Ba(nt), ma(nt, a));
    }
    function vn() {
      (Ba(nt), Ba(pi), Ba(Wt));
    }
    function Gc(a) {
      a.memoizedState !== null && ma(Lu, a);
      var e = nt.current,
        t = v0(e, a.type);
      e !== t && (ma(pi, a), ma(nt, t));
    }
    function qu(a) {
      (pi.current === a && (Ba(nt), Ba(pi)), Lu.current === a && (Ba(Lu), (Ni._currentValue = El)));
    }
    var lc, xf;
    function Sl(a) {
      if (lc === void 0)
        try {
          throw Error();
        } catch (t) {
          var e = t.stack.trim().match(/\n( *(at )?)/);
          ((lc = (e && e[1]) || ""),
            (xf =
              -1 <
              t.stack.indexOf(`
    at`)
                ? " (<anonymous>)"
                : -1 < t.stack.indexOf("@")
                  ? "@unknown:0:0"
                  : ""));
        }
      return (
        `
` +
        lc +
        a +
        xf
      );
    }
    var nc = !1;
    function ic(a, e) {
      if (!a || nc) return "";
      nc = !0;
      var t = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var l = {
          DetermineComponentFrameRoot: function () {
            try {
              if (e) {
                var b = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(b.prototype, "props", {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == "object" && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(b, []);
                  } catch (f) {
                    var m = f;
                  }
                  Reflect.construct(a, [], b);
                } else {
                  try {
                    b.call();
                  } catch (f) {
                    m = f;
                  }
                  a.call(b.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (f) {
                  m = f;
                }
                (b = a()) && typeof b.catch == "function" && b.catch(function () {});
              }
            } catch (f) {
              if (f && m && typeof f.stack == "string") return [f.stack, m.stack];
            }
            return [null, null];
          },
        };
        l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var n = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
        n &&
          n.configurable &&
          Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
            value: "DetermineComponentFrameRoot",
          });
        var i = l.DetermineComponentFrameRoot(),
          u = i[0],
          o = i[1];
        if (u && o) {
          var c = u.split(`
`),
            d = o.split(`
`);
          for (n = l = 0; l < c.length && !c[l].includes("DetermineComponentFrameRoot");) l++;
          for (; n < d.length && !d[n].includes("DetermineComponentFrameRoot");) n++;
          if (l === c.length || n === d.length)
            for (l = c.length - 1, n = d.length - 1; 1 <= l && 0 <= n && c[l] !== d[n];) n--;
          for (; 1 <= l && 0 <= n; l--, n--)
            if (c[l] !== d[n]) {
              if (l !== 1 || n !== 1)
                do
                  if ((l--, n--, 0 > n || c[l] !== d[n])) {
                    var g =
                      `
` + c[l].replace(" at new ", " at ");
                    return (
                      a.displayName &&
                        g.includes("<anonymous>") &&
                        (g = g.replace("<anonymous>", a.displayName)),
                      g
                    );
                  }
                while (1 <= l && 0 <= n);
              break;
            }
        }
      } finally {
        ((nc = !1), (Error.prepareStackTrace = t));
      }
      return (t = a ? a.displayName || a.name : "") ? Sl(t) : "";
    }
    function xv(a, e) {
      switch (a.tag) {
        case 26:
        case 27:
        case 5:
          return Sl(a.type);
        case 16:
          return Sl("Lazy");
        case 13:
          return a.child !== e && e !== null ? Sl("Suspense Fallback") : Sl("Suspense");
        case 19:
          return Sl("SuspenseList");
        case 0:
        case 15:
          return ic(a.type, !1);
        case 11:
          return ic(a.type.render, !1);
        case 1:
          return ic(a.type, !0);
        case 31:
          return Sl("Activity");
        default:
          return "";
      }
    }
    function zf(a) {
      try {
        var e = "",
          t = null;
        do ((e += xv(a, t)), (t = a), (a = a.return));
        while (a);
        return e;
      } catch (l) {
        return (
          `
Error generating stack: ` +
          l.message +
          `
` +
          l.stack
        );
      }
    }
    var Xc = Object.prototype.hasOwnProperty,
      _s = qa.unstable_scheduleCallback,
      uc = qa.unstable_cancelCallback,
      zv = qa.unstable_shouldYield,
      Mv = qa.unstable_requestPaint,
      ze = qa.unstable_now,
      Ev = qa.unstable_getCurrentPriorityLevel,
      Fd = qa.unstable_ImmediatePriority,
      Id = qa.unstable_UserBlockingPriority,
      Hu = qa.unstable_NormalPriority,
      Nv = qa.unstable_LowPriority,
      Pd = qa.unstable_IdlePriority,
      Tv = qa.log,
      Av = qa.unstable_setDisableYieldValue,
      Oi = null,
      Me = null;
    function Vt(a) {
      if ((typeof Tv == "function" && Av(a), Me && typeof Me.setStrictMode == "function"))
        try {
          Me.setStrictMode(Oi, a);
        } catch {}
    }
    var Ee = Math.clz32 ? Math.clz32 : Dv,
      Cv = Math.log,
      Ov = Math.LN2;
    function Dv(a) {
      return ((a >>>= 0), a === 0 ? 32 : (31 - ((Cv(a) / Ov) | 0)) | 0);
    }
    var lu = 256,
      nu = 262144,
      iu = 4194304;
    function xl(a) {
      var e = a & 42;
      if (e !== 0) return e;
      switch (a & -a) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return a & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return a & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return a & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return a;
      }
    }
    function ro(a, e, t) {
      var l = a.pendingLanes;
      if (l === 0) return 0;
      var n = 0,
        i = a.suspendedLanes,
        u = a.pingedLanes;
      a = a.warmLanes;
      var o = l & 134217727;
      return (
        o !== 0
          ? ((l = o & ~i),
            l !== 0
              ? (n = xl(l))
              : ((u &= o), u !== 0 ? (n = xl(u)) : t || ((t = o & ~a), t !== 0 && (n = xl(t)))))
          : ((o = l & ~i),
            o !== 0
              ? (n = xl(o))
              : u !== 0
                ? (n = xl(u))
                : t || ((t = l & ~a), t !== 0 && (n = xl(t)))),
        n === 0
          ? 0
          : e !== 0 &&
              e !== n &&
              (e & i) === 0 &&
              ((i = n & -n), (t = e & -e), i >= t || (i === 32 && (t & 4194048) !== 0))
            ? e
            : n
      );
    }
    function Di(a, e) {
      return (a.pendingLanes & ~(a.suspendedLanes & ~a.pingedLanes) & e) === 0;
    }
    function Rv(a, e) {
      switch (a) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return e + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function am() {
      var a = iu;
      return ((iu <<= 1), (iu & 62914560) === 0 && (iu = 4194304), a);
    }
    function oc(a) {
      for (var e = [], t = 0; 31 > t; t++) e.push(a);
      return e;
    }
    function Ri(a, e) {
      ((a.pendingLanes |= e),
        e !== 268435456 && ((a.suspendedLanes = 0), (a.pingedLanes = 0), (a.warmLanes = 0)));
    }
    function wv(a, e, t, l, n, i) {
      var u = a.pendingLanes;
      ((a.pendingLanes = t),
        (a.suspendedLanes = 0),
        (a.pingedLanes = 0),
        (a.warmLanes = 0),
        (a.expiredLanes &= t),
        (a.entangledLanes &= t),
        (a.errorRecoveryDisabledLanes &= t),
        (a.shellSuspendCounter = 0));
      var o = a.entanglements,
        c = a.expirationTimes,
        d = a.hiddenUpdates;
      for (t = u & ~t; 0 < t;) {
        var g = 31 - Ee(t),
          b = 1 << g;
        ((o[g] = 0), (c[g] = -1));
        var m = d[g];
        if (m !== null)
          for (d[g] = null, g = 0; g < m.length; g++) {
            var f = m[g];
            f !== null && (f.lane &= -536870913);
          }
        t &= ~b;
      }
      (l !== 0 && em(a, l, 0),
        i !== 0 && n === 0 && a.tag !== 0 && (a.suspendedLanes |= i & ~(u & ~e)));
    }
    function em(a, e, t) {
      ((a.pendingLanes |= e), (a.suspendedLanes &= ~e));
      var l = 31 - Ee(e);
      ((a.entangledLanes |= e),
        (a.entanglements[l] = a.entanglements[l] | 1073741824 | (t & 261930)));
    }
    function tm(a, e) {
      var t = (a.entangledLanes |= e);
      for (a = a.entanglements; t;) {
        var l = 31 - Ee(t),
          n = 1 << l;
        ((n & e) | (a[l] & e) && (a[l] |= e), (t &= ~n));
      }
    }
    function lm(a, e) {
      var t = e & -e;
      return ((t = (t & 42) !== 0 ? 1 : ks(t)), (t & (a.suspendedLanes | e)) !== 0 ? 0 : t);
    }
    function ks(a) {
      switch (a) {
        case 2:
          a = 1;
          break;
        case 8:
          a = 4;
          break;
        case 32:
          a = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          a = 128;
          break;
        case 268435456:
          a = 134217728;
          break;
        default:
          a = 0;
      }
      return a;
    }
    function Ls(a) {
      return ((a &= -a), 2 < a ? (8 < a ? ((a & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
    }
    function nm() {
      var a = la.p;
      return a !== 0 ? a : ((a = window.event), a === void 0 ? 32 : A0(a.type));
    }
    function Mf(a, e) {
      var t = la.p;
      try {
        return ((la.p = a), e());
      } finally {
        la.p = t;
      }
    }
    var sl = Math.random().toString(36).slice(2),
      Za = "__reactFiber$" + sl,
      fe = "__reactProps$" + sl,
      An = "__reactContainer$" + sl,
      Qc = "__reactEvents$" + sl,
      _v = "__reactListeners$" + sl,
      kv = "__reactHandles$" + sl,
      Ef = "__reactResources$" + sl,
      wi = "__reactMarker$" + sl;
    function Us(a) {
      (delete a[Za], delete a[fe], delete a[Qc], delete a[_v], delete a[kv]);
    }
    function Il(a) {
      var e = a[Za];
      if (e) return e;
      for (var t = a.parentNode; t;) {
        if ((e = t[An] || t[Za])) {
          if (((t = e.alternate), e.child !== null || (t !== null && t.child !== null)))
            for (a = wd(a); a !== null;) {
              if ((t = a[Za])) return t;
              a = wd(a);
            }
          return e;
        }
        ((a = t), (t = a.parentNode));
      }
      return null;
    }
    function Cn(a) {
      if ((a = a[Za] || a[An])) {
        var e = a.tag;
        if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return a;
      }
      return null;
    }
    function In(a) {
      var e = a.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return a.stateNode;
      throw Error(z(33));
    }
    function sn(a) {
      var e = a[Ef];
      return (e || (e = a[Ef] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
    }
    function ja(a) {
      a[wi] = !0;
    }
    var im = new Set(),
      um = {};
    function kl(a, e) {
      (bn(a, e), bn(a + "Capture", e));
    }
    function bn(a, e) {
      for (um[a] = e, a = 0; a < e.length; a++) im.add(e[a]);
    }
    var Lv = RegExp(
        "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
      ),
      Nf = {},
      Tf = {};
    function Uv(a) {
      return Xc.call(Tf, a)
        ? !0
        : Xc.call(Nf, a)
          ? !1
          : Lv.test(a)
            ? (Tf[a] = !0)
            : ((Nf[a] = !0), !1);
    }
    function Su(a, e, t) {
      if (Uv(e))
        if (t === null) a.removeAttribute(e);
        else {
          switch (typeof t) {
            case "undefined":
            case "function":
            case "symbol":
              a.removeAttribute(e);
              return;
            case "boolean":
              var l = e.toLowerCase().slice(0, 5);
              if (l !== "data-" && l !== "aria-") {
                a.removeAttribute(e);
                return;
              }
          }
          a.setAttribute(e, "" + t);
        }
    }
    function uu(a, e, t) {
      if (t === null) a.removeAttribute(e);
      else {
        switch (typeof t) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            a.removeAttribute(e);
            return;
        }
        a.setAttribute(e, "" + t);
      }
    }
    function pt(a, e, t, l) {
      if (l === null) a.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            a.removeAttribute(t);
            return;
        }
        a.setAttributeNS(e, t, "" + l);
      }
    }
    function we(a) {
      switch (typeof a) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return a;
        case "object":
          return a;
        default:
          return "";
      }
    }
    function om(a) {
      var e = a.type;
      return (a = a.nodeName) && a.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
    }
    function qv(a, e, t) {
      var l = Object.getOwnPropertyDescriptor(a.constructor.prototype, e);
      if (
        !a.hasOwnProperty(e) &&
        typeof l < "u" &&
        typeof l.get == "function" &&
        typeof l.set == "function"
      ) {
        var n = l.get,
          i = l.set;
        return (
          Object.defineProperty(a, e, {
            configurable: !0,
            get: function () {
              return n.call(this);
            },
            set: function (u) {
              ((t = "" + u), i.call(this, u));
            },
          }),
          Object.defineProperty(a, e, { enumerable: l.enumerable }),
          {
            getValue: function () {
              return t;
            },
            setValue: function (u) {
              t = "" + u;
            },
            stopTracking: function () {
              ((a._valueTracker = null), delete a[e]);
            },
          }
        );
      }
    }
    function Vc(a) {
      if (!a._valueTracker) {
        var e = om(a) ? "checked" : "value";
        a._valueTracker = qv(a, e, "" + a[e]);
      }
    }
    function cm(a) {
      if (!a) return !1;
      var e = a._valueTracker;
      if (!e) return !0;
      var t = e.getValue(),
        l = "";
      return (
        a && (l = om(a) ? (a.checked ? "true" : "false") : a.value),
        (a = l),
        a !== t ? (e.setValue(a), !0) : !1
      );
    }
    function ju(a) {
      if (((a = a || (typeof document < "u" ? document : void 0)), typeof a > "u")) return null;
      try {
        return a.activeElement || a.body;
      } catch {
        return a.body;
      }
    }
    var Hv = /[\n"\\]/g;
    function Le(a) {
      return a.replace(Hv, function (e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      });
    }
    function Zc(a, e, t, l, n, i, u, o) {
      ((a.name = ""),
        u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean"
          ? (a.type = u)
          : a.removeAttribute("type"),
        e != null
          ? u === "number"
            ? ((e === 0 && a.value === "") || a.value != e) && (a.value = "" + we(e))
            : a.value !== "" + we(e) && (a.value = "" + we(e))
          : (u !== "submit" && u !== "reset") || a.removeAttribute("value"),
        e != null
          ? Kc(a, u, we(e))
          : t != null
            ? Kc(a, u, we(t))
            : l != null && a.removeAttribute("value"),
        n == null && i != null && (a.defaultChecked = !!i),
        n != null && (a.checked = n && typeof n != "function" && typeof n != "symbol"),
        o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean"
          ? (a.name = "" + we(o))
          : a.removeAttribute("name"));
    }
    function sm(a, e, t, l, n, i, u, o) {
      if (
        (i != null &&
          typeof i != "function" &&
          typeof i != "symbol" &&
          typeof i != "boolean" &&
          (a.type = i),
        e != null || t != null)
      ) {
        if (!((i !== "submit" && i !== "reset") || e != null)) {
          Vc(a);
          return;
        }
        ((t = t != null ? "" + we(t) : ""),
          (e = e != null ? "" + we(e) : t),
          o || e === a.value || (a.value = e),
          (a.defaultValue = e));
      }
      ((l = l ?? n),
        (l = typeof l != "function" && typeof l != "symbol" && !!l),
        (a.checked = o ? a.checked : !!l),
        (a.defaultChecked = !!l),
        u != null &&
          typeof u != "function" &&
          typeof u != "symbol" &&
          typeof u != "boolean" &&
          (a.name = u),
        Vc(a));
    }
    function Kc(a, e, t) {
      (e === "number" && ju(a.ownerDocument) === a) ||
        a.defaultValue === "" + t ||
        (a.defaultValue = "" + t);
    }
    function rn(a, e, t, l) {
      if (((a = a.options), e)) {
        e = {};
        for (var n = 0; n < t.length; n++) e["$" + t[n]] = !0;
        for (t = 0; t < a.length; t++)
          ((n = e.hasOwnProperty("$" + a[t].value)),
            a[t].selected !== n && (a[t].selected = n),
            n && l && (a[t].defaultSelected = !0));
      } else {
        for (t = "" + we(t), e = null, n = 0; n < a.length; n++) {
          if (a[n].value === t) {
            ((a[n].selected = !0), l && (a[n].defaultSelected = !0));
            return;
          }
          e !== null || a[n].disabled || (e = a[n]);
        }
        e !== null && (e.selected = !0);
      }
    }
    function rm(a, e, t) {
      if (e != null && ((e = "" + we(e)), e !== a.value && (a.value = e), t == null)) {
        a.defaultValue !== e && (a.defaultValue = e);
        return;
      }
      a.defaultValue = t != null ? "" + we(t) : "";
    }
    function fm(a, e, t, l) {
      if (e == null) {
        if (l != null) {
          if (t != null) throw Error(z(92));
          if (Fn(l)) {
            if (1 < l.length) throw Error(z(93));
            l = l[0];
          }
          t = l;
        }
        (t == null && (t = ""), (e = t));
      }
      ((t = we(e)),
        (a.defaultValue = t),
        (l = a.textContent),
        l === t && l !== "" && l !== null && (a.value = l),
        Vc(a));
    }
    function hn(a, e) {
      if (e) {
        var t = a.firstChild;
        if (t && t === a.lastChild && t.nodeType === 3) {
          t.nodeValue = e;
          return;
        }
      }
      a.textContent = e;
    }
    var jv = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " ",
      ),
    );
    function Af(a, e, t) {
      var l = e.indexOf("--") === 0;
      t == null || typeof t == "boolean" || t === ""
        ? l
          ? a.setProperty(e, "")
          : e === "float"
            ? (a.cssFloat = "")
            : (a[e] = "")
        : l
          ? a.setProperty(e, t)
          : typeof t != "number" || t === 0 || jv.has(e)
            ? e === "float"
              ? (a.cssFloat = t)
              : (a[e] = ("" + t).trim())
            : (a[e] = t + "px");
    }
    function dm(a, e, t) {
      if (e != null && typeof e != "object") throw Error(z(62));
      if (((a = a.style), t != null)) {
        for (var l in t)
          !t.hasOwnProperty(l) ||
            (e != null && e.hasOwnProperty(l)) ||
            (l.indexOf("--") === 0
              ? a.setProperty(l, "")
              : l === "float"
                ? (a.cssFloat = "")
                : (a[l] = ""));
        for (var n in e) ((l = e[n]), e.hasOwnProperty(n) && t[n] !== l && Af(a, n, l));
      } else for (var i in e) e.hasOwnProperty(i) && Af(a, i, e[i]);
    }
    function qs(a) {
      if (a.indexOf("-") === -1) return !1;
      switch (a) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Bv = new Map([
        ["acceptCharset", "accept-charset"],
        ["htmlFor", "for"],
        ["httpEquiv", "http-equiv"],
        ["crossOrigin", "crossorigin"],
        ["accentHeight", "accent-height"],
        ["alignmentBaseline", "alignment-baseline"],
        ["arabicForm", "arabic-form"],
        ["baselineShift", "baseline-shift"],
        ["capHeight", "cap-height"],
        ["clipPath", "clip-path"],
        ["clipRule", "clip-rule"],
        ["colorInterpolation", "color-interpolation"],
        ["colorInterpolationFilters", "color-interpolation-filters"],
        ["colorProfile", "color-profile"],
        ["colorRendering", "color-rendering"],
        ["dominantBaseline", "dominant-baseline"],
        ["enableBackground", "enable-background"],
        ["fillOpacity", "fill-opacity"],
        ["fillRule", "fill-rule"],
        ["floodColor", "flood-color"],
        ["floodOpacity", "flood-opacity"],
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontSizeAdjust", "font-size-adjust"],
        ["fontStretch", "font-stretch"],
        ["fontStyle", "font-style"],
        ["fontVariant", "font-variant"],
        ["fontWeight", "font-weight"],
        ["glyphName", "glyph-name"],
        ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
        ["glyphOrientationVertical", "glyph-orientation-vertical"],
        ["horizAdvX", "horiz-adv-x"],
        ["horizOriginX", "horiz-origin-x"],
        ["imageRendering", "image-rendering"],
        ["letterSpacing", "letter-spacing"],
        ["lightingColor", "lighting-color"],
        ["markerEnd", "marker-end"],
        ["markerMid", "marker-mid"],
        ["markerStart", "marker-start"],
        ["overlinePosition", "overline-position"],
        ["overlineThickness", "overline-thickness"],
        ["paintOrder", "paint-order"],
        ["panose-1", "panose-1"],
        ["pointerEvents", "pointer-events"],
        ["renderingIntent", "rendering-intent"],
        ["shapeRendering", "shape-rendering"],
        ["stopColor", "stop-color"],
        ["stopOpacity", "stop-opacity"],
        ["strikethroughPosition", "strikethrough-position"],
        ["strikethroughThickness", "strikethrough-thickness"],
        ["strokeDasharray", "stroke-dasharray"],
        ["strokeDashoffset", "stroke-dashoffset"],
        ["strokeLinecap", "stroke-linecap"],
        ["strokeLinejoin", "stroke-linejoin"],
        ["strokeMiterlimit", "stroke-miterlimit"],
        ["strokeOpacity", "stroke-opacity"],
        ["strokeWidth", "stroke-width"],
        ["textAnchor", "text-anchor"],
        ["textDecoration", "text-decoration"],
        ["textRendering", "text-rendering"],
        ["transformOrigin", "transform-origin"],
        ["underlinePosition", "underline-position"],
        ["underlineThickness", "underline-thickness"],
        ["unicodeBidi", "unicode-bidi"],
        ["unicodeRange", "unicode-range"],
        ["unitsPerEm", "units-per-em"],
        ["vAlphabetic", "v-alphabetic"],
        ["vHanging", "v-hanging"],
        ["vIdeographic", "v-ideographic"],
        ["vMathematical", "v-mathematical"],
        ["vectorEffect", "vector-effect"],
        ["vertAdvY", "vert-adv-y"],
        ["vertOriginX", "vert-origin-x"],
        ["vertOriginY", "vert-origin-y"],
        ["wordSpacing", "word-spacing"],
        ["writingMode", "writing-mode"],
        ["xmlnsXlink", "xmlns:xlink"],
        ["xHeight", "x-height"],
      ]),
      Yv =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function xu(a) {
      return Yv.test("" + a)
        ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
        : a;
    }
    function zt() {}
    var Jc = null;
    function Hs(a) {
      return (
        (a = a.target || a.srcElement || window),
        a.correspondingUseElement && (a = a.correspondingUseElement),
        a.nodeType === 3 ? a.parentNode : a
      );
    }
    var Pl = null,
      fn = null;
    function Cf(a) {
      var e = Cn(a);
      if (e && (a = e.stateNode)) {
        var t = a[fe] || null;
        a: switch (((a = e.stateNode), e.type)) {
          case "input":
            if (
              (Zc(
                a,
                t.value,
                t.defaultValue,
                t.defaultValue,
                t.checked,
                t.defaultChecked,
                t.type,
                t.name,
              ),
              (e = t.name),
              t.type === "radio" && e != null)
            ) {
              for (t = a; t.parentNode;) t = t.parentNode;
              for (
                t = t.querySelectorAll('input[name="' + Le("" + e) + '"][type="radio"]'), e = 0;
                e < t.length;
                e++
              ) {
                var l = t[e];
                if (l !== a && l.form === a.form) {
                  var n = l[fe] || null;
                  if (!n) throw Error(z(90));
                  Zc(
                    l,
                    n.value,
                    n.defaultValue,
                    n.defaultValue,
                    n.checked,
                    n.defaultChecked,
                    n.type,
                    n.name,
                  );
                }
              }
              for (e = 0; e < t.length; e++) ((l = t[e]), l.form === a.form && cm(l));
            }
            break a;
          case "textarea":
            rm(a, t.value, t.defaultValue);
            break a;
          case "select":
            ((e = t.value), e != null && rn(a, !!t.multiple, e, !1));
        }
      }
    }
    var cc = !1;
    function mm(a, e, t) {
      if (cc) return a(e, t);
      cc = !0;
      try {
        var l = a(e);
        return l;
      } finally {
        if (
          ((cc = !1),
          (Pl !== null || fn !== null) &&
            (Mo(), Pl && ((e = Pl), (a = fn), (fn = Pl = null), Cf(e), a)))
        )
          for (e = 0; e < a.length; e++) Cf(a[e]);
      }
    }
    function gi(a, e) {
      var t = a.stateNode;
      if (t === null) return null;
      var l = t[fe] || null;
      if (l === null) return null;
      t = l[e];
      a: switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          ((l = !l.disabled) ||
            ((a = a.type),
            (l = !(a === "button" || a === "input" || a === "select" || a === "textarea"))),
            (a = !l));
          break a;
        default:
          a = !1;
      }
      if (a) return null;
      if (t && typeof t != "function") throw Error(z(231, e, typeof t));
      return t;
    }
    var At = !(
        typeof window > "u" ||
        typeof window.document > "u" ||
        typeof window.document.createElement > "u"
      ),
      $c = !1;
    if (At)
      try {
        ((Vl = {}),
          Object.defineProperty(Vl, "passive", {
            get: function () {
              $c = !0;
            },
          }),
          window.addEventListener("test", Vl, Vl),
          window.removeEventListener("test", Vl, Vl));
      } catch {
        $c = !1;
      }
    var Vl,
      Zt = null,
      js = null,
      zu = null;
    function pm() {
      if (zu) return zu;
      var a,
        e = js,
        t = e.length,
        l,
        n = "value" in Zt ? Zt.value : Zt.textContent,
        i = n.length;
      for (a = 0; a < t && e[a] === n[a]; a++);
      var u = t - a;
      for (l = 1; l <= u && e[t - l] === n[i - l]; l++);
      return (zu = n.slice(a, 1 < l ? 1 - l : void 0));
    }
    function Mu(a) {
      var e = a.keyCode;
      return (
        "charCode" in a ? ((a = a.charCode), a === 0 && e === 13 && (a = 13)) : (a = e),
        a === 10 && (a = 13),
        32 <= a || a === 13 ? a : 0
      );
    }
    function ou() {
      return !0;
    }
    function Of() {
      return !1;
    }
    function de(a) {
      function e(t, l, n, i, u) {
        ((this._reactName = t),
          (this._targetInst = n),
          (this.type = l),
          (this.nativeEvent = i),
          (this.target = u),
          (this.currentTarget = null));
        for (var o in a) a.hasOwnProperty(o) && ((t = a[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (
            i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
          )
            ? ou
            : Of),
          (this.isPropagationStopped = Of),
          this
        );
      }
      return (
        ha(e.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var t = this.nativeEvent;
            t &&
              (t.preventDefault
                ? t.preventDefault()
                : typeof t.returnValue != "unknown" && (t.returnValue = !1),
              (this.isDefaultPrevented = ou));
          },
          stopPropagation: function () {
            var t = this.nativeEvent;
            t &&
              (t.stopPropagation
                ? t.stopPropagation()
                : typeof t.cancelBubble != "unknown" && (t.cancelBubble = !0),
              (this.isPropagationStopped = ou));
          },
          persist: function () {},
          isPersistent: ou,
        }),
        e
      );
    }
    var Ll = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (a) {
          return a.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      fo = de(Ll),
      _i = ha({}, Ll, { view: 0, detail: 0 }),
      Gv = de(_i),
      sc,
      rc,
      Qn,
      mo = ha({}, _i, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: Bs,
        button: 0,
        buttons: 0,
        relatedTarget: function (a) {
          return a.relatedTarget === void 0
            ? a.fromElement === a.srcElement
              ? a.toElement
              : a.fromElement
            : a.relatedTarget;
        },
        movementX: function (a) {
          return "movementX" in a
            ? a.movementX
            : (a !== Qn &&
                (Qn && a.type === "mousemove"
                  ? ((sc = a.screenX - Qn.screenX), (rc = a.screenY - Qn.screenY))
                  : (rc = sc = 0),
                (Qn = a)),
              sc);
        },
        movementY: function (a) {
          return "movementY" in a ? a.movementY : rc;
        },
      }),
      Df = de(mo),
      Xv = ha({}, mo, { dataTransfer: 0 }),
      Qv = de(Xv),
      Vv = ha({}, _i, { relatedTarget: 0 }),
      fc = de(Vv),
      Zv = ha({}, Ll, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      Kv = de(Zv),
      Jv = ha({}, Ll, {
        clipboardData: function (a) {
          return "clipboardData" in a ? a.clipboardData : window.clipboardData;
        },
      }),
      $v = de(Jv),
      Wv = ha({}, Ll, { data: 0 }),
      Rf = de(Wv),
      Fv = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified",
      },
      Iv = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta",
      },
      Pv = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function ab(a) {
      var e = this.nativeEvent;
      return e.getModifierState ? e.getModifierState(a) : (a = Pv[a]) ? !!e[a] : !1;
    }
    function Bs() {
      return ab;
    }
    var eb = ha({}, _i, {
        key: function (a) {
          if (a.key) {
            var e = Fv[a.key] || a.key;
            if (e !== "Unidentified") return e;
          }
          return a.type === "keypress"
            ? ((a = Mu(a)), a === 13 ? "Enter" : String.fromCharCode(a))
            : a.type === "keydown" || a.type === "keyup"
              ? Iv[a.keyCode] || "Unidentified"
              : "";
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: Bs,
        charCode: function (a) {
          return a.type === "keypress" ? Mu(a) : 0;
        },
        keyCode: function (a) {
          return a.type === "keydown" || a.type === "keyup" ? a.keyCode : 0;
        },
        which: function (a) {
          return a.type === "keypress"
            ? Mu(a)
            : a.type === "keydown" || a.type === "keyup"
              ? a.keyCode
              : 0;
        },
      }),
      tb = de(eb),
      lb = ha({}, mo, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0,
      }),
      wf = de(lb),
      nb = ha({}, _i, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: Bs,
      }),
      ib = de(nb),
      ub = ha({}, Ll, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
      ob = de(ub),
      cb = ha({}, mo, {
        deltaX: function (a) {
          return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
        },
        deltaY: function (a) {
          return "deltaY" in a
            ? a.deltaY
            : "wheelDeltaY" in a
              ? -a.wheelDeltaY
              : "wheelDelta" in a
                ? -a.wheelDelta
                : 0;
        },
        deltaZ: 0,
        deltaMode: 0,
      }),
      sb = de(cb),
      rb = ha({}, Ll, { newState: 0, oldState: 0 }),
      fb = de(rb),
      db = [9, 13, 27, 32],
      Ys = At && "CompositionEvent" in window,
      ei = null;
    At && "documentMode" in document && (ei = document.documentMode);
    var mb = At && "TextEvent" in window && !ei,
      gm = At && (!Ys || (ei && 8 < ei && 11 >= ei)),
      _f = " ",
      kf = !1;
    function vm(a, e) {
      switch (a) {
        case "keyup":
          return db.indexOf(e.keyCode) !== -1;
        case "keydown":
          return e.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function bm(a) {
      return ((a = a.detail), typeof a == "object" && "data" in a ? a.data : null);
    }
    var an = !1;
    function pb(a, e) {
      switch (a) {
        case "compositionend":
          return bm(e);
        case "keypress":
          return e.which !== 32 ? null : ((kf = !0), _f);
        case "textInput":
          return ((a = e.data), a === _f && kf ? null : a);
        default:
          return null;
      }
    }
    function gb(a, e) {
      if (an)
        return a === "compositionend" || (!Ys && vm(a, e))
          ? ((a = pm()), (zu = js = Zt = null), (an = !1), a)
          : null;
      switch (a) {
        case "paste":
          return null;
        case "keypress":
          if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
            if (e.char && 1 < e.char.length) return e.char;
            if (e.which) return String.fromCharCode(e.which);
          }
          return null;
        case "compositionend":
          return gm && e.locale !== "ko" ? null : e.data;
        default:
          return null;
      }
    }
    var vb = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function Lf(a) {
      var e = a && a.nodeName && a.nodeName.toLowerCase();
      return e === "input" ? !!vb[a.type] : e === "textarea";
    }
    function hm(a, e, t, l) {
      (Pl ? (fn ? fn.push(l) : (fn = [l])) : (Pl = l),
        (e = lo(e, "onChange")),
        0 < e.length &&
          ((t = new fo("onChange", "change", null, t, l)), a.push({ event: t, listeners: e })));
    }
    var ti = null,
      vi = null;
    function bb(a) {
      m0(a, 0);
    }
    function po(a) {
      var e = In(a);
      if (cm(e)) return a;
    }
    function Uf(a, e) {
      if (a === "change") return e;
    }
    var ym = !1;
    At &&
      (At
        ? ((su = "oninput" in document),
          su ||
            ((dc = document.createElement("div")),
            dc.setAttribute("oninput", "return;"),
            (su = typeof dc.oninput == "function")),
          (cu = su))
        : (cu = !1),
      (ym = cu && (!document.documentMode || 9 < document.documentMode)));
    var cu, su, dc;
    function qf() {
      ti && (ti.detachEvent("onpropertychange", Sm), (vi = ti = null));
    }
    function Sm(a) {
      if (a.propertyName === "value" && po(vi)) {
        var e = [];
        (hm(e, vi, a, Hs(a)), mm(bb, e));
      }
    }
    function hb(a, e, t) {
      a === "focusin"
        ? (qf(), (ti = e), (vi = t), ti.attachEvent("onpropertychange", Sm))
        : a === "focusout" && qf();
    }
    function yb(a) {
      if (a === "selectionchange" || a === "keyup" || a === "keydown") return po(vi);
    }
    function Sb(a, e) {
      if (a === "click") return po(e);
    }
    function xb(a, e) {
      if (a === "input" || a === "change") return po(e);
    }
    function zb(a, e) {
      return (a === e && (a !== 0 || 1 / a === 1 / e)) || (a !== a && e !== e);
    }
    var Te = typeof Object.is == "function" ? Object.is : zb;
    function bi(a, e) {
      if (Te(a, e)) return !0;
      if (typeof a != "object" || a === null || typeof e != "object" || e === null) return !1;
      var t = Object.keys(a),
        l = Object.keys(e);
      if (t.length !== l.length) return !1;
      for (l = 0; l < t.length; l++) {
        var n = t[l];
        if (!Xc.call(e, n) || !Te(a[n], e[n])) return !1;
      }
      return !0;
    }
    function Hf(a) {
      for (; a && a.firstChild;) a = a.firstChild;
      return a;
    }
    function jf(a, e) {
      var t = Hf(a);
      a = 0;
      for (var l; t;) {
        if (t.nodeType === 3) {
          if (((l = a + t.textContent.length), a <= e && l >= e)) return { node: t, offset: e - a };
          a = l;
        }
        a: {
          for (; t;) {
            if (t.nextSibling) {
              t = t.nextSibling;
              break a;
            }
            t = t.parentNode;
          }
          t = void 0;
        }
        t = Hf(t);
      }
    }
    function xm(a, e) {
      return a && e
        ? a === e
          ? !0
          : a && a.nodeType === 3
            ? !1
            : e && e.nodeType === 3
              ? xm(a, e.parentNode)
              : "contains" in a
                ? a.contains(e)
                : a.compareDocumentPosition
                  ? !!(a.compareDocumentPosition(e) & 16)
                  : !1
        : !1;
    }
    function zm(a) {
      a =
        a != null && a.ownerDocument != null && a.ownerDocument.defaultView != null
          ? a.ownerDocument.defaultView
          : window;
      for (var e = ju(a.document); e instanceof a.HTMLIFrameElement;) {
        try {
          var t = typeof e.contentWindow.location.href == "string";
        } catch {
          t = !1;
        }
        if (t) a = e.contentWindow;
        else break;
        e = ju(a.document);
      }
      return e;
    }
    function Gs(a) {
      var e = a && a.nodeName && a.nodeName.toLowerCase();
      return (
        e &&
        ((e === "input" &&
          (a.type === "text" ||
            a.type === "search" ||
            a.type === "tel" ||
            a.type === "url" ||
            a.type === "password")) ||
          e === "textarea" ||
          a.contentEditable === "true")
      );
    }
    var Mb = At && "documentMode" in document && 11 >= document.documentMode,
      en = null,
      Wc = null,
      li = null,
      Fc = !1;
    function Bf(a, e, t) {
      var l = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
      Fc ||
        en == null ||
        en !== ju(l) ||
        ((l = en),
        "selectionStart" in l && Gs(l)
          ? (l = { start: l.selectionStart, end: l.selectionEnd })
          : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
            (l = {
              anchorNode: l.anchorNode,
              anchorOffset: l.anchorOffset,
              focusNode: l.focusNode,
              focusOffset: l.focusOffset,
            })),
        (li && bi(li, l)) ||
          ((li = l),
          (l = lo(Wc, "onSelect")),
          0 < l.length &&
            ((e = new fo("onSelect", "select", null, e, t)),
            a.push({ event: e, listeners: l }),
            (e.target = en))));
    }
    function yl(a, e) {
      var t = {};
      return (
        (t[a.toLowerCase()] = e.toLowerCase()),
        (t["Webkit" + a] = "webkit" + e),
        (t["Moz" + a] = "moz" + e),
        t
      );
    }
    var tn = {
        animationend: yl("Animation", "AnimationEnd"),
        animationiteration: yl("Animation", "AnimationIteration"),
        animationstart: yl("Animation", "AnimationStart"),
        transitionrun: yl("Transition", "TransitionRun"),
        transitionstart: yl("Transition", "TransitionStart"),
        transitioncancel: yl("Transition", "TransitionCancel"),
        transitionend: yl("Transition", "TransitionEnd"),
      },
      mc = {},
      Mm = {};
    At &&
      ((Mm = document.createElement("div").style),
      "AnimationEvent" in window ||
        (delete tn.animationend.animation,
        delete tn.animationiteration.animation,
        delete tn.animationstart.animation),
      "TransitionEvent" in window || delete tn.transitionend.transition);
    function Ul(a) {
      if (mc[a]) return mc[a];
      if (!tn[a]) return a;
      var e = tn[a],
        t;
      for (t in e) if (e.hasOwnProperty(t) && t in Mm) return (mc[a] = e[t]);
      return a;
    }
    var Em = Ul("animationend"),
      Nm = Ul("animationiteration"),
      Tm = Ul("animationstart"),
      Eb = Ul("transitionrun"),
      Nb = Ul("transitionstart"),
      Tb = Ul("transitioncancel"),
      Am = Ul("transitionend"),
      Cm = new Map(),
      Ic =
        "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
          " ",
        );
    Ic.push("scrollEnd");
    function Ve(a, e) {
      (Cm.set(a, e), kl(e, [a]));
    }
    var Bu =
        typeof reportError == "function"
          ? reportError
          : function (a) {
              if (typeof window == "object" && typeof window.ErrorEvent == "function") {
                var e = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof a == "object" && a !== null && typeof a.message == "string"
                      ? String(a.message)
                      : String(a),
                  error: a,
                });
                if (!window.dispatchEvent(e)) return;
              } else if (typeof process == "object" && typeof process.emit == "function") {
                process.emit("uncaughtException", a);
                return;
              }
              console.error(a);
            },
      Re = [],
      ln = 0,
      Xs = 0;
    function go() {
      for (var a = ln, e = (Xs = ln = 0); e < a;) {
        var t = Re[e];
        Re[e++] = null;
        var l = Re[e];
        Re[e++] = null;
        var n = Re[e];
        Re[e++] = null;
        var i = Re[e];
        if (((Re[e++] = null), l !== null && n !== null)) {
          var u = l.pending;
          (u === null ? (n.next = n) : ((n.next = u.next), (u.next = n)), (l.pending = n));
        }
        i !== 0 && Om(t, n, i);
      }
    }
    function vo(a, e, t, l) {
      ((Re[ln++] = a),
        (Re[ln++] = e),
        (Re[ln++] = t),
        (Re[ln++] = l),
        (Xs |= l),
        (a.lanes |= l),
        (a = a.alternate),
        a !== null && (a.lanes |= l));
    }
    function Qs(a, e, t, l) {
      return (vo(a, e, t, l), Yu(a));
    }
    function ql(a, e) {
      return (vo(a, null, null, e), Yu(a));
    }
    function Om(a, e, t) {
      a.lanes |= t;
      var l = a.alternate;
      l !== null && (l.lanes |= t);
      for (var n = !1, i = a.return; i !== null;)
        ((i.childLanes |= t),
          (l = i.alternate),
          l !== null && (l.childLanes |= t),
          i.tag === 22 && ((a = i.stateNode), a === null || a._visibility & 1 || (n = !0)),
          (a = i),
          (i = i.return));
      return a.tag === 3
        ? ((i = a.stateNode),
          n &&
            e !== null &&
            ((n = 31 - Ee(t)),
            (a = i.hiddenUpdates),
            (l = a[n]),
            l === null ? (a[n] = [e]) : l.push(e),
            (e.lane = t | 536870912)),
          i)
        : null;
    }
    function Yu(a) {
      if (50 < di) throw ((di = 0), (ys = null), Error(z(185)));
      for (var e = a.return; e !== null;) ((a = e), (e = a.return));
      return a.tag === 3 ? a.stateNode : null;
    }
    var nn = {};
    function Ab(a, e, t, l) {
      ((this.tag = a),
        (this.key = t),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = e),
        (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
        (this.mode = l),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function Se(a, e, t, l) {
      return new Ab(a, e, t, l);
    }
    function Vs(a) {
      return ((a = a.prototype), !(!a || !a.isReactComponent));
    }
    function Et(a, e) {
      var t = a.alternate;
      return (
        t === null
          ? ((t = Se(a.tag, e, a.key, a.mode)),
            (t.elementType = a.elementType),
            (t.type = a.type),
            (t.stateNode = a.stateNode),
            (t.alternate = a),
            (a.alternate = t))
          : ((t.pendingProps = e),
            (t.type = a.type),
            (t.flags = 0),
            (t.subtreeFlags = 0),
            (t.deletions = null)),
        (t.flags = a.flags & 65011712),
        (t.childLanes = a.childLanes),
        (t.lanes = a.lanes),
        (t.child = a.child),
        (t.memoizedProps = a.memoizedProps),
        (t.memoizedState = a.memoizedState),
        (t.updateQueue = a.updateQueue),
        (e = a.dependencies),
        (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
        (t.sibling = a.sibling),
        (t.index = a.index),
        (t.ref = a.ref),
        (t.refCleanup = a.refCleanup),
        t
      );
    }
    function Dm(a, e) {
      a.flags &= 65011714;
      var t = a.alternate;
      return (
        t === null
          ? ((a.childLanes = 0),
            (a.lanes = e),
            (a.child = null),
            (a.subtreeFlags = 0),
            (a.memoizedProps = null),
            (a.memoizedState = null),
            (a.updateQueue = null),
            (a.dependencies = null),
            (a.stateNode = null))
          : ((a.childLanes = t.childLanes),
            (a.lanes = t.lanes),
            (a.child = t.child),
            (a.subtreeFlags = 0),
            (a.deletions = null),
            (a.memoizedProps = t.memoizedProps),
            (a.memoizedState = t.memoizedState),
            (a.updateQueue = t.updateQueue),
            (a.type = t.type),
            (e = t.dependencies),
            (a.dependencies =
              e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
        a
      );
    }
    function Eu(a, e, t, l, n, i) {
      var u = 0;
      if (((l = a), typeof a == "function")) Vs(a) && (u = 1);
      else if (typeof a == "string")
        u = Dh(a, t, nt.current) ? 26 : a === "html" || a === "head" || a === "body" ? 27 : 5;
      else
        a: switch (a) {
          case jc:
            return ((a = Se(31, t, e, n)), (a.elementType = jc), (a.lanes = i), a);
          case Wl:
            return Nl(t.children, n, i, e);
          case $d:
            ((u = 8), (n |= 24));
            break;
          case Uc:
            return ((a = Se(12, t, e, n | 2)), (a.elementType = Uc), (a.lanes = i), a);
          case qc:
            return ((a = Se(13, t, e, n)), (a.elementType = qc), (a.lanes = i), a);
          case Hc:
            return ((a = Se(19, t, e, n)), (a.elementType = Hc), (a.lanes = i), a);
          default:
            if (typeof a == "object" && a !== null)
              switch (a.$$typeof) {
                case xt:
                  u = 10;
                  break a;
                case Wd:
                  u = 9;
                  break a;
                case Rs:
                  u = 11;
                  break a;
                case ws:
                  u = 14;
                  break a;
                case jt:
                  ((u = 16), (l = null));
                  break a;
              }
            ((u = 29), (t = Error(z(130, a === null ? "null" : typeof a, ""))), (l = null));
        }
      return ((e = Se(u, t, e, n)), (e.elementType = a), (e.type = l), (e.lanes = i), e);
    }
    function Nl(a, e, t, l) {
      return ((a = Se(7, a, l, e)), (a.lanes = t), a);
    }
    function pc(a, e, t) {
      return ((a = Se(6, a, null, e)), (a.lanes = t), a);
    }
    function Rm(a) {
      var e = Se(18, null, null, 0);
      return ((e.stateNode = a), e);
    }
    function gc(a, e, t) {
      return (
        (e = Se(4, a.children !== null ? a.children : [], a.key, e)),
        (e.lanes = t),
        (e.stateNode = {
          containerInfo: a.containerInfo,
          pendingChildren: null,
          implementation: a.implementation,
        }),
        e
      );
    }
    var Yf = new WeakMap();
    function Ue(a, e) {
      if (typeof a == "object" && a !== null) {
        var t = Yf.get(a);
        return t !== void 0 ? t : ((e = { value: a, source: e, stack: zf(e) }), Yf.set(a, e), e);
      }
      return { value: a, source: e, stack: zf(e) };
    }
    var un = [],
      on = 0,
      Gu = null,
      hi = 0,
      _e = [],
      ke = 0,
      il = null,
      et = 1,
      tt = "";
    function yt(a, e) {
      ((un[on++] = hi), (un[on++] = Gu), (Gu = a), (hi = e));
    }
    function wm(a, e, t) {
      ((_e[ke++] = et), (_e[ke++] = tt), (_e[ke++] = il), (il = a));
      var l = et;
      a = tt;
      var n = 32 - Ee(l) - 1;
      ((l &= ~(1 << n)), (t += 1));
      var i = 32 - Ee(e) + n;
      if (30 < i) {
        var u = n - (n % 5);
        ((i = (l & ((1 << u) - 1)).toString(32)),
          (l >>= u),
          (n -= u),
          (et = (1 << (32 - Ee(e) + n)) | (t << n) | l),
          (tt = i + a));
      } else ((et = (1 << i) | (t << n) | l), (tt = a));
    }
    function Zs(a) {
      a.return !== null && (yt(a, 1), wm(a, 1, 0));
    }
    function Ks(a) {
      for (; a === Gu;) ((Gu = un[--on]), (un[on] = null), (hi = un[--on]), (un[on] = null));
      for (; a === il;)
        ((il = _e[--ke]),
          (_e[ke] = null),
          (tt = _e[--ke]),
          (_e[ke] = null),
          (et = _e[--ke]),
          (_e[ke] = null));
    }
    function _m(a, e) {
      ((_e[ke++] = et), (_e[ke++] = tt), (_e[ke++] = il), (et = e.id), (tt = e.overflow), (il = a));
    }
    var Ka = null,
      ba = null,
      P = !1,
      Ft = null,
      qe = !1,
      Pc = Error(z(519));
    function ul(a) {
      var e = Error(
        z(
          418,
          1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
          "",
        ),
      );
      throw (yi(Ue(e, a)), Pc);
    }
    function Gf(a) {
      var e = a.stateNode,
        t = a.type,
        l = a.memoizedProps;
      switch (((e[Za] = a), (e[fe] = l), t)) {
        case "dialog":
          ($("cancel", e), $("close", e));
          break;
        case "iframe":
        case "object":
        case "embed":
          $("load", e);
          break;
        case "video":
        case "audio":
          for (t = 0; t < Mi.length; t++) $(Mi[t], e);
          break;
        case "source":
          $("error", e);
          break;
        case "img":
        case "image":
        case "link":
          ($("error", e), $("load", e));
          break;
        case "details":
          $("toggle", e);
          break;
        case "input":
          ($("invalid", e),
            sm(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0));
          break;
        case "select":
          $("invalid", e);
          break;
        case "textarea":
          ($("invalid", e), fm(e, l.value, l.defaultValue, l.children));
      }
      ((t = l.children),
        (typeof t != "string" && typeof t != "number" && typeof t != "bigint") ||
        e.textContent === "" + t ||
        l.suppressHydrationWarning === !0 ||
        g0(e.textContent, t)
          ? (l.popover != null && ($("beforetoggle", e), $("toggle", e)),
            l.onScroll != null && $("scroll", e),
            l.onScrollEnd != null && $("scrollend", e),
            l.onClick != null && (e.onclick = zt),
            (e = !0))
          : (e = !1),
        e || ul(a, !0));
    }
    function Xf(a) {
      for (Ka = a.return; Ka;)
        switch (Ka.tag) {
          case 5:
          case 31:
          case 13:
            qe = !1;
            return;
          case 27:
          case 3:
            qe = !0;
            return;
          default:
            Ka = Ka.return;
        }
    }
    function Zl(a) {
      if (a !== Ka) return !1;
      if (!P) return (Xf(a), (P = !0), !1);
      var e = a.tag,
        t;
      if (
        ((t = e !== 3 && e !== 27) &&
          ((t = e === 5) &&
            ((t = a.type), (t = !(t !== "form" && t !== "button") || Es(a.type, a.memoizedProps))),
          (t = !t)),
        t && ba && ul(a),
        Xf(a),
        e === 13)
      ) {
        if (((a = a.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
          throw Error(z(317));
        ba = Rd(a);
      } else if (e === 31) {
        if (((a = a.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
          throw Error(z(317));
        ba = Rd(a);
      } else
        e === 27
          ? ((e = ba), rl(a.type) ? ((a = Cs), (Cs = null), (ba = a)) : (ba = e))
          : (ba = Ka ? je(a.stateNode.nextSibling) : null);
      return !0;
    }
    function Ol() {
      ((ba = Ka = null), (P = !1));
    }
    function vc() {
      var a = Ft;
      return (a !== null && (se === null ? (se = a) : se.push.apply(se, a), (Ft = null)), a);
    }
    function yi(a) {
      Ft === null ? (Ft = [a]) : Ft.push(a);
    }
    var as = it(null),
      Hl = null,
      Mt = null;
    function Yt(a, e, t) {
      (ma(as, e._currentValue), (e._currentValue = t));
    }
    function Nt(a) {
      ((a._currentValue = as.current), Ba(as));
    }
    function es(a, e, t) {
      for (; a !== null;) {
        var l = a.alternate;
        if (
          ((a.childLanes & e) !== e
            ? ((a.childLanes |= e), l !== null && (l.childLanes |= e))
            : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e),
          a === t)
        )
          break;
        a = a.return;
      }
    }
    function ts(a, e, t, l) {
      var n = a.child;
      for (n !== null && (n.return = a); n !== null;) {
        var i = n.dependencies;
        if (i !== null) {
          var u = n.child;
          i = i.firstContext;
          a: for (; i !== null;) {
            var o = i;
            i = n;
            for (var c = 0; c < e.length; c++)
              if (o.context === e[c]) {
                ((i.lanes |= t),
                  (o = i.alternate),
                  o !== null && (o.lanes |= t),
                  es(i.return, t, a),
                  l || (u = null));
                break a;
              }
            i = o.next;
          }
        } else if (n.tag === 18) {
          if (((u = n.return), u === null)) throw Error(z(341));
          ((u.lanes |= t),
            (i = u.alternate),
            i !== null && (i.lanes |= t),
            es(u, t, a),
            (u = null));
        } else u = n.child;
        if (u !== null) u.return = n;
        else
          for (u = n; u !== null;) {
            if (u === a) {
              u = null;
              break;
            }
            if (((n = u.sibling), n !== null)) {
              ((n.return = u.return), (u = n));
              break;
            }
            u = u.return;
          }
        n = u;
      }
    }
    function On(a, e, t, l) {
      a = null;
      for (var n = e, i = !1; n !== null;) {
        if (!i) {
          if ((n.flags & 524288) !== 0) i = !0;
          else if ((n.flags & 262144) !== 0) break;
        }
        if (n.tag === 10) {
          var u = n.alternate;
          if (u === null) throw Error(z(387));
          if (((u = u.memoizedProps), u !== null)) {
            var o = n.type;
            Te(n.pendingProps.value, u.value) || (a !== null ? a.push(o) : (a = [o]));
          }
        } else if (n === Lu.current) {
          if (((u = n.alternate), u === null)) throw Error(z(387));
          u.memoizedState.memoizedState !== n.memoizedState.memoizedState &&
            (a !== null ? a.push(Ni) : (a = [Ni]));
        }
        n = n.return;
      }
      (a !== null && ts(e, a, t, l), (e.flags |= 262144));
    }
    function Xu(a) {
      for (a = a.firstContext; a !== null;) {
        if (!Te(a.context._currentValue, a.memoizedValue)) return !0;
        a = a.next;
      }
      return !1;
    }
    function Dl(a) {
      ((Hl = a), (Mt = null), (a = a.dependencies), a !== null && (a.firstContext = null));
    }
    function Ja(a) {
      return km(Hl, a);
    }
    function ru(a, e) {
      return (Hl === null && Dl(a), km(a, e));
    }
    function km(a, e) {
      var t = e._currentValue;
      if (((e = { context: e, memoizedValue: t, next: null }), Mt === null)) {
        if (a === null) throw Error(z(308));
        ((Mt = e), (a.dependencies = { lanes: 0, firstContext: e }), (a.flags |= 524288));
      } else Mt = Mt.next = e;
      return t;
    }
    var Cb =
        typeof AbortController < "u"
          ? AbortController
          : function () {
              var a = [],
                e = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, l) {
                    a.push(l);
                  },
                });
              this.abort = function () {
                ((e.aborted = !0),
                  a.forEach(function (t) {
                    return t();
                  }));
              };
            },
      Ob = qa.unstable_scheduleCallback,
      Db = qa.unstable_NormalPriority,
      ka = {
        $$typeof: xt,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function Js() {
      return { controller: new Cb(), data: new Map(), refCount: 0 };
    }
    function ki(a) {
      (a.refCount--,
        a.refCount === 0 &&
          Ob(Db, function () {
            a.controller.abort();
          }));
    }
    var ni = null,
      ls = 0,
      yn = 0,
      dn = null;
    function Rb(a, e) {
      if (ni === null) {
        var t = (ni = []);
        ((ls = 0),
          (yn = yr()),
          (dn = {
            status: "pending",
            value: void 0,
            then: function (l) {
              t.push(l);
            },
          }));
      }
      return (ls++, e.then(Qf, Qf), e);
    }
    function Qf() {
      if (--ls === 0 && ni !== null) {
        dn !== null && (dn.status = "fulfilled");
        var a = ni;
        ((ni = null), (yn = 0), (dn = null));
        for (var e = 0; e < a.length; e++) (0, a[e])();
      }
    }
    function wb(a, e) {
      var t = [],
        l = {
          status: "pending",
          value: null,
          reason: null,
          then: function (n) {
            t.push(n);
          },
        };
      return (
        a.then(
          function () {
            ((l.status = "fulfilled"), (l.value = e));
            for (var n = 0; n < t.length; n++) (0, t[n])(e);
          },
          function (n) {
            for (l.status = "rejected", l.reason = n, n = 0; n < t.length; n++) (0, t[n])(void 0);
          },
        ),
        l
      );
    }
    var Vf = B.S;
    B.S = function (a, e) {
      ((Jp = ze()),
        typeof e == "object" && e !== null && typeof e.then == "function" && Rb(a, e),
        Vf !== null && Vf(a, e));
    };
    var Tl = it(null);
    function $s() {
      var a = Tl.current;
      return a !== null ? a : ra.pooledCache;
    }
    function Nu(a, e) {
      e === null ? ma(Tl, Tl.current) : ma(Tl, e.pool);
    }
    function Lm() {
      var a = $s();
      return a === null ? null : { parent: ka._currentValue, pool: a };
    }
    var Dn = Error(z(460)),
      Ws = Error(z(474)),
      bo = Error(z(542)),
      Qu = { then: function () {} };
    function Zf(a) {
      return ((a = a.status), a === "fulfilled" || a === "rejected");
    }
    function Um(a, e, t) {
      switch (
        ((t = a[t]), t === void 0 ? a.push(e) : t !== e && (e.then(zt, zt), (e = t)), e.status)
      ) {
        case "fulfilled":
          return e.value;
        case "rejected":
          throw ((a = e.reason), Jf(a), a);
        default:
          if (typeof e.status == "string") e.then(zt, zt);
          else {
            if (((a = ra), a !== null && 100 < a.shellSuspendCounter)) throw Error(z(482));
            ((a = e),
              (a.status = "pending"),
              a.then(
                function (l) {
                  if (e.status === "pending") {
                    var n = e;
                    ((n.status = "fulfilled"), (n.value = l));
                  }
                },
                function (l) {
                  if (e.status === "pending") {
                    var n = e;
                    ((n.status = "rejected"), (n.reason = l));
                  }
                },
              ));
          }
          switch (e.status) {
            case "fulfilled":
              return e.value;
            case "rejected":
              throw ((a = e.reason), Jf(a), a);
          }
          throw ((Al = e), Dn);
      }
    }
    function zl(a) {
      try {
        var e = a._init;
        return e(a._payload);
      } catch (t) {
        throw t !== null && typeof t == "object" && typeof t.then == "function"
          ? ((Al = t), Dn)
          : t;
      }
    }
    var Al = null;
    function Kf() {
      if (Al === null) throw Error(z(459));
      var a = Al;
      return ((Al = null), a);
    }
    function Jf(a) {
      if (a === Dn || a === bo) throw Error(z(483));
    }
    var mn = null,
      Si = 0;
    function fu(a) {
      var e = Si;
      return ((Si += 1), mn === null && (mn = []), Um(mn, a, e));
    }
    function Vn(a, e) {
      ((e = e.props.ref), (a.ref = e !== void 0 ? e : null));
    }
    function du(a, e) {
      throw e.$$typeof === hv
        ? Error(z(525))
        : ((a = Object.prototype.toString.call(e)),
          Error(
            z(
              31,
              a === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : a,
            ),
          ));
    }
    function qm(a) {
      function e(s, r) {
        if (a) {
          var p = s.deletions;
          p === null ? ((s.deletions = [r]), (s.flags |= 16)) : p.push(r);
        }
      }
      function t(s, r) {
        if (!a) return null;
        for (; r !== null;) (e(s, r), (r = r.sibling));
        return null;
      }
      function l(s) {
        for (var r = new Map(); s !== null;)
          (s.key !== null ? r.set(s.key, s) : r.set(s.index, s), (s = s.sibling));
        return r;
      }
      function n(s, r) {
        return ((s = Et(s, r)), (s.index = 0), (s.sibling = null), s);
      }
      function i(s, r, p) {
        return (
          (s.index = p),
          a
            ? ((p = s.alternate),
              p !== null
                ? ((p = p.index), p < r ? ((s.flags |= 67108866), r) : p)
                : ((s.flags |= 67108866), r))
            : ((s.flags |= 1048576), r)
        );
      }
      function u(s) {
        return (a && s.alternate === null && (s.flags |= 67108866), s);
      }
      function o(s, r, p, y) {
        return r === null || r.tag !== 6
          ? ((r = pc(p, s.mode, y)), (r.return = s), r)
          : ((r = n(r, p)), (r.return = s), r);
      }
      function c(s, r, p, y) {
        var N = p.type;
        return N === Wl
          ? g(s, r, p.props.children, y, p.key)
          : r !== null &&
              (r.elementType === N ||
                (typeof N == "object" && N !== null && N.$$typeof === jt && zl(N) === r.type))
            ? ((r = n(r, p.props)), Vn(r, p), (r.return = s), r)
            : ((r = Eu(p.type, p.key, p.props, null, s.mode, y)), Vn(r, p), (r.return = s), r);
      }
      function d(s, r, p, y) {
        return r === null ||
          r.tag !== 4 ||
          r.stateNode.containerInfo !== p.containerInfo ||
          r.stateNode.implementation !== p.implementation
          ? ((r = gc(p, s.mode, y)), (r.return = s), r)
          : ((r = n(r, p.children || [])), (r.return = s), r);
      }
      function g(s, r, p, y, N) {
        return r === null || r.tag !== 7
          ? ((r = Nl(p, s.mode, y, N)), (r.return = s), r)
          : ((r = n(r, p)), (r.return = s), r);
      }
      function b(s, r, p) {
        if ((typeof r == "string" && r !== "") || typeof r == "number" || typeof r == "bigint")
          return ((r = pc("" + r, s.mode, p)), (r.return = s), r);
        if (typeof r == "object" && r !== null) {
          switch (r.$$typeof) {
            case tu:
              return (
                (p = Eu(r.type, r.key, r.props, null, s.mode, p)),
                Vn(p, r),
                (p.return = s),
                p
              );
            case Wn:
              return ((r = gc(r, s.mode, p)), (r.return = s), r);
            case jt:
              return ((r = zl(r)), b(s, r, p));
          }
          if (Fn(r) || Xn(r)) return ((r = Nl(r, s.mode, p, null)), (r.return = s), r);
          if (typeof r.then == "function") return b(s, fu(r), p);
          if (r.$$typeof === xt) return b(s, ru(s, r), p);
          du(s, r);
        }
        return null;
      }
      function m(s, r, p, y) {
        var N = r !== null ? r.key : null;
        if ((typeof p == "string" && p !== "") || typeof p == "number" || typeof p == "bigint")
          return N !== null ? null : o(s, r, "" + p, y);
        if (typeof p == "object" && p !== null) {
          switch (p.$$typeof) {
            case tu:
              return p.key === N ? c(s, r, p, y) : null;
            case Wn:
              return p.key === N ? d(s, r, p, y) : null;
            case jt:
              return ((p = zl(p)), m(s, r, p, y));
          }
          if (Fn(p) || Xn(p)) return N !== null ? null : g(s, r, p, y, null);
          if (typeof p.then == "function") return m(s, r, fu(p), y);
          if (p.$$typeof === xt) return m(s, r, ru(s, p), y);
          du(s, p);
        }
        return null;
      }
      function f(s, r, p, y, N) {
        if ((typeof y == "string" && y !== "") || typeof y == "number" || typeof y == "bigint")
          return ((s = s.get(p) || null), o(r, s, "" + y, N));
        if (typeof y == "object" && y !== null) {
          switch (y.$$typeof) {
            case tu:
              return ((s = s.get(y.key === null ? p : y.key) || null), c(r, s, y, N));
            case Wn:
              return ((s = s.get(y.key === null ? p : y.key) || null), d(r, s, y, N));
            case jt:
              return ((y = zl(y)), f(s, r, p, y, N));
          }
          if (Fn(y) || Xn(y)) return ((s = s.get(p) || null), g(r, s, y, N, null));
          if (typeof y.then == "function") return f(s, r, p, fu(y), N);
          if (y.$$typeof === xt) return f(s, r, p, ru(r, y), N);
          du(r, y);
        }
        return null;
      }
      function x(s, r, p, y) {
        for (
          var N = null, R = null, A = r, _ = (r = 0), U = null;
          A !== null && _ < p.length;
          _++
        ) {
          A.index > _ ? ((U = A), (A = null)) : (U = A.sibling);
          var h = m(s, A, p[_], y);
          if (h === null) {
            A === null && (A = U);
            break;
          }
          (a && A && h.alternate === null && e(s, A),
            (r = i(h, r, _)),
            R === null ? (N = h) : (R.sibling = h),
            (R = h),
            (A = U));
        }
        if (_ === p.length) return (t(s, A), P && yt(s, _), N);
        if (A === null) {
          for (; _ < p.length; _++)
            ((A = b(s, p[_], y)),
              A !== null && ((r = i(A, r, _)), R === null ? (N = A) : (R.sibling = A), (R = A)));
          return (P && yt(s, _), N);
        }
        for (A = l(A); _ < p.length; _++)
          ((U = f(A, s, _, p[_], y)),
            U !== null &&
              (a && U.alternate !== null && A.delete(U.key === null ? _ : U.key),
              (r = i(U, r, _)),
              R === null ? (N = U) : (R.sibling = U),
              (R = U)));
        return (
          a &&
            A.forEach(function (k) {
              return e(s, k);
            }),
          P && yt(s, _),
          N
        );
      }
      function S(s, r, p, y) {
        if (p == null) throw Error(z(151));
        for (
          var N = null, R = null, A = r, _ = (r = 0), U = null, h = p.next();
          A !== null && !h.done;
          _++, h = p.next()
        ) {
          A.index > _ ? ((U = A), (A = null)) : (U = A.sibling);
          var k = m(s, A, h.value, y);
          if (k === null) {
            A === null && (A = U);
            break;
          }
          (a && A && k.alternate === null && e(s, A),
            (r = i(k, r, _)),
            R === null ? (N = k) : (R.sibling = k),
            (R = k),
            (A = U));
        }
        if (h.done) return (t(s, A), P && yt(s, _), N);
        if (A === null) {
          for (; !h.done; _++, h = p.next())
            ((h = b(s, h.value, y)),
              h !== null && ((r = i(h, r, _)), R === null ? (N = h) : (R.sibling = h), (R = h)));
          return (P && yt(s, _), N);
        }
        for (A = l(A); !h.done; _++, h = p.next())
          ((h = f(A, s, _, h.value, y)),
            h !== null &&
              (a && h.alternate !== null && A.delete(h.key === null ? _ : h.key),
              (r = i(h, r, _)),
              R === null ? (N = h) : (R.sibling = h),
              (R = h)));
        return (
          a &&
            A.forEach(function (ya) {
              return e(s, ya);
            }),
          P && yt(s, _),
          N
        );
      }
      function T(s, r, p, y) {
        if (
          (typeof p == "object" &&
            p !== null &&
            p.type === Wl &&
            p.key === null &&
            (p = p.props.children),
          typeof p == "object" && p !== null)
        ) {
          switch (p.$$typeof) {
            case tu:
              a: {
                for (var N = p.key; r !== null;) {
                  if (r.key === N) {
                    if (((N = p.type), N === Wl)) {
                      if (r.tag === 7) {
                        (t(s, r.sibling), (y = n(r, p.props.children)), (y.return = s), (s = y));
                        break a;
                      }
                    } else if (
                      r.elementType === N ||
                      (typeof N == "object" && N !== null && N.$$typeof === jt && zl(N) === r.type)
                    ) {
                      (t(s, r.sibling), (y = n(r, p.props)), Vn(y, p), (y.return = s), (s = y));
                      break a;
                    }
                    t(s, r);
                    break;
                  } else e(s, r);
                  r = r.sibling;
                }
                p.type === Wl
                  ? ((y = Nl(p.props.children, s.mode, y, p.key)), (y.return = s), (s = y))
                  : ((y = Eu(p.type, p.key, p.props, null, s.mode, y)),
                    Vn(y, p),
                    (y.return = s),
                    (s = y));
              }
              return u(s);
            case Wn:
              a: {
                for (N = p.key; r !== null;) {
                  if (r.key === N)
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === p.containerInfo &&
                      r.stateNode.implementation === p.implementation
                    ) {
                      (t(s, r.sibling), (y = n(r, p.children || [])), (y.return = s), (s = y));
                      break a;
                    } else {
                      t(s, r);
                      break;
                    }
                  else e(s, r);
                  r = r.sibling;
                }
                ((y = gc(p, s.mode, y)), (y.return = s), (s = y));
              }
              return u(s);
            case jt:
              return ((p = zl(p)), T(s, r, p, y));
          }
          if (Fn(p)) return x(s, r, p, y);
          if (Xn(p)) {
            if (((N = Xn(p)), typeof N != "function")) throw Error(z(150));
            return ((p = N.call(p)), S(s, r, p, y));
          }
          if (typeof p.then == "function") return T(s, r, fu(p), y);
          if (p.$$typeof === xt) return T(s, r, ru(s, p), y);
          du(s, p);
        }
        return (typeof p == "string" && p !== "") || typeof p == "number" || typeof p == "bigint"
          ? ((p = "" + p),
            r !== null && r.tag === 6
              ? (t(s, r.sibling), (y = n(r, p)), (y.return = s), (s = y))
              : (t(s, r), (y = pc(p, s.mode, y)), (y.return = s), (s = y)),
            u(s))
          : t(s, r);
      }
      return function (s, r, p, y) {
        try {
          Si = 0;
          var N = T(s, r, p, y);
          return ((mn = null), N);
        } catch (A) {
          if (A === Dn || A === bo) throw A;
          var R = Se(29, A, null, s.mode);
          return ((R.lanes = y), (R.return = s), R);
        }
      };
    }
    var Rl = qm(!0),
      Hm = qm(!1),
      Bt = !1;
    function Fs(a) {
      a.updateQueue = {
        baseState: a.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function ns(a, e) {
      ((a = a.updateQueue),
        e.updateQueue === a &&
          (e.updateQueue = {
            baseState: a.baseState,
            firstBaseUpdate: a.firstBaseUpdate,
            lastBaseUpdate: a.lastBaseUpdate,
            shared: a.shared,
            callbacks: null,
          }));
    }
    function It(a) {
      return { lane: a, tag: 0, payload: null, callback: null, next: null };
    }
    function Pt(a, e, t) {
      var l = a.updateQueue;
      if (l === null) return null;
      if (((l = l.shared), (ta & 2) !== 0)) {
        var n = l.pending;
        return (
          n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
          (l.pending = e),
          (e = Yu(a)),
          Om(a, null, t),
          e
        );
      }
      return (vo(a, l, e, t), Yu(a));
    }
    function ii(a, e, t) {
      if (((e = e.updateQueue), e !== null && ((e = e.shared), (t & 4194048) !== 0))) {
        var l = e.lanes;
        ((l &= a.pendingLanes), (t |= l), (e.lanes = t), tm(a, t));
      }
    }
    function bc(a, e) {
      var t = a.updateQueue,
        l = a.alternate;
      if (l !== null && ((l = l.updateQueue), t === l)) {
        var n = null,
          i = null;
        if (((t = t.firstBaseUpdate), t !== null)) {
          do {
            var u = { lane: t.lane, tag: t.tag, payload: t.payload, callback: null, next: null };
            (i === null ? (n = i = u) : (i = i.next = u), (t = t.next));
          } while (t !== null);
          i === null ? (n = i = e) : (i = i.next = e);
        } else n = i = e;
        ((t = {
          baseState: l.baseState,
          firstBaseUpdate: n,
          lastBaseUpdate: i,
          shared: l.shared,
          callbacks: l.callbacks,
        }),
          (a.updateQueue = t));
        return;
      }
      ((a = t.lastBaseUpdate),
        a === null ? (t.firstBaseUpdate = e) : (a.next = e),
        (t.lastBaseUpdate = e));
    }
    var is = !1;
    function ui() {
      if (is) {
        var a = dn;
        if (a !== null) throw a;
      }
    }
    function oi(a, e, t, l) {
      is = !1;
      var n = a.updateQueue;
      Bt = !1;
      var i = n.firstBaseUpdate,
        u = n.lastBaseUpdate,
        o = n.shared.pending;
      if (o !== null) {
        n.shared.pending = null;
        var c = o,
          d = c.next;
        ((c.next = null), u === null ? (i = d) : (u.next = d), (u = c));
        var g = a.alternate;
        g !== null &&
          ((g = g.updateQueue),
          (o = g.lastBaseUpdate),
          o !== u && (o === null ? (g.firstBaseUpdate = d) : (o.next = d), (g.lastBaseUpdate = c)));
      }
      if (i !== null) {
        var b = n.baseState;
        ((u = 0), (g = d = c = null), (o = i));
        do {
          var m = o.lane & -536870913,
            f = m !== o.lane;
          if (f ? (I & m) === m : (l & m) === m) {
            (m !== 0 && m === yn && (is = !0),
              g !== null &&
                (g = g.next =
                  { lane: 0, tag: o.tag, payload: o.payload, callback: null, next: null }));
            a: {
              var x = a,
                S = o;
              m = e;
              var T = t;
              switch (S.tag) {
                case 1:
                  if (((x = S.payload), typeof x == "function")) {
                    b = x.call(T, b, m);
                    break a;
                  }
                  b = x;
                  break a;
                case 3:
                  x.flags = (x.flags & -65537) | 128;
                case 0:
                  if (
                    ((x = S.payload), (m = typeof x == "function" ? x.call(T, b, m) : x), m == null)
                  )
                    break a;
                  b = ha({}, b, m);
                  break a;
                case 2:
                  Bt = !0;
              }
            }
            ((m = o.callback),
              m !== null &&
                ((a.flags |= 64),
                f && (a.flags |= 8192),
                (f = n.callbacks),
                f === null ? (n.callbacks = [m]) : f.push(m)));
          } else
            ((f = { lane: m, tag: o.tag, payload: o.payload, callback: o.callback, next: null }),
              g === null ? ((d = g = f), (c = b)) : (g = g.next = f),
              (u |= m));
          if (((o = o.next), o === null)) {
            if (((o = n.shared.pending), o === null)) break;
            ((f = o),
              (o = f.next),
              (f.next = null),
              (n.lastBaseUpdate = f),
              (n.shared.pending = null));
          }
        } while (!0);
        (g === null && (c = b),
          (n.baseState = c),
          (n.firstBaseUpdate = d),
          (n.lastBaseUpdate = g),
          i === null && (n.shared.lanes = 0),
          (cl |= u),
          (a.lanes = u),
          (a.memoizedState = b));
      }
    }
    function jm(a, e) {
      if (typeof a != "function") throw Error(z(191, a));
      a.call(e);
    }
    function Bm(a, e) {
      var t = a.callbacks;
      if (t !== null) for (a.callbacks = null, a = 0; a < t.length; a++) jm(t[a], e);
    }
    var Sn = it(null),
      Vu = it(0);
    function $f(a, e) {
      ((a = Rt), ma(Vu, a), ma(Sn, e), (Rt = a | e.baseLanes));
    }
    function us() {
      (ma(Vu, Rt), ma(Sn, Sn.current));
    }
    function Is() {
      ((Rt = Vu.current), Ba(Sn), Ba(Vu));
    }
    var Ae = it(null),
      He = null;
    function Gt(a) {
      var e = a.alternate;
      (ma(Oa, Oa.current & 1),
        ma(Ae, a),
        He === null && (e === null || Sn.current !== null || e.memoizedState !== null) && (He = a));
    }
    function os(a) {
      (ma(Oa, Oa.current), ma(Ae, a), He === null && (He = a));
    }
    function Ym(a) {
      a.tag === 22 ? (ma(Oa, Oa.current), ma(Ae, a), He === null && (He = a)) : Xt(a);
    }
    function Xt() {
      (ma(Oa, Oa.current), ma(Ae, Ae.current));
    }
    function ye(a) {
      (Ba(Ae), He === a && (He = null), Ba(Oa));
    }
    var Oa = it(0);
    function Zu(a) {
      for (var e = a; e !== null;) {
        if (e.tag === 13) {
          var t = e.memoizedState;
          if (t !== null && ((t = t.dehydrated), t === null || Ts(t) || As(t))) return e;
        } else if (
          e.tag === 19 &&
          (e.memoizedProps.revealOrder === "forwards" ||
            e.memoizedProps.revealOrder === "backwards" ||
            e.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
            e.memoizedProps.revealOrder === "together")
        ) {
          if ((e.flags & 128) !== 0) return e;
        } else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === a) break;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === a) return null;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
      return null;
    }
    var Ct = 0,
      Q = null,
      sa = null,
      wa = null,
      Ku = !1,
      pn = !1,
      wl = !1,
      Ju = 0,
      xi = 0,
      gn = null,
      _b = 0;
    function Ta() {
      throw Error(z(321));
    }
    function Ps(a, e) {
      if (e === null) return !1;
      for (var t = 0; t < e.length && t < a.length; t++) if (!Te(a[t], e[t])) return !1;
      return !0;
    }
    function ar(a, e, t, l, n, i) {
      return (
        (Ct = i),
        (Q = e),
        (e.memoizedState = null),
        (e.updateQueue = null),
        (e.lanes = 0),
        (B.H = a === null || a.memoizedState === null ? hp : fr),
        (wl = !1),
        (i = t(l, n)),
        (wl = !1),
        pn && (i = Xm(e, t, l, n)),
        Gm(a),
        i
      );
    }
    function Gm(a) {
      B.H = zi;
      var e = sa !== null && sa.next !== null;
      if (((Ct = 0), (wa = sa = Q = null), (Ku = !1), (xi = 0), (gn = null), e))
        throw Error(z(300));
      a === null || La || ((a = a.dependencies), a !== null && Xu(a) && (La = !0));
    }
    function Xm(a, e, t, l) {
      Q = a;
      var n = 0;
      do {
        if ((pn && (gn = null), (xi = 0), (pn = !1), 25 <= n)) throw Error(z(301));
        if (((n += 1), (wa = sa = null), a.updateQueue != null)) {
          var i = a.updateQueue;
          ((i.lastEffect = null),
            (i.events = null),
            (i.stores = null),
            i.memoCache != null && (i.memoCache.index = 0));
        }
        ((B.H = yp), (i = e(t, l)));
      } while (pn);
      return i;
    }
    function kb() {
      var a = B.H,
        e = a.useState()[0];
      return (
        (e = typeof e.then == "function" ? Li(e) : e),
        (a = a.useState()[0]),
        (sa !== null ? sa.memoizedState : null) !== a && (Q.flags |= 1024),
        e
      );
    }
    function er() {
      var a = Ju !== 0;
      return ((Ju = 0), a);
    }
    function tr(a, e, t) {
      ((e.updateQueue = a.updateQueue), (e.flags &= -2053), (a.lanes &= ~t));
    }
    function lr(a) {
      if (Ku) {
        for (a = a.memoizedState; a !== null;) {
          var e = a.queue;
          (e !== null && (e.pending = null), (a = a.next));
        }
        Ku = !1;
      }
      ((Ct = 0), (wa = sa = Q = null), (pn = !1), (xi = Ju = 0), (gn = null));
    }
    function le() {
      var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
      return (wa === null ? (Q.memoizedState = wa = a) : (wa = wa.next = a), wa);
    }
    function Da() {
      if (sa === null) {
        var a = Q.alternate;
        a = a !== null ? a.memoizedState : null;
      } else a = sa.next;
      var e = wa === null ? Q.memoizedState : wa.next;
      if (e !== null) ((wa = e), (sa = a));
      else {
        if (a === null) throw Q.alternate === null ? Error(z(467)) : Error(z(310));
        ((sa = a),
          (a = {
            memoizedState: sa.memoizedState,
            baseState: sa.baseState,
            baseQueue: sa.baseQueue,
            queue: sa.queue,
            next: null,
          }),
          wa === null ? (Q.memoizedState = wa = a) : (wa = wa.next = a));
      }
      return wa;
    }
    function ho() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Li(a) {
      var e = xi;
      return (
        (xi += 1),
        gn === null && (gn = []),
        (a = Um(gn, a, e)),
        (e = Q),
        (wa === null ? e.memoizedState : wa.next) === null &&
          ((e = e.alternate), (B.H = e === null || e.memoizedState === null ? hp : fr)),
        a
      );
    }
    function yo(a) {
      if (a !== null && typeof a == "object") {
        if (typeof a.then == "function") return Li(a);
        if (a.$$typeof === xt) return Ja(a);
      }
      throw Error(z(438, String(a)));
    }
    function nr(a) {
      var e = null,
        t = Q.updateQueue;
      if ((t !== null && (e = t.memoCache), e == null)) {
        var l = Q.alternate;
        l !== null &&
          ((l = l.updateQueue),
          l !== null &&
            ((l = l.memoCache),
            l != null &&
              (e = {
                data: l.data.map(function (n) {
                  return n.slice();
                }),
                index: 0,
              })));
      }
      if (
        (e == null && (e = { data: [], index: 0 }),
        t === null && ((t = ho()), (Q.updateQueue = t)),
        (t.memoCache = e),
        (t = e.data[e.index]),
        t === void 0)
      )
        for (t = e.data[e.index] = Array(a), l = 0; l < a; l++) t[l] = yv;
      return (e.index++, t);
    }
    function Ot(a, e) {
      return typeof e == "function" ? e(a) : e;
    }
    function Tu(a) {
      var e = Da();
      return ir(e, sa, a);
    }
    function ir(a, e, t) {
      var l = a.queue;
      if (l === null) throw Error(z(311));
      l.lastRenderedReducer = t;
      var n = a.baseQueue,
        i = l.pending;
      if (i !== null) {
        if (n !== null) {
          var u = n.next;
          ((n.next = i.next), (i.next = u));
        }
        ((e.baseQueue = n = i), (l.pending = null));
      }
      if (((i = a.baseState), n === null)) a.memoizedState = i;
      else {
        e = n.next;
        var o = (u = null),
          c = null,
          d = e,
          g = !1;
        do {
          var b = d.lane & -536870913;
          if (b !== d.lane ? (I & b) === b : (Ct & b) === b) {
            var m = d.revertLane;
            if (m === 0)
              (c !== null &&
                (c = c.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: d.action,
                    hasEagerState: d.hasEagerState,
                    eagerState: d.eagerState,
                    next: null,
                  }),
                b === yn && (g = !0));
            else if ((Ct & m) === m) {
              ((d = d.next), m === yn && (g = !0));
              continue;
            } else
              ((b = {
                lane: 0,
                revertLane: d.revertLane,
                gesture: null,
                action: d.action,
                hasEagerState: d.hasEagerState,
                eagerState: d.eagerState,
                next: null,
              }),
                c === null ? ((o = c = b), (u = i)) : (c = c.next = b),
                (Q.lanes |= m),
                (cl |= m));
            ((b = d.action), wl && t(i, b), (i = d.hasEagerState ? d.eagerState : t(i, b)));
          } else
            ((m = {
              lane: b,
              revertLane: d.revertLane,
              gesture: d.gesture,
              action: d.action,
              hasEagerState: d.hasEagerState,
              eagerState: d.eagerState,
              next: null,
            }),
              c === null ? ((o = c = m), (u = i)) : (c = c.next = m),
              (Q.lanes |= b),
              (cl |= b));
          d = d.next;
        } while (d !== null && d !== e);
        if (
          (c === null ? (u = i) : (c.next = o),
          !Te(i, a.memoizedState) && ((La = !0), g && ((t = dn), t !== null)))
        )
          throw t;
        ((a.memoizedState = i), (a.baseState = u), (a.baseQueue = c), (l.lastRenderedState = i));
      }
      return (n === null && (l.lanes = 0), [a.memoizedState, l.dispatch]);
    }
    function hc(a) {
      var e = Da(),
        t = e.queue;
      if (t === null) throw Error(z(311));
      t.lastRenderedReducer = a;
      var l = t.dispatch,
        n = t.pending,
        i = e.memoizedState;
      if (n !== null) {
        t.pending = null;
        var u = (n = n.next);
        do ((i = a(i, u.action)), (u = u.next));
        while (u !== n);
        (Te(i, e.memoizedState) || (La = !0),
          (e.memoizedState = i),
          e.baseQueue === null && (e.baseState = i),
          (t.lastRenderedState = i));
      }
      return [i, l];
    }
    function Qm(a, e, t) {
      var l = Q,
        n = Da(),
        i = P;
      if (i) {
        if (t === void 0) throw Error(z(407));
        t = t();
      } else t = e();
      var u = !Te((sa || n).memoizedState, t);
      if (
        (u && ((n.memoizedState = t), (La = !0)),
        (n = n.queue),
        ur(Km.bind(null, l, n, a), [a]),
        n.getSnapshot !== e || u || (wa !== null && wa.memoizedState.tag & 1))
      ) {
        if (
          ((l.flags |= 2048),
          xn(9, { destroy: void 0 }, Zm.bind(null, l, n, t, e), null),
          ra === null)
        )
          throw Error(z(349));
        i || (Ct & 127) !== 0 || Vm(l, e, t);
      }
      return t;
    }
    function Vm(a, e, t) {
      ((a.flags |= 16384),
        (a = { getSnapshot: e, value: t }),
        (e = Q.updateQueue),
        e === null
          ? ((e = ho()), (Q.updateQueue = e), (e.stores = [a]))
          : ((t = e.stores), t === null ? (e.stores = [a]) : t.push(a)));
    }
    function Zm(a, e, t, l) {
      ((e.value = t), (e.getSnapshot = l), Jm(e) && $m(a));
    }
    function Km(a, e, t) {
      return t(function () {
        Jm(e) && $m(a);
      });
    }
    function Jm(a) {
      var e = a.getSnapshot;
      a = a.value;
      try {
        var t = e();
        return !Te(a, t);
      } catch {
        return !0;
      }
    }
    function $m(a) {
      var e = ql(a, 2);
      e !== null && re(e, a, 2);
    }
    function cs(a) {
      var e = le();
      if (typeof a == "function") {
        var t = a;
        if (((a = t()), wl)) {
          Vt(!0);
          try {
            t();
          } finally {
            Vt(!1);
          }
        }
      }
      return (
        (e.memoizedState = e.baseState = a),
        (e.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ot,
          lastRenderedState: a,
        }),
        e
      );
    }
    function Wm(a, e, t, l) {
      return ((a.baseState = t), ir(a, sa, typeof l == "function" ? l : Ot));
    }
    function Lb(a, e, t, l, n) {
      if (xo(a)) throw Error(z(485));
      if (((a = e.action), a !== null)) {
        var i = {
          payload: n,
          action: a,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function (u) {
            i.listeners.push(u);
          },
        };
        (B.T !== null ? t(!0) : (i.isTransition = !1),
          l(i),
          (t = e.pending),
          t === null
            ? ((i.next = e.pending = i), Fm(e, i))
            : ((i.next = t.next), (e.pending = t.next = i)));
      }
    }
    function Fm(a, e) {
      var t = e.action,
        l = e.payload,
        n = a.state;
      if (e.isTransition) {
        var i = B.T,
          u = {};
        B.T = u;
        try {
          var o = t(n, l),
            c = B.S;
          (c !== null && c(u, o), Wf(a, e, o));
        } catch (d) {
          ss(a, e, d);
        } finally {
          (i !== null && u.types !== null && (i.types = u.types), (B.T = i));
        }
      } else
        try {
          ((i = t(n, l)), Wf(a, e, i));
        } catch (d) {
          ss(a, e, d);
        }
    }
    function Wf(a, e, t) {
      t !== null && typeof t == "object" && typeof t.then == "function"
        ? t.then(
            function (l) {
              Ff(a, e, l);
            },
            function (l) {
              return ss(a, e, l);
            },
          )
        : Ff(a, e, t);
    }
    function Ff(a, e, t) {
      ((e.status = "fulfilled"),
        (e.value = t),
        Im(e),
        (a.state = t),
        (e = a.pending),
        e !== null &&
          ((t = e.next), t === e ? (a.pending = null) : ((t = t.next), (e.next = t), Fm(a, t))));
    }
    function ss(a, e, t) {
      var l = a.pending;
      if (((a.pending = null), l !== null)) {
        l = l.next;
        do ((e.status = "rejected"), (e.reason = t), Im(e), (e = e.next));
        while (e !== l);
      }
      a.action = null;
    }
    function Im(a) {
      a = a.listeners;
      for (var e = 0; e < a.length; e++) (0, a[e])();
    }
    function Pm(a, e) {
      return e;
    }
    function If(a, e) {
      if (P) {
        var t = ra.formState;
        if (t !== null) {
          a: {
            var l = Q;
            if (P) {
              if (ba) {
                e: {
                  for (var n = ba, i = qe; n.nodeType !== 8;) {
                    if (!i) {
                      n = null;
                      break e;
                    }
                    if (((n = je(n.nextSibling)), n === null)) {
                      n = null;
                      break e;
                    }
                  }
                  ((i = n.data), (n = i === "F!" || i === "F" ? n : null));
                }
                if (n) {
                  ((ba = je(n.nextSibling)), (l = n.data === "F!"));
                  break a;
                }
              }
              ul(l);
            }
            l = !1;
          }
          l && (e = t[0]);
        }
      }
      return (
        (t = le()),
        (t.memoizedState = t.baseState = e),
        (l = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Pm,
          lastRenderedState: e,
        }),
        (t.queue = l),
        (t = gp.bind(null, Q, l)),
        (l.dispatch = t),
        (l = cs(!1)),
        (i = rr.bind(null, Q, !1, l.queue)),
        (l = le()),
        (n = { state: e, dispatch: null, action: a, pending: null }),
        (l.queue = n),
        (t = Lb.bind(null, Q, n, i, t)),
        (n.dispatch = t),
        (l.memoizedState = a),
        [e, t, !1]
      );
    }
    function Pf(a) {
      var e = Da();
      return ap(e, sa, a);
    }
    function ap(a, e, t) {
      if (
        ((e = ir(a, e, Pm)[0]),
        (a = Tu(Ot)[0]),
        typeof e == "object" && e !== null && typeof e.then == "function")
      )
        try {
          var l = Li(e);
        } catch (u) {
          throw u === Dn ? bo : u;
        }
      else l = e;
      e = Da();
      var n = e.queue,
        i = n.dispatch;
      return (
        t !== e.memoizedState &&
          ((Q.flags |= 2048), xn(9, { destroy: void 0 }, Ub.bind(null, n, t), null)),
        [l, i, a]
      );
    }
    function Ub(a, e) {
      a.action = e;
    }
    function ad(a) {
      var e = Da(),
        t = sa;
      if (t !== null) return ap(e, t, a);
      (Da(), (e = e.memoizedState), (t = Da()));
      var l = t.queue.dispatch;
      return ((t.memoizedState = a), [e, l, !1]);
    }
    function xn(a, e, t, l) {
      return (
        (a = { tag: a, create: t, deps: l, inst: e, next: null }),
        (e = Q.updateQueue),
        e === null && ((e = ho()), (Q.updateQueue = e)),
        (t = e.lastEffect),
        t === null
          ? (e.lastEffect = a.next = a)
          : ((l = t.next), (t.next = a), (a.next = l), (e.lastEffect = a)),
        a
      );
    }
    function ep() {
      return Da().memoizedState;
    }
    function Au(a, e, t, l) {
      var n = le();
      ((Q.flags |= a),
        (n.memoizedState = xn(1 | e, { destroy: void 0 }, t, l === void 0 ? null : l)));
    }
    function So(a, e, t, l) {
      var n = Da();
      l = l === void 0 ? null : l;
      var i = n.memoizedState.inst;
      sa !== null && l !== null && Ps(l, sa.memoizedState.deps)
        ? (n.memoizedState = xn(e, i, t, l))
        : ((Q.flags |= a), (n.memoizedState = xn(1 | e, i, t, l)));
    }
    function ed(a, e) {
      Au(8390656, 8, a, e);
    }
    function ur(a, e) {
      So(2048, 8, a, e);
    }
    function qb(a) {
      Q.flags |= 4;
      var e = Q.updateQueue;
      if (e === null) ((e = ho()), (Q.updateQueue = e), (e.events = [a]));
      else {
        var t = e.events;
        t === null ? (e.events = [a]) : t.push(a);
      }
    }
    function tp(a) {
      var e = Da().memoizedState;
      return (
        qb({ ref: e, nextImpl: a }),
        function () {
          if ((ta & 2) !== 0) throw Error(z(440));
          return e.impl.apply(void 0, arguments);
        }
      );
    }
    function lp(a, e) {
      return So(4, 2, a, e);
    }
    function np(a, e) {
      return So(4, 4, a, e);
    }
    function ip(a, e) {
      if (typeof e == "function") {
        a = a();
        var t = e(a);
        return function () {
          typeof t == "function" ? t() : e(null);
        };
      }
      if (e != null)
        return (
          (a = a()),
          (e.current = a),
          function () {
            e.current = null;
          }
        );
    }
    function up(a, e, t) {
      ((t = t != null ? t.concat([a]) : null), So(4, 4, ip.bind(null, e, a), t));
    }
    function or() {}
    function op(a, e) {
      var t = Da();
      e = e === void 0 ? null : e;
      var l = t.memoizedState;
      return e !== null && Ps(e, l[1]) ? l[0] : ((t.memoizedState = [a, e]), a);
    }
    function cp(a, e) {
      var t = Da();
      e = e === void 0 ? null : e;
      var l = t.memoizedState;
      if (e !== null && Ps(e, l[1])) return l[0];
      if (((l = a()), wl)) {
        Vt(!0);
        try {
          a();
        } finally {
          Vt(!1);
        }
      }
      return ((t.memoizedState = [l, e]), l);
    }
    function cr(a, e, t) {
      return t === void 0 || ((Ct & 1073741824) !== 0 && (I & 261930) === 0)
        ? (a.memoizedState = e)
        : ((a.memoizedState = t), (a = Wp()), (Q.lanes |= a), (cl |= a), t);
    }
    function sp(a, e, t, l) {
      return Te(t, e)
        ? t
        : Sn.current !== null
          ? ((a = cr(a, t, l)), Te(a, e) || (La = !0), a)
          : (Ct & 42) === 0 || ((Ct & 1073741824) !== 0 && (I & 261930) === 0)
            ? ((La = !0), (a.memoizedState = t))
            : ((a = Wp()), (Q.lanes |= a), (cl |= a), e);
    }
    function rp(a, e, t, l, n) {
      var i = la.p;
      la.p = i !== 0 && 8 > i ? i : 8;
      var u = B.T,
        o = {};
      ((B.T = o), rr(a, !1, e, t));
      try {
        var c = n(),
          d = B.S;
        if (
          (d !== null && d(o, c), c !== null && typeof c == "object" && typeof c.then == "function")
        ) {
          var g = wb(c, l);
          ci(a, e, g, Ne(a));
        } else ci(a, e, l, Ne(a));
      } catch (b) {
        ci(a, e, { then: function () {}, status: "rejected", reason: b }, Ne());
      } finally {
        ((la.p = i), u !== null && o.types !== null && (u.types = o.types), (B.T = u));
      }
    }
    function Hb() {}
    function rs(a, e, t, l) {
      if (a.tag !== 5) throw Error(z(476));
      var n = fp(a).queue;
      rp(
        a,
        n,
        e,
        El,
        t === null
          ? Hb
          : function () {
              return (dp(a), t(l));
            },
      );
    }
    function fp(a) {
      var e = a.memoizedState;
      if (e !== null) return e;
      e = {
        memoizedState: El,
        baseState: El,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ot,
          lastRenderedState: El,
        },
        next: null,
      };
      var t = {};
      return (
        (e.next = {
          memoizedState: t,
          baseState: t,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Ot,
            lastRenderedState: t,
          },
          next: null,
        }),
        (a.memoizedState = e),
        (a = a.alternate),
        a !== null && (a.memoizedState = e),
        e
      );
    }
    function dp(a) {
      var e = fp(a);
      (e.next === null && (e = a.alternate.memoizedState), ci(a, e.next.queue, {}, Ne()));
    }
    function sr() {
      return Ja(Ni);
    }
    function mp() {
      return Da().memoizedState;
    }
    function pp() {
      return Da().memoizedState;
    }
    function jb(a) {
      for (var e = a.return; e !== null;) {
        switch (e.tag) {
          case 24:
          case 3:
            var t = Ne();
            a = It(t);
            var l = Pt(e, a, t);
            (l !== null && (re(l, e, t), ii(l, e, t)), (e = { cache: Js() }), (a.payload = e));
            return;
        }
        e = e.return;
      }
    }
    function Bb(a, e, t) {
      var l = Ne();
      ((t = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: t,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        xo(a) ? vp(e, t) : ((t = Qs(a, e, t, l)), t !== null && (re(t, a, l), bp(t, e, l))));
    }
    function gp(a, e, t) {
      var l = Ne();
      ci(a, e, t, l);
    }
    function ci(a, e, t, l) {
      var n = {
        lane: l,
        revertLane: 0,
        gesture: null,
        action: t,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (xo(a)) vp(e, n);
      else {
        var i = a.alternate;
        if (
          a.lanes === 0 &&
          (i === null || i.lanes === 0) &&
          ((i = e.lastRenderedReducer), i !== null)
        )
          try {
            var u = e.lastRenderedState,
              o = i(u, t);
            if (((n.hasEagerState = !0), (n.eagerState = o), Te(o, u)))
              return (vo(a, e, n, 0), ra === null && go(), !1);
          } catch {}
        if (((t = Qs(a, e, n, l)), t !== null)) return (re(t, a, l), bp(t, e, l), !0);
      }
      return !1;
    }
    function rr(a, e, t, l) {
      if (
        ((l = {
          lane: 2,
          revertLane: yr(),
          gesture: null,
          action: l,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        xo(a))
      ) {
        if (e) throw Error(z(479));
      } else ((e = Qs(a, t, l, 2)), e !== null && re(e, a, 2));
    }
    function xo(a) {
      var e = a.alternate;
      return a === Q || (e !== null && e === Q);
    }
    function vp(a, e) {
      pn = Ku = !0;
      var t = a.pending;
      (t === null ? (e.next = e) : ((e.next = t.next), (t.next = e)), (a.pending = e));
    }
    function bp(a, e, t) {
      if ((t & 4194048) !== 0) {
        var l = e.lanes;
        ((l &= a.pendingLanes), (t |= l), (e.lanes = t), tm(a, t));
      }
    }
    var zi = {
      readContext: Ja,
      use: yo,
      useCallback: Ta,
      useContext: Ta,
      useEffect: Ta,
      useImperativeHandle: Ta,
      useLayoutEffect: Ta,
      useInsertionEffect: Ta,
      useMemo: Ta,
      useReducer: Ta,
      useRef: Ta,
      useState: Ta,
      useDebugValue: Ta,
      useDeferredValue: Ta,
      useTransition: Ta,
      useSyncExternalStore: Ta,
      useId: Ta,
      useHostTransitionStatus: Ta,
      useFormState: Ta,
      useActionState: Ta,
      useOptimistic: Ta,
      useMemoCache: Ta,
      useCacheRefresh: Ta,
    };
    zi.useEffectEvent = Ta;
    var hp = {
        readContext: Ja,
        use: yo,
        useCallback: function (a, e) {
          return ((le().memoizedState = [a, e === void 0 ? null : e]), a);
        },
        useContext: Ja,
        useEffect: ed,
        useImperativeHandle: function (a, e, t) {
          ((t = t != null ? t.concat([a]) : null), Au(4194308, 4, ip.bind(null, e, a), t));
        },
        useLayoutEffect: function (a, e) {
          return Au(4194308, 4, a, e);
        },
        useInsertionEffect: function (a, e) {
          Au(4, 2, a, e);
        },
        useMemo: function (a, e) {
          var t = le();
          e = e === void 0 ? null : e;
          var l = a();
          if (wl) {
            Vt(!0);
            try {
              a();
            } finally {
              Vt(!1);
            }
          }
          return ((t.memoizedState = [l, e]), l);
        },
        useReducer: function (a, e, t) {
          var l = le();
          if (t !== void 0) {
            var n = t(e);
            if (wl) {
              Vt(!0);
              try {
                t(e);
              } finally {
                Vt(!1);
              }
            }
          } else n = e;
          return (
            (l.memoizedState = l.baseState = n),
            (a = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: a,
              lastRenderedState: n,
            }),
            (l.queue = a),
            (a = a.dispatch = Bb.bind(null, Q, a)),
            [l.memoizedState, a]
          );
        },
        useRef: function (a) {
          var e = le();
          return ((a = { current: a }), (e.memoizedState = a));
        },
        useState: function (a) {
          a = cs(a);
          var e = a.queue,
            t = gp.bind(null, Q, e);
          return ((e.dispatch = t), [a.memoizedState, t]);
        },
        useDebugValue: or,
        useDeferredValue: function (a, e) {
          var t = le();
          return cr(t, a, e);
        },
        useTransition: function () {
          var a = cs(!1);
          return ((a = rp.bind(null, Q, a.queue, !0, !1)), (le().memoizedState = a), [!1, a]);
        },
        useSyncExternalStore: function (a, e, t) {
          var l = Q,
            n = le();
          if (P) {
            if (t === void 0) throw Error(z(407));
            t = t();
          } else {
            if (((t = e()), ra === null)) throw Error(z(349));
            (I & 127) !== 0 || Vm(l, e, t);
          }
          n.memoizedState = t;
          var i = { value: t, getSnapshot: e };
          return (
            (n.queue = i),
            ed(Km.bind(null, l, i, a), [a]),
            (l.flags |= 2048),
            xn(9, { destroy: void 0 }, Zm.bind(null, l, i, t, e), null),
            t
          );
        },
        useId: function () {
          var a = le(),
            e = ra.identifierPrefix;
          if (P) {
            var t = tt,
              l = et;
            ((t = (l & ~(1 << (32 - Ee(l) - 1))).toString(32) + t),
              (e = "_" + e + "R_" + t),
              (t = Ju++),
              0 < t && (e += "H" + t.toString(32)),
              (e += "_"));
          } else ((t = _b++), (e = "_" + e + "r_" + t.toString(32) + "_"));
          return (a.memoizedState = e);
        },
        useHostTransitionStatus: sr,
        useFormState: If,
        useActionState: If,
        useOptimistic: function (a) {
          var e = le();
          e.memoizedState = e.baseState = a;
          var t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return ((e.queue = t), (e = rr.bind(null, Q, !0, t)), (t.dispatch = e), [a, e]);
        },
        useMemoCache: nr,
        useCacheRefresh: function () {
          return (le().memoizedState = jb.bind(null, Q));
        },
        useEffectEvent: function (a) {
          var e = le(),
            t = { impl: a };
          return (
            (e.memoizedState = t),
            function () {
              if ((ta & 2) !== 0) throw Error(z(440));
              return t.impl.apply(void 0, arguments);
            }
          );
        },
      },
      fr = {
        readContext: Ja,
        use: yo,
        useCallback: op,
        useContext: Ja,
        useEffect: ur,
        useImperativeHandle: up,
        useInsertionEffect: lp,
        useLayoutEffect: np,
        useMemo: cp,
        useReducer: Tu,
        useRef: ep,
        useState: function () {
          return Tu(Ot);
        },
        useDebugValue: or,
        useDeferredValue: function (a, e) {
          var t = Da();
          return sp(t, sa.memoizedState, a, e);
        },
        useTransition: function () {
          var a = Tu(Ot)[0],
            e = Da().memoizedState;
          return [typeof a == "boolean" ? a : Li(a), e];
        },
        useSyncExternalStore: Qm,
        useId: mp,
        useHostTransitionStatus: sr,
        useFormState: Pf,
        useActionState: Pf,
        useOptimistic: function (a, e) {
          var t = Da();
          return Wm(t, sa, a, e);
        },
        useMemoCache: nr,
        useCacheRefresh: pp,
      };
    fr.useEffectEvent = tp;
    var yp = {
      readContext: Ja,
      use: yo,
      useCallback: op,
      useContext: Ja,
      useEffect: ur,
      useImperativeHandle: up,
      useInsertionEffect: lp,
      useLayoutEffect: np,
      useMemo: cp,
      useReducer: hc,
      useRef: ep,
      useState: function () {
        return hc(Ot);
      },
      useDebugValue: or,
      useDeferredValue: function (a, e) {
        var t = Da();
        return sa === null ? cr(t, a, e) : sp(t, sa.memoizedState, a, e);
      },
      useTransition: function () {
        var a = hc(Ot)[0],
          e = Da().memoizedState;
        return [typeof a == "boolean" ? a : Li(a), e];
      },
      useSyncExternalStore: Qm,
      useId: mp,
      useHostTransitionStatus: sr,
      useFormState: ad,
      useActionState: ad,
      useOptimistic: function (a, e) {
        var t = Da();
        return sa !== null ? Wm(t, sa, a, e) : ((t.baseState = a), [a, t.queue.dispatch]);
      },
      useMemoCache: nr,
      useCacheRefresh: pp,
    };
    yp.useEffectEvent = tp;
    function yc(a, e, t, l) {
      ((e = a.memoizedState),
        (t = t(l, e)),
        (t = t == null ? e : ha({}, e, t)),
        (a.memoizedState = t),
        a.lanes === 0 && (a.updateQueue.baseState = t));
    }
    var fs = {
      enqueueSetState: function (a, e, t) {
        a = a._reactInternals;
        var l = Ne(),
          n = It(l);
        ((n.payload = e),
          t != null && (n.callback = t),
          (e = Pt(a, n, l)),
          e !== null && (re(e, a, l), ii(e, a, l)));
      },
      enqueueReplaceState: function (a, e, t) {
        a = a._reactInternals;
        var l = Ne(),
          n = It(l);
        ((n.tag = 1),
          (n.payload = e),
          t != null && (n.callback = t),
          (e = Pt(a, n, l)),
          e !== null && (re(e, a, l), ii(e, a, l)));
      },
      enqueueForceUpdate: function (a, e) {
        a = a._reactInternals;
        var t = Ne(),
          l = It(t);
        ((l.tag = 2),
          e != null && (l.callback = e),
          (e = Pt(a, l, t)),
          e !== null && (re(e, a, t), ii(e, a, t)));
      },
    };
    function td(a, e, t, l, n, i, u) {
      return (
        (a = a.stateNode),
        typeof a.shouldComponentUpdate == "function"
          ? a.shouldComponentUpdate(l, i, u)
          : e.prototype && e.prototype.isPureReactComponent
            ? !bi(t, l) || !bi(n, i)
            : !0
      );
    }
    function ld(a, e, t, l) {
      ((a = e.state),
        typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(t, l),
        typeof e.UNSAFE_componentWillReceiveProps == "function" &&
          e.UNSAFE_componentWillReceiveProps(t, l),
        e.state !== a && fs.enqueueReplaceState(e, e.state, null));
    }
    function _l(a, e) {
      var t = e;
      if ("ref" in e) {
        t = {};
        for (var l in e) l !== "ref" && (t[l] = e[l]);
      }
      if ((a = a.defaultProps)) {
        t === e && (t = ha({}, t));
        for (var n in a) t[n] === void 0 && (t[n] = a[n]);
      }
      return t;
    }
    function Sp(a) {
      Bu(a);
    }
    function xp(a) {
      console.error(a);
    }
    function zp(a) {
      Bu(a);
    }
    function $u(a, e) {
      try {
        var t = a.onUncaughtError;
        t(e.value, { componentStack: e.stack });
      } catch (l) {
        setTimeout(function () {
          throw l;
        });
      }
    }
    function nd(a, e, t) {
      try {
        var l = a.onCaughtError;
        l(t.value, { componentStack: t.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
      } catch (n) {
        setTimeout(function () {
          throw n;
        });
      }
    }
    function ds(a, e, t) {
      return (
        (t = It(t)),
        (t.tag = 3),
        (t.payload = { element: null }),
        (t.callback = function () {
          $u(a, e);
        }),
        t
      );
    }
    function Mp(a) {
      return ((a = It(a)), (a.tag = 3), a);
    }
    function Ep(a, e, t, l) {
      var n = t.type.getDerivedStateFromError;
      if (typeof n == "function") {
        var i = l.value;
        ((a.payload = function () {
          return n(i);
        }),
          (a.callback = function () {
            nd(e, t, l);
          }));
      }
      var u = t.stateNode;
      u !== null &&
        typeof u.componentDidCatch == "function" &&
        (a.callback = function () {
          (nd(e, t, l),
            typeof n != "function" && (al === null ? (al = new Set([this])) : al.add(this)));
          var o = l.stack;
          this.componentDidCatch(l.value, { componentStack: o !== null ? o : "" });
        });
    }
    function Yb(a, e, t, l, n) {
      if (((t.flags |= 32768), l !== null && typeof l == "object" && typeof l.then == "function")) {
        if (((e = t.alternate), e !== null && On(e, t, n, !0), (t = Ae.current), t !== null)) {
          switch (t.tag) {
            case 31:
            case 13:
              return (
                He === null ? ao() : t.alternate === null && Aa === 0 && (Aa = 3),
                (t.flags &= -257),
                (t.flags |= 65536),
                (t.lanes = n),
                l === Qu
                  ? (t.flags |= 16384)
                  : ((e = t.updateQueue),
                    e === null ? (t.updateQueue = new Set([l])) : e.add(l),
                    Dc(a, l, n)),
                !1
              );
            case 22:
              return (
                (t.flags |= 65536),
                l === Qu
                  ? (t.flags |= 16384)
                  : ((e = t.updateQueue),
                    e === null
                      ? ((e = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([l]),
                        }),
                        (t.updateQueue = e))
                      : ((t = e.retryQueue), t === null ? (e.retryQueue = new Set([l])) : t.add(l)),
                    Dc(a, l, n)),
                !1
              );
          }
          throw Error(z(435, t.tag));
        }
        return (Dc(a, l, n), ao(), !1);
      }
      if (P)
        return (
          (e = Ae.current),
          e !== null
            ? ((e.flags & 65536) === 0 && (e.flags |= 256),
              (e.flags |= 65536),
              (e.lanes = n),
              l !== Pc && ((a = Error(z(422), { cause: l })), yi(Ue(a, t))))
            : (l !== Pc && ((e = Error(z(423), { cause: l })), yi(Ue(e, t))),
              (a = a.current.alternate),
              (a.flags |= 65536),
              (n &= -n),
              (a.lanes |= n),
              (l = Ue(l, t)),
              (n = ds(a.stateNode, l, n)),
              bc(a, n),
              Aa !== 4 && (Aa = 2)),
          !1
        );
      var i = Error(z(520), { cause: l });
      if (((i = Ue(i, t)), fi === null ? (fi = [i]) : fi.push(i), Aa !== 4 && (Aa = 2), e === null))
        return !0;
      ((l = Ue(l, t)), (t = e));
      do {
        switch (t.tag) {
          case 3:
            return (
              (t.flags |= 65536),
              (a = n & -n),
              (t.lanes |= a),
              (a = ds(t.stateNode, l, a)),
              bc(t, a),
              !1
            );
          case 1:
            if (
              ((e = t.type),
              (i = t.stateNode),
              (t.flags & 128) === 0 &&
                (typeof e.getDerivedStateFromError == "function" ||
                  (i !== null &&
                    typeof i.componentDidCatch == "function" &&
                    (al === null || !al.has(i)))))
            )
              return (
                (t.flags |= 65536),
                (n &= -n),
                (t.lanes |= n),
                (n = Mp(n)),
                Ep(n, a, t, l),
                bc(t, n),
                !1
              );
        }
        t = t.return;
      } while (t !== null);
      return !1;
    }
    var dr = Error(z(461)),
      La = !1;
    function Va(a, e, t, l) {
      e.child = a === null ? Hm(e, null, t, l) : Rl(e, a.child, t, l);
    }
    function id(a, e, t, l, n) {
      t = t.render;
      var i = e.ref;
      if ("ref" in l) {
        var u = {};
        for (var o in l) o !== "ref" && (u[o] = l[o]);
      } else u = l;
      return (
        Dl(e),
        (l = ar(a, e, t, u, i, n)),
        (o = er()),
        a !== null && !La
          ? (tr(a, e, n), Dt(a, e, n))
          : (P && o && Zs(e), (e.flags |= 1), Va(a, e, l, n), e.child)
      );
    }
    function ud(a, e, t, l, n) {
      if (a === null) {
        var i = t.type;
        return typeof i == "function" && !Vs(i) && i.defaultProps === void 0 && t.compare === null
          ? ((e.tag = 15), (e.type = i), Np(a, e, i, l, n))
          : ((a = Eu(t.type, null, l, e, e.mode, n)),
            (a.ref = e.ref),
            (a.return = e),
            (e.child = a));
      }
      if (((i = a.child), !mr(a, n))) {
        var u = i.memoizedProps;
        if (((t = t.compare), (t = t !== null ? t : bi), t(u, l) && a.ref === e.ref))
          return Dt(a, e, n);
      }
      return ((e.flags |= 1), (a = Et(i, l)), (a.ref = e.ref), (a.return = e), (e.child = a));
    }
    function Np(a, e, t, l, n) {
      if (a !== null) {
        var i = a.memoizedProps;
        if (bi(i, l) && a.ref === e.ref)
          if (((La = !1), (e.pendingProps = l = i), mr(a, n)))
            (a.flags & 131072) !== 0 && (La = !0);
          else return ((e.lanes = a.lanes), Dt(a, e, n));
      }
      return ms(a, e, t, l, n);
    }
    function Tp(a, e, t, l) {
      var n = l.children,
        i = a !== null ? a.memoizedState : null;
      if (
        (a === null &&
          e.stateNode === null &&
          (e.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        l.mode === "hidden")
      ) {
        if ((e.flags & 128) !== 0) {
          if (((i = i !== null ? i.baseLanes | t : t), a !== null)) {
            for (l = e.child = a.child, n = 0; l !== null;)
              ((n = n | l.lanes | l.childLanes), (l = l.sibling));
            l = n & ~i;
          } else ((l = 0), (e.child = null));
          return od(a, e, i, t, l);
        }
        if ((t & 536870912) !== 0)
          ((e.memoizedState = { baseLanes: 0, cachePool: null }),
            a !== null && Nu(e, i !== null ? i.cachePool : null),
            i !== null ? $f(e, i) : us(),
            Ym(e));
        else return ((l = e.lanes = 536870912), od(a, e, i !== null ? i.baseLanes | t : t, t, l));
      } else
        i !== null
          ? (Nu(e, i.cachePool), $f(e, i), Xt(e), (e.memoizedState = null))
          : (a !== null && Nu(e, null), us(), Xt(e));
      return (Va(a, e, n, t), e.child);
    }
    function Pn(a, e) {
      return (
        (a !== null && a.tag === 22) ||
          e.stateNode !== null ||
          (e.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        e.sibling
      );
    }
    function od(a, e, t, l, n) {
      var i = $s();
      return (
        (i = i === null ? null : { parent: ka._currentValue, pool: i }),
        (e.memoizedState = { baseLanes: t, cachePool: i }),
        a !== null && Nu(e, null),
        us(),
        Ym(e),
        a !== null && On(a, e, l, !0),
        (e.childLanes = n),
        null
      );
    }
    function Cu(a, e) {
      return (
        (e = Wu({ mode: e.mode, children: e.children }, a.mode)),
        (e.ref = a.ref),
        (a.child = e),
        (e.return = a),
        e
      );
    }
    function cd(a, e, t) {
      return (
        Rl(e, a.child, null, t),
        (a = Cu(e, e.pendingProps)),
        (a.flags |= 2),
        ye(e),
        (e.memoizedState = null),
        a
      );
    }
    function Gb(a, e, t) {
      var l = e.pendingProps,
        n = (e.flags & 128) !== 0;
      if (((e.flags &= -129), a === null)) {
        if (P) {
          if (l.mode === "hidden") return ((a = Cu(e, l)), (e.lanes = 536870912), Pn(null, a));
          if (
            (os(e),
            (a = ba)
              ? ((a = h0(a, qe)),
                (a = a !== null && a.data === "&" ? a : null),
                a !== null &&
                  ((e.memoizedState = {
                    dehydrated: a,
                    treeContext: il !== null ? { id: et, overflow: tt } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (t = Rm(a)),
                  (t.return = e),
                  (e.child = t),
                  (Ka = e),
                  (ba = null)))
              : (a = null),
            a === null)
          )
            throw ul(e);
          return ((e.lanes = 536870912), null);
        }
        return Cu(e, l);
      }
      var i = a.memoizedState;
      if (i !== null) {
        var u = i.dehydrated;
        if ((os(e), n))
          if (e.flags & 256) ((e.flags &= -257), (e = cd(a, e, t)));
          else if (e.memoizedState !== null) ((e.child = a.child), (e.flags |= 128), (e = null));
          else throw Error(z(558));
        else if ((La || On(a, e, t, !1), (n = (t & a.childLanes) !== 0), La || n)) {
          if (((l = ra), l !== null && ((u = lm(l, t)), u !== 0 && u !== i.retryLane)))
            throw ((i.retryLane = u), ql(a, u), re(l, a, u), dr);
          (ao(), (e = cd(a, e, t)));
        } else
          ((a = i.treeContext),
            (ba = je(u.nextSibling)),
            (Ka = e),
            (P = !0),
            (Ft = null),
            (qe = !1),
            a !== null && _m(e, a),
            (e = Cu(e, l)),
            (e.flags |= 4096));
        return e;
      }
      return (
        (a = Et(a.child, { mode: l.mode, children: l.children })),
        (a.ref = e.ref),
        (e.child = a),
        (a.return = e),
        a
      );
    }
    function Ou(a, e) {
      var t = e.ref;
      if (t === null) a !== null && a.ref !== null && (e.flags |= 4194816);
      else {
        if (typeof t != "function" && typeof t != "object") throw Error(z(284));
        (a === null || a.ref !== t) && (e.flags |= 4194816);
      }
    }
    function ms(a, e, t, l, n) {
      return (
        Dl(e),
        (t = ar(a, e, t, l, void 0, n)),
        (l = er()),
        a !== null && !La
          ? (tr(a, e, n), Dt(a, e, n))
          : (P && l && Zs(e), (e.flags |= 1), Va(a, e, t, n), e.child)
      );
    }
    function sd(a, e, t, l, n, i) {
      return (
        Dl(e),
        (e.updateQueue = null),
        (t = Xm(e, l, t, n)),
        Gm(a),
        (l = er()),
        a !== null && !La
          ? (tr(a, e, i), Dt(a, e, i))
          : (P && l && Zs(e), (e.flags |= 1), Va(a, e, t, i), e.child)
      );
    }
    function rd(a, e, t, l, n) {
      if ((Dl(e), e.stateNode === null)) {
        var i = nn,
          u = t.contextType;
        (typeof u == "object" && u !== null && (i = Ja(u)),
          (i = new t(l, i)),
          (e.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null),
          (i.updater = fs),
          (e.stateNode = i),
          (i._reactInternals = e),
          (i = e.stateNode),
          (i.props = l),
          (i.state = e.memoizedState),
          (i.refs = {}),
          Fs(e),
          (u = t.contextType),
          (i.context = typeof u == "object" && u !== null ? Ja(u) : nn),
          (i.state = e.memoizedState),
          (u = t.getDerivedStateFromProps),
          typeof u == "function" && (yc(e, t, u, l), (i.state = e.memoizedState)),
          typeof t.getDerivedStateFromProps == "function" ||
            typeof i.getSnapshotBeforeUpdate == "function" ||
            (typeof i.UNSAFE_componentWillMount != "function" &&
              typeof i.componentWillMount != "function") ||
            ((u = i.state),
            typeof i.componentWillMount == "function" && i.componentWillMount(),
            typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(),
            u !== i.state && fs.enqueueReplaceState(i, i.state, null),
            oi(e, l, i, n),
            ui(),
            (i.state = e.memoizedState)),
          typeof i.componentDidMount == "function" && (e.flags |= 4194308),
          (l = !0));
      } else if (a === null) {
        i = e.stateNode;
        var o = e.memoizedProps,
          c = _l(t, o);
        i.props = c;
        var d = i.context,
          g = t.contextType;
        ((u = nn), typeof g == "object" && g !== null && (u = Ja(g)));
        var b = t.getDerivedStateFromProps;
        ((g = typeof b == "function" || typeof i.getSnapshotBeforeUpdate == "function"),
          (o = e.pendingProps !== o),
          g ||
            (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
              typeof i.componentWillReceiveProps != "function") ||
            ((o || d !== u) && ld(e, i, l, u)),
          (Bt = !1));
        var m = e.memoizedState;
        ((i.state = m),
          oi(e, l, i, n),
          ui(),
          (d = e.memoizedState),
          o || m !== d || Bt
            ? (typeof b == "function" && (yc(e, t, b, l), (d = e.memoizedState)),
              (c = Bt || td(e, t, c, l, m, d, u))
                ? (g ||
                    (typeof i.UNSAFE_componentWillMount != "function" &&
                      typeof i.componentWillMount != "function") ||
                    (typeof i.componentWillMount == "function" && i.componentWillMount(),
                    typeof i.UNSAFE_componentWillMount == "function" &&
                      i.UNSAFE_componentWillMount()),
                  typeof i.componentDidMount == "function" && (e.flags |= 4194308))
                : (typeof i.componentDidMount == "function" && (e.flags |= 4194308),
                  (e.memoizedProps = l),
                  (e.memoizedState = d)),
              (i.props = l),
              (i.state = d),
              (i.context = u),
              (l = c))
            : (typeof i.componentDidMount == "function" && (e.flags |= 4194308), (l = !1)));
      } else {
        ((i = e.stateNode),
          ns(a, e),
          (u = e.memoizedProps),
          (g = _l(t, u)),
          (i.props = g),
          (b = e.pendingProps),
          (m = i.context),
          (d = t.contextType),
          (c = nn),
          typeof d == "object" && d !== null && (c = Ja(d)),
          (o = t.getDerivedStateFromProps),
          (d = typeof o == "function" || typeof i.getSnapshotBeforeUpdate == "function") ||
            (typeof i.UNSAFE_componentWillReceiveProps != "function" &&
              typeof i.componentWillReceiveProps != "function") ||
            ((u !== b || m !== c) && ld(e, i, l, c)),
          (Bt = !1),
          (m = e.memoizedState),
          (i.state = m),
          oi(e, l, i, n),
          ui());
        var f = e.memoizedState;
        u !== b || m !== f || Bt || (a !== null && a.dependencies !== null && Xu(a.dependencies))
          ? (typeof o == "function" && (yc(e, t, o, l), (f = e.memoizedState)),
            (g =
              Bt ||
              td(e, t, g, l, m, f, c) ||
              (a !== null && a.dependencies !== null && Xu(a.dependencies)))
              ? (d ||
                  (typeof i.UNSAFE_componentWillUpdate != "function" &&
                    typeof i.componentWillUpdate != "function") ||
                  (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(l, f, c),
                  typeof i.UNSAFE_componentWillUpdate == "function" &&
                    i.UNSAFE_componentWillUpdate(l, f, c)),
                typeof i.componentDidUpdate == "function" && (e.flags |= 4),
                typeof i.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
              : (typeof i.componentDidUpdate != "function" ||
                  (u === a.memoizedProps && m === a.memoizedState) ||
                  (e.flags |= 4),
                typeof i.getSnapshotBeforeUpdate != "function" ||
                  (u === a.memoizedProps && m === a.memoizedState) ||
                  (e.flags |= 1024),
                (e.memoizedProps = l),
                (e.memoizedState = f)),
            (i.props = l),
            (i.state = f),
            (i.context = c),
            (l = g))
          : (typeof i.componentDidUpdate != "function" ||
              (u === a.memoizedProps && m === a.memoizedState) ||
              (e.flags |= 4),
            typeof i.getSnapshotBeforeUpdate != "function" ||
              (u === a.memoizedProps && m === a.memoizedState) ||
              (e.flags |= 1024),
            (l = !1));
      }
      return (
        (i = l),
        Ou(a, e),
        (l = (e.flags & 128) !== 0),
        i || l
          ? ((i = e.stateNode),
            (t = l && typeof t.getDerivedStateFromError != "function" ? null : i.render()),
            (e.flags |= 1),
            a !== null && l
              ? ((e.child = Rl(e, a.child, null, n)), (e.child = Rl(e, null, t, n)))
              : Va(a, e, t, n),
            (e.memoizedState = i.state),
            (a = e.child))
          : (a = Dt(a, e, n)),
        a
      );
    }
    function fd(a, e, t, l) {
      return (Ol(), (e.flags |= 256), Va(a, e, t, l), e.child);
    }
    var Sc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function xc(a) {
      return { baseLanes: a, cachePool: Lm() };
    }
    function zc(a, e, t) {
      return ((a = a !== null ? a.childLanes & ~t : 0), e && (a |= xe), a);
    }
    function Ap(a, e, t) {
      var l = e.pendingProps,
        n = !1,
        i = (e.flags & 128) !== 0,
        u;
      if (
        ((u = i) || (u = a !== null && a.memoizedState === null ? !1 : (Oa.current & 2) !== 0),
        u && ((n = !0), (e.flags &= -129)),
        (u = (e.flags & 32) !== 0),
        (e.flags &= -33),
        a === null)
      ) {
        if (P) {
          if (
            (n ? Gt(e) : Xt(e),
            (a = ba)
              ? ((a = h0(a, qe)),
                (a = a !== null && a.data !== "&" ? a : null),
                a !== null &&
                  ((e.memoizedState = {
                    dehydrated: a,
                    treeContext: il !== null ? { id: et, overflow: tt } : null,
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (t = Rm(a)),
                  (t.return = e),
                  (e.child = t),
                  (Ka = e),
                  (ba = null)))
              : (a = null),
            a === null)
          )
            throw ul(e);
          return (As(a) ? (e.lanes = 32) : (e.lanes = 536870912), null);
        }
        var o = l.children;
        return (
          (l = l.fallback),
          n
            ? (Xt(e),
              (n = e.mode),
              (o = Wu({ mode: "hidden", children: o }, n)),
              (l = Nl(l, n, t, null)),
              (o.return = e),
              (l.return = e),
              (o.sibling = l),
              (e.child = o),
              (l = e.child),
              (l.memoizedState = xc(t)),
              (l.childLanes = zc(a, u, t)),
              (e.memoizedState = Sc),
              Pn(null, l))
            : (Gt(e), ps(e, o))
        );
      }
      var c = a.memoizedState;
      if (c !== null && ((o = c.dehydrated), o !== null)) {
        if (i)
          e.flags & 256
            ? (Gt(e), (e.flags &= -257), (e = Mc(a, e, t)))
            : e.memoizedState !== null
              ? (Xt(e), (e.child = a.child), (e.flags |= 128), (e = null))
              : (Xt(e),
                (o = l.fallback),
                (n = e.mode),
                (l = Wu({ mode: "visible", children: l.children }, n)),
                (o = Nl(o, n, t, null)),
                (o.flags |= 2),
                (l.return = e),
                (o.return = e),
                (l.sibling = o),
                (e.child = l),
                Rl(e, a.child, null, t),
                (l = e.child),
                (l.memoizedState = xc(t)),
                (l.childLanes = zc(a, u, t)),
                (e.memoizedState = Sc),
                (e = Pn(null, l)));
        else if ((Gt(e), As(o))) {
          if (((u = o.nextSibling && o.nextSibling.dataset), u)) var d = u.dgst;
          ((u = d),
            (l = Error(z(419))),
            (l.stack = ""),
            (l.digest = u),
            yi({ value: l, source: null, stack: null }),
            (e = Mc(a, e, t)));
        } else if ((La || On(a, e, t, !1), (u = (t & a.childLanes) !== 0), La || u)) {
          if (((u = ra), u !== null && ((l = lm(u, t)), l !== 0 && l !== c.retryLane)))
            throw ((c.retryLane = l), ql(a, l), re(u, a, l), dr);
          (Ts(o) || ao(), (e = Mc(a, e, t)));
        } else
          Ts(o)
            ? ((e.flags |= 192), (e.child = a.child), (e = null))
            : ((a = c.treeContext),
              (ba = je(o.nextSibling)),
              (Ka = e),
              (P = !0),
              (Ft = null),
              (qe = !1),
              a !== null && _m(e, a),
              (e = ps(e, l.children)),
              (e.flags |= 4096));
        return e;
      }
      return n
        ? (Xt(e),
          (o = l.fallback),
          (n = e.mode),
          (c = a.child),
          (d = c.sibling),
          (l = Et(c, { mode: "hidden", children: l.children })),
          (l.subtreeFlags = c.subtreeFlags & 65011712),
          d !== null ? (o = Et(d, o)) : ((o = Nl(o, n, t, null)), (o.flags |= 2)),
          (o.return = e),
          (l.return = e),
          (l.sibling = o),
          (e.child = l),
          Pn(null, l),
          (l = e.child),
          (o = a.child.memoizedState),
          o === null
            ? (o = xc(t))
            : ((n = o.cachePool),
              n !== null
                ? ((c = ka._currentValue), (n = n.parent !== c ? { parent: c, pool: c } : n))
                : (n = Lm()),
              (o = { baseLanes: o.baseLanes | t, cachePool: n })),
          (l.memoizedState = o),
          (l.childLanes = zc(a, u, t)),
          (e.memoizedState = Sc),
          Pn(a.child, l))
        : (Gt(e),
          (t = a.child),
          (a = t.sibling),
          (t = Et(t, { mode: "visible", children: l.children })),
          (t.return = e),
          (t.sibling = null),
          a !== null &&
            ((u = e.deletions), u === null ? ((e.deletions = [a]), (e.flags |= 16)) : u.push(a)),
          (e.child = t),
          (e.memoizedState = null),
          t);
    }
    function ps(a, e) {
      return ((e = Wu({ mode: "visible", children: e }, a.mode)), (e.return = a), (a.child = e));
    }
    function Wu(a, e) {
      return ((a = Se(22, a, null, e)), (a.lanes = 0), a);
    }
    function Mc(a, e, t) {
      return (
        Rl(e, a.child, null, t),
        (a = ps(e, e.pendingProps.children)),
        (a.flags |= 2),
        (e.memoizedState = null),
        a
      );
    }
    function dd(a, e, t) {
      a.lanes |= e;
      var l = a.alternate;
      (l !== null && (l.lanes |= e), es(a.return, e, t));
    }
    function Ec(a, e, t, l, n, i) {
      var u = a.memoizedState;
      u === null
        ? (a.memoizedState = {
            isBackwards: e,
            rendering: null,
            renderingStartTime: 0,
            last: l,
            tail: t,
            tailMode: n,
            treeForkCount: i,
          })
        : ((u.isBackwards = e),
          (u.rendering = null),
          (u.renderingStartTime = 0),
          (u.last = l),
          (u.tail = t),
          (u.tailMode = n),
          (u.treeForkCount = i));
    }
    function Cp(a, e, t) {
      var l = e.pendingProps,
        n = l.revealOrder,
        i = l.tail;
      l = l.children;
      var u = Oa.current,
        o = (u & 2) !== 0;
      if (
        (o ? ((u = (u & 1) | 2), (e.flags |= 128)) : (u &= 1),
        ma(Oa, u),
        Va(a, e, l, t),
        (l = P ? hi : 0),
        !o && a !== null && (a.flags & 128) !== 0)
      )
        a: for (a = e.child; a !== null;) {
          if (a.tag === 13) a.memoizedState !== null && dd(a, t, e);
          else if (a.tag === 19) dd(a, t, e);
          else if (a.child !== null) {
            ((a.child.return = a), (a = a.child));
            continue;
          }
          if (a === e) break a;
          for (; a.sibling === null;) {
            if (a.return === null || a.return === e) break a;
            a = a.return;
          }
          ((a.sibling.return = a.return), (a = a.sibling));
        }
      switch (n) {
        case "forwards":
          for (t = e.child, n = null; t !== null;)
            ((a = t.alternate), a !== null && Zu(a) === null && (n = t), (t = t.sibling));
          ((t = n),
            t === null ? ((n = e.child), (e.child = null)) : ((n = t.sibling), (t.sibling = null)),
            Ec(e, !1, n, t, i, l));
          break;
        case "backwards":
        case "unstable_legacy-backwards":
          for (t = null, n = e.child, e.child = null; n !== null;) {
            if (((a = n.alternate), a !== null && Zu(a) === null)) {
              e.child = n;
              break;
            }
            ((a = n.sibling), (n.sibling = t), (t = n), (n = a));
          }
          Ec(e, !0, t, null, i, l);
          break;
        case "together":
          Ec(e, !1, null, null, void 0, l);
          break;
        default:
          e.memoizedState = null;
      }
      return e.child;
    }
    function Dt(a, e, t) {
      if (
        (a !== null && (e.dependencies = a.dependencies), (cl |= e.lanes), (t & e.childLanes) === 0)
      )
        if (a !== null) {
          if ((On(a, e, t, !1), (t & e.childLanes) === 0)) return null;
        } else return null;
      if (a !== null && e.child !== a.child) throw Error(z(153));
      if (e.child !== null) {
        for (a = e.child, t = Et(a, a.pendingProps), e.child = t, t.return = e; a.sibling !== null;)
          ((a = a.sibling), (t = t.sibling = Et(a, a.pendingProps)), (t.return = e));
        t.sibling = null;
      }
      return e.child;
    }
    function mr(a, e) {
      return (a.lanes & e) !== 0 ? !0 : ((a = a.dependencies), !!(a !== null && Xu(a)));
    }
    function Xb(a, e, t) {
      switch (e.tag) {
        case 3:
          (Uu(e, e.stateNode.containerInfo), Yt(e, ka, a.memoizedState.cache), Ol());
          break;
        case 27:
        case 5:
          Gc(e);
          break;
        case 4:
          Uu(e, e.stateNode.containerInfo);
          break;
        case 10:
          Yt(e, e.type, e.memoizedProps.value);
          break;
        case 31:
          if (e.memoizedState !== null) return ((e.flags |= 128), os(e), null);
          break;
        case 13:
          var l = e.memoizedState;
          if (l !== null)
            return l.dehydrated !== null
              ? (Gt(e), (e.flags |= 128), null)
              : (t & e.child.childLanes) !== 0
                ? Ap(a, e, t)
                : (Gt(e), (a = Dt(a, e, t)), a !== null ? a.sibling : null);
          Gt(e);
          break;
        case 19:
          var n = (a.flags & 128) !== 0;
          if (
            ((l = (t & e.childLanes) !== 0),
            l || (On(a, e, t, !1), (l = (t & e.childLanes) !== 0)),
            n)
          ) {
            if (l) return Cp(a, e, t);
            e.flags |= 128;
          }
          if (
            ((n = e.memoizedState),
            n !== null && ((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
            ma(Oa, Oa.current),
            l)
          )
            break;
          return null;
        case 22:
          return ((e.lanes = 0), Tp(a, e, t, e.pendingProps));
        case 24:
          Yt(e, ka, a.memoizedState.cache);
      }
      return Dt(a, e, t);
    }
    function Op(a, e, t) {
      if (a !== null)
        if (a.memoizedProps !== e.pendingProps) La = !0;
        else {
          if (!mr(a, t) && (e.flags & 128) === 0) return ((La = !1), Xb(a, e, t));
          La = (a.flags & 131072) !== 0;
        }
      else ((La = !1), P && (e.flags & 1048576) !== 0 && wm(e, hi, e.index));
      switch (((e.lanes = 0), e.tag)) {
        case 16:
          a: {
            var l = e.pendingProps;
            if (((a = zl(e.elementType)), (e.type = a), typeof a == "function"))
              Vs(a)
                ? ((l = _l(a, l)), (e.tag = 1), (e = rd(null, e, a, l, t)))
                : ((e.tag = 0), (e = ms(null, e, a, l, t)));
            else {
              if (a != null) {
                var n = a.$$typeof;
                if (n === Rs) {
                  ((e.tag = 11), (e = id(null, e, a, l, t)));
                  break a;
                } else if (n === ws) {
                  ((e.tag = 14), (e = ud(null, e, a, l, t)));
                  break a;
                }
              }
              throw ((e = Bc(a) || a), Error(z(306, e, "")));
            }
          }
          return e;
        case 0:
          return ms(a, e, e.type, e.pendingProps, t);
        case 1:
          return ((l = e.type), (n = _l(l, e.pendingProps)), rd(a, e, l, n, t));
        case 3:
          a: {
            if ((Uu(e, e.stateNode.containerInfo), a === null)) throw Error(z(387));
            l = e.pendingProps;
            var i = e.memoizedState;
            ((n = i.element), ns(a, e), oi(e, l, null, t));
            var u = e.memoizedState;
            if (
              ((l = u.cache),
              Yt(e, ka, l),
              l !== i.cache && ts(e, [ka], t, !0),
              ui(),
              (l = u.element),
              i.isDehydrated)
            )
              if (
                ((i = { element: l, isDehydrated: !1, cache: u.cache }),
                (e.updateQueue.baseState = i),
                (e.memoizedState = i),
                e.flags & 256)
              ) {
                e = fd(a, e, l, t);
                break a;
              } else if (l !== n) {
                ((n = Ue(Error(z(424)), e)), yi(n), (e = fd(a, e, l, t)));
                break a;
              } else
                for (
                  a = e.stateNode.containerInfo,
                    a.nodeType === 9
                      ? (a = a.body)
                      : (a = a.nodeName === "HTML" ? a.ownerDocument.body : a),
                    ba = je(a.firstChild),
                    Ka = e,
                    P = !0,
                    Ft = null,
                    qe = !0,
                    t = Hm(e, null, l, t),
                    e.child = t;
                  t;
                )
                  ((t.flags = (t.flags & -3) | 4096), (t = t.sibling));
            else {
              if ((Ol(), l === n)) {
                e = Dt(a, e, t);
                break a;
              }
              Va(a, e, l, t);
            }
            e = e.child;
          }
          return e;
        case 26:
          return (
            Ou(a, e),
            a === null
              ? (t = kd(e.type, null, e.pendingProps, null))
                ? (e.memoizedState = t)
                : P ||
                  ((t = e.type),
                  (a = e.pendingProps),
                  (l = no(Wt.current).createElement(t)),
                  (l[Za] = e),
                  (l[fe] = a),
                  $a(l, t, a),
                  ja(l),
                  (e.stateNode = l))
              : (e.memoizedState = kd(e.type, a.memoizedProps, e.pendingProps, a.memoizedState)),
            null
          );
        case 27:
          return (
            Gc(e),
            a === null &&
              P &&
              ((l = e.stateNode = y0(e.type, e.pendingProps, Wt.current)),
              (Ka = e),
              (qe = !0),
              (n = ba),
              rl(e.type) ? ((Cs = n), (ba = je(l.firstChild))) : (ba = n)),
            Va(a, e, e.pendingProps.children, t),
            Ou(a, e),
            a === null && (e.flags |= 4194304),
            e.child
          );
        case 5:
          return (
            a === null &&
              P &&
              ((n = l = ba) &&
                ((l = bh(l, e.type, e.pendingProps, qe)),
                l !== null
                  ? ((e.stateNode = l), (Ka = e), (ba = je(l.firstChild)), (qe = !1), (n = !0))
                  : (n = !1)),
              n || ul(e)),
            Gc(e),
            (n = e.type),
            (i = e.pendingProps),
            (u = a !== null ? a.memoizedProps : null),
            (l = i.children),
            Es(n, i) ? (l = null) : u !== null && Es(n, u) && (e.flags |= 32),
            e.memoizedState !== null && ((n = ar(a, e, kb, null, null, t)), (Ni._currentValue = n)),
            Ou(a, e),
            Va(a, e, l, t),
            e.child
          );
        case 6:
          return (
            a === null &&
              P &&
              ((a = t = ba) &&
                ((t = hh(t, e.pendingProps, qe)),
                t !== null ? ((e.stateNode = t), (Ka = e), (ba = null), (a = !0)) : (a = !1)),
              a || ul(e)),
            null
          );
        case 13:
          return Ap(a, e, t);
        case 4:
          return (
            Uu(e, e.stateNode.containerInfo),
            (l = e.pendingProps),
            a === null ? (e.child = Rl(e, null, l, t)) : Va(a, e, l, t),
            e.child
          );
        case 11:
          return id(a, e, e.type, e.pendingProps, t);
        case 7:
          return (Va(a, e, e.pendingProps, t), e.child);
        case 8:
          return (Va(a, e, e.pendingProps.children, t), e.child);
        case 12:
          return (Va(a, e, e.pendingProps.children, t), e.child);
        case 10:
          return ((l = e.pendingProps), Yt(e, e.type, l.value), Va(a, e, l.children, t), e.child);
        case 9:
          return (
            (n = e.type._context),
            (l = e.pendingProps.children),
            Dl(e),
            (n = Ja(n)),
            (l = l(n)),
            (e.flags |= 1),
            Va(a, e, l, t),
            e.child
          );
        case 14:
          return ud(a, e, e.type, e.pendingProps, t);
        case 15:
          return Np(a, e, e.type, e.pendingProps, t);
        case 19:
          return Cp(a, e, t);
        case 31:
          return Gb(a, e, t);
        case 22:
          return Tp(a, e, t, e.pendingProps);
        case 24:
          return (
            Dl(e),
            (l = Ja(ka)),
            a === null
              ? ((n = $s()),
                n === null &&
                  ((n = ra),
                  (i = Js()),
                  (n.pooledCache = i),
                  i.refCount++,
                  i !== null && (n.pooledCacheLanes |= t),
                  (n = i)),
                (e.memoizedState = { parent: l, cache: n }),
                Fs(e),
                Yt(e, ka, n))
              : ((a.lanes & t) !== 0 && (ns(a, e), oi(e, null, null, t), ui()),
                (n = a.memoizedState),
                (i = e.memoizedState),
                n.parent !== l
                  ? ((n = { parent: l, cache: l }),
                    (e.memoizedState = n),
                    e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = n),
                    Yt(e, ka, l))
                  : ((l = i.cache), Yt(e, ka, l), l !== n.cache && ts(e, [ka], t, !0))),
            Va(a, e, e.pendingProps.children, t),
            e.child
          );
        case 29:
          throw e.pendingProps;
      }
      throw Error(z(156, e.tag));
    }
    function gt(a) {
      a.flags |= 4;
    }
    function Nc(a, e, t, l, n) {
      if (((e = (a.mode & 32) !== 0) && (e = !1), e)) {
        if (((a.flags |= 16777216), (n & 335544128) === n))
          if (a.stateNode.complete) a.flags |= 8192;
          else if (Pp()) a.flags |= 8192;
          else throw ((Al = Qu), Ws);
      } else a.flags &= -16777217;
    }
    function md(a, e) {
      if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) a.flags &= -16777217;
      else if (((a.flags |= 16777216), !z0(e)))
        if (Pp()) a.flags |= 8192;
        else throw ((Al = Qu), Ws);
    }
    function mu(a, e) {
      (e !== null && (a.flags |= 4),
        a.flags & 16384 && ((e = a.tag !== 22 ? am() : 536870912), (a.lanes |= e), (zn |= e)));
    }
    function Zn(a, e) {
      if (!P)
        switch (a.tailMode) {
          case "hidden":
            e = a.tail;
            for (var t = null; e !== null;) (e.alternate !== null && (t = e), (e = e.sibling));
            t === null ? (a.tail = null) : (t.sibling = null);
            break;
          case "collapsed":
            t = a.tail;
            for (var l = null; t !== null;) (t.alternate !== null && (l = t), (t = t.sibling));
            l === null
              ? e || a.tail === null
                ? (a.tail = null)
                : (a.tail.sibling = null)
              : (l.sibling = null);
        }
    }
    function va(a) {
      var e = a.alternate !== null && a.alternate.child === a.child,
        t = 0,
        l = 0;
      if (e)
        for (var n = a.child; n !== null;)
          ((t |= n.lanes | n.childLanes),
            (l |= n.subtreeFlags & 65011712),
            (l |= n.flags & 65011712),
            (n.return = a),
            (n = n.sibling));
      else
        for (n = a.child; n !== null;)
          ((t |= n.lanes | n.childLanes),
            (l |= n.subtreeFlags),
            (l |= n.flags),
            (n.return = a),
            (n = n.sibling));
      return ((a.subtreeFlags |= l), (a.childLanes = t), e);
    }
    function Qb(a, e, t) {
      var l = e.pendingProps;
      switch ((Ks(e), e.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (va(e), null);
        case 1:
          return (va(e), null);
        case 3:
          return (
            (t = e.stateNode),
            (l = null),
            a !== null && (l = a.memoizedState.cache),
            e.memoizedState.cache !== l && (e.flags |= 2048),
            Nt(ka),
            vn(),
            t.pendingContext && ((t.context = t.pendingContext), (t.pendingContext = null)),
            (a === null || a.child === null) &&
              (Zl(e)
                ? gt(e)
                : a === null ||
                  (a.memoizedState.isDehydrated && (e.flags & 256) === 0) ||
                  ((e.flags |= 1024), vc())),
            va(e),
            null
          );
        case 26:
          var n = e.type,
            i = e.memoizedState;
          return (
            a === null
              ? (gt(e), i !== null ? (va(e), md(e, i)) : (va(e), Nc(e, n, null, l, t)))
              : i
                ? i !== a.memoizedState
                  ? (gt(e), va(e), md(e, i))
                  : (va(e), (e.flags &= -16777217))
                : ((a = a.memoizedProps), a !== l && gt(e), va(e), Nc(e, n, a, l, t)),
            null
          );
        case 27:
          if ((qu(e), (t = Wt.current), (n = e.type), a !== null && e.stateNode != null))
            a.memoizedProps !== l && gt(e);
          else {
            if (!l) {
              if (e.stateNode === null) throw Error(z(166));
              return (va(e), null);
            }
            ((a = nt.current), Zl(e) ? Gf(e, a) : ((a = y0(n, l, t)), (e.stateNode = a), gt(e)));
          }
          return (va(e), null);
        case 5:
          if ((qu(e), (n = e.type), a !== null && e.stateNode != null))
            a.memoizedProps !== l && gt(e);
          else {
            if (!l) {
              if (e.stateNode === null) throw Error(z(166));
              return (va(e), null);
            }
            if (((i = nt.current), Zl(e))) Gf(e, i);
            else {
              var u = no(Wt.current);
              switch (i) {
                case 1:
                  i = u.createElementNS("http://www.w3.org/2000/svg", n);
                  break;
                case 2:
                  i = u.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                  break;
                default:
                  switch (n) {
                    case "svg":
                      i = u.createElementNS("http://www.w3.org/2000/svg", n);
                      break;
                    case "math":
                      i = u.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                      break;
                    case "script":
                      ((i = u.createElement("div")),
                        (i.innerHTML = "<script><\/script>"),
                        (i = i.removeChild(i.firstChild)));
                      break;
                    case "select":
                      ((i =
                        typeof l.is == "string"
                          ? u.createElement("select", { is: l.is })
                          : u.createElement("select")),
                        l.multiple ? (i.multiple = !0) : l.size && (i.size = l.size));
                      break;
                    default:
                      i =
                        typeof l.is == "string"
                          ? u.createElement(n, { is: l.is })
                          : u.createElement(n);
                  }
              }
              ((i[Za] = e), (i[fe] = l));
              a: for (u = e.child; u !== null;) {
                if (u.tag === 5 || u.tag === 6) i.appendChild(u.stateNode);
                else if (u.tag !== 4 && u.tag !== 27 && u.child !== null) {
                  ((u.child.return = u), (u = u.child));
                  continue;
                }
                if (u === e) break a;
                for (; u.sibling === null;) {
                  if (u.return === null || u.return === e) break a;
                  u = u.return;
                }
                ((u.sibling.return = u.return), (u = u.sibling));
              }
              e.stateNode = i;
              a: switch (($a(i, n, l), n)) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  l = !!l.autoFocus;
                  break a;
                case "img":
                  l = !0;
                  break a;
                default:
                  l = !1;
              }
              l && gt(e);
            }
          }
          return (
            va(e),
            Nc(e, e.type, a === null ? null : a.memoizedProps, e.pendingProps, t),
            null
          );
        case 6:
          if (a && e.stateNode != null) a.memoizedProps !== l && gt(e);
          else {
            if (typeof l != "string" && e.stateNode === null) throw Error(z(166));
            if (((a = Wt.current), Zl(e))) {
              if (((a = e.stateNode), (t = e.memoizedProps), (l = null), (n = Ka), n !== null))
                switch (n.tag) {
                  case 27:
                  case 5:
                    l = n.memoizedProps;
                }
              ((a[Za] = e),
                (a = !!(
                  a.nodeValue === t ||
                  (l !== null && l.suppressHydrationWarning === !0) ||
                  g0(a.nodeValue, t)
                )),
                a || ul(e, !0));
            } else ((a = no(a).createTextNode(l)), (a[Za] = e), (e.stateNode = a));
          }
          return (va(e), null);
        case 31:
          if (((t = e.memoizedState), a === null || a.memoizedState !== null)) {
            if (((l = Zl(e)), t !== null)) {
              if (a === null) {
                if (!l) throw Error(z(318));
                if (((a = e.memoizedState), (a = a !== null ? a.dehydrated : null), !a))
                  throw Error(z(557));
                a[Za] = e;
              } else (Ol(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
              (va(e), (a = !1));
            } else
              ((t = vc()),
                a !== null && a.memoizedState !== null && (a.memoizedState.hydrationErrors = t),
                (a = !0));
            if (!a) return e.flags & 256 ? (ye(e), e) : (ye(e), null);
            if ((e.flags & 128) !== 0) throw Error(z(558));
          }
          return (va(e), null);
        case 13:
          if (
            ((l = e.memoizedState),
            a === null || (a.memoizedState !== null && a.memoizedState.dehydrated !== null))
          ) {
            if (((n = Zl(e)), l !== null && l.dehydrated !== null)) {
              if (a === null) {
                if (!n) throw Error(z(318));
                if (((n = e.memoizedState), (n = n !== null ? n.dehydrated : null), !n))
                  throw Error(z(317));
                n[Za] = e;
              } else (Ol(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
              (va(e), (n = !1));
            } else
              ((n = vc()),
                a !== null && a.memoizedState !== null && (a.memoizedState.hydrationErrors = n),
                (n = !0));
            if (!n) return e.flags & 256 ? (ye(e), e) : (ye(e), null);
          }
          return (
            ye(e),
            (e.flags & 128) !== 0
              ? ((e.lanes = t), e)
              : ((t = l !== null),
                (a = a !== null && a.memoizedState !== null),
                t &&
                  ((l = e.child),
                  (n = null),
                  l.alternate !== null &&
                    l.alternate.memoizedState !== null &&
                    l.alternate.memoizedState.cachePool !== null &&
                    (n = l.alternate.memoizedState.cachePool.pool),
                  (i = null),
                  l.memoizedState !== null &&
                    l.memoizedState.cachePool !== null &&
                    (i = l.memoizedState.cachePool.pool),
                  i !== n && (l.flags |= 2048)),
                t !== a && t && (e.child.flags |= 8192),
                mu(e, e.updateQueue),
                va(e),
                null)
          );
        case 4:
          return (vn(), a === null && Sr(e.stateNode.containerInfo), va(e), null);
        case 10:
          return (Nt(e.type), va(e), null);
        case 19:
          if ((Ba(Oa), (l = e.memoizedState), l === null)) return (va(e), null);
          if (((n = (e.flags & 128) !== 0), (i = l.rendering), i === null))
            if (n) Zn(l, !1);
            else {
              if (Aa !== 0 || (a !== null && (a.flags & 128) !== 0))
                for (a = e.child; a !== null;) {
                  if (((i = Zu(a)), i !== null)) {
                    for (
                      e.flags |= 128,
                        Zn(l, !1),
                        a = i.updateQueue,
                        e.updateQueue = a,
                        mu(e, a),
                        e.subtreeFlags = 0,
                        a = t,
                        t = e.child;
                      t !== null;
                    )
                      (Dm(t, a), (t = t.sibling));
                    return (ma(Oa, (Oa.current & 1) | 2), P && yt(e, l.treeForkCount), e.child);
                  }
                  a = a.sibling;
                }
              l.tail !== null &&
                ze() > Iu &&
                ((e.flags |= 128), (n = !0), Zn(l, !1), (e.lanes = 4194304));
            }
          else {
            if (!n)
              if (((a = Zu(i)), a !== null)) {
                if (
                  ((e.flags |= 128),
                  (n = !0),
                  (a = a.updateQueue),
                  (e.updateQueue = a),
                  mu(e, a),
                  Zn(l, !0),
                  l.tail === null && l.tailMode === "hidden" && !i.alternate && !P)
                )
                  return (va(e), null);
              } else
                2 * ze() - l.renderingStartTime > Iu &&
                  t !== 536870912 &&
                  ((e.flags |= 128), (n = !0), Zn(l, !1), (e.lanes = 4194304));
            l.isBackwards
              ? ((i.sibling = e.child), (e.child = i))
              : ((a = l.last), a !== null ? (a.sibling = i) : (e.child = i), (l.last = i));
          }
          return l.tail !== null
            ? ((a = l.tail),
              (l.rendering = a),
              (l.tail = a.sibling),
              (l.renderingStartTime = ze()),
              (a.sibling = null),
              (t = Oa.current),
              ma(Oa, n ? (t & 1) | 2 : t & 1),
              P && yt(e, l.treeForkCount),
              a)
            : (va(e), null);
        case 22:
        case 23:
          return (
            ye(e),
            Is(),
            (l = e.memoizedState !== null),
            a !== null
              ? (a.memoizedState !== null) !== l && (e.flags |= 8192)
              : l && (e.flags |= 8192),
            l
              ? (t & 536870912) !== 0 &&
                (e.flags & 128) === 0 &&
                (va(e), e.subtreeFlags & 6 && (e.flags |= 8192))
              : va(e),
            (t = e.updateQueue),
            t !== null && mu(e, t.retryQueue),
            (t = null),
            a !== null &&
              a.memoizedState !== null &&
              a.memoizedState.cachePool !== null &&
              (t = a.memoizedState.cachePool.pool),
            (l = null),
            e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (l = e.memoizedState.cachePool.pool),
            l !== t && (e.flags |= 2048),
            a !== null && Ba(Tl),
            null
          );
        case 24:
          return (
            (t = null),
            a !== null && (t = a.memoizedState.cache),
            e.memoizedState.cache !== t && (e.flags |= 2048),
            Nt(ka),
            va(e),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(z(156, e.tag));
    }
    function Vb(a, e) {
      switch ((Ks(e), e.tag)) {
        case 1:
          return ((a = e.flags), a & 65536 ? ((e.flags = (a & -65537) | 128), e) : null);
        case 3:
          return (
            Nt(ka),
            vn(),
            (a = e.flags),
            (a & 65536) !== 0 && (a & 128) === 0 ? ((e.flags = (a & -65537) | 128), e) : null
          );
        case 26:
        case 27:
        case 5:
          return (qu(e), null);
        case 31:
          if (e.memoizedState !== null) {
            if ((ye(e), e.alternate === null)) throw Error(z(340));
            Ol();
          }
          return ((a = e.flags), a & 65536 ? ((e.flags = (a & -65537) | 128), e) : null);
        case 13:
          if ((ye(e), (a = e.memoizedState), a !== null && a.dehydrated !== null)) {
            if (e.alternate === null) throw Error(z(340));
            Ol();
          }
          return ((a = e.flags), a & 65536 ? ((e.flags = (a & -65537) | 128), e) : null);
        case 19:
          return (Ba(Oa), null);
        case 4:
          return (vn(), null);
        case 10:
          return (Nt(e.type), null);
        case 22:
        case 23:
          return (
            ye(e),
            Is(),
            a !== null && Ba(Tl),
            (a = e.flags),
            a & 65536 ? ((e.flags = (a & -65537) | 128), e) : null
          );
        case 24:
          return (Nt(ka), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Dp(a, e) {
      switch ((Ks(e), e.tag)) {
        case 3:
          (Nt(ka), vn());
          break;
        case 26:
        case 27:
        case 5:
          qu(e);
          break;
        case 4:
          vn();
          break;
        case 31:
          e.memoizedState !== null && ye(e);
          break;
        case 13:
          ye(e);
          break;
        case 19:
          Ba(Oa);
          break;
        case 10:
          Nt(e.type);
          break;
        case 22:
        case 23:
          (ye(e), Is(), a !== null && Ba(Tl));
          break;
        case 24:
          Nt(ka);
      }
    }
    function Ui(a, e) {
      try {
        var t = e.updateQueue,
          l = t !== null ? t.lastEffect : null;
        if (l !== null) {
          var n = l.next;
          t = n;
          do {
            if ((t.tag & a) === a) {
              l = void 0;
              var i = t.create,
                u = t.inst;
              ((l = i()), (u.destroy = l));
            }
            t = t.next;
          } while (t !== n);
        }
      } catch (o) {
        ua(e, e.return, o);
      }
    }
    function ol(a, e, t) {
      try {
        var l = e.updateQueue,
          n = l !== null ? l.lastEffect : null;
        if (n !== null) {
          var i = n.next;
          l = i;
          do {
            if ((l.tag & a) === a) {
              var u = l.inst,
                o = u.destroy;
              if (o !== void 0) {
                ((u.destroy = void 0), (n = e));
                var c = t,
                  d = o;
                try {
                  d();
                } catch (g) {
                  ua(n, c, g);
                }
              }
            }
            l = l.next;
          } while (l !== i);
        }
      } catch (g) {
        ua(e, e.return, g);
      }
    }
    function Rp(a) {
      var e = a.updateQueue;
      if (e !== null) {
        var t = a.stateNode;
        try {
          Bm(e, t);
        } catch (l) {
          ua(a, a.return, l);
        }
      }
    }
    function wp(a, e, t) {
      ((t.props = _l(a.type, a.memoizedProps)), (t.state = a.memoizedState));
      try {
        t.componentWillUnmount();
      } catch (l) {
        ua(a, e, l);
      }
    }
    function si(a, e) {
      try {
        var t = a.ref;
        if (t !== null) {
          switch (a.tag) {
            case 26:
            case 27:
            case 5:
              var l = a.stateNode;
              break;
            case 30:
              l = a.stateNode;
              break;
            default:
              l = a.stateNode;
          }
          typeof t == "function" ? (a.refCleanup = t(l)) : (t.current = l);
        }
      } catch (n) {
        ua(a, e, n);
      }
    }
    function lt(a, e) {
      var t = a.ref,
        l = a.refCleanup;
      if (t !== null)
        if (typeof l == "function")
          try {
            l();
          } catch (n) {
            ua(a, e, n);
          } finally {
            ((a.refCleanup = null), (a = a.alternate), a != null && (a.refCleanup = null));
          }
        else if (typeof t == "function")
          try {
            t(null);
          } catch (n) {
            ua(a, e, n);
          }
        else t.current = null;
    }
    function _p(a) {
      var e = a.type,
        t = a.memoizedProps,
        l = a.stateNode;
      try {
        a: switch (e) {
          case "button":
          case "input":
          case "select":
          case "textarea":
            t.autoFocus && l.focus();
            break a;
          case "img":
            t.src ? (l.src = t.src) : t.srcSet && (l.srcset = t.srcSet);
        }
      } catch (n) {
        ua(a, a.return, n);
      }
    }
    function Tc(a, e, t) {
      try {
        var l = a.stateNode;
        (fh(l, a.type, t, e), (l[fe] = e));
      } catch (n) {
        ua(a, a.return, n);
      }
    }
    function kp(a) {
      return (
        a.tag === 5 || a.tag === 3 || a.tag === 26 || (a.tag === 27 && rl(a.type)) || a.tag === 4
      );
    }
    function Ac(a) {
      a: for (;;) {
        for (; a.sibling === null;) {
          if (a.return === null || kp(a.return)) return null;
          a = a.return;
        }
        for (
          a.sibling.return = a.return, a = a.sibling;
          a.tag !== 5 && a.tag !== 6 && a.tag !== 18;
        ) {
          if ((a.tag === 27 && rl(a.type)) || a.flags & 2 || a.child === null || a.tag === 4)
            continue a;
          ((a.child.return = a), (a = a.child));
        }
        if (!(a.flags & 2)) return a.stateNode;
      }
    }
    function gs(a, e, t) {
      var l = a.tag;
      if (l === 5 || l === 6)
        ((a = a.stateNode),
          e
            ? (t.nodeType === 9
                ? t.body
                : t.nodeName === "HTML"
                  ? t.ownerDocument.body
                  : t
              ).insertBefore(a, e)
            : ((e = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t),
              e.appendChild(a),
              (t = t._reactRootContainer),
              t != null || e.onclick !== null || (e.onclick = zt)));
      else if (
        l !== 4 &&
        (l === 27 && rl(a.type) && ((t = a.stateNode), (e = null)), (a = a.child), a !== null)
      )
        for (gs(a, e, t), a = a.sibling; a !== null;) (gs(a, e, t), (a = a.sibling));
    }
    function Fu(a, e, t) {
      var l = a.tag;
      if (l === 5 || l === 6) ((a = a.stateNode), e ? t.insertBefore(a, e) : t.appendChild(a));
      else if (l !== 4 && (l === 27 && rl(a.type) && (t = a.stateNode), (a = a.child), a !== null))
        for (Fu(a, e, t), a = a.sibling; a !== null;) (Fu(a, e, t), (a = a.sibling));
    }
    function Lp(a) {
      var e = a.stateNode,
        t = a.memoizedProps;
      try {
        for (var l = a.type, n = e.attributes; n.length;) e.removeAttributeNode(n[0]);
        ($a(e, l, t), (e[Za] = a), (e[fe] = t));
      } catch (i) {
        ua(a, a.return, i);
      }
    }
    var St = !1,
      _a = !1,
      Cc = !1,
      pd = typeof WeakSet == "function" ? WeakSet : Set,
      Ha = null;
    function Zb(a, e) {
      if (((a = a.containerInfo), (zs = co), (a = zm(a)), Gs(a))) {
        if ("selectionStart" in a) var t = { start: a.selectionStart, end: a.selectionEnd };
        else
          a: {
            t = ((t = a.ownerDocument) && t.defaultView) || window;
            var l = t.getSelection && t.getSelection();
            if (l && l.rangeCount !== 0) {
              t = l.anchorNode;
              var n = l.anchorOffset,
                i = l.focusNode;
              l = l.focusOffset;
              try {
                (t.nodeType, i.nodeType);
              } catch {
                t = null;
                break a;
              }
              var u = 0,
                o = -1,
                c = -1,
                d = 0,
                g = 0,
                b = a,
                m = null;
              e: for (;;) {
                for (
                  var f;
                  b !== t || (n !== 0 && b.nodeType !== 3) || (o = u + n),
                    b !== i || (l !== 0 && b.nodeType !== 3) || (c = u + l),
                    b.nodeType === 3 && (u += b.nodeValue.length),
                    (f = b.firstChild) !== null;
                )
                  ((m = b), (b = f));
                for (;;) {
                  if (b === a) break e;
                  if (
                    (m === t && ++d === n && (o = u),
                    m === i && ++g === l && (c = u),
                    (f = b.nextSibling) !== null)
                  )
                    break;
                  ((b = m), (m = b.parentNode));
                }
                b = f;
              }
              t = o === -1 || c === -1 ? null : { start: o, end: c };
            } else t = null;
          }
        t = t || { start: 0, end: 0 };
      } else t = null;
      for (Ms = { focusedElem: a, selectionRange: t }, co = !1, Ha = e; Ha !== null;)
        if (((e = Ha), (a = e.child), (e.subtreeFlags & 1028) !== 0 && a !== null))
          ((a.return = e), (Ha = a));
        else
          for (; Ha !== null;) {
            switch (((e = Ha), (i = e.alternate), (a = e.flags), e.tag)) {
              case 0:
                if (
                  (a & 4) !== 0 &&
                  ((a = e.updateQueue), (a = a !== null ? a.events : null), a !== null)
                )
                  for (t = 0; t < a.length; t++) ((n = a[t]), (n.ref.impl = n.nextImpl));
                break;
              case 11:
              case 15:
                break;
              case 1:
                if ((a & 1024) !== 0 && i !== null) {
                  ((a = void 0),
                    (t = e),
                    (n = i.memoizedProps),
                    (i = i.memoizedState),
                    (l = t.stateNode));
                  try {
                    var x = _l(t.type, n);
                    ((a = l.getSnapshotBeforeUpdate(x, i)),
                      (l.__reactInternalSnapshotBeforeUpdate = a));
                  } catch (S) {
                    ua(t, t.return, S);
                  }
                }
                break;
              case 3:
                if ((a & 1024) !== 0) {
                  if (((a = e.stateNode.containerInfo), (t = a.nodeType), t === 9)) Ns(a);
                  else if (t === 1)
                    switch (a.nodeName) {
                      case "HEAD":
                      case "HTML":
                      case "BODY":
                        Ns(a);
                        break;
                      default:
                        a.textContent = "";
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if ((a & 1024) !== 0) throw Error(z(163));
            }
            if (((a = e.sibling), a !== null)) {
              ((a.return = e.return), (Ha = a));
              break;
            }
            Ha = e.return;
          }
    }
    function Up(a, e, t) {
      var l = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (bt(a, t), l & 4 && Ui(5, t));
          break;
        case 1:
          if ((bt(a, t), l & 4))
            if (((a = t.stateNode), e === null))
              try {
                a.componentDidMount();
              } catch (u) {
                ua(t, t.return, u);
              }
            else {
              var n = _l(t.type, e.memoizedProps);
              e = e.memoizedState;
              try {
                a.componentDidUpdate(n, e, a.__reactInternalSnapshotBeforeUpdate);
              } catch (u) {
                ua(t, t.return, u);
              }
            }
          (l & 64 && Rp(t), l & 512 && si(t, t.return));
          break;
        case 3:
          if ((bt(a, t), l & 64 && ((a = t.updateQueue), a !== null))) {
            if (((e = null), t.child !== null))
              switch (t.child.tag) {
                case 27:
                case 5:
                  e = t.child.stateNode;
                  break;
                case 1:
                  e = t.child.stateNode;
              }
            try {
              Bm(a, e);
            } catch (u) {
              ua(t, t.return, u);
            }
          }
          break;
        case 27:
          e === null && l & 4 && Lp(t);
        case 26:
        case 5:
          (bt(a, t), e === null && l & 4 && _p(t), l & 512 && si(t, t.return));
          break;
        case 12:
          bt(a, t);
          break;
        case 31:
          (bt(a, t), l & 4 && jp(a, t));
          break;
        case 13:
          (bt(a, t),
            l & 4 && Bp(a, t),
            l & 64 &&
              ((a = t.memoizedState),
              a !== null &&
                ((a = a.dehydrated), a !== null && ((t = eh.bind(null, t)), yh(a, t)))));
          break;
        case 22:
          if (((l = t.memoizedState !== null || St), !l)) {
            ((e = (e !== null && e.memoizedState !== null) || _a), (n = St));
            var i = _a;
            ((St = l),
              (_a = e) && !i ? ht(a, t, (t.subtreeFlags & 8772) !== 0) : bt(a, t),
              (St = n),
              (_a = i));
          }
          break;
        case 30:
          break;
        default:
          bt(a, t);
      }
    }
    function qp(a) {
      var e = a.alternate;
      (e !== null && ((a.alternate = null), qp(e)),
        (a.child = null),
        (a.deletions = null),
        (a.sibling = null),
        a.tag === 5 && ((e = a.stateNode), e !== null && Us(e)),
        (a.stateNode = null),
        (a.return = null),
        (a.dependencies = null),
        (a.memoizedProps = null),
        (a.memoizedState = null),
        (a.pendingProps = null),
        (a.stateNode = null),
        (a.updateQueue = null));
    }
    var xa = null,
      ce = !1;
    function vt(a, e, t) {
      for (t = t.child; t !== null;) (Hp(a, e, t), (t = t.sibling));
    }
    function Hp(a, e, t) {
      if (Me && typeof Me.onCommitFiberUnmount == "function")
        try {
          Me.onCommitFiberUnmount(Oi, t);
        } catch {}
      switch (t.tag) {
        case 26:
          (_a || lt(t, e),
            vt(a, e, t),
            t.memoizedState
              ? t.memoizedState.count--
              : t.stateNode && ((t = t.stateNode), t.parentNode.removeChild(t)));
          break;
        case 27:
          _a || lt(t, e);
          var l = xa,
            n = ce;
          (rl(t.type) && ((xa = t.stateNode), (ce = !1)),
            vt(a, e, t),
            mi(t.stateNode),
            (xa = l),
            (ce = n));
          break;
        case 5:
          _a || lt(t, e);
        case 6:
          if (((l = xa), (n = ce), (xa = null), vt(a, e, t), (xa = l), (ce = n), xa !== null))
            if (ce)
              try {
                (xa.nodeType === 9
                  ? xa.body
                  : xa.nodeName === "HTML"
                    ? xa.ownerDocument.body
                    : xa
                ).removeChild(t.stateNode);
              } catch (i) {
                ua(t, e, i);
              }
            else
              try {
                xa.removeChild(t.stateNode);
              } catch (i) {
                ua(t, e, i);
              }
          break;
        case 18:
          xa !== null &&
            (ce
              ? ((a = xa),
                Od(
                  a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a,
                  t.stateNode,
                ),
                Tn(a))
              : Od(xa, t.stateNode));
          break;
        case 4:
          ((l = xa),
            (n = ce),
            (xa = t.stateNode.containerInfo),
            (ce = !0),
            vt(a, e, t),
            (xa = l),
            (ce = n));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (ol(2, t, e), _a || ol(4, t, e), vt(a, e, t));
          break;
        case 1:
          (_a ||
            (lt(t, e),
            (l = t.stateNode),
            typeof l.componentWillUnmount == "function" && wp(t, e, l)),
            vt(a, e, t));
          break;
        case 21:
          vt(a, e, t);
          break;
        case 22:
          ((_a = (l = _a) || t.memoizedState !== null), vt(a, e, t), (_a = l));
          break;
        default:
          vt(a, e, t);
      }
    }
    function jp(a, e) {
      if (
        e.memoizedState === null &&
        ((a = e.alternate), a !== null && ((a = a.memoizedState), a !== null))
      ) {
        a = a.dehydrated;
        try {
          Tn(a);
        } catch (t) {
          ua(e, e.return, t);
        }
      }
    }
    function Bp(a, e) {
      if (
        e.memoizedState === null &&
        ((a = e.alternate),
        a !== null && ((a = a.memoizedState), a !== null && ((a = a.dehydrated), a !== null)))
      )
        try {
          Tn(a);
        } catch (t) {
          ua(e, e.return, t);
        }
    }
    function Kb(a) {
      switch (a.tag) {
        case 31:
        case 13:
        case 19:
          var e = a.stateNode;
          return (e === null && (e = a.stateNode = new pd()), e);
        case 22:
          return (
            (a = a.stateNode),
            (e = a._retryCache),
            e === null && (e = a._retryCache = new pd()),
            e
          );
        default:
          throw Error(z(435, a.tag));
      }
    }
    function pu(a, e) {
      var t = Kb(a);
      e.forEach(function (l) {
        if (!t.has(l)) {
          t.add(l);
          var n = th.bind(null, a, l);
          l.then(n, n);
        }
      });
    }
    function ue(a, e) {
      var t = e.deletions;
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var n = t[l],
            i = a,
            u = e,
            o = u;
          a: for (; o !== null;) {
            switch (o.tag) {
              case 27:
                if (rl(o.type)) {
                  ((xa = o.stateNode), (ce = !1));
                  break a;
                }
                break;
              case 5:
                ((xa = o.stateNode), (ce = !1));
                break a;
              case 3:
              case 4:
                ((xa = o.stateNode.containerInfo), (ce = !0));
                break a;
            }
            o = o.return;
          }
          if (xa === null) throw Error(z(160));
          (Hp(i, u, n),
            (xa = null),
            (ce = !1),
            (i = n.alternate),
            i !== null && (i.return = null),
            (n.return = null));
        }
      if (e.subtreeFlags & 13886) for (e = e.child; e !== null;) (Yp(e, a), (e = e.sibling));
    }
    var Qe = null;
    function Yp(a, e) {
      var t = a.alternate,
        l = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (ue(e, a), oe(a), l & 4 && (ol(3, a, a.return), Ui(3, a), ol(5, a, a.return)));
          break;
        case 1:
          (ue(e, a),
            oe(a),
            l & 512 && (_a || t === null || lt(t, t.return)),
            l & 64 &&
              St &&
              ((a = a.updateQueue),
              a !== null &&
                ((l = a.callbacks),
                l !== null &&
                  ((t = a.shared.hiddenCallbacks),
                  (a.shared.hiddenCallbacks = t === null ? l : t.concat(l))))));
          break;
        case 26:
          var n = Qe;
          if ((ue(e, a), oe(a), l & 512 && (_a || t === null || lt(t, t.return)), l & 4)) {
            var i = t !== null ? t.memoizedState : null;
            if (((l = a.memoizedState), t === null))
              if (l === null)
                if (a.stateNode === null) {
                  a: {
                    ((l = a.type), (t = a.memoizedProps), (n = n.ownerDocument || n));
                    e: switch (l) {
                      case "title":
                        ((i = n.getElementsByTagName("title")[0]),
                          (!i ||
                            i[wi] ||
                            i[Za] ||
                            i.namespaceURI === "http://www.w3.org/2000/svg" ||
                            i.hasAttribute("itemprop")) &&
                            ((i = n.createElement(l)),
                            n.head.insertBefore(i, n.querySelector("head > title"))),
                          $a(i, l, t),
                          (i[Za] = a),
                          ja(i),
                          (l = i));
                        break a;
                      case "link":
                        var u = Ud("link", "href", n).get(l + (t.href || ""));
                        if (u) {
                          for (var o = 0; o < u.length; o++)
                            if (
                              ((i = u[o]),
                              i.getAttribute("href") ===
                                (t.href == null || t.href === "" ? null : t.href) &&
                                i.getAttribute("rel") === (t.rel == null ? null : t.rel) &&
                                i.getAttribute("title") === (t.title == null ? null : t.title) &&
                                i.getAttribute("crossorigin") ===
                                  (t.crossOrigin == null ? null : t.crossOrigin))
                            ) {
                              u.splice(o, 1);
                              break e;
                            }
                        }
                        ((i = n.createElement(l)), $a(i, l, t), n.head.appendChild(i));
                        break;
                      case "meta":
                        if ((u = Ud("meta", "content", n).get(l + (t.content || "")))) {
                          for (o = 0; o < u.length; o++)
                            if (
                              ((i = u[o]),
                              i.getAttribute("content") ===
                                (t.content == null ? null : "" + t.content) &&
                                i.getAttribute("name") === (t.name == null ? null : t.name) &&
                                i.getAttribute("property") ===
                                  (t.property == null ? null : t.property) &&
                                i.getAttribute("http-equiv") ===
                                  (t.httpEquiv == null ? null : t.httpEquiv) &&
                                i.getAttribute("charset") ===
                                  (t.charSet == null ? null : t.charSet))
                            ) {
                              u.splice(o, 1);
                              break e;
                            }
                        }
                        ((i = n.createElement(l)), $a(i, l, t), n.head.appendChild(i));
                        break;
                      default:
                        throw Error(z(468, l));
                    }
                    ((i[Za] = a), ja(i), (l = i));
                  }
                  a.stateNode = l;
                } else qd(n, a.type, a.stateNode);
              else a.stateNode = Ld(n, l, a.memoizedProps);
            else
              i !== l
                ? (i === null
                    ? t.stateNode !== null && ((t = t.stateNode), t.parentNode.removeChild(t))
                    : i.count--,
                  l === null ? qd(n, a.type, a.stateNode) : Ld(n, l, a.memoizedProps))
                : l === null && a.stateNode !== null && Tc(a, a.memoizedProps, t.memoizedProps);
          }
          break;
        case 27:
          (ue(e, a),
            oe(a),
            l & 512 && (_a || t === null || lt(t, t.return)),
            t !== null && l & 4 && Tc(a, a.memoizedProps, t.memoizedProps));
          break;
        case 5:
          if ((ue(e, a), oe(a), l & 512 && (_a || t === null || lt(t, t.return)), a.flags & 32)) {
            n = a.stateNode;
            try {
              hn(n, "");
            } catch (x) {
              ua(a, a.return, x);
            }
          }
          (l & 4 &&
            a.stateNode != null &&
            ((n = a.memoizedProps), Tc(a, n, t !== null ? t.memoizedProps : n)),
            l & 1024 && (Cc = !0));
          break;
        case 6:
          if ((ue(e, a), oe(a), l & 4)) {
            if (a.stateNode === null) throw Error(z(162));
            ((l = a.memoizedProps), (t = a.stateNode));
            try {
              t.nodeValue = l;
            } catch (x) {
              ua(a, a.return, x);
            }
          }
          break;
        case 3:
          if (
            ((wu = null),
            (n = Qe),
            (Qe = io(e.containerInfo)),
            ue(e, a),
            (Qe = n),
            oe(a),
            l & 4 && t !== null && t.memoizedState.isDehydrated)
          )
            try {
              Tn(e.containerInfo);
            } catch (x) {
              ua(a, a.return, x);
            }
          Cc && ((Cc = !1), Gp(a));
          break;
        case 4:
          ((l = Qe), (Qe = io(a.stateNode.containerInfo)), ue(e, a), oe(a), (Qe = l));
          break;
        case 12:
          (ue(e, a), oe(a));
          break;
        case 31:
          (ue(e, a),
            oe(a),
            l & 4 && ((l = a.updateQueue), l !== null && ((a.updateQueue = null), pu(a, l))));
          break;
        case 13:
          (ue(e, a),
            oe(a),
            a.child.flags & 8192 &&
              (a.memoizedState !== null) != (t !== null && t.memoizedState !== null) &&
              (zo = ze()),
            l & 4 && ((l = a.updateQueue), l !== null && ((a.updateQueue = null), pu(a, l))));
          break;
        case 22:
          n = a.memoizedState !== null;
          var c = t !== null && t.memoizedState !== null,
            d = St,
            g = _a;
          if (((St = d || n), (_a = g || c), ue(e, a), (_a = g), (St = d), oe(a), l & 8192))
            a: for (
              e = a.stateNode,
                e._visibility = n ? e._visibility & -2 : e._visibility | 1,
                n && (t === null || c || St || _a || Ml(a)),
                t = null,
                e = a;
              ;
            ) {
              if (e.tag === 5 || e.tag === 26) {
                if (t === null) {
                  c = t = e;
                  try {
                    if (((i = c.stateNode), n))
                      ((u = i.style),
                        typeof u.setProperty == "function"
                          ? u.setProperty("display", "none", "important")
                          : (u.display = "none"));
                    else {
                      o = c.stateNode;
                      var b = c.memoizedProps.style,
                        m = b != null && b.hasOwnProperty("display") ? b.display : null;
                      o.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
                    }
                  } catch (x) {
                    ua(c, c.return, x);
                  }
                }
              } else if (e.tag === 6) {
                if (t === null) {
                  c = e;
                  try {
                    c.stateNode.nodeValue = n ? "" : c.memoizedProps;
                  } catch (x) {
                    ua(c, c.return, x);
                  }
                }
              } else if (e.tag === 18) {
                if (t === null) {
                  c = e;
                  try {
                    var f = c.stateNode;
                    n ? Dd(f, !0) : Dd(c.stateNode, !1);
                  } catch (x) {
                    ua(c, c.return, x);
                  }
                }
              } else if (
                ((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === a) &&
                e.child !== null
              ) {
                ((e.child.return = e), (e = e.child));
                continue;
              }
              if (e === a) break a;
              for (; e.sibling === null;) {
                if (e.return === null || e.return === a) break a;
                (t === e && (t = null), (e = e.return));
              }
              (t === e && (t = null), (e.sibling.return = e.return), (e = e.sibling));
            }
          l & 4 &&
            ((l = a.updateQueue),
            l !== null && ((t = l.retryQueue), t !== null && ((l.retryQueue = null), pu(a, t))));
          break;
        case 19:
          (ue(e, a),
            oe(a),
            l & 4 && ((l = a.updateQueue), l !== null && ((a.updateQueue = null), pu(a, l))));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          (ue(e, a), oe(a));
      }
    }
    function oe(a) {
      var e = a.flags;
      if (e & 2) {
        try {
          for (var t, l = a.return; l !== null;) {
            if (kp(l)) {
              t = l;
              break;
            }
            l = l.return;
          }
          if (t == null) throw Error(z(160));
          switch (t.tag) {
            case 27:
              var n = t.stateNode,
                i = Ac(a);
              Fu(a, i, n);
              break;
            case 5:
              var u = t.stateNode;
              t.flags & 32 && (hn(u, ""), (t.flags &= -33));
              var o = Ac(a);
              Fu(a, o, u);
              break;
            case 3:
            case 4:
              var c = t.stateNode.containerInfo,
                d = Ac(a);
              gs(a, d, c);
              break;
            default:
              throw Error(z(161));
          }
        } catch (g) {
          ua(a, a.return, g);
        }
        a.flags &= -3;
      }
      e & 4096 && (a.flags &= -4097);
    }
    function Gp(a) {
      if (a.subtreeFlags & 1024)
        for (a = a.child; a !== null;) {
          var e = a;
          (Gp(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (a = a.sibling));
        }
    }
    function bt(a, e) {
      if (e.subtreeFlags & 8772)
        for (e = e.child; e !== null;) (Up(a, e.alternate, e), (e = e.sibling));
    }
    function Ml(a) {
      for (a = a.child; a !== null;) {
        var e = a;
        switch (e.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (ol(4, e, e.return), Ml(e));
            break;
          case 1:
            lt(e, e.return);
            var t = e.stateNode;
            (typeof t.componentWillUnmount == "function" && wp(e, e.return, t), Ml(e));
            break;
          case 27:
            mi(e.stateNode);
          case 26:
          case 5:
            (lt(e, e.return), Ml(e));
            break;
          case 22:
            e.memoizedState === null && Ml(e);
            break;
          case 30:
            Ml(e);
            break;
          default:
            Ml(e);
        }
        a = a.sibling;
      }
    }
    function ht(a, e, t) {
      for (t = t && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null;) {
        var l = e.alternate,
          n = a,
          i = e,
          u = i.flags;
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            (ht(n, i, t), Ui(4, i));
            break;
          case 1:
            if ((ht(n, i, t), (l = i), (n = l.stateNode), typeof n.componentDidMount == "function"))
              try {
                n.componentDidMount();
              } catch (d) {
                ua(l, l.return, d);
              }
            if (((l = i), (n = l.updateQueue), n !== null)) {
              var o = l.stateNode;
              try {
                var c = n.shared.hiddenCallbacks;
                if (c !== null)
                  for (n.shared.hiddenCallbacks = null, n = 0; n < c.length; n++) jm(c[n], o);
              } catch (d) {
                ua(l, l.return, d);
              }
            }
            (t && u & 64 && Rp(i), si(i, i.return));
            break;
          case 27:
            Lp(i);
          case 26:
          case 5:
            (ht(n, i, t), t && l === null && u & 4 && _p(i), si(i, i.return));
            break;
          case 12:
            ht(n, i, t);
            break;
          case 31:
            (ht(n, i, t), t && u & 4 && jp(n, i));
            break;
          case 13:
            (ht(n, i, t), t && u & 4 && Bp(n, i));
            break;
          case 22:
            (i.memoizedState === null && ht(n, i, t), si(i, i.return));
            break;
          case 30:
            break;
          default:
            ht(n, i, t);
        }
        e = e.sibling;
      }
    }
    function pr(a, e) {
      var t = null;
      (a !== null &&
        a.memoizedState !== null &&
        a.memoizedState.cachePool !== null &&
        (t = a.memoizedState.cachePool.pool),
        (a = null),
        e.memoizedState !== null &&
          e.memoizedState.cachePool !== null &&
          (a = e.memoizedState.cachePool.pool),
        a !== t && (a != null && a.refCount++, t != null && ki(t)));
    }
    function gr(a, e) {
      ((a = null),
        e.alternate !== null && (a = e.alternate.memoizedState.cache),
        (e = e.memoizedState.cache),
        e !== a && (e.refCount++, a != null && ki(a)));
    }
    function Xe(a, e, t, l) {
      if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (Xp(a, e, t, l), (e = e.sibling));
    }
    function Xp(a, e, t, l) {
      var n = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (Xe(a, e, t, l), n & 2048 && Ui(9, e));
          break;
        case 1:
          Xe(a, e, t, l);
          break;
        case 3:
          (Xe(a, e, t, l),
            n & 2048 &&
              ((a = null),
              e.alternate !== null && (a = e.alternate.memoizedState.cache),
              (e = e.memoizedState.cache),
              e !== a && (e.refCount++, a != null && ki(a))));
          break;
        case 12:
          if (n & 2048) {
            (Xe(a, e, t, l), (a = e.stateNode));
            try {
              var i = e.memoizedProps,
                u = i.id,
                o = i.onPostCommit;
              typeof o == "function" &&
                o(u, e.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
            } catch (c) {
              ua(e, e.return, c);
            }
          } else Xe(a, e, t, l);
          break;
        case 31:
          Xe(a, e, t, l);
          break;
        case 13:
          Xe(a, e, t, l);
          break;
        case 23:
          break;
        case 22:
          ((i = e.stateNode),
            (u = e.alternate),
            e.memoizedState !== null
              ? i._visibility & 2
                ? Xe(a, e, t, l)
                : ri(a, e)
              : i._visibility & 2
                ? Xe(a, e, t, l)
                : ((i._visibility |= 2), Jl(a, e, t, l, (e.subtreeFlags & 10256) !== 0 || !1)),
            n & 2048 && pr(u, e));
          break;
        case 24:
          (Xe(a, e, t, l), n & 2048 && gr(e.alternate, e));
          break;
        default:
          Xe(a, e, t, l);
      }
    }
    function Jl(a, e, t, l, n) {
      for (n = n && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null;) {
        var i = a,
          u = e,
          o = t,
          c = l,
          d = u.flags;
        switch (u.tag) {
          case 0:
          case 11:
          case 15:
            (Jl(i, u, o, c, n), Ui(8, u));
            break;
          case 23:
            break;
          case 22:
            var g = u.stateNode;
            (u.memoizedState !== null
              ? g._visibility & 2
                ? Jl(i, u, o, c, n)
                : ri(i, u)
              : ((g._visibility |= 2), Jl(i, u, o, c, n)),
              n && d & 2048 && pr(u.alternate, u));
            break;
          case 24:
            (Jl(i, u, o, c, n), n && d & 2048 && gr(u.alternate, u));
            break;
          default:
            Jl(i, u, o, c, n);
        }
        e = e.sibling;
      }
    }
    function ri(a, e) {
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null;) {
          var t = a,
            l = e,
            n = l.flags;
          switch (l.tag) {
            case 22:
              (ri(t, l), n & 2048 && pr(l.alternate, l));
              break;
            case 24:
              (ri(t, l), n & 2048 && gr(l.alternate, l));
              break;
            default:
              ri(t, l);
          }
          e = e.sibling;
        }
    }
    var ai = 8192;
    function Kl(a, e, t) {
      if (a.subtreeFlags & ai) for (a = a.child; a !== null;) (Qp(a, e, t), (a = a.sibling));
    }
    function Qp(a, e, t) {
      switch (a.tag) {
        case 26:
          (Kl(a, e, t),
            a.flags & ai &&
              a.memoizedState !== null &&
              Rh(t, Qe, a.memoizedState, a.memoizedProps));
          break;
        case 5:
          Kl(a, e, t);
          break;
        case 3:
        case 4:
          var l = Qe;
          ((Qe = io(a.stateNode.containerInfo)), Kl(a, e, t), (Qe = l));
          break;
        case 22:
          a.memoizedState === null &&
            ((l = a.alternate),
            l !== null && l.memoizedState !== null
              ? ((l = ai), (ai = 16777216), Kl(a, e, t), (ai = l))
              : Kl(a, e, t));
          break;
        default:
          Kl(a, e, t);
      }
    }
    function Vp(a) {
      var e = a.alternate;
      if (e !== null && ((a = e.child), a !== null)) {
        e.child = null;
        do ((e = a.sibling), (a.sibling = null), (a = e));
        while (a !== null);
      }
    }
    function Kn(a) {
      var e = a.deletions;
      if ((a.flags & 16) !== 0) {
        if (e !== null)
          for (var t = 0; t < e.length; t++) {
            var l = e[t];
            ((Ha = l), Kp(l, a));
          }
        Vp(a);
      }
      if (a.subtreeFlags & 10256) for (a = a.child; a !== null;) (Zp(a), (a = a.sibling));
    }
    function Zp(a) {
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          (Kn(a), a.flags & 2048 && ol(9, a, a.return));
          break;
        case 3:
          Kn(a);
          break;
        case 12:
          Kn(a);
          break;
        case 22:
          var e = a.stateNode;
          a.memoizedState !== null &&
          e._visibility & 2 &&
          (a.return === null || a.return.tag !== 13)
            ? ((e._visibility &= -3), Du(a))
            : Kn(a);
          break;
        default:
          Kn(a);
      }
    }
    function Du(a) {
      var e = a.deletions;
      if ((a.flags & 16) !== 0) {
        if (e !== null)
          for (var t = 0; t < e.length; t++) {
            var l = e[t];
            ((Ha = l), Kp(l, a));
          }
        Vp(a);
      }
      for (a = a.child; a !== null;) {
        switch (((e = a), e.tag)) {
          case 0:
          case 11:
          case 15:
            (ol(8, e, e.return), Du(e));
            break;
          case 22:
            ((t = e.stateNode), t._visibility & 2 && ((t._visibility &= -3), Du(e)));
            break;
          default:
            Du(e);
        }
        a = a.sibling;
      }
    }
    function Kp(a, e) {
      for (; Ha !== null;) {
        var t = Ha;
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            ol(8, t, e);
            break;
          case 23:
          case 22:
            if (t.memoizedState !== null && t.memoizedState.cachePool !== null) {
              var l = t.memoizedState.cachePool.pool;
              l != null && l.refCount++;
            }
            break;
          case 24:
            ki(t.memoizedState.cache);
        }
        if (((l = t.child), l !== null)) ((l.return = t), (Ha = l));
        else
          a: for (t = a; Ha !== null;) {
            l = Ha;
            var n = l.sibling,
              i = l.return;
            if ((qp(l), l === t)) {
              Ha = null;
              break a;
            }
            if (n !== null) {
              ((n.return = i), (Ha = n));
              break a;
            }
            Ha = i;
          }
      }
    }
    var Jb = {
        getCacheForType: function (a) {
          var e = Ja(ka),
            t = e.data.get(a);
          return (t === void 0 && ((t = a()), e.data.set(a, t)), t);
        },
        cacheSignal: function () {
          return Ja(ka).controller.signal;
        },
      },
      $b = typeof WeakMap == "function" ? WeakMap : Map,
      ta = 0,
      ra = null,
      W = null,
      I = 0,
      ia = 0,
      he = null,
      Kt = !1,
      Rn = !1,
      vr = !1,
      Rt = 0,
      Aa = 0,
      cl = 0,
      Cl = 0,
      br = 0,
      xe = 0,
      zn = 0,
      fi = null,
      se = null,
      vs = !1,
      zo = 0,
      Jp = 0,
      Iu = 1 / 0,
      Pu = null,
      al = null,
      Ua = 0,
      el = null,
      Mn = null,
      Tt = 0,
      bs = 0,
      hs = null,
      $p = null,
      di = 0,
      ys = null;
    function Ne() {
      return (ta & 2) !== 0 && I !== 0 ? I & -I : B.T !== null ? yr() : nm();
    }
    function Wp() {
      if (xe === 0)
        if ((I & 536870912) === 0 || P) {
          var a = nu;
          ((nu <<= 1), (nu & 3932160) === 0 && (nu = 262144), (xe = a));
        } else xe = 536870912;
      return ((a = Ae.current), a !== null && (a.flags |= 32), xe);
    }
    function re(a, e, t) {
      (((a === ra && (ia === 2 || ia === 9)) || a.cancelPendingCommit !== null) &&
        (En(a, 0), Jt(a, I, xe, !1)),
        Ri(a, t),
        ((ta & 2) === 0 || a !== ra) &&
          (a === ra && ((ta & 2) === 0 && (Cl |= t), Aa === 4 && Jt(a, I, xe, !1)), ut(a)));
    }
    function Fp(a, e, t) {
      if ((ta & 6) !== 0) throw Error(z(327));
      var l = (!t && (e & 127) === 0 && (e & a.expiredLanes) === 0) || Di(a, e),
        n = l ? Ib(a, e) : Oc(a, e, !0),
        i = l;
      do {
        if (n === 0) {
          Rn && !l && Jt(a, e, 0, !1);
          break;
        } else {
          if (((t = a.current.alternate), i && !Wb(t))) {
            ((n = Oc(a, e, !1)), (i = !1));
            continue;
          }
          if (n === 2) {
            if (((i = e), a.errorRecoveryDisabledLanes & i)) var u = 0;
            else
              ((u = a.pendingLanes & -536870913),
                (u = u !== 0 ? u : u & 536870912 ? 536870912 : 0));
            if (u !== 0) {
              e = u;
              a: {
                var o = a;
                n = fi;
                var c = o.current.memoizedState.isDehydrated;
                if ((c && (En(o, u).flags |= 256), (u = Oc(o, u, !1)), u !== 2)) {
                  if (vr && !c) {
                    ((o.errorRecoveryDisabledLanes |= i), (Cl |= i), (n = 4));
                    break a;
                  }
                  ((i = se),
                    (se = n),
                    i !== null && (se === null ? (se = i) : se.push.apply(se, i)));
                }
                n = u;
              }
              if (((i = !1), n !== 2)) continue;
            }
          }
          if (n === 1) {
            (En(a, 0), Jt(a, e, 0, !0));
            break;
          }
          a: {
            switch (((l = a), (i = n), i)) {
              case 0:
              case 1:
                throw Error(z(345));
              case 4:
                if ((e & 4194048) !== e) break;
              case 6:
                Jt(l, e, xe, !Kt);
                break a;
              case 2:
                se = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(z(329));
            }
            if ((e & 62914560) === e && ((n = zo + 300 - ze()), 10 < n)) {
              if ((Jt(l, e, xe, !Kt), ro(l, 0, !0) !== 0)) break a;
              ((Tt = e),
                (l.timeoutHandle = b0(
                  gd.bind(null, l, t, se, Pu, vs, e, xe, Cl, zn, Kt, i, "Throttled", -0, 0),
                  n,
                )));
              break a;
            }
            gd(l, t, se, Pu, vs, e, xe, Cl, zn, Kt, i, null, -0, 0);
          }
        }
        break;
      } while (!0);
      ut(a);
    }
    function gd(a, e, t, l, n, i, u, o, c, d, g, b, m, f) {
      if (((a.timeoutHandle = -1), (b = e.subtreeFlags), b & 8192 || (b & 16785408) === 16785408)) {
        ((b = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: zt,
        }),
          Qp(e, i, b));
        var x = (i & 62914560) === i ? zo - ze() : (i & 4194048) === i ? Jp - ze() : 0;
        if (((x = wh(b, x)), x !== null)) {
          ((Tt = i),
            (a.cancelPendingCommit = x(bd.bind(null, a, e, i, t, l, n, u, o, c, g, b, null, m, f))),
            Jt(a, i, u, !d));
          return;
        }
      }
      bd(a, e, i, t, l, n, u, o, c);
    }
    function Wb(a) {
      for (var e = a; ;) {
        var t = e.tag;
        if (
          (t === 0 || t === 11 || t === 15) &&
          e.flags & 16384 &&
          ((t = e.updateQueue), t !== null && ((t = t.stores), t !== null))
        )
          for (var l = 0; l < t.length; l++) {
            var n = t[l],
              i = n.getSnapshot;
            n = n.value;
            try {
              if (!Te(i(), n)) return !1;
            } catch {
              return !1;
            }
          }
        if (((t = e.child), e.subtreeFlags & 16384 && t !== null)) ((t.return = e), (e = t));
        else {
          if (e === a) break;
          for (; e.sibling === null;) {
            if (e.return === null || e.return === a) return !0;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      }
      return !0;
    }
    function Jt(a, e, t, l) {
      ((e &= ~br),
        (e &= ~Cl),
        (a.suspendedLanes |= e),
        (a.pingedLanes &= ~e),
        l && (a.warmLanes |= e),
        (l = a.expirationTimes));
      for (var n = e; 0 < n;) {
        var i = 31 - Ee(n),
          u = 1 << i;
        ((l[i] = -1), (n &= ~u));
      }
      t !== 0 && em(a, t, e);
    }
    function Mo() {
      return (ta & 6) === 0 ? (qi(0, !1), !1) : !0;
    }
    function hr() {
      if (W !== null) {
        if (ia === 0) var a = W.return;
        else ((a = W), (Mt = Hl = null), lr(a), (mn = null), (Si = 0), (a = W));
        for (; a !== null;) (Dp(a.alternate, a), (a = a.return));
        W = null;
      }
    }
    function En(a, e) {
      var t = a.timeoutHandle;
      (t !== -1 && ((a.timeoutHandle = -1), ph(t)),
        (t = a.cancelPendingCommit),
        t !== null && ((a.cancelPendingCommit = null), t()),
        (Tt = 0),
        hr(),
        (ra = a),
        (W = t = Et(a.current, null)),
        (I = e),
        (ia = 0),
        (he = null),
        (Kt = !1),
        (Rn = Di(a, e)),
        (vr = !1),
        (zn = xe = br = Cl = cl = Aa = 0),
        (se = fi = null),
        (vs = !1),
        (e & 8) !== 0 && (e |= e & 32));
      var l = a.entangledLanes;
      if (l !== 0)
        for (a = a.entanglements, l &= e; 0 < l;) {
          var n = 31 - Ee(l),
            i = 1 << n;
          ((e |= a[n]), (l &= ~i));
        }
      return ((Rt = e), go(), t);
    }
    function Ip(a, e) {
      ((Q = null),
        (B.H = zi),
        e === Dn || e === bo
          ? ((e = Kf()), (ia = 3))
          : e === Ws
            ? ((e = Kf()), (ia = 4))
            : (ia =
                e === dr
                  ? 8
                  : e !== null && typeof e == "object" && typeof e.then == "function"
                    ? 6
                    : 1),
        (he = e),
        W === null && ((Aa = 1), $u(a, Ue(e, a.current))));
    }
    function Pp() {
      var a = Ae.current;
      return a === null
        ? !0
        : (I & 4194048) === I
          ? He === null
          : (I & 62914560) === I || (I & 536870912) !== 0
            ? a === He
            : !1;
    }
    function a0() {
      var a = B.H;
      return ((B.H = zi), a === null ? zi : a);
    }
    function e0() {
      var a = B.A;
      return ((B.A = Jb), a);
    }
    function ao() {
      ((Aa = 4),
        Kt || ((I & 4194048) !== I && Ae.current !== null) || (Rn = !0),
        ((cl & 134217727) === 0 && (Cl & 134217727) === 0) || ra === null || Jt(ra, I, xe, !1));
    }
    function Oc(a, e, t) {
      var l = ta;
      ta |= 2;
      var n = a0(),
        i = e0();
      ((ra !== a || I !== e) && ((Pu = null), En(a, e)), (e = !1));
      var u = Aa;
      a: do
        try {
          if (ia !== 0 && W !== null) {
            var o = W,
              c = he;
            switch (ia) {
              case 8:
                (hr(), (u = 6));
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                Ae.current === null && (e = !0);
                var d = ia;
                if (((ia = 0), (he = null), cn(a, o, c, d), t && Rn)) {
                  u = 0;
                  break a;
                }
                break;
              default:
                ((d = ia), (ia = 0), (he = null), cn(a, o, c, d));
            }
          }
          (Fb(), (u = Aa));
          break;
        } catch (g) {
          Ip(a, g);
        }
      while (!0);
      return (
        e && a.shellSuspendCounter++,
        (Mt = Hl = null),
        (ta = l),
        (B.H = n),
        (B.A = i),
        W === null && ((ra = null), (I = 0), go()),
        u
      );
    }
    function Fb() {
      for (; W !== null;) t0(W);
    }
    function Ib(a, e) {
      var t = ta;
      ta |= 2;
      var l = a0(),
        n = e0();
      ra !== a || I !== e ? ((Pu = null), (Iu = ze() + 500), En(a, e)) : (Rn = Di(a, e));
      a: do
        try {
          if (ia !== 0 && W !== null) {
            e = W;
            var i = he;
            e: switch (ia) {
              case 1:
                ((ia = 0), (he = null), cn(a, e, i, 1));
                break;
              case 2:
              case 9:
                if (Zf(i)) {
                  ((ia = 0), (he = null), vd(e));
                  break;
                }
                ((e = function () {
                  ((ia !== 2 && ia !== 9) || ra !== a || (ia = 7), ut(a));
                }),
                  i.then(e, e));
                break a;
              case 3:
                ia = 7;
                break a;
              case 4:
                ia = 5;
                break a;
              case 7:
                Zf(i) ? ((ia = 0), (he = null), vd(e)) : ((ia = 0), (he = null), cn(a, e, i, 7));
                break;
              case 5:
                var u = null;
                switch (W.tag) {
                  case 26:
                    u = W.memoizedState;
                  case 5:
                  case 27:
                    var o = W;
                    if (u ? z0(u) : o.stateNode.complete) {
                      ((ia = 0), (he = null));
                      var c = o.sibling;
                      if (c !== null) W = c;
                      else {
                        var d = o.return;
                        d !== null ? ((W = d), Eo(d)) : (W = null);
                      }
                      break e;
                    }
                }
                ((ia = 0), (he = null), cn(a, e, i, 5));
                break;
              case 6:
                ((ia = 0), (he = null), cn(a, e, i, 6));
                break;
              case 8:
                (hr(), (Aa = 6));
                break a;
              default:
                throw Error(z(462));
            }
          }
          Pb();
          break;
        } catch (g) {
          Ip(a, g);
        }
      while (!0);
      return (
        (Mt = Hl = null),
        (B.H = l),
        (B.A = n),
        (ta = t),
        W !== null ? 0 : ((ra = null), (I = 0), go(), Aa)
      );
    }
    function Pb() {
      for (; W !== null && !zv();) t0(W);
    }
    function t0(a) {
      var e = Op(a.alternate, a, Rt);
      ((a.memoizedProps = a.pendingProps), e === null ? Eo(a) : (W = e));
    }
    function vd(a) {
      var e = a,
        t = e.alternate;
      switch (e.tag) {
        case 15:
        case 0:
          e = sd(t, e, e.pendingProps, e.type, void 0, I);
          break;
        case 11:
          e = sd(t, e, e.pendingProps, e.type.render, e.ref, I);
          break;
        case 5:
          lr(e);
        default:
          (Dp(t, e), (e = W = Dm(e, Rt)), (e = Op(t, e, Rt)));
      }
      ((a.memoizedProps = a.pendingProps), e === null ? Eo(a) : (W = e));
    }
    function cn(a, e, t, l) {
      ((Mt = Hl = null), lr(e), (mn = null), (Si = 0));
      var n = e.return;
      try {
        if (Yb(a, n, e, t, I)) {
          ((Aa = 1), $u(a, Ue(t, a.current)), (W = null));
          return;
        }
      } catch (i) {
        if (n !== null) throw ((W = n), i);
        ((Aa = 1), $u(a, Ue(t, a.current)), (W = null));
        return;
      }
      e.flags & 32768
        ? (P || l === 1
            ? (a = !0)
            : Rn || (I & 536870912) !== 0
              ? (a = !1)
              : ((Kt = a = !0),
                (l === 2 || l === 9 || l === 3 || l === 6) &&
                  ((l = Ae.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
          l0(e, a))
        : Eo(e);
    }
    function Eo(a) {
      var e = a;
      do {
        if ((e.flags & 32768) !== 0) {
          l0(e, Kt);
          return;
        }
        a = e.return;
        var t = Qb(e.alternate, e, Rt);
        if (t !== null) {
          W = t;
          return;
        }
        if (((e = e.sibling), e !== null)) {
          W = e;
          return;
        }
        W = e = a;
      } while (e !== null);
      Aa === 0 && (Aa = 5);
    }
    function l0(a, e) {
      do {
        var t = Vb(a.alternate, a);
        if (t !== null) {
          ((t.flags &= 32767), (W = t));
          return;
        }
        if (
          ((t = a.return),
          t !== null && ((t.flags |= 32768), (t.subtreeFlags = 0), (t.deletions = null)),
          !e && ((a = a.sibling), a !== null))
        ) {
          W = a;
          return;
        }
        W = a = t;
      } while (a !== null);
      ((Aa = 6), (W = null));
    }
    function bd(a, e, t, l, n, i, u, o, c) {
      a.cancelPendingCommit = null;
      do No();
      while (Ua !== 0);
      if ((ta & 6) !== 0) throw Error(z(327));
      if (e !== null) {
        if (e === a.current) throw Error(z(177));
        if (
          ((i = e.lanes | e.childLanes),
          (i |= Xs),
          wv(a, t, i, u, o, c),
          a === ra && ((W = ra = null), (I = 0)),
          (Mn = e),
          (el = a),
          (Tt = t),
          (bs = i),
          (hs = n),
          ($p = l),
          (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
            ? ((a.callbackNode = null),
              (a.callbackPriority = 0),
              lh(Hu, function () {
                return (c0(), null);
              }))
            : ((a.callbackNode = null), (a.callbackPriority = 0)),
          (l = (e.flags & 13878) !== 0),
          (e.subtreeFlags & 13878) !== 0 || l)
        ) {
          ((l = B.T), (B.T = null), (n = la.p), (la.p = 2), (u = ta), (ta |= 4));
          try {
            Zb(a, e, t);
          } finally {
            ((ta = u), (la.p = n), (B.T = l));
          }
        }
        ((Ua = 1), n0(), i0(), u0());
      }
    }
    function n0() {
      if (Ua === 1) {
        Ua = 0;
        var a = el,
          e = Mn,
          t = (e.flags & 13878) !== 0;
        if ((e.subtreeFlags & 13878) !== 0 || t) {
          ((t = B.T), (B.T = null));
          var l = la.p;
          la.p = 2;
          var n = ta;
          ta |= 4;
          try {
            Yp(e, a);
            var i = Ms,
              u = zm(a.containerInfo),
              o = i.focusedElem,
              c = i.selectionRange;
            if (u !== o && o && o.ownerDocument && xm(o.ownerDocument.documentElement, o)) {
              if (c !== null && Gs(o)) {
                var d = c.start,
                  g = c.end;
                if ((g === void 0 && (g = d), "selectionStart" in o))
                  ((o.selectionStart = d), (o.selectionEnd = Math.min(g, o.value.length)));
                else {
                  var b = o.ownerDocument || document,
                    m = (b && b.defaultView) || window;
                  if (m.getSelection) {
                    var f = m.getSelection(),
                      x = o.textContent.length,
                      S = Math.min(c.start, x),
                      T = c.end === void 0 ? S : Math.min(c.end, x);
                    !f.extend && S > T && ((u = T), (T = S), (S = u));
                    var s = jf(o, S),
                      r = jf(o, T);
                    if (
                      s &&
                      r &&
                      (f.rangeCount !== 1 ||
                        f.anchorNode !== s.node ||
                        f.anchorOffset !== s.offset ||
                        f.focusNode !== r.node ||
                        f.focusOffset !== r.offset)
                    ) {
                      var p = b.createRange();
                      (p.setStart(s.node, s.offset),
                        f.removeAllRanges(),
                        S > T
                          ? (f.addRange(p), f.extend(r.node, r.offset))
                          : (p.setEnd(r.node, r.offset), f.addRange(p)));
                    }
                  }
                }
              }
              for (b = [], f = o; (f = f.parentNode);)
                f.nodeType === 1 && b.push({ element: f, left: f.scrollLeft, top: f.scrollTop });
              for (typeof o.focus == "function" && o.focus(), o = 0; o < b.length; o++) {
                var y = b[o];
                ((y.element.scrollLeft = y.left), (y.element.scrollTop = y.top));
              }
            }
            ((co = !!zs), (Ms = zs = null));
          } finally {
            ((ta = n), (la.p = l), (B.T = t));
          }
        }
        ((a.current = e), (Ua = 2));
      }
    }
    function i0() {
      if (Ua === 2) {
        Ua = 0;
        var a = el,
          e = Mn,
          t = (e.flags & 8772) !== 0;
        if ((e.subtreeFlags & 8772) !== 0 || t) {
          ((t = B.T), (B.T = null));
          var l = la.p;
          la.p = 2;
          var n = ta;
          ta |= 4;
          try {
            Up(a, e.alternate, e);
          } finally {
            ((ta = n), (la.p = l), (B.T = t));
          }
        }
        Ua = 3;
      }
    }
    function u0() {
      if (Ua === 4 || Ua === 3) {
        ((Ua = 0), Mv());
        var a = el,
          e = Mn,
          t = Tt,
          l = $p;
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? (Ua = 5)
          : ((Ua = 0), (Mn = el = null), o0(a, a.pendingLanes));
        var n = a.pendingLanes;
        if (
          (n === 0 && (al = null),
          Ls(t),
          (e = e.stateNode),
          Me && typeof Me.onCommitFiberRoot == "function")
        )
          try {
            Me.onCommitFiberRoot(Oi, e, void 0, (e.current.flags & 128) === 128);
          } catch {}
        if (l !== null) {
          ((e = B.T), (n = la.p), (la.p = 2), (B.T = null));
          try {
            for (var i = a.onRecoverableError, u = 0; u < l.length; u++) {
              var o = l[u];
              i(o.value, { componentStack: o.stack });
            }
          } finally {
            ((B.T = e), (la.p = n));
          }
        }
        ((Tt & 3) !== 0 && No(),
          ut(a),
          (n = a.pendingLanes),
          (t & 261930) !== 0 && (n & 42) !== 0
            ? a === ys
              ? di++
              : ((di = 0), (ys = a))
            : (di = 0),
          qi(0, !1));
      }
    }
    function o0(a, e) {
      (a.pooledCacheLanes &= e) === 0 &&
        ((e = a.pooledCache), e != null && ((a.pooledCache = null), ki(e)));
    }
    function No() {
      return (n0(), i0(), u0(), c0());
    }
    function c0() {
      if (Ua !== 5) return !1;
      var a = el,
        e = bs;
      bs = 0;
      var t = Ls(Tt),
        l = B.T,
        n = la.p;
      try {
        ((la.p = 32 > t ? 32 : t), (B.T = null), (t = hs), (hs = null));
        var i = el,
          u = Tt;
        if (((Ua = 0), (Mn = el = null), (Tt = 0), (ta & 6) !== 0)) throw Error(z(331));
        var o = ta;
        if (
          ((ta |= 4),
          Zp(i.current),
          Xp(i, i.current, u, t),
          (ta = o),
          qi(0, !1),
          Me && typeof Me.onPostCommitFiberRoot == "function")
        )
          try {
            Me.onPostCommitFiberRoot(Oi, i);
          } catch {}
        return !0;
      } finally {
        ((la.p = n), (B.T = l), o0(a, e));
      }
    }
    function hd(a, e, t) {
      ((e = Ue(t, e)),
        (e = ds(a.stateNode, e, 2)),
        (a = Pt(a, e, 2)),
        a !== null && (Ri(a, 2), ut(a)));
    }
    function ua(a, e, t) {
      if (a.tag === 3) hd(a, a, t);
      else
        for (; e !== null;) {
          if (e.tag === 3) {
            hd(e, a, t);
            break;
          } else if (e.tag === 1) {
            var l = e.stateNode;
            if (
              typeof e.type.getDerivedStateFromError == "function" ||
              (typeof l.componentDidCatch == "function" && (al === null || !al.has(l)))
            ) {
              ((a = Ue(t, a)),
                (t = Mp(2)),
                (l = Pt(e, t, 2)),
                l !== null && (Ep(t, l, e, a), Ri(l, 2), ut(l)));
              break;
            }
          }
          e = e.return;
        }
    }
    function Dc(a, e, t) {
      var l = a.pingCache;
      if (l === null) {
        l = a.pingCache = new $b();
        var n = new Set();
        l.set(e, n);
      } else ((n = l.get(e)), n === void 0 && ((n = new Set()), l.set(e, n)));
      n.has(t) || ((vr = !0), n.add(t), (a = ah.bind(null, a, e, t)), e.then(a, a));
    }
    function ah(a, e, t) {
      var l = a.pingCache;
      (l !== null && l.delete(e),
        (a.pingedLanes |= a.suspendedLanes & t),
        (a.warmLanes &= ~t),
        ra === a &&
          (I & t) === t &&
          (Aa === 4 || (Aa === 3 && (I & 62914560) === I && 300 > ze() - zo)
            ? (ta & 2) === 0 && En(a, 0)
            : (br |= t),
          zn === I && (zn = 0)),
        ut(a));
    }
    function s0(a, e) {
      (e === 0 && (e = am()), (a = ql(a, e)), a !== null && (Ri(a, e), ut(a)));
    }
    function eh(a) {
      var e = a.memoizedState,
        t = 0;
      (e !== null && (t = e.retryLane), s0(a, t));
    }
    function th(a, e) {
      var t = 0;
      switch (a.tag) {
        case 31:
        case 13:
          var l = a.stateNode,
            n = a.memoizedState;
          n !== null && (t = n.retryLane);
          break;
        case 19:
          l = a.stateNode;
          break;
        case 22:
          l = a.stateNode._retryCache;
          break;
        default:
          throw Error(z(314));
      }
      (l !== null && l.delete(e), s0(a, t));
    }
    function lh(a, e) {
      return _s(a, e);
    }
    var eo = null,
      $l = null,
      Ss = !1,
      to = !1,
      Rc = !1,
      $t = 0;
    function ut(a) {
      (a !== $l && a.next === null && ($l === null ? (eo = $l = a) : ($l = $l.next = a)),
        (to = !0),
        Ss || ((Ss = !0), ih()));
    }
    function qi(a, e) {
      if (!Rc && to) {
        Rc = !0;
        do
          for (var t = !1, l = eo; l !== null;) {
            if (!e)
              if (a !== 0) {
                var n = l.pendingLanes;
                if (n === 0) var i = 0;
                else {
                  var u = l.suspendedLanes,
                    o = l.pingedLanes;
                  ((i = (1 << (31 - Ee(42 | a) + 1)) - 1),
                    (i &= n & ~(u & ~o)),
                    (i = i & 201326741 ? (i & 201326741) | 1 : i ? i | 2 : 0));
                }
                i !== 0 && ((t = !0), yd(l, i));
              } else
                ((i = I),
                  (i = ro(
                    l,
                    l === ra ? i : 0,
                    l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
                  )),
                  (i & 3) === 0 || Di(l, i) || ((t = !0), yd(l, i)));
            l = l.next;
          }
        while (t);
        Rc = !1;
      }
    }
    function nh() {
      r0();
    }
    function r0() {
      to = Ss = !1;
      var a = 0;
      $t !== 0 && mh() && (a = $t);
      for (var e = ze(), t = null, l = eo; l !== null;) {
        var n = l.next,
          i = f0(l, e);
        (i === 0
          ? ((l.next = null), t === null ? (eo = n) : (t.next = n), n === null && ($l = t))
          : ((t = l), (a !== 0 || (i & 3) !== 0) && (to = !0)),
          (l = n));
      }
      ((Ua !== 0 && Ua !== 5) || qi(a, !1), $t !== 0 && ($t = 0));
    }
    function f0(a, e) {
      for (
        var t = a.suspendedLanes,
          l = a.pingedLanes,
          n = a.expirationTimes,
          i = a.pendingLanes & -62914561;
        0 < i;
      ) {
        var u = 31 - Ee(i),
          o = 1 << u,
          c = n[u];
        (c === -1
          ? ((o & t) === 0 || (o & l) !== 0) && (n[u] = Rv(o, e))
          : c <= e && (a.expiredLanes |= o),
          (i &= ~o));
      }
      if (
        ((e = ra),
        (t = I),
        (t = ro(a, a === e ? t : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1)),
        (l = a.callbackNode),
        t === 0 || (a === e && (ia === 2 || ia === 9)) || a.cancelPendingCommit !== null)
      )
        return (
          l !== null && l !== null && uc(l),
          (a.callbackNode = null),
          (a.callbackPriority = 0)
        );
      if ((t & 3) === 0 || Di(a, t)) {
        if (((e = t & -t), e === a.callbackPriority)) return e;
        switch ((l !== null && uc(l), Ls(t))) {
          case 2:
          case 8:
            t = Id;
            break;
          case 32:
            t = Hu;
            break;
          case 268435456:
            t = Pd;
            break;
          default:
            t = Hu;
        }
        return (
          (l = d0.bind(null, a)),
          (t = _s(t, l)),
          (a.callbackPriority = e),
          (a.callbackNode = t),
          e
        );
      }
      return (
        l !== null && l !== null && uc(l),
        (a.callbackPriority = 2),
        (a.callbackNode = null),
        2
      );
    }
    function d0(a, e) {
      if (Ua !== 0 && Ua !== 5) return ((a.callbackNode = null), (a.callbackPriority = 0), null);
      var t = a.callbackNode;
      if (No() && a.callbackNode !== t) return null;
      var l = I;
      return (
        (l = ro(a, a === ra ? l : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1)),
        l === 0
          ? null
          : (Fp(a, l, e),
            f0(a, ze()),
            a.callbackNode != null && a.callbackNode === t ? d0.bind(null, a) : null)
      );
    }
    function yd(a, e) {
      if (No()) return null;
      Fp(a, e, !0);
    }
    function ih() {
      gh(function () {
        (ta & 6) !== 0 ? _s(Fd, nh) : r0();
      });
    }
    function yr() {
      if ($t === 0) {
        var a = yn;
        (a === 0 && ((a = lu), (lu <<= 1), (lu & 261888) === 0 && (lu = 256)), ($t = a));
      }
      return $t;
    }
    function Sd(a) {
      return a == null || typeof a == "symbol" || typeof a == "boolean"
        ? null
        : typeof a == "function"
          ? a
          : xu("" + a);
    }
    function xd(a, e) {
      var t = e.ownerDocument.createElement("input");
      return (
        (t.name = e.name),
        (t.value = e.value),
        a.id && t.setAttribute("form", a.id),
        e.parentNode.insertBefore(t, e),
        (a = new FormData(a)),
        t.parentNode.removeChild(t),
        a
      );
    }
    function uh(a, e, t, l, n) {
      if (e === "submit" && t && t.stateNode === n) {
        var i = Sd((n[fe] || null).action),
          u = l.submitter;
        u &&
          ((e = (e = u[fe] || null) ? Sd(e.formAction) : u.getAttribute("formAction")),
          e !== null && ((i = e), (u = null)));
        var o = new fo("action", "action", null, l, n);
        a.push({
          event: o,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (l.defaultPrevented) {
                  if ($t !== 0) {
                    var c = u ? xd(n, u) : new FormData(n);
                    rs(t, { pending: !0, data: c, method: n.method, action: i }, null, c);
                  }
                } else
                  typeof i == "function" &&
                    (o.preventDefault(),
                    (c = u ? xd(n, u) : new FormData(n)),
                    rs(t, { pending: !0, data: c, method: n.method, action: i }, i, c));
              },
              currentTarget: n,
            },
          ],
        });
      }
    }
    for (gu = 0; gu < Ic.length; gu++)
      ((vu = Ic[gu]),
        (zd = vu.toLowerCase()),
        (Md = vu[0].toUpperCase() + vu.slice(1)),
        Ve(zd, "on" + Md));
    var vu, zd, Md, gu;
    Ve(Em, "onAnimationEnd");
    Ve(Nm, "onAnimationIteration");
    Ve(Tm, "onAnimationStart");
    Ve("dblclick", "onDoubleClick");
    Ve("focusin", "onFocus");
    Ve("focusout", "onBlur");
    Ve(Eb, "onTransitionRun");
    Ve(Nb, "onTransitionStart");
    Ve(Tb, "onTransitionCancel");
    Ve(Am, "onTransitionEnd");
    bn("onMouseEnter", ["mouseout", "mouseover"]);
    bn("onMouseLeave", ["mouseout", "mouseover"]);
    bn("onPointerEnter", ["pointerout", "pointerover"]);
    bn("onPointerLeave", ["pointerout", "pointerover"]);
    kl("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
    kl(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    );
    kl("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
    kl("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
    kl(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    );
    kl(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    );
    var Mi =
        "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
          " ",
        ),
      oh = new Set(
        "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Mi),
      );
    function m0(a, e) {
      e = (e & 4) !== 0;
      for (var t = 0; t < a.length; t++) {
        var l = a[t],
          n = l.event;
        l = l.listeners;
        a: {
          var i = void 0;
          if (e)
            for (var u = l.length - 1; 0 <= u; u--) {
              var o = l[u],
                c = o.instance,
                d = o.currentTarget;
              if (((o = o.listener), c !== i && n.isPropagationStopped())) break a;
              ((i = o), (n.currentTarget = d));
              try {
                i(n);
              } catch (g) {
                Bu(g);
              }
              ((n.currentTarget = null), (i = c));
            }
          else
            for (u = 0; u < l.length; u++) {
              if (
                ((o = l[u]),
                (c = o.instance),
                (d = o.currentTarget),
                (o = o.listener),
                c !== i && n.isPropagationStopped())
              )
                break a;
              ((i = o), (n.currentTarget = d));
              try {
                i(n);
              } catch (g) {
                Bu(g);
              }
              ((n.currentTarget = null), (i = c));
            }
        }
      }
    }
    function $(a, e) {
      var t = e[Qc];
      t === void 0 && (t = e[Qc] = new Set());
      var l = a + "__bubble";
      t.has(l) || (p0(e, a, 2, !1), t.add(l));
    }
    function wc(a, e, t) {
      var l = 0;
      (e && (l |= 4), p0(t, a, l, e));
    }
    var bu = "_reactListening" + Math.random().toString(36).slice(2);
    function Sr(a) {
      if (!a[bu]) {
        ((a[bu] = !0),
          im.forEach(function (t) {
            t !== "selectionchange" && (oh.has(t) || wc(t, !1, a), wc(t, !0, a));
          }));
        var e = a.nodeType === 9 ? a : a.ownerDocument;
        e === null || e[bu] || ((e[bu] = !0), wc("selectionchange", !1, e));
      }
    }
    function p0(a, e, t, l) {
      switch (A0(e)) {
        case 2:
          var n = Lh;
          break;
        case 8:
          n = Uh;
          break;
        default:
          n = Er;
      }
      ((t = n.bind(null, e, t, a)),
        (n = void 0),
        !$c || (e !== "touchstart" && e !== "touchmove" && e !== "wheel") || (n = !0),
        l
          ? n !== void 0
            ? a.addEventListener(e, t, { capture: !0, passive: n })
            : a.addEventListener(e, t, !0)
          : n !== void 0
            ? a.addEventListener(e, t, { passive: n })
            : a.addEventListener(e, t, !1));
    }
    function _c(a, e, t, l, n) {
      var i = l;
      if ((e & 1) === 0 && (e & 2) === 0 && l !== null)
        a: for (;;) {
          if (l === null) return;
          var u = l.tag;
          if (u === 3 || u === 4) {
            var o = l.stateNode.containerInfo;
            if (o === n) break;
            if (u === 4)
              for (u = l.return; u !== null;) {
                var c = u.tag;
                if ((c === 3 || c === 4) && u.stateNode.containerInfo === n) return;
                u = u.return;
              }
            for (; o !== null;) {
              if (((u = Il(o)), u === null)) return;
              if (((c = u.tag), c === 5 || c === 6 || c === 26 || c === 27)) {
                l = i = u;
                continue a;
              }
              o = o.parentNode;
            }
          }
          l = l.return;
        }
      mm(function () {
        var d = i,
          g = Hs(t),
          b = [];
        a: {
          var m = Cm.get(a);
          if (m !== void 0) {
            var f = fo,
              x = a;
            switch (a) {
              case "keypress":
                if (Mu(t) === 0) break a;
              case "keydown":
              case "keyup":
                f = tb;
                break;
              case "focusin":
                ((x = "focus"), (f = fc));
                break;
              case "focusout":
                ((x = "blur"), (f = fc));
                break;
              case "beforeblur":
              case "afterblur":
                f = fc;
                break;
              case "click":
                if (t.button === 2) break a;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                f = Df;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                f = Qv;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                f = ib;
                break;
              case Em:
              case Nm:
              case Tm:
                f = Kv;
                break;
              case Am:
                f = ob;
                break;
              case "scroll":
              case "scrollend":
                f = Gv;
                break;
              case "wheel":
                f = sb;
                break;
              case "copy":
              case "cut":
              case "paste":
                f = $v;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                f = wf;
                break;
              case "toggle":
              case "beforetoggle":
                f = fb;
            }
            var S = (e & 4) !== 0,
              T = !S && (a === "scroll" || a === "scrollend"),
              s = S ? (m !== null ? m + "Capture" : null) : m;
            S = [];
            for (var r = d, p; r !== null;) {
              var y = r;
              if (
                ((p = y.stateNode),
                (y = y.tag),
                (y !== 5 && y !== 26 && y !== 27) ||
                  p === null ||
                  s === null ||
                  ((y = gi(r, s)), y != null && S.push(Ei(r, y, p))),
                T)
              )
                break;
              r = r.return;
            }
            0 < S.length && ((m = new f(m, x, null, t, g)), b.push({ event: m, listeners: S }));
          }
        }
        if ((e & 7) === 0) {
          a: {
            if (
              ((m = a === "mouseover" || a === "pointerover"),
              (f = a === "mouseout" || a === "pointerout"),
              m && t !== Jc && (x = t.relatedTarget || t.fromElement) && (Il(x) || x[An]))
            )
              break a;
            if (
              (f || m) &&
              ((m =
                g.window === g
                  ? g
                  : (m = g.ownerDocument)
                    ? m.defaultView || m.parentWindow
                    : window),
              f
                ? ((x = t.relatedTarget || t.toElement),
                  (f = d),
                  (x = x ? Il(x) : null),
                  x !== null &&
                    ((T = Ci(x)), (S = x.tag), x !== T || (S !== 5 && S !== 27 && S !== 6)) &&
                    (x = null))
                : ((f = null), (x = d)),
              f !== x)
            ) {
              if (
                ((S = Df),
                (y = "onMouseLeave"),
                (s = "onMouseEnter"),
                (r = "mouse"),
                (a === "pointerout" || a === "pointerover") &&
                  ((S = wf), (y = "onPointerLeave"), (s = "onPointerEnter"), (r = "pointer")),
                (T = f == null ? m : In(f)),
                (p = x == null ? m : In(x)),
                (m = new S(y, r + "leave", f, t, g)),
                (m.target = T),
                (m.relatedTarget = p),
                (y = null),
                Il(g) === d &&
                  ((S = new S(s, r + "enter", x, t, g)),
                  (S.target = p),
                  (S.relatedTarget = T),
                  (y = S)),
                (T = y),
                f && x)
              )
                e: {
                  for (S = ch, s = f, r = x, p = 0, y = s; y; y = S(y)) p++;
                  y = 0;
                  for (var N = r; N; N = S(N)) y++;
                  for (; 0 < p - y;) ((s = S(s)), p--);
                  for (; 0 < y - p;) ((r = S(r)), y--);
                  for (; p--;) {
                    if (s === r || (r !== null && s === r.alternate)) {
                      S = s;
                      break e;
                    }
                    ((s = S(s)), (r = S(r)));
                  }
                  S = null;
                }
              else S = null;
              (f !== null && Ed(b, m, f, S, !1), x !== null && T !== null && Ed(b, T, x, S, !0));
            }
          }
          a: {
            if (
              ((m = d ? In(d) : window),
              (f = m.nodeName && m.nodeName.toLowerCase()),
              f === "select" || (f === "input" && m.type === "file"))
            )
              var R = Uf;
            else if (Lf(m))
              if (ym) R = xb;
              else {
                R = yb;
                var A = hb;
              }
            else
              ((f = m.nodeName),
                !f || f.toLowerCase() !== "input" || (m.type !== "checkbox" && m.type !== "radio")
                  ? d && qs(d.elementType) && (R = Uf)
                  : (R = Sb));
            if (R && (R = R(a, d))) {
              hm(b, R, t, g);
              break a;
            }
            (A && A(a, m, d),
              a === "focusout" &&
                d &&
                m.type === "number" &&
                d.memoizedProps.value != null &&
                Kc(m, "number", m.value));
          }
          switch (((A = d ? In(d) : window), a)) {
            case "focusin":
              (Lf(A) || A.contentEditable === "true") && ((en = A), (Wc = d), (li = null));
              break;
            case "focusout":
              li = Wc = en = null;
              break;
            case "mousedown":
              Fc = !0;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              ((Fc = !1), Bf(b, t, g));
              break;
            case "selectionchange":
              if (Mb) break;
            case "keydown":
            case "keyup":
              Bf(b, t, g);
          }
          var _;
          if (Ys)
            a: {
              switch (a) {
                case "compositionstart":
                  var U = "onCompositionStart";
                  break a;
                case "compositionend":
                  U = "onCompositionEnd";
                  break a;
                case "compositionupdate":
                  U = "onCompositionUpdate";
                  break a;
              }
              U = void 0;
            }
          else
            an
              ? vm(a, t) && (U = "onCompositionEnd")
              : a === "keydown" && t.keyCode === 229 && (U = "onCompositionStart");
          (U &&
            (gm &&
              t.locale !== "ko" &&
              (an || U !== "onCompositionStart"
                ? U === "onCompositionEnd" && an && (_ = pm())
                : ((Zt = g), (js = "value" in Zt ? Zt.value : Zt.textContent), (an = !0))),
            (A = lo(d, U)),
            0 < A.length &&
              ((U = new Rf(U, a, null, t, g)),
              b.push({ event: U, listeners: A }),
              _ ? (U.data = _) : ((_ = bm(t)), _ !== null && (U.data = _)))),
            (_ = mb ? pb(a, t) : gb(a, t)) &&
              ((U = lo(d, "onBeforeInput")),
              0 < U.length &&
                ((A = new Rf("onBeforeInput", "beforeinput", null, t, g)),
                b.push({ event: A, listeners: U }),
                (A.data = _))),
            uh(b, a, d, t, g));
        }
        m0(b, e);
      });
    }
    function Ei(a, e, t) {
      return { instance: a, listener: e, currentTarget: t };
    }
    function lo(a, e) {
      for (var t = e + "Capture", l = []; a !== null;) {
        var n = a,
          i = n.stateNode;
        if (
          ((n = n.tag),
          (n !== 5 && n !== 26 && n !== 27) ||
            i === null ||
            ((n = gi(a, t)),
            n != null && l.unshift(Ei(a, n, i)),
            (n = gi(a, e)),
            n != null && l.push(Ei(a, n, i))),
          a.tag === 3)
        )
          return l;
        a = a.return;
      }
      return [];
    }
    function ch(a) {
      if (a === null) return null;
      do a = a.return;
      while (a && a.tag !== 5 && a.tag !== 27);
      return a || null;
    }
    function Ed(a, e, t, l, n) {
      for (var i = e._reactName, u = []; t !== null && t !== l;) {
        var o = t,
          c = o.alternate,
          d = o.stateNode;
        if (((o = o.tag), c !== null && c === l)) break;
        ((o !== 5 && o !== 26 && o !== 27) ||
          d === null ||
          ((c = d),
          n
            ? ((d = gi(t, i)), d != null && u.unshift(Ei(t, d, c)))
            : n || ((d = gi(t, i)), d != null && u.push(Ei(t, d, c)))),
          (t = t.return));
      }
      u.length !== 0 && a.push({ event: e, listeners: u });
    }
    var sh = /\r\n?/g,
      rh = /\u0000|\uFFFD/g;
    function Nd(a) {
      return (typeof a == "string" ? a : "" + a)
        .replace(
          sh,
          `
`,
        )
        .replace(rh, "");
    }
    function g0(a, e) {
      return ((e = Nd(e)), Nd(a) === e);
    }
    function ca(a, e, t, l, n, i) {
      switch (t) {
        case "children":
          typeof l == "string"
            ? e === "body" || (e === "textarea" && l === "") || hn(a, l)
            : (typeof l == "number" || typeof l == "bigint") && e !== "body" && hn(a, "" + l);
          break;
        case "className":
          uu(a, "class", l);
          break;
        case "tabIndex":
          uu(a, "tabindex", l);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          uu(a, t, l);
          break;
        case "style":
          dm(a, l, i);
          break;
        case "data":
          if (e !== "object") {
            uu(a, "data", l);
            break;
          }
        case "src":
        case "href":
          if (l === "" && (e !== "a" || t !== "href")) {
            a.removeAttribute(t);
            break;
          }
          if (
            l == null ||
            typeof l == "function" ||
            typeof l == "symbol" ||
            typeof l == "boolean"
          ) {
            a.removeAttribute(t);
            break;
          }
          ((l = xu("" + l)), a.setAttribute(t, l));
          break;
        case "action":
        case "formAction":
          if (typeof l == "function") {
            a.setAttribute(
              t,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
            );
            break;
          } else
            typeof i == "function" &&
              (t === "formAction"
                ? (e !== "input" && ca(a, e, "name", n.name, n, null),
                  ca(a, e, "formEncType", n.formEncType, n, null),
                  ca(a, e, "formMethod", n.formMethod, n, null),
                  ca(a, e, "formTarget", n.formTarget, n, null))
                : (ca(a, e, "encType", n.encType, n, null),
                  ca(a, e, "method", n.method, n, null),
                  ca(a, e, "target", n.target, n, null)));
          if (l == null || typeof l == "symbol" || typeof l == "boolean") {
            a.removeAttribute(t);
            break;
          }
          ((l = xu("" + l)), a.setAttribute(t, l));
          break;
        case "onClick":
          l != null && (a.onclick = zt);
          break;
        case "onScroll":
          l != null && $("scroll", a);
          break;
        case "onScrollEnd":
          l != null && $("scrollend", a);
          break;
        case "dangerouslySetInnerHTML":
          if (l != null) {
            if (typeof l != "object" || !("__html" in l)) throw Error(z(61));
            if (((t = l.__html), t != null)) {
              if (n.children != null) throw Error(z(60));
              a.innerHTML = t;
            }
          }
          break;
        case "multiple":
          a.multiple = l && typeof l != "function" && typeof l != "symbol";
          break;
        case "muted":
          a.muted = l && typeof l != "function" && typeof l != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (
            l == null ||
            typeof l == "function" ||
            typeof l == "boolean" ||
            typeof l == "symbol"
          ) {
            a.removeAttribute("xlink:href");
            break;
          }
          ((t = xu("" + l)), a.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", t));
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          l != null && typeof l != "function" && typeof l != "symbol"
            ? a.setAttribute(t, "" + l)
            : a.removeAttribute(t);
          break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          l && typeof l != "function" && typeof l != "symbol"
            ? a.setAttribute(t, "")
            : a.removeAttribute(t);
          break;
        case "capture":
        case "download":
          l === !0
            ? a.setAttribute(t, "")
            : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol"
              ? a.setAttribute(t, l)
              : a.removeAttribute(t);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l
            ? a.setAttribute(t, l)
            : a.removeAttribute(t);
          break;
        case "rowSpan":
        case "start":
          l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l)
            ? a.removeAttribute(t)
            : a.setAttribute(t, l);
          break;
        case "popover":
          ($("beforetoggle", a), $("toggle", a), Su(a, "popover", l));
          break;
        case "xlinkActuate":
          pt(a, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
          break;
        case "xlinkArcrole":
          pt(a, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
          break;
        case "xlinkRole":
          pt(a, "http://www.w3.org/1999/xlink", "xlink:role", l);
          break;
        case "xlinkShow":
          pt(a, "http://www.w3.org/1999/xlink", "xlink:show", l);
          break;
        case "xlinkTitle":
          pt(a, "http://www.w3.org/1999/xlink", "xlink:title", l);
          break;
        case "xlinkType":
          pt(a, "http://www.w3.org/1999/xlink", "xlink:type", l);
          break;
        case "xmlBase":
          pt(a, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
          break;
        case "xmlLang":
          pt(a, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
          break;
        case "xmlSpace":
          pt(a, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
          break;
        case "is":
          Su(a, "is", l);
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          (!(2 < t.length) || (t[0] !== "o" && t[0] !== "O") || (t[1] !== "n" && t[1] !== "N")) &&
            ((t = Bv.get(t) || t), Su(a, t, l));
      }
    }
    function xs(a, e, t, l, n, i) {
      switch (t) {
        case "style":
          dm(a, l, i);
          break;
        case "dangerouslySetInnerHTML":
          if (l != null) {
            if (typeof l != "object" || !("__html" in l)) throw Error(z(61));
            if (((t = l.__html), t != null)) {
              if (n.children != null) throw Error(z(60));
              a.innerHTML = t;
            }
          }
          break;
        case "children":
          typeof l == "string"
            ? hn(a, l)
            : (typeof l == "number" || typeof l == "bigint") && hn(a, "" + l);
          break;
        case "onScroll":
          l != null && $("scroll", a);
          break;
        case "onScrollEnd":
          l != null && $("scrollend", a);
          break;
        case "onClick":
          l != null && (a.onclick = zt);
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          break;
        case "innerText":
        case "textContent":
          break;
        default:
          if (!um.hasOwnProperty(t))
            a: {
              if (
                t[0] === "o" &&
                t[1] === "n" &&
                ((n = t.endsWith("Capture")),
                (e = t.slice(2, n ? t.length - 7 : void 0)),
                (i = a[fe] || null),
                (i = i != null ? i[t] : null),
                typeof i == "function" && a.removeEventListener(e, i, n),
                typeof l == "function")
              ) {
                (typeof i != "function" &&
                  i !== null &&
                  (t in a ? (a[t] = null) : a.hasAttribute(t) && a.removeAttribute(t)),
                  a.addEventListener(e, l, n));
                break a;
              }
              t in a ? (a[t] = l) : l === !0 ? a.setAttribute(t, "") : Su(a, t, l);
            }
      }
    }
    function $a(a, e, t) {
      switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          ($("error", a), $("load", a));
          var l = !1,
            n = !1,
            i;
          for (i in t)
            if (t.hasOwnProperty(i)) {
              var u = t[i];
              if (u != null)
                switch (i) {
                  case "src":
                    l = !0;
                    break;
                  case "srcSet":
                    n = !0;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(z(137, e));
                  default:
                    ca(a, e, i, u, t, null);
                }
            }
          (n && ca(a, e, "srcSet", t.srcSet, t, null), l && ca(a, e, "src", t.src, t, null));
          return;
        case "input":
          $("invalid", a);
          var o = (i = u = n = null),
            c = null,
            d = null;
          for (l in t)
            if (t.hasOwnProperty(l)) {
              var g = t[l];
              if (g != null)
                switch (l) {
                  case "name":
                    n = g;
                    break;
                  case "type":
                    u = g;
                    break;
                  case "checked":
                    c = g;
                    break;
                  case "defaultChecked":
                    d = g;
                    break;
                  case "value":
                    i = g;
                    break;
                  case "defaultValue":
                    o = g;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (g != null) throw Error(z(137, e));
                    break;
                  default:
                    ca(a, e, l, g, t, null);
                }
            }
          sm(a, i, o, c, d, u, n, !1);
          return;
        case "select":
          ($("invalid", a), (l = u = i = null));
          for (n in t)
            if (t.hasOwnProperty(n) && ((o = t[n]), o != null))
              switch (n) {
                case "value":
                  i = o;
                  break;
                case "defaultValue":
                  u = o;
                  break;
                case "multiple":
                  l = o;
                default:
                  ca(a, e, n, o, t, null);
              }
          ((e = i),
            (t = u),
            (a.multiple = !!l),
            e != null ? rn(a, !!l, e, !1) : t != null && rn(a, !!l, t, !0));
          return;
        case "textarea":
          ($("invalid", a), (i = n = l = null));
          for (u in t)
            if (t.hasOwnProperty(u) && ((o = t[u]), o != null))
              switch (u) {
                case "value":
                  l = o;
                  break;
                case "defaultValue":
                  n = o;
                  break;
                case "children":
                  i = o;
                  break;
                case "dangerouslySetInnerHTML":
                  if (o != null) throw Error(z(91));
                  break;
                default:
                  ca(a, e, u, o, t, null);
              }
          fm(a, l, n, i);
          return;
        case "option":
          for (c in t)
            t.hasOwnProperty(c) &&
              ((l = t[c]), l != null) &&
              (c === "selected"
                ? (a.selected = l && typeof l != "function" && typeof l != "symbol")
                : ca(a, e, c, l, t, null));
          return;
        case "dialog":
          ($("beforetoggle", a), $("toggle", a), $("cancel", a), $("close", a));
          break;
        case "iframe":
        case "object":
          $("load", a);
          break;
        case "video":
        case "audio":
          for (l = 0; l < Mi.length; l++) $(Mi[l], a);
          break;
        case "image":
          ($("error", a), $("load", a));
          break;
        case "details":
          $("toggle", a);
          break;
        case "embed":
        case "source":
        case "link":
          ($("error", a), $("load", a));
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (d in t)
            if (t.hasOwnProperty(d) && ((l = t[d]), l != null))
              switch (d) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(z(137, e));
                default:
                  ca(a, e, d, l, t, null);
              }
          return;
        default:
          if (qs(e)) {
            for (g in t)
              t.hasOwnProperty(g) && ((l = t[g]), l !== void 0 && xs(a, e, g, l, t, void 0));
            return;
          }
      }
      for (o in t) t.hasOwnProperty(o) && ((l = t[o]), l != null && ca(a, e, o, l, t, null));
    }
    function fh(a, e, t, l) {
      switch (e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var n = null,
            i = null,
            u = null,
            o = null,
            c = null,
            d = null,
            g = null;
          for (f in t) {
            var b = t[f];
            if (t.hasOwnProperty(f) && b != null)
              switch (f) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  c = b;
                default:
                  l.hasOwnProperty(f) || ca(a, e, f, null, l, b);
              }
          }
          for (var m in l) {
            var f = l[m];
            if (((b = t[m]), l.hasOwnProperty(m) && (f != null || b != null)))
              switch (m) {
                case "type":
                  i = f;
                  break;
                case "name":
                  n = f;
                  break;
                case "checked":
                  d = f;
                  break;
                case "defaultChecked":
                  g = f;
                  break;
                case "value":
                  u = f;
                  break;
                case "defaultValue":
                  o = f;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (f != null) throw Error(z(137, e));
                  break;
                default:
                  f !== b && ca(a, e, m, f, l, b);
              }
          }
          Zc(a, u, o, c, d, g, i, n);
          return;
        case "select":
          f = u = o = m = null;
          for (i in t)
            if (((c = t[i]), t.hasOwnProperty(i) && c != null))
              switch (i) {
                case "value":
                  break;
                case "multiple":
                  f = c;
                default:
                  l.hasOwnProperty(i) || ca(a, e, i, null, l, c);
              }
          for (n in l)
            if (((i = l[n]), (c = t[n]), l.hasOwnProperty(n) && (i != null || c != null)))
              switch (n) {
                case "value":
                  m = i;
                  break;
                case "defaultValue":
                  o = i;
                  break;
                case "multiple":
                  u = i;
                default:
                  i !== c && ca(a, e, n, i, l, c);
              }
          ((e = o),
            (t = u),
            (l = f),
            m != null
              ? rn(a, !!t, m, !1)
              : !!l != !!t && (e != null ? rn(a, !!t, e, !0) : rn(a, !!t, t ? [] : "", !1)));
          return;
        case "textarea":
          f = m = null;
          for (o in t)
            if (((n = t[o]), t.hasOwnProperty(o) && n != null && !l.hasOwnProperty(o)))
              switch (o) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  ca(a, e, o, null, l, n);
              }
          for (u in l)
            if (((n = l[u]), (i = t[u]), l.hasOwnProperty(u) && (n != null || i != null)))
              switch (u) {
                case "value":
                  m = n;
                  break;
                case "defaultValue":
                  f = n;
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (n != null) throw Error(z(91));
                  break;
                default:
                  n !== i && ca(a, e, u, n, l, i);
              }
          rm(a, m, f);
          return;
        case "option":
          for (var x in t)
            ((m = t[x]),
              t.hasOwnProperty(x) &&
                m != null &&
                !l.hasOwnProperty(x) &&
                (x === "selected" ? (a.selected = !1) : ca(a, e, x, null, l, m)));
          for (c in l)
            ((m = l[c]),
              (f = t[c]),
              l.hasOwnProperty(c) &&
                m !== f &&
                (m != null || f != null) &&
                (c === "selected"
                  ? (a.selected = m && typeof m != "function" && typeof m != "symbol")
                  : ca(a, e, c, m, l, f)));
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var S in t)
            ((m = t[S]),
              t.hasOwnProperty(S) && m != null && !l.hasOwnProperty(S) && ca(a, e, S, null, l, m));
          for (d in l)
            if (
              ((m = l[d]), (f = t[d]), l.hasOwnProperty(d) && m !== f && (m != null || f != null))
            )
              switch (d) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (m != null) throw Error(z(137, e));
                  break;
                default:
                  ca(a, e, d, m, l, f);
              }
          return;
        default:
          if (qs(e)) {
            for (var T in t)
              ((m = t[T]),
                t.hasOwnProperty(T) &&
                  m !== void 0 &&
                  !l.hasOwnProperty(T) &&
                  xs(a, e, T, void 0, l, m));
            for (g in l)
              ((m = l[g]),
                (f = t[g]),
                !l.hasOwnProperty(g) ||
                  m === f ||
                  (m === void 0 && f === void 0) ||
                  xs(a, e, g, m, l, f));
            return;
          }
      }
      for (var s in t)
        ((m = t[s]),
          t.hasOwnProperty(s) && m != null && !l.hasOwnProperty(s) && ca(a, e, s, null, l, m));
      for (b in l)
        ((m = l[b]),
          (f = t[b]),
          !l.hasOwnProperty(b) || m === f || (m == null && f == null) || ca(a, e, b, m, l, f));
    }
    function Td(a) {
      switch (a) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return !0;
        default:
          return !1;
      }
    }
    function dh() {
      if (typeof performance.getEntriesByType == "function") {
        for (
          var a = 0, e = 0, t = performance.getEntriesByType("resource"), l = 0;
          l < t.length;
          l++
        ) {
          var n = t[l],
            i = n.transferSize,
            u = n.initiatorType,
            o = n.duration;
          if (i && o && Td(u)) {
            for (u = 0, o = n.responseEnd, l += 1; l < t.length; l++) {
              var c = t[l],
                d = c.startTime;
              if (d > o) break;
              var g = c.transferSize,
                b = c.initiatorType;
              g && Td(b) && ((c = c.responseEnd), (u += g * (c < o ? 1 : (o - d) / (c - d))));
            }
            if ((--l, (e += (8 * (i + u)) / (n.duration / 1e3)), a++, 10 < a)) break;
          }
        }
        if (0 < a) return e / a / 1e6;
      }
      return navigator.connection && ((a = navigator.connection.downlink), typeof a == "number")
        ? a
        : 5;
    }
    var zs = null,
      Ms = null;
    function no(a) {
      return a.nodeType === 9 ? a : a.ownerDocument;
    }
    function Ad(a) {
      switch (a) {
        case "http://www.w3.org/2000/svg":
          return 1;
        case "http://www.w3.org/1998/Math/MathML":
          return 2;
        default:
          return 0;
      }
    }
    function v0(a, e) {
      if (a === 0)
        switch (e) {
          case "svg":
            return 1;
          case "math":
            return 2;
          default:
            return 0;
        }
      return a === 1 && e === "foreignObject" ? 0 : a;
    }
    function Es(a, e) {
      return (
        a === "textarea" ||
        a === "noscript" ||
        typeof e.children == "string" ||
        typeof e.children == "number" ||
        typeof e.children == "bigint" ||
        (typeof e.dangerouslySetInnerHTML == "object" &&
          e.dangerouslySetInnerHTML !== null &&
          e.dangerouslySetInnerHTML.__html != null)
      );
    }
    var kc = null;
    function mh() {
      var a = window.event;
      return a && a.type === "popstate" ? (a === kc ? !1 : ((kc = a), !0)) : ((kc = null), !1);
    }
    var b0 = typeof setTimeout == "function" ? setTimeout : void 0,
      ph = typeof clearTimeout == "function" ? clearTimeout : void 0,
      Cd = typeof Promise == "function" ? Promise : void 0,
      gh =
        typeof queueMicrotask == "function"
          ? queueMicrotask
          : typeof Cd < "u"
            ? function (a) {
                return Cd.resolve(null).then(a).catch(vh);
              }
            : b0;
    function vh(a) {
      setTimeout(function () {
        throw a;
      });
    }
    function rl(a) {
      return a === "head";
    }
    function Od(a, e) {
      var t = e,
        l = 0;
      do {
        var n = t.nextSibling;
        if ((a.removeChild(t), n && n.nodeType === 8))
          if (((t = n.data), t === "/$" || t === "/&")) {
            if (l === 0) {
              (a.removeChild(n), Tn(e));
              return;
            }
            l--;
          } else if (t === "$" || t === "$?" || t === "$~" || t === "$!" || t === "&") l++;
          else if (t === "html") mi(a.ownerDocument.documentElement);
          else if (t === "head") {
            ((t = a.ownerDocument.head), mi(t));
            for (var i = t.firstChild; i;) {
              var u = i.nextSibling,
                o = i.nodeName;
              (i[wi] ||
                o === "SCRIPT" ||
                o === "STYLE" ||
                (o === "LINK" && i.rel.toLowerCase() === "stylesheet") ||
                t.removeChild(i),
                (i = u));
            }
          } else t === "body" && mi(a.ownerDocument.body);
        t = n;
      } while (t);
      Tn(e);
    }
    function Dd(a, e) {
      var t = a;
      a = 0;
      do {
        var l = t.nextSibling;
        if (
          (t.nodeType === 1
            ? e
              ? ((t._stashedDisplay = t.style.display), (t.style.display = "none"))
              : ((t.style.display = t._stashedDisplay || ""),
                t.getAttribute("style") === "" && t.removeAttribute("style"))
            : t.nodeType === 3 &&
              (e
                ? ((t._stashedText = t.nodeValue), (t.nodeValue = ""))
                : (t.nodeValue = t._stashedText || "")),
          l && l.nodeType === 8)
        )
          if (((t = l.data), t === "/$")) {
            if (a === 0) break;
            a--;
          } else (t !== "$" && t !== "$?" && t !== "$~" && t !== "$!") || a++;
        t = l;
      } while (t);
    }
    function Ns(a) {
      var e = a.firstChild;
      for (e && e.nodeType === 10 && (e = e.nextSibling); e;) {
        var t = e;
        switch (((e = e.nextSibling), t.nodeName)) {
          case "HTML":
          case "HEAD":
          case "BODY":
            (Ns(t), Us(t));
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (t.rel.toLowerCase() === "stylesheet") continue;
        }
        a.removeChild(t);
      }
    }
    function bh(a, e, t, l) {
      for (; a.nodeType === 1;) {
        var n = t;
        if (a.nodeName.toLowerCase() !== e.toLowerCase()) {
          if (!l && (a.nodeName !== "INPUT" || a.type !== "hidden")) break;
        } else if (l) {
          if (!a[wi])
            switch (e) {
              case "meta":
                if (!a.hasAttribute("itemprop")) break;
                return a;
              case "link":
                if (
                  ((i = a.getAttribute("rel")),
                  i === "stylesheet" && a.hasAttribute("data-precedence"))
                )
                  break;
                if (
                  i !== n.rel ||
                  a.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) ||
                  a.getAttribute("crossorigin") !==
                    (n.crossOrigin == null ? null : n.crossOrigin) ||
                  a.getAttribute("title") !== (n.title == null ? null : n.title)
                )
                  break;
                return a;
              case "style":
                if (a.hasAttribute("data-precedence")) break;
                return a;
              case "script":
                if (
                  ((i = a.getAttribute("src")),
                  (i !== (n.src == null ? null : n.src) ||
                    a.getAttribute("type") !== (n.type == null ? null : n.type) ||
                    a.getAttribute("crossorigin") !==
                      (n.crossOrigin == null ? null : n.crossOrigin)) &&
                    i &&
                    a.hasAttribute("async") &&
                    !a.hasAttribute("itemprop"))
                )
                  break;
                return a;
              default:
                return a;
            }
        } else if (e === "input" && a.type === "hidden") {
          var i = n.name == null ? null : "" + n.name;
          if (n.type === "hidden" && a.getAttribute("name") === i) return a;
        } else return a;
        if (((a = je(a.nextSibling)), a === null)) break;
      }
      return null;
    }
    function hh(a, e, t) {
      if (e === "") return null;
      for (; a.nodeType !== 3;)
        if (
          ((a.nodeType !== 1 || a.nodeName !== "INPUT" || a.type !== "hidden") && !t) ||
          ((a = je(a.nextSibling)), a === null)
        )
          return null;
      return a;
    }
    function h0(a, e) {
      for (; a.nodeType !== 8;)
        if (
          ((a.nodeType !== 1 || a.nodeName !== "INPUT" || a.type !== "hidden") && !e) ||
          ((a = je(a.nextSibling)), a === null)
        )
          return null;
      return a;
    }
    function Ts(a) {
      return a.data === "$?" || a.data === "$~";
    }
    function As(a) {
      return a.data === "$!" || (a.data === "$?" && a.ownerDocument.readyState !== "loading");
    }
    function yh(a, e) {
      var t = a.ownerDocument;
      if (a.data === "$~") a._reactRetry = e;
      else if (a.data !== "$?" || t.readyState !== "loading") e();
      else {
        var l = function () {
          (e(), t.removeEventListener("DOMContentLoaded", l));
        };
        (t.addEventListener("DOMContentLoaded", l), (a._reactRetry = l));
      }
    }
    function je(a) {
      for (; a != null; a = a.nextSibling) {
        var e = a.nodeType;
        if (e === 1 || e === 3) break;
        if (e === 8) {
          if (
            ((e = a.data),
            e === "$" ||
              e === "$!" ||
              e === "$?" ||
              e === "$~" ||
              e === "&" ||
              e === "F!" ||
              e === "F")
          )
            break;
          if (e === "/$" || e === "/&") return null;
        }
      }
      return a;
    }
    var Cs = null;
    function Rd(a) {
      a = a.nextSibling;
      for (var e = 0; a;) {
        if (a.nodeType === 8) {
          var t = a.data;
          if (t === "/$" || t === "/&") {
            if (e === 0) return je(a.nextSibling);
            e--;
          } else (t !== "$" && t !== "$!" && t !== "$?" && t !== "$~" && t !== "&") || e++;
        }
        a = a.nextSibling;
      }
      return null;
    }
    function wd(a) {
      a = a.previousSibling;
      for (var e = 0; a;) {
        if (a.nodeType === 8) {
          var t = a.data;
          if (t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&") {
            if (e === 0) return a;
            e--;
          } else (t !== "/$" && t !== "/&") || e++;
        }
        a = a.previousSibling;
      }
      return null;
    }
    function y0(a, e, t) {
      switch (((e = no(t)), a)) {
        case "html":
          if (((a = e.documentElement), !a)) throw Error(z(452));
          return a;
        case "head":
          if (((a = e.head), !a)) throw Error(z(453));
          return a;
        case "body":
          if (((a = e.body), !a)) throw Error(z(454));
          return a;
        default:
          throw Error(z(451));
      }
    }
    function mi(a) {
      for (var e = a.attributes; e.length;) a.removeAttributeNode(e[0]);
      Us(a);
    }
    var Be = new Map(),
      _d = new Set();
    function io(a) {
      return typeof a.getRootNode == "function"
        ? a.getRootNode()
        : a.nodeType === 9
          ? a
          : a.ownerDocument;
    }
    var wt = la.d;
    la.d = { f: Sh, r: xh, D: zh, C: Mh, L: Eh, m: Nh, X: Ah, S: Th, M: Ch };
    function Sh() {
      var a = wt.f(),
        e = Mo();
      return a || e;
    }
    function xh(a) {
      var e = Cn(a);
      e !== null && e.tag === 5 && e.type === "form" ? dp(e) : wt.r(a);
    }
    var wn = typeof document > "u" ? null : document;
    function S0(a, e, t) {
      var l = wn;
      if (l && typeof e == "string" && e) {
        var n = Le(e);
        ((n = 'link[rel="' + a + '"][href="' + n + '"]'),
          typeof t == "string" && (n += '[crossorigin="' + t + '"]'),
          _d.has(n) ||
            (_d.add(n),
            (a = { rel: a, crossOrigin: t, href: e }),
            l.querySelector(n) === null &&
              ((e = l.createElement("link")), $a(e, "link", a), ja(e), l.head.appendChild(e))));
      }
    }
    function zh(a) {
      (wt.D(a), S0("dns-prefetch", a, null));
    }
    function Mh(a, e) {
      (wt.C(a, e), S0("preconnect", a, e));
    }
    function Eh(a, e, t) {
      wt.L(a, e, t);
      var l = wn;
      if (l && a && e) {
        var n = 'link[rel="preload"][as="' + Le(e) + '"]';
        e === "image" && t && t.imageSrcSet
          ? ((n += '[imagesrcset="' + Le(t.imageSrcSet) + '"]'),
            typeof t.imageSizes == "string" && (n += '[imagesizes="' + Le(t.imageSizes) + '"]'))
          : (n += '[href="' + Le(a) + '"]');
        var i = n;
        switch (e) {
          case "style":
            i = Nn(a);
            break;
          case "script":
            i = _n(a);
        }
        Be.has(i) ||
          ((a = ha(
            { rel: "preload", href: e === "image" && t && t.imageSrcSet ? void 0 : a, as: e },
            t,
          )),
          Be.set(i, a),
          l.querySelector(n) !== null ||
            (e === "style" && l.querySelector(Hi(i))) ||
            (e === "script" && l.querySelector(ji(i))) ||
            ((e = l.createElement("link")), $a(e, "link", a), ja(e), l.head.appendChild(e)));
      }
    }
    function Nh(a, e) {
      wt.m(a, e);
      var t = wn;
      if (t && a) {
        var l = e && typeof e.as == "string" ? e.as : "script",
          n = 'link[rel="modulepreload"][as="' + Le(l) + '"][href="' + Le(a) + '"]',
          i = n;
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            i = _n(a);
        }
        if (
          !Be.has(i) &&
          ((a = ha({ rel: "modulepreload", href: a }, e)),
          Be.set(i, a),
          t.querySelector(n) === null)
        ) {
          switch (l) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              if (t.querySelector(ji(i))) return;
          }
          ((l = t.createElement("link")), $a(l, "link", a), ja(l), t.head.appendChild(l));
        }
      }
    }
    function Th(a, e, t) {
      wt.S(a, e, t);
      var l = wn;
      if (l && a) {
        var n = sn(l).hoistableStyles,
          i = Nn(a);
        e = e || "default";
        var u = n.get(i);
        if (!u) {
          var o = { loading: 0, preload: null };
          if ((u = l.querySelector(Hi(i)))) o.loading = 5;
          else {
            ((a = ha({ rel: "stylesheet", href: a, "data-precedence": e }, t)),
              (t = Be.get(i)) && xr(a, t));
            var c = (u = l.createElement("link"));
            (ja(c),
              $a(c, "link", a),
              (c._p = new Promise(function (d, g) {
                ((c.onload = d), (c.onerror = g));
              })),
              c.addEventListener("load", function () {
                o.loading |= 1;
              }),
              c.addEventListener("error", function () {
                o.loading |= 2;
              }),
              (o.loading |= 4),
              Ru(u, e, l));
          }
          ((u = { type: "stylesheet", instance: u, count: 1, state: o }), n.set(i, u));
        }
      }
    }
    function Ah(a, e) {
      wt.X(a, e);
      var t = wn;
      if (t && a) {
        var l = sn(t).hoistableScripts,
          n = _n(a),
          i = l.get(n);
        i ||
          ((i = t.querySelector(ji(n))),
          i ||
            ((a = ha({ src: a, async: !0 }, e)),
            (e = Be.get(n)) && zr(a, e),
            (i = t.createElement("script")),
            ja(i),
            $a(i, "link", a),
            t.head.appendChild(i)),
          (i = { type: "script", instance: i, count: 1, state: null }),
          l.set(n, i));
      }
    }
    function Ch(a, e) {
      wt.M(a, e);
      var t = wn;
      if (t && a) {
        var l = sn(t).hoistableScripts,
          n = _n(a),
          i = l.get(n);
        i ||
          ((i = t.querySelector(ji(n))),
          i ||
            ((a = ha({ src: a, async: !0, type: "module" }, e)),
            (e = Be.get(n)) && zr(a, e),
            (i = t.createElement("script")),
            ja(i),
            $a(i, "link", a),
            t.head.appendChild(i)),
          (i = { type: "script", instance: i, count: 1, state: null }),
          l.set(n, i));
      }
    }
    function kd(a, e, t, l) {
      var n = (n = Wt.current) ? io(n) : null;
      if (!n) throw Error(z(446));
      switch (a) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof t.precedence == "string" && typeof t.href == "string"
            ? ((e = Nn(t.href)),
              (t = sn(n).hoistableStyles),
              (l = t.get(e)),
              l || ((l = { type: "style", instance: null, count: 0, state: null }), t.set(e, l)),
              l)
            : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (
            t.rel === "stylesheet" &&
            typeof t.href == "string" &&
            typeof t.precedence == "string"
          ) {
            a = Nn(t.href);
            var i = sn(n).hoistableStyles,
              u = i.get(a);
            if (
              (u ||
                ((n = n.ownerDocument || n),
                (u = {
                  type: "stylesheet",
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                i.set(a, u),
                (i = n.querySelector(Hi(a))) && !i._p && ((u.instance = i), (u.state.loading = 5)),
                Be.has(a) ||
                  ((t = {
                    rel: "preload",
                    as: "style",
                    href: t.href,
                    crossOrigin: t.crossOrigin,
                    integrity: t.integrity,
                    media: t.media,
                    hrefLang: t.hrefLang,
                    referrerPolicy: t.referrerPolicy,
                  }),
                  Be.set(a, t),
                  i || Oh(n, a, t, u.state))),
              e && l === null)
            )
              throw Error(z(528, ""));
            return u;
          }
          if (e && l !== null) throw Error(z(529, ""));
          return null;
        case "script":
          return (
            (e = t.async),
            (t = t.src),
            typeof t == "string" && e && typeof e != "function" && typeof e != "symbol"
              ? ((e = _n(t)),
                (t = sn(n).hoistableScripts),
                (l = t.get(e)),
                l || ((l = { type: "script", instance: null, count: 0, state: null }), t.set(e, l)),
                l)
              : { type: "void", instance: null, count: 0, state: null }
          );
        default:
          throw Error(z(444, a));
      }
    }
    function Nn(a) {
      return 'href="' + Le(a) + '"';
    }
    function Hi(a) {
      return 'link[rel="stylesheet"][' + a + "]";
    }
    function x0(a) {
      return ha({}, a, { "data-precedence": a.precedence, precedence: null });
    }
    function Oh(a, e, t, l) {
      a.querySelector('link[rel="preload"][as="style"][' + e + "]")
        ? (l.loading = 1)
        : ((e = a.createElement("link")),
          (l.preload = e),
          e.addEventListener("load", function () {
            return (l.loading |= 1);
          }),
          e.addEventListener("error", function () {
            return (l.loading |= 2);
          }),
          $a(e, "link", t),
          ja(e),
          a.head.appendChild(e));
    }
    function _n(a) {
      return '[src="' + Le(a) + '"]';
    }
    function ji(a) {
      return "script[async]" + a;
    }
    function Ld(a, e, t) {
      if ((e.count++, e.instance === null))
        switch (e.type) {
          case "style":
            var l = a.querySelector('style[data-href~="' + Le(t.href) + '"]');
            if (l) return ((e.instance = l), ja(l), l);
            var n = ha({}, t, {
              "data-href": t.href,
              "data-precedence": t.precedence,
              href: null,
              precedence: null,
            });
            return (
              (l = (a.ownerDocument || a).createElement("style")),
              ja(l),
              $a(l, "style", n),
              Ru(l, t.precedence, a),
              (e.instance = l)
            );
          case "stylesheet":
            n = Nn(t.href);
            var i = a.querySelector(Hi(n));
            if (i) return ((e.state.loading |= 4), (e.instance = i), ja(i), i);
            ((l = x0(t)),
              (n = Be.get(n)) && xr(l, n),
              (i = (a.ownerDocument || a).createElement("link")),
              ja(i));
            var u = i;
            return (
              (u._p = new Promise(function (o, c) {
                ((u.onload = o), (u.onerror = c));
              })),
              $a(i, "link", l),
              (e.state.loading |= 4),
              Ru(i, t.precedence, a),
              (e.instance = i)
            );
          case "script":
            return (
              (i = _n(t.src)),
              (n = a.querySelector(ji(i)))
                ? ((e.instance = n), ja(n), n)
                : ((l = t),
                  (n = Be.get(i)) && ((l = ha({}, t)), zr(l, n)),
                  (a = a.ownerDocument || a),
                  (n = a.createElement("script")),
                  ja(n),
                  $a(n, "link", l),
                  a.head.appendChild(n),
                  (e.instance = n))
            );
          case "void":
            return null;
          default:
            throw Error(z(443, e.type));
        }
      else
        e.type === "stylesheet" &&
          (e.state.loading & 4) === 0 &&
          ((l = e.instance), (e.state.loading |= 4), Ru(l, t.precedence, a));
      return e.instance;
    }
    function Ru(a, e, t) {
      for (
        var l = t.querySelectorAll(
            'link[rel="stylesheet"][data-precedence],style[data-precedence]',
          ),
          n = l.length ? l[l.length - 1] : null,
          i = n,
          u = 0;
        u < l.length;
        u++
      ) {
        var o = l[u];
        if (o.dataset.precedence === e) i = o;
        else if (i !== n) break;
      }
      i
        ? i.parentNode.insertBefore(a, i.nextSibling)
        : ((e = t.nodeType === 9 ? t.head : t), e.insertBefore(a, e.firstChild));
    }
    function xr(a, e) {
      (a.crossOrigin == null && (a.crossOrigin = e.crossOrigin),
        a.referrerPolicy == null && (a.referrerPolicy = e.referrerPolicy),
        a.title == null && (a.title = e.title));
    }
    function zr(a, e) {
      (a.crossOrigin == null && (a.crossOrigin = e.crossOrigin),
        a.referrerPolicy == null && (a.referrerPolicy = e.referrerPolicy),
        a.integrity == null && (a.integrity = e.integrity));
    }
    var wu = null;
    function Ud(a, e, t) {
      if (wu === null) {
        var l = new Map(),
          n = (wu = new Map());
        n.set(t, l);
      } else ((n = wu), (l = n.get(t)), l || ((l = new Map()), n.set(t, l)));
      if (l.has(a)) return l;
      for (l.set(a, null), t = t.getElementsByTagName(a), n = 0; n < t.length; n++) {
        var i = t[n];
        if (
          !(i[wi] || i[Za] || (a === "link" && i.getAttribute("rel") === "stylesheet")) &&
          i.namespaceURI !== "http://www.w3.org/2000/svg"
        ) {
          var u = i.getAttribute(e) || "";
          u = a + u;
          var o = l.get(u);
          o ? o.push(i) : l.set(u, [i]);
        }
      }
      return l;
    }
    function qd(a, e, t) {
      ((a = a.ownerDocument || a),
        a.head.insertBefore(t, e === "title" ? a.querySelector("head > title") : null));
    }
    function Dh(a, e, t) {
      if (t === 1 || e.itemProp != null) return !1;
      switch (a) {
        case "meta":
        case "title":
          return !0;
        case "style":
          if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
          return !0;
        case "link":
          if (
            typeof e.rel != "string" ||
            typeof e.href != "string" ||
            e.href === "" ||
            e.onLoad ||
            e.onError
          )
            break;
          return e.rel === "stylesheet"
            ? ((a = e.disabled), typeof e.precedence == "string" && a == null)
            : !0;
        case "script":
          if (
            e.async &&
            typeof e.async != "function" &&
            typeof e.async != "symbol" &&
            !e.onLoad &&
            !e.onError &&
            e.src &&
            typeof e.src == "string"
          )
            return !0;
      }
      return !1;
    }
    function z0(a) {
      return !(a.type === "stylesheet" && (a.state.loading & 3) === 0);
    }
    function Rh(a, e, t, l) {
      if (
        t.type === "stylesheet" &&
        (typeof l.media != "string" || matchMedia(l.media).matches !== !1) &&
        (t.state.loading & 4) === 0
      ) {
        if (t.instance === null) {
          var n = Nn(l.href),
            i = e.querySelector(Hi(n));
          if (i) {
            ((e = i._p),
              e !== null &&
                typeof e == "object" &&
                typeof e.then == "function" &&
                (a.count++, (a = uo.bind(a)), e.then(a, a)),
              (t.state.loading |= 4),
              (t.instance = i),
              ja(i));
            return;
          }
          ((i = e.ownerDocument || e),
            (l = x0(l)),
            (n = Be.get(n)) && xr(l, n),
            (i = i.createElement("link")),
            ja(i));
          var u = i;
          ((u._p = new Promise(function (o, c) {
            ((u.onload = o), (u.onerror = c));
          })),
            $a(i, "link", l),
            (t.instance = i));
        }
        (a.stylesheets === null && (a.stylesheets = new Map()),
          a.stylesheets.set(t, e),
          (e = t.state.preload) &&
            (t.state.loading & 3) === 0 &&
            (a.count++,
            (t = uo.bind(a)),
            e.addEventListener("load", t),
            e.addEventListener("error", t)));
      }
    }
    var Lc = 0;
    function wh(a, e) {
      return (
        a.stylesheets && a.count === 0 && _u(a, a.stylesheets),
        0 < a.count || 0 < a.imgCount
          ? function (t) {
              var l = setTimeout(function () {
                if ((a.stylesheets && _u(a, a.stylesheets), a.unsuspend)) {
                  var i = a.unsuspend;
                  ((a.unsuspend = null), i());
                }
              }, 6e4 + e);
              0 < a.imgBytes && Lc === 0 && (Lc = 62500 * dh());
              var n = setTimeout(
                function () {
                  if (
                    ((a.waitingForImages = !1),
                    a.count === 0 && (a.stylesheets && _u(a, a.stylesheets), a.unsuspend))
                  ) {
                    var i = a.unsuspend;
                    ((a.unsuspend = null), i());
                  }
                },
                (a.imgBytes > Lc ? 50 : 800) + e,
              );
              return (
                (a.unsuspend = t),
                function () {
                  ((a.unsuspend = null), clearTimeout(l), clearTimeout(n));
                }
              );
            }
          : null
      );
    }
    function uo() {
      if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
        if (this.stylesheets) _u(this, this.stylesheets);
        else if (this.unsuspend) {
          var a = this.unsuspend;
          ((this.unsuspend = null), a());
        }
      }
    }
    var oo = null;
    function _u(a, e) {
      ((a.stylesheets = null),
        a.unsuspend !== null &&
          (a.count++, (oo = new Map()), e.forEach(_h, a), (oo = null), uo.call(a)));
    }
    function _h(a, e) {
      if (!(e.state.loading & 4)) {
        var t = oo.get(a);
        if (t) var l = t.get(null);
        else {
          ((t = new Map()), oo.set(a, t));
          for (
            var n = a.querySelectorAll("link[data-precedence],style[data-precedence]"), i = 0;
            i < n.length;
            i++
          ) {
            var u = n[i];
            (u.nodeName === "LINK" || u.getAttribute("media") !== "not all") &&
              (t.set(u.dataset.precedence, u), (l = u));
          }
          l && t.set(null, l);
        }
        ((n = e.instance),
          (u = n.getAttribute("data-precedence")),
          (i = t.get(u) || l),
          i === l && t.set(null, n),
          t.set(u, n),
          this.count++,
          (l = uo.bind(this)),
          n.addEventListener("load", l),
          n.addEventListener("error", l),
          i
            ? i.parentNode.insertBefore(n, i.nextSibling)
            : ((a = a.nodeType === 9 ? a.head : a), a.insertBefore(n, a.firstChild)),
          (e.state.loading |= 4));
      }
    }
    var Ni = {
      $$typeof: xt,
      Provider: null,
      Consumer: null,
      _currentValue: El,
      _currentValue2: El,
      _threadCount: 0,
    };
    function kh(a, e, t, l, n, i, u, o, c) {
      ((this.tag = 1),
        (this.containerInfo = a),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = oc(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = oc(0)),
        (this.hiddenUpdates = oc(null)),
        (this.identifierPrefix = l),
        (this.onUncaughtError = n),
        (this.onCaughtError = i),
        (this.onRecoverableError = u),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = c),
        (this.incompleteTransitions = new Map()));
    }
    function M0(a, e, t, l, n, i, u, o, c, d, g, b) {
      return (
        (a = new kh(a, e, t, u, c, d, g, b, o)),
        (e = 1),
        i === !0 && (e |= 24),
        (i = Se(3, null, null, e)),
        (a.current = i),
        (i.stateNode = a),
        (e = Js()),
        e.refCount++,
        (a.pooledCache = e),
        e.refCount++,
        (i.memoizedState = { element: l, isDehydrated: t, cache: e }),
        Fs(i),
        a
      );
    }
    function E0(a) {
      return a ? ((a = nn), a) : nn;
    }
    function N0(a, e, t, l, n, i) {
      ((n = E0(n)),
        l.context === null ? (l.context = n) : (l.pendingContext = n),
        (l = It(e)),
        (l.payload = { element: t }),
        (i = i === void 0 ? null : i),
        i !== null && (l.callback = i),
        (t = Pt(a, l, e)),
        t !== null && (re(t, a, e), ii(t, a, e)));
    }
    function Hd(a, e) {
      if (((a = a.memoizedState), a !== null && a.dehydrated !== null)) {
        var t = a.retryLane;
        a.retryLane = t !== 0 && t < e ? t : e;
      }
    }
    function Mr(a, e) {
      (Hd(a, e), (a = a.alternate) && Hd(a, e));
    }
    function T0(a) {
      if (a.tag === 13 || a.tag === 31) {
        var e = ql(a, 67108864);
        (e !== null && re(e, a, 67108864), Mr(a, 67108864));
      }
    }
    function jd(a) {
      if (a.tag === 13 || a.tag === 31) {
        var e = Ne();
        e = ks(e);
        var t = ql(a, e);
        (t !== null && re(t, a, e), Mr(a, e));
      }
    }
    var co = !0;
    function Lh(a, e, t, l) {
      var n = B.T;
      B.T = null;
      var i = la.p;
      try {
        ((la.p = 2), Er(a, e, t, l));
      } finally {
        ((la.p = i), (B.T = n));
      }
    }
    function Uh(a, e, t, l) {
      var n = B.T;
      B.T = null;
      var i = la.p;
      try {
        ((la.p = 8), Er(a, e, t, l));
      } finally {
        ((la.p = i), (B.T = n));
      }
    }
    function Er(a, e, t, l) {
      if (co) {
        var n = Os(l);
        if (n === null) (_c(a, e, l, so, t), Bd(a, l));
        else if (Hh(n, a, e, t, l)) l.stopPropagation();
        else if ((Bd(a, l), e & 4 && -1 < qh.indexOf(a))) {
          for (; n !== null;) {
            var i = Cn(n);
            if (i !== null)
              switch (i.tag) {
                case 3:
                  if (((i = i.stateNode), i.current.memoizedState.isDehydrated)) {
                    var u = xl(i.pendingLanes);
                    if (u !== 0) {
                      var o = i;
                      for (o.pendingLanes |= 2, o.entangledLanes |= 2; u;) {
                        var c = 1 << (31 - Ee(u));
                        ((o.entanglements[1] |= c), (u &= ~c));
                      }
                      (ut(i), (ta & 6) === 0 && ((Iu = ze() + 500), qi(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((o = ql(i, 2)), o !== null && re(o, i, 2), Mo(), Mr(i, 2));
              }
            if (((i = Os(l)), i === null && _c(a, e, l, so, t), i === n)) break;
            n = i;
          }
          n !== null && l.stopPropagation();
        } else _c(a, e, l, null, t);
      }
    }
    function Os(a) {
      return ((a = Hs(a)), Nr(a));
    }
    var so = null;
    function Nr(a) {
      if (((so = null), (a = Il(a)), a !== null)) {
        var e = Ci(a);
        if (e === null) a = null;
        else {
          var t = e.tag;
          if (t === 13) {
            if (((a = Zd(e)), a !== null)) return a;
            a = null;
          } else if (t === 31) {
            if (((a = Kd(e)), a !== null)) return a;
            a = null;
          } else if (t === 3) {
            if (e.stateNode.current.memoizedState.isDehydrated)
              return e.tag === 3 ? e.stateNode.containerInfo : null;
            a = null;
          } else e !== a && (a = null);
        }
      }
      return ((so = a), null);
    }
    function A0(a) {
      switch (a) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return 8;
        case "message":
          switch (Ev()) {
            case Fd:
              return 2;
            case Id:
              return 8;
            case Hu:
            case Nv:
              return 32;
            case Pd:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var Ds = !1,
      tl = null,
      ll = null,
      nl = null,
      Ti = new Map(),
      Ai = new Map(),
      Qt = [],
      qh =
        "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
          " ",
        );
    function Bd(a, e) {
      switch (a) {
        case "focusin":
        case "focusout":
          tl = null;
          break;
        case "dragenter":
        case "dragleave":
          ll = null;
          break;
        case "mouseover":
        case "mouseout":
          nl = null;
          break;
        case "pointerover":
        case "pointerout":
          Ti.delete(e.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          Ai.delete(e.pointerId);
      }
    }
    function Jn(a, e, t, l, n, i) {
      return a === null || a.nativeEvent !== i
        ? ((a = {
            blockedOn: e,
            domEventName: t,
            eventSystemFlags: l,
            nativeEvent: i,
            targetContainers: [n],
          }),
          e !== null && ((e = Cn(e)), e !== null && T0(e)),
          a)
        : ((a.eventSystemFlags |= l),
          (e = a.targetContainers),
          n !== null && e.indexOf(n) === -1 && e.push(n),
          a);
    }
    function Hh(a, e, t, l, n) {
      switch (e) {
        case "focusin":
          return ((tl = Jn(tl, a, e, t, l, n)), !0);
        case "dragenter":
          return ((ll = Jn(ll, a, e, t, l, n)), !0);
        case "mouseover":
          return ((nl = Jn(nl, a, e, t, l, n)), !0);
        case "pointerover":
          var i = n.pointerId;
          return (Ti.set(i, Jn(Ti.get(i) || null, a, e, t, l, n)), !0);
        case "gotpointercapture":
          return ((i = n.pointerId), Ai.set(i, Jn(Ai.get(i) || null, a, e, t, l, n)), !0);
      }
      return !1;
    }
    function C0(a) {
      var e = Il(a.target);
      if (e !== null) {
        var t = Ci(e);
        if (t !== null) {
          if (((e = t.tag), e === 13)) {
            if (((e = Zd(t)), e !== null)) {
              ((a.blockedOn = e),
                Mf(a.priority, function () {
                  jd(t);
                }));
              return;
            }
          } else if (e === 31) {
            if (((e = Kd(t)), e !== null)) {
              ((a.blockedOn = e),
                Mf(a.priority, function () {
                  jd(t);
                }));
              return;
            }
          } else if (e === 3 && t.stateNode.current.memoizedState.isDehydrated) {
            a.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
            return;
          }
        }
      }
      a.blockedOn = null;
    }
    function ku(a) {
      if (a.blockedOn !== null) return !1;
      for (var e = a.targetContainers; 0 < e.length;) {
        var t = Os(a.nativeEvent);
        if (t === null) {
          t = a.nativeEvent;
          var l = new t.constructor(t.type, t);
          ((Jc = l), t.target.dispatchEvent(l), (Jc = null));
        } else return ((e = Cn(t)), e !== null && T0(e), (a.blockedOn = t), !1);
        e.shift();
      }
      return !0;
    }
    function Yd(a, e, t) {
      ku(a) && t.delete(e);
    }
    function jh() {
      ((Ds = !1),
        tl !== null && ku(tl) && (tl = null),
        ll !== null && ku(ll) && (ll = null),
        nl !== null && ku(nl) && (nl = null),
        Ti.forEach(Yd),
        Ai.forEach(Yd));
    }
    function hu(a, e) {
      a.blockedOn === e &&
        ((a.blockedOn = null),
        Ds || ((Ds = !0), qa.unstable_scheduleCallback(qa.unstable_NormalPriority, jh)));
    }
    var yu = null;
    function Gd(a) {
      yu !== a &&
        ((yu = a),
        qa.unstable_scheduleCallback(qa.unstable_NormalPriority, function () {
          yu === a && (yu = null);
          for (var e = 0; e < a.length; e += 3) {
            var t = a[e],
              l = a[e + 1],
              n = a[e + 2];
            if (typeof l != "function") {
              if (Nr(l || t) === null) continue;
              break;
            }
            var i = Cn(t);
            i !== null &&
              (a.splice(e, 3),
              (e -= 3),
              rs(i, { pending: !0, data: n, method: t.method, action: l }, l, n));
          }
        }));
    }
    function Tn(a) {
      function e(c) {
        return hu(c, a);
      }
      (tl !== null && hu(tl, a),
        ll !== null && hu(ll, a),
        nl !== null && hu(nl, a),
        Ti.forEach(e),
        Ai.forEach(e));
      for (var t = 0; t < Qt.length; t++) {
        var l = Qt[t];
        l.blockedOn === a && (l.blockedOn = null);
      }
      for (; 0 < Qt.length && ((t = Qt[0]), t.blockedOn === null);)
        (C0(t), t.blockedOn === null && Qt.shift());
      if (((t = (a.ownerDocument || a).$$reactFormReplay), t != null))
        for (l = 0; l < t.length; l += 3) {
          var n = t[l],
            i = t[l + 1],
            u = n[fe] || null;
          if (typeof i == "function") u || Gd(t);
          else if (u) {
            var o = null;
            if (i && i.hasAttribute("formAction")) {
              if (((n = i), (u = i[fe] || null))) o = u.formAction;
              else if (Nr(n) !== null) continue;
            } else o = u.action;
            (typeof o == "function" ? (t[l + 1] = o) : (t.splice(l, 3), (l -= 3)), Gd(t));
          }
        }
    }
    function O0() {
      function a(i) {
        i.canIntercept &&
          i.info === "react-transition" &&
          i.intercept({
            handler: function () {
              return new Promise(function (u) {
                return (n = u);
              });
            },
            focusReset: "manual",
            scroll: "manual",
          });
      }
      function e() {
        (n !== null && (n(), (n = null)), l || setTimeout(t, 20));
      }
      function t() {
        if (!l && !navigation.transition) {
          var i = navigation.currentEntry;
          i &&
            i.url != null &&
            navigation.navigate(i.url, {
              state: i.getState(),
              info: "react-transition",
              history: "replace",
            });
        }
      }
      if (typeof navigation == "object") {
        var l = !1,
          n = null;
        return (
          navigation.addEventListener("navigate", a),
          navigation.addEventListener("navigatesuccess", e),
          navigation.addEventListener("navigateerror", e),
          setTimeout(t, 100),
          function () {
            ((l = !0),
              navigation.removeEventListener("navigate", a),
              navigation.removeEventListener("navigatesuccess", e),
              navigation.removeEventListener("navigateerror", e),
              n !== null && (n(), (n = null)));
          }
        );
      }
    }
    function Tr(a) {
      this._internalRoot = a;
    }
    To.prototype.render = Tr.prototype.render = function (a) {
      var e = this._internalRoot;
      if (e === null) throw Error(z(409));
      var t = e.current,
        l = Ne();
      N0(t, l, a, e, null, null);
    };
    To.prototype.unmount = Tr.prototype.unmount = function () {
      var a = this._internalRoot;
      if (a !== null) {
        this._internalRoot = null;
        var e = a.containerInfo;
        (N0(a.current, 2, null, a, null, null), Mo(), (e[An] = null));
      }
    };
    function To(a) {
      this._internalRoot = a;
    }
    To.prototype.unstable_scheduleHydration = function (a) {
      if (a) {
        var e = nm();
        a = { blockedOn: null, target: a, priority: e };
        for (var t = 0; t < Qt.length && e !== 0 && e < Qt[t].priority; t++);
        (Qt.splice(t, 0, a), t === 0 && C0(a));
      }
    };
    var Xd = Qd.version;
    if (Xd !== "19.2.5") throw Error(z(527, Xd, "19.2.5"));
    la.findDOMNode = function (a) {
      var e = a._reactInternals;
      if (e === void 0)
        throw typeof a.render == "function"
          ? Error(z(188))
          : ((a = Object.keys(a).join(",")), Error(z(268, a)));
      return (
        (a = bv(e)),
        (a = a !== null ? Jd(a) : null),
        (a = a === null ? null : a.stateNode),
        a
      );
    };
    var Bh = {
      bundleType: 0,
      version: "19.2.5",
      rendererPackageName: "react-dom",
      currentDispatcherRef: B,
      reconcilerVersion: "19.2.5",
    };
    if (
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" &&
      (($n = __REACT_DEVTOOLS_GLOBAL_HOOK__), !$n.isDisabled && $n.supportsFiber)
    )
      try {
        ((Oi = $n.inject(Bh)), (Me = $n));
      } catch {}
    var $n;
    Ao.createRoot = function (a, e) {
      if (!Vd(a)) throw Error(z(299));
      var t = !1,
        l = "",
        n = Sp,
        i = xp,
        u = zp;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (t = !0),
          e.identifierPrefix !== void 0 && (l = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (i = e.onCaughtError),
          e.onRecoverableError !== void 0 && (u = e.onRecoverableError)),
        (e = M0(a, 1, !1, null, null, t, l, null, n, i, u, O0)),
        (a[An] = e.current),
        Sr(a),
        new Tr(e)
      );
    };
    Ao.hydrateRoot = function (a, e, t) {
      if (!Vd(a)) throw Error(z(299));
      var l = !1,
        n = "",
        i = Sp,
        u = xp,
        o = zp,
        c = null;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (l = !0),
          t.identifierPrefix !== void 0 && (n = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (i = t.onUncaughtError),
          t.onCaughtError !== void 0 && (u = t.onCaughtError),
          t.onRecoverableError !== void 0 && (o = t.onRecoverableError),
          t.formState !== void 0 && (c = t.formState)),
        (e = M0(a, 1, !0, e, t ?? null, l, n, c, i, u, o, O0)),
        (e.context = E0(null)),
        (t = e.current),
        (l = Ne()),
        (l = ks(l)),
        (n = It(l)),
        (n.callback = null),
        Pt(t, n, l),
        (t = l),
        (e.current.lanes = t),
        Ri(e, t),
        ut(e),
        (a[An] = e.current),
        Sr(a),
        new To(e)
      );
    };
    Ao.version = "19.2.5";
  });
  var _0 = Pe((b1, w0) => {
    "use strict";
    function R0() {
      if (!(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      ))
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(R0);
        } catch (a) {
          console.error(a);
        }
    }
    (R0(), (w0.exports = D0()));
  });
  var I0 = Pe((Uo) => {
    "use strict";
    var Zh = Symbol.for("react.transitional.element"),
      Kh = Symbol.for("react.fragment");
    function F0(a, e, t) {
      var l = null;
      if ((t !== void 0 && (l = "" + t), e.key !== void 0 && (l = "" + e.key), "key" in e)) {
        t = {};
        for (var n in e) n !== "key" && (t[n] = e[n]);
      } else t = e;
      return (
        (e = t.ref),
        { $$typeof: Zh, type: a, key: l, ref: e !== void 0 ? e : null, props: t }
      );
    }
    Uo.Fragment = Kh;
    Uo.jsx = F0;
    Uo.jsxs = F0;
  });
  var fa = Pe((C1, P0) => {
    "use strict";
    P0.exports = I0();
  });
  var Ng = K(_0(), 1);
  var Ye = K(Pa(), 1);
  var Je = K(Pa(), 1);
  var _t = K(Pa(), 1);
  function me(a, e) {
    try {
      let t = localStorage.getItem(a);
      if (t != null) return JSON.parse(t);
    } catch {}
    return e;
  }
  function Ze(a, e) {
    try {
      localStorage.setItem(a, JSON.stringify(e));
    } catch {}
  }
  function ot(a, e) {
    let [t, l] = (0, _t.useState)(() => me(a, e)),
      n = (0, _t.useRef)(t);
    n.current = t;
    let i = (0, _t.useCallback)(
      (u) => {
        let o = typeof u == "function" ? u(n.current) : u;
        ((n.current = o), l(o), Ze(a, o));
      },
      [a],
    );
    return [t, i];
  }
  function Ke() {
    try {
      if (crypto && "randomUUID" in crypto) return crypto.randomUUID();
    } catch {}
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function k0(a = 1e3) {
    let [e, t] = (0, _t.useState)(Date.now());
    return (
      (0, _t.useEffect)(() => {
        let l = setInterval(() => t(Date.now()), a);
        return () => clearInterval(l);
      }, [a]),
      e
    );
  }
  var pe = { lat: 4.9214, lng: -75.063 },
    Bi = { s: 4.903, n: 4.94, w: -75.083, e: -75.045 },
    Ar = [
      "Centro (Carrera 13)",
      "Parque Isidro Parra",
      "San Vicente",
      "Los Pinos",
      "Santa Rosa",
      "Jorge Eli\xE9cer Gait\xE1n",
      "Alfonso L\xF3pez",
      "El Pesebre",
      "La Polka",
      "Plaza de Mercado",
      "Primero de Mayo",
      "San Fernando",
      "Las Ferias",
      "Otro / zona rural",
    ];
  function Yh(a, e) {
    return {
      lat: pe.lat - e / 110540,
      lng: pe.lng + a / (111320 * Math.cos((pe.lat * Math.PI) / 180)),
    };
  }
  var fl = (a, e, t, l, n, i, u, o, c = "", d = "stop") => ({
      id: a,
      name: e,
      address: t,
      barrio: l,
      waste: n,
      estKg: i,
      ...Yh(u, o),
      status: "pending",
      kind: d,
      note: c,
    }),
    Cr = [
      fl(
        "p1",
        "Parque Principal Isidro Parra",
        "Carrera 13 con Calle 4",
        "Parque Isidro Parra",
        "blanca",
        650,
        -10,
        -30,
        "Zona comercial y bancaria.",
      ),
      fl(
        "p2",
        "Plaza de Mercado Municipal",
        "Carrera 10 con Calle 4",
        "Plaza de Mercado",
        "verde",
        1400,
        -150,
        -80,
        "Alta generaci\xF3n de org\xE1nicos.",
      ),
      fl(
        "p3",
        "Sector comercial Carrera 13",
        "Carrera 13 # 5-20",
        "Centro (Carrera 13)",
        "blanca",
        850,
        -10,
        60,
      ),
      fl(
        "p4",
        "Barrio San Vicente",
        "Calle 3 # 11-45",
        "San Vicente",
        "blanca",
        720,
        -60,
        -190,
        "Pendiente pronunciada.",
      ),
      fl("p5", "Barrio Los Pinos", "Carrera 12 # 4-28", "Los Pinos", "blanca", 580, -40, -70),
      fl(
        "p6",
        "Hospital Regional",
        "Carrera 15 con Calle 6",
        "Santa Rosa",
        "negra",
        950,
        150,
        120,
        "Solo ordinarios administrativos.",
      ),
      fl(
        "p7",
        "Barrio Jorge Eli\xE9cer Gait\xE1n",
        "Calle 2 # 13-10",
        "Jorge Eli\xE9cer Gait\xE1n",
        "blanca",
        640,
        30,
        -250,
      ),
      fl(
        "st",
        "Estaci\xF3n de transferencia La Polka",
        "V\xEDa salida a Armero-Guayabal",
        "La Polka",
        "mixto",
        0,
        300,
        -220,
        "Descarga y pesaje.",
        "station",
      ),
    ],
    dl = [],
    ct = {
      blanca: { label: "Aprovechable", bag: "Bolsa blanca", color: "#d9ded9", short: "Blanca" },
      verde: {
        label: "Org\xE1nico aprovechable",
        bag: "Bolsa verde",
        color: "#3a9d63",
        short: "Verde",
      },
      negra: { label: "No aprovechable", bag: "Bolsa negra", color: "#2b2f2d", short: "Negra" },
      roja: {
        label: "Especial / posconsumo",
        bag: "Entrega aparte",
        color: "#c4493d",
        short: "Especial",
      },
    };
  function Co(a) {
    let e = dl.find((t) => t.frac === a);
    return e ? e.dayLabel.toLowerCase() : "";
  }
  function L0(a, e = new Date()) {
    let t = dl.find((l) => l.frac === a);
    if (!t) return null;
    for (let l = 0; l < 8; l++) {
      let n = new Date(e.getFullYear(), e.getMonth(), e.getDate() + l);
      if (t.days.includes(n.getDay())) return { date: n, today: l === 0 };
    }
    return null;
  }
  var Oo = [
      { id: "derrumbe", label: "Derrumbe o deslizamiento" },
      { id: "bache", label: "Bache o hundimiento" },
      { id: "accidente", label: "Accidente de tr\xE1nsito" },
      { id: "bloqueo", label: "V\xEDa bloqueada" },
      { id: "contenedor", label: "Contenedor da\xF1ado" },
    ],
    Do = [
      { id: "acumulacion", label: "Basura acumulada" },
      { id: "no_paso", label: "El cami\xF3n no pas\xF3" },
      { id: "botadero", label: "Botadero o quema" },
      { id: "contenedor", label: "Contenedor da\xF1ado" },
    ];
  var Gh = () => ({
      blanca: `Cami\xF3n EcoRuta: ${Co("blanca")}.`,
      verde: `Cami\xF3n EcoRuta: ${Co("verde")}.`,
      negra: `Cami\xF3n EcoRuta: ${Co("negra")}.`,
    }),
    Ro =
      "No va al cami\xF3n de basura. Pregunta en la Alcald\xEDa o en EMSER por el punto de entrega activo en L\xEDbano.";
  function kn(a) {
    return a
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9ñ ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function Xh() {
    let a = Gh();
    return [
      {
        id: "pet",
        name: "Botellas y envases pl\xE1sticos",
        frac: "blanca",
        keys: [
          "botella plastica",
          "botella",
          "botellas",
          "pet",
          "garrafa",
          "bidon",
          "tapa",
          "tapas",
          "envase plastico",
          "envases",
          "plastico",
          "plasticos",
          "vaso plastico",
          "galon",
        ],
        steps: [
          "Vac\xEDa el contenido y enjuaga r\xE1pido.",
          "Apl\xE1stalo y ponle la tapa para ahorrar espacio.",
          "D\xE9jalo secar y gu\xE1rdalo en la bolsa blanca.",
        ],
        where: a.blanca + " Tambi\xE9n puedes entregarlo directamente a recicladores de oficio.",
        why: "El pl\xE1stico limpio se recicla; mojado o con restos de comida pierde valor y termina en el relleno.",
        tip: "Separa las tapas y etiquetas si puedes: son pl\xE1sticos distintos.",
      },
      {
        id: "bolsa",
        name: "Bolsas y empaques pl\xE1sticos limpios",
        frac: "blanca",
        keys: [
          "bolsa plastica",
          "bolsas plasticas",
          "bolsa de plastico",
          "empaque plastico",
          "plastico de envolver",
          "film",
        ],
        steps: [
          "Sac\xFAdelas y verifica que est\xE9n secas y sin comida.",
          "J\xFAntalas dentro de una sola bolsa.",
          "Entr\xE9galas en la bolsa blanca.",
        ],
        where: a.blanca,
        why: "Las bolsas sueltas se vuelan y tapan quebradas y alcantarillas.",
        tip: "Reutiliza las bolsas antes de desecharlas.",
      },
      {
        id: "icopor",
        name: "Icopor (poliestireno expandido)",
        frac: "negra",
        keys: ["icopor", "poliestireno", "unicel", "anime"],
        steps: ["Quita restos de comida.", "M\xE9telo en la bolsa negra bien cerrado."],
        where: a.negra,
        why: "Casi no hay gestores que lo reciclen en la regi\xF3n.",
        tip: "Pide el domicilio y las comidas sin empaque de icopor.",
      },
      {
        id: "carton",
        name: "Cart\xF3n y cartulina secos",
        frac: "blanca",
        keys: [
          "carton",
          "cartulina",
          "caja de carton",
          "cajas",
          "caja",
          "huevera",
          "carton de huevos",
        ],
        steps: [
          "Quita cintas, grapas y pl\xE1sticos.",
          "Desarma la caja y apl\xE1nala.",
          "Mant\xE9nla seca y entr\xE9gala en la bolsa blanca o amarrada.",
        ],
        where: a.blanca,
        why: "El cart\xF3n seco es de los materiales que m\xE1s valor tienen para los recicladores.",
        tip: "Si se moja se da\xF1a: gu\xE1rdalo bajo techo hasta el d\xEDa de recolecci\xF3n.",
      },
      {
        id: "carton-sucio",
        name: "Cart\xF3n o papel grasoso / sucio",
        frac: "negra",
        keys: [
          "carton sucio",
          "carton grasoso",
          "caja de pizza",
          "pizza",
          "papel grasoso",
          "papel sucio",
        ],
        steps: [
          "Separa la parte limpia (la tapa suele servir) para la bolsa blanca.",
          "La parte con grasa o comida va a la bolsa negra.",
        ],
        where: a.negra,
        why: "La grasa arruina la pulpa de papel en el reciclaje.",
        tip: "Un trozo grasoso puede da\xF1ar toda una carga de cart\xF3n limpio.",
      },
      {
        id: "papel",
        name: "Papel, peri\xF3dico y revistas",
        frac: "blanca",
        keys: [
          "papel",
          "periodico",
          "periodicos",
          "revista",
          "cuaderno",
          "cuadernos",
          "hojas",
          "folder",
          "libro",
          "libros",
          "sobres",
        ],
        steps: [
          "Quita ganchos, espirales y pl\xE1sticos.",
          "Mantenlo seco y sin arrugar demasiado.",
          "Entr\xE9galo en la bolsa blanca.",
        ],
        where: a.blanca,
        why: "Reciclar papel evita cortar m\xE1s \xE1rboles y reduce residuos.",
        tip: "Usa las dos caras antes de reciclar.",
      },
      {
        id: "higienico",
        name: "Papel higi\xE9nico, servilletas y pa\xF1uelos usados",
        frac: "negra",
        keys: [
          "papel higienico",
          "servilleta",
          "servilletas",
          "panuelo",
          "panuelos",
          "papel de bano",
          "toalla de papel",
          "papel toalla",
          "kleenex",
        ],
        steps: ["Re\xFAnelo en la bolsa negra.", "Cierra la bolsa con doble nudo."],
        where: a.negra,
        why: "Por higiene no se puede reciclar ni compostar.",
        tip: "Las servilletas con solo restos de comida pueden ir a la bolsa verde si no hay otras sustancias.",
      },
      {
        id: "vidrio",
        name: "Vidrio (botellas y frascos)",
        frac: "blanca",
        keys: [
          "vidrio",
          "vidrios",
          "frasco de vidrio",
          "frascos de vidrio",
          "botella de vidrio",
          "botellas de vidrio",
          "tarro de vidrio",
          "tarros de vidrio",
          "frasco",
          "frascos",
        ],
        steps: [
          "Enjuaga y quita tapas.",
          "Entr\xE9galo entero, sin romper.",
          "Ponlo en una bolsa blanca aparte, sin que golpee otros materiales.",
        ],
        where: a.blanca,
        why: "El vidrio se recicla muchas veces sin perder calidad.",
        tip: "Reutiliza frascos para guardar alimentos secos.",
      },
      {
        id: "vidrio-roto",
        name: "Vidrio roto",
        frac: "blanca",
        keys: [
          "vidrio roto",
          "vidrios rotos",
          "cristal roto",
          "botella rota",
          "botella quebrada",
          "vidrio quebrado",
        ],
        steps: [
          "Recoge con guantes y no con las manos.",
          "Envu\xE9lvelo en papel o cart\xF3n grueso.",
          'Rotula "VIDRIO" para proteger a quien recoge.',
        ],
        where: a.blanca,
        why: "Los cortes con vidrio son de los accidentes m\xE1s comunes de los recolectores.",
        tip: "Nunca lo metas suelto en una bolsa de pl\xE1stico delgada.",
      },
      {
        id: "lata",
        name: "Latas de aluminio y hojalata",
        frac: "blanca",
        keys: ["lata", "latas", "aluminio", "hojalata", "lata de atun", "lata de gaseosa"],
        steps: [
          "Enju\xE1gala.",
          "Apl\xE1stala si es de gaseosa o cerveza.",
          "Entr\xE9gala en la bolsa blanca.",
        ],
        where: a.blanca,
        why: "El aluminio se recicla casi sin l\xEDmite y ahorra mucha energ\xEDa.",
        tip: "Las latas de aluminio son de las que m\xE1s pagan los recicladores.",
      },
      {
        id: "chatarra",
        name: "Chatarra y metales",
        frac: "blanca",
        keys: [
          "chatarra",
          "metal",
          "metales",
          "hierro",
          "cobre",
          "tuberia",
          "alambre",
          "clavos",
          "varilla",
          "laton",
        ],
        steps: ["Sep\xE1rala del resto de residuos.", "No la dejes suelta en la calle."],
        where:
          "Entr\xE9gala a una chatarrer\xEDa o a recicladores de oficio; no cabe en la bolsa del cami\xF3n.",
        why: "Los metales se funden y se reutilizan.",
        tip: "El cobre y el bronce suelen pagarse por kilo.",
      },
      {
        id: "tetrapak",
        name: "Cajas de leche o jugo (multicapa)",
        frac: "blanca",
        keys: ["tetra pak", "tetrapak", "caja de leche", "caja de jugo", "tetra", "multicapa"],
        steps: ["Enju\xE1gala y d\xE9jala escurrir.", "Apl\xE1stala y ponla con la bolsa blanca."],
        where: a.blanca,
        why: "Sus capas de cart\xF3n, pl\xE1stico y aluminio se pueden separar en plantas especializadas.",
        tip: "Si hay poca recolecci\xF3n en tu zona, pregunta a los recicladores si la reciben.",
      },
      {
        id: "metalizado",
        name: "Empaques metalizados y envolturas",
        frac: "negra",
        keys: [
          "papas fritas",
          "paquete de papas",
          "empaque metalizado",
          "metalizado",
          "snack",
          "envoltura",
          "envolturas",
          "chocolatina",
          "empaque de dulce",
          "empaque",
        ],
        steps: ["Vac\xEDa el contenido.", "M\xE9telos en la bolsa negra."],
        where: a.negra,
        why: "Son materiales mezclados que hoy casi no se reciclan.",
        tip: "Elegir productos a granel o con menos empaque reduce este residuo.",
      },
      {
        id: "organico",
        name: "Restos de comida, frutas y verduras",
        frac: "verde",
        keys: [
          "cascara",
          "cascaras",
          "fruta",
          "frutas",
          "verdura",
          "verduras",
          "comida",
          "sobras",
          "restos de comida",
          "platano",
          "banano",
          "yuca",
          "arroz",
          "pan",
          "cocina",
          "organico",
          "organicos",
          "mazorca",
          "tomate",
          "papa",
          "naranja",
          "limon",
        ],
        steps: [
          "Sep\xE1ralos sin pl\xE1sticos, grapas ni servilletas.",
          "Esc\xFArrelos para que no escurran l\xEDquido.",
          "Ponlos en la bolsa verde.",
        ],
        where: a.verde + " Si tienes patio, puedes hacer compost casero.",
        why: "Los org\xE1nicos son m\xE1s de la mitad del peso de la basura en municipios cafeteros y, enterrados, producen metano.",
        tip: "Un balde con tapa y una cama de hojas secas evita malos olores.",
      },
      {
        id: "cafe",
        name: "Borra, pulpa y pasilla de caf\xE9",
        frac: "verde",
        keys: [
          "borra",
          "cafe",
          "pulpa de cafe",
          "pasilla",
          "cisco",
          "cereza de cafe",
          "cafetal",
          "tinto",
        ],
        steps: [
          "Esc\xFArrela y d\xE9jala airear un rato.",
          "Ponla en la bolsa verde, sin filtros pl\xE1sticos.",
        ],
        where: a.verde + " En finca, mejor compostarla.",
        why: "La pulpa de caf\xE9 sin manejar contamina quebradas; compostada es un buen abono.",
        tip: "M\xE9zclala con hojas secas o poda para compostar mejor.",
      },
      {
        id: "carne",
        name: "Carnes, huesos, l\xE1cteos y comida cocinada",
        frac: "verde",
        keys: [
          "carne",
          "pollo",
          "pescado",
          "hueso",
          "huesos",
          "lacteos",
          "queso",
          "leche",
          "embutidos",
          "comida cocinada",
        ],
        steps: [
          "Esc\xFArrelos y envu\xE9lvelos bien.",
          "Ponlos en la bolsa verde y s\xE1calos justo el d\xEDa de recolecci\xF3n.",
        ],
        where: a.verde + " Evita compostarlos en casa: atraen animales.",
        why: "Son org\xE1nicos, pero se descomponen r\xE1pido y generan olores.",
        tip: "Si hace calor, gu\xE1rdalos en la nevera hasta el d\xEDa de recolecci\xF3n.",
      },
      {
        id: "poda",
        name: "Hojas secas, poda y ramas peque\xF1as",
        frac: "verde",
        keys: [
          "poda",
          "podas",
          "hojas secas",
          "ramas",
          "cesped",
          "pasto",
          "hojarasca",
          "jardin",
          "maleza",
        ],
        steps: [
          "Corta las ramas en trozos peque\xF1os y am\xE1rralas.",
          "Ponlas en bolsa verde o atadas.",
        ],
        where:
          a.verde +
          " Las podas grandes: pide recolecci\xF3n especial a EMSER, no las dejes en la v\xEDa.",
        why: "Las ramas en la calle tapan sumideros y generan riesgos.",
        tip: "Las hojas secas son perfectas para equilibrar el compost.",
      },
      {
        id: "aceite",
        name: "Aceite de cocina usado",
        frac: "roja",
        keys: ["aceite usado", "aceite de cocina", "aceite", "fritura", "grasa de cocina"],
        steps: [
          "D\xE9jalo enfriar por completo.",
          "F\xEDltralo y gu\xE1rdalo en una botella pl\xE1stica cerrada.",
          "Nunca lo botes por el lavaplatos ni al suelo.",
        ],
        where: Ro + " Mientras tanto gu\xE1rdalo bien cerrado.",
        why: "Un litro de aceite contamina mucha agua y tapa las tuber\xEDas.",
        tip: "Absorbe peque\xF1as cantidades con papel y bota ese papel a la bolsa negra.",
      },
      {
        id: "pilas",
        name: "Pilas y bater\xEDas",
        frac: "roja",
        keys: ["pila", "pilas", "bateria", "baterias", "bateria de celular"],
        steps: [
          "Cubre los polos con cinta.",
          "Gu\xE1rdalas en un frasco seco con tapa.",
          "No las quemes ni las abras.",
        ],
        where: Ro + ' Existen programas como "Pilas con el Ambiente".',
        why: "Contienen metales pesados que contaminan suelo y agua.",
        tip: "Cambia a pilas recargables cuando puedas.",
      },
      {
        id: "bombillo",
        name: "Bombillos y tubos fluorescentes",
        frac: "roja",
        keys: [
          "bombillo",
          "bombillos",
          "bombilla",
          "bombillas",
          "fluorescente",
          "led",
          "ahorrador",
        ],
        steps: [
          "Gu\xE1rdalo en su caja o envuelto para que no se rompa.",
          "No lo botes en la bolsa com\xFAn.",
          "Si se rompe, ventila el cuarto y recoge con guantes.",
        ],
        where: Ro + " Existen programas posconsumo para bombillas.",
        why: "Los fluorescentes contienen mercurio.",
        tip: "Los LED duran mucho m\xE1s y no tienen mercurio.",
      },
      {
        id: "medicina",
        name: "Medicamentos vencidos",
        frac: "roja",
        keys: [
          "medicamento",
          "medicamentos",
          "pastilla",
          "pastillas",
          "jarabe",
          "vencido",
          "vencidos",
          "medicina",
          "medicinas",
          "blister",
          "droga",
          "drogas",
          "pomada",
        ],
        steps: [
          "D\xE9jalos en su empaque, tapados.",
          "No los botes al inodoro ni a la basura com\xFAn.",
          "Ll\xE9valos a un punto de recolecci\xF3n.",
        ],
        where:
          'Pregunta en farmacias o en el puesto de salud por el contenedor de medicamentos vencidos (programa "Punto Azul").',
        why: "Los medicamentos en el agua afectan fuentes h\xEDdricas y fauna.",
        tip: "Compra solo la cantidad que necesites.",
      },
      {
        id: "cortopunzante",
        name: "Jeringas, agujas y objetos cortopunzantes",
        frac: "roja",
        keys: [
          "jeringa",
          "jeringas",
          "aguja",
          "agujas",
          "bisturi",
          "lanceta",
          "lancetas",
          "cuchilla",
          "navaja",
          "cortopunzante",
        ],
        steps: [
          "No tapes ni dobles la aguja.",
          'Ponla dentro de una botella pl\xE1stica dura con tapa y rotula "CORTOPUNZANTE".',
          "Ll\xE9vala a un centro de salud.",
        ],
        where:
          "Entr\xE9gala en el hospital o puesto de salud. No la pongas en la bolsa del cami\xF3n.",
        why: "Puede lastimar a quien recoge y transmitir enfermedades.",
        tip: "Nunca vuelvas a meter la aguja en la tapa con la mano.",
      },
      {
        id: "panales",
        name: "Pa\xF1ales, toallas higi\xE9nicas y art\xEDculos sanitarios",
        frac: "negra",
        keys: [
          "panal",
          "panales",
          "toalla higienica",
          "toallas higienicas",
          "tampon",
          "tampones",
          "condon",
          "preservativo",
          "curita",
          "algodon",
          "hisopo",
          "hisopos",
        ],
        steps: [
          "Envu\xE9lvelos en una bolsa peque\xF1a.",
          "Ponlos en la bolsa negra y ci\xE9rrala.",
        ],
        where: a.negra,
        why: "Son residuos sanitarios que no se reciclan.",
        tip: "Los pa\xF1ales de tela reducen mucho este residuo.",
      },
      {
        id: "mascarilla",
        name: "Tapabocas y guantes desechables",
        frac: "negra",
        keys: ["tapabocas", "mascarilla", "mascarillas", "cubrebocas", "guantes", "guante"],
        steps: [
          "Corta las tiras del tapabocas.",
          "Ponlos en una bolsa cerrada dentro de la bolsa negra.",
        ],
        where: a.negra,
        why: "Son residuos sanitarios y las tiras pueden atrapar animales.",
        tip: "Los tapabocas de tela se lavan y se reutilizan.",
      },
      {
        id: "colillas",
        name: "Colillas y cigarrillos",
        frac: "negra",
        keys: [
          "colilla",
          "colillas",
          "cigarrillo",
          "cigarrillos",
          "tabaco",
          "ceniza de cigarrillo",
        ],
        steps: [
          "Ap\xE1galas por completo con agua.",
          "Ponlas en un frasco o bolsa peque\xF1a cerrada.",
          "Va a la bolsa negra.",
        ],
        where: a.negra,
        why: "Las colillas tienen pl\xE1stico y t\xF3xicos que contaminan el agua.",
        tip: "Nunca las tires al suelo ni al sif\xF3n.",
      },
      {
        id: "barrido",
        name: "Barrido, polvo, cabello y cenizas",
        frac: "negra",
        keys: [
          "barrido",
          "polvo",
          "tierra",
          "ceniza",
          "cenizas",
          "cabello",
          "pelo",
          "basura de barrer",
        ],
        steps: [
          "Verifica que las cenizas est\xE9n fr\xEDas.",
          "M\xE9telo en una bolsa negra cerrada.",
        ],
        where: a.negra,
        why: "No se aprovecha y debe ir al relleno sanitario.",
        tip: "Moja un poco el polvo para que no se disperse.",
      },
      {
        id: "ceramica",
        name: "Cer\xE1mica, loza, espejos y vidrio plano",
        frac: "negra",
        keys: [
          "ceramica",
          "plato roto",
          "loza",
          "porcelana",
          "espejo",
          "vidrio de ventana",
          "taza rota",
          "vaso roto",
        ],
        steps: [
          "Envu\xE9lvelo en papel o cart\xF3n.",
          'Rotula "VIDRIO/CER\xC1MICA" y ponlo en la bolsa negra.',
        ],
        where: a.negra,
        why: "No se recicla con el vidrio de envases porque se funde a otra temperatura.",
        tip: "Un plato roto no va con las botellas de vidrio.",
      },
      {
        id: "excremento",
        name: "Heces de mascotas y arena sanitaria",
        frac: "negra",
        keys: [
          "excremento",
          "excrementos",
          "heces",
          "popo",
          "caca",
          "arena de gato",
          "arena sanitaria",
        ],
        steps: ["Rec\xF3gelo con una bolsa peque\xF1a.", "An\xFAdala y ponla en la bolsa negra."],
        where: a.negra,
        why: "Puede contaminar el suelo y las quebradas con par\xE1sitos.",
        tip: "No lo eches al inodoro si la bolsa es de pl\xE1stico.",
      },
      {
        id: "ropa",
        name: "Ropa, zapatos y textiles",
        frac: "negra",
        keys: [
          "ropa",
          "camisa",
          "pantalon",
          "zapato",
          "zapatos",
          "tenis",
          "cobija",
          "textil",
          "textiles",
          "trapo",
          "trapos",
          "sabana",
          "sabanas",
        ],
        steps: [
          "Si est\xE1 en buen estado, d\xF3nala.",
          "Si est\xE1 rota, dale otro uso (trapos).",
          "Lo que no sirva va a la bolsa negra.",
        ],
        where: "Dona a iglesias, fundaciones o vecinos. Lo inservible: " + a.negra,
        why: "Los textiles tardan much\xEDsimo en degradarse.",
        tip: "Arreglar o intercambiar ropa evita residuos.",
      },
      {
        id: "raee",
        name: "Aparatos electr\xF3nicos y el\xE9ctricos",
        frac: "roja",
        keys: [
          "celular",
          "celulares",
          "computador",
          "portatil",
          "televisor",
          "tv",
          "cargador",
          "cable",
          "cables",
          "electrodomestico",
          "licuadora",
          "impresora",
          "radio",
          "teclado",
          "consola",
          "electronico",
          "electronicos",
          "raee",
        ],
        steps: [
          "Quita pilas o bater\xEDas por separado.",
          "Gu\xE1rdalo completo, sin desarmar.",
          "Entr\xE9galo en un punto posconsumo.",
        ],
        where: Ro + " Hay programas de posconsumo de computadores y electrodom\xE9sticos.",
        why: "Tienen metales valiosos y t\xF3xicos.",
        tip: "Antes de botarlo, mira si se puede reparar o donar.",
      },
      {
        id: "llanta",
        name: "Llantas usadas",
        frac: "roja",
        keys: ["llanta", "llantas", "neumatico", "neumaticos"],
        steps: [
          "No las quemes ni las dejes en lotes o quebradas.",
          "Entr\xE9galas en la llanter\xEDa donde compres las nuevas.",
        ],
        where:
          'Devu\xE9lvelas a la llanter\xEDa: muchas participan en programas de recolecci\xF3n (p. ej. "Rueda Verde").',
        why: "Acumulan agua y cr\xEDan zancudos; quemadas contaminan el aire.",
        tip: "Un buen mantenimiento alarga su vida \xFAtil.",
      },
      {
        id: "escombros",
        name: "Escombros y residuos de construcci\xF3n",
        frac: "roja",
        keys: [
          "escombro",
          "escombros",
          "ladrillo",
          "ladrillos",
          "cemento",
          "arena",
          "concreto",
          "teja",
          "tejas",
          "bloque",
          "bloques",
          "demolicion",
          "obra",
        ],
        steps: [
          "No los saques en bolsas a la calle.",
          "Gu\xE1rdalos dentro del predio.",
          "Pide informaci\xF3n sobre sitios autorizados.",
        ],
        where:
          "Consulta en la Alcald\xEDa por la escombrera o el servicio autorizado. No va con el cami\xF3n de basura.",
        why: "Los escombros en v\xEDas y quebradas generan derrumbes y taponamientos.",
        tip: "Parte del escombro limpio se puede reutilizar como relleno.",
      },
      {
        id: "voluminoso",
        name: "Muebles, colchones y voluminosos",
        frac: "roja",
        keys: [
          "mueble",
          "muebles",
          "colchon",
          "colchones",
          "sofa",
          "silla",
          "sillas",
          "mesa",
          "cama",
          "closet",
          "armario",
          "voluminoso",
          "voluminosos",
          "nevera",
        ],
        steps: [
          "No los dejes en la calle.",
          "Solicita recolecci\xF3n de voluminosos a EMSER o a la Alcald\xEDa.",
          "Si sirven, d\xF3nalos.",
        ],
        where: "Solicita recolecci\xF3n especial a EMSER o a la Alcald\xEDa.",
        why: "Bloquean andenes y v\xEDas y se convierten en botaderos.",
        tip: "Los muebles en buen estado se pueden donar.",
      },
      {
        id: "agroquimico",
        name: "Envases de agroqu\xEDmicos",
        frac: "roja",
        keys: [
          "agroquimico",
          "agroquimicos",
          "fungicida",
          "insecticida",
          "herbicida",
          "veneno",
          "fertilizante",
          "plaguicida",
          "envase de agroquimico",
          "roya",
          "glifosato",
        ],
        steps: [
          "Haz triple lavado y vierte el agua en el tanque de aplicaci\xF3n.",
          "Perfora el envase para que nadie lo reutilice.",
          "Gu\xE1rdalo aparte, bajo techo.",
        ],
        where:
          'Entr\xE9galos en la tienda agropecuaria o en el comit\xE9 de cafeteros (programas como "Campo Limpio").',
        why: "Son residuos peligrosos que contaminan fuentes de agua.",
        tip: "Nunca reutilices envases de agroqu\xEDmicos para agua o comida.",
      },
      {
        id: "pintura",
        name: "Pinturas, solventes y qu\xEDmicos",
        frac: "roja",
        keys: [
          "pintura",
          "pinturas",
          "solvente",
          "solventes",
          "thinner",
          "varsol",
          "gasolina",
          "aceite de motor",
          "aceite lubricante",
          "aerosol",
          "aerosoles",
          "spray",
          "pegante",
          "quimico",
          "quimicos",
          "cloro",
          "acido",
          "removedor",
        ],
        steps: [
          "D\xE9jalos en su envase original bien cerrado.",
          "No los mezcles ni los viertas al desag\xFCe.",
          "Gu\xE1rdalos fuera del alcance de ni\xF1os y del sol.",
        ],
        where:
          "Entrega en puntos de recolecci\xF3n de residuos peligrosos; consulta a la Alcald\xEDa.",
        why: "Son t\xF3xicos e inflamables.",
        tip: "Compra solo la cantidad que vas a usar.",
      },
    ];
  }
  var Qh = /(grasa|grasos|sucio|sucia|mojad|usado|usada|contamin|comida|aceitos)/;
  function U0(a) {
    let e = " " + kn(a) + " ",
      t = Xh(),
      l = new Array(e.length).fill(!1),
      n = [];
    for (let o of t) for (let c of o.keys) n.push({ e: o, k: kn(c) });
    n.sort((o, c) => c.k.length - o.k.length);
    let i = new Map();
    for (let { e: o, k: c } of n) {
      let d = 0;
      for (;;) {
        let g = e.indexOf(c, d);
        if (g < 0) break;
        d = g + 1;
        let b = e[g - 1],
          m = !b || b === " ",
          f = g + c.length,
          x = e[f],
          S = c.length <= 4 ? !x || x === " " : !0;
        if (!m || !S) continue;
        let T = !0;
        for (let r = g; r < f; r++)
          if (l[r]) {
            T = !1;
            break;
          }
        if (!T) continue;
        for (let r = g; r < f; r++) l[r] = !0;
        let s = i.get(o.id);
        (!s || g < s.pos) && i.set(o.id, { e: o, pos: g });
      }
    }
    let u = [...i.values()].sort((o, c) => o.pos - c.pos).map((o) => o.e);
    if (Qh.test(e) && !u.some((o) => o.id === "carton-sucio")) {
      let o = t.find((c) => c.id === "carton-sucio");
      u = u.map((c) => (c.id === "carton" || c.id === "papel" ? o : c));
    }
    return (
      (u = u.filter((o, c) => u.findIndex((d) => d.id === o.id) === c)),
      { items: u.slice(0, 5), matchedAny: u.length > 0, source: "local" }
    );
  }
  var q0 = [
    "Botellas de gaseosa y cart\xF3n",
    "Borra de caf\xE9 y c\xE1scaras",
    "Pilas y bombillos",
    "Aceite de cocina usado",
    "Caja de pizza con grasa",
    "Envases de fungicida",
  ];
  var H0 = "ecoruta.server",
    Ln = "ecoruta.shared.trucks",
    Un = "ecoruta.shared.reports",
    Yi = "ecoruta.outbox",
    Gi = () => me(H0, ""),
    j0 = (a) => Ze(H0, a.trim().replace(/\/+$/, ""));
  async function st(a, e = {}) {
    if (!Gi() && !location.protocol.startsWith("http")) throw new Error("sin servidor");
    let t = new AbortController(),
      l = setTimeout(() => t.abort(), e.timeout ?? 6e3);
    try {
      let n = await fetch(Gi() + a, {
        method: e.method || "GET",
        headers: { "Content-Type": "application/json", ...(e.pin ? { "x-pin": e.pin } : {}) },
        body: e.body !== void 0 ? JSON.stringify(e.body) : void 0,
        signal: t.signal,
      });
      if (!n.ok) throw Object.assign(new Error("http " + n.status), { status: n.status });
      if (!(n.headers.get("content-type") || "").includes("json")) throw new Error("not json");
      return await n.json();
    } finally {
      clearTimeout(l);
    }
  }
  function B0() {
    let [a, e] = (0, Je.useState)(typeof navigator > "u" ? !0 : navigator.onLine);
    return (
      (0, Je.useEffect)(() => {
        let t = () => e(!0),
          l = () => e(!1);
        return (
          window.addEventListener("online", t),
          window.addEventListener("offline", l),
          () => {
            (window.removeEventListener("online", t), window.removeEventListener("offline", l));
          }
        );
      }, []),
      a
    );
  }
  function Y0() {
    let [a, e] = (0, Je.useState)({ ok: !1, pinRequired: !1, gemini: !1, checked: !1 }),
      t = (0, Je.useRef)(() => {});
    return (
      (t.current = () => {
        st("/api/status", { timeout: 4e3 })
          .then(
            (l) => (
              (window.__ecoTiles = !!l.tiles),
              e({ ok: !0, pinRequired: !!l.pinRequired, gemini: !!l.gemini, checked: !0 })
            ),
          )
          .catch(() => e((l) => ({ ...l, ok: !1, checked: !0 })));
      }),
      (0, Je.useEffect)(() => {
        t.current();
        let l = setInterval(() => t.current(), 2e4),
          n = () => t.current();
        return (
          window.addEventListener("online", n),
          () => {
            (clearInterval(l), window.removeEventListener("online", n));
          }
        );
      }, []),
      { ...a, refresh: () => t.current() }
    );
  }
  var ecoPostAt = 0;
  async function G0(a, e, t) {
    let l = me(Ln, {});
    ((l[a.id] = a), Ze(Ln, l), window.__ecoTrack && window.__ecoTrack(a, e, Gi()));
    if (a.status !== "fuera" && ecoPostAt && Date.now() - ecoPostAt < 7e3) return "busy";
    let n = t ? a : { ...a, geometry: void 0 };
    ecoPostAt = Date.now();
    try {
      let r = await st("/api/truck", { method: "POST", body: n, pin: e, timeout: 5e3 });
      return (window.__ecoPinOk && window.__ecoPinOk("truck"), r && r.needGeometry ? "need" : !0);
    } catch (i) {
      return i && i.status === 401
        ? (window.__ecoPinBad && window.__ecoPinBad("truck"), "pin")
        : !1;
    } finally {
      ecoPostAt = 0;
    }
  }
  function X0(...a) {
    let e = new Map();
    for (let t of a)
      for (let l of t) {
        let n = e.get(l.id);
        (!n || (l.status === "resuelto" && n.status !== "resuelto")) && e.set(l.id, l);
      }
    return [...e.values()].sort((t, l) => l.ts - t.ts).slice(0, 200);
  }
  async function Or() {
    let a = me(Yi, []);
    if (!a.length) return 0;
    let e = [],
      t = 0;
    for (let l of a)
      try {
        (await st("/api/reports", { method: "POST", body: l.report, pin: l.pin, timeout: 5e3 }),
          l.pin && window.__ecoPinOk && window.__ecoPinOk("report"),
          t++);
      } catch (n) {
        let i = n.status;
        i === 401 && window.__ecoPinBad && window.__ecoPinBad("report");
        if (i === 400 || i === 413) continue;
        e.push(l);
      }
    return (Ze(Yi, e), t);
  }
  function wo() {
    return me(Yi, []).length;
  }
  async function qn(a, e = "") {
    return (
      Ze(Un, X0([a], me(Un, []))),
      Ze(Yi, [...me(Yi, []), { report: a, pin: e }]),
      await Or(),
      wo() === 0 ? "sent" : "queued"
    );
  }
  async function Dr(a, e) {
    let t = me(Un, []).map((l) => (l.id === a ? { ...l, status: "resuelto" } : l));
    Ze(Un, t);
    try {
      await st(`/api/reports/${encodeURIComponent(a)}/resolve`, {
        method: "POST",
        pin: e,
        timeout: 5e3,
      });
    } catch (i) {
      i && i.status === 401 && window.__ecoPinBad && window.__ecoPinBad("report");
    }
  }
  function Q0(a = 5e3) {
    let [e, t] = (0, Je.useState)({ trucks: [], reports: [], serverOk: !1, lastSync: 0 }),
      l = (0, Je.useRef)({}),
      ecoLast = (0, Je.useRef)(null);
    return (
      (0, Je.useEffect)(() => {
        let n = !0,
          i = () => {
            let d = me(Ln, {}),
              g = Date.now();
            return Object.values(d).map((b) => ({ ...b, ageSec: Math.max(0, (g - b.ts) / 1e3) }));
          },
          u = async () => {
            let d = i(),
              g = me(Un, []),
              b = [],
              m = [],
              f = !1,
              t0 = Date.now();
            try {
              let S = await st("/api/truck", { timeout: 4500 });
              ((b = S.trucks.map(
                (s) => (
                  s.geometry && s.geometry.length
                    ? (l.current[s.id] = { ver: s.routeVer, geo: s.geometry })
                    : l.current[s.id] && (s.geometry = l.current[s.id].geo),
                  { ...s, ageSec: Math.max(0, (S.now - s.receivedAt) / 1e3) }
                ),
              )),
                (ecoLast.current = { at: Date.now(), list: b }),
                (m = (await st("/api/reports", { timeout: 4500 })).reports),
                (f = !0));
            } catch {
              ecoLast.current &&
                ecoLast.current.at < t0 &&
                (b = ecoLast.current.list
                  .map((s) => ({
                    ...s,
                    ageSec: (s.ageSec || 0) + (Date.now() - ecoLast.current.at) / 1e3,
                  }))
                  .filter((s) => s.ageSec < 1800));
            }
            if (!n) return;
            let x = new Map();
            for (let S of [...d, ...b]) {
              let T = x.get(S.id);
              (!T || (S.ageSec ?? 1e9) < (T.ageSec ?? 1e9)) &&
                x.set(S.id, { ...S, geometry: S.geometry || T?.geometry });
            }
            t({ trucks: [...x.values()], reports: X0(m, g), serverOk: f, lastSync: Date.now() });
          };
        u();
        let o = setInterval(u, a),
          c = (d) => {
            (d.key === Ln || d.key === Un) && u();
          };
        return (
          window.addEventListener("storage", c),
          () => {
            ((n = !1), clearInterval(o), window.removeEventListener("storage", c));
          }
        );
      }, [a]),
      e
    );
  }
  async function V0(a) {
    try {
      let e = await st("/api/waste-ai", { method: "POST", body: { query: a }, timeout: 15e3 });
      return !e || !Array.isArray(e.items) || e.items.length === 0
        ? null
        : {
            items: e.items
              .slice(0, 5)
              .map((l, n) => ({
                id: "ia-" + n + "-" + kn(String(l.name || "")).slice(0, 12),
                name: String(l.name || "Residuo"),
                frac: ["blanca", "verde", "negra", "roja"].includes(l.frac) ? l.frac : "negra",
                keys: [],
                steps: Array.isArray(l.steps) ? l.steps.map(String).slice(0, 5) : [],
                where: String(l.where || ""),
                why: String(l.why || ""),
                tip: String(l.tip || ""),
              })),
            matchedAny: !0,
            source: "ia",
          };
    } catch {
      return null;
    }
  }
  async function Rr(a) {
    window.__ecoStop && window.__ecoStop();
    let e = me(Ln, {});
    for (let t of Object.values(e)) {
      let l = { ...t, status: "fuera", ts: Date.now() };
      e[t.id] = l;
      try {
        await st("/api/truck", {
          method: "POST",
          body: { ...l, geometry: void 0 },
          pin: a,
          timeout: 4e3,
        });
      } catch {}
    }
    Ze(Ln, e);
  }
  var Wa = K(Pa(), 1);
  function ecoWin(r, pos, prev, step) {
    let g = r.geometry,
      c = r.cum;
    if (!(prev >= 0) || g.length < 3) return Lt(g, c, pos);
    let fw = step >= 0 ? Math.max(50, step * 1.5 + 40) : 150,
      lo = 0;
    while (lo < g.length - 2 && c[lo + 1] < prev - 40) lo++;
    let hi = lo;
    while (hi < g.length - 2 && c[hi] < prev + fw) hi++;
    let xs = [],
      m = 1 / 0;
    for (let k = lo; k <= hi; k++) {
      let x = Lt(g, c, pos, k, k);
      xs.push(x);
      x.off < m && (m = x.off);
    }
    if (m > 60) return Lt(g, c, pos);
    let b = null;
    for (let x of xs) x.off <= m + 3 && (!b || x.along >= b.along) && (b = x);
    return b;
  }
  var Ce = (a) => (a * Math.PI) / 180;
  function ge(a, e) {
    let t = Ce(e.lat - a.lat),
      l = Ce(e.lng - a.lng),
      n = Math.sin(t / 2) ** 2 + Math.cos(Ce(a.lat)) * Math.cos(Ce(e.lat)) * Math.sin(l / 2) ** 2;
    return 2 * 6371e3 * Math.asin(Math.min(1, Math.sqrt(n)));
  }
  function wr(a, e) {
    let t = Math.sin(Ce(e.lng - a.lng)) * Math.cos(Ce(e.lat)),
      l =
        Math.cos(Ce(a.lat)) * Math.sin(Ce(e.lat)) -
        Math.sin(Ce(a.lat)) * Math.cos(Ce(e.lat)) * Math.cos(Ce(e.lng - a.lng));
    return ((Math.atan2(t, l) * 180) / Math.PI + 360) % 360;
  }
  function kt(a) {
    return isFinite(a)
      ? a < 1e3
        ? `${Math.max(10, Math.round(a / 10) * 10)} m`
        : `${(a / 1e3).toFixed(1)} km`
      : "\u2014";
  }
  function Xi(a) {
    if (!isFinite(a)) return "\u2014";
    let e = Math.max(1, Math.round(a / 60));
    return e < 60 ? `${e} min` : `${Math.floor(e / 60)} h ${e % 60} min`;
  }
  function jl(a) {
    return a < 10
      ? "ahora"
      : a < 60
        ? `hace ${Math.round(a)} s`
        : a < 3600
          ? `hace ${Math.round(a / 60)} min`
          : `hace ${Math.round(a / 3600)} h`;
  }
  function Qi(a) {
    let e = [0];
    for (let t = 1; t < a.length; t++) e.push(e[t - 1] + ge(a[t - 1], a[t]));
    return e;
  }
  function Lt(a, e, t, l = 0, n = a.length - 2) {
    if (a.length === 0) return { idx: 0, along: 0, off: 1 / 0, point: t };
    if (a.length === 1) return { idx: 0, along: 0, off: ge(a[0], t), point: a[0] };
    let i = 111320 * Math.cos(Ce(t.lat)),
      u = 110540,
      o = { idx: 0, along: 0, off: 1 / 0, point: a[0] },
      c = Math.max(0, l),
      d = Math.min(a.length - 2, n);
    for (let g = c; g <= d; g++) {
      let b = (a[g].lng - t.lng) * i,
        m = (a[g].lat - t.lat) * u,
        f = (a[g + 1].lng - t.lng) * i,
        x = (a[g + 1].lat - t.lat) * u,
        S = f - b,
        T = x - m,
        s = S * S + T * T,
        r = s === 0 ? 0 : -(b * S + m * T) / s;
      r = Math.max(0, Math.min(1, r));
      let p = b + r * S,
        y = m + r * T,
        N = Math.hypot(p, y);
      if (N < o.off) {
        let R = e[g + 1] - e[g];
        o = {
          idx: g,
          along: e[g] + r * R,
          off: N,
          point: {
            lat: a[g].lat + (a[g + 1].lat - a[g].lat) * r,
            lng: a[g].lng + (a[g + 1].lng - a[g].lng) * r,
          },
        };
      }
    }
    return o;
  }
  function Z0(a, e, t) {
    if (a.length === 0) return { point: { lat: 0, lng: 0 }, heading: 0 };
    if (a.length === 1 || t <= 0)
      return { point: a[0], heading: a.length > 1 ? wr(a[0], a[1]) : 0 };
    let l = e[e.length - 1];
    if (t >= l) {
      let c = a.length;
      return { point: a[c - 1], heading: wr(a[c - 2], a[c - 1]) };
    }
    let n = 0,
      i = e.length - 1;
    for (; i - n > 1;) {
      let c = (n + i) >> 1;
      e[c] <= t ? (n = c) : (i = c);
    }
    let u = e[i] - e[n] || 1,
      o = (t - e[n]) / u;
    return {
      point: {
        lat: a[n].lat + (a[i].lat - a[n].lat) * o,
        lng: a[n].lng + (a[i].lng - a[n].lng) * o,
      },
      heading: wr(a[n], a[i]),
    };
  }
  function ecoPerf() {
    try {
      return localStorage.getItem("ecoruta.perf") || "auto";
    } catch {
      return "auto";
    }
  }
  function ecoApplyPerf(m, boot) {
    try {
      boot || localStorage.setItem("ecoruta.perf", m);
    } catch {}
    let n = navigator,
      low =
        m === "lite" ||
        (m === "auto" &&
          ((n.deviceMemory && n.deviceMemory <= 2) ||
            (n.hardwareConcurrency && n.hardwareConcurrency <= 4) ||
            (n.connection && n.connection.saveData)));
    document.documentElement.classList.toggle("lite", !!low);
  }
  function ecoTheme() {
    try {
      return localStorage.getItem("ecoruta.theme") || "auto";
    } catch {
      return "auto";
    }
  }
  function ecoApplyTheme(t, boot) {
    try {
      boot || localStorage.setItem("ecoruta.theme", t);
    } catch {}
    let h = document.documentElement;
    boot ||
      (h.classList.add("theme-fade"), setTimeout(() => h.classList.remove("theme-fade"), 600));
    t === "auto" ? h.removeAttribute("data-theme") : h.setAttribute("data-theme", t);
    let d =
      t === "dark" ||
      (t === "auto" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute("content", d ? "#101512" : "#f6f7f5"));
    try {
      window.EcoNative && window.EcoNative.setDark(d);
    } catch {}
  }
  function ecoMotion(a, o) {
    k0(2e3);
    let r = Ya.useRef({ h: [], seen: 0 }).current,
      n = Date.now(),
      W = o.drv ? 1e4 : 2e4,
      h = r.h;
    if (a) {
      let l = h[h.length - 1];
      (!l || ge(l, a) > 0.3) && (h.push({ t: n, lat: a.lat, lng: a.lng }), (r.seen = 1));
    }
    for (; h.length && n - h[0].t > W;) h.shift();
    let v = null;
    if (h.length >= 2) {
      let p = h[0],
        q = h[h.length - 1],
        i = (n - q.t) / 1e3,
        dt = (i > (o.drv ? 3 : 7) ? n - p.t : q.t - p.t) / 1e3;
      dt >= 1.5 && (v = ge(p, q) / dt);
    } else if (h.length === 1) n - h[0].t > W * 0.5 && (v = 0);
    else r.seen && (v = 0);
    let k = v == null ? null : v * 3.6,
      st = "moving";
    o.drv && o.run === "off"
      ? (st = "idle")
      : o.noSignal
        ? (st = "nosignal")
        : o.paused
          ? (st = "paused")
          : o.loading
            ? (st = "loading")
            : k != null && (st = k < 3 ? "loading" : k < 10 ? "slow" : "moving");
    let M = {
      moving: ["En ruta", null, "ok", null],
      slow: ["Va despacio", "Lento", "warn", "Va despacio: la llegada puede cambiar."],
      loading: ["Cargando", "Cargando", "info", "Est\xE1 recogiendo residuos."],
      paused: ["En pausa", "En pausa", "mute", "El conductor hizo una pausa."],
      nosignal: ["Sin se\xF1al", "Sin se\xF1al", "bad", null],
      idle: ["Sin iniciar", null, "mute", null],
    }[st];
    return {
      state: st,
      label: M[0],
      tag: M[1],
      tone: M[2],
      note: M[3],
      flow: st === "moving" ? "fast" : st === "slow" ? "slow" : void 0,
      kmh: k,
    };
  }
  function ecoMotionDrv(i) {
    return ecoMotion(i.pos ? { lat: i.pos.lat, lng: i.pos.lng } : null, {
      drv: 1,
      run: i.run,
      paused: i.run === "pause",
      loading: !!i.arrived,
      noSignal: i.cfg.mode === "gps" && (!!i.gpsErr || !i.pos),
    });
  }
  function ve(a, e) {
    let t = 256 * Math.pow(2, e),
      l = Math.sin(Ce(Math.max(-85.05, Math.min(85.05, a.lat))));
    return {
      x: ((a.lng + 180) / 360) * t,
      y: (0.5 - Math.log((1 + l) / (1 - l)) / (4 * Math.PI)) * t,
    };
  }
  function Vi(a, e, t) {
    let l = 256 * Math.pow(2, t),
      n = (a / l) * 360 - 180,
      i = Math.PI - (2 * Math.PI * e) / l;
    return { lat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(i) - Math.exp(-i))), lng: n };
  }
  function _o(a, e, t) {
    return window.__ecoTiles !== !1 && (Gi() || location.protocol.startsWith("http"))
      ? `${Gi()}/tiles/${a}/${e}/${t}.png`
      : `https://tile.openstreetmap.org/${a}/${e}/${t}.png`;
  }
  var Zi = null;
  function Vh() {
    try {
      let a = window.AudioContext || window.webkitAudioContext;
      return a ? (Zi || (Zi = new a()), Zi.state === "suspended" && Zi.resume(), Zi) : null;
    } catch {
      return null;
    }
  }
  function ko(a, e, t, l = 0.18) {
    let n = Vh();
    if (!n) return;
    let i = n.createOscillator(),
      u = n.createGain();
    ((i.type = "sine"),
      (i.frequency.value = a),
      u.gain.setValueAtTime(0, n.currentTime + e),
      u.gain.linearRampToValueAtTime(l, n.currentTime + e + 0.02),
      u.gain.exponentialRampToValueAtTime(1e-4, n.currentTime + e + t),
      i.connect(u).connect(n.destination),
      i.start(n.currentTime + e),
      i.stop(n.currentTime + e + t + 0.05));
  }
  var _r = () => {
      (ko(784, 0, 0.35), ko(988, 0.22, 0.35), ko(1175, 0.44, 0.55));
    },
    K0 = () => ko(660, 0, 0.18, 0.12),
    Lo = (a) => {
      try {
        navigator.vibrate?.(a);
      } catch {}
    };
  function J0(a) {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      let e = new SpeechSynthesisUtterance(a);
      ((e.lang = "es-CO"), (e.rate = 1), window.speechSynthesis.speak(e));
    } catch {}
  }
  function $0() {
    try {
      "Notification" in window &&
        Notification.permission === "default" &&
        Notification.requestPermission();
    } catch {}
  }
  function W0(a, e) {
    try {
      "Notification" in window &&
        Notification.permission === "granted" &&
        new Notification(a, { body: e, icon: "./icon.svg" });
    } catch {}
  }
  function rt(a = 12e3) {
    return new Promise((e, t) => {
      if (!("geolocation" in navigator)) return t(new Error("sin geolocalizaci\xF3n"));
      navigator.geolocation.getCurrentPosition(
        (l) => e({ lat: l.coords.latitude, lng: l.coords.longitude, acc: l.coords.accuracy }),
        (l) => t(l),
        { enableHighAccuracy: !0, timeout: a, maximumAge: 15e3 },
      );
    });
  }
  var Ya = K(Pa(), 1);
  var eg = K(Pa(), 1),
    ne = K(fa(), 1),
    ag = {
      truck: "M2 6h12v10H2z M14 9h4l4 4v3h-8z M6 19a1.8 1.8 0 1 0 0-.01 M17 19a1.8 1.8 0 1 0 0-.01",
      home: "M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6",
      nav: "M12 3l7 17-7-4-7 4z",
      locate: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v3 M12 19v3 M2 12h3 M19 12h3",
      plus: "M12 5v14 M5 12h14",
      minus: "M5 12h14",
      x: "M6 6l12 12 M18 6L6 18",
      check: "M5 12l5 5 9-10",
      alert: "M12 4l9 16H3z M12 10v4 M12 17v.01",
      wifioff:
        "M2 8.8a15 15 0 0 1 4-2.3 M22 8.8a15 15 0 0 0-8-3.7 M5 12.9a10 10 0 0 1 5-2.7 M19 12.9a10 10 0 0 0-2.4-1.9 M8.5 16.4a5 5 0 0 1 7 0 M12 20v.01 M2 2l20 20",
      wifi: "M2 8.8a15 15 0 0 1 20 0 M5 12.9a10 10 0 0 1 14 0 M8.5 16.4a5 5 0 0 1 7 0 M12 20v.01",
      phone:
        "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
      bin: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6",
      calendar: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
      leaf: "M5 19c0-9 5-14 15-14 0 10-5 15-14 15 M5 19c3-5 6-8 10-10",
      list: "M8 6h13 M8 12h13 M8 18h13 M3 6v.01 M3 12v.01 M3 18v.01",
      speaker: "M4 9v6h4l5 4V5L8 9z M17 9a4 4 0 0 1 0 6",
      speakeroff: "M4 9v6h4l5 4V5L8 9z M17 9l5 6 M22 9l-5 6",
      download: "M12 4v12 M7 11l5 5 5-5 M5 20h14",
      flag: "M5 21V4 M5 4h12l-2 4 2 4H5",
      play: "M7 5l12 7-12 7z",
      pause: "M8 5v14 M16 5v14",
      skip: "M5 5l10 7-10 7z M19 5v14",
      up: "M6 15l6-6 6 6",
      down: "M6 9l6 6 6-6",
      info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 11v5 M12 8v.01",
      send: "M3 11l18-8-8 18-2-8z",
      search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
      out: "M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h10",
      refresh: "M20 11a8 8 0 1 0-2 6 M20 4v7h-7",
      route:
        "M6 21a2 2 0 1 0 0-.01 M18 3a2 2 0 1 0 0-.01 M8 19h8a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h8",
      scale: "M4 20h16 M6 20l2-9h8l2 9 M12 4a2 2 0 1 0 0 .01",
      trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
      user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 21a8 8 0 0 1 16 0",
      clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
      bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 21h4",
      pin: "M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12z M12 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
      chart: "M4 20V4 M4 20h16 M8 16v-5 M13 16V8 M18 16v-8",
      monitor: "M3 5h18v11H3z M8 20h8 M12 16v4",
      shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
      sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4",
      moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
      auto: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 3v18 M12 3a9 9 0 0 1 0 18",
      gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
    },
    L = ({ n: a, size: e = 18, className: t }) =>
      (0, ne.jsx)("svg", {
        className: t,
        width: e,
        height: e,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        children: (0, ne.jsx)("path", { d: ag[a] || ag.info }),
      }),
    $e = ({ open: a, onClose: e, title: t, wide: l, children: n }) => {
      let [eco_m, eco_sm] = (0, eg.useState)(!!a);
      ((0, eg.useEffect)(() => {
        if (a) {
          eco_sm(!0);
          return;
        }
        let q = setTimeout(() => eco_sm(!1), 230);
        return () => clearTimeout(q);
      }, [a]),
        (0, eg.useEffect)(() => {
          if (!a || !e) return;
          let i = (u) => {
            u.key === "Escape" && e();
          };
          return (
            window.addEventListener("keydown", i),
            () => window.removeEventListener("keydown", i)
          );
        }, [a, e]));
      return a || eco_m
        ? (0, ne.jsx)("div", {
            className: "overlay" + (a ? "" : " closing"),
            onMouseDown: (i) => {
              i.target === i.currentTarget && e && e();
            },
            children: (0, ne.jsxs)("div", {
              className: "modal" + (l ? " wide" : ""),
              role: "dialog",
              "aria-modal": "true",
              "aria-label": t,
              children: [
                (t || e) &&
                  (0, ne.jsxs)("div", {
                    className: "modal-head",
                    children: [
                      (0, ne.jsx)("h3", { children: t }),
                      e &&
                        (0, ne.jsx)("button", {
                          className: "icon-btn",
                          onClick: e,
                          "aria-label": "Cerrar",
                          children: (0, ne.jsx)(L, { n: "x" }),
                        }),
                    ],
                  }),
                (0, ne.jsx)("div", { className: "modal-body", children: n }),
              ],
            }),
          })
        : null;
    },
    be = ({ tone: a = "mute", children: e }) =>
      (0, ne.jsx)("span", { className: "chip chip-" + a, children: e }),
    ml = ({ color: a }) => (0, ne.jsx)("span", { className: "swatch", style: { background: a } }),
    kr = ({ items: a }) =>
      (0, ne.jsx)("div", {
        className: "toasts",
        "aria-live": "polite",
        children: a.map((e) =>
          (0, ne.jsx)("div", { className: "toast toast-" + e.tone, children: e.text }, e.id),
        ),
      });
  var za = K(fa(), 1),
    tg = 13,
    lg = 17,
    MB = { s: 4.893, n: 4.95, w: -75.093, e: -75.035 },
    pl = (0, Ya.forwardRef)(
      (
        {
          center: a,
          zoom: e = 15,
          markers: t,
          lines: l,
          onTap: n,
          onUserMove: i,
          className: u,
          children: o,
          hint: c,
          follow: eco_f,
        },
        d,
      ) => {
        let eco_tk = (0, Ya.useState)(0)[1],
          eco_an = (0, Ya.useRef)(0),
          eco_gp = (0, Ya.useRef)({}),
          eco_fb = (0, Ya.useRef)({ on: 0, from: null, t0: 0 }),
          eco_ac = (0, Ya.useRef)(0),
          eco_dl = (0, Ya.useRef)(40),
          eco_dr = (0, Ya.useRef)({}),
          eco_pd = (0, Ya.useRef)({ x: 0, y: 0, r: 0 }),
          eco_rm = () =>
            !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
          g = (0, Ya.useRef)(null),
          [b, m] = (0, Ya.useState)({ w: 600, h: 400 }),
          [f, x] = (0, Ya.useState)({ c: a, z: e }),
          S = (0, Ya.useRef)(f);
        S.current = f;
        let T = (0, Ya.useRef)(b);
        ((T.current = b),
          (0, Ya.useEffect)(() => {
            let C = g.current;
            if (!C) return;
            let q = new ResizeObserver(() =>
              m({ w: C.clientWidth || 600, h: C.clientHeight || 400 }),
            );
            return (
              q.observe(C),
              m({ w: C.clientWidth || 600, h: C.clientHeight || 400 }),
              () => q.disconnect()
            );
          }, []));
        let __mz = () => {
            let a0 = ve({ lat: MB.n, lng: MB.w }, 0),
              b0 = ve({ lat: MB.s, lng: MB.e }, 0),
              { w: W, h: H } = T.current;
            return Math.min(
              lg - 1,
              Math.max(tg, Math.log2(W / (b0.x - a0.x)), Math.log2(H / (b0.y - a0.y))),
            );
          },
          s = (C) => Math.max(__mz(), Math.min(lg, C)),
          __cl = (c, z) => {
            z = s(z);
            let { w: W, h: H } = T.current,
              nw = ve({ lat: MB.n, lng: MB.w }, z),
              se = ve({ lat: MB.s, lng: MB.e }, z),
              pp = ve(c, z),
              lx = nw.x + W / 2,
              hx = se.x - W / 2,
              ly = nw.y + H / 2,
              hy = se.y - H / 2,
              X = lx > hx ? (nw.x + se.x) / 2 : Math.min(hx, Math.max(lx, pp.x)),
              Y = ly > hy ? (nw.y + se.y) / 2 : Math.min(hy, Math.max(ly, pp.y));
            return { c: Vi(X, Y, z), z };
          };
        (0, Ya.useEffect)(() => {
          x((C) => {
            let n = __cl(C.c, C.z);
            return Math.abs(n.z - C.z) < 1e-9 &&
              Math.abs(n.c.lat - C.c.lat) < 1e-9 &&
              Math.abs(n.c.lng - C.c.lng) < 1e-9
              ? C
              : n;
          });
        }, [b.w, b.h]);
        let eco_go = (C, q, dur = 450) => {
          cancelAnimationFrame(eco_an.current);
          let a0 = S.current,
            z0 = a0.z,
            eco_cl = __cl(C, q ?? z0),
            z1 = eco_cl.z,
            c0 = a0.c;
          C = eco_cl.c;
          if (eco_rm() || dur <= 0) {
            x({ c: C, z: z1 });
            return;
          }
          let t0 = performance.now(),
            st = (n2) => {
              let k = Math.min(1, (n2 - t0) / dur),
                e2 = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
              (x({
                c: { lat: c0.lat + (C.lat - c0.lat) * e2, lng: c0.lng + (C.lng - c0.lng) * e2 },
                z: z0 + (z1 - z0) * e2,
              }),
                k < 1 && (eco_an.current = requestAnimationFrame(st)));
            };
          eco_an.current = requestAnimationFrame(st);
        };
        (0, Ya.useImperativeHandle)(
          d,
          () => ({
            flyTo: (C, q) => eco_go(C, q),
            zoomTo: (C) => eco_go(S.current.c, C),
            fit: (C) => {
              if (!C.length) return;
              let q = 90,
                Z = -90,
                da = 180,
                ae = -180;
              C.forEach((Ge) => {
                ((q = Math.min(q, Ge.lat)),
                  (Z = Math.max(Z, Ge.lat)),
                  (da = Math.min(da, Ge.lng)),
                  (ae = Math.max(ae, Ge.lng)));
              });
              let Ca = { lat: (q + Z) / 2, lng: (da + ae) / 2 },
                { w: Na, h: Ut } = T.current,
                ft = lg;
              for (; ft > tg; ft--) {
                let Ge = ve({ lat: Z, lng: da }, ft),
                  vl = ve({ lat: q, lng: ae }, ft);
                if (Math.abs(vl.x - Ge.x) < Na - 90 && Math.abs(vl.y - Ge.y) < Ut - 110) break;
              }
              eco_go(Ca, ft, 600);
            },
          }),
          [],
        );
        let r = (0, Ya.useRef)(new Map()),
          p = (0, Ya.useRef)({ moved: 0, startT: 0, pinchD: 0, pinchZ: 0 }),
          y = (0, Ya.useCallback)((C, q, Z, sm) => {
            let da = S.current,
              { w: ae, h: Ca } = T.current,
              Na = s(C),
              Ut = ve(da.c, da.z),
              ft = Ut.x + (q - ae / 2),
              Ge = Ut.y + (Z - Ca / 2),
              vl = Vi(ft, Ge, da.z),
              $i = ve(vl, Na),
              Bo = Vi($i.x - (q - ae / 2), $i.y - (Z - Ca / 2), Na);
            sm ? eco_go(Bo, Na, 340) : x({ c: Bo, z: Na });
          }, []),
          N = (C) => {
            let q = g.current.getBoundingClientRect();
            return { x: C.clientX - q.left, y: C.clientY - q.top };
          },
          R = (C) => {
            if (
              (cancelAnimationFrame(eco_an.current),
              C.currentTarget.setPointerCapture?.(C.pointerId),
              r.current.set(C.pointerId, N(C)),
              (p.current.moved = 0),
              (p.current.startT = Date.now()),
              r.current.size === 2)
            ) {
              let [q, Z] = [...r.current.values()];
              ((p.current.pinchD = Math.hypot(q.x - Z.x, q.y - Z.y)),
                (p.current.pinchZ = S.current.z));
            }
          },
          A = (C) => {
            let q = r.current.get(C.pointerId);
            if (!q) return;
            let Z = N(C);
            if ((r.current.set(C.pointerId, Z), r.current.size === 2)) {
              let [Ca, Na] = [...r.current.values()],
                Ut = Math.hypot(Ca.x - Na.x, Ca.y - Na.y);
              p.current.pinchD > 0 &&
                (y(
                  p.current.pinchZ + Math.log2(Ut / p.current.pinchD),
                  (Ca.x + Na.x) / 2,
                  (Ca.y + Na.y) / 2,
                ),
                (p.current.moved = 99),
                i?.());
              return;
            }
            let da = Z.x - q.x,
              ae = Z.y - q.y;
            if (((p.current.moved += Math.abs(da) + Math.abs(ae)), p.current.moved > 5)) {
              let pd = eco_pd.current;
              ((pd.x += da),
                (pd.y += ae),
                pd.r ||
                  (pd.r = requestAnimationFrame(() => {
                    pd.r = 0;
                    let dx = pd.x,
                      dy = pd.y;
                    pd.x = pd.y = 0;
                    let Ca = S.current,
                      Na = ve(Ca.c, Ca.z);
                    (x(__cl(Vi(Na.x - dx, Na.y - dy, Ca.z), Ca.z)), i?.());
                  })));
            }
          },
          _ = (C) => {
            let q = r.current.has(C.pointerId);
            if (
              (r.current.delete(C.pointerId),
              r.current.size < 2 && (p.current.pinchD = 0),
              q &&
                r.current.size === 0 &&
                p.current.moved <= 5 &&
                Date.now() - p.current.startT < 500 &&
                n)
            ) {
              let Z = N(C),
                da = S.current,
                { w: ae, h: Ca } = T.current,
                Na = ve(da.c, da.z);
              n(Vi(Na.x + (Z.x - ae / 2), Na.y + (Z.y - Ca / 2), da.z));
            }
          };
        (0, Ya.useEffect)(() => {
          let C = g.current;
          if (!C) return;
          let q = (Z) => {
            (Z.preventDefault(), cancelAnimationFrame(eco_an.current));
            let da = C.getBoundingClientRect();
            y(S.current.z - Z.deltaY * 0.0022, Z.clientX - da.left, Z.clientY - da.top);
          };
          return (
            C.addEventListener("wheel", q, { passive: !1 }),
            () => C.removeEventListener("wheel", q)
          );
        }, [y]);
        let eco_n = performance.now(),
          eco_rmv = eco_rm(),
          eco_P = {},
          eco_act = 0,
          eco_px = 0,
          eco_bl = 0,
          eco_lite = document.documentElement.classList.contains("lite"),
          eco_tm = t.find((M) => M.kind === "truck" && M.glide);
        t.forEach((C) => {
          if (C.kind === "truck") {
            let dd = eco_dr.current[C.id];
            if (!dd) dd = eco_dr.current[C.id] = { lat: C.pos.lat, lng: C.pos.lng, dir: 1 };
            else {
              let dx = (C.pos.lng - dd.lng) * 111320 * Math.cos((C.pos.lat * Math.PI) / 180),
                dy = (C.pos.lat - dd.lat) * 110540;
              Math.hypot(dx, dy) > 8 &&
                (Math.abs(dx) > 3 && (dd.dir = dx > 0 ? 1 : -1), (dd.lat = C.pos.lat), (dd.lng = C.pos.lng));
            }
          }
          if (C.glide && !eco_rmv) {
            let g2 = eco_gp.current[C.id];
            if (!g2)
              g2 = eco_gp.current[C.id] = {
                to: C.pos,
                from: C.pos,
                t0: eco_n,
                du: C.glide * 1e3,
                cur: C.pos,
              };
            else if (g2.to.lat !== C.pos.lat || g2.to.lng !== C.pos.lng) {
              ((g2.from = g2.cur), (g2.to = C.pos), (g2.t0 = eco_n), (g2.du = C.glide * 1e3));
            }
            let k2 = Math.min(1, (eco_n - g2.t0) / g2.du);
            ((g2.cur = {
              lat: g2.from.lat + (g2.to.lat - g2.from.lat) * k2,
              lng: g2.from.lng + (g2.to.lng - g2.from.lng) * k2,
            }),
              k2 < 1 &&
                ((eco_act = 1),
                (eco_px = Math.max(
                  eco_px,
                  (((pb) => {
                    let pa = ve(g2.from, f.z);
                    return Math.hypot(pb.x - pa.x, pb.y - pa.y);
                  })(ve(g2.to, f.z)) /
                    Math.max(g2.du, 1)) *
                    1e3,
                ))),
              (eco_P[C.id] = g2.cur));
          } else eco_P[C.id] = C.pos;
        });
        let fc = f.c;
        if (eco_f && eco_tm) {
          let fb = eco_fb.current;
          fb.on || ((fb.on = 1), (fb.from = f.c), (fb.t0 = eco_n));
          let tp = eco_P[eco_tm.id],
            kb = eco_rmv ? 1 : Math.min(1, (eco_n - fb.t0) / 500),
            eb = 1 - Math.pow(1 - kb, 3);
          ((fc = {
            lat: fb.from.lat + (tp.lat - fb.from.lat) * eb,
            lng: fb.from.lng + (tp.lng - fb.from.lng) * eb,
          }),
            kb < 1 && ((eco_act = 1), (eco_bl = 1)));
        } else eco_fb.current.on = 0;
        fc = __cl(fc, f.z).c;
        ((S.current = { c: fc, z: f.z }),
          (eco_ac.current = eco_act),
          (eco_dl.current = eco_bl
            ? 16
            : Math.max(eco_lite ? 140 : 36, Math.min(500, 700 / Math.max(eco_px, 0.4)))),
          (0, Ya.useEffect)(() => {
            if (!eco_ac.current) return;
            let id,
              t3 = setTimeout(() => {
                id = requestAnimationFrame(() => eco_tk((n2) => n2 + 1));
              }, eco_dl.current);
            return () => {
              (clearTimeout(t3), cancelAnimationFrame(id));
            };
          }));
        let { w: U, h } = b,
          k = Math.round(f.z),
          ya = Math.pow(2, f.z - k),
          Xa = ve(fc, k),
          D = ve(fc, f.z),
          Ea = Math.floor((Xa.x - U / 2 / ya) / 256),
          Ra = Math.floor((Xa.x + U / 2 / ya) / 256),
          ie = Math.floor((Xa.y - h / 2 / ya) / 256),
          We = Math.floor((Xa.y + h / 2 / ya) / 256),
          ea = Math.pow(2, k),
          Hn = [];
        if ((Ra - Ea + 1) * (We - ie + 1) <= 90)
          for (let C = Ea; C <= Ra; C++)
            for (let q = ie; q <= We; q++) {
              if (q < 0 || q >= ea) continue;
              let Z = ((C % ea) + ea) % ea;
              Hn.push(
                (0, za.jsx)(
                  "img",
                  {
                    className: "tile",
                    alt: "",
                    draggable: !1,
                    loading: "eager",
                    decoding: "async",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    src: _o(k, Z, q),
                    onLoad: (da) => {
                      da.currentTarget.style.opacity = 1;
                    },
                    style: {
                      left: U / 2 + (C * 256 - Xa.x) * ya,
                      top: h / 2 + (q * 256 - Xa.y) * ya,
                      width: 256 * ya + 0.6,
                      height: 256 * ya + 0.6,
                    },
                    onError: (da) => {
                      da.currentTarget.style.visibility = "hidden";
                    },
                  },
                  `${k}/${C}/${q}`,
                ),
              );
            }
        let Bl = (C) => {
            let q = ve(C, f.z);
            return U / 2 + (q.x - D.x);
          },
          Fe = (C) => {
            let q = ve(C, f.z);
            return h / 2 + (q.y - D.y);
          };
        return (0, za.jsxs)("div", {
          ref: g,
          className: "map " + (u || ""),
          onPointerDown: R,
          onPointerMove: A,
          onPointerUp: _,
          onPointerCancel: _,
          onDoubleClick: (C) => {
            let q = N(C);
            y(S.current.z + 1, q.x, q.y, 1);
          },
          children: [
            (0, za.jsx)("div", { className: "tiles", children: Hn }),
            (0, za.jsx)("svg", {
              className: "lines",
              width: U,
              height: h,
              children: l.map((C) => {
                if (!(C.pts.length > 1)) return null;
                let eco_pt = C.fromTruck && eco_tm ? [eco_P[eco_tm.id], ...C.pts.slice(1)] : C.pts,
                  ld = eco_pt
                    .map((q, Z) => `${Z ? "L" : "M"}${Bl(q).toFixed(1)} ${Fe(q).toFixed(1)}`)
                    .join(""),
                  lw = C.width || 4,
                  lo = C.opacity ?? 0.9,
                  lc =
                    C.color === "#2d6a4f"
                      ? "var(--route)"
                      : C.color === "#b7791f"
                        ? "var(--route-warn)"
                        : C.color;
                return (0, za.jsxs)(
                  "g",
                  {
                    children: [
                      !C.dash &&
                        (0, za.jsx)("path", {
                          d: ld,
                          fill: "none",
                          style: { stroke: "var(--route-case)" },
                          strokeWidth: lw + 4,
                          strokeOpacity: Math.min(0.95, lo),
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                        }),
                      (0, za.jsx)("path", {
                        d: ld,
                        fill: "none",
                        style: { stroke: lc },
                        strokeWidth: lw,
                        strokeDasharray: C.dash,
                        strokeOpacity: lo,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }),
                      C.flow &&
                        (0, za.jsx)("path", {
                          d: ld,
                          fill: "none",
                          className: "flow flow-" + C.flow,
                          strokeWidth: Math.max(2, lw - 2.5),
                          strokeLinecap: "round",
                        }),
                    ],
                  },
                  C.id,
                );
              }),
            }),
            t.map((C) => {
              let eco_p = eco_P[C.id] || C.pos,
                q = Bl(eco_p),
                Z = Fe(eco_p);
              return q < -40 || Z < -40 || q > U + 40 || Z > h + 40
                ? null
                : (0, za.jsxs)(
                    "div",
                    {
                      className: `mk mk-${C.kind}${C.done ? " done" : ""}${C.current ? " current" : ""}${C.onClick ? " click" : ""}${C.state ? " st-" + C.state : ""}`,
                      style: { left: q, top: Z },
                      title: C.label,
                      onClick: (da) => {
                        C.onClick && (da.stopPropagation(), C.onClick());
                      },
                      onPointerDown: (da) => {
                        C.onClick && da.stopPropagation();
                      },
                      children: [
                        C.kind === "truck" &&
                          (0, za.jsx)("span", {
                            className:
                              "mk-ico" + ((eco_dr.current[C.id] || {}).dir < 0 ? " flip" : ""),
                            children: (0, za.jsx)(L, { n: "truck", size: 22 }),
                          }),
                        C.kind === "home" && (0, za.jsx)(L, { n: "home", size: 17 }),
                        C.kind === "stop" &&
                          (C.done
                            ? (0, za.jsx)(L, { n: "check", size: 13 })
                            : (0, za.jsx)("span", { children: C.n })),
                        C.kind === "station" && (0, za.jsx)(L, { n: "flag", size: 14 }),
                        C.kind === "incident" && (0, za.jsx)(L, { n: "alert", size: 15 }),
                        C.kind === "report" && (0, za.jsx)(L, { n: "bin", size: 14 }),
                        C.kind === "sos" && (0, za.jsx)(L, { n: "alert", size: 16 }),
                        C.kind === "me" && (0, za.jsx)("span", { className: "me-dot" }),
                        C.tag &&
                          (0, za.jsxs)("span", {
                            className: "mk-tag",
                            children: [
                              C.tag,
                              C.state === "loading" &&
                                [0, 1, 2].map((n) =>
                                  (0, za.jsx)(
                                    "i",
                                    { style: { animationDelay: n * 0.16 + "s" } },
                                    n,
                                  ),
                                ),
                            ],
                          }),
                      ],
                    },
                    C.id,
                  );
            }),
            c && (0, za.jsx)("div", { className: "map-hint", children: c }),
            (0, za.jsxs)("div", {
              className: "map-ctl",
              onPointerDown: (C) => C.stopPropagation(),
              children: [
                (0, za.jsx)("button", {
                  onClick: () => y(S.current.z + 1, U / 2, h / 2, 1),
                  disabled: f.z >= lg - 0.01,
                  "aria-label": "Acercar",
                  children: (0, za.jsx)(L, { n: "plus" }),
                }),
                (0, za.jsx)("button", {
                  onClick: () => y(S.current.z - 1, U / 2, h / 2, 1),
                  disabled: f.z <= __mz() + 0.01,
                  "aria-label": "Alejar",
                  children: (0, za.jsx)(L, { n: "minus" }),
                }),
              ],
            }),
            (0, za.jsx)("div", { className: "map-attr", children: "\xA9 OpenStreetMap" }),
            o,
          ],
        });
      },
    );
  var F = K(fa(), 1),
    qo = ({ open: a, onClose: e }) =>
      (0, F.jsxs)($e, {
        open: a,
        onClose: e,
        title: "T\xE9rminos, condiciones y privacidad",
        wide: !0,
        children: [
          (0, F.jsxs)("div", {
            className: "prose",
            children: [
              (0, F.jsx)("p", {
                className: "lead",
                children:
                  "EcoRuta es una herramienta para organizar la recolecci\xF3n de residuos en L\xEDbano, Tolima. No es una app de rastreo ni de venta de datos.",
              }),
              (0, F.jsx)("h4", { children: "1. Qu\xE9 NO hacemos" }),
              (0, F.jsxs)("ul", {
                children: [
                  (0, F.jsx)("li", {
                    children:
                      "No vendemos, alquilamos ni compartimos tus datos con terceros con fines comerciales.",
                  }),
                  (0, F.jsx)("li", {
                    children: "No mostramos publicidad ni usamos rastreadores de terceros.",
                  }),
                  (0, F.jsx)("li", {
                    children:
                      "No accedemos a tus contactos, fotos, archivos, c\xE1mara ni micr\xF3fono.",
                  }),
                  (0, F.jsx)("li", {
                    children:
                      "No seguimos tu ubicaci\xF3n en segundo plano: solo se usa con la app abierta.",
                  }),
                ],
              }),
              (0, F.jsx)("h4", { children: "2. Qu\xE9 se guarda y d\xF3nde" }),
              (0, F.jsxs)("ul", {
                children: [
                  (0, F.jsxs)("li", {
                    children: [
                      (0, F.jsx)("b", { children: "En tu dispositivo:" }),
                      " tu nombre, barrio, la ubicaci\xF3n de tu casa, tus preferencias y tu registro de entregas. Nunca salen de tu tel\xE9fono o computador.",
                    ],
                  }),
                  (0, F.jsxs)("li", {
                    children: [
                      (0, F.jsx)("b", { children: "Ciudadanos:" }),
                      " la ubicaci\xF3n de tu casa se usa ",
                      (0, F.jsx)("u", { children: "solo en tu dispositivo" }),
                      " para calcular el tiempo de llegada del cami\xF3n. No se env\xEDa al conductor ni al servidor.",
                    ],
                  }),
                  (0, F.jsxs)("li", {
                    children: [
                      (0, F.jsx)("b", { children: "Conductores:" }),
                      " mientras la ruta est\xE1 activa, la posici\xF3n del cami\xF3n, su placa y el estado de la ruta se comparten para que los ciudadanos vean el avance. El nombre del conductor no se muestra a los ciudadanos. Al finalizar el turno se deja de compartir.",
                    ],
                  }),
                  (0, F.jsxs)("li", {
                    children: [
                      (0, F.jsx)("b", { children: "Reportes:" }),
                      ' si env\xEDas un reporte (por ejemplo "basura acumulada"), se env\xEDan su tipo, descripci\xF3n y ubicaci\xF3n para que el conductor lo vea.',
                    ],
                  }),
                  (0, F.jsxs)("li", {
                    children: [
                      (0, F.jsx)("b", { children: "Consulta de residuos:" }),
                      " el texto se analiza en tu dispositivo. Si el operador activ\xF3 la IA en l\xEDnea, el texto (sin tu nombre ni ubicaci\xF3n) se env\xEDa al servidor para ampliar la respuesta.",
                    ],
                  }),
                ],
              }),
              (0, F.jsx)("h4", {
                children: "3. Tus derechos (Ley 1581 de 2012 \u2013 Habeas Data)",
              }),
              (0, F.jsx)("p", {
                children:
                  "Puedes conocer, actualizar y suprimir tus datos. Desde el men\xFA de ayuda puedes borrar todo lo guardado en tu dispositivo con un toque. Para eliminar reportes ya enviados al servidor, comun\xEDcate con el operador del servicio (Alcald\xEDa de L\xEDbano / EMSER).",
              }),
              (0, F.jsx)("h4", { children: "4. Uso responsable" }),
              (0, F.jsxs)("ul", {
                children: [
                  (0, F.jsx)("li", {
                    children:
                      "Los tiempos de llegada son estimados y pueden variar por tr\xE1fico, clima o fallas del cami\xF3n.",
                  }),
                  (0, F.jsx)("li", {
                    children:
                      "Los conductores no deben manipular la app en movimiento; usa la gu\xEDa por voz.",
                  }),
                  (0, F.jsxs)("li", {
                    children: [
                      "La gu\xEDa de manejo de residuos es orientativa. En una emergencia llama al ",
                      (0, F.jsx)("b", { children: "123" }),
                      ".",
                    ],
                  }),
                  (0, F.jsx)("li", {
                    children:
                      "Usar la app como conductor sin serlo, o enviar reportes falsos, puede bloquear tu acceso.",
                  }),
                ],
              }),
              (0, F.jsx)("h4", { children: "5. Funcionamiento sin internet" }),
              (0, F.jsx)("p", {
                children:
                  "La app guarda lo esencial en tu dispositivo para seguir funcionando cuando se pierde la se\xF1al: gu\xEDa de residuos, calendario, \xFAltima ruta, mapa descargado y cola de reportes que se env\xEDa cuando vuelve la conexi\xF3n.",
              }),
            ],
          }),
          (0, F.jsx)("div", {
            className: "row end",
            children: (0, F.jsx)("button", { className: "btn", onClick: e, children: "Entendido" }),
          }),
        ],
      });
  var M = K(fa(), 1),
    ng = ({ pinRequired: a, onDone: e }) => {
      let [t, l] = (0, Wa.useState)("role"),
        [n, i] = (0, Wa.useState)("citizen"),
        [u, o] = (0, Wa.useState)(""),
        [c, d] = (0, Wa.useState)(Ar[0]),
        [g, b] = (0, Wa.useState)(""),
        [m, f] = (0, Wa.useState)(""),
        [x, S] = (0, Wa.useState)(""),
        [T, s] = (0, Wa.useState)(!1),
        [r, p] = (0, Wa.useState)(!1),
        [y, N] = (0, Wa.useState)(""),
        [R, A] = (0, Wa.useState)("idle"),
        [_, U] = (0, Wa.useState)(null),
        [h, k] = (0, Wa.useState)(null),
        [ya, Xa] = (0, Wa.useState)(""),
        D = (0, Wa.useRef)(null),
        Ea = (ea) => {
          e({
            name: u.trim() || (n === "driver" ? "Conductor" : "Vecino"),
            role: n,
            barrio: c,
            home: ea,
            termsAt: new Date().toISOString(),
            plate: g.trim().toUpperCase(),
            pin: m.trim(),
            alertMin: 5,
            sound: !0,
            emergencyPhone: x.trim(),
          });
        },
        Ra = async () => {
          if ((N(""), n === "driver" && !g.trim()))
            return N("Escribe la placa o n\xFAmero del cami\xF3n.");
          if (n === "driver" && a && !m.trim())
            return N("Escribe el PIN de conductor que te dio la central.");
          if (!T) return N("Debes aceptar los t\xE9rminos y condiciones para continuar.");
          if (n === "driver" && a)
            try {
              await st("/api/pin-check", { method: "POST", body: {}, pin: m.trim(), timeout: 5e3 });
            } catch (er) {
              if (er && er.status === 401)
                return N("El PIN no es correcto. P\xEDdelo de nuevo a la central.");
              if (er && er.status === 429)
                return N("Demasiados intentos. Espera unos minutos e int\xE9ntalo otra vez.");
            }
          l("loc");
        },
        ie = async () => {
          A("asking");
          try {
            let ea = await rt();
            (U(ea), A("got"));
          } catch {
            A("denied");
          }
        },
        We = _ ? ge(_, pe) > 2e4 : !1;
      return (0, M.jsxs)("div", {
        className: "login",
        children: [
          (0, M.jsxs)("div", {
            className: "login-card",
            children: [
              (0, M.jsxs)("div", {
                className: "brand-lg",
                children: [
                  (0, M.jsx)("span", {
                    className: "logo",
                    children: (0, M.jsx)(L, { n: "leaf", size: 20 }),
                  }),
                  (0, M.jsxs)("div", {
                    children: [
                      (0, M.jsx)("h1", { children: "EcoRuta" }),
                      (0, M.jsx)("p", {
                        children: "Recolecci\xF3n de residuos \xB7 L\xEDbano, Tolima",
                      }),
                    ],
                  }),
                ],
              }),
              t === "role" &&
                (0, M.jsxs)(M.Fragment, {
                  children: [
                    (0, M.jsx)("h2", { children: "\xBFC\xF3mo vas a entrar?" }),
                    (0, M.jsxs)("div", {
                      className: "role-grid",
                      children: [
                        (0, M.jsxs)("button", {
                          className: "role-card" + (n === "citizen" ? " on" : ""),
                          onClick: () => i("citizen"),
                          children: [
                            (0, M.jsx)(L, { n: "home", size: 22 }),
                            (0, M.jsx)("b", { children: "Ciudadano" }),
                            (0, M.jsx)("span", {
                              children: "Ver el cami\xF3n y su hora de llegada.",
                            }),
                          ],
                        }),
                        (0, M.jsxs)("button", {
                          className: "role-card" + (n === "driver" ? " on" : ""),
                          onClick: () => i("driver"),
                          children: [
                            (0, M.jsx)(L, { n: "truck", size: 22 }),
                            (0, M.jsx)("b", { children: "Conductor" }),
                            (0, M.jsx)("span", { children: "Ruta guiada, reportes y carga." }),
                          ],
                        }),
                      ],
                    }),
                    (0, M.jsx)("button", {
                      className: "btn block",
                      onClick: () => l("data"),
                      children: "Continuar",
                    }),
                  ],
                }),
              t === "data" &&
                (0, M.jsxs)(M.Fragment, {
                  children: [
                    (0, M.jsx)("h2", {
                      children: n === "driver" ? "Datos del conductor" : "Tus datos",
                    }),
                    (0, M.jsxs)("label", {
                      className: "field",
                      children: [
                        (0, M.jsx)("span", { children: "Nombre" }),
                        (0, M.jsx)("input", {
                          value: u,
                          onChange: (ea) => o(ea.target.value),
                          placeholder: "Como quieres que te llamemos",
                          autoComplete: "name",
                        }),
                      ],
                    }),
                    n === "citizen" &&
                      (0, M.jsxs)("label", {
                        className: "field",
                        children: [
                          (0, M.jsx)("span", { children: "Barrio" }),
                          (0, M.jsx)("select", {
                            value: c,
                            onChange: (ea) => d(ea.target.value),
                            children: Ar.map((ea) => (0, M.jsx)("option", { children: ea }, ea)),
                          }),
                        ],
                      }),
                    n === "driver" &&
                      (0, M.jsxs)(M.Fragment, {
                        children: [
                          (0, M.jsxs)("label", {
                            className: "field",
                            children: [
                              (0, M.jsx)("span", { children: "Placa o n\xFAmero del cami\xF3n" }),
                              (0, M.jsx)("input", {
                                value: g,
                                onChange: (ea) => b(ea.target.value),
                                placeholder: "Ej. WLK-408",
                              }),
                            ],
                          }),
                          a &&
                            (0, M.jsxs)("label", {
                              className: "field",
                              children: [
                                (0, M.jsx)("span", { children: "PIN de conductor" }),
                                (0, M.jsx)("input", {
                                  value: m,
                                  onChange: (ea) => f(ea.target.value),
                                  type: "password",
                                  placeholder: "Te lo da la central",
                                }),
                              ],
                            }),
                          (0, M.jsxs)("label", {
                            className: "field",
                            children: [
                              (0, M.jsx)("span", {
                                children: "Tel\xE9fono de emergencia (opcional)",
                              }),
                              (0, M.jsx)("input", {
                                value: x,
                                onChange: (ea) => S(ea.target.value),
                                inputMode: "tel",
                                placeholder: "Para enviar SMS de auxilio",
                              }),
                            ],
                          }),
                        ],
                      }),
                    (0, M.jsxs)("label", {
                      className: "check",
                      children: [
                        (0, M.jsx)("input", {
                          type: "checkbox",
                          checked: T,
                          onChange: (ea) => s(ea.target.checked),
                        }),
                        (0, M.jsxs)("span", {
                          children: [
                            "Acepto los ",
                            (0, M.jsx)("button", {
                              type: "button",
                              className: "link",
                              onClick: () => p(!0),
                              children: "t\xE9rminos, condiciones y pol\xEDtica de privacidad",
                            }),
                            ". Entiendo que EcoRuta no vende ni comparte mis datos.",
                          ],
                        }),
                      ],
                    }),
                    y && (0, M.jsx)("p", { className: "err", children: y }),
                    (0, M.jsxs)("div", {
                      className: "row",
                      children: [
                        (0, M.jsx)("button", {
                          className: "btn ghost",
                          onClick: () => l("role"),
                          children: "Atr\xE1s",
                        }),
                        (0, M.jsx)("button", {
                          className: "btn grow",
                          onClick: Ra,
                          children: "Continuar",
                        }),
                      ],
                    }),
                  ],
                }),
              t === "loc" &&
                n === "driver" &&
                (0, M.jsxs)(M.Fragment, {
                  children: [
                    (0, M.jsx)("h2", { children: "Ubicaci\xF3n del cami\xF3n" }),
                    (0, M.jsxs)("p", {
                      className: "muted",
                      children: [
                        "Se usa para guiarte por las calles de L\xEDbano y para que los ciudadanos vean d\xF3nde va el cami\xF3n ",
                        (0, M.jsx)("b", { children: "solo mientras tengas la ruta activa" }),
                        ".",
                      ],
                    }),
                    R === "denied" &&
                      (0, M.jsx)("p", {
                        className: "err",
                        children:
                          "No se concedi\xF3 el permiso. Puedes continuar y activarlo despu\xE9s, o usar el modo demostraci\xF3n.",
                      }),
                    R === "got" &&
                      (0, M.jsx)("p", {
                        className: "ok-text",
                        children: "Ubicaci\xF3n obtenida correctamente.",
                      }),
                    (0, M.jsxs)("div", {
                      className: "row",
                      children: [
                        R !== "got" &&
                          (0, M.jsx)("button", {
                            className: "btn grow",
                            onClick: ie,
                            disabled: R === "asking",
                            children: R === "asking" ? "Buscando\u2026" : "Permitir ubicaci\xF3n",
                          }),
                        (0, M.jsx)("button", {
                          className: "btn " + (R === "got" ? "grow" : "ghost"),
                          onClick: () => Ea(null),
                          children: R === "got" ? "Entrar" : "Ahora no",
                        }),
                      ],
                    }),
                  ],
                }),
              t === "loc" &&
                n === "citizen" &&
                (0, M.jsxs)(M.Fragment, {
                  children: [
                    (0, M.jsx)("h2", { children: "Tu casa" }),
                    R === "idle" &&
                      (0, M.jsxs)(M.Fragment, {
                        children: [
                          (0, M.jsxs)("p", {
                            className: "muted",
                            children: [
                              "Para decirte cu\xE1nto tardar\xE1 el cami\xF3n en llegar necesito saber d\xF3nde vives. La ubicaci\xF3n se guarda ",
                              (0, M.jsx)("b", { children: "solo en tu dispositivo" }),
                              ".",
                            ],
                          }),
                          (0, M.jsxs)("div", {
                            className: "row",
                            children: [
                              (0, M.jsx)("button", {
                                className: "btn grow",
                                onClick: ie,
                                children: "Usar mi ubicaci\xF3n actual",
                              }),
                              (0, M.jsx)("button", {
                                className: "btn ghost",
                                onClick: () => A("pick"),
                                children: "Marcar en el mapa",
                              }),
                            ],
                          }),
                        ],
                      }),
                    R === "asking" &&
                      (0, M.jsx)("p", {
                        className: "muted",
                        children: "Buscando tu ubicaci\xF3n\u2026",
                      }),
                    R === "denied" &&
                      (0, M.jsxs)(M.Fragment, {
                        children: [
                          (0, M.jsx)("p", {
                            className: "err",
                            children: "No pude obtener tu ubicaci\xF3n. M\xE1rcala en el mapa.",
                          }),
                          (0, M.jsx)("div", {
                            className: "row",
                            children: (0, M.jsx)("button", {
                              className: "btn grow",
                              onClick: () => A("pick"),
                              children: "Marcar mi casa en el mapa",
                            }),
                          }),
                        ],
                      }),
                    R === "got" &&
                      _ &&
                      (0, M.jsxs)(M.Fragment, {
                        children: [
                          (0, M.jsx)("p", {
                            children: (0, M.jsx)("b", {
                              children: "\xBFTu casa est\xE1 donde iniciaste sesi\xF3n?",
                            }),
                          }),
                          (0, M.jsx)(pl, {
                            className: "map-sm",
                            center: _,
                            zoom: 16,
                            lines: [],
                            markers: [{ id: "h", pos: _, kind: "home" }],
                          }),
                          We &&
                            (0, M.jsx)("p", {
                              className: "warn-text",
                              children: "Est\xE1s lejos de L\xEDbano. Marca tu casa en el mapa.",
                            }),
                          (0, M.jsxs)("label", {
                            className: "field",
                            children: [
                              (0, M.jsx)("span", {
                                children: "Direcci\xF3n o referencia (opcional)",
                              }),
                              (0, M.jsx)("input", {
                                value: ya,
                                onChange: (ea) => Xa(ea.target.value),
                                placeholder: "Cra 12 # 4-28",
                              }),
                            ],
                          }),
                          (0, M.jsxs)("div", {
                            className: "row",
                            children: [
                              (0, M.jsx)("button", {
                                className: "btn grow",
                                onClick: () => Ea({ ..._, address: ya.trim() || "Mi casa" }),
                                children: "S\xED, es mi casa",
                              }),
                              (0, M.jsx)("button", {
                                className: "btn ghost",
                                onClick: () => {
                                  (k(null), A("pick"));
                                },
                                children: "No, marcarla",
                              }),
                            ],
                          }),
                        ],
                      }),
                    R === "pick" &&
                      (0, M.jsxs)(M.Fragment, {
                        children: [
                          (0, M.jsx)("p", {
                            className: "muted",
                            children: "Toca el mapa para marcar tu casa.",
                          }),
                          (0, M.jsx)(pl, {
                            ref: D,
                            className: "map-sm",
                            center: _ || pe,
                            zoom: 15,
                            lines: [],
                            markers: h ? [{ id: "h", pos: h, kind: "home" }] : [],
                            onTap: k,
                          }),
                          (0, M.jsxs)("label", {
                            className: "field",
                            children: [
                              (0, M.jsx)("span", {
                                children: "Direcci\xF3n o referencia (opcional)",
                              }),
                              (0, M.jsx)("input", {
                                value: ya,
                                onChange: (ea) => Xa(ea.target.value),
                                placeholder: "Cra 12 # 4-28",
                              }),
                            ],
                          }),
                          (0, M.jsxs)("div", {
                            className: "row",
                            children: [
                              (0, M.jsx)("button", {
                                className: "btn grow",
                                disabled: !h,
                                onClick: () => h && Ea({ ...h, address: ya.trim() || "Mi casa" }),
                                children: "Guardar y entrar",
                              }),
                              (0, M.jsx)("button", {
                                className: "btn ghost",
                                onClick: () => Ea(null),
                                children: "Omitir",
                              }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
            ],
          }),
          (0, M.jsx)(qo, { open: r, onClose: () => p(!1) }),
        ],
      });
    };
  var pa = K(Pa(), 1);
  var ig = new WeakMap();
  function Lr(a) {
    if (!a.geometry || a.geometry.length < 2) return null;
    let e = ig.get(a.geometry);
    if (!e) {
      let t = a.geometry.map(([l, n]) => ({ lat: l, lng: n }));
      ((e = { geo: t, cum: Qi(t) }), ig.set(a.geometry, e));
    }
    return e;
  }
  var Jh = 120;
  function ug(a, e) {
    if (!a || a.status === "fuera") return { state: "sin_camion" };
    let t = a.ageSec ?? 0,
      l = { lat: a.lat, lng: a.lng };
    if (!e) return { state: t > 180 ? "sin_senal" : "en_ruta", ageSec: t, distM: void 0 };
    let n = Lr(a),
      i = Math.max(a.avgKmh || 0, 12) / 3.6,
      u = t > 180;
    if (!n) {
      let b = ge(l, e);
      return { state: u ? "sin_senal" : "fuera_ruta", distM: b, offM: b, ageSec: t };
    }
    let o = Lt(n.geo, n.cum, e);
    if (o.off > 150) {
      let b = ge(l, e);
      return { state: u ? "sin_senal" : "fuera_ruta", distM: b, offM: o.off, ageSec: t };
    }
    let c = o.along - a.progressM;
    if (c < -40)
      return { state: u ? "sin_senal" : "paso", ageSec: t, distM: ge(l, e), offM: o.off };
    let d = 0;
    for (let b of a.stops) {
      if (b.status !== "pending") continue;
      let m = Lt(n.geo, n.cum, b);
      m.off < 120 && m.along > a.progressM + 20 && m.along < o.along - 60 && d++;
    }
    let g = Math.max(0, c) / i;
    return {
      state: u ? "sin_senal" : "en_ruta",
      etaSec: g + d * Jh,
      distM: Math.max(0, c),
      offM: o.off,
      ageSec: t,
      stopsBefore: d,
    };
  }
  var Ki = K(Pa(), 1);
  var J = K(fa(), 1),
    og = ({ online: a, serverAI: e, onRegister: t }) => {
      let [l, n] = (0, Ki.useState)(""),
        [i, u] = (0, Ki.useState)(!1),
        [o, c] = (0, Ki.useState)(null),
        [d, g] = (0, Ki.useState)(""),
        b = async (m) => {
          let f = m.trim();
          if (!f) return;
          (n(f), g(f), u(!0));
          let x = U0(f);
          if ((c(x), a && e)) {
            let S = await V0(f);
            S && c(S);
          }
          u(!1);
        };
      return (0, J.jsxs)("section", {
        className: "card",
        children: [
          (0, J.jsxs)("header", {
            className: "card-head",
            children: [
              (0, J.jsx)("h2", { children: "Manejo de basura" }),
              (0, J.jsx)("span", {
                className: "muted small",
                children: a && e ? "Respuesta ampliada" : "",
              }),
            ],
          }),
          (0, J.jsx)("p", {
            className: "muted",
            children: "\xBFQu\xE9 residuo tienes? Te digo c\xF3mo separarlo.",
          }),
          (0, J.jsxs)("form", {
            className: "ask",
            onSubmit: (m) => {
              (m.preventDefault(), b(l));
            },
            children: [
              (0, J.jsx)("input", {
                value: l,
                onChange: (m) => n(m.target.value),
                placeholder: "Ej: botellas, c\xE1scaras de pl\xE1tano y una pila",
                "aria-label": "Describe tu residuo",
              }),
              (0, J.jsxs)("button", {
                className: "btn",
                type: "submit",
                disabled: i || !l.trim(),
                children: [
                  (0, J.jsx)(L, { n: "search", size: 16 }),
                  (0, J.jsx)("span", { children: "Consultar" }),
                ],
              }),
            ],
          }),
          (0, J.jsx)("div", {
            className: "chips",
            children: q0.map((m) =>
              (0, J.jsx)(
                "button",
                { className: "chip chip-btn", onClick: () => b(m), children: m },
                m,
              ),
            ),
          }),
          o &&
            !o.matchedAny &&
            (0, J.jsxs)("div", {
              className: "result",
              children: [
                (0, J.jsxs)("p", {
                  children: [
                    (0, J.jsxs)("b", { children: ["No reconoc\xED \xAB", d, "\xBB."] }),
                    " Sigue esta gu\xEDa r\xE1pida:",
                  ],
                }),
                (0, J.jsxs)("ol", {
                  className: "steps",
                  children: [
                    (0, J.jsx)("li", {
                      children:
                        "\xBFEs peligroso (pilas, medicinas, qu\xEDmicos)? Entr\xE9galo aparte.",
                    }),
                    (0, J.jsxs)("li", {
                      children: [
                        "\xBFEs restos de comida o poda? Bolsa ",
                        (0, J.jsx)("b", { children: "verde" }),
                        ".",
                      ],
                    }),
                    (0, J.jsxs)("li", {
                      children: [
                        "\xBFEs pl\xE1stico, cart\xF3n, papel, vidrio o metal limpio y seco? Bolsa ",
                        (0, J.jsx)("b", { children: "blanca" }),
                        ".",
                      ],
                    }),
                    (0, J.jsxs)("li", {
                      children: [
                        "\xBFEst\xE1 sucio, usado o es sanitario? Bolsa ",
                        (0, J.jsx)("b", { children: "negra" }),
                        ".",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          o &&
            o.items.map((m) => {
              let f = ct[m.frac];
              return (0, J.jsxs)(
                "article",
                {
                  className: "result",
                  children: [
                    (0, J.jsxs)("div", {
                      className: "result-head",
                      children: [
                        (0, J.jsx)(ml, { color: f.color }),
                        (0, J.jsxs)("div", {
                          children: [
                            (0, J.jsx)("h3", { children: m.name }),
                            (0, J.jsxs)("p", {
                              className: "muted small",
                              children: [f.bag, " \xB7 ", f.label],
                            }),
                          ],
                        }),
                      ],
                    }),
                    m.steps.length > 0 &&
                      (0, J.jsx)("ol", {
                        className: "steps",
                        children: m.steps.map((x, S) => (0, J.jsx)("li", { children: x }, S)),
                      }),
                    m.where &&
                      (0, J.jsxs)("p", {
                        children: [
                          (0, J.jsx)("b", { children: "Cu\xE1ndo y d\xF3nde:" }),
                          " ",
                          m.where,
                        ],
                      }),
                    m.why &&
                      (0, J.jsxs)("p", {
                        className: "muted",
                        children: [(0, J.jsx)("b", { children: "Por qu\xE9:" }), " ", m.why],
                      }),
                    m.tip && (0, J.jsx)("p", { className: "tipline", children: m.tip }),
                    (0, J.jsx)("button", {
                      className: "btn ghost sm",
                      onClick: () => t(m.frac),
                      children: "Registrar entrega",
                    }),
                  ],
                },
                m.id,
              );
            }),
        ],
      });
    };
  var qr = K(Pa(), 1);
  var V = K(fa(), 1),
    Ur = { blanca: 12, verde: 4, negra: 0, roja: 20 },
    cg = [
      { name: "Semilla", min: 0 },
      { name: "Brote", min: 100 },
      { name: "\xC1rbol", min: 500 },
      { name: "Cedro", min: 1500 },
    ],
    sg = (a) => new Date(a).toDateString(),
    rg = ({ deliveries: a, setDeliveries: e, preset: t, toast: l }) => {
      let [n, i] = (0, qr.useState)(t || "blanca"),
        [u, o] = (0, qr.useState)("2"),
        c = Math.round(a.reduce((S, T) => S + T.kg * Ur[T.frac], 0)),
        d = a.filter((S) => S.frac !== "negra").reduce((S, T) => S + T.kg, 0),
        g = [...cg].reverse().find((S) => c >= S.min),
        b = cg.find((S) => S.min > c),
        m = new Set(a.map((S) => sg(S.ts))),
        f = 0;
      for (let S = 0; S < 365; S++) {
        let T = new Date(Date.now() - S * 864e5).toDateString();
        if (m.has(T)) f++;
        else if (S > 0) break;
      }
      let x = () => {
        let S = parseFloat(u.replace(",", "."));
        if (!isFinite(S) || S <= 0 || S > 200)
          return l("Escribe un peso v\xE1lido en kg (m\xE1x. 200).", "warn");
        if (a.some((T) => T.frac === n && sg(T.ts) === new Date().toDateString()))
          return l("Ya registraste esta fracci\xF3n hoy.", "warn");
        (e(
          [{ id: Ke(), ts: Date.now(), frac: n, kg: Math.round(S * 10) / 10 }, ...a].slice(0, 500),
        ),
          l(
            Ur[n] ? `Entrega registrada: +${Math.round(S * Ur[n])} puntos.` : "Entrega registrada.",
            "ok",
          ));
      };
      return (0, V.jsxs)("div", {
        className: "grid2",
        children: [
          (0, V.jsxs)("section", {
            className: "card",
            children: [
              (0, V.jsxs)("header", {
                className: "card-head",
                children: [
                  (0, V.jsx)("h2", { children: "EcoPuntos" }),
                  (0, V.jsx)("span", { className: "chip chip-ok", children: g.name }),
                ],
              }),
              (0, V.jsxs)("div", {
                className: "stat-row",
                children: [
                  (0, V.jsxs)("div", {
                    className: "stat",
                    children: [
                      (0, V.jsx)("b", { children: c }),
                      (0, V.jsx)("span", { children: "puntos" }),
                    ],
                  }),
                  (0, V.jsxs)("div", {
                    className: "stat",
                    children: [
                      (0, V.jsx)("b", { children: Math.round(d * 10) / 10 }),
                      (0, V.jsx)("span", { children: "kg desviados del relleno" }),
                    ],
                  }),
                  (0, V.jsxs)("div", {
                    className: "stat",
                    children: [
                      (0, V.jsx)("b", { children: f }),
                      (0, V.jsx)("span", { children: "d\xEDas seguidos" }),
                    ],
                  }),
                ],
              }),
              b &&
                (0, V.jsxs)(V.Fragment, {
                  children: [
                    (0, V.jsx)("div", {
                      className: "bar",
                      children: (0, V.jsx)("i", {
                        style: {
                          width: `${Math.min(100, ((c - g.min) / (b.min - g.min)) * 100)}%`,
                        },
                      }),
                    }),
                    (0, V.jsxs)("p", {
                      className: "muted small",
                      children: [b.min - c, " puntos para \xAB", b.name, "\xBB."],
                    }),
                  ],
                }),
              (0, V.jsx)("p", {
                className: "muted small",
                children:
                  "Aprovechables 12 pts/kg \xB7 org\xE1nicos 4 \xB7 especiales 20. Los negros no suman.",
              }),
            ],
          }),
          (0, V.jsxs)("section", {
            className: "card",
            children: [
              (0, V.jsx)("header", {
                className: "card-head",
                children: (0, V.jsx)("h2", { children: "Registrar entrega" }),
              }),
              (0, V.jsx)("div", {
                className: "seg",
                children: ["blanca", "verde", "negra", "roja"].map((S) =>
                  (0, V.jsxs)(
                    "button",
                    {
                      className: n === S ? "on" : "",
                      onClick: () => i(S),
                      children: [(0, V.jsx)(ml, { color: ct[S].color }), ct[S].short],
                    },
                    S,
                  ),
                ),
              }),
              (0, V.jsxs)("label", {
                className: "field",
                children: [
                  (0, V.jsx)("span", { children: "Peso aproximado (kg)" }),
                  (0, V.jsx)("input", {
                    value: u,
                    onChange: (S) => o(S.target.value),
                    inputMode: "decimal",
                  }),
                ],
              }),
              (0, V.jsx)("button", {
                className: "btn block",
                onClick: x,
                children: "Guardar entrega",
              }),
              (0, V.jsx)("h3", { className: "sub", children: "Historial" }),
              a.length === 0 &&
                (0, V.jsx)("p", {
                  className: "muted small",
                  children: "A\xFAn no hay entregas registradas.",
                }),
              (0, V.jsx)("ul", {
                className: "list",
                children: a
                  .slice(0, 8)
                  .map((S) =>
                    (0, V.jsxs)(
                      "li",
                      {
                        children: [
                          (0, V.jsx)(ml, { color: ct[S.frac].color }),
                          (0, V.jsxs)("span", {
                            className: "grow",
                            children: [ct[S.frac].short, " \xB7 ", S.kg, " kg"],
                          }),
                          (0, V.jsx)("span", {
                            className: "muted small",
                            children: new Date(S.ts).toLocaleDateString("es-CO", {
                              day: "numeric",
                              month: "short",
                            }),
                          }),
                        ],
                      },
                      S.id,
                    ),
                  ),
              }),
            ],
          }),
        ],
      });
    };
  var oa = K(fa(), 1),
    fg = ["Domingo", "Lunes", "Martes", "Mi\xE9rcoles", "Jueves", "Viernes", "S\xE1bado"],
    dg = ({ barrio: a }) => {
      let e = new Date().getDay(),
        t = dl.filter((l) => l.days.includes(e));
      return (0, oa.jsxs)("div", {
        className: "stack",
        children: [
          (0, oa.jsxs)("section", {
            className: "card",
            children: [
              (0, oa.jsx)("header", {
                className: "card-head",
                children: (0, oa.jsxs)("h2", { children: ["Recolecci\xF3n en ", a] }),
              }),
              t.length > 0
                ? (0, oa.jsxs)("p", {
                    children: [
                      (0, oa.jsxs)("b", { children: ["Hoy (", fg[e].toLowerCase(), "):"] }),
                      " ",
                      t.map((l) => `${l.bag.toLowerCase()} (${l.name.toLowerCase()})`).join(" y "),
                      ". Saca tus bolsas antes de las ",
                      t[0].time.split("\u2013")[0].trim(),
                      ".",
                    ],
                  })
                : (0, oa.jsx)("p", {
                    children: (0, oa.jsx)("b", {
                      children: "Hoy no hay recolecci\xF3n programada.",
                    }),
                  }),
              (0, oa.jsx)("div", {
                className: "week",
                children: fg.map((l, n) => {
                  let i = dl.filter((u) => u.days.includes(n));
                  return (0, oa.jsxs)(
                    "div",
                    {
                      className: "day" + (n === e ? " today" : ""),
                      children: [
                        (0, oa.jsx)("span", { children: l.slice(0, 3) }),
                        (0, oa.jsx)("div", {
                          children: i.length
                            ? i.map((u) => (0, oa.jsx)(ml, { color: ct[u.frac].color }, u.id))
                            : (0, oa.jsx)("em", { children: "\u2014" }),
                        }),
                      ],
                    },
                    l,
                  );
                }),
              }),
            ],
          }),
          (0, oa.jsx)("div", {
            className: "grid3",
            children: dl.map((l) => {
              let n = L0(l.frac);
              return (0, oa.jsxs)(
                "section",
                {
                  className: "card",
                  children: [
                    (0, oa.jsx)("header", {
                      className: "card-head",
                      children: (0, oa.jsxs)("div", {
                        className: "row tight",
                        children: [
                          (0, oa.jsx)(ml, { color: ct[l.frac].color }),
                          (0, oa.jsx)("h3", { children: l.name }),
                        ],
                      }),
                    }),
                    (0, oa.jsxs)("p", {
                      children: [(0, oa.jsx)("b", { children: l.dayLabel }), " \xB7 ", l.time],
                    }),
                    n &&
                      (0, oa.jsxs)("p", {
                        className: "muted small",
                        children: [
                          "Pr\xF3xima: ",
                          n.today
                            ? "hoy"
                            : n.date.toLocaleDateString("es-CO", {
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                              }),
                        ],
                      }),
                    (0, oa.jsx)("ul", {
                      className: "bullets",
                      children: l.accepts
                        .slice(0, 3)
                        .map((i) => (0, oa.jsx)("li", { children: i }, i)),
                    }),
                    (0, oa.jsx)("p", { className: "tipline", children: l.tip }),
                  ],
                },
                l.id,
              );
            }),
          }),
          (0, oa.jsx)("p", {
            className: "muted small",
            children: "A\xFAn no hay horarios. La central los enviar\xE1 en Mensajes cuando los publique.",
          }),
        ],
      });
    };
  var E = K(fa(), 1),
    $h = [
      { id: "mapa", label: "Seguimiento", icon: "nav" },
      { id: "residuos", label: "Residuos", icon: "bin" },
      { id: "puntos", label: "EcoPuntos", icon: "leaf" },
      { id: "calendario", label: "Calendario", icon: "calendar" },
    ],
    mg = ({ session: a, setSession: e, shared: t, online: l, serverAI: n, toast: i }) => {
      let [u, o] = (0, pa.useState)("mapa"),
        [c, d] = ot("ecoruta.c.deliveries", []),
        [g, b] = (0, pa.useState)(),
        [m, f] = (0, pa.useState)(!1),
        [x, S] = (0, pa.useState)(!1),
        T = k0(1e3),
        s = (0, pa.useMemo)(() => {
          let Ea = t.trucks
            .filter((Ra) => Ra.status !== "fuera")
            .sort((Ra, ie) => (Ra.ageSec ?? 1e9) - (ie.ageSec ?? 1e9))[0];
          return Ea
            ? { ...Ea, ageSec: (Ea.ageSec ?? 0) + Math.max(0, (T - t.lastSync) / 1e3) }
            : null;
        }, [t.trucks, t.lastSync, T]),
        r = a.home ? { lat: a.home.lat, lng: a.home.lng } : null,
        p = (0, pa.useMemo)(() => ug(s, r), [s, r?.lat, r?.lng]),
        eco_m = ecoMotion(s ? { lat: s.lat, lng: s.lng } : null, {
          status: s && s.status,
          noSignal: !!s && (s.ageSec || 0) > 180,
          paused: !!s && s.status === "pausado",
          loading: !!s && s.status === "en_parada",
        }),
        y = (0, pa.useRef)(!1);
      (0, pa.useEffect)(() => {
        if (p.state === "en_ruta" && p.etaSec !== void 0) {
          let D = p.etaSec / 60;
          if (D <= a.alertMin && !y.current) {
            y.current = !0;
            let Ea = `El cami\xF3n llega en unos ${Math.max(1, Math.round(D))} min a tu casa. Saca tus bolsas.`;
            (i(Ea, "ok"), a.sound && _r(), Lo([250, 120, 250]), W0("EcoRuta", Ea));
          } else D > a.alertMin + 4 && (y.current = !1);
        } else (p.state === "sin_camion" || p.state === "paso") && (y.current = !1);
      }, [p.state, p.etaSec, a.alertMin, a.sound]);
      let N = (0, pa.useRef)(null),
        [R, A] = (0, pa.useState)(!0),
        _ = (0, pa.useRef)("");
      ((0, pa.useEffect)(() => {
        s &&
          u === "mapa" &&
          _.current !== s.id &&
          ((_.current = s.id),
          A(!1),
          N.current?.fit([...(r ? [r] : []), { lat: s.lat, lng: s.lng }]));
      }, [s?.id, u]));
      let U = t.reports.filter(
          (D) => D.kind === "incident" && D.status === "abierto" && Date.now() - D.ts < 12 * 36e5,
        ),
        h = t.reports.filter((D) => D.kind === "citizen" && D.status === "abierto"),
        k = [],
        ya = [];
      if ((r && k.push({ id: "home", pos: r, kind: "home", label: "Mi casa" }), s)) {
        let D = Lr(s);
        if (D) {
          let Ea = ecoWin({ geometry: D.geo, cum: D.cum }, s, s.progressM);
          (ya.push({
            id: "route",
            pts: [{ lat: s.lat, lng: s.lng }, ...D.geo.slice(Ea.idx + 1)],
            color: "#2d6a4f",
            width: 5,
            opacity: 0.85,
            flow: eco_m.flow,
            fromTruck: 1,
          }),
            s.stops.forEach((Ra, ie) =>
              k.push({
                id: "s" + Ra.id,
                pos: Ra,
                kind: Ra.kind === "station" ? "station" : "stop",
                n: ie + 1,
                done: Ra.status !== "pending",
                label: Ra.name,
              }),
            ));
        }
        k.push({
          id: "truck",
          pos: { lat: s.lat, lng: s.lng },
          kind: "truck",
          label: "Cami\xF3n " + s.plate,
          state: eco_m.state,
          tag: eco_m.tag,
          glide: 5,
        });
      }
      (U.forEach(
        (D) =>
          D.lat != null &&
          D.lng != null &&
          k.push({
            id: "i" + D.id,
            pos: { lat: D.lat, lng: D.lng },
            kind: "incident",
            label: D.title,
          }),
      ),
        h.forEach(
          (D) =>
            D.lat != null &&
            D.lng != null &&
            k.push({
              id: "r" + D.id,
              pos: { lat: D.lat, lng: D.lng },
              kind: "report",
              label: D.title,
            }),
        ));
      let Xa = dl
        .map((D) => ({ s: D, d: D.days.includes(new Date().getDay()) }))
        .filter((D) => D.d);
      return (0, E.jsxs)("div", {
        className: "stack",
        children: [
          (0, E.jsx)("nav", {
            className: "tabs",
            role: "tablist",
            children: $h.map((D) =>
              (0, E.jsxs)(
                "button",
                {
                  role: "tab",
                  "aria-selected": u === D.id,
                  className: u === D.id ? "on" : "",
                  onClick: () => o(D.id),
                  children: [
                    (0, E.jsx)(L, { n: D.icon, size: 16 }),
                    (0, E.jsx)("span", { children: D.label }),
                  ],
                },
                D.id,
              ),
            ),
          }),
          u === "mapa" &&
            (0, E.jsxs)(E.Fragment, {
              children: [
                (0, E.jsx)(pl, {
                  ref: N,
                  className: "map-lg",
                  center: s ? { lat: s.lat, lng: s.lng } : r || pe,
                  zoom: 15,
                  markers: k,
                  lines: ya,
                  follow: R && !!s,
                  onUserMove: () => A(!1),
                  children: (0, E.jsxs)("div", {
                    className: "map-top",
                    onPointerDown: (D) => D.stopPropagation(),
                    children: [
                      (0, E.jsxs)("button", {
                        className: "pill" + (R && s ? " on" : ""),
                        onClick: () => {
                          s && (A(!0), N.current?.zoomTo(16));
                        },
                        disabled: !s,
                        children: [(0, E.jsx)(L, { n: "truck", size: 14 }), " Cami\xF3n"],
                      }),
                      (0, E.jsxs)("button", {
                        className: "pill",
                        onClick: () => r && (A(!1), N.current?.flyTo(r, 16)),
                        disabled: !r,
                        children: [(0, E.jsx)(L, { n: "home", size: 14 }), " Mi casa"],
                      }),
                      (0, E.jsx)("button", {
                        className: "pill",
                        onClick: () => {
                          (A(!1),
                            N.current?.fit([
                              ...(r ? [r] : []),
                              ...(s ? [{ lat: s.lat, lng: s.lng }] : []),
                            ]));
                        },
                        disabled: !r && !s,
                        children: "Ver todo",
                      }),
                    ],
                  }),
                }),
                (0, E.jsxs)("div", {
                  className: "grid2",
                  children: [
                    (0, E.jsxs)("section", {
                      className: "card hud",
                      children: [
                        !r &&
                          (0, E.jsxs)("div", {
                            children: [
                              (0, E.jsxs)("p", {
                                children: [
                                  (0, E.jsx)("b", { children: "A\xFAn no marcaste tu casa." }),
                                  " As\xED calculo cu\xE1nto tarda el cami\xF3n.",
                                ],
                              }),
                              (0, E.jsx)("button", {
                                className: "btn",
                                onClick: () => f(!0),
                                children: "Marcar mi casa",
                              }),
                            ],
                          }),
                        r &&
                          p.state === "sin_camion" &&
                          (0, E.jsxs)("div", {
                            children: [
                              (0, E.jsx)("p", {
                                className: "hud-title",
                                children: "No hay cami\xF3n en ruta ahora",
                              }),
                              (0, E.jsxs)("p", {
                                className: "muted",
                                children: [
                                  Xa.length
                                    ? `Hoy toca: ${Xa.map((D) => D.s.bag.toLowerCase()).join(" y ")}.`
                                    : "Hoy no hay recolecci\xF3n programada.",
                                  " Te avisamos cuando salga.",
                                ],
                              }),
                            ],
                          }),
                        r &&
                          p.state === "en_ruta" &&
                          p.etaSec !== void 0 &&
                          (0, E.jsxs)("div", {
                            children: [
                              (0, E.jsx)("p", {
                                className: "hud-label",
                                children: "Llega a tu casa en",
                              }),
                              (0, E.jsx)(
                                "p",
                                { className: "hud-eta", children: Xi(p.etaSec) },
                                Xi(p.etaSec),
                              ),
                              (0, E.jsxs)("p", {
                                className: "muted",
                                children: [
                                  kt(p.distM || 0),
                                  p.stopsBefore
                                    ? ` \xB7 ${p.stopsBefore} parada${p.stopsBefore > 1 ? "s" : ""} antes`
                                    : "",
                                ],
                              }),
                              eco_m.note &&
                                (0, E.jsx)("p", { className: "hud-note", children: eco_m.note }),
                            ],
                          }),
                        r &&
                          p.state === "paso" &&
                          (0, E.jsxs)("div", {
                            children: [
                              (0, E.jsx)("p", {
                                className: "hud-title",
                                children: "El cami\xF3n ya pas\xF3 por tu calle",
                              }),
                              (0, E.jsx)("p", {
                                className: "muted",
                                children: "\xBFNo alcanzaste a sacar tus bolsas? Rep\xF3rtalo.",
                              }),
                            ],
                          }),
                        r &&
                          p.state === "fuera_ruta" &&
                          (0, E.jsxs)("div", {
                            children: [
                              (0, E.jsx)("p", {
                                className: "hud-title",
                                children: "Tu casa no est\xE1 en la ruta actual",
                              }),
                              (0, E.jsxs)("p", {
                                className: "muted",
                                children: [
                                  "El cami\xF3n est\xE1 a ",
                                  kt(p.distM || 0),
                                  ". Su ruta pasa a ",
                                  kt(p.offM || 0),
                                  " de tu casa.",
                                ],
                              }),
                            ],
                          }),
                        r &&
                          p.state === "sin_senal" &&
                          (0, E.jsxs)("div", {
                            children: [
                              (0, E.jsx)("p", {
                                className: "hud-title",
                                children: "Sin se\xF1al del cami\xF3n",
                              }),
                              (0, E.jsxs)("p", {
                                className: "muted",
                                children: [
                                  "\xDAltima posici\xF3n ",
                                  jl(p.ageSec || 0),
                                  ". ",
                                  p.etaSec !== void 0
                                    ? `\xDAltima estimaci\xF3n: ${Xi(p.etaSec)}.`
                                    : "",
                                ],
                              }),
                            ],
                          }),
                        s &&
                          (0, E.jsxs)("div", {
                            className: "meta",
                            children: [
                              (0, E.jsxs)(be, {
                                tone: eco_m.tone,
                                children: [
                                  (0, E.jsx)("i", { className: "live live-" + eco_m.state }),
                                  eco_m.label,
                                ],
                              }),
                              (0, E.jsxs)(be, { children: ["Cami\xF3n ", s.plate] }),
                              (0, E.jsxs)(be, {
                                tone: (s.ageSec || 0) > 180 ? "bad" : "mute",
                                children: ["Se\xF1al ", jl(s.ageSec || 0)],
                              }),
                              s.source === "sim" &&
                                (0, E.jsx)(be, { tone: "warn", children: "Demostraci\xF3n" }),
                            ],
                          }),
                      ],
                    }),
                    (0, E.jsxs)("section", {
                      className: "card",
                      children: [
                        (0, E.jsx)("header", {
                          className: "card-head",
                          children: (0, E.jsx)("h2", { children: "Mi casa y avisos" }),
                        }),
                        (0, E.jsxs)("p", {
                          className: "small",
                          children: [
                            (0, E.jsx)(L, { n: "home", size: 14 }),
                            " ",
                            a.home ? a.home.address : "Sin ubicaci\xF3n",
                            " ",
                            (0, E.jsx)("button", {
                              className: "link",
                              onClick: () => f(!0),
                              children: "cambiar",
                            }),
                          ],
                        }),
                        (0, E.jsxs)("div", {
                          className: "row wrap",
                          children: [
                            (0, E.jsxs)("label", {
                              className: "inline",
                              children: [
                                "Avisarme a ",
                                (0, E.jsx)("select", {
                                  value: a.alertMin,
                                  onChange: (D) => e({ ...a, alertMin: +D.target.value }),
                                  children: [3, 5, 10, 15].map((D) =>
                                    (0, E.jsxs)("option", { value: D, children: [D, " min"] }, D),
                                  ),
                                }),
                              ],
                            }),
                            (0, E.jsxs)("label", {
                              className: "inline",
                              children: [
                                (0, E.jsx)("input", {
                                  type: "checkbox",
                                  checked: a.sound,
                                  onChange: (D) => e({ ...a, sound: D.target.checked }),
                                }),
                                " Sonido",
                              ],
                            }),
                            (0, E.jsxs)("button", {
                              className: "btn ghost sm",
                              onClick: () => {
                                ($0(),
                                  a.sound && _r(),
                                  i("Así te avisaremos cuando el camión esté cerca.", "ok"));
                              },
                              children: [(0, E.jsx)(L, { n: "bell", size: 14 }), " Probar aviso"],
                            }),
                          ],
                        }),
                        U.length > 0 &&
                          (0, E.jsxs)("div", {
                            className: "notice",
                            children: [
                              (0, E.jsx)("b", { children: "Incidentes reportados en la ruta" }),
                              (0, E.jsx)("ul", {
                                children: U.slice(0, 3).map((D) =>
                                  (0, E.jsxs)(
                                    "li",
                                    {
                                      children: [D.title, " \xB7 ", jl((Date.now() - D.ts) / 1e3)],
                                    },
                                    D.id,
                                  ),
                                ),
                              }),
                              (0, E.jsx)("span", {
                                className: "muted small",
                                children: "Pueden retrasar al cami\xF3n.",
                              }),
                            ],
                          }),
                        (0, E.jsxs)("button", {
                          className: "btn ghost block",
                          onClick: () => S(!0),
                          children: [
                            (0, E.jsx)(L, { n: "alert", size: 16 }),
                            " Reportar un problema en mi zona",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          u === "residuos" &&
            (0, E.jsx)(og, {
              online: l,
              serverAI: n,
              onRegister: (D) => {
                (b(D), o("puntos"));
              },
            }),
          u === "puntos" &&
            (0, E.jsx)(rg, { deliveries: c, setDeliveries: d, preset: g, toast: i }),
          u === "calendario" && (0, E.jsx)(dg, { barrio: a.barrio }),
          (0, E.jsx)(Wh, {
            open: m,
            onClose: () => f(!1),
            current: a.home,
            onSave: (D) => {
              (e({ ...a, home: D }), f(!1), i("Ubicaci\xF3n de tu casa guardada.", "ok"));
            },
          }),
          (0, E.jsx)(Fh, { open: x, onClose: () => S(!1), session: a, home: r, toast: i }),
        ],
      });
    },
    Wh = ({ open: a, onClose: e, current: t, onSave: l }) => {
      let [n, i] = (0, pa.useState)(t ? { lat: t.lat, lng: t.lng } : null),
        [u, o] = (0, pa.useState)(t?.address || ""),
        [c, d] = (0, pa.useState)(!1),
        g = (0, pa.useRef)(null);
      return (
        (0, pa.useEffect)(() => {
          a && (i(t ? { lat: t.lat, lng: t.lng } : null), o(t?.address || ""));
        }, [a]),
        (0, E.jsxs)($e, {
          open: a,
          onClose: e,
          title: "Ubicaci\xF3n de mi casa",
          children: [
            (0, E.jsx)("p", {
              className: "muted small",
              children: "Toca el mapa para marcar tu casa.",
            }),
            (0, E.jsx)(pl, {
              ref: g,
              className: "map-sm",
              center: n || pe,
              zoom: 16,
              lines: [],
              markers: n ? [{ id: "h", pos: n, kind: "home" }] : [],
              onTap: i,
            }),
            (0, E.jsxs)("label", {
              className: "field",
              children: [
                (0, E.jsx)("span", { children: "Direcci\xF3n o referencia" }),
                (0, E.jsx)("input", {
                  value: u,
                  onChange: (m) => o(m.target.value),
                  placeholder: "Cra 12 # 4-28",
                }),
              ],
            }),
            (0, E.jsxs)("div", {
              className: "row",
              children: [
                (0, E.jsxs)("button", {
                  className: "btn ghost",
                  onClick: async () => {
                    d(!0);
                    try {
                      let m = await rt();
                      (i(m), g.current?.flyTo(m, 17));
                    } catch {}
                    d(!1);
                  },
                  disabled: c,
                  children: [(0, E.jsx)(L, { n: "locate", size: 16 }), " Mi ubicaci\xF3n actual"],
                }),
                (0, E.jsx)("button", {
                  className: "btn grow",
                  disabled: !n,
                  onClick: () => n && l({ ...n, address: u.trim() || "Mi casa" }),
                  children: "Guardar",
                }),
              ],
            }),
          ],
        })
      );
    },
    Fh = ({ open: a, onClose: e, session: t, home: l, toast: n }) => {
      let [i, u] = (0, pa.useState)(Do[0].id),
        [o, c] = (0, pa.useState)(""),
        [d, g] = (0, pa.useState)("home"),
        [b, m] = (0, pa.useState)(!1),
        f = async () => {
          m(!0);
          let x = l;
          if (d === "gps" || !l)
            try {
              x = await rt(8e3);
            } catch {}
          let S = Do.find((r) => r.id === i).label,
            T = {
              id: Ke(),
              kind: "citizen",
              type: i,
              title: S,
              description: o.trim().slice(0, 300),
              lat: x ? x.lat : null,
              lng: x ? x.lng : null,
              severity: "media",
              ts: Date.now(),
              author: t.barrio,
              status: "abierto",
            },
            s = await qn(T);
          (m(!1),
            n(
              s === "sent"
                ? "Reporte enviado. El conductor lo ver\xE1."
                : "Sin conexi\xF3n: tu reporte qued\xF3 guardado y se enviar\xE1 solo.",
              s === "sent" ? "ok" : "warn",
            ),
            c(""),
            e());
        };
      return (0, E.jsxs)($e, {
        open: a,
        onClose: e,
        title: "Reportar un problema",
        children: [
          (0, E.jsxs)("label", {
            className: "field",
            children: [
              (0, E.jsx)("span", { children: "\xBFQu\xE9 pasa?" }),
              (0, E.jsx)("select", {
                value: i,
                onChange: (x) => u(x.target.value),
                children: Do.map((x) =>
                  (0, E.jsx)("option", { value: x.id, children: x.label }, x.id),
                ),
              }),
            ],
          }),
          (0, E.jsxs)("label", {
            className: "field",
            children: [
              (0, E.jsx)("span", { children: "Detalle (opcional)" }),
              (0, E.jsx)("textarea", {
                rows: 3,
                value: o,
                onChange: (x) => c(x.target.value),
                maxLength: 300,
                placeholder: "Ej. Bolsas rotas frente al parque desde ayer",
              }),
            ],
          }),
          (0, E.jsxs)("div", {
            className: "seg",
            children: [
              (0, E.jsx)("button", {
                className: d === "home" ? "on" : "",
                onClick: () => g("home"),
                disabled: !l,
                children: "En mi casa",
              }),
              (0, E.jsx)("button", {
                className: d === "gps" ? "on" : "",
                onClick: () => g("gps"),
                children: "Donde estoy ahora",
              }),
            ],
          }),
          (0, E.jsx)("button", {
            className: "btn block",
            onClick: f,
            disabled: b,
            children: b ? "Enviando\u2026" : "Enviar reporte",
          }),
        ],
      });
    };
  var Ga = K(Pa(), 1);
  var na = K(Pa(), 1);
  var Ih = "https://router.project-osrm.org/route/v1/driving/",
    Ph = {
      "sharp right": "cerrado a la derecha",
      right: "a la derecha",
      "slight right": "ligeramente a la derecha",
      straight: "recto",
      "slight left": "ligeramente a la izquierda",
      left: "a la izquierda",
      "sharp left": "cerrado a la izquierda",
    };
  function a1(a, e) {
    let { type: t, modifier: l, exit: n } = a.maneuver,
      i = a.name ? ` por ${a.name}` : "",
      u = l ? Ph[l] || l : "";
    switch (t) {
      case "depart":
        return `Inicia el recorrido${i}`;
      case "arrive":
        return e ? `Llegas a ${e}` : "Llegas a tu destino";
      case "roundabout":
      case "rotary":
      case "roundabout turn":
        return n ? `En la glorieta toma la salida ${n}${i}` : `Entra a la glorieta${i}`;
      case "exit roundabout":
      case "exit rotary":
        return `Sal de la glorieta${i}`;
      case "merge":
        return `Incorp\xF3rate ${u}${i}`.trim();
      case "fork":
        return `Mantente ${u}${i}`.trim();
      case "end of road":
        return `Al final de la v\xEDa gira ${u}${i}`.trim();
      case "new name":
      case "continue":
        return l === "uturn" ? "Haz un retorno" : `Contin\xFAa ${u || "recto"}${i}`;
      default:
        return l === "uturn"
          ? "Haz un retorno"
          : l === "straight"
            ? `Sigue recto${i}`
            : `Gira ${u}${i}`.trim();
    }
  }
  function pg(a, e) {
    return e.map((t) => t.id).join(",");
  }
  function gg(a, e, t) {
    let l = [a, ...e.map((o) => ({ lat: o.lat, lng: o.lng }))],
      n = Qi(l),
      i = e.map((o, c) => ({
        text: `Dir\xEDgete a ${o.name}`,
        dist: n[c + 1] - n[c],
        start: n[c],
        loc: l[c],
      })),
      u = n[n.length - 1];
    return {
      geometry: l,
      cum: n,
      steps: i,
      distance: u,
      duration: ((u * 1.35) / 1e3 / 18) * 3600,
      source: "straight",
      ver: t,
      key: pg(a, e),
    };
  }
  async function vg(a, e, t) {
    if (e.length === 0) throw new Error("sin paradas");
    let n = [a, ...e.map((c) => ({ lat: c.lat, lng: c.lng }))]
        .map((c) => `${c.lng.toFixed(6)},${c.lat.toFixed(6)}`)
        .join(";"),
      i = `${Ih}${n}?overview=full&geometries=geojson&steps=true&continue_straight=false`,
      u = new AbortController(),
      o = setTimeout(() => u.abort(), 9e3);
    try {
      let c = await fetch(i, { signal: u.signal });
      if (!c.ok) throw new Error("osrm " + c.status);
      let d = await c.json(),
        g = d.routes?.[0];
      if (d.code !== "Ok" || !g) throw new Error("sin ruta");
      let b = g.geometry.coordinates.map((S) => ({ lat: S[1], lng: S[0] })),
        m = Qi(b),
        f = [],
        x = 0;
      return (
        g.legs.forEach((S, T) => {
          S.steps.forEach((s) => {
            let r = s.maneuver.type === "arrive" ? e[T]?.name : void 0;
            (f.push({
              text: a1(s, r),
              dist: s.distance,
              start: Math.min(x, m[m.length - 1]),
              loc: { lat: s.maneuver.location[1], lng: s.maneuver.location[0] },
            }),
              (x += s.distance));
          });
        }),
        {
          geometry: b,
          cum: m,
          steps: f,
          distance: g.distance,
          duration: g.duration,
          source: "osrm",
          ver: t,
          key: pg(a, e),
        }
      );
    } finally {
      clearTimeout(o);
    }
  }
  function bg(a, e) {
    let t = e.filter((u) => u.kind === "station"),
      l = e.filter((u) => u.kind !== "station"),
      n = [],
      i = a;
    for (; l.length;) {
      let u = 0,
        o = 1 / 0;
      l.forEach((d, g) => {
        let b = ge(i, d);
        b < o && ((o = b), (u = g));
      });
      let [c] = l.splice(u, 1);
      (n.push(c), (i = c));
    }
    return [...n, ...t];
  }
  var hg = { startedAt: null, km: 0, done: 0, skipped: 0, kg: 0, unloads: 0 },
    yg = 7,
    e1 = 45;
  function t1(a) {
    return a === 1
      ? "Permiso de ubicaci\xF3n denegado. Act\xEDvalo en los ajustes del navegador o del tel\xE9fono."
      : a === 2
        ? "No se pudo obtener la ubicaci\xF3n (\xBFGPS apagado o sin se\xF1al?)."
        : "Tiempo de espera agotado buscando GPS.";
  }
  function Sg(a, e, t) {
    let [ecoPin, setEcoPin] = (0, na.useState)(!1),
      [l, n] = ot("ecoruta.d.stops", Cr),
      [i, u] = ot("ecoruta.d.cfg", { maxKg: 12e3, loadKg: 0, voice: !0, mode: "gps", simMult: 3 }),
      [o, c] = ot("ecoruta.d.shift", hg),
      [d, g] = ot("ecoruta.d.history", []),
      [b, m] = ot("ecoruta.d.run", "off"),
      [f, x] = (0, na.useState)(null),
      [S, T] = (0, na.useState)(""),
      [s, r] = (0, na.useState)(null),
      [p, y] = (0, na.useState)(0),
      [N, R] = (0, na.useState)(null),
      [A, _] = (0, na.useState)(!1),
      [U, h] = (0, na.useState)(0),
      k = (0, na.useRef)({
        stops: l,
        cfg: i,
        shift: o,
        run: b,
        pos: f,
        route: s,
        along: p,
        arrivedId: N,
        online: e,
        session: a,
        toast: t,
      });
    k.current = {
      stops: l,
      cfg: i,
      shift: o,
      run: b,
      pos: f,
      route: s,
      along: p,
      arrivedId: N,
      online: e,
      session: a,
      toast: t,
    };
    let ya = (0, na.useRef)(0),
      Xa = (0, na.useRef)(!1),
      D = (0, na.useRef)(0),
      Ea = (0, na.useRef)(new Set()),
      Ra = (0, na.useRef)(null),
      ie = (0, na.useRef)(18),
      We = (0, na.useRef)(0),
      ea = (0, na.useRef)(-1),
      Hn = (0, na.useRef)(0),
      Bl = (0, na.useRef)({ ver: -1, geo: [] }),
      Fe = l.filter((O) => O.status === "pending"),
      C = Fe.map((O) => O.id).join(","),
      q = Fe[0] || null,
      Z = (O) => {
        k.current.cfg.voice && J0(O);
      },
      da = (0, na.useCallback)(async () => {
        let { stops: O, pos: w, online: Y } = k.current,
          G = O.filter((Qa) => Qa.status === "pending");
        if (!G.length) {
          r(null);
          return;
        }
        if (!w || Xa.current) return;
        ((Xa.current = !0), _(!0));
        let Ma = ++ya.current,
          H;
        try {
          if (!Y) throw new Error("offline");
          H = await vg(w, G, Ma);
        } catch {
          ((H = gg(w, G, Ma)),
            Y &&
              k.current.toast(
                "No se pudo calcular la ruta por calles. Se usa l\xEDnea recta.",
                "warn",
              ));
        }
        ((Xa.current = !1),
          _(!1),
          (We.current = 0),
          (D.current = 0),
          (Ea.current = new Set()),
          y(0),
          r(H),
          H.source === "osrm" &&
            Z(`Ruta calculada. ${Math.round(H.distance / 100) / 10} kil\xF3metros.`));
      }, []);
    (0, na.useEffect)(() => {
      if (b === "off") {
        (r(null), y(0));
        return;
      }
      if (!Fe.length) {
        r(null);
        return;
      }
      (s && (s.key === C || s.key.endsWith("," + C))) || da();
    }, [b, C, U, !!f]);
    (0, na.useEffect)(() => {
      let lk = null,
        on = b !== "off",
        keep = (v) => {
          try {
            window.EcoNative && window.EcoNative.keepAwake && window.EcoNative.keepAwake(v);
          } catch {}
        },
        req = () => {
          on &&
            navigator.wakeLock &&
            document.visibilityState === "visible" &&
            navigator.wakeLock
              .request("screen")
              .then((x) => {
                lk = x;
              })
              .catch(() => {});
        };
      keep(on);
      req();
      document.addEventListener("visibilitychange", req);
      return () => {
        document.removeEventListener("visibilitychange", req);
        keep(!1);
        try {
          lk && lk.release();
        } catch {}
      };
    }, [b]);
    let ae = (0, na.useCallback)((O) => {
        let w = Ra.current,
          Y = O.speed;
        (!(Y >= 0) && w && (Y = ge(w, O) / Math.max(1, (O.ts - w.ts) / 1e3)), Y >= 0 || (Y = 0));
        let G = { ...O, speed: Y };
        if (
          (Y * 3.6 > 4 && (ie.current = ie.current * 0.8 + Y * 3.6 * 0.2),
          w && k.current.run === "on" && k.current.cfg.mode === "gps")
        ) {
          let Fa = ge(w, G);
          Fa > 3 && Fa < 300 && c((Ie) => ({ ...Ie, km: Ie.km + Fa / 1e3 }));
        }
        ((Ra.current = G), x(G));
        let { run: Ma, route: H, stops: Qa } = k.current;
        if (Ma !== "on" || !H) return;
        let dt = ecoWin(H, G, k.current.along, w ? ge(w, G) : void 0);
        if (
          (y(dt.along),
          k.current.cfg.mode === "gps" &&
            H.source === "osrm" &&
            (dt.off > 70 ? D.current++ : (D.current = 0),
            D.current >= 3 && k.current.online && !Xa.current))
        ) {
          ((D.current = 0),
            k.current.toast("Te saliste de la ruta. Recalculando\u2026", "warn"),
            Z("Recalculando ruta"),
            r(null),
            h((Fa) => Fa + 1));
          return;
        }
        let bl = H.steps.findIndex((Fa) => Fa.start > dt.along + 12);
        if (bl >= 0) {
          let Fa = H.steps[bl].start - dt.along,
            Ie = `${H.ver}:${bl}`;
          Fa <= 160 && Fa > 60 && !Ea.current.has(Ie + ":a")
            ? (Ea.current.add(Ie + ":a"),
              Z(`En ${Math.round(Fa / 10) * 10} metros, ${H.steps[bl].text}`))
            : Fa <= 60 &&
              !Ea.current.has(Ie + ":b") &&
              (Ea.current.add(Ie + ":b"), Z(H.steps[bl].text));
        }
        let hl = Qa.find((Fa) => Fa.status === "pending");
        hl &&
          ge(G, hl) <= e1 &&
          k.current.arrivedId !== hl.id &&
          (R(hl.id), K0(), Lo([200, 100, 200]), Z(`Llegaste a ${hl.name}`));
      }, []),
      Ca = (0, na.useRef)(ae);
    ((Ca.current = ae),
      (0, na.useEffect)(() => {
        if (i.mode !== "gps") return;
        if (!("geolocation" in navigator)) {
          T("Este dispositivo no tiene geolocalizaci\xF3n.");
          return;
        }
        let O = navigator.geolocation.watchPosition(
          (w) => {
            (T(""),
              Ca.current({
                lat: w.coords.latitude,
                lng: w.coords.longitude,
                speed: w.coords.speed ?? NaN,
                heading: w.coords.heading ?? 0,
                acc: w.coords.accuracy,
                ts: w.timestamp || Date.now(),
              }));
          },
          (w) => T(t1(w.code)),
          { enableHighAccuracy: !0, maximumAge: 2e3, timeout: 2e4 },
        );
        return () => navigator.geolocation.clearWatch(O);
      }, [i.mode]),
      (0, na.useEffect)(() => {
        if (i.mode !== "sim") return;
        if (!k.current.pos || Ra.current === null) {
          let w = k.current.stops.find((G) => G.kind === "station"),
            Y = w ? { lat: w.lat, lng: w.lng } : pe;
          Ca.current({ ...Y, speed: 0, heading: 0, acc: 5, ts: Date.now() });
        }
        let O = setInterval(() => {
          let { route: w, run: Y, arrivedId: G, cfg: Ma } = k.current;
          if (Y !== "on" || !w || G) return;
          We.current = Math.min(w.cum[w.cum.length - 1], We.current + yg * Ma.simMult);
          let { point: H, heading: Qa } = Z0(w.geometry, w.cum, We.current);
          Ca.current({ ...H, speed: yg * Ma.simMult, heading: Qa, acc: 5, ts: Date.now() });
        }, 1e3);
        return () => clearInterval(O);
      }, [i.mode]),
      (0, na.useEffect)(() => {
        if (i.mode !== "sim" || !N) return;
        let O = setTimeout(() => vl(), 3500);
        return () => clearTimeout(O);
      }, [N, i.mode]));
    let Na = (0, na.useCallback)(async (O) => {
      let {
        pos: w,
        session: Y,
        route: G,
        stops: Ma,
        cfg: H,
        run: Qa,
        arrivedId: dt,
        along: bl,
      } = k.current;
      if (!w) return;
      G &&
        Bl.current.ver !== G.ver &&
        (Bl.current = {
          ver: G.ver,
          geo: G.geometry.map((Wi) => [
            Math.round(Wi.lat * 1e5) / 1e5,
            Math.round(Wi.lng * 1e5) / 1e5,
          ]),
        });
      let hl = O || (Qa === "pause" ? "pausado" : dt ? "en_parada" : "en_ruta"),
        Fa = {
          id: "camion-" + (kn(Y.plate).replace(/ /g, "") || "1"),
          driver: Y.name,
          plate: Y.plate || "\u2014",
          lat: w.lat,
          lng: w.lng,
          speed: w.speed,
          heading: w.heading,
          ts: Date.now(),
          status: hl,
          stops: Ma.map(({ id: Wi, name: jg, lat: Bg, lng: Yg, status: Gg, kind: Xg }) => ({
            id: Wi,
            name: jg,
            lat: Bg,
            lng: Yg,
            status: Gg,
            kind: Xg,
          })),
          progressM: bl,
          avgKmh: Math.round(ie.current),
          loadKg: H.loadKg,
          maxKg: H.maxKg,
          routeVer: G ? G.ver : 0,
          geometry: G ? Bl.current.geo : void 0,
          source: H.mode,
        },
        Ie = !!G && (ea.current !== G.ver || Hn.current % 20 === 0);
      Hn.current++;
      let ecoOk = await G0(Fa, Y.pin, Ie);
      ecoOk !== "busy" &&
        (setEcoPin(ecoOk === "pin"),
        ecoOk === "need"
          ? (ea.current = -1)
          : ecoOk && ecoOk !== "pin" && G && Ie && (ea.current = G.ver));
    }, []);
    (0, na.useEffect)(() => {
      if (b === "off") return;
      Na();
      let O = setInterval(() => Na(), 4e3);
      return () => clearInterval(O);
    }, [b, Na, s?.ver, N]);
    let Ut = () => {
        if (!Fe.length) {
          t("No hay paradas pendientes.", "warn");
          return;
        }
        ((ea.current = -1),
          m("on"),
          c((O) => (O.startedAt ? O : { ...O, startedAt: Date.now() })),
          Z("Ruta iniciada"));
      },
      ft = () => m(b === "pause" ? "on" : "pause"),
      Ge = () => {
        Na("fuera");
        let O = k.current.shift;
        (O.startedAt &&
          g((w) =>
            [
              {
                id: Ke(),
                date: Date.now(),
                minutes: Math.round((Date.now() - O.startedAt) / 6e4),
                km: Math.round(O.km * 10) / 10,
                done: O.done,
                skipped: O.skipped,
                kg: O.kg,
                unloads: O.unloads,
              },
              ...w,
            ].slice(0, 40),
          ),
          c(hg),
          m("off"),
          R(null),
          n((w) => w.map((Y) => ({ ...Y, status: "pending", actualKg: void 0 }))),
          u((w) => ({ ...w, loadKg: 0 })),
          t("Turno cerrado y guardado en el historial.", "ok"));
      };
    function vl(O, w) {
      let Y = k.current.stops,
        G = w ? Y.find((H) => H.id === w) : Y.find((H) => H.status === "pending");
      if (!G) return;
      let Ma = G.kind === "station" ? 0 : Math.max(0, Math.round(O ?? G.estKg));
      (n((H) => H.map((Qa) => (Qa.id === G.id ? { ...Qa, status: "done", actualKg: Ma } : Qa))),
        G.kind === "station"
          ? (u((H) => ({ ...H, loadKg: 0 })),
            c((H) => ({ ...H, done: H.done + 1, unloads: H.unloads + 1 })),
            k.current.toast(`Descarga registrada en ${G.name}.`, "ok"))
          : (u((H) => ({ ...H, loadKg: H.loadKg + Ma })),
            c((H) => ({ ...H, done: H.done + 1, kg: H.kg + Ma })),
            k.current.toast(`${G.name}: ${Ma} kg registrados.`, "ok"),
            k.current.cfg.loadKg + Ma >= k.current.cfg.maxKg * 0.9 &&
              (k.current.toast("Carga al 90 %. Ve a descargar a la estaci\xF3n.", "warn"),
              Z("Atenci\xF3n, carga al noventa por ciento"))),
        R(null));
    }
    let $i = (O) => {
        (n((w) => w.map((Y) => (Y.id === O ? { ...Y, status: "skipped" } : Y))),
          c((w) => ({ ...w, skipped: w.skipped + 1 })),
          N === O && R(null),
          r(null),
          h((w) => w + 1));
      },
      Bo = (O) => {
        (n((w) => w.map((Y) => (Y.id === O ? { ...Y, status: "pending" } : Y))), r(null));
      },
      Ag = (O, w, Y = "blanca", G = 300) => {
        let Ma = {
          id: Ke(),
          name: w || "Parada nueva",
          address: `${O.lat.toFixed(5)}, ${O.lng.toFixed(5)}`,
          barrio: "",
          waste: Y,
          estKg: G,
          lat: O.lat,
          lng: O.lng,
          status: "pending",
          kind: "stop",
        };
        n((H) => {
          let Qa = H.findIndex((dt) => dt.kind === "station" && dt.status === "pending");
          return Qa < 0 ? [...H, Ma] : [...H.slice(0, Qa), Ma, ...H.slice(Qa)];
        });
      },
      Cg = (O) => n((w) => w.filter((Y) => Y.id !== O)),
      Og = (O, w) =>
        n((Y) => {
          let G = Y.findIndex((Qa) => Qa.id === O),
            Ma = G + w;
          if (G < 0 || Ma < 0 || Ma >= Y.length) return Y;
          let H = [...Y];
          return (([H[G], H[Ma]] = [H[Ma], H[G]]), H);
        }),
      Dg = (O, w) => n((Y) => Y.map((G) => (G.id === O ? { ...G, ...w } : G))),
      Rg = () => {
        let O = k.current.pos || pe,
          w = l.filter((Y) => Y.status !== "pending");
        (n([...w, ...bg(O, Fe)]), t("Paradas reordenadas por cercan\xEDa.", "ok"));
      },
      wg = () => {
        (n(Cr), r(null), t("Paradas restauradas.", "ok"));
      },
      _g = () => {
        (u((O) => ({ ...O, loadKg: 0 })),
          c((O) => ({ ...O, unloads: O.unloads + 1 })),
          t("Descarga manual registrada.", "ok"));
      },
      kg = (O) => u((w) => ({ ...w, loadKg: Math.max(0, w.loadKg + O) })),
      jr = (O) => {
        (O === "gps" && ((Ra.current = null), x(null)),
          (We.current = 0),
          r(null),
          u((w) => ({ ...w, mode: O })));
      },
      Lg = () => {
        (T(""), u((O) => ({ ...O })), (Ra.current = null), jr("gps"));
      },
      Br = s ? s.steps.findIndex((O) => O.start > p + 12) : -1,
      Yo = s && Br >= 0 ? s.steps[Br] : null,
      Ug = Yo ? Math.max(0, Yo.start - p) : 0,
      Yr = s ? Math.max(0, s.distance - p) : 0,
      qg = s && s.distance > 0 ? s.duration * (Yr / s.distance) : 0,
      Hg = Fe.filter((O) => O.kind === "stop").reduce((O, w) => O + w.estKg, 0);
    return {
      stops: l,
      pending: Fe,
      nextStop: q,
      cfg: i,
      setCfg: u,
      shift: o,
      history: d,
      run: b,
      pos: f,
      gpsErr: S,
      route: s,
      along: p,
      arrived: (N && l.find((O) => O.id === N)) || null,
      routing: A,
      nextStep: Yo,
      distToStep: Ug,
      remainingM: Yr,
      remainingSec: qg,
      pendingKg: Hg,
      avgKmh: ie.current,
      start: Ut,
      togglePause: ft,
      finishShift: Ge,
      completeStop: vl,
      skipStop: $i,
      reopenStop: Bo,
      addStop: Ag,
      removeStop: Cg,
      moveStop: Og,
      updateStop: Dg,
      optimize: Rg,
      resetStops: wg,
      unload: _g,
      addLoad: kg,
      setMode: jr,
      retryGps: Lg,
      publish: Na,
      pinBad: ecoPin,
      recalc: () => {
        (r(null), h((O) => O + 1));
      },
    };
  }
  var v = K(fa(), 1),
    l1 = [
      { id: "paradas", label: "Paradas", icon: "list" },
      { id: "carga", label: "Carga", icon: "scale" },
      { id: "incidentes", label: "Incidentes", icon: "alert" },
      { id: "turno", label: "Turno", icon: "chart" },
    ],
    xg = ({ session: a, shared: e, online: t, toast: l, onSos: n }) => {
      let i = Sg(a, t, l),
        eco_m = ecoMotionDrv(i),
        [u, o] = (0, Ga.useState)("paradas"),
        [c, d] = (0, Ga.useState)(!0),
        [g, b] = (0, Ga.useState)(!1),
        [m, f] = (0, Ga.useState)(null),
        x = (0, Ga.useRef)(null),
        [S, T] = (0, Ga.useState)("");
      (0, Ga.useEffect)(() => {
        i.arrived && T(String(i.arrived.estKg));
      }, [i.arrived?.id]);
      let s = e.reports.filter(
          (h) => h.kind === "incident" && h.status === "abierto" && Date.now() - h.ts < 12 * 36e5,
        ),
        r = e.reports.filter((h) => h.kind === "citizen" && h.status === "abierto"),
        p = e.reports.filter(
          (h) => h.kind === "sos" && h.status === "abierto" && Date.now() - h.ts < 36e5,
        ),
        y = [],
        N = [];
      if (
        (i.stops.forEach((h, k) =>
          y.push({
            id: "s" + h.id,
            pos: h,
            kind: h.kind === "station" ? "station" : "stop",
            n: k + 1,
            done: h.status !== "pending",
            current: i.nextStop?.id === h.id,
            label: h.name,
          }),
        ),
        i.route)
      ) {
        let h = i.pos
          ? ecoWin(i.route, i.pos, i.along)
          : Lt(i.route.geometry, i.route.cum, i.route.geometry[0]);
        (N.push({ id: "full", pts: i.route.geometry, color: "#2d6a4f", width: 4, opacity: 0.25 }),
          N.push({
            id: "rest",
            pts: [
              i.pos ? { lat: i.pos.lat, lng: i.pos.lng } : i.route.geometry[0],
              ...i.route.geometry.slice(h.idx + 1),
            ],
            color: i.route.source === "osrm" ? "#2d6a4f" : "#b7791f",
            width: 5,
            dash: i.route.source === "osrm" ? void 0 : "8 8",
            flow: i.route.source === "osrm" ? eco_m.flow : void 0,
            fromTruck: 1,
          }));
      }
      (s.forEach(
        (h) =>
          h.lat != null &&
          h.lng != null &&
          y.push({
            id: "i" + h.id,
            pos: { lat: h.lat, lng: h.lng },
            kind: "incident",
            label: h.title,
          }),
      ),
        r.forEach(
          (h) =>
            h.lat != null &&
            h.lng != null &&
            y.push({
              id: "r" + h.id,
              pos: { lat: h.lat, lng: h.lng },
              kind: "report",
              label: h.title,
            }),
        ),
        p.forEach(
          (h) =>
            h.lat != null &&
            h.lng != null &&
            y.push({
              id: "x" + h.id,
              pos: { lat: h.lat, lng: h.lng },
              kind: "sos",
              label: "SOS " + h.author,
            }),
        ),
        i.pos &&
          y.push({
            id: "truck",
            pos: { lat: i.pos.lat, lng: i.pos.lng },
            kind: "truck",
            label: "Mi cami\xF3n",
            state: eco_m.state,
            tag: eco_m.tag,
            glide: 1,
          }));
      let R = i.run !== "off",
        A = Math.min(100, (i.cfg.loadKg / i.cfg.maxKg) * 100),
        _ = i.cfg.maxKg - i.cfg.loadKg,
        U = i.pendingKg > _;
      return (0, v.jsxs)("div", {
        className: "stack",
        children: [
          p.length > 0 &&
            (0, v.jsxs)("div", {
              className: "banner bad",
              children: [
                (0, v.jsx)(L, { n: "alert" }),
                " SOS activo de otro veh\xEDculo: ",
                p.map((h) => h.author).join(", "),
              ],
            }),
          (0, v.jsxs)(pl, {
            ref: x,
            className: "map-lg",
            center: i.pos || pe,
            zoom: 16,
            markers: y,
            lines: N,
            follow: c,
            onUserMove: () => d(!1),
            onTap: g
              ? (h) => {
                  (f(h), b(!1));
                }
              : void 0,
            hint: g ? "Toca el mapa para ubicar la nueva parada" : void 0,
            children: [
              (0, v.jsx)("div", {
                className: "guide",
                onPointerDown: (h) => h.stopPropagation(),
                children:
                  R && i.nextStep
                    ? (0, v.jsxs)(v.Fragment, {
                        children: [
                          (0, v.jsxs)("div", {
                            className: "guide-main",
                            children: [
                              (0, v.jsx)("span", {
                                className: "guide-dist",
                                children: kt(i.distToStep),
                              }),
                              (0, v.jsx)("span", {
                                className: "guide-text",
                                children: i.nextStep.text,
                              }),
                            ],
                          }),
                          (0, v.jsxs)("div", {
                            className: "guide-sub",
                            children: [
                              "Quedan ",
                              kt(i.remainingM),
                              " \xB7 ",
                              Xi(i.remainingSec),
                              i.nextStop ? ` \xB7 Siguiente: ${i.nextStop.name}` : "",
                            ],
                          }),
                        ],
                      })
                    : R && i.routing
                      ? (0, v.jsx)("div", {
                          className: "guide-main",
                          children: (0, v.jsx)("span", {
                            className: "guide-text",
                            children: "Calculando ruta por las calles de L\xEDbano\u2026",
                          }),
                        })
                      : R && !i.pos
                        ? (0, v.jsx)("div", {
                            className: "guide-main",
                            children: (0, v.jsx)("span", {
                              className: "guide-text",
                              children: "Esperando se\xF1al GPS\u2026",
                            }),
                          })
                        : R && i.pending.length === 0
                          ? (0, v.jsx)("div", {
                              className: "guide-main",
                              children: (0, v.jsx)("span", {
                                className: "guide-text",
                                children: "Ruta completa. Finaliza el turno.",
                              }),
                            })
                          : (0, v.jsx)("div", {
                              className: "guide-main",
                              children: (0, v.jsx)("span", {
                                className: "guide-text",
                                children:
                                  "Listo. Pulsa \xABIniciar ruta\xBB para recibir la gu\xEDa.",
                              }),
                            }),
              }),
              (0, v.jsxs)("div", {
                className: "map-top bottom",
                onPointerDown: (h) => h.stopPropagation(),
                children: [
                  (0, v.jsxs)("button", {
                    className: "pill" + (c ? " on" : ""),
                    onClick: () => {
                      (d(!0), x.current?.zoomTo(17));
                    },
                    children: [(0, v.jsx)(L, { n: "locate", size: 14 }), " Seguir"],
                  }),
                  (0, v.jsx)("button", {
                    className: "pill",
                    onClick: () => {
                      (d(!1), x.current?.fit([...(i.pos ? [i.pos] : []), ...i.pending]));
                    },
                    children: "Ver ruta",
                  }),
                ],
              }),
              (0, v.jsx)("button", {
                className: "sos-fab",
                onClick: n,
                onPointerDown: (h) => h.stopPropagation(),
                children: "SOS",
              }),
            ],
          }),
          i.arrived &&
            (0, v.jsxs)("section", {
              className: "card arrive",
              children: [
                (0, v.jsxs)("h3", { children: ["Llegaste a ", i.arrived.name] }),
                (0, v.jsxs)("div", {
                  className: "row wrap",
                  children: [
                    (0, v.jsxs)("label", {
                      className: "inline",
                      children: [
                        "Kg recolectados ",
                        (0, v.jsx)("input", {
                          className: "mini",
                          value: S,
                          onChange: (h) => T(h.target.value),
                          inputMode: "numeric",
                        }),
                      ],
                    }),
                    (0, v.jsxs)("button", {
                      className: "btn",
                      onClick: () => i.completeStop(parseFloat(S) || i.arrived.estKg),
                      children: [
                        (0, v.jsx)(L, { n: "check", size: 16 }),
                        " ",
                        i.arrived.kind === "station"
                          ? "Registrar descarga"
                          : "Registrar recolecci\xF3n",
                      ],
                    }),
                    (0, v.jsx)("button", {
                      className: "btn ghost",
                      onClick: () => i.skipStop(i.arrived.id),
                      children: "Omitir",
                    }),
                  ],
                }),
              ],
            }),
          (0, v.jsxs)("section", {
            className: "card",
            children: [
              (0, v.jsxs)("div", {
                className: "row wrap between",
                children: [
                  (0, v.jsxs)("div", {
                    className: "row wrap",
                    children: [
                      !R &&
                        (0, v.jsxs)("button", {
                          className: "btn",
                          onClick: i.start,
                          children: [(0, v.jsx)(L, { n: "play", size: 16 }), " Iniciar ruta"],
                        }),
                      R &&
                        (0, v.jsxs)("button", {
                          className: "btn ghost",
                          onClick: i.togglePause,
                          children: [
                            (0, v.jsx)(L, { n: i.run === "pause" ? "play" : "pause", size: 16 }),
                            " ",
                            i.run === "pause" ? "Reanudar" : "Pausar",
                          ],
                        }),
                      R &&
                        (0, v.jsx)("button", {
                          className: "btn ghost",
                          onClick: () => {
                            confirm("\xBFFinalizar el turno y guardar el resumen?") &&
                              i.finishShift();
                          },
                          children: "Finalizar turno",
                        }),
                      R &&
                        (0, v.jsx)("button", {
                          className: "btn ghost",
                          onClick: i.recalc,
                          title: "Recalcular ruta",
                          children: (0, v.jsx)(L, { n: "refresh", size: 16 }),
                        }),
                    ],
                  }),
                  (0, v.jsxs)("div", {
                    className: "row wrap",
                    children: [
                      (0, v.jsxs)("div", {
                        className: "seg sm",
                        children: [
                          (0, v.jsx)("button", {
                            className: i.cfg.mode === "gps" ? "on" : "",
                            onClick: () => i.setMode("gps"),
                            children: "GPS real",
                          }),
                          (0, v.jsx)("button", {
                            className: i.cfg.mode === "sim" ? "on" : "",
                            onClick: () => i.setMode("sim"),
                            children: "Demo",
                          }),
                        ],
                      }),
                      (0, v.jsx)("button", {
                        className: "icon-btn",
                        onClick: () => i.setCfg((h) => ({ ...h, voice: !h.voice })),
                        "aria-label": "Voz",
                        title: "Gu\xEDa por voz",
                        children: (0, v.jsx)(L, { n: i.cfg.voice ? "speaker" : "speakeroff" }),
                      }),
                    ],
                  }),
                ],
              }),
              (0, v.jsxs)("div", {
                className: "meta",
                children: [
                  i.run !== "off" &&
                    (0, v.jsxs)(be, {
                      tone: eco_m.tone,
                      children: [
                        (0, v.jsx)("i", { className: "live live-" + eco_m.state }),
                        eco_m.label,
                      ],
                    }),
                  i.cfg.mode === "gps"
                    ? i.gpsErr
                      ? (0, v.jsx)(be, { tone: "bad", children: i.gpsErr })
                      : i.pos
                        ? (0, v.jsxs)(be, {
                            tone: "ok",
                            children: ["GPS \xB1", Math.round(i.pos.acc), " m"],
                          })
                        : (0, v.jsx)(be, { tone: "warn", children: "Buscando GPS\u2026" })
                    : (0, v.jsxs)(be, {
                        tone: "warn",
                        children: ["Simulaci\xF3n \xD7", i.cfg.simMult],
                      }),
                  i.route &&
                    (0, v.jsx)(be, {
                      tone: i.route.source === "osrm" ? "ok" : "warn",
                      children:
                        i.route.source === "osrm"
                          ? "Ruta por calles"
                          : "L\xEDnea recta (sin mapa de calles)",
                    }),
                  R &&
                    (0, v.jsx)(be, {
                      tone: t && !i.pinBad ? "ok" : "bad",
                      children: i.pinBad
                        ? "PIN incorrecto: los ciudadanos NO ven tu camión"
                        : t
                          ? e.serverOk
                            ? "Publicando a ciudadanos"
                            : "Solo modo local"
                          : "Sin internet: guardando",
                    }),
                  i.cfg.mode === "sim" &&
                    (0, v.jsxs)("label", {
                      className: "inline small",
                      children: [
                        "Velocidad ",
                        (0, v.jsx)("select", {
                          value: i.cfg.simMult,
                          onChange: (h) => i.setCfg((k) => ({ ...k, simMult: +h.target.value })),
                          children: [1, 3, 6, 12].map((h) =>
                            (0, v.jsxs)("option", { value: h, children: ["\xD7", h] }, h),
                          ),
                        }),
                      ],
                    }),
                ],
              }),
              i.cfg.mode === "gps" &&
                i.gpsErr &&
                (0, v.jsx)("button", {
                  className: "btn ghost sm",
                  onClick: i.retryGps,
                  children: "Reintentar GPS",
                }),
            ],
          }),
          (0, v.jsx)("nav", {
            className: "tabs",
            role: "tablist",
            children: l1.map((h) =>
              (0, v.jsxs)(
                "button",
                {
                  role: "tab",
                  "aria-selected": u === h.id,
                  className: u === h.id ? "on" : "",
                  onClick: () => o(h.id),
                  children: [
                    (0, v.jsx)(L, { n: h.icon, size: 16 }),
                    (0, v.jsx)("span", { children: h.label }),
                  ],
                },
                h.id,
              ),
            ),
          }),
          u === "paradas" &&
            (0, v.jsxs)("section", {
              className: "card",
              children: [
                (0, v.jsxs)("header", {
                  className: "card-head wrap",
                  children: [
                    (0, v.jsxs)("h2", {
                      children: ["Paradas (", i.pending.length, " pendientes)"],
                    }),
                    (0, v.jsxs)("div", {
                      className: "row wrap",
                      children: [
                        (0, v.jsxs)("button", {
                          className: "btn ghost sm",
                          onClick: () => {
                            (b(!0), d(!1));
                          },
                          children: [(0, v.jsx)(L, { n: "plus", size: 14 }), " Agregar en mapa"],
                        }),
                        (0, v.jsxs)("button", {
                          className: "btn ghost sm",
                          onClick: async () => {
                            try {
                              let h = i.pos || (await rt());
                              f({ lat: h.lat, lng: h.lng });
                            } catch {
                              l("No hay ubicaci\xF3n disponible.", "warn");
                            }
                          },
                          children: [(0, v.jsx)(L, { n: "pin", size: 14 }), " Mi posici\xF3n"],
                        }),
                        (0, v.jsxs)("button", {
                          className: "btn ghost sm",
                          onClick: i.optimize,
                          children: [(0, v.jsx)(L, { n: "route", size: 14 }), " Optimizar"],
                        }),
                        (0, v.jsx)("button", {
                          className: "btn ghost sm",
                          onClick: () => {
                            confirm("\xBFRestaurar las paradas originales?") && i.resetStops();
                          },
                          children: "Restaurar",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, v.jsx)("ul", {
                  className: "stops",
                  children: i.stops.map((h, k) =>
                    (0, v.jsxs)(
                      "li",
                      {
                        className: h.status + (i.nextStop?.id === h.id ? " next" : ""),
                        children: [
                          (0, v.jsx)("span", {
                            className: "num",
                            children:
                              h.status === "done" ? (0, v.jsx)(L, { n: "check", size: 13 }) : k + 1,
                          }),
                          (0, v.jsxs)("div", {
                            className: "grow",
                            children: [
                              (0, v.jsx)("b", { children: h.name }),
                              (0, v.jsxs)("div", {
                                className: "muted small",
                                children: [
                                  h.address,
                                  h.barrio ? ` \xB7 ${h.barrio}` : "",
                                  " \xB7 ",
                                  h.kind === "station" ? "descarga" : `~${h.estKg} kg`,
                                  h.actualKg ? ` \xB7 real ${h.actualKg} kg` : "",
                                ],
                              }),
                              h.note &&
                                (0, v.jsx)("div", { className: "muted small", children: h.note }),
                            ],
                          }),
                          (0, v.jsxs)("div", {
                            className: "row tight",
                            children: [
                              h.status === "pending" &&
                                (0, v.jsxs)(v.Fragment, {
                                  children: [
                                    (0, v.jsx)("button", {
                                      className: "icon-btn",
                                      title: "Marcar recolectada",
                                      onClick: () => i.completeStop(void 0, h.id),
                                      children: (0, v.jsx)(L, { n: "check", size: 16 }),
                                    }),
                                    (0, v.jsx)("button", {
                                      className: "icon-btn",
                                      title: "Omitir",
                                      onClick: () => i.skipStop(h.id),
                                      children: (0, v.jsx)(L, { n: "skip", size: 16 }),
                                    }),
                                    (0, v.jsx)("button", {
                                      className: "icon-btn",
                                      title: "Subir",
                                      onClick: () => i.moveStop(h.id, -1),
                                      children: (0, v.jsx)(L, { n: "up", size: 16 }),
                                    }),
                                    (0, v.jsx)("button", {
                                      className: "icon-btn",
                                      title: "Bajar",
                                      onClick: () => i.moveStop(h.id, 1),
                                      children: (0, v.jsx)(L, { n: "down", size: 16 }),
                                    }),
                                  ],
                                }),
                              h.status === "skipped" &&
                                (0, v.jsx)("button", {
                                  className: "btn ghost sm",
                                  onClick: () => i.reopenStop(h.id),
                                  children: "Reabrir",
                                }),
                              (0, v.jsx)("button", {
                                className: "icon-btn",
                                title: "Eliminar",
                                onClick: () => i.removeStop(h.id),
                                children: (0, v.jsx)(L, { n: "trash", size: 16 }),
                              }),
                            ],
                          }),
                        ],
                      },
                      h.id,
                    ),
                  ),
                }),
                r.length > 0 &&
                  (0, v.jsxs)(v.Fragment, {
                    children: [
                      (0, v.jsx)("h3", { className: "sub", children: "Reportes de ciudadanos" }),
                      (0, v.jsx)("ul", {
                        className: "list",
                        children: r.map((h) =>
                          (0, v.jsxs)(
                            "li",
                            {
                              children: [
                                (0, v.jsx)(L, { n: "bin", size: 16 }),
                                (0, v.jsxs)("div", {
                                  className: "grow",
                                  children: [
                                    (0, v.jsx)("b", { children: h.title }),
                                    " ",
                                    (0, v.jsxs)("span", {
                                      className: "muted small",
                                      children: [h.author, " \xB7 ", jl((Date.now() - h.ts) / 1e3)],
                                    }),
                                    h.description &&
                                      (0, v.jsx)("div", {
                                        className: "muted small",
                                        children: h.description,
                                      }),
                                  ],
                                }),
                                h.lat != null &&
                                  h.lng != null &&
                                  (0, v.jsx)("button", {
                                    className: "btn ghost sm",
                                    onClick: () => {
                                      (i.addStop(
                                        { lat: h.lat, lng: h.lng },
                                        h.title + " (reporte)",
                                      ),
                                        l("Agregada como parada.", "ok"));
                                    },
                                    children: "Agregar parada",
                                  }),
                                (0, v.jsx)("button", {
                                  className: "btn ghost sm",
                                  onClick: () => Dr(h.id, a.pin),
                                  children: "Resuelto",
                                }),
                              ],
                            },
                            h.id,
                          ),
                        ),
                      }),
                    ],
                  }),
              ],
            }),
          u === "carga" &&
            (0, v.jsxs)("section", {
              className: "card",
              children: [
                (0, v.jsxs)("header", {
                  className: "card-head",
                  children: [
                    (0, v.jsx)("h2", { children: "Carga del cami\xF3n" }),
                    (0, v.jsxs)(be, {
                      tone: A > 90 ? "bad" : A > 75 ? "warn" : "ok",
                      children: [Math.round(A), " %"],
                    }),
                  ],
                }),
                (0, v.jsx)("div", {
                  className: "bar big",
                  children: (0, v.jsx)("i", {
                    style: { width: `${A}%` },
                    className: A > 90 ? "bad" : A > 75 ? "warn" : "",
                  }),
                }),
                (0, v.jsxs)("p", {
                  children: [
                    (0, v.jsx)("b", { children: i.cfg.loadKg.toLocaleString("es-CO") }),
                    " de ",
                    i.cfg.maxKg.toLocaleString("es-CO"),
                    " kg \xB7 libres ",
                    Math.max(0, _).toLocaleString("es-CO"),
                    " kg",
                  ],
                }),
                (0, v.jsx)("p", {
                  className: U ? "warn-text" : "muted",
                  children: U
                    ? `Pendientes ~${i.pendingKg.toLocaleString("es-CO")} kg: no caben. Descarga antes de terminar.`
                    : `Pendientes ~${i.pendingKg.toLocaleString("es-CO")} kg: caben.`,
                }),
                (0, v.jsxs)("div", {
                  className: "row wrap",
                  children: [
                    (0, v.jsx)("button", {
                      className: "btn ghost sm",
                      onClick: () => i.addLoad(100),
                      children: "+100 kg",
                    }),
                    (0, v.jsx)("button", {
                      className: "btn ghost sm",
                      onClick: () => i.addLoad(-100),
                      children: "\u2212100 kg",
                    }),
                    (0, v.jsx)("button", {
                      className: "btn",
                      onClick: i.unload,
                      children: "Registrar descarga",
                    }),
                    (0, v.jsxs)("label", {
                      className: "inline small",
                      children: [
                        "Capacidad (kg) ",
                        (0, v.jsx)("input", {
                          className: "mini",
                          value: i.cfg.maxKg,
                          inputMode: "numeric",
                          onChange: (h) => {
                            let k = parseInt(h.target.value) || 0;
                            i.setCfg((ya) => ({ ...ya, maxKg: Math.max(500, Math.min(4e4, k)) }));
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          u === "incidentes" && (0, v.jsx)(i1, { session: a, pos: i.pos, reports: s, toast: l }),
          u === "turno" &&
            (0, v.jsxs)("div", {
              className: "grid2",
              children: [
                (0, v.jsxs)("section", {
                  className: "card",
                  children: [
                    (0, v.jsx)("header", {
                      className: "card-head",
                      children: (0, v.jsx)("h2", { children: "Turno actual" }),
                    }),
                    (0, v.jsxs)("div", {
                      className: "stat-row",
                      children: [
                        (0, v.jsxs)("div", {
                          className: "stat",
                          children: [
                            (0, v.jsx)("b", { children: i.shift.done }),
                            (0, v.jsx)("span", { children: "paradas" }),
                          ],
                        }),
                        (0, v.jsxs)("div", {
                          className: "stat",
                          children: [
                            (0, v.jsx)("b", { children: i.shift.kg.toLocaleString("es-CO") }),
                            (0, v.jsx)("span", { children: "kg recolectados" }),
                          ],
                        }),
                        (0, v.jsxs)("div", {
                          className: "stat",
                          children: [
                            (0, v.jsx)("b", { children: i.shift.km.toFixed(1) }),
                            (0, v.jsx)("span", { children: "km (GPS)" }),
                          ],
                        }),
                      ],
                    }),
                    (0, v.jsx)("p", {
                      className: "muted small",
                      children: i.shift.startedAt
                        ? `Iniciado a las ${new Date(i.shift.startedAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })} \xB7 omitidas: ${i.shift.skipped} \xB7 descargas: ${i.shift.unloads}`
                        : "Sin turno iniciado.",
                    }),
                  ],
                }),
                (0, v.jsxs)("section", {
                  className: "card",
                  children: [
                    (0, v.jsx)("header", {
                      className: "card-head",
                      children: (0, v.jsx)("h2", { children: "Historial" }),
                    }),
                    i.history.length === 0 &&
                      (0, v.jsx)("p", {
                        className: "muted small",
                        children: "A\xFAn no has cerrado turnos.",
                      }),
                    (0, v.jsx)("ul", {
                      className: "list",
                      children: i.history
                        .slice(0, 8)
                        .map((h) =>
                          (0, v.jsx)(
                            "li",
                            {
                              children: (0, v.jsxs)("div", {
                                className: "grow",
                                children: [
                                  (0, v.jsx)("b", {
                                    children: new Date(h.date).toLocaleDateString("es-CO", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                    }),
                                  }),
                                  (0, v.jsxs)("div", {
                                    className: "muted small",
                                    children: [
                                      h.done,
                                      " paradas \xB7 ",
                                      h.kg.toLocaleString("es-CO"),
                                      " kg \xB7 ",
                                      h.km,
                                      " km \xB7 ",
                                      h.minutes,
                                      " min",
                                    ],
                                  }),
                                ],
                              }),
                            },
                            h.id,
                          ),
                        ),
                    }),
                  ],
                }),
              ],
            }),
          (0, v.jsx)(n1, {
            pt: m,
            onClose: () => f(null),
            onSave: (h, k, ya) => {
              (m && i.addStop(m, h, k, ya), f(null), l("Parada agregada.", "ok"));
            },
          }),
        ],
      });
    },
    n1 = ({ pt: a, onClose: e, onSave: t }) => {
      let [l, n] = (0, Ga.useState)(""),
        [i, u] = (0, Ga.useState)("blanca"),
        [o, c] = (0, Ga.useState)("300");
      return (0, v.jsxs)($e, {
        open: !!a,
        onClose: e,
        title: "Nueva parada",
        children: [
          (0, v.jsxs)("label", {
            className: "field",
            children: [
              (0, v.jsx)("span", { children: "Nombre o direcci\xF3n" }),
              (0, v.jsx)("input", {
                value: l,
                onChange: (d) => n(d.target.value),
                placeholder: "Ej. Carrera 11 # 6-20",
                autoFocus: !0,
              }),
            ],
          }),
          (0, v.jsxs)("div", {
            className: "grid2 tight",
            children: [
              (0, v.jsxs)("label", {
                className: "field",
                children: [
                  (0, v.jsx)("span", { children: "Residuo" }),
                  (0, v.jsxs)("select", {
                    value: i,
                    onChange: (d) => u(d.target.value),
                    children: [
                      (0, v.jsx)("option", { value: "blanca", children: "Aprovechable" }),
                      (0, v.jsx)("option", { value: "verde", children: "Org\xE1nico" }),
                      (0, v.jsx)("option", { value: "negra", children: "Ordinario" }),
                      (0, v.jsx)("option", { value: "mixto", children: "Mixto" }),
                    ],
                  }),
                ],
              }),
              (0, v.jsxs)("label", {
                className: "field",
                children: [
                  (0, v.jsx)("span", { children: "Kg estimados" }),
                  (0, v.jsx)("input", {
                    value: o,
                    onChange: (d) => c(d.target.value),
                    inputMode: "numeric",
                  }),
                ],
              }),
            ],
          }),
          (0, v.jsx)("button", {
            className: "btn block",
            onClick: () => {
              (t(l.trim(), i, parseInt(o) || 300), n(""));
            },
            children: "Agregar",
          }),
        ],
      });
    },
    i1 = ({ session: a, pos: e, reports: t, toast: l }) => {
      let [n, i] = (0, Ga.useState)(Oo[0].id),
        [u, o] = (0, Ga.useState)("media"),
        [c, d] = (0, Ga.useState)(""),
        [g, b] = (0, Ga.useState)(!1),
        m = async () => {
          b(!0);
          let f = e;
          if (!f)
            try {
              f = await rt(8e3);
            } catch {
              f = null;
            }
          let x = Oo.find((s) => s.id === n).label,
            S = {
              id: Ke(),
              kind: "incident",
              type: n,
              title: x,
              description: c.trim().slice(0, 300),
              lat: f ? f.lat : null,
              lng: f ? f.lng : null,
              severity: u,
              ts: Date.now(),
              author: a.plate || a.name,
              status: "abierto",
            },
            T = await qn(S, a.pin);
          (b(!1),
            d(""),
            l(
              T === "sent"
                ? "Incidente reportado a todos."
                : "Sin conexi\xF3n: incidente guardado, se enviar\xE1 solo al volver la se\xF1al.",
              T === "sent" ? "ok" : "warn",
            ));
        };
      return (0, v.jsxs)("div", {
        className: "grid2",
        children: [
          (0, v.jsxs)("section", {
            className: "card",
            children: [
              (0, v.jsx)("header", {
                className: "card-head",
                children: (0, v.jsx)("h2", { children: "Reportar incidente" }),
              }),
              (0, v.jsxs)("label", {
                className: "field",
                children: [
                  (0, v.jsx)("span", { children: "Tipo" }),
                  (0, v.jsx)("select", {
                    value: n,
                    onChange: (f) => i(f.target.value),
                    children: Oo.map((f) =>
                      (0, v.jsx)("option", { value: f.id, children: f.label }, f.id),
                    ),
                  }),
                ],
              }),
              (0, v.jsx)("div", {
                className: "seg",
                children: ["baja", "media", "alta"].map((f) =>
                  (0, v.jsx)(
                    "button",
                    {
                      className: u === f ? "on" : "",
                      onClick: () => o(f),
                      children: f[0].toUpperCase() + f.slice(1),
                    },
                    f,
                  ),
                ),
              }),
              (0, v.jsxs)("label", {
                className: "field",
                children: [
                  (0, v.jsx)("span", { children: "Detalle (opcional)" }),
                  (0, v.jsx)("textarea", {
                    rows: 3,
                    value: c,
                    onChange: (f) => d(f.target.value),
                    maxLength: 300,
                  }),
                ],
              }),
              (0, v.jsx)("p", {
                className: "muted small",
                children: e
                  ? "Se enviar\xE1 con la ubicaci\xF3n actual del cami\xF3n."
                  : "Se intentar\xE1 obtener tu ubicaci\xF3n al enviar.",
              }),
              (0, v.jsx)("button", {
                className: "btn block",
                onClick: m,
                disabled: g,
                children: g ? "Enviando\u2026" : "Enviar reporte",
              }),
            ],
          }),
          (0, v.jsxs)("section", {
            className: "card",
            children: [
              (0, v.jsx)("header", {
                className: "card-head",
                children: (0, v.jsx)("h2", { children: "Activos (\xFAltimas 12 h)" }),
              }),
              t.length === 0 &&
                (0, v.jsx)("p", {
                  className: "muted small",
                  children: "No hay incidentes activos.",
                }),
              (0, v.jsx)("ul", {
                className: "list",
                children: t.map((f) =>
                  (0, v.jsxs)(
                    "li",
                    {
                      children: [
                        (0, v.jsx)(L, { n: "alert", size: 16 }),
                        (0, v.jsxs)("div", {
                          className: "grow",
                          children: [
                            (0, v.jsx)("b", { children: f.title }),
                            " ",
                            (0, v.jsx)(be, {
                              tone:
                                f.severity === "alta"
                                  ? "bad"
                                  : f.severity === "media"
                                    ? "warn"
                                    : "mute",
                              children: f.severity,
                            }),
                            (0, v.jsxs)("div", {
                              className: "muted small",
                              children: [
                                f.author,
                                " \xB7 ",
                                jl((Date.now() - f.ts) / 1e3),
                                f.description ? ` \xB7 ${f.description}` : "",
                              ],
                            }),
                          ],
                        }),
                        (0, v.jsx)("button", {
                          className: "btn ghost sm",
                          onClick: () => Dr(f.id, a.pin),
                          children: "Resuelto",
                        }),
                      ],
                    },
                    f.id,
                  ),
                ),
              }),
            ],
          }),
        ],
      });
    };
  var Ji = K(Pa(), 1);
  var Oe = K(fa(), 1),
    u1 = [
      ["123", "L\xEDnea \xFAnica de emergencias"],
      ["119", "Bomberos"],
      ["132", "Cruz Roja"],
      ["144", "Defensa Civil"],
    ],
    zg = ({ open: a, onClose: e, session: t, toast: l }) => {
      let [n, i] = (0, Ji.useState)(null),
        [u, o] = (0, Ji.useState)("busy");
      (0, Ji.useEffect)(() => {
        a &&
          (o("busy"),
          rt(8e3)
            .then((f) => {
              (i(f), o("ok"));
            })
            .catch(() => o("none")));
      }, [a]);
      let c = n ? `${n.lat.toFixed(5)},${n.lng.toFixed(5)}` : "",
        d = `AUXILIO EcoRuta. ${t.name}${t.plate ? " (cami\xF3n " + t.plate + ")" : ""} necesita ayuda.${c ? " Ubicaci\xF3n: https://maps.google.com/?q=" + c : " Ubicaci\xF3n no disponible."}`,
        g = /iPhone|iPad/i.test(navigator.userAgent),
        b = `sms:${t.emergencyPhone}${g ? "&" : "?"}body=${encodeURIComponent(d)}`,
        m = async () => {
          let f = {
              id: Ke(),
              kind: "sos",
              type: "sos",
              title: "SOS",
              description: d.slice(0, 300),
              lat: n?.lat ?? null,
              lng: n?.lng ?? null,
              severity: "alta",
              ts: Date.now(),
              author: t.plate || t.name,
              status: "abierto",
            },
            x = await qn(f, t.pin);
          l(
            x === "sent"
              ? "Alerta enviada a la central y a otros veh\xEDculos."
              : "Sin internet: la alerta se enviar\xE1 al volver la se\xF1al. Usa llamada o SMS ahora.",
            x === "sent" ? "ok" : "warn",
          );
        };
      return (0, Oe.jsxs)($e, {
        open: a,
        onClose: e,
        title: "Pedir ayuda",
        children: [
          (0, Oe.jsx)("p", {
            className: "muted small",
            children:
              u === "busy"
                ? "Buscando tu ubicaci\xF3n\u2026"
                : n
                  ? `Ubicaci\xF3n: ${c}`
                  : "No pude obtener la ubicaci\xF3n; el mensaje saldr\xE1 sin coordenadas.",
          }),
          (0, Oe.jsxs)("div", {
            className: "stack",
            style: { marginTop: 10 },
            children: [
              (0, Oe.jsx)("div", {
                className: "grid2 tight",
                children: u1.map(([f, x]) =>
                  (0, Oe.jsxs)(
                    "a",
                    {
                      className: "btn ghost",
                      href: `tel:${f}`,
                      children: [(0, Oe.jsx)(L, { n: "phone", size: 16 }), " ", f, " \xB7 ", x],
                    },
                    f,
                  ),
                ),
              }),
              (0, Oe.jsxs)("a", {
                className: "btn",
                href: b,
                children: [
                  (0, Oe.jsx)(L, { n: "send", size: 16 }),
                  " Enviar SMS con mi ubicaci\xF3n",
                  t.emergencyPhone ? "" : " (elige contacto)",
                ],
              }),
              (0, Oe.jsx)("button", {
                className: "btn ghost",
                onClick: m,
                children: "Alertar a la central y otros camiones",
              }),
              (0, Oe.jsx)("button", {
                className: "btn ghost",
                onClick: () => {
                  navigator.clipboard
                    ?.writeText(d)
                    .then(() => l("Mensaje copiado.", "ok"))
                    .catch(() => l(d, "ok"));
                },
                children: "Copiar mensaje",
              }),
              (0, Oe.jsx)("p", {
                className: "muted small",
                children:
                  "Las llamadas y los SMS funcionan sin internet, solo con se\xF1al celular.",
              }),
            ],
          }),
        ],
      });
    };
  var gl = K(Pa(), 1);
  var o1 = "ecoruta-tiles-v1";
  function Ho() {
    let a = [];
    for (let e = 13; e <= 17; e++) {
      let t = ve({ lat: MB.n, lng: MB.w }, e),
        l = ve({ lat: MB.s, lng: MB.e }, e);
      for (let n = Math.floor(t.x / 256); n <= Math.floor(l.x / 256); n++)
        for (let i = Math.floor(t.y / 256); i <= Math.floor(l.y / 256); i++) a.push([e, n, i]);
    }
    return a;
  }
  var jo = () => me("ecoruta.tilesDl", null);
  async function Mg(a) {
    if (!("caches" in window))
      throw new Error(
        "Esta versi\xF3n de la app no puede guardar mapas sin internet. Usa EcoRuta desde el navegador o el APK de Capacitor.",
      );
    let e = await caches.open(o1).catch(() => {
        throw new Error(
          "Este dispositivo no permite guardar el mapa desde aqu\xED. En la app Android el mapa sin internet viene incluido: ejecuta descargar_mapa y vuelve a compilar.",
        );
      }),
      t = Ho(),
      l = 0,
      n = 0,
      i = 0,
      u = async () => {
        for (; i < t.length;) {
          let [o, c, d] = t[i++],
            g = _o(o, c, d);
          try {
            if (!(await e.match(g))) {
              let b = await fetch(g, { mode: "cors" });
              b.ok && (await e.put(g, b));
            }
            n++;
          } catch {}
          a(++l, t.length);
        }
      };
    return (
      await Promise.all([u(), u(), u(), u()]),
      n > t.length * 0.6 && Ze("ecoruta.tilesDl", { ts: Date.now(), count: n }),
      n
    );
  }
  var aa = K(fa(), 1),
    Eg = ({ open: a, onClose: e, toast: t, online: l, onWipe: n }) => {
      let [eco_th, eco_setTh] = (0, gl.useState)(ecoTheme()),
        [eco_pf, eco_setPf] = (0, gl.useState)(ecoPerf()),
        [i, u] = (0, gl.useState)(null),
        [o, c] = (0, gl.useState)(jo()),
        [d, g] = (0, gl.useState)(Gi()),
        [b, m] = (0, gl.useState)(window.__pwa || null);
      ((0, gl.useEffect)(() => {
        a && (c(jo()), g(Gi()));
      }, [a]),
        (0, gl.useEffect)(() => {
          let S = (T) => {
            (T.preventDefault(), m(T));
          };
          return (
            window.addEventListener("beforeinstallprompt", S),
            () => window.removeEventListener("beforeinstallprompt", S)
          );
        }, []));
      let f = async () => {
          if (!l) return t("Necesitas internet para descargar el mapa.", "warn");
          u([0, Ho().length]);
          try {
            let S = await Mg((T, s) => u([T, s]));
            t(`Mapa guardado (${S} teselas).`, "ok");
          } catch (S) {
            t(S.message, "bad");
          }
          (u(null), c(jo()));
        },
        x = async () => {
          let r = window.__ecoProbe
            ? await window.__ecoProbe(d)
            : { ok: !0, addr: d, msg: "Direcci\xF3n guardada." };
          r.addr !== void 0 && (j0(r.addr), g(r.addr));
          let m = document.getElementById("eco-probe");
          (m && (m.textContent = r.msg), t(r.msg, r.ok ? "ok" : "warn"));
        };
      return (0, aa.jsx)($e, {
        open: a,
        onClose: e,
        title: "Ajustes y ayuda",
        wide: !0,
        children: (0, aa.jsxs)("div", {
          className: "stack",
          children: [
            (0, aa.jsxs)("section", {
              children: [
                (0, aa.jsx)("h4", { children: "Apariencia" }),
                (0, aa.jsx)("div", {
                  className: "seg",
                  role: "radiogroup",
                  "aria-label": "Tema",
                  children: [
                    ["auto", "Autom\xE1tico", "auto"],
                    ["light", "Claro", "sun"],
                    ["dark", "Oscuro", "moon"],
                  ].map(([eco_a, eco_b, eco_c]) =>
                    (0, aa.jsxs)(
                      "button",
                      {
                        className: eco_th === eco_a ? "on" : "",
                        role: "radio",
                        "aria-checked": eco_th === eco_a,
                        onClick: () => {
                          (eco_setTh(eco_a), ecoApplyTheme(eco_a));
                        },
                        children: [(0, aa.jsx)(L, { n: eco_c, size: 16 }), eco_b],
                      },
                      eco_a,
                    ),
                  ),
                }),
                (0, aa.jsx)("h4", { children: "Animaciones" }),
                (0, aa.jsx)("div", {
                  className: "seg",
                  role: "radiogroup",
                  "aria-label": "Animaciones",
                  children: [
                    ["auto", "Autom\xE1tico"],
                    ["full", "Completas"],
                    ["lite", "Reducidas"],
                  ].map(([eco_a, eco_b]) =>
                    (0, aa.jsx)(
                      "button",
                      {
                        className: eco_pf === eco_a ? "on" : "",
                        role: "radio",
                        "aria-checked": eco_pf === eco_a,
                        onClick: () => {
                          (eco_setPf(eco_a), ecoApplyPerf(eco_a));
                        },
                        children: eco_b,
                      },
                      eco_a,
                    ),
                  ),
                }),
                (0, aa.jsx)("p", {
                  className: "muted small",
                  children: "Reducidas ahorra bater\xEDa y va m\xE1s fluido en celulares lentos.",
                }),
              ],
            }),
            (0, aa.jsxs)("section", {
              children: [
                (0, aa.jsx)("h4", { children: "Mapa sin internet" }),
                (0, aa.jsxs)("p", {
                  className: "muted small",
                  children: [
                    "Descarga el mapa de L\xEDbano para verlo sin se\xF1al. ",
                    o
                      ? `Guardado el ${new Date(o.ts).toLocaleDateString("es-CO")}.`
                      : "A\xFAn no descargado.",
                  ],
                }),
                (0, aa.jsxs)("button", {
                  className: "btn",
                  onClick: f,
                  disabled: !!i,
                  children: [
                    (0, aa.jsx)(L, { n: "download", size: 16 }),
                    " ",
                    i
                      ? `Descargando ${i[0]}/${i[1]}`
                      : o
                        ? "Actualizar mapa"
                        : "Descargar mapa de L\xEDbano",
                  ],
                }),
              ],
            }),
            (0, aa.jsxs)("section", {
              children: [
                (0, aa.jsx)("h4", { children: "Servidor (para la app instalada en celulares)" }),
                (0, aa.jsxs)("p", {
                  className: "muted small",
                  children: [
                    "D\xE9jalo vac\xEDo en el computador. En el celular escribe la direcci\xF3n del servidor, por ejemplo ",
                    (0, aa.jsx)("code", { children: "http://192.168.1.20:3000" }),
                    ".",
                  ],
                }),
                (0, aa.jsxs)("div", {
                  className: "row",
                  children: [
                    (0, aa.jsx)("input", {
                      value: d,
                      onChange: (S) => g(S.target.value),
                      placeholder: "http://192.168.1.20:3000",
                    }),
                    (0, aa.jsx)("button", {
                      className: "btn ghost",
                      onClick: x,
                      children: "Guardar",
                    }),
                    (0, aa.jsx)("button", {
                      className: "btn ghost",
                      onClick: async () => {
                        let r = window.__ecoProbe
                            ? await window.__ecoProbe(d)
                            : { ok: !1, msg: "La prueba no est\xE1 disponible." },
                          m = document.getElementById("eco-probe");
                        (m && (m.textContent = r.msg), t(r.msg, r.ok ? "ok" : "warn"));
                      },
                      children: "Probar",
                    }),
                  ],
                }),
                (0, aa.jsx)("p", { id: "eco-probe", className: "muted small", role: "status" }),
              ],
            }),
            (0, aa.jsxs)("section", {
              children: [
                (0, aa.jsx)("h4", { children: "Instalar" }),
                (0, aa.jsxs)("ul", {
                  className: "bullets",
                  children: [
                    (0, aa.jsx)("li", {
                      children:
                        "En el celular, abre la direcci\xF3n del servidor y toca \xABInstalar\xBB.",
                    }),
                  ],
                }),
                b &&
                  (0, aa.jsx)("button", {
                    className: "btn ghost",
                    onClick: () => {
                      b.prompt();
                    },
                    children: "Instalar EcoRuta en este dispositivo",
                  }),
              ],
            }),
            (0, aa.jsxs)("section", {
              children: [
                (0, aa.jsx)("h4", { children: "Privacidad" }),
                (0, aa.jsxs)("button", {
                  className: "btn ghost",
                  onClick: () => {
                    confirm(
                      "Se borrar\xE1n tu perfil, tu casa, tus entregas y el mapa guardado en este dispositivo.",
                    ) && n();
                  },
                  children: [
                    (0, aa.jsx)(L, { n: "trash", size: 16 }),
                    " Borrar todos mis datos de este dispositivo",
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    };
  var j = K(fa(), 1);
  function Hr() {
    let [a, e] = ot("ecoruta.session", null),
      t = B0(),
      l = Y0(),
      n = Q0(5e3),
      [i, u] = (0, Ye.useState)([]),
      [o, c] = (0, Ye.useState)(!1),
      [d, g] = (0, Ye.useState)(!1),
      [b, m] = (0, Ye.useState)(!1),
      [f, x] = (0, Ye.useState)(wo()),
      S = (0, Ye.useRef)(0),
      T = (0, Ye.useCallback)((y, N = "ok") => {
        let R = ++S.current;
        (u((A) => [...A.slice(-2), { id: R, text: y, tone: N }]),
          setTimeout(() => u((A) => A.filter((_) => _.id !== R)), 4500));
      }, []);
    (0, Ye.useEffect)(() => {
      let y = async () => {
        (await Or(), x(wo()));
      };
      y();
      let N = setInterval(y, 12e3);
      return (
        window.addEventListener("online", y),
        () => {
          (clearInterval(N), window.removeEventListener("online", y));
        }
      );
    }, []);
    let s = async () => {
        if (a) {
          if (a.role === "driver") {
            if (
              localStorage.getItem("ecoruta.d.run") !== '"off"' &&
              !confirm(
                "Tienes una ruta activa. Si sales, los ciudadanos dejar\xE1n de ver el cami\xF3n. \xBFSalir?",
              )
            )
              return;
            (localStorage.setItem("ecoruta.d.run", '"off"'), await Rr(a.pin));
          }
          e(null);
        }
      },
      r = async () => {
        (a?.role === "driver" && (await Rr(a.pin)),
          Object.keys(localStorage)
            .filter((y) => y.startsWith("ecoruta."))
            .forEach((y) => localStorage.removeItem(y)));
        try {
          await caches.delete("ecoruta-tiles-v1");
        } catch {}
        location.reload();
      };
    if (!a)
      return (0, j.jsxs)(j.Fragment, {
        children: [
          (0, j.jsx)(ng, { pinRequired: l.pinRequired, onDone: (y) => e(y) }),
          (0, j.jsx)(kr, { items: i }),
        ],
      });
    let p = a.role === "driver";
    return (0, j.jsxs)("div", {
      className: "app",
      children: [
        (0, j.jsx)(kr, { items: i }),
        (0, j.jsx)("header", {
          className: "top",
          children: (0, j.jsxs)("div", {
            className: "top-in",
            children: [
              (0, j.jsxs)("div", {
                className: "brand",
                children: [
                  (0, j.jsx)("span", {
                    className: "logo",
                    children: (0, j.jsx)(L, { n: "leaf", size: 18 }),
                  }),
                  (0, j.jsxs)("div", {
                    className: "brand-t",
                    children: [
                      (0, j.jsx)("strong", { children: "EcoRuta" }),
                      (0, j.jsx)("span", {
                        className: "who",
                        children:
                          (a.name !== "Conductor" ? a.name + " \u00b7 " : "") +
                          (p ? "Conductor \u00b7 " + a.plate : a.barrio),
                      }),
                    ],
                  }),
                ],
              }),
              (0, j.jsxs)("div", {
                className: "top-r",
                children: [
                  !t
                    ? (0, j.jsxs)("span", {
                        className: "chip chip-bad",
                        children: [
                          (0, j.jsx)(L, { n: "wifioff", size: 13 }),
                          (0, j.jsx)("span", { className: "hide-s", children: "Sin internet" }),
                        ],
                      })
                    : !l.ok && l.checked
                      ? (0, j.jsx)("span", {
                          className: "chip chip-warn",
                          title: "Sin servidor: los datos quedan en este dispositivo",
                          children: "Modo local",
                        })
                      : f > 0
                        ? (0, j.jsxs)("span", { className: "chip", children: [f, " en cola"] })
                        : (0, j.jsx)("span", {
                            className: "dot",
                            title: "En l\u00ednea \u00b7 servidor conectado",
                            "aria-label": "En l\u00ednea",
                          }),
                  (0, j.jsx)("button", {
                    className: "icon-btn",
                    onClick: () => c(!0),
                    title: "Ajustes",
                    "aria-label": "Ajustes",
                    children: (0, j.jsx)(L, { n: "gear", size: 20 }),
                  }),
                  (0, j.jsx)("button", {
                    className: "icon-btn",
                    onClick: s,
                    title: "Salir",
                    "aria-label": "Salir",
                    children: (0, j.jsx)(L, { n: "out", size: 20 }),
                  }),
                ],
              }),
            ],
          }),
        }),
        !t &&
          (0, j.jsx)("div", {
            className: "wrap",
            style: { paddingTop: 12 },
            children: (0, j.jsxs)("div", {
              className: "banner warn",
              children: [
                (0, j.jsx)(L, { n: "wifioff" }),
                (0, j.jsxs)("span", {
                  children: [
                    "Sin internet. ",
                    p
                      ? "Tus reportes se env\xEDan al volver la se\xF1al."
                      : "Ver\xE1s la \xFAltima posici\xF3n del cami\xF3n.",
                  ],
                }),
              ],
            }),
          }),
        (0, j.jsx)("main", {
          className: "wrap",
          children: p
            ? (0, j.jsx)(xg, { session: a, shared: n, online: t, toast: T, onSos: () => g(!0) })
            : (0, j.jsx)(mg, {
                session: a,
                setSession: e,
                shared: n,
                online: t,
                serverAI: l.ok && l.gemini,
                toast: T,
              }),
        }),
        (0, j.jsx)("footer", {
          className: "foot",
          children: (0, j.jsxs)("div", {
            className: "strip-in",
            children: [
              (0, j.jsx)("span", { children: "\xA9 2026 EcoRuta \xB7 L\xEDbano, Tolima" }),
              (0, j.jsxs)("span", {
                children: [
                  (0, j.jsx)("button", {
                    className: "link",
                    onClick: () => m(!0),
                    children: "T\xE9rminos y privacidad",
                  }),
                  " \xB7 ",
                  (0, j.jsx)("button", {
                    className: "link",
                    onClick: () => c(!0),
                    children: "Ajustes",
                  }),
                ],
              }),
            ],
          }),
        }),
        (0, j.jsx)(zg, { open: d, onClose: () => g(!1), session: a, toast: T }),
        (0, j.jsx)(Eg, { open: o, onClose: () => c(!1), toast: T, online: t, onWipe: r }),
        (0, j.jsx)(qo, { open: b, onClose: () => m(!1) }),
      ],
    });
  }
  var Tg = K(fa(), 1);
  window.addEventListener("beforeinstallprompt", (a) => {
    (a.preventDefault(), (window.__pwa = a));
  });
  ecoApplyPerf(ecoPerf(), 1);
  ecoApplyTheme(ecoTheme(), 1);
  try {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => ecoTheme() === "auto" && ecoApplyTheme("auto", 1));
  } catch {}
  (0, Ng.createRoot)(document.getElementById("root")).render((0, Tg.jsx)(Hr, {}));
  "serviceWorker" in navigator &&
    location.protocol.startsWith("http") &&
    window.addEventListener("load", () =>
      navigator.serviceWorker.register("./sw.js").catch(() => {}),
    );
})();
/*! Bundled license information:

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
