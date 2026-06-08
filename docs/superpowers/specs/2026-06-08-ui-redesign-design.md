# UI Redesign — Design Spec

**Fecha:** 2026-06-08
**Proyecto:** Portafoliio_AnalisisDeDatos
**Estado:** Aprobado

---

## Contexto

El diseño actual tiene tres problemas principales:
1. La sección de proyectos ocupa demasiado scroll vertical (lista de cards horizontales muy altas)
2. El espacio horizontal no se aprovecha — el contenedor es demasiado estrecho para pantallas modernas
3. La paleta de color (amarillo + gris) no representa bien el perfil PM

---

## Sistema de color

### Light mode (principal)

| Token | Valor | Uso |
|---|---|---|
| `bg-page` | `#f8fafc` | Fondo de página |
| `bg-surface` | `#ffffff` | Cards, superficies |
| `border` | `#e2e8f0` | Bordes de cards y separadores |
| `text-primary` | `#0f172a` | Títulos y texto principal |
| `text-secondary` | `#475569` | Texto descriptivo |
| `text-muted` | `#94a3b8` | Fechas, labels secundarios |
| `accent` | `#2563eb` | Azul rey — acento principal |
| `accent-hover` | `#1d4ed8` | Acento en hover |
| `accent-subtle` | `#eff6ff` | Fondo de pills |
| `accent-border` | `#bfdbfe` | Borde de pills |

**Fondo de página** — clases Tailwind en `Layout.astro`:
```
Light: bg-[#f8fafc] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),rgba(248,250,252,0))]
Dark:  dark:bg-[#0f172a] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.15),rgba(15,23,42,0))]
```

### Dark mode (derivado)

| Token | Valor |
|---|---|
| `bg-page` | `#0f172a` |
| `bg-surface` | `#1e293b` |
| `border` | `#334155` |
| `text-primary` | `#f8fafc` |
| `text-secondary` | `#cbd5e1` |
| `text-muted` | `#64748b` |
| `accent` | `#3b82f6` (azul ligeramente más claro para mejor contraste en fondo oscuro) |
| `accent-subtle` | `#1e3a8a` |
| `accent-border` | `#1d4ed8` |

---

## Layout

### Contenedor global

Reemplaza todos los contenedores actuales (`lg:max-w-4xl md:max-w-2xl`):

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

- Desktop (1280px+): contenido de hasta ~1280px, padding 32px lateral
- Tablet: padding 24px lateral
- Mobile: padding 16px lateral

### Estructura de página

Sin cambios en el orden de secciones:
```
Header (fijo)
└── Hero
└── Experiencia
└── Proyectos
└── Sobre mí
Footer
```

---

## Componentes

### Header

- Sin cambios estructurales
- El color activo del nav link cambia de `text-yellow-400` → `text-blue-600` (`#2563eb`)
- El backdrop blur/pill se mantiene igual
- `ThemeToggle` y `LangToggle` se mantienen

### Hero

- Sin cambios estructurales (avatar, nombre, título, tagline, social pills)
- El `<strong>` del subtítulo cambia de `text-yellow-500` → `text-blue-600`
- Dark mode: `dark:[&>strong]:text-yellow-200` → `dark:[&>strong]:text-blue-400`
- Las social pills adoptan el nuevo estilo de acento azul

### Experiencia (`ExperienceItem.astro`)

**Cambios:**
- El título de cada entrada cambia de `text-yellow-400` → `text-blue-600`
- El bullet point `·` cambia de `text-yellow-400` → `text-blue-500`
- La línea vertical izquierda (`border-l-2`) se mantiene con el mismo color neutro
- **Nuevo:** logo de empresa (32×32px) en `<img>` junto al `<h4>` del nombre de empresa

**Logo de empresa:**
- Archivo: `/public/companies/telefonica.svg` y `/public/companies/ucab.svg`
- Fuente: Wikimedia Commons / Brandfetch
- Tamaño renderizado: 28px × 28px, `object-contain`
- Colocado a la izquierda del `<h4>` (nombre empresa) en fila con `flex items-center gap-2`
- `ExperienceItem.astro` recibe prop opcional `companyLogo?: string` (ruta al archivo)
- `Experience.astro` pasa la ruta correspondiente a cada entry

### Proyectos (`Projects.astro`)

**Cambio principal — layout:**

Reemplaza la lista vertical actual por un grid responsive:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Estructura de cada card:**

```
┌─────────────────────────┐
│  Imagen (h-40, cover)   │
├─────────────────────────┤
│  Título (font-bold)     │
│  Descripción (2 líneas, │
│  text-sm, line-clamp-3) │
│  Pills con icono        │
│  [Ver proyecto] [Data]  │
└─────────────────────────┘
```

- Imagen: `h-40 object-cover object-top w-full`
- Título: `text-base font-bold text-primary`
- Descripción: `text-sm text-secondary line-clamp-3`
- Pills: mantienen el `<tag.icon class="size-3" />` + nombre, pero con los nuevos colores (`bg-accent-subtle border-accent-border text-blue-700`)
- Botones: estilo actualizado — primario `bg-blue-600 text-white`, secundario `border border-gray-200 text-secondary`

### Sobre mí (`AboutMe.astro`)

- Sin cambios estructurales (texto izquierda, foto derecha)
- `[&>p>strong]:text-yellow-500` → `[&>p>strong]:text-blue-600`
- `dark:[&>p>strong]:text-yellow-100` → `dark:[&>p>strong]:text-blue-400`

### Footer

- Sin cambios estructurales
- Colores de texto actualizados a la nueva paleta (`text-slate-700 dark:text-slate-300`)
- Links hover en azul

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/layouts/Layout.astro` | Nuevo fondo (bg + gradiente azul), contenedor max-w-7xl |
| `src/components/Header.astro` | Color activo → azul |
| `src/components/Hero.astro` | Acento amarillo → azul |
| `src/components/ExperienceItem.astro` | Color título/bullet → azul, prop `companyLogo`, logo junto a empresa |
| `src/components/Experience.astro` | Pasar `companyLogo` a cada ExperienceItem |
| `src/components/Projects.astro` | Grid 3 col, nueva card con line-clamp, nuevos colores pills/botones |
| `src/components/AboutMe.astro` | Acento `<strong>` amarillo → azul |
| `src/components/Footer.astro` | Nueva paleta |
| `src/components/SectionContainer.astro` | `lg:max-w-4xl md:max-w-2xl` → `max-w-7xl` |
| `public/companies/telefonica.svg` | Logo Telefónica (nuevo archivo) |
| `public/companies/ucab.svg` | Logo UCAB (nuevo archivo) |

---

## Lo que NO cambia

- Estructura HTML de Hero, Experiencia, Sobre mí, Footer
- `ThemeToggle` y `LangToggle` (lógica y posición)
- `transition:persist` en ambos toggles
- Atributos `data-i18n` y `data-i18n-html` (i18n ya implementado)
- Fuente: Onest Variable
- ViewTransitions de Astro
- URLs de proyectos, GitHub, datasets
- Fechas de experiencia
- Foto de perfil y avatar

---

## Notas de implementación

- Los logos de empresa (`telefonica.svg`, `ucab.svg`) se descargan durante la implementación de Wikimedia Commons o Brandfetch
- La prop `companyLogo` en `ExperienceItem` es opcional — si no se pasa, no renderiza nada (compatible con futuros entries sin logo)
- `line-clamp-3` requiere el plugin `@tailwindcss/line-clamp` o Tailwind v3.3+ (que ya incluye `line-clamp` nativo)
- El gradiente de fondo solo se aplica en el `<body>` o el `<div>` raíz del layout — no en cada sección
