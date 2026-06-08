# Copy Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar todos los textos del portafolio para alinearlos con la narrativa de marca personal aprobada en el spec `2026-06-08-copy-rewrite-design.md`.

**Architecture:** Cambios de texto puro en 5 archivos Astro existentes. Sin cambios de estructura, sin nuevos componentes, sin lógica nueva. La verificación es visual: levantar el dev server y revisar cada sección en el browser.

**Tech Stack:** Astro, edición directa de archivos `.astro`

---

## File Map

| Archivo | Qué cambia |
|---|---|
| `src/pages/index.astro` | title y description del Layout (líneas 16-17) |
| `src/components/Hero.astro` | Subtítulo de dos líneas (líneas 34-35) |
| `src/components/AboutMe.astro` | Tres párrafos del bio (líneas 9-19) |
| `src/components/Projects.astro` | Descriptions de 6 proyectos + typo en título (líneas 65-116) |
| `src/components/Experience.astro` | Description de Beca trabajo UCAB (línea 30) |

---

### Task 1: Meta — título y descripción SEO

**Files:**
- Modify: `src/pages/index.astro:16-17`

- [ ] **Step 1: Editar el título y descripción en Layout**

Reemplazar en `src/pages/index.astro`:

```astro
<Layout
  title="Miguel Vieira | Portafolio"
  description="PM con background técnico. Del dato a la decisión, de la idea al producto."
>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "copy: update meta title and description"
```

---

### Task 2: Hero — subtítulo

**Files:**
- Modify: `src/components/Hero.astro:34-35`

- [ ] **Step 1: Reemplazar el párrafo de subtítulo**

El bloque actual (líneas 32-36) es:

```astro
  <p
    class="mt-6 text-xl text-gray-800 dark:[&>strong]:text-yellow-200 [&>strong]:text-yellow-500 [&>strong]:font-semibold dark:text-gray-300"
  >
  <strong>Ingeniero en telecomunicaciones</strong> en Venezuela. 
  <strong>Líder de Producto</strong> en Telefónica Venezolana C.A.
  </p>
```

Reemplazar por:

```astro
  <p
    class="mt-6 text-xl text-gray-800 dark:[&>strong]:text-yellow-200 [&>strong]:text-yellow-500 [&>strong]:font-semibold dark:text-gray-300"
  >
  <strong>Product Manager</strong> · Telefónica Venezuela.<br />
  Estrategia, datos y ejecución. De la idea al producto.
  </p>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "copy: update hero subtitle to PM brand narrative"
```

---

### Task 3: About Me — bio completo

**Files:**
- Modify: `src/components/AboutMe.astro:9-19`

- [ ] **Step 1: Reemplazar los tres párrafos del bio**

El bloque actual (líneas 9-19) es:

```astro
  <p>
    Me llamo Miguel Ángel y soy un apasionado de la tecnología y el marketing. Mi trayectoria como Ingeniero en Telecomunicaciones comenzó en el desarrollo de aplicaciones móviles y web, una base técnica que me enseñó la importancia de <strong>construir soluciones funcionales para el éxito de cualquier negocio</strong>.
  </p>

  <p>
    Esta experiencia me llevó a un rol de <strong>Líder de Producto</strong>, donde ahora me enfoco en la estrategia, la conceptualización y la creación de valor. Aunque mis responsabilidades han evolucionado, sigo aplicando mi conocimiento técnico en <strong>Java, React Native, Python y la integración de APIs</strong> para coordinar equipos y entender las necesidades operativas.
  </p>

  <p>
    Me defino por ser una persona honesta y responsable, siempre buscando optimizar procesos y construir puentes entre la tecnología y las conexiones humanas. Mis habilidades en <strong>resolución de problemas, gerencia de proyectos, liderazgo y metodologías Ágiles (Scrum y LEAN)</strong> son el motor para guiar equipos y transformar ideas innovadoras en productos tangibles.
  </p>
```

Reemplazar por:

```astro
  <p>
    Soy un <strong>Product Manager con background técnico</strong>. Gestiono el ciclo de vida del producto de principio a fin — desde la investigación de mercado y la estrategia, hasta el diseño, el desarrollo y el lanzamiento.
  </p>

  <p>
    No solo gestiono productos — <strong>los entiendo, los diseño y los construyo</strong>.
  </p>

  <p>
    En Telefónica Venezuela he trabajado en cada fase del ciclo: entender el mercado, definir la estrategia, colaborar con ingeniería y diseño, y llevar el producto a manos del usuario. A lo largo de todo eso, una constante: me obsesiona que las cosas sean simples. Un buen producto no es solo funcional — es intuitivo, claro y sin fricciones para quien lo usa.
  </p>

  <p>
    Lo que me diferencia es mi background técnico. Puedo sentarme en cualquier sala — negocio, ingeniería, diseño — y hablar el mismo idioma. No solo comunico requerimientos; <strong>trabajo junto a los equipos</strong>.
  </p>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AboutMe.astro
git commit -m "copy: rewrite about me to PM brand narrative"
```

---

### Task 4: Projects — descripciones y typo en título

**Files:**
- Modify: `src/components/Projects.astro:65-116`

- [ ] **Step 1: Reemplazar el array PROJECTS completo**

Reemplazar desde `const PROJECTS = [` hasta el cierre `]` (líneas 63-118) con:

```astro
const PROJECTS = [
  {
    title: "Análisis de tasa de abandono de clientes",
    description:
      "¿Por qué se van los clientes? Este análisis desglosa el churn por ubicación, edad, género y plan contratado para identificar los segmentos con mayor riesgo y los factores que lo explican.",
    image: "/projects/BI_CHURN.webp",
    dataset: "https://drive.google.com/drive/folders/1WuzyeDklXYDkunIapGo3EViuUaDGla3n?usp=sharing",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNWMxYmZkZjctMTdmZi00NmViLWFjZTEtNmU4NjI4Zjc1NDExIiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9",
    tags: [TAGS.POWERBI, TAGS.POSTGRE, TAGS.EXCEL],
  },
  {
    title: "Análisis de satisfacción de empleados — Atlas Labs",
    description:
      "¿Qué retiene al talento? Un análisis de RRHH que cruza salarios, diversidad, satisfacción laboral y desgaste para entender qué factores impactan la retención en una empresa de tecnología.",
    image: "/projects/BI_RRHH.webp",
    dataset: "https://drive.google.com/drive/folders/1lOqMWMxMCr7iXypOELSjb1P1oYtfv6X4?usp=sharing",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNzQ2YmI3OTAtNDE4NS00ZDUxLTg1MzUtNGViNWI2Yjk0MTMxIiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9",
    tags: [TAGS.POWERBI, TAGS.POSTGRE, TAGS.EXCEL],
  },
  {
    title: "Perspectivas del mercado laboral en ciencia de datos",
    description:
      "¿Vale la pena entrar al campo de datos? Este análisis mapea la demanda real de perfiles, los salarios según experiencia y rol, y las habilidades que el mercado exige para quien quiera entrar o crecer en ciencia de datos.",
    image: "/projects/BI_JOBS.webp",
    dataset: "https://drive.google.com/drive/folders/1WoxQWfkLPk9wymdTMXjMUtxDLsTy3UXq?usp=sharing",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNGVkYmEwMWEtY2M0Mi00YWI1LWIxZmEtYzAxMjJmZmFmN2Q1IiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9",
    tags: [TAGS.POWERBI, TAGS.MYSQL, TAGS.EXCEL],
  },
  {
    title: "Análisis de polaridad de comentarios de un restaurante",
    description:
      "¿Qué piensan realmente los clientes? Usando un modelo de NLP preentrenado, analicé los comentarios de un restaurante para medir el sentimiento — positivo, neutro o negativo — y entender qué aspectos generan cada reacción.",
    github: "https://github.com/MiguelVieirar16/Analisis_emociones",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNDM3MmM4ZmMtYWVkMC00NGQxLWEwYTktMDU1ZmJlYjgzNzM1IiwidCI6ImUxOGVhZDk1LWZkY2ItNDE2MC05ZjY0LTg5ZDNhNWYxNWEyNCJ9",
    dataset: "https://drive.google.com/drive/folders/1cj_oyLfZnQv-GnI33V02d8jYf5MDf_Gd?usp=sharing",
    image: "/projects/BI_EMOCIONES.webp",
    tags: [TAGS.POWERBI, TAGS.PYTHON],
  },
  {
    title: "Ondas en modulación AM",
    description:
      "Aplicación de escritorio para simular y visualizar modulación AM. Permite seleccionar tipo de onda portadora, frecuencia y amplitud, y comparar la señal original con la modulación resultante en tiempo real.",
    image: "/projects/generador.webp",
    github: "https://github.com/MiguelVieirar16/modulacionam",
    tags: [TAGS.PYTHON],
  },
  {
    title: "Medición Nutricional Antropométrica",
    description:
      "App Android para registrar y calcular parámetros nutricionales — IMC, circunferencia de brazo, semanas de gestación — en pacientes de todas las edades. Conectada a Firebase para almacenamiento y seguimiento en tiempo real.",
    image: "/projects/androidapp.webp",
    github: "https://github.com/MiguelVieirar16/MedicionAntropometricaapp.git",
    tags: [TAGS.JAVA, TAGS.FIREBASE],
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Projects.astro
git commit -m "copy: rewrite project descriptions + fix typo in AM title"
```

---

### Task 5: Experience — Beca trabajo UCAB

**Files:**
- Modify: `src/components/Experience.astro:29-30`

- [ ] **Step 1: Reemplazar la description de Beca trabajo**

El entry actual (líneas 25-31):

```astro
  {
    date: "sept. 2021 - jul. 2024",
    title: "Beca trabajo",
    company: "Universidad Católica Andrés Bello",
    description:
      "Encargado de llevar a producción y de post producir el contenido académico que los profesores querían virtualizar. Trabajando con la conceptualización, planificación, desarrollo, lanzamiento y seguimiento de nuevos productos, además de hacer el seguimiento y el análisis de los datos del contenido virtualizado en las plataformas correspondientes.",
  },
```

Reemplazar por:

```astro
  {
    date: "sept. 2021 - jul. 2024",
    title: "Beca trabajo",
    company: "Universidad Católica Andrés Bello",
    description:
      "Aquí aprendí a pensar en el usuario antes de construir. Me encargué de virtualizar contenido académico — desde la conceptualización hasta el lanzamiento y el seguimiento — lo que me obligó a entender qué formatos, estructuras y experiencias funcionaban para quien aprendía del otro lado de la pantalla. Hice seguimiento y análisis de los datos de consumo del contenido en plataforma, lo que me dio mi primer contacto real con métricas de comportamiento de usuario.",
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Experience.astro
git commit -m "copy: reframe beca trabajo as first UX and data experience"
```

---

### Task 6: Verificación visual

- [ ] **Step 1: Levantar el dev server**

```bash
npm run dev
```

Expected: servidor disponible en `http://localhost:4321`

- [ ] **Step 2: Revisar sección por sección en el browser**

Verificar que aparezca correctamente:

| Sección | Qué revisar |
|---|---|
| Pestaña del browser | Título: "Miguel Vieira \| Portafolio" |
| Hero | "Product Manager · Telefónica Venezuela" + tagline |
| Sobre mí | 4 párrafos nuevos, sin mención de "Miguel Ángel" ni "telecomunicaciones" |
| Proyectos | Descripciones con pregunta inicial, título "modulación" sin typo |
| Experiencia | Beca trabajo con nueva descripción orientada a UX/datos |

- [ ] **Step 3: Commit final de verificación (si hay ajustes menores)**

```bash
git add -p
git commit -m "copy: minor visual adjustments after review"
```
