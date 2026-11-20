"""
FASE 4 · Análisis de las respuestas de la encuesta (tabla `encuestas` en Supabase).

Calcula:
  1. Promedio de cada una de las 10 afirmaciones (escala 1–5)
  2. Fortalezas (promedio >= 4) y debilidades (promedio < 3.5)
  3. % de aciertos en las preguntas de comprensión
  4. Lista de respuestas abiertas, agrupadas por pregunta

Salidas:
  docs/img/encuesta-promedios.png     (gráfica de barras con los promedios)
  docs/resultados-encuesta.md         (tablas listas para pegar en el documento de la Fase 4)
  data/encuestas.csv                  (respaldo de las respuestas)

Uso:  .venv/Scripts/python etl/analizar_encuesta.py
"""
import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import psycopg
from dotenv import load_dotenv

RAIZ = Path(__file__).resolve().parents[1]
load_dotenv(RAIZ / ".env")

AFIRMACIONES = {
    "p1_facil": "El dashboard es fácil de entender",
    "p2_colores": "Los colores ayudan a interpretar",
    "p3_kpi": "Identifico fácilmente el KPI principal",
    "p4_graficos": "Los gráficos representan bien los datos",
    "p5_organizacion": "La información está bien organizada",
    "p6_textos": "Textos, títulos y etiquetas claros",
    "p7_interactividad": "La interactividad es intuitiva",
    "p8_atractivo": "Es visualmente atractivo",
    "p9_insights": "Permite obtener conclusiones",
    "p10_satisfaccion": "Experiencia satisfactoria en general",
}
CORRECTAS = {"c1_pais": "Estados Unidos", "c2_tipo": "Películas", "c3_genero": "Drama"}
ABIERTAS = {
    "a1_gusto": "¿Qué te gustó más?",
    "a2_confuso": "¿Qué fue confuso?",
    "a3_mejora": "¿Qué mejorarías?",
    "a4_util": "¿Qué KPI o gráfico fue más útil?",
    "a5_cambios": "¿Agregarías o quitarías algo?",
}


def main() -> None:
    with psycopg.connect(os.environ["DATABASE_URL"]) as con:
        df = pd.read_sql("select * from encuestas order by creado", con)
    df.to_csv(RAIZ / "data" / "encuestas.csv", index=False)
    n = len(df)
    print(f"Respuestas: {n}")
    if n == 0:
        return

    # 1. Promedios
    prom = df[list(AFIRMACIONES)].mean().rename(index=AFIRMACIONES).round(2)
    general = round(prom.mean(), 2)

    # 2. Gráfica (misma paleta del dashboard: rojo = fortaleza, gris = mejorable)
    fig, ax = plt.subplots(figsize=(9, 5), dpi=150)
    orden = prom.sort_values()
    colores = ["#E50914" if v >= 4 else "#9A9A9A" for v in orden]
    ax.barh(orden.index, orden.values, color=colores)
    for i, v in enumerate(orden.values):
        ax.text(v + 0.05, i, f"{v:.2f}", va="center", fontsize=9)
    ax.set_xlim(0, 5.4)
    ax.axvline(4, color="#3B82F6", ls="--", lw=1)
    ax.text(4.02, len(orden) - 0.4, "meta: 4", color="#3B82F6", fontsize=8)
    ax.set_xlabel("Promedio (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo)")
    ax.set_title(f"Evaluación del dashboard · {n} participantes · promedio general {general}", fontsize=11)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(RAIZ / "docs" / "img" / "encuesta-promedios.png")

    # 3. Comprensión
    aciertos = {k: round((df[k] == v).mean() * 100) for k, v in CORRECTAS.items()}

    # 4. Reporte en Markdown
    lineas = [f"# Resultados de la encuesta ({n} participantes)\n", "## Participantes\n",
              "| # | Edad | Ocupación | Conoce Netflix (1–5) | Experiencia con dashboards (1–5) |", "|---|---|---|---|---|"]
    for i, r in enumerate(df.itertuples(), 1):
        lineas.append(f"| {i} | {r.edad} | {r.ocupacion} | {r.conoce_tema} | {r.usa_dashboards} |")
    lineas += ["\n## Promedio por afirmación\n", "| Afirmación | Promedio | Lectura |", "|---|---|---|"]
    for k, v in prom.items():
        lectura = "Fortaleza" if v >= 4 else ("Debilidad" if v < 3.5 else "Aceptable")
        lineas.append(f"| {k} | {v:.2f} | {lectura} |")
    lineas.append(f"| **Promedio general** | **{general:.2f}** | |")
    lineas += ["\n## Comprensión (respuestas correctas)\n", "| Pregunta | Correcta | % aciertos |", "|---|---|---|",
               f"| País con más títulos | Estados Unidos | {aciertos['c1_pais']}% |",
               f"| ¿Más películas o series? | Películas | {aciertos['c2_tipo']}% |",
               f"| Género más común | Drama | {aciertos['c3_genero']}% |"]
    lineas.append("\n## Respuestas abiertas\n")
    for k, titulo in ABIERTAS.items():
        lineas.append(f"### {titulo}\n")
        for t in df[k].dropna():
            if str(t).strip():
                lineas.append(f"- {str(t).strip()}")
        lineas.append("")
    (RAIZ / "docs" / "resultados-encuesta.md").write_text("\n".join(lineas), encoding="utf-8")
    print(prom.to_string())
    print("Comprensión:", aciertos)
    print("Listo: docs/resultados-encuesta.md y docs/img/encuesta-promedios.png")


if __name__ == "__main__":
    main()
