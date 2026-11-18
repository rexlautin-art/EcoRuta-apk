# Contrato de mensajes EcoRuta (igual para la emisora y la receptora)

Este archivo es la única cosa que las dos apps comparten. Si cada app solo depende de él,
cualquier tipo de contenido nuevo se agrega con un módulo nuevo sin tocar el resto.

## Las tres capas (no se mezclan)

| Capa | Qué es | Dónde vive |
|---|---|---|
| **Contenido** | Lo que se comparte (aviso, ruta, texto, imagen, archivo, página). Cambia según el proyecto. | Emisora: `src/services/bridge.ts` → `Senders`. Receptora: `puente/renderers.js` |
| **Transporte** | Cómo viaja: HTTP + este contrato. No cambia nunca. | Emisora: `bridge.ts` → `Api`. Receptora: `puente/api.js`. Puente: `servidor/server.cjs` |
| **Presentación** | Cómo se ve y se guarda en cada app. Un módulo pequeño por tipo. | Receptora: `puente/renderers.js`, `puente/storage.js`, `puente/receptora.js` |

```
 EMISORA (PC)  ──POST──▶  PUENTE (server.cjs, puerto 3000)  ◀──GET──  RECEPTORA (celular)
 panel "Enviar"           guarda bytes + metadatos                      panel "Mensajes de la central"
```

## Metadatos de cada item

| Campo | Ejemplo | Para qué sirve |
|---|---|---|
| `id` | `"12"` | Número creciente (texto). La receptora pide solo los mayores al último que vio. Nunca se reutiliza. |
| `type` | `"aviso"` | Decide qué renderizador usa la receptora. Formato `[a-z][a-z0-9_-]{0,30}`; si no cumple, el puente lo guarda como `file`. |
| `mime` | `"application/json"` | Tipo real del contenido. |
| `name` | `"aviso.json"` | Nombre sugerido al guardar. |
| `size` | `24` | Bytes. |
| `stamp` | `1794861758937` | Hora de llegada al puente (ms, informativo). |

## API del puente

| Método y ruta | Qué hace | PIN |
|---|---|---|
| `GET /api/ping` | `{ok, version, boot}`. `boot` cambia en cada arranque del servidor: la receptora lo usa para detectar reinicios. | no |
| `POST /api/items` | Cuerpo = contenido crudo. Cabeceras: `Content-Type`, `X-Type`, `X-Name` (con `encodeURIComponent`), `x-pin`. Devuelve los metadatos. | **sí** |
| `GET /api/items?since=N` | Metadatos de los items con `id > N`. | no |
| `GET /api/items/:id` | Contenido crudo con su `Content-Type` (siempre con `Content-Security-Policy: sandbox`). | no |
| `DELETE /api/items/:id` | Borra un item. | **sí** |

### Vinculación de celulares (desde la 2.4.0)

Con el enlace por internet activo (`--tunnel`, `tunnel` o `publicUrl` en `config.json`) el puente **exige estar vinculado para leer**
(`requireLink`). El PC crea un **código** (`ECO-XXXX-XXXX`); cada celular lo canjea una vez y recibe un **token** propio que manda en
la cabecera `x-token`. Desactivar el código revoca a todos los celulares que entraron con él.

| Método y ruta | Qué hace | Quién |
|---|---|---|
| `POST /api/pair` `{code, device}` | Canjea el código → `{token, label}`. Mismo `device` = mismo cupo (se puede revincular). 10 fallos/5 min por IP → 429. | público |
| `GET /api/pair/check` | 200 si el token sigue vigente, 401 si se desactivó. | token |
| `GET /api/links` | Estado del túnel, direcciones y lista de códigos con nº de celulares. | PC local o PIN |
| `POST /api/links` `{label, maxUses}` | Crea un código. | PC local o PIN |
| `DELETE /api/links/:code` | Desactiva el código y revoca sus celulares. | PC local o PIN |

`GET /api/ping` incluye `requireLink`. `GET /api/items` y `GET /api/items/:id` piden token si `requireLink` es true (el PC local y
el panel con PIN pasan sin token). Lo que llega por el túnel se reconoce por las cabeceras `cf-connecting-ip`/`cf-ray`: **sin PIN,
desde internet no se puede publicar, borrar ni administrar códigos**; solo desde el propio PC.

Límites: 20 MB por item, 200 items (los más viejos se borran solos), 60 envíos por minuto por IP.
Con PIN configurado (`servidor/config.json`), solo quien lo tenga puede enviar o borrar; leer es libre en la red.

## Tipos incluidos

| `type` | Contenido | Se muestra como |
|---|---|---|
| `aviso` | JSON `{title, body, priority: "normal"\|"alta"}` | Tarjeta con título (y etiqueta "Importante") |
| `ruta` | JSON `{name, days[], time, neighborhoods[], notes}` | Tarjeta con días, horario y barrios |
| `text` | Texto plano | Texto |
| `json` | JSON cualquiera | JSON con formato |
| `image` | Imagen | Imagen |
| `html` | Página HTML | `iframe` con `sandbox` (sin scripts) |
| `file` | Cualquier otro archivo | Botón "Descargar". También es lo que se usa para un tipo desconocido |

## Agregar un tipo nuevo (el puente no se toca)

1. Emisora, `bridge.ts`: `Senders.miTipo = (cfg, datos) => Api.send(cfg, new Blob([...]), 'mitipo', 'nombre.ext')`.
2. Receptora, `puente/renderers.js`: `Renderers.mitipo = function (blob, meta, host) { ... }` (usa `textContent`, nunca `innerHTML` con datos ajenos).
3. Si el tipo debe poder elegirse en el panel, agregar su formulario en `SendView.tsx`.

## Ciclo de vida en el celular (desde la versión 2.3.0)

- **Descarga diaria:** la receptora pide la lista al puente una vez cada 24 h (al abrir la app o cuando toque) y **descarga** los mensajes nuevos. Ya no consulta cada 3 s.
- **Se guarda en el celular** (IndexedDB): los mensajes se ven sin red y al reabrir la app.
- **Se borra a las 24 h de recibido** (cada mensaje cuenta desde que *ese celular* lo recibió). Lo borrado no se vuelve a bajar, aunque siga en el puente.
- **Lienzo en blanco:** sin mensajes, la app no muestra nada de la central. No hay datos precargados.
- **"Actualizar ahora"** en el panel de mensajes pide antes de las 24 h (solo cuando la persona lo toca).
- Lo que la central borra en el puente **no** se quita de los celulares que ya lo descargaron: se va solo a las 24 h.
