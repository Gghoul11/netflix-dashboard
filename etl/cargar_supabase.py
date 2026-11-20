"""
Carga los CSV limpios (data/clean/) a la base de datos PostgreSQL de Supabase.

Requisitos:
  1. Haber corrido etl/limpieza.py
  2. Haber ejecutado database/schema.sql en Supabase (SQL Editor)
  3. Archivo .env en la raíz con:  DATABASE_URL=postgresql://postgres.xxxx:CONTRASEÑA@...pooler.supabase.com:5432/postgres
     (Supabase → Connect → Session pooler)

Uso:  .venv/Scripts/python etl/cargar_supabase.py
"""
import os
from pathlib import Path

import pandas as pd
import psycopg
from dotenv import load_dotenv

RAIZ = Path(__file__).resolve().parents[1]
CLEAN = RAIZ / "data" / "clean"
load_dotenv(RAIZ / ".env")

# Orden de carga: primero la tabla principal, luego las que dependen de ella
TABLAS = ["titulos", "paises", "generos", "directores"]


def main() -> None:
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise SystemExit("Falta DATABASE_URL en el archivo .env")

    with psycopg.connect(url) as con, con.cursor() as cur:
        cur.execute("truncate directores, generos, paises, titulos")
        for tabla in TABLAS:
            # En las tablas puente no hay vacíos; así el código de Namibia ("NA") no se lee como nulo
            df = pd.read_csv(CLEAN / f"{tabla}.csv", keep_default_na=(tabla == "titulos"), dtype=str)
            df = df.astype(object).where(df.notna(), None)
            columnas = ", ".join(df.columns)
            with cur.copy(f"copy {tabla} ({columnas}) from stdin") as copia:
                for fila in df.itertuples(index=False):
                    copia.write_row(fila)
            print(f"{tabla:<11} {len(df):>6} filas cargadas")

        # Verificación rápida con las vistas de KPIs
        cur.execute("select pais, titulos from kpi_titulos_por_pais limit 3")
        print("Top 3 países:", cur.fetchall())
        cur.execute("select tipo, titulos, porcentaje from kpi_peliculas_vs_series")
        print("Películas vs series:", cur.fetchall())


if __name__ == "__main__":
    main()
