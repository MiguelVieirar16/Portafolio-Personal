# i18n Language Toggle — Design Spec

**Fecha:** 2026-06-08
**Proyecto:** Portafoliio_AnalisisDeDatos
**Estado:** Aprobado

---

## Objetivo

Añadir un toggle ES/EN al portafolio. El idioma es una preferencia del usuario guardada en `localStorage`. La URL no cambia. El comportamiento sigue el patrón del `ThemeToggle` existente.

---

## Arquitectura

### Archivos nuevos

| Archivo | Responsabilidad |
|---|---|
| `src/i18n/ui.ts` | Objeto central con todas las traducciones ES + EN |
| `src/components/LangToggle.astro` | Botón toggle (badge estilo ThemeToggle) con script inline |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/layouts/Layout.astro` | Script inline en `<head>` para leer localStorage y setear `data-lang` en `<html>` antes del primer paint (evita flash) |
| `src/components/Header.astro` | Importar y renderizar `<LangToggle />` junto al `<ThemeToggle />`. Añadir `data-i18n` a los nav items |
| `src/components/Hero.astro` | `data-i18n` en subtítulo (2 líneas) |
| `src/components/AboutMe.astro` | `data-i18n-html` en los 4 párrafos (contienen `<strong>`) |
| `src/components/Projects.astro` | `data-i18n` en títulos y descripciones de los 6 proyectos |
| `src/components/Experience.astro` | `data-i18n` en título y descripción de cada entry. Las traducciones importadas desde `ui.ts` |
| `src/components/ExperienceItem.astro` | Aceptar `titleKey` y `descKey` props para los atributos `data-i18n` |
| `src/components/Footer.astro` | `data-i18n` en textos del footer |
| `src/pages/index.astro` | `data-i18n` en los títulos de sección (Experiencia laboral, Proyectos, Sobre mí) |

---

## Mecanismo de swap

### Flash prevention (en `<head>` de Layout.astro)

```html
<script is:inline>
  const lang = localStorage.getItem('lang') || 'es';
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
</script>
```

### Swap script (en LangToggle.astro)

```js
// On load: apply saved language
// On toggle click: flip language, save to localStorage, re-apply
function applyLang(lang) {
  const translations = window.__i18n__[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.textContent = translations[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (translations[key]) el.innerHTML = translations[key];
  });
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('lang', lang);
}
```

Las traducciones se exponen como `window.__i18n__` desde un `<script>` en el componente `LangToggle`.

### Toggle button

- Badge simple: muestra `ES` o `EN` (el idioma actual)
- Click alterna entre los dos
- Se ubica junto al `ThemeToggle` en el header

---

## Atributos data-i18n

- `data-i18n="key"` → reemplaza `textContent` (texto plano)
- `data-i18n-html="key"` → reemplaza `innerHTML` (texto con etiquetas HTML)

---

## Traducciones completas — src/i18n/ui.ts

### Meta

| Key | ES | EN |
|---|---|---|
| `meta.title` | Miguel Vieira \| Portafolio | Miguel Vieira \| Portfolio |
| `meta.description` | PM con background técnico. Del dato a la decisión, de la idea al producto. | PM with a technical background. From data to decision, from idea to product. |

### Navegación y secciones

| Key | ES | EN |
|---|---|---|
| `nav.experience` | Experiencia | Experience |
| `nav.projects` | Proyectos | Projects |
| `nav.about` | Sobre mí | About |
| `nav.contact` | Contacto | Contact |
| `section.experience` | Experiencia laboral | Work Experience |
| `section.projects` | Proyectos | Projects |
| `section.about` | Sobre mí | About Me |

### Hero

| Key | ES | EN |
|---|---|---|
| `hero.line1` | Product Manager · Telefónica Venezuela. | Product Manager · Telefónica Venezuela. |
| `hero.line2` | Estrategia, datos y ejecución. De la idea al producto. | Strategy, data and execution. From idea to product. |

### About Me (data-i18n-html)

| Key | ES | EN |
|---|---|---|
| `about.p1` | Soy un \<strong\>Product Manager con background técnico\</strong\>. Gestiono el ciclo de vida del producto de principio a fin — desde la investigación de mercado y la estrategia, hasta el diseño, el desarrollo y el lanzamiento. | I'm a \<strong\>Product Manager with a technical background\</strong\>. I manage the full product lifecycle — from market research and strategy, through design and development, all the way to launch. |
| `about.p2` | No solo gestiono productos — \<strong\>los entiendo, los diseño y los construyo\</strong\>. | I don't just manage products — \<strong\>I understand them, design them, and build them\</strong\>. |
| `about.p3` | En Telefónica Venezuela he trabajado en cada fase del ciclo: entender el mercado, definir la estrategia, colaborar con ingeniería y diseño, y llevar el producto a manos del usuario. A lo largo de todo eso, una constante: me obsesiona que las cosas sean simples. Un buen producto no es solo funcional — es intuitivo, claro y sin fricciones para quien lo usa. | At Telefónica Venezuela I've worked across every phase of the cycle: understanding the market, defining strategy, collaborating with engineering and design, and getting the product into users' hands. Throughout all of it, one constant: I'm obsessed with making things simple. A great product isn't just functional — it's intuitive, clear, and frictionless for the person using it. |
| `about.p4` | Lo que me diferencia es mi background técnico. Puedo sentarme en cualquier sala — negocio, ingeniería, diseño — y hablar el mismo idioma. No solo comunico requerimientos; \<strong\>trabajo junto a los equipos\</strong\>. | What sets me apart is my technical background. I can sit in any room — business, engineering, design — and hold my own. I don't just communicate requirements; \<strong\>I work alongside the teams\</strong\>. |

### Proyectos

| Key | ES | EN |
|---|---|---|
| `project.0.title` | Análisis de tasa de abandono de clientes | Customer Churn Rate Analysis |
| `project.0.desc` | ¿Por qué se van los clientes? Este análisis desglosa el churn por ubicación, edad, género y plan contratado para identificar los segmentos con mayor riesgo y los factores que lo explican. | Why do customers leave? This analysis breaks down churn by location, age, gender and plan to identify the highest-risk segments and the factors that explain it. |
| `project.1.title` | Análisis de satisfacción de empleados — Atlas Labs | Employee Satisfaction Analysis — Atlas Labs |
| `project.1.desc` | ¿Qué retiene al talento? Un análisis de RRHH que cruza salarios, diversidad, satisfacción laboral y desgaste para entender qué factores impactan la retención en una empresa de tecnología. | What retains talent? An HR analysis crossing salaries, diversity, job satisfaction and burnout to understand what drives retention at a tech company. |
| `project.2.title` | Perspectivas del mercado laboral en ciencia de datos | Data Science Job Market Insights |
| `project.2.desc` | ¿Vale la pena entrar al campo de datos? Este análisis mapea la demanda real de perfiles, los salarios según experiencia y rol, y las habilidades que el mercado exige para quien quiera entrar o crecer en ciencia de datos. | Is it worth entering the data field? This analysis maps real demand for profiles, salaries by experience and role, and the skills the market requires to enter or grow in data science. |
| `project.3.title` | Análisis de polaridad de comentarios de un restaurante | Restaurant Review Sentiment Analysis |
| `project.3.desc` | ¿Qué piensan realmente los clientes? Usando un modelo de NLP preentrenado, analicé los comentarios de un restaurante para medir el sentimiento — positivo, neutro o negativo — y entender qué aspectos generan cada reacción. | What do customers really think? Using a pre-trained NLP model, I analyzed restaurant reviews to measure sentiment — positive, neutral or negative — and understand what aspects drive each reaction. |
| `project.4.title` | Ondas en modulación AM | AM Modulation Waveforms |
| `project.4.desc` | Aplicación de escritorio para simular y visualizar modulación AM. Permite seleccionar tipo de onda portadora, frecuencia y amplitud, y comparar la señal original con la modulación resultante en tiempo real. | Desktop app to simulate and visualize AM modulation. Select carrier wave type, frequency and amplitude, and compare the original signal with the resulting modulation in real time. |
| `project.5.title` | Medición Nutricional Antropométrica | Anthropometric Nutritional Assessment |
| `project.5.desc` | App Android para registrar y calcular parámetros nutricionales — IMC, circunferencia de brazo, semanas de gestación — en pacientes de todas las edades. Conectada a Firebase para almacenamiento y seguimiento en tiempo real. | Android app to record and calculate nutritional parameters — BMI, arm circumference, weeks of gestation — for patients of all ages. Connected to Firebase for real-time storage and tracking. |

### Experiencia

| Key | ES | EN |
|---|---|---|
| `exp.0.title` | Líder de Producto | Product Manager |
| `exp.0.desc` | Lidero la visión y evolución del portafolio de productos digitales, siendo responsable del impacto del producto en la experiencia del cliente y en los resultados del negocio. Defino y comunico el roadmap estratégico, priorizando iniciativas en función de valor al cliente, viabilidad técnica y rentabilidad, alineadas con los objetivos corporativos. Actúo como owner del producto, tomando decisiones de alcance y priorización, y asegurando la alineación entre stakeholders de negocio, tecnología y marketing. Acompaño y superviso la ejecución ágil de los desarrollos, velando porque la complejidad técnica se traduzca en soluciones simples, escalables y orientadas a resultados, midiendo el éxito a través de indicadores de producto y negocio. | I lead the vision and evolution of the digital product portfolio, owning the product's impact on customer experience and business results. I define and communicate the strategic roadmap, prioritizing initiatives based on customer value, technical feasibility, and profitability, aligned with corporate objectives. I act as product owner, making scope and prioritization decisions, and ensuring alignment between business, technology, and marketing stakeholders. I oversee agile execution, ensuring technical complexity translates into simple, scalable, results-oriented solutions, measuring success through product and business indicators. |
| `exp.1.title` | Coordinador de Producto | Junior Product Manager |
| `exp.1.desc` | Coordiné la evolución del portafolio de productos digitales, actuando como punto de conexión entre los equipos de negocio y tecnología para garantizar una ejecución alineada con las prioridades definidas. Participé en la definición y mantenimiento del roadmap de producto, colaborando en la priorización de funcionalidades con foco en la experiencia del cliente y los objetivos comerciales. Gestioné la ejecución ágil de los desarrollos, asegurando el cumplimiento de tiempos, alcance y calidad, y facilitando la comunicación entre los distintos equipos involucrados para una entrega eficiente de valor. | I coordinated the evolution of the digital product portfolio, acting as the connection point between business and technology teams to ensure execution aligned with defined priorities. I collaborated on defining and maintaining the product roadmap, prioritizing features with a focus on customer experience and commercial objectives. I managed agile execution of developments, ensuring timelines, scope, and quality were met, and facilitating communication between teams for efficient value delivery. |
| `exp.2.title` | Coordinador desarrollo APP/WEB | Junior App/Web Developer |
| `exp.2.desc` | Como Líder Técnico en desarrollo frontend, me enfoqué en la conceptualización e integración de nuevos productos para nuestra aplicación móvil. Lideré el desarrollo y mantenimiento de la aplicación nativa de Android, utilizando Java para optimizar el rendimiento e implementar funcionalidades clave como campañas promocionales. Mi rol incluyó la participación activa en la migración de la capa de servicios, la integración de APIs RESTful y la colaboración directa con el equipo de diseño UI/UX para asegurar una experiencia de usuario fluida y alineada con la estrategia de producto. | As Technical Lead in frontend development, I focused on the conceptualization and integration of new products for our mobile app. I led development and maintenance of the native Android app, using Java to optimize performance and implement key features such as promotional campaigns. My role included active participation in the service layer migration, RESTful API integration, and direct collaboration with the UI/UX design team to ensure a smooth user experience aligned with the product strategy. |
| `exp.3.title` | Beca trabajo | Work Scholarship |
| `exp.3.desc` | Aquí aprendí a pensar en el usuario antes de construir. Me encargué de virtualizar contenido académico — desde la conceptualización hasta el lanzamiento y el seguimiento — lo que me obligó a entender qué formatos, estructuras y experiencias funcionaban para quien aprendía del otro lado de la pantalla. Hice seguimiento y análisis de los datos de consumo del contenido en plataforma, lo que me dio mi primer contacto real con métricas de comportamiento de usuario. | This is where I learned to think about the user before building. I was in charge of virtualizing academic content — from conceptualization to launch and monitoring — which forced me to understand what formats, structures and experiences worked for people learning on the other side of the screen. I tracked and analyzed content consumption data on the platform, giving me my first real contact with user behavior metrics. |
| `exp.4.title` | Pasante | Intern |
| `exp.4.desc` | Responsable de realizar un estudio de factibilidad y elaboración de propuesta técnica para la migración de servicios Legacy PDH/SDH a la red IP/MPLS de Telefónica Venezolana, C.A. | Responsible for conducting a feasibility study and developing a technical proposal for the migration of Legacy PDH/SDH services to Telefónica Venezuela's IP/MPLS network. |

### Footer

| Key | ES | EN |
|---|---|---|
| `footer.rights` | Casi todos los derechos reservados | Almost all rights reserved. |
| `footer.about` | Sobre mí | About |
| `footer.contact` | Contacto | Contact |

---

## Lo que NO cambia

- URLs de proyectos (GitHub, Power BI, dataset)
- Nombres de empresas (Telefónica Venezolana C.A., Universidad Católica Andrés Bello)
- Fechas de experiencia
- Stack tags de proyectos
- Imagen de perfil y foto
- Datos de contacto (email, LinkedIn, WhatsApp)
- `transition:persist` del ThemeToggle (se aplica también al LangToggle)

---

## Notas para la implementación

- `ExperienceItem.astro` necesita recibir `titleKey` y `descKey` como props adicionales para renderizar los atributos `data-i18n`
- El idioma por defecto es `es`. Si `localStorage` no tiene valor, se asume español
- `window.__i18n__` se define en un `<script>` dentro de `LangToggle.astro` para que el objeto de traducciones esté disponible globalmente
- El LangToggle debe usar `transition:persist` igual que el ThemeToggle para sobrevivir las View Transitions de Astro
