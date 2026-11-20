# Fase 4 · Evaluación del dashboard

**Proyecto:** Netflix en el mundo · **Autor:** Aldo Arceo Beltrán

> **Objetivo:** comprobar con personas reales si el dashboard se entiende, es fácil de usar y sirve para sacar conclusiones.

---

## 1. ¿Cómo se evaluó?

- **Participantes:** 9 personas de entre 20 y 55 años, con distintas ocupaciones y experiencia con dashboards.
- **Técnica:** encuesta dentro del propio dashboard (pestaña **Evaluación**). Las respuestas se guardaron en la base de datos (Supabase).
- **Procedimiento:**
  1. A cada persona solo se le dijo que era *"un dashboard sobre el catálogo de Netflix"*, sin explicarle cómo usarlo.
  2. Exploró libremente.
  3. Después contestó la encuesta.
- **La encuesta tenía 4 partes:**
  1. Datos del participante.
  2. 10 afirmaciones calificadas del 1 al 5 (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo).
  3. 3 preguntas para comprobar si entendió los datos.
  4. 5 preguntas abiertas.

![Encuesta](img/evaluacion.png)

---

## 2. Participantes

| # | Edad | Ocupación | ¿Conoce Netflix? (1–5) | ¿Usa dashboards? (1–5) |
|---|---|---|---|---|
| 1 | 24 | Emprendedora | 4 | 4 |
| 2 | 55 | Ventas | 3 | 3 |
| 3 | 20 | Estudiante | 3 | 4 |
| 4 | 27 | Chofer | 3 | 2 |
| 5 | 26 | Trabajadora | 2 | 4 |
| 6 | 55 | Ama de casa | 3 | 3 |
| 7 | 23 | Cirujano dentista | 4 | 5 |
| 8 | 55 | Supervisor | 4 | 2 |
| 9 | 37 | Negocio propio | 3 | 4 |

---

## 3. Resultados

### Calificación por afirmación

![Promedios](img/encuesta-promedios.png)

| Afirmación | Promedio |
|---|---|
| El dashboard es fácil de entender | 4.67 |
| Puedo identificar fácilmente el KPI principal | 4.67 |
| Los gráficos representan correctamente los datos | 4.67 |
| La experiencia fue satisfactoria | 4.67 |
| Los colores ayudan a interpretar | 4.56 |
| La información está bien organizada | 4.56 |
| Me permite sacar conclusiones | 4.56 |
| Textos y etiquetas claros | 4.44 |
| Los filtros y botones son intuitivos | 4.44 |
| Es visualmente atractivo | 4.33 |
| **Promedio general** | **4.56 de 5** |

✅ **Las 10 afirmaciones superaron la meta de 4.**

### ¿Entendieron los datos?

| Pregunta | Respuesta correcta | Acertaron |
|---|---|---|
| ¿Qué país tiene más títulos? | Estados Unidos | **9 de 9 (100%)** |
| ¿Hay más películas o series? | Películas | 6 de 9 (67%) |
| ¿Cuál es el género más común? | Drama | 6 de 9 (67%) |

En las dos últimas preguntas, la mayoría de quienes no acertaron respondió *"No lo sé"*; casi nadie eligió una respuesta equivocada.

### Lo que dijeron (preguntas abiertas)

| Pregunta | Respuestas más comunes |
|---|---|
| ¿Qué te gustó más? | Que es **claro y fácil de entender**, y **el mapa** |
| ¿Qué fue confuso? | 6 de 8 dijeron **"nada"**. A uno le costó la parte de géneros |
| ¿Qué mejorarías? | La mitad, **nada**. La otra mitad, el **diseño o los colores** ("menos rojo", "más llamativos") |
| ¿Qué fue más útil? | **El mapa** |
| ¿Agregarías algo? | Casi todos, nada. Ideas: **"qué género se ve más en cada país"** y "las películas más vistas" |

> *"Me gustó que se pareciera a la aplicación de Netflix."* (participante 1)

---

## 4. Conclusiones

### ✅ Lo que funciona bien
- **El KPI principal se entiende:** el 100% supo qué país tiene más títulos.
- **El mapa** fue lo que más gustó y lo más útil.
- El dashboard es **fácil de entender** (4.67) aunque nadie lo explicó antes.

### ⚠️ Lo que se puede mejorar
- **El atractivo visual** fue lo más bajo (4.33): algunos sienten que hay **demasiado rojo**.
- **Los KPIs de apoyo** (películas vs series, género más común) se recuerdan menos que el principal.

### 💡 Recomendaciones para una siguiente versión
1. Usar menos rojo y dejarlo solo para lo más importante.
2. Hacer más visibles los KPIs de apoyo.
3. Agregar una vista de **géneros por país**, que pidieron los usuarios.

**Decisión:** como todas las calificaciones superaron la meta, el dashboard **se conservó tal como se evaluó**. Las mejoras quedan como trabajo futuro.

### Conclusión final
El dashboard **cumple su objetivo**:
- Las personas lo entienden sin ayuda.
- Identifican el hallazgo principal: Estados Unidos concentra el catálogo de Netflix.
- Lo califican con **4.56 de 5**.

Las mejoras propuestas son de estilo, no de fondo.

---

**Repositorio:** https://github.com/Gghoul11/netflix-dashboard
**Dashboard en vivo:** https://caldo-netflix-dashboard-alpha.vercel.app
