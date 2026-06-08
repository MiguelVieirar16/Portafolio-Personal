# UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el portafolio con nueva paleta azul/blanca, layout más amplio (max-w-7xl), grid de proyectos en 3 columnas y logos de empresa en la sección de experiencia.

**Architecture:** Cambios de estilo en componentes Astro existentes + reescritura del template de Projects.astro. No hay nuevos componentes. El build (`astro check && astro build`) actúa como verificación de tipos y correctitud después de cada tarea.

**Tech Stack:** Astro 4, Tailwind CSS 3.4 (line-clamp nativo), TypeScript

---

## File Map

| Archivo | Cambio |
|---|---|
| `src/components/SectionContainer.astro` | `lg:max-w-4xl md:max-w-2xl` → `max-w-7xl` |
| `src/components/Footer.astro` | `lg:max-w-4xl md:max-w-2xl` → `max-w-7xl` |
| `src/layouts/Layout.astro` | Gradiente fondo: lila → azul |
| `src/components/LinkButton.astro` | Focus ring: `yellow` → `blue` |
| `src/components/SocialPill.astro` | Focus ring: `yellow` → `blue` |
| `src/components/Hero.astro` | Acento `<strong>`: `yellow` → `blue` |
| `src/components/AboutMe.astro` | Acento `<strong>`: `yellow` → `blue` |
| `src/components/Header.astro` | Nav dark bg: `gray-800` → `slate-900` |
| `src/components/ExperienceItem.astro` | Título/bullet: `yellow` → `blue`; nueva prop `companyLogo?` |
| `src/components/Experience.astro` | Pasar `companyLogo` a cada entrada |
| `src/components/Projects.astro` | Reescribir template: grid 3 col, card con descripción y pills azules |
| `public/companies/telefonica.svg` | Logo Telefónica (nuevo archivo) |
| `public/companies/ucab.svg` | Logo UCAB (nuevo archivo) |

---

### Task 1: Contenedor global — max-w-7xl

**Files:**
- Modify: `src/components/SectionContainer.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Actualizar SectionContainer.astro**

Reemplazar la línea 8 completa:

```astro
<section
  id={id}
  data-section={id}
  class={`section ${className} scroll-m-20 w-full mx-auto container max-w-7xl`}
>
```

- [ ] **Step 2: Actualizar Footer.astro**

Reemplazar la clase del `<footer>`:

```astro
<footer
  class="opacity-80 m-4 min-[375px]:pl-4 md:pl-0 mt-16 w-full mx-auto container max-w-7xl mb-10 flex justify-center"
>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/SectionContainer.astro src/components/Footer.astro
git commit -m "style: widen layout container to max-w-7xl"
```

---

### Task 2: Fondo de página — gradiente azul

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Reemplazar el div de fondo**

Buscar el `<div` con la clase `absolute top-0 bottom-0 z-[-2]` (dentro de `<body>`) y reemplazarlo completo:

```astro
<div
  class="absolute top-0 bottom-0 z-[-2] min-h-screen w-full bg-[#f8fafc] dark:bg-[#0f172a]
  bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.08),rgba(248,250,252,0))]
  dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.15),rgba(15,23,42,0))]"
>
</div>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "style: replace purple gradient with blue gradient background"
```

---

### Task 3: Componentes base — focus ring azul

**Files:**
- Modify: `src/components/LinkButton.astro`
- Modify: `src/components/SocialPill.astro`

- [ ] **Step 1: Actualizar LinkButton.astro**

Reemplazar `focus-visible:ring-yellow-500/80` por `focus-visible:ring-blue-500/80` en la clase del `<a>`. El archivo completo queda:

```astro
---
const { href } = Astro.props;
---

<a
    target="_blank"
    href={href}
    role="link"
    class="inline-flex bg-gray-100 text-gray-800 border-gray-300 items-center justify-center gap-2 px-3 py-2 space-x-2 text-base transition dark:text-white dark:bg-gray-800 border dark:border-gray-600 focus-visible:ring-blue-500/80 text-md hover:bg-gray-800 hover:border-gray-900 group max-w-fit rounded-xl hover:text-white focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 active:bg-black"
>
    <slot />
</a>
```

- [ ] **Step 2: Actualizar SocialPill.astro**

Reemplazar `focus-visible:ring-yellow-500/80` por `focus-visible:ring-blue-500/80`. El archivo completo queda:

```astro
<a
  {...Astro.props}
  target="_blank"
  rel="noopener noreferrer"
  role="link"
  class="inline-flex items-center justify-center gap-2 px-4 py-1 text-gray-800 transition bg-gray-100 border border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600 dark:text-white focus-visible:ring-blue-500/80 text-md hover:bg-gray-900 hover:border-gray-700 hover:text-white dark:hover:bg-gray-100 dark:hover:border-gray-300 dark:hover:text-black group max-w-fit focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-2 active:bg-black"
>
  <slot />
</a>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/LinkButton.astro src/components/SocialPill.astro
git commit -m "style: update focus ring from yellow to blue in LinkButton and SocialPill"
```

---

### Task 4: Hero — acento azul

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Reemplazar clases del párrafo de subtítulo**

Buscar el `<p` con `[&>strong]:text-yellow-500` y reemplazar esas dos clases:

```astro
  <p
    class="mt-6 text-xl text-gray-800 dark:[&>strong]:text-blue-400 [&>strong]:text-blue-600 [&>strong]:font-semibold dark:text-gray-300"
  >
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "style: update hero accent from yellow to blue"
```

---

### Task 5: AboutMe — acento azul

**Files:**
- Modify: `src/components/AboutMe.astro`

- [ ] **Step 1: Reemplazar clases del div de texto**

Buscar la clase `[&>p>strong]:text-yellow-500 dark:[&>p>strong]:text-yellow-100` y reemplazarla:

```astro
<div
  class="[&>p]:mb-4 [&>p>strong]:text-blue-600 dark:[&>p>strong]:text-blue-400 [&>p>strong]:font-normal [&>p>strong]:font-mono text-pretty order-2 md:order-1"
>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/AboutMe.astro
git commit -m "style: update about me accent from yellow to blue"
```

---

### Task 6: Header — fondo dark mode

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Actualizar el fondo del nav en dark mode**

En la sección `<style>`, buscar:

```css
  nav {
    @apply dark:bg-gray-800/90 bg-white/50;
  }
```

Reemplazar por:

```css
  nav {
    @apply dark:bg-slate-900/90 bg-white/50;
  }
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "style: update header dark background to slate-900"
```

---

### Task 7: ExperienceItem — color azul + prop companyLogo

**Files:**
- Modify: `src/components/ExperienceItem.astro`

- [ ] **Step 1: Reemplazar el archivo completo**

```astro
---
import LinkInline from "./LinkInline.astro"

interface Props {
  title: string
  company: string
  description: string
  link?: string
  date: string
  titleKey?: string
  descKey?: string
  companyLogo?: string
}

const { title, company, description, link, date, titleKey, descKey, companyLogo } = Astro.props
---

<div
  class="relative mx-12 pb-12 grid before:absolute before:left-[-35px] before:block before:h-full before:border-l-2 before:border-black/20 dark:before:border-white/15 before:content-[''] md:grid-cols-5 md:gap-10 md:space-x-4]"
>
  <div class="relative pb-12 md:col-span-2">
    <div class="sticky top-0">
      <span class="text-blue-500 -left-[42px] absolute rounded-full text-5xl"
        >&bull;</span
      >

      <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400" data-i18n={titleKey}>{title}</h3>
      <div class="flex items-center gap-2 mt-1">
        {companyLogo && (
          <img src={companyLogo} alt="" class="w-7 h-7 object-contain" />
        )}
        <h4 class="font-semibold text-xl text-gray-600 dark:text-white">{company}</h4>
      </div>
      <time class="p-0 m-0 text-sm text-gray-600/80 dark:text-white/80">{date}</time>
    </div>
  </div>
  <div class="relative flex flex-col gap-2 pb-4 text-gray-600 dark:text-gray-300 md:col-span-3">
    <p data-i18n={descKey}>{description}</p>
    {
      link && (
        <LinkInline href={link}>
          <span data-i18n="exp.more">Saber más</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 icon icon-tabler icon-tabler-chevron-right"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 6l6 6l-6 6" />
            </>
          </svg>
        </LinkInline>
      )
    }
  </div>
</div>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExperienceItem.astro
git commit -m "style: update experience accent to blue and add companyLogo prop"
```

---

### Task 8: Logos de empresa

**Files:**
- Create: `public/companies/telefonica.svg`
- Create: `public/companies/ucab.svg`

- [ ] **Step 1: Crear directorio**

```bash
mkdir -p public/companies
```

- [ ] **Step 2: Descargar logo de Telefónica**

```bash
curl -L "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/telefonica.svg" \
  -o public/companies/telefonica.svg
```

Verificar que el archivo no está vacío:

```bash
wc -c public/companies/telefonica.svg
```

Expected: más de 100 bytes.

- [ ] **Step 3: Crear logo de UCAB**

Si el curl de Telefónica funcionó, crear el SVG de UCAB manualmente (no está en SimpleIcons):

Crear `public/companies/ucab.svg` con este contenido:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#003087"/>
  <text x="50" y="62" text-anchor="middle" fill="white" font-size="26" font-weight="bold" font-family="system-ui, sans-serif">UCAB</text>
</svg>
```

- [ ] **Step 4: Commit**

```bash
git add public/companies/
git commit -m "feat: add company logos for Telefónica and UCAB"
```

---

### Task 9: Experience — conectar logos

**Files:**
- Modify: `src/components/Experience.astro`

- [ ] **Step 1: Reemplazar el archivo completo**

```astro
---
import ExperienceItem from "./ExperienceItem.astro"

const EXPERIENCE = [
  {
    date: "mar. 2026 - actualidad",
    title: "Líder de Producto",
    company: "Telefónica Venezolana C.A.",
    companyLogo: "/companies/telefonica.svg",
    description:
      "Lidero la visión y evolución del portafolio de productos digitales, siendo responsable del impacto del producto en la experiencia del cliente y en los resultados del negocio. Defino y comunico el roadmap estratégico, priorizando iniciativas en función de valor al cliente, viabilidad técnica y rentabilidad, alineadas con los objetivos corporativos. Actúo como owner del producto, tomando decisiones de alcance y priorización, y asegurando la alineación entre stakeholders de negocio, tecnología y marketing. Acompaño y superviso la ejecución ágil de los desarrollos, velando porque la complejidad técnica se traduzca en soluciones simples, escalables y orientadas a resultados, midiendo el éxito a través de indicadores de producto y negocio.",
  },
  {
    date: "ago. 2025 - mar. 2026",
    title: "Coordinador de Producto",
    company: "Telefónica Venezolana C.A.",
    companyLogo: "/companies/telefonica.svg",
    description:
      "Coordiné la evolución del portafolio de productos digitales, actuando como punto de conexión entre los equipos de negocio y tecnología para garantizar una ejecución alineada con las prioridades definidas. Participé en la definición y mantenimiento del roadmap de producto, colaborando en la priorización de funcionalidades con foco en la experiencia del cliente y los objetivos comerciales. Gestioné la ejecución ágil de los desarrollos, asegurando el cumplimiento de tiempos, alcance y calidad, y facilitando la comunicación entre los distintos equipos involucrados para una entrega eficiente de valor",
  },
  {
    date: "oct. 2024 - ago. 2025",
    title: "Coordinador desarollo APP/WEB",
    company: "Telefónica Venezolana C.A.",
    companyLogo: "/companies/telefonica.svg",
    description:
      "Como Líder Técnico en desarrollo frontend, me enfoqué en la conceptualización e integración de nuevos productos para nuestra aplicación móvil. Lideré el desarrollo y mantenimiento de la aplicación nativa de Android, utilizando Java para optimizar el rendimiento e implementar funcionalidades clave como campañas promocionales. Mi rol incluyó la participación activa en la migración de la capa de servicios, la integración de APIs RESTful y la colaboración directa con el equipo de diseño UI/UX para asegurar una experiencia de usuario fluida y alineada con la estrategia de producto.",
  },
  {
    date: "sept. 2021 - jul. 2024",
    title: "Beca trabajo",
    company: "Universidad Católica Andrés Bello",
    companyLogo: "/companies/ucab.svg",
    description:
      "Aquí aprendí a pensar en el usuario antes de construir. Me encargué de virtualizar contenido académico — desde la conceptualización hasta el lanzamiento y el seguimiento — lo que me obligó a entender qué formatos, estructuras y experiencias funcionaban para quien aprendía del otro lado de la pantalla. Hice seguimiento y análisis de los datos de consumo del contenido en plataforma, lo que me dio mi primer contacto real con métricas de comportamiento de usuario.",
  },
  {
    date: "ago. 2023 - nov. 2023",
    title: "Pasante",
    company: "Telefónica Venezolana C.A.",
    companyLogo: "/companies/telefonica.svg",
    description:
      "Responsable de realizar un estudio de factibilidad y elaboración de propuesta técnica para la migración de servicios Legacy PDH/SDH a la red IP/MPLS de Telefónica Venezolana, C.A.",
  },
]
---

<ol class="relative mt-16">
  {
    EXPERIENCE.map((experience, index) => (
      <li class="">
        <ExperienceItem
          {...experience}
          titleKey={`exp.${index}.title`}
          descKey={`exp.${index}.desc`}
        />
      </li>
    ))
  }
</ol>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/Experience.astro
git commit -m "feat: connect company logos to experience entries"
```

---

### Task 10: Projects — grid 3 columnas

**Files:**
- Modify: `src/components/Projects.astro`

- [ ] **Step 1: Reemplazar solo el bloque de render (mantener imports y datos)**

Buscar `<div class="flex flex-col gap-y-16">` hasta el cierre `</div>` al final del archivo y reemplazar con:

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {
    PROJECTS.map(({ image, title, description, tags, link, github, dataset }, index) => (
      <article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
        <div class="h-40 overflow-hidden">
          <img
            class="w-full h-full object-cover object-top"
            loading="lazy"
            src={image}
            alt={title}
          />
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3
            class="text-base font-bold text-slate-900 dark:text-slate-50 mb-2 leading-snug"
            data-i18n={`project.${index}.title`}
          >
            {title}
          </h3>
          <p
            class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3"
            data-i18n={`project.${index}.desc`}
          >
            {description}
          </p>
          <ul class="flex flex-wrap gap-x-2 gap-y-1 mb-4">
            {tags.map((tag) => (
              <li>
                <span class="flex gap-x-1 items-center rounded-full text-xs py-1 px-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <tag.icon class="size-3" />
                  {tag.name}
                </span>
              </li>
            ))}
          </ul>
          <footer class="flex items-center gap-x-3 mt-auto">
            {github && (
              <LinkButton href={github}>
                <GitHub class="size-4" />
                Code
              </LinkButton>
            )}
            {link && (
              <LinkButton href={link}>
                <Link class="size-4" />
                Preview
              </LinkButton>
            )}
            {dataset && (
              <LinkButton href={dataset}>
                <Dataset class="size-4" />
                Dataset
              </LinkButton>
            )}
          </footer>
        </div>
      </article>
    ))
  }
</div>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: `2 page(s) built` sin errores. Astro type-check verifica que `tag.icon` sigue siendo válido.

- [ ] **Step 3: Commit**

```bash
git add src/components/Projects.astro
git commit -m "feat: replace project list with responsive 3-column grid"
```

---

### Task 11: Verificación visual

- [ ] **Step 1: Levantar el dev server**

```bash
npm run dev
```

Expected: servidor en `http://localhost:4321` (o el siguiente puerto libre).

- [ ] **Step 2: Verificar sección por sección**

| Sección | Qué revisar |
|---|---|
| Fondo | Gradiente azul sutil visible en la parte superior de la página |
| Hero | `<strong>Product Manager</strong>` en azul (no amarillo) |
| Secciones | Usan el ancho completo de la pantalla — sin márgenes blancos vacíos en desktop |
| Experiencia | Título de cada entrada en azul, logo de Telefónica visible junto al nombre |
| Proyectos | 3 columnas en desktop, 2 en tablet, 1 en mobile; pills azules con iconos |
| Sobre mí | `<strong>` en azul |
| Dark mode | Activar dark mode — fondo oscuro, gradiente azul sutil, cards en slate-800 |

- [ ] **Step 3: Commit final si hubo ajustes menores**

```bash
git add -p
git commit -m "style: minor visual adjustments after review"
```
