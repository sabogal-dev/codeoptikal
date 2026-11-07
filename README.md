# CodeOptikal

Aplicación con dos módulos de negocio: **registro de gastos (viáticos)** y **registro de visitas a clientes**. Los clientes viven en **Odoo**; todo lo demás (usuarios, gastos, visitas, estados, categorías) lo maneja esta app.

Este README es una guía rápida de consulta: dónde va cada cosa y cómo se comunican las partes.

---

## 1. Objetivos de la arquitectura

1. Mover un archivo no debe romper otras pantallas.
2. La lógica no vive en la pantalla (componente), solo la visualización.
3. Agregar una funcionalidad debe ser crear una carpeta nueva, no editar diez existentes.
4. Cambiar un dato no debe romper a medio sistema.

---

## 2. Estructura del monorepo

Un solo repositorio, varios paquetes. Cada `package.json` lista solo las librerías de su paquete.

```
codeoptikal/
├── package.json        # raíz: solo "private" y "workspaces", sin librerías
├── .gitignore
├── README.md
└── apps/
    ├── web/            # Frontend: Vite + React (JavaScript)
    └── api/            # Backend: Express (JavaScript)
```

- `web` y `api` **nunca se importan entre sí**. Se comunican solo por HTTP.
- Todo `npm install` se hace **desde la raíz**.
- Instalar una librería en una app: `npm install <libreria> -w api` o `-w web`.
- Correr una app: `npm run dev -w api` / `npm run dev -w web`.

---

## 3. Mapa del backend (`apps/api/src`)

```
src/
├── main.js               # arranca el servidor
├── app.js                # crea Express y monta las rutas de cada módulo
│
├── modules/              # lo que ES NUESTRO (datos y reglas propias)
│   ├── usuarios/         # usuarios de la app, login, roles
│   ├── gastos/           # gastos, categorías, montos
│   └── visitas/          # visitas, estados
│
├── integrations/         # servicios EXTERNOS (no guardan datos nuestros)
│   ├── odoo/             # leer clientes
│   └── whatsapp/         # enviar mensajes
│
└── shared/               # utilidades técnicas sin negocio (errores, logger, config, conexión BD)
```

¿Dónde va algo nuevo?

| Pregunta | Va en |
|---|---|
| ¿Tiene datos y reglas propias? | `modules/` |
| ¿Es un servicio externo? | `integrations/` |
| ¿Es una utilidad técnica sin negocio? | `shared/` |

### Quién puede depender de quién

```
visitas ──→ usuarios, integrations/odoo, integrations/whatsapp
gastos  ──→ usuarios, integrations/whatsapp
```

- `gastos` y `visitas` **no se conocen entre sí**.
- `usuarios` e `integrations` no dependen de ningún módulo (son la base). Nunca flechas de vuelta.

---

## 4. Por dentro de un módulo del backend

```
modules/visitas/
├── visitas.routes.js       # define las URLs
├── visitas.controller.js   # recibe HTTP y responde
├── visitas.service.js      # reglas de negocio
├── visitas.repository.js   # único que habla con la BD
├── visitas.schema.js       # validación de lo que entra
└── index.js                # PUERTA: lo único que otros pueden importar
```

Flujo de una petición:

```
Request → routes → controller → service → repository → BD
                                   │
                                   └→ integrations (Odoo, WhatsApp)
```

| Archivo | Responsabilidad | NO debe |
|---|---|---|
| routes | Asociar URL con controller | Tener lógica |
| controller | Leer request, llamar al service, responder | Tener reglas de negocio ni SQL |
| service | Reglas de negocio, coordinar repository e integrations | Saber de Express (`req`, `res`) |
| repository | Consultas a la BD | Tener reglas de negocio |
| schema | Validar datos de entrada | — |

---

## 5. Cómo tratar Odoo y WhatsApp

- **No existe tabla de clientes.** Se guarda solo el `cliente_id` de Odoo.
- Solo `integrations/odoo` sabe cómo es Odoo (campos, autenticación). Traduce todo a nuestra forma simple: `{ id, nombre }`.
- Solo `integrations/whatsapp` sabe armar el HTTP del proveedor. Los módulos solo llaman `enviarMensaje(telefono, texto)`.
- El navegador **nunca** habla con Odoo ni WhatsApp. Pide a nuestra api y la api consulta afuera (así las credenciales no salen del servidor).

---

## 6. Mapa del frontend (`apps/web/src`)

```
src/
├── main.jsx
├── app/                  # router, providers, layout general
├── shared/               # UI genérica (botones), cliente HTTP, hooks comunes
└── features/
    ├── login/
    ├── gastos/
    └── visitas/
```

Por dentro de una feature:

```
features/visitas/
├── api/          # llamadas HTTP a nuestra api
├── hooks/        # lógica (cargar, filtrar, manejar errores)
├── components/   # SOLO visualización
└── index.js      # PUERTA
```

### Dónde está la lógica y dónde solo se visualiza

```
Componente  →  Hook  →  API
(pintar)      (lógica)  (hablar con el servidor)
```

| Capa | Es... |
|---|---|
| `components/` | **Solo visualización** y clics |
| `hooks/` | **Lógica** del frontend |
| `api/` | Peticiones HTTP, nada más |

La lógica de negocio real (reglas, validaciones definitivas) vive en el **backend (service)**, no en el frontend.

---

## 7. Reglas de oro

1. **Cada módulo/feature se importa solo por su `index.js`.** Nunca por rutas internas.
   ```js
   import { useVisitas } from "../visitas";                 // bien
   import { useVisitas } from "../visitas/hooks/useVisitas"; // mal
   ```
2. **Un dato, un dueño.** Los usuarios los maneja solo `usuarios`. Nadie los duplica.
3. **Solo el `repository` toca la BD.** Solo `integrations/odoo` conoce a Odoo.
4. **La API responde con forma fija.** Si cambia una columna de la BD, se arregla en el repository y la respuesta sigue igual.
5. **Un pedido nuevo = una carpeta nueva**, no editar diez existentes.
6. **Empezar chico:** no crear capas ni carpetas vacías por adelantado.

---

## 8. Orden de construcción sugerido

1. `/health` en la api y conexión desde el frontend.
2. Módulo `usuarios` (los demás dependen de él).
3. Módulo `visitas` + `integrations/odoo`.
4. Módulo `gastos`.
5. `integrations/whatsapp`.

---

## 9. Guía rápida de commits

Formato: `tipo: descripción corta en minúscula`

| Tipo | Cuándo |
|---|---|
| `feat` | Una funcionalidad nueva (ej. `feat: login de usuarios`) |
| `fix` | Corregir un error |
| `chore` | Configuración, estructura, tareas que no son funcionalidad |
| `docs` | Solo documentación |
| `refactor` | Reorganizar código sin cambiar lo que hace |

Ejemplo del primer commit:

```
chore: estructura inicial del monorepo (web + api)
```

Antes de commitear, revisar con `git status` que `node_modules` y `.env` no aparezcan (deben estar en `.gitignore`).
