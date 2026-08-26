# Portafolio Personal — Miguel Vieira

Sitio web de portafolio profesional. En producción.

## Stack

- **Framework:** Astro 4 con ViewTransitions
- **Estilos:** Tailwind CSS 3.4 (sin dark mode, solo light)
- **Fuente:** Onest Variable
- **i18n:** Toggle ES/EN vía atributos `data-i18n`, persistencia en localStorage
- **Deploy:** Netlify, auto-deploy en push a `master`
- **Repo:** github.com/vieirarmiguel/Portafolio-Personal

## Diseño

- Paleta: azul `#2563eb` como acento, fondo `#f8fafc`
- Contenedor: `max-w-7xl` en todas las secciones
- Sin dark mode (eliminado intencionalmente)
- Hover de botones: `bg-blue-600`

## Estructura de secciones (en orden)

1. Hero — nombre, tagline, pills de contacto
2. Proyectos — grid 3→2→1 columnas con cards (imagen, descripción, pills de tecnologías)
3. Experiencia — timeline con logos de empresa
4. Sobre mí — texto + foto
5. Footer

## Proyectos incluidos

### Dinámicos (desde GitHub)
Se cargan en build desde repos con topic `portfolio` que tengan un `portfolio.json` en la raíz (ver `src/lib/github.ts`, requiere `GITHUB_TOKEN` en `.env`). Si `image` empieza con `/`, se sirve desde `public/` de este repo (necesario para repos privados); las imágenes reales viven en `public/projects/`.

El PAT `GITHUB_TOKEN` es fine-grained: hay que dar acceso al repo en GitHub → token → Repository access. Lucro también está en `STATIC_PROJECTS` para no depender de eso; el merge deduplica por título.

1. Lucro (React + Tailwind CSS + PostgreSQL) — repo privado
2. LinkedIn Generator (Next.js + Supabase + OpenAI + Stripe)
3. Futbea (Flutter + Next.js + NestJS + PostgreSQL) — repo privado
4. Scan Prices (Next.js + NestJS + PostgreSQL)
5. Klaro CRM (Next.js + Supabase)
6. GrowthOS (Next.js + PostgreSQL) — repo privado

### Estáticos (en `Projects.astro`)
1. Análisis de tasa de abandono de clientes (Power BI + PostgreSQL)
2. Análisis de satisfacción de empleados Atlas Labs (Power BI)
3. Perspectivas del mercado laboral en ciencia de datos (Power BI + MySQL)
4. Análisis de polaridad de comentarios de restaurante (Python + Power BI)
5. Ondas en modulación AM (Python)
6. Medición Nutricional Antropométrica — app Android (Java + Firebase)

## Experiencia incluida

1. Líder de Producto — Telefónica (mar. 2026 - actualidad)
2. Coordinador de Producto — Telefónica (ago. 2025 - mar. 2026)
3. Coordinador Desarrollo APP/WEB — Telefónica (oct. 2024 - ago. 2025)
4. Beca Trabajo — UCAB (sept. 2021 - jul. 2024)
5. Pasante — Telefónica (ago. 2023 - nov. 2023)

## Comandos

```bash
npm run dev      # servidor local en :4321
npm run build    # build de producción
git push origin master  # despliega automáticamente en Netlify
```
