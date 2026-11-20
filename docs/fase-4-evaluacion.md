# Fase 4 · Evaluación del dashboard

**Proyecto:** Netflix en el mundo · **Autor:** Aldo Arceo Beltrán

> **Propósito:** comprobar con personas reales si el dashboard es **claro, fácil de usar, pertinente y útil**. No basta con que funcione: tiene que entenderse sin que nadie lo explique.

---

## 1. Audiencia de la evaluación

Participaron **9 personas** (el mínimo eran 3), de perfiles variados:
- **Edades:** de 20 a 55 años.
- **Género:** 5 mujeres, 3 hombres y 1 persona que prefirió no decirlo.
- **Ocupaciones distintas:** solo una es estudiante; el resto son público general, que es justo la audiencia secundaria definida en la Fase 1.

| # | Edad | Ocupación | Conoce Netflix (1–5) | Experiencia con dashboards (1–5) |
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

La experiencia con dashboards va de 2 a 5: hubo personas que casi nunca usan este tipo de herramientas y otras que sí. Eso hace la prueba más exigente.

---

## 2. Técnicas de evaluación elegidas

| Técnica | Por qué |
|---|---|
| **Cuestionario estructurado (escala 1–5)** | Las 10 afirmaciones de las indicaciones; dan **promedios comparables** |
| **Preguntas de comprensión** | 3 preguntas con respuesta correcta, para comprobar si la persona **entendió los datos** y no solo si le gustó el diseño |
| **Preguntas abiertas** | Las 5 preguntas sugeridas; recogen opiniones que los números no captan |

La encuesta está **dentro del propio dashboard** (pestaña **Evaluación**) y las respuestas se guardan en la base de datos (tabla `encuestas` en Supabase). Los resultados se calcularon con el script `etl/analizar_encuesta.py`.

---

## 3. Instrumento (encuesta)

![Encuesta](img/evaluacion.png)

**Sección 1: Datos del participante**
- Edad, género (opcional) y ocupación.
- Conocimiento del catálogo de Netflix (1–5).
- Experiencia con dashboards (1–5).

**Sección 2: Usabilidad** (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo). Son las 10 afirmaciones de las indicaciones:
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

**Sección 3: Comprensión**
- ¿Qué país tiene más títulos?
- ¿Hay más películas o series?
- ¿Cuál es el género más común?

**Sección 4: Preguntas abiertas**
- ¿Qué te gustó más?
- ¿Qué fue confuso?
- ¿Qué mejorarías?
- ¿Qué KPI o gráfico fue más útil?
- ¿Agregarías o quitarías algo?

---

## 4. Procedimiento

1. A cada participante se le compartió el enlace con una sola indicación: *"es un dashboard sobre el catálogo de Netflix"*. **No se explicó cómo usarlo.**
2. Exploró el dashboard libremente.
3. Después abrió la pestaña **Evaluación** y respondió la encuesta.
4. Las respuestas se analizaron con promedios por pregunta, % de aciertos y patrones en los comentarios.

---

## 5. Resultados

### 5.1 Promedio por afirmación

![Promedios](img/encuesta-promedios.png)

| Afirmación | Promedio |
|---|---|
| El dashboard es fácil de entender | **4.67** |
| Puedo identificar fácilmente el KPI principal | **4.67** |
| Los gráficos representan correctamente los datos | **4.67** |
| En general, la experiencia fue satisfactoria | **4.67** |
| Los colores ayudan a interpretar la información | 4.56 |
| La información está bien organizada | 4.56 |
| Me permite obtener conclusiones | 4.56 |
| Los textos, títulos y etiquetas son claros | 4.44 |
| La interactividad es intuitiva | 4.44 |
| Es visualmente atractivo | 4.33 |
| **Promedio general** | **4.56 / 5** |

**Las 10 afirmaciones superaron la meta de 4.** No hubo ninguna debilidad (promedio menor de 3.5).

### 5.2 Comprensión

| Pregunta | Respuesta correcta | Aciertos |
|---|---|---|
| ¿Qué país tiene más títulos? | Estados Unidos | **9 de 9 (100%)** |
| ¿Más películas o series? | Películas | 6 de 9 (67%) |
| ¿Género más común? | Drama | 6 de 9 (67%) |

En las dos preguntas con 67%, casi todos los errores fueron **"No lo sé"** (2 en cada pregunta), no respuestas equivocadas. Solo una persona eligió una opción incorrecta en cada pregunta: "Casi igual" en la de películas o series y "Comedia" en la de géneros.

### 5.3 Respuestas abiertas (patrones)

| Pregunta | Lo que más se repitió |
|---|---|
| ¿Qué te gustó más? | **El mapa** (2 menciones) y que es **claro y fácil de entender** (4 menciones) |
| ¿Qué fue confuso? | **6 de 8 respondieron "ninguna"**. Hubo 2 comentarios: la parte de géneros y "ver el contenido de cada país" |
| ¿Qué mejorarías? | 4 personas dijeron **"nada"**. Otras 4 mencionaron el **diseño o los colores**: "más llamativos", "menos rojo" |
| ¿KPI o gráfico más útil? | **El mapa** (3 menciones), "todos" (2), los géneros (1) |
| ¿Agregarías algo? | La mayoría, nada. Ideas: **"qué género se ve más en qué país"** y **"las películas y series más vistas"** |

Una persona comentó: *"me gustó que se pareciera a la aplicación de Netflix"*. Esto confirma la decisión de paleta de la Fase 2.

---

## 6. Análisis e interpretación

| Aspecto | Resultado | Interpretación |
|---|---|---|
| **Usabilidad** | Fácil de entender 4.67; interactividad 4.44 | Se usa sin explicación previa, incluso por personas con poca experiencia en dashboards |
| **Comprensión** | 100% acierta el país líder | El **KPI principal** se entiende perfectamente. Los KPIs de apoyo se entienden un poco menos |
| **Pertinencia de los KPIs** | KPI principal identificable 4.67; el mapa fue el gráfico más útil | El KPI principal fue bien elegido: es lo primero que se ve y lo que más se recuerda |
| **Estética** | Colores 4.56; atractivo 4.33 (la más baja) | Los colores ayudan a leer, pero una parte de los usuarios siente que hay **demasiado rojo** |
| **Interactividad** | 4.44 | Funciona. Una persona dijo que le costó "ver el contenido de cada país", así que el clic en el mapa podría ser más evidente |
| **Impacto y utilidad** | Conclusiones 4.56; satisfacción 4.67 | El dashboard cumple su propósito: los usuarios sacan conclusiones reales |

---

## 7. Hallazgos

### ✅ Aspectos que funcionan bien
- **El KPI principal se entiende:** todos identificaron el país con más títulos (100% de aciertos, 4.67 de promedio).
- **El mapa** es el elemento favorito y el más útil.
- **Claridad general:** "fácil de entender" y "satisfacción" obtuvieron 4.67, el promedio más alto.
- **Identidad visual:** la semejanza con Netflix se percibe como algo positivo.

### ⚠️ Problemas detectados
- **Atractivo visual (4.33)** es lo más bajo. Algunos sienten que hay **demasiado rojo** o piden un diseño más llamativo.
- **KPIs secundarios** menos recordados: 33% no supo o falló en "películas vs series" y en "género más común", aunque los dos aparecen en pantalla.
- **Filtrar por país** no es evidente para todos: una persona no notó que podía hacer clic en el mapa.

### 💡 Recomendaciones de mejora
1. **Equilibrar el color:** usar el rojo solo para el KPI principal y el primer lugar, y tonos neutros en el resto.
2. **Destacar más los KPIs de apoyo:** por ejemplo, poner el porcentaje de películas directamente en una tarjeta de arriba.
3. **Hacer más visible el clic en el mapa:** un mensaje como "👆 haz clic en un país" encima del mapa.
4. **Nuevas vistas sugeridas por los usuarios:** "géneros por país" y títulos más populares. Para lo segundo haría falta otro dataset, porque este no incluye vistas.

### Cambios aplicados
Se decidió **conservar el dashboard tal como fue evaluado**, porque todas las afirmaciones superaron la meta de 4. Las recomendaciones quedan documentadas como **trabajo futuro** para una siguiente versión.

---

## 8. Conclusión

El dashboard **cumple su propósito analítico**:
- Obtuvo **4.56 de 5** en promedio, con **9 participantes** de perfiles distintos.
- El **100%** identificó correctamente el hallazgo principal: Estados Unidos concentra la producción del catálogo.
- Los usuarios destacaron la **claridad** y el **mapa**.
- Las mejoras propuestas son de **estilo**: menos rojo, KPIs de apoyo más visibles. No son de fondo.

Esta fase mostró que el valor de un dashboard se mide en **si la gente lo entiende**, no solo en si funciona. Por eso, además de preguntar "¿te gustó?", se comprobó con preguntas de comprensión que los datos sí se transmitieron.

---

## Repositorio

El proyecto está en el repositorio: **https://github.com/Gghoul11/netflix-dashboard**
Dashboard en vivo: **https://caldo-netflix-dashboard-alpha.vercel.app**
Encuesta: **https://caldo-netflix-dashboard-alpha.vercel.app/evaluacion**
