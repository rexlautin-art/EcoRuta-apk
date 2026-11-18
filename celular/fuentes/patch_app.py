#!/usr/bin/env python3
"""Fusiona los parches de EcoRuta sobre el bundle formateado de la version 'final' (rediseno).

Cada reemplazo exige que el texto original aparezca EXACTAMENTE una vez: si una version
futura del bundle cambia, el script falla en vez de aplicar un parche a ciegas.
"""
import sys

SRC, DST = sys.argv[1], sys.argv[2]
code = open(SRC, encoding="utf-8").read()
applied = []


def rep(name, old, new):
    global code
    n = code.count(old)
    if n != 1:
        sys.exit(f"[FALLO] {name}: el texto original aparece {n} veces (se esperaba 1)")
    code = code.replace(old, new)
    applied.append(name)


# ---------------------------------------------------------------------------
# 1. RED: estado del servidor, publicacion del camion, PIN y reportes
# ---------------------------------------------------------------------------
rep("status: bandera de teselas por servidor", r'''          .then((l) => e({ ok: !0, pinRequired: !!l.pinRequired, gemini: !!l.gemini, checked: !0 }))
''', r'''          .then(
            (l) => (
              (window.__ecoTiles = !!l.tiles),
              e({ ok: !0, pinRequired: !!l.pinRequired, gemini: !!l.gemini, checked: !0 })
            ),
          )
''')

rep("G0: publicar camion (PIN, needGeometry, sin solapes, puente nativo)", r'''  async function G0(a, e, t) {
    let l = me(Ln, {});
    ((l[a.id] = a), Ze(Ln, l));
    let n = t ? a : { ...a, geometry: void 0 };
    try {
      return (await st("/api/truck", { method: "POST", body: n, pin: e, timeout: 5e3 }), !0);
    } catch {
      return !1;
    }
  }
''', r'''  var ecoPostAt = 0;
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
''')

rep("cola de reportes: avisos de PIN", r'''        (await st("/api/reports", { method: "POST", body: l.report, pin: l.pin, timeout: 5e3 }),
          t++);
      } catch (n) {
        let i = n.status;
        if (i === 400 || i === 413) continue;
''', r'''        (await st("/api/reports", { method: "POST", body: l.report, pin: l.pin, timeout: 5e3 }),
          l.pin && window.__ecoPinOk && window.__ecoPinOk("report"),
          t++);
      } catch (n) {
        let i = n.status;
        i === 401 && window.__ecoPinBad && window.__ecoPinBad("report");
        if (i === 400 || i === 413) continue;
''')

rep("resolver reporte: aviso de PIN", r'''        pin: e,
        timeout: 5e3,
      });
    } catch {}
  }
''', r'''        pin: e,
        timeout: 5e3,
      });
    } catch (i) {
      i && i.status === 401 && window.__ecoPinBad && window.__ecoPinBad("report");
    }
  }
''')

# ---------------------------------------------------------------------------
# 2. SONDEO DEL CIUDADANO: conservar el ultimo camion ante un fallo de red
# ---------------------------------------------------------------------------
rep("Q0: referencia del ultimo camion", r'''    let [e, t] = (0, Je.useState)({ trucks: [], reports: [], serverOk: !1, lastSync: 0 }),
      l = (0, Je.useRef)({});
''', r'''    let [e, t] = (0, Je.useState)({ trucks: [], reports: [], serverOk: !1, lastSync: 0 }),
      l = (0, Je.useRef)({}),
      ecoLast = (0, Je.useRef)(null);
''')

rep("Q0: respaldo del ultimo camion", r'''              m = [],
              f = !1;
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
                (m = (await st("/api/reports", { timeout: 4500 })).reports),
                (f = !0));
            } catch {}
''', r'''              m = [],
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
''')

rep("Rr: detener seguimiento nativo al cerrar sesion", r'''  async function Rr(a) {
    let e = me(Ln, {});
''', r'''  async function Rr(a) {
    window.__ecoStop && window.__ecoStop();
    let e = me(Ln, {});
''')

# ---------------------------------------------------------------------------
# 3. PROGRESO SOBRE LA RUTA: ventana local (corrige el salto de +-2 km)
# ---------------------------------------------------------------------------
rep("ecoWin: ventana de busqueda cerca del progreso previo", r'''  var Wa = K(Pa(), 1);
  var Ce = (a) => (a * Math.PI) / 180;
''', r'''  var Wa = K(Pa(), 1);
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
''')

rep("ecoWin: linea de ruta del ciudadano", r'''          let Ea = Lt(D.geo, D.cum, s);''',
    r'''          let Ea = ecoWin({ geometry: D.geo, cum: D.cum }, s, s.progressM);''')

rep("ecoWin: GPS del conductor", r'''        let dt = Lt(H.geometry, H.cum, G);''',
    r'''        let dt = ecoWin(H, G, k.current.along, w ? ge(w, G) : void 0);''')

rep("ecoWin: ruta restante del conductor", r'''        let h = Lt(i.route.geometry, i.route.cum, i.pos || i.route.geometry[0]);''',
    r'''        let h = i.pos
          ? ecoWin(i.route, i.pos, i.along)
          : Lt(i.route.geometry, i.route.cum, i.route.geometry[0]);''')

rep("ug: sin senal tiene prioridad sobre 'ya paso'",
    r'''    if (c < -40) return { state: "paso", ageSec: t, distM: ge(l, e), offM: o.off };''',
    r'''    if (c < -40)
      return { state: u ? "sin_senal" : "paso", ageSec: t, distM: ge(l, e), offM: o.off };''')

# ---------------------------------------------------------------------------
# 4. MAPA: teselas por servidor, limites de Libano, zoom coherente con el mapa sin internet
# ---------------------------------------------------------------------------
rep("teselas: URL por servidor con respaldo a OSM", r'''    return `https://tile.openstreetmap.org/${a}/${e}/${t}.png`;''',
    r'''    return window.__ecoTiles !== !1 && (Gi() || location.protocol.startsWith("http"))
      ? `${Gi()}/tiles/${a}/${e}/${t}.png`
      : `https://tile.openstreetmap.org/${a}/${e}/${t}.png`;''')

rep("mapa: limites y zoom (13 a 17, igual que las teselas incluidas en la app)", r'''    tg = 11,
    lg = 18,
''', r'''    tg = 13,
    lg = 17,
    MB = { s: 4.893, n: 4.95, w: -75.093, e: -75.035 },
''')

rep("mapa: zoom minimo, limitador de area y reencuadre al cambiar tamano", r'''        let s = (C) => Math.max(tg, Math.min(lg, C));
        let eco_go = (C, q, dur = 450) => {
          cancelAnimationFrame(eco_an.current);
          let a0 = S.current,
            z0 = a0.z,
            z1 = s(q ?? z0),
            c0 = a0.c;
''', r'''        let __mz = () => {
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
''')

rep("mapa: arrastre limitado al area", r'''                    (x({ c: Vi(Na.x - dx, Na.y - dy, Ca.z), z: Ca.z }), i?.());''',
    r'''                    (x(__cl(Vi(Na.x - dx, Na.y - dy, Ca.z), Ca.z)), i?.());''')

rep("mapa: la camara que sigue al camion respeta el area", r'''        } else eco_fb.current.on = 0;
        ((S.current = { c: fc, z: f.z }),''', r'''        } else eco_fb.current.on = 0;
        fc = __cl(fc, f.z).c;
        ((S.current = { c: fc, z: f.z }),''')

rep("mapa: botones de zoom se apagan en los limites", r'''                  onClick: () => y(S.current.z + 1, U / 2, h / 2, 1),
                  "aria-label": "Acercar",''', r'''                  onClick: () => y(S.current.z + 1, U / 2, h / 2, 1),
                  disabled: f.z >= lg - 0.01,
                  "aria-label": "Acercar",''')
rep("mapa: boton alejar", r'''                  onClick: () => y(S.current.z - 1, U / 2, h / 2, 1),
                  "aria-label": "Alejar",''', r'''                  onClick: () => y(S.current.z - 1, U / 2, h / 2, 1),
                  disabled: f.z <= __mz() + 0.01,
                  "aria-label": "Alejar",''')

rep("mapa: marcador del camion registra el sentido de marcha", r'''        t.forEach((C) => {
          if (C.glide && !eco_rmv) {''', r'''        t.forEach((C) => {
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
          if (C.glide && !eco_rmv) {''')

rep("mapa: referencia del sentido de marcha", r'''          eco_dl = (0, Ya.useRef)(40),
''', r'''          eco_dl = (0, Ya.useRef)(40),
          eco_dr = (0, Ya.useRef)({}),
''')

rep("mapa: el icono del camion mira hacia donde avanza",
    r'''                        C.kind === "truck" && (0, za.jsx)(L, { n: "truck", size: 22 }),''',
    r'''                        C.kind === "truck" &&
                          (0, za.jsx)("span", {
                            className:
                              "mk-ico" + ((eco_dr.current[C.id] || {}).dir < 0 ? " flip" : ""),
                            children: (0, za.jsx)(L, { n: "truck", size: 22 }),
                          }),''')

# ---------------------------------------------------------------------------
# 5. VISTA CIUDADANA: "Camion" ahora SIGUE al camion
# ---------------------------------------------------------------------------
rep("ciudadano: ajuste inicial sin seguimiento; se elimina el efecto vacio", r'''          ((_.current = s.id), N.current?.fit([...(r ? [r] : []), { lat: s.lat, lng: s.lng }]));
      }, [s?.id, u]),
        (0, pa.useEffect)(() => {
          R && s && u === "mapa" && (_.current, s.id);
        }, [s?.lat, s?.lng, R, u]));''', r'''          ((_.current = s.id),
          A(!1),
          N.current?.fit([...(r ? [r] : []), { lat: s.lat, lng: s.lng }]));
      }, [s?.id, u]));''')

rep("ciudadano: el mapa recibe follow", r'''                  lines: ya,
                  onUserMove: () => A(!1),''', r'''                  lines: ya,
                  follow: R && !!s,
                  onUserMove: () => A(!1),''')

rep("ciudadano: boton Camion", r'''                      (0, E.jsxs)("button", {
                        className: "pill",
                        onClick: () => {
                          (A(!0), s && N.current?.flyTo({ lat: s.lat, lng: s.lng }, 16));
                        },''', r'''                      (0, E.jsxs)("button", {
                        className: "pill" + (R && s ? " on" : ""),
                        onClick: () => {
                          s && (A(!0), N.current?.zoomTo(16));
                        },''')

rep("ciudadano: Mi casa deja de seguir", r'''                        onClick: () => r && N.current?.flyTo(r, 16),''',
    r'''                        onClick: () => r && (A(!1), N.current?.flyTo(r, 16)),''')

rep("ciudadano: Ver todo deja de seguir", r'''                        onClick: () =>
                          N.current?.fit([
                            ...(r ? [r] : []),
                            ...(s ? [{ lat: s.lat, lng: s.lng }] : []),
                          ]),''', r'''                        onClick: () => {
                          (A(!1),
                            N.current?.fit([
                              ...(r ? [r] : []),
                              ...(s ? [{ lat: s.lat, lng: s.lng }] : []),
                            ]));
                        },''')

rep("ciudadano: Probar aviso muestra un mensaje", r'''                              onClick: () => {
                                ($0(), a.sound && _r());
                              },''', r'''                              onClick: () => {
                                ($0(),
                                  a.sound && _r(),
                                  i("Así te avisaremos cuando el camión esté cerca.", "ok"));
                              },''')

# ---------------------------------------------------------------------------
# 6. VISTA DEL CONDUCTOR: PIN, pantalla encendida, publicacion estable
# ---------------------------------------------------------------------------
rep("conductor: estado de PIN invalido", r'''  function Sg(a, e, t) {
    let [l, n] = ot("ecoruta.d.stops", Cr),''', r'''  function Sg(a, e, t) {
    let [ecoPin, setEcoPin] = (0, na.useState)(!1),
      [l, n] = ot("ecoruta.d.stops", Cr),''')

rep("conductor: pantalla encendida mientras hay ruta (Android + Wake Lock web)", r'''    }, [b, C, U, !!f]);
    let ae = (0, na.useCallback)((O) => {''', r'''    }, [b, C, U, !!f]);
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
    let ae = (0, na.useCallback)((O) => {''')

rep("conductor: manejo de la respuesta de publicar", r'''      (Hn.current++, (await G0(Fa, Y.pin, Ie)) && G && Ie && (ea.current = G.ver));
    }, []);''', r'''      Hn.current++;
      let ecoOk = await G0(Fa, Y.pin, Ie);
      ecoOk !== "busy" &&
        (setEcoPin(ecoOk === "pin"),
        ecoOk === "need"
          ? (ea.current = -1)
          : ecoOk && ecoOk !== "pin" && G && Ie && (ea.current = G.ver));
    }, []);''')

rep("conductor: expone pinBad", r'''      publish: Na,
      recalc: () => {''', r'''      publish: Na,
      pinBad: ecoPin,
      recalc: () => {''')

rep("conductor: chip de estado de publicacion con PIN", r'''                    (0, v.jsx)(be, {
                      tone: t ? "ok" : "bad",
                      children: t
                        ? e.serverOk
                          ? "Publicando a ciudadanos"
                          : "Solo modo local"
                        : "Sin internet: guardando",
                    }),''', r'''                    (0, v.jsx)(be, {
                      tone: t && !i.pinBad ? "ok" : "bad",
                      children: i.pinBad
                        ? "PIN incorrecto: los ciudadanos NO ven tu camión"
                        : t
                          ? e.serverOk
                            ? "Publicando a ciudadanos"
                            : "Solo modo local"
                          : "Sin internet: guardando",
                    }),''')

# ---------------------------------------------------------------------------
# 7. LOGIN: el PIN del conductor se comprueba contra el servidor al entrar
# ---------------------------------------------------------------------------
rep("login: validar PIN del conductor", r'''        Ra = () => {
          if ((N(""), n === "driver" && !g.trim()))
            return N("Escribe la placa o n\xFAmero del cami\xF3n.");
          if (n === "driver" && a && !m.trim())
            return N("Escribe el PIN de conductor que te dio la central.");
          if (!T) return N("Debes aceptar los t\xE9rminos y condiciones para continuar.");
          l("loc");
        },''', r'''        Ra = async () => {
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
        },''')

# ---------------------------------------------------------------------------
# 8. AJUSTES: probar conexion, mapa sin internet
# ---------------------------------------------------------------------------
rep("ajustes: probar conexion con mensajes claros", r'''        x = async () => {
          j0(d);
          try {
            (await st("/api/status", { timeout: 4e3 }), t("Servidor conectado.", "ok"));
          } catch {
            t("No se pudo conectar. Se usar\xE1 el modo local.", "warn");
          }
        };''', r'''        x = async () => {
          let r = window.__ecoProbe
            ? await window.__ecoProbe(d)
            : { ok: !0, addr: d, msg: "Direcci\xF3n guardada." };
          r.addr !== void 0 && (j0(r.addr), g(r.addr));
          let m = document.getElementById("eco-probe");
          (m && (m.textContent = r.msg), t(r.msg, r.ok ? "ok" : "warn"));
        };''')

rep("ajustes: boton Probar", r'''                    (0, aa.jsx)("button", {
                      className: "btn ghost",
                      onClick: x,
                      children: "Guardar",
                    }),
                  ],
                }),
              ],
            }),''', r'''                    (0, aa.jsx)("button", {
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
            }),''')

rep("mapa sin internet: area de descarga = area del mapa", r'''      let t = ve({ lat: Bi.n, lng: Bi.w }, e),
        l = ve({ lat: Bi.s, lng: Bi.e }, e);''', r'''      let t = ve({ lat: MB.n, lng: MB.w }, e),
        l = ve({ lat: MB.s, lng: MB.e }, e);''')

rep("mapa sin internet: mensaje claro si el WebView no permite guardar", r'''    let e = await caches.open(o1),
      t = Ho(),''', r'''    let e = await caches.open(o1).catch(() => {
        throw new Error(
          "Este dispositivo no permite guardar el mapa desde aqu\xED. En la app Android el mapa sin internet viene incluido: ejecuta descargar_mapa y vuelve a compilar.",
        );
      }),
      t = Ho(),''')

open(DST, "w", encoding="utf-8").write(code)
print(f"OK: {len(applied)} parches aplicados")
for a in applied:
    print("  -", a)
