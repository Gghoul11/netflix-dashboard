# Fase 1 · Análisis

**Proyecto:** Netflix en el mundo: la economía del entretenimiento
**Autor:** Aldo Arceo Beltrán
**Dataset:** Netflix Movies and TV Shows (Kaggle, shivamb/netflix-shows)

> En esta fase se define **para quién** es el dashboard, **qué problema resuelve**, **cómo se prepararon los datos** y **qué tipo de dashboard** conviene.

---

## 1. Análisis de la audiencia

### ¿Quién usará el dashboard?

| Usuario | Descripción |
|---|---|
| **Principal:** analista de estrategia de contenido | Trabaja en una plataforma de streaming o productora y necesita entender el catálogo de Netflix como referencia del mercado. |
| **Secundario:** estudiantes y público interesado en cultura digital | Quieren saber qué se produce, dónde y cómo ha cambiado. |

### ¿Qué decisiones tomarán con la información?

- **En qué regiones invertir o producir**, al ver qué países tienen más presencia y cuáles están creciendo.
- **Qué géneros priorizar**, según los más comunes en general y en cada país.
- **Qué mezcla de películas y series ofrecer**, al ver hacia dónde se movió la proporción con los años.
- **Con qué directores trabajar**, a partir de quiénes tienen más títulos en la plataforma.

### ¿Qué nivel de detalle necesitan?

Un nivel **agregado**: totales por país, por año y por género. El usuario no necesita ver título por título, sino **patrones y comparaciones**. Por eso el dashboard muestra conteos y rankings, y los filtros (tipo, años, país) permiten bajar un nivel cuando hace falta.

---

## 2. Definición del objetivo

> **Objetivo:** *mostrar cómo se distribuye y cómo ha evolucionado el catálogo de Netflix por país, año y género, para entender las tendencias globales del entretenimiento digital.*

**¿Qué problema resuelve?** El dataset original es una tabla de 8 807 filas con texto mezclado (varios países o géneros en una sola celda, fechas en texto, datos faltantes). Así es imposible ver de un vistazo **dónde se concentra la producción**, **cuándo creció el catálogo** o **qué géneros dominan en cada región**. El dashboard convierte esa tabla en respuestas visuales inmediatas.

**Preguntas que debe responder:**
1. ¿Qué países producen más títulos para Netflix? → *KPI principal*
2. ¿Cómo evolucionaron los estrenos por año?
3. ¿Cuáles son los 5 géneros y los 5 directores más frecuentes?
4. ¿Qué proporción del catálogo son películas y qué proporción son series?

---

## 3. Preprocesamiento de datos

Todo el proceso está en un solo script: [`etl/limpieza.py`](../etl/limpieza.py). Se ejecuta con un comando y produce siempre el mismo resultado.

### 3.1 Identificación y entendimiento de variables

| Variable | Significado | Formato original | ¿Se usa? |
|---|---|---|---|
| `show_id` | Identificador único | texto (`s1`) | Sí, como llave |
| `type` | Película o serie | `Movie` / `TV Show` | **Sí:** KPI películas vs series y filtro |
| `title` | Nombre del título | texto | Sí, como referencia |
| `director` | Director(es) | texto, **varios separados por coma** | **Sí:** KPI top directores |
| `cast` | Reparto | texto, varios por coma | No: no responde ninguna pregunta |
| `country` | País(es) de producción | texto, **varios separados por coma** | **Sí:** KPI principal y mapa |
| `date_added` | Fecha en que llegó a Netflix | texto (`"September 25, 2021"`) | Sí, se deriva el año |
| `release_year` | Año de estreno | número | **Sí:** KPI por año y filtro |
| `rating` | Clasificación por edad | texto (`TV-MA`, `PG-13`) | Solo como referencia |
| `duration` | Duración | `"90 min"` o `"2 Seasons"` | Se separa en minutos / temporadas |
| `listed_in` | Géneros | texto, **varios separados por coma** | **Sí:** KPI top géneros y nube |
| `description` | Sinopsis | texto | No |

### 3.2 Limpieza de datos

| Problema encontrado | Cantidad | Decisión |
|---|---|---|
| `director` vacío | 2 634 (30%) | Se llena con "Desconocido" y **no cuenta** en el ranking de directores |
| `country` vacío | 831 (9%) | Se llena con "Desconocido" y **no cuenta** en el mapa |
| `cast` vacío | 825 | Se llena con "Desconocido" (no se usa) |
| `date_added` vacío | 10 | Se deja vacío: no afecta a los KPIs, que usan el año de estreno |
| Duración escrita en la columna `rating` (`"74 min"`) | 3 | Se mueve a `duration` |
| Fechas en texto con espacios al inicio | todas | Se convierten a fecha real (`2021-09-25`) |
| Varios valores en una celda (país, género, director) | miles | Se **separan**: cada título se relaciona con cada uno de sus países, géneros y directores |
| Mismo género con dos nombres (`Dramas` y `TV Dramas`) | 42 etiquetas | Se **unifican** en 20 géneros en español (ej. "Drama") |
| Etiquetas que no son géneros (`International Movies`, `British TV Shows`) | 4 754 usos | Se excluyen del análisis de géneros: indican origen, y eso ya se mide con el país |
| Países históricos (`West Germany`, `Soviet Union`) | pocos | Se asignan al país actual (Alemania, Rusia) para poder ubicarlos en el mapa |
| Duplicados | 0 | Se revisó; no hubo |

**Columnas nuevas (derivadas):**
- `tipo`: "Película" o "Serie".
- `anio_agregado` y `mes_agregado`: año y mes de llegada a Netflix.
- `duracion_min` y `temporadas`.
- `anios_hasta_netflix`: cuántos años pasaron entre el estreno y la llegada a Netflix.
- `iso2`: código del país, para el mapa.

### 3.3 Manejo de valores atípicos (outliers)

**Criterio:** regla del rango intercuartílico (IQR). Es atípico lo que queda por debajo de Q1 − 1.5·IQR o por encima de Q3 + 1.5·IQR.

| Variable | Atípicos | Decisión | Por qué |
|---|---|---|---|
| Año de estreno (antes de 2004) | 719 | **Se conservan** (marcados con `atipico_anio`) | Son clásicos reales; quitarlos borraría la historia del catálogo |
| Duración de películas (muy cortas o muy largas) | 450 | **Se conservan** (marcados con `atipico_duracion`) | Cortometrajes y películas largas existen de verdad |
| Llegó a Netflix *antes* de estrenarse | 14 | **Se corrige** (se anula esa fecha) | Es imposible, así que es un error de captura |

> Regla general: **un atípico se elimina o corrige solo si es un error**. Si es un dato real pero extremo, se conserva y se marca.

### 3.4 Integración de datos en la base de datos

Se eligió **PostgreSQL en Supabase** porque:
- Es una base de datos relacional real y gratuita.
- Se consulta desde la web.
- Permite controlar quién puede leer o escribir.

**Estructura** ([`database/schema.sql`](../database/schema.sql)):

```
titulos (1 fila por título)
   ├── paises      (título ↔ país)       → un título puede tener varios países
   ├── generos     (título ↔ género)     → y varios géneros
   └── directores  (título ↔ director)   → y varios directores
encuestas          (respuestas de la Fase 4)
```

Además se crearon **vistas** con cada KPI ya calculado (`kpi_titulos_por_pais`, `kpi_top_generos`, etc.).

**Flujo de los datos:**

```
netflix_titles.csv ──► limpieza.py ──► CSV limpios ──► cargar_supabase.py ──► PostgreSQL (Supabase)
                                   └─► netflix.json ──► Dashboard React
```

El dashboard lee una copia en JSON de los mismos datos limpios para cargar rápido y filtrar al instante, sin depender de la conexión a la base. La base de datos guarda los datos oficiales y también las respuestas de la encuesta de evaluación.

---

## 4. Selección del tipo de dashboard

| Tipo | ¿Encaja? | Razón |
|---|---|---|
| Operativo | ❌ | No hay datos en tiempo real; el catálogo es una foto a septiembre de 2021 |
| Táctico | Parcial | Sirve para comparar periodos, pero no hay metas de corto plazo que monitorear |
| **Estratégico** | ✅ **Elegido** | Muestra tendencias de **largo plazo** (1925–2021) y la **distribución global** para decisiones de inversión y catálogo |

**Justificación:** las preguntas del proyecto, como dónde se produce, cómo cambió con los años y qué géneros dominan, son de **visión general y largo plazo**. Las decisiones que apoya, como invertir en una región, apostar por un género o cambiar la mezcla de películas y series, no se toman a diario: son decisiones estratégicas. Por eso el dashboard pone primero los indicadores globales (KPIs grandes arriba) y deja el detalle para los filtros.

---

## 5. Repositorio de GitHub

- El repositorio es **público**, para poder publicar el dashboard en Vercel.
- El [`README.md`](../README.md) incluye el autor, una descripción del proyecto, los hallazgos y cómo ejecutarlo.
- La estructura de carpetas separa datos (`data/`), limpieza (`etl/`), base de datos (`database/`), aplicación (`web/`) y documentación (`docs/`).
