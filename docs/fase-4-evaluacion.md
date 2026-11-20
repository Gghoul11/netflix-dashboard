# Fase 4 · Evaluación del dashboard

**Proyecto:** Netflix en el mundo · **Autor:** Aldo Arceo Beltrán

> **Propósito:** comprobar con personas reales si el dashboard es **claro, fácil de usar, pertinente y útil**. No basta con que funcione: tiene que entenderse sin que nadie lo explique.

> ⚠️ Las secciones marcadas con **[PENDIENTE]** se llenan con las respuestas reales de los participantes. No se inventan datos.

---

## 1. Audiencia de la evaluación

**Mínimo 3 participantes**, que representan a la audiencia de la Fase 1: personas interesadas en contenido digital, con distintos niveles de experiencia en dashboards.

| # | Edad | Nivel educativo / ocupación | Conoce Netflix (1–5) | Experiencia con dashboards (1–5) |
|---|---|---|---|---|
| 1 | [PENDIENTE] | | | |
| 2 | [PENDIENTE] | | | |
| 3 | [PENDIENTE] | | | |

*(La tabla se genera automáticamente en `docs/resultados-encuesta.md`.)*

---

## 2. Técnicas de evaluación elegidas

| Técnica | Por qué |
|---|---|
| **Prueba de uso observada** | Ver en vivo cómo navega la persona: dónde hace clic primero, si usa los filtros y si duda. Mide la **usabilidad real**. |
| **Cuestionario estructurado (escala 1–5)** | Las 10 afirmaciones de las indicaciones; dan **promedios comparables**. |
| **Preguntas de comprensión** | 3 preguntas con respuesta correcta, para comprobar si la persona **entendió los datos** y no solo si le gustó el diseño. |
| **Preguntas abiertas** | Las 5 preguntas sugeridas; recogen opiniones que los números no captan. |

El cuestionario está **dentro del propio dashboard** (pestaña **Evaluación**) y las respuestas se guardan en la base de datos (tabla `encuestas` en Supabase). Así no se pierden y se analizan con un script.

---

## 3. Instrumento (encuesta)

![Encuesta](img/evaluacion.png)

**Sección 1: Datos del participante**
- Edad, género (opcional) y ocupación o rol.
- Conocimiento del catálogo de Netflix (1–5).
- Experiencia usando dashboards (1–5).

**Sección 2: Usabilidad** (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo)
1. El dashboard es fácil de entender.
2. Los colores utilizados ayudan a interpretar la información.
3. Puedo identificar fácilmente el KPI principal.
4. Los gráficos representan correctamente los datos.
5. La información está bien organizada y estructurada.
6. Los textos, títulos y etiquetas son claros.
7. La interactividad (filtros, botones) es intuitiva.
8. Considero que el dashboard es visualmente atractivo.
9. El dashboard me permite obtener conclusiones o insights.
10. En general, la experiencia de uso fue satisfactoria.

**Sección 3: Comprensión** (tienen respuesta correcta)
- ¿Qué país tiene más títulos en Netflix? → *Estados Unidos*
- ¿Netflix tiene más películas o más series? → *Películas*
- ¿Cuál es el género más común? → *Drama*

**Sección 4: Preguntas abiertas**
- ¿Qué te gustó más del dashboard?
- ¿Qué parte te resultó confusa o difícil de entender?
- ¿Qué mejorarías en el diseño o en los gráficos?
- ¿Qué KPI o gráfico te resultó más útil?
- ¿Agregarías o quitarías algún elemento?

---

## 4. Procedimiento (cómo se aplicó)

1. Se le dijo a cada participante **solo el propósito general**: *"Es un dashboard sobre el catálogo de Netflix"*. **No se explicó** cómo usarlo.
2. **Exploración libre** de 3 a 5 minutos, mientras el evaluador anotaba comentarios espontáneos y dudas.
3. Al terminar, el participante abrió la pestaña **Evaluación** y respondió la encuesta.
4. Las respuestas se analizaron con `etl/analizar_encuesta.py`, que calcula promedios, aciertos y la gráfica.

**Observaciones durante la prueba** (comentarios espontáneos):

| Participante | ¿Qué hizo primero? | ¿Usó filtros o el mapa? | Comentarios o dudas |
|---|---|---|---|
| 1 | [PENDIENTE] | | |
| 2 | [PENDIENTE] | | |
| 3 | [PENDIENTE] | | |

---

## 5. Resultados

### 5.1 Promedio por afirmación

**[PENDIENTE]** Aquí va `docs/img/encuesta-promedios.png` y la tabla de promedios de `docs/resultados-encuesta.md`.

<!-- ![Promedios](img/encuesta-promedios.png) -->

### 5.2 Comprensión

**[PENDIENTE]** % de aciertos por pregunta.

### 5.3 Respuestas abiertas (patrones)

**[PENDIENTE]** Se agrupan los comentarios repetidos.

---

## 6. Análisis e interpretación

Se analiza por cada aspecto que piden las indicaciones:

| Aspecto | Preguntas que lo miden | Resultado |
|---|---|---|
| Usabilidad | 1, 7 + observación | [PENDIENTE] |
| Comprensión de la información | 6, 9 + preguntas de comprensión | [PENDIENTE] |
| Pertinencia de los KPIs | 3, 9 + "¿qué KPI fue más útil?" | [PENDIENTE] |
| Estética y diseño visual | 2, 5, 8 | [PENDIENTE] |
| Interactividad y navegación | 7 + observación | [PENDIENTE] |
| Impacto y utilidad | 9, 10 | [PENDIENTE] |

**Criterio:** promedio ≥ 4 = **fortaleza**; entre 3.5 y 4 = aceptable; menor de 3.5 = **debilidad**.

---

## 7. Hallazgos

### ✅ Aspectos que funcionan bien
[PENDIENTE]

### ⚠️ Problemas detectados
[PENDIENTE]

### 💡 Recomendaciones de mejora
[PENDIENTE]

### Cambios aplicados después de la evaluación
[PENDIENTE] (qué se corrigió en el dashboard a partir de los resultados)

---

## 8. Conclusión

[PENDIENTE] ¿Se cumplió el propósito analítico? ¿El dashboard informa y facilita decisiones?

---

## Repositorio

El proyecto está en el repositorio: **https://github.com/Gghoul11/netflix-dashboard**
Dashboard en vivo: **https://caldo-netflix-dashboard-alpha.vercel.app**
Encuesta: **https://caldo-netflix-dashboard-alpha.vercel.app/evaluacion**
