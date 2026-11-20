# Guion de exposición (≈ 8–10 minutos)

> Idea central para repetir: **"Netflix es global, pero su catálogo se produce en pocos países, es muy reciente y está cambiando de películas a series."**

---

### 1. Introducción (1 min)
- "Elegí el Proyecto 3: la economía del entretenimiento con Netflix."
- "El dataset de Kaggle tiene **8 807 títulos**, con el catálogo hasta septiembre de 2021."
- "La pregunta: **¿dónde, cuándo y de qué géneros produce Netflix su catálogo?**"

### 2. Fase 1 · Análisis (1.5 min)
- **Audiencia:** analistas de estrategia de contenido; deciden en qué países y géneros invertir.
- **Tipo de dashboard:** **estratégico**, porque son datos históricos para decisiones de largo plazo y no hay tiempo real.
- **Limpieza** (mostrar la página *Acerca de los datos*):
  - 30% de títulos sin director y 9% sin país → "Desconocido", y no cuentan en los rankings.
  - Celdas con varios países o géneros → se separaron.
  - "Dramas" y "TV Dramas" → un solo género, "Drama".
  - Atípicos: los clásicos antiguos **se conservan** porque son reales; solo se corrige lo imposible, como un título que llegó a Netflix antes de estrenarse.
- **Base de datos:** PostgreSQL en Supabase.

### 3. Fase 2 · Diseño (1.5 min)
- **KPI principal: títulos por país**, porque responde "cómo varía por región".
- 4 KPIs de apoyo: estrenos por año, top 5 géneros, top 5 directores, películas vs series.
- **Un gráfico para cada trabajo:**
  - mapa → dónde;
  - área → tiempo;
  - barras → rankings;
  - dona → solo 2 categorías.
- **Paleta:** rojo y negro de Netflix; azul para series porque rojo y azul **sí se distinguen con daltonismo** (rojo-verde no).
- Mostrar el **wireframe**: cuadrícula de 3 × 4 y niveles N1, N2 y N3.

### 4. Fase 3 · Demo en vivo (3 min) ⭐
1. "Lo primero que se ve es el KPI principal, con borde rojo: **Estados Unidos, 3 690 títulos, 46%**."
2. Pasar el mouse por el mapa → "**India** es el segundo lugar".
3. **Clic en India** → todo cambia: "**92% películas**, y Drama y Comedia arriba".
4. Clic en **Japón** → "aquí domina el **anime**".
5. Limpiar filtros y pasar a la línea de tiempo: "**71% del catálogo es de 2015 en adelante**, con pico en 2018".
6. Filtro **Series** → "en 2021 hubo **más series que películas** por primera vez".
7. Mencionar que el código sigue el wireframe: una carpeta para KPIs, otra para gráficos y la paleta en un solo archivo.

### 5. Fase 4 · Evaluación (1.5 min)
- "Lo probaron **9 personas** de 20 a 55 años; la encuesta está dentro del mismo dashboard."
- Mostrar la gráfica de promedios: **4.56 de 5**, y las 10 afirmaciones pasaron la meta de 4.
- "Además de preguntar si les gustó, comprobé si **entendieron**: el **100%** respondió bien qué país tiene más títulos."
- Lo más bajo fue "visualmente atractivo" (4.33): algunos pidieron **menos rojo**. Queda como mejora futura.

### 6. Conclusión (30 s)
- "El catálogo de Netflix **se concentra en Estados Unidos**, es **muy reciente** y **los gustos cambian por región**: dramas en India, anime en Japón, romance en Corea."
- "Lo más importante que aprendí: **preparar los datos y planear el diseño antes de programar**."

---

**Posibles preguntas del profesor:**

- *¿Por qué no un pastel para los géneros?* Son 20 categorías; el pastel solo funciona hasta 5.
- *¿Por qué los títulos sin país no están en el mapa?* No se puede ubicar algo sin país; son el 9% y se aclara en la nota.
- *¿Un título con dos países cuenta doble?* Cuenta una vez para cada país, y se indica en la nota del mapa.
- *¿Por qué baja 2021?* El dataset termina en septiembre de 2021.
- *¿Dónde está la base de datos?* En Supabase (PostgreSQL); `database/schema.sql` tiene las tablas y las vistas de KPIs.
