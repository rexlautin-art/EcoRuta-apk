# EcoRuta 2.4.0 — enlace por internet, códigos de vinculación y tutorial

El celular ya no depende de estar en la misma Wi-Fi: el puente abre un túnel de Cloudflare y da una dirección https que funciona
desde cualquier red. Solo reciben mensajes los celulares **vinculados** con un código que el PC crea y puede desactivar.

- `servidor/server.cjs`: `--tunnel` (o `tunnel` en config.json) lanza `cloudflared`, lee la dirección y la expone en `/api/links`.
  Descarga cloudflared solo en Windows/Linux. Nuevas rutas `/api/pair`, `/api/pair/check`, `/api/links`. `GET /api/items*` pide
  token si hay enlace por internet. Vínculos guardados en `servidor/datos/vinculos.json` (solo el hash del token) y sobreviven reinicios.
- **Seguridad:** el tráfico del túnel entra por 127.0.0.1, así que se distingue por `cf-connecting-ip`/`cf-ray`. Sin PIN, desde
  internet no se publica ni se administra; con PIN, todo exige PIN. Rate limit y bloqueo de fuerza bruta por IP real.
  El código tiene 32^8 combinaciones, 10 fallos/5 min por IP bloquean, y se desactiva desde el panel.
- Celular: `puente/vincular.js` (tutorial de 3 pasos la primera vez en la APK, pegar mensaje → enlace y código se llenan solos),
  `puente/api.js` manda `x-token`, `receptora.js` avisa si el vínculo se desactiva y tiene botón "Conexión". `sw.js` cache `v9-vinculo`.
- Panel del PC 1.3.0: sección **Conectar celulares** en la pestaña Enviar (estado del enlace, crear/desactivar códigos, copiar mensaje).
- `iniciar_ecoruta_internet.bat/.sh` (los `iniciar_ecoruta` de antes no cambian: siguen solo en Wi-Fi local).
- `versionCode 6`, `versionName 2.4.0` (hay que recompilar la APK y el instalador del panel).

**Probado:** `prueba_vinculo.cjs` 34/34 (con un cloudflared falso), `prueba_celular.cjs` 11/11 (lógica real de api.js/vincular.js contra
el servidor), y siguen pasando `prueba_servidor.cjs` 15/15 y `prueba_puente.cjs` 21/21.
**No probado (requiere tu equipo):** el túnel real de Cloudflare, la descarga de cloudflared, la compilación de la APK y del panel
(tsc sin errores de sintaxis, pero sin `node_modules` no se pudo hacer el build), y el aspecto del tutorial en un teléfono real.

**Límites:** el PC debe estar encendido y con la ventana abierta. Con el enlace "rápido" la dirección cambia al reiniciar (el código
sigue valiendo; se reenvía el mensaje). Para dirección fija hace falta dominio y túnel con nombre. Los avisos siguen descargándose
una vez cada 24 h; el túnel solo cambia por dónde llegan, no cuándo.

# EcoRuta 2.3.0 — descarga diaria, borrado a las 24 h y lienzo en blanco

- `puente/receptora.js` reescrita: descarga una vez cada 24 h, guarda en IndexedDB (se ve sin red), borra cada mensaje 24 h
  después de recibido y no vuelve a bajar lo borrado. Botón "Actualizar ahora". El sobre quedó abajo a la derecha y solo se ve dentro de la app.
- Calendario: se quitaron los horarios de ejemplo (arreglo `dl` en `fuentes/app.legible.js` y su copia minificada en `app.js`).
  Los originales están en `fuentes/horarios_ejemplo_original.txt`. Sin horarios, la pantalla lo dice y no se rompe.
- `sw.js`: caché `ecoruta-shell-v8-diario`. `versionCode 5`, `versionName 2.3.0` (hay que recompilar la APK).
- Se mantienen: guía de residuos, lista de barrios, GPS real, "Demo" del conductor (opcional) y el servidor.

# EcoRuta 2.2.0 — puente emisora → receptora

Se agregó la arquitectura de la guía "App de computador + App APK": el PC **envía** contenido y el celular
lo **recibe**, sin que el panel sea quien "maneja" los datos. Detalle del contrato en `contrato/protocolo.md`
y pasos de uso en `contrato/LEEME-PUENTE.txt`.

- `servidor/server.cjs`: nuevas rutas del puente `/api/ping` y `/api/items` (con PIN para enviar/borrar, límites,
  contenido servido con `sandbox`). Las rutas anteriores (`/api/truck`, `/api/reports`, …) no cambian.
- `app/src/main/assets/web/puente/`: capa receptora (`api.js`, `renderers.js`, `storage.js`, `receptora.js`) y botón/panel
  "Mensajes de la central". Solo aparece cuando llega el primer mensaje.
- `servidor/prueba_puente.cjs`: 21 comprobaciones del puente. La prueba anterior (`prueba_servidor.cjs`) sigue pasando 15/15.
- No se tocó Java ni el bundle `app.js`. `versionCode 4`, `versionName 2.2.0` (hay que recompilar la APK).

# EcoRuta 2.1.0 — versión unificada

Fusiona las tres líneas de trabajo anteriores, que eran **paralelas** (ninguna contenía los parches de las otras):

| Línea | Aportó | Estado en esta versión |
|---|---|---|
| `final-SIN-escritorio` | Rediseño (Poppins, `#2d6a4f`, tarjetas planas, barra inferior), modo oscuro, rendimiento, cámara con interpolación | **Base visual** |
| `corregido` | Corrección del salto de ±2 km, respaldo ante caídas de red, `needGeometry`, TTL de 30 min, wake lock | Portado |
| `limpio-v2` | Servicio Android en primer plano, teselas incluidas/proxy, límites del mapa, avisos de PIN | Portado |

## Qué se corrigió al unificar

**Bugs que `final` había perdido (y que `limpio-v2` tampoco tenía)**
- Salto de ±2 km del progreso en rutas con ida y vuelta por la misma calle (`ecoWin`).
- "No hay camión en ruta" al primer fallo de red (ahora se conserva el último camión, hasta 30 min).
- "Ya pasó" mostrado cuando en realidad el camión llevaba minutos sin señal.
- `confirm()`/`alert()` ignorados en Android (Finalizar turno, Borrar datos, Salir con ruta activa).
- Pantalla que se apagaba durante la ruta.
- **"Camión" en la vista ciudadana no seguía al camión** (el efecto estaba vacío y el mapa no recibía `follow`).

**Choque entre versiones:** `final` y `limpio-v2` definían un puente `EcoNative` distinto cada uno. Ahora hay uno solo (`NativeBridge`) con: `watch/once/clear/truck/stopTracking` (GPS y servicio), `setDark` (barras y fondo) y `keepAwake` (pantalla encendida).

## Seguridad del PIN (auditoría)

Hallazgos en el servidor y su corrección:
1. **El límite de intentos no frenaba la fuerza bruta**: se consultaba solo *después* de fallar, así que un atacante bloqueado podía seguir probando y un acierto pasaba igual. Ahora el bloqueo se comprueba *antes* (10 fallos / 5 min por IP → 429, incluso con el PIN correcto).
2. **Se guardaban y servían campos arbitrarios** enviados por el cliente. Ahora hay lista blanca de campos, con validación de paradas y de la geometría.
3. **Sin tope de camiones**: cualquiera con PIN (o sin PIN configurado) podía llenar la memoria. Tope de 40 y límite de 120 publicaciones/min por IP.
4. **Envíos retrasados por la red hacían retroceder al camión.** Se descartan si son más viejos que el guardado.
5. **El login no comprobaba el PIN**: un PIN errado solo se descubría al publicar. Nuevo `POST /api/pin-check`; la app lo valida al entrar (si no hay conexión, deja continuar).
6. Si el servicio nativo recibe 401 en segundo plano, la **notificación** avisa "PIN incorrecto".
7. Opción `trustProxy` (apagada por defecto) para detrás de un proxy inverso; sin ella no se confía en `X-Forwarded-For`.

**Límites que siguen existiendo (por diseño, no son bugs):**
- Es **un solo PIN compartido**: quien lo tenga puede publicar cualquier camión. Cámbialo si un conductor se va.
- El PIN viaja en un encabezado **sin cifrar si usas `http://`** (Wi-Fi local). En Internet usa HTTPS (proxy inverso con `trustProxy: true`).
- **Sin PIN configurado, cualquiera en la red puede publicar un camión.** Configúralo en `config.json` (`"pin"`) para producción.

## Mapa y geolocalización
- Zoom limitado a **13–17** (antes 11–18), igual que las teselas incluidas en la app, para no mostrar cuadros en blanco sin internet. El zoom mínimo y el área se calculan según la pantalla y se limitan a Líbano; la cámara que sigue al camión también respeta el área.
- Teselas pedidas al servidor (`/tiles`, con caché y User-Agent de contacto); si no existe, se usa OpenStreetMap directo.
- **Orientación del marcador:** el rumbo se publicaba pero nadie lo usaba. Ahora el icono se voltea según el sentido de marcha (umbral de 8 m para que el ruido del GPS parado no lo haga parpadear).
- Publicación estable: no se solapan envíos si la red va lenta, se reenvía la ruta tras reiniciar el servidor (`needGeometry`), y el servicio nativo toma el relevo si la web deja de publicar.
- El botón "Descargar mapa" usa la Cache API, que puede no estar disponible en el WebView; ahora explica que en la app Android el mapa viene incluido (`descargar_mapa`).

## Diseño / modo oscuro
Corregido el contraste de `.toast-warn`, `.toast-bad`, el número de la parada actual y la atribución del mapa (usaban texto blanco o fondo claro fijo sobre colores que en oscuro son claros). Tema `values-night` para evitar el destello blanco al abrir.

## Cómo está organizado
- `app/src/main/assets/web/app.js` — **bundle minificado** (como el original). La versión legible está en `fuentes/app.legible.js`; `fuentes/patch_app.py` documenta cada parche aplicado.
- `servidor/server.cjs` — backend. `servidor/prueba_servidor.cjs` — 15 comprobaciones (`node servidor/prueba_servidor.cjs`).
- Versión de la app: `versionCode 3`, `versionName 2.1.0`.

## Qué se probó y qué no
**Probado** (servidor real + Chromium headless, 390×800):
- Servidor: 15/15 comprobaciones (PIN, fuerza bruta, lista blanca, tope, orden de envíos, `needGeometry`, rutas estáticas).
- Ciudadano: arranque sin errores JS en claro y oscuro; "Camión" mantiene el marcador centrado (0 px) en 4 avances; el icono se voltea al ir al oeste; 16 s sin red no muestra "sin camión"; reinicio del servidor con recuperación de la ruta.
- Conductor: el login rechaza un PIN incorrecto y acepta el correcto.
- Progreso en ruta de ida y vuelta con ruido GPS de ±5 a ±25 m: error máximo **4,4 km → ~130 m**, con 0 saltos.

**No probado (requiere dispositivo/Android Studio):**
- El Java **no se compiló** (solo se validó su sintaxis). Revisa especialmente `MainActivity` (diálogos, botón atrás con `OnBackInvokedCallback` en Android 13+, y `enableOnBackInvokedCallback="true"` en el manifest).
- El servicio en primer plano, el relevo nativo y la pantalla encendida en un teléfono real.
- No se pudo probar el flujo completo de conducción con GPS real en el navegador; la lógica de progreso se validó por separado con la prueba numérica.
- Las teselas reales (el entorno de pruebas no tenía acceso a OpenStreetMap).

## Limitación conocida
Si una casa está sobre una calle que la ruta recorre **dos veces** (ida y vuelta), el estado se calcula con el primer paso: tras ese paso aparece "ya pasó" aunque el camión vuelva a pasar. Se mantuvo como estaba; se puede refinar usando el siguiente paso pendiente.
