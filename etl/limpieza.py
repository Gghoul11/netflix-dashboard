"""
Limpieza del dataset "Netflix Movies and TV Shows" (Kaggle, shivamb/netflix-shows).

Entrada : data/raw/netflix_titles.csv           (8 807 títulos, 12 columnas)
Salidas : data/clean/titulos.csv                 (1 fila por título, ya limpio)
          data/clean/paises.csv                  (título ↔ país)
          data/clean/generos.csv                 (título ↔ género)
          data/clean/directores.csv              (título ↔ director)
          web/public/data/netflix.json           (copia compacta que lee el dashboard)
          data/clean/reporte_limpieza.json       (qué se corrigió y cuántas filas)
          web/public/data/paises_iso.json        (código ISO numérico por país, para el mapa)

Uso:  .venv/Scripts/python etl/limpieza.py
"""
import json
from pathlib import Path

import pandas as pd
import pycountry

RAIZ = Path(__file__).resolve().parents[1]
RAW = RAIZ / "data" / "raw" / "netflix_titles.csv"
CLEAN = RAIZ / "data" / "clean"
WEB = RAIZ / "web" / "public" / "data"

# ---------------------------------------------------------------------------
# 1. Diccionarios de normalización
# ---------------------------------------------------------------------------

# Netflix usa etiquetas distintas para películas y series ("Dramas" / "TV Dramas").
# Las unimos en un solo género en español. Las etiquetas que describen ORIGEN
# o FORMATO (no género) se excluyen: el país ya se analiza con la columna country.
GENEROS = {
    "Dramas": "Drama", "TV Dramas": "Drama",
    "Comedies": "Comedia", "TV Comedies": "Comedia",
    "Stand-Up Comedy": "Stand-up", "Stand-Up Comedy & Talk Shows": "Stand-up",
    "Documentaries": "Documental", "Docuseries": "Documental", "Science & Nature TV": "Documental",
    "Action & Adventure": "Acción y aventura", "TV Action & Adventure": "Acción y aventura",
    "Independent Movies": "Independiente",
    "Children & Family Movies": "Infantil y familiar", "Kids' TV": "Infantil y familiar",
    "Romantic Movies": "Romance", "Romantic TV Shows": "Romance",
    "Thrillers": "Suspenso", "TV Thrillers": "Suspenso", "TV Mysteries": "Suspenso",
    "Crime TV Shows": "Crimen",
    "Music & Musicals": "Música y musicales",
    "Horror Movies": "Terror", "TV Horror": "Terror",
    "Reality TV": "Reality",
    "Sci-Fi & Fantasy": "Ciencia ficción y fantasía", "TV Sci-Fi & Fantasy": "Ciencia ficción y fantasía",
    "Sports Movies": "Deportes",
    "Anime Series": "Anime", "Anime Features": "Anime",
    "Classic Movies": "Clásicos y de culto", "Classic & Cult TV": "Clásicos y de culto",
    "Cult Movies": "Clásicos y de culto",
    "LGBTQ Movies": "LGBTQ+",
    "Teen TV Shows": "Juvenil",
    "Faith & Spirituality": "Fe y espiritualidad",
}
ETIQUETAS_EXCLUIDAS = {
    "International Movies", "International TV Shows", "British TV Shows",
    "Spanish-Language TV Shows", "Korean TV Shows", "Movies", "TV Shows",
}

# Países históricos o con nombre distinto al estándar ISO.
PAISES_ESPECIALES = {
    "West Germany": "DE", "East Germany": "DE",   # hoy Alemania
    "Soviet Union": "RU", "Russia": "RU",         # hoy Rusia
    "Turkey": "TR", "Palestine": "PS", "Vatican City": "VA",
}


def iso_pais(nombre: str) -> str:
    if nombre in PAISES_ESPECIALES:
        return PAISES_ESPECIALES[nombre]
    return pycountry.countries.lookup(nombre).alpha_2


def separar(valor) -> list[str]:
    """'A, B, ,C' -> ['A', 'B', 'C'] ; NaN -> []"""
    if pd.isna(valor):
        return []
    return [p.strip() for p in str(valor).split(",") if p.strip()]


# ---------------------------------------------------------------------------
# 2. Limpieza
# ---------------------------------------------------------------------------
def main() -> None:
    df = pd.read_csv(RAW, encoding="utf-8")
    rep = {"filas_originales": len(df), "nulos_originales": df.isna().sum().to_dict()}

    # 2.1 Duplicados
    dup = df.duplicated(subset=["title", "type", "release_year"]).sum()
    df = df.drop_duplicates(subset=["title", "type", "release_year"])
    rep["duplicados_eliminados"] = int(dup)

    # 2.2 Error de captura: 3 películas tienen la duración en la columna rating
    mal = df["rating"].str.contains("min", na=False)
    df.loc[mal, "duration"] = df.loc[mal, "rating"]
    df.loc[mal, "rating"] = pd.NA
    rep["rating_con_duracion_corregidos"] = int(mal.sum())

    # 2.3 Nulos en texto
    df["director"] = df["director"].fillna("Desconocido")
    df["cast"] = df["cast"].fillna("Desconocido")
    df["country"] = df["country"].fillna("Desconocido")
    df["rating"] = df["rating"].fillna("Sin clasificación")

    # 2.4 Fechas: "  September 25, 2021" -> 2021-09-25
    df["date_added"] = pd.to_datetime(df["date_added"].str.strip(), format="%B %d, %Y", errors="coerce")
    df["anio_agregado"] = df["date_added"].dt.year.astype("Int64")
    df["mes_agregado"] = df["date_added"].dt.month.astype("Int64")
    rep["sin_fecha_agregado"] = int(df["date_added"].isna().sum())

    # 2.5 Columnas derivadas
    df["tipo"] = df["type"].map({"Movie": "Película", "TV Show": "Serie"})
    df["duracion_min"] = df["duration"].str.extract(r"(\d+) min")[0].astype("Int64")
    df["temporadas"] = df["duration"].str.extract(r"(\d+) Season")[0].astype("Int64")
    df["anios_hasta_netflix"] = (df["anio_agregado"] - df["release_year"]).astype("Int64")

    # 2.6 Valores atípicos (criterio IQR). Se MARCAN pero se conservan: son títulos reales
    #     (ej. un clásico de 1925 o una película de 312 min), no errores de captura.
    def atipico(s: pd.Series) -> pd.Series:
        q1, q3 = s.quantile(0.25), s.quantile(0.75)
        iqr = q3 - q1
        return (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)

    df["atipico_anio"] = atipico(df["release_year"])
    peli = df["tipo"] == "Película"
    df["atipico_duracion"] = False
    df.loc[peli, "atipico_duracion"] = atipico(df.loc[peli, "duracion_min"].astype(float))
    # Un título no puede llegar a Netflix ANTES de estrenarse -> sí es error (se anula la fecha)
    negativo = df["anios_hasta_netflix"] < 0
    rep["fecha_agregado_antes_de_estreno_anuladas"] = int(negativo.sum())
    df.loc[negativo, ["anio_agregado", "mes_agregado", "anios_hasta_netflix"]] = pd.NA
    rep["atipicos_anio_estreno"] = int(df["atipico_anio"].sum())
    rep["atipicos_duracion_pelicula"] = int(df["atipico_duracion"].sum())
    rep["limite_atipico_anio"] = int(df.loc[~df["atipico_anio"], "release_year"].min())

    # 2.7 Campos con varios valores -> tablas puente
    paises, generos, directores = [], [], []
    excluidas = 0
    for r in df.itertuples():
        for p in separar(r.country):
            if p != "Desconocido":
                paises.append((r.show_id, p, iso_pais(p)))
        for g in separar(r.listed_in):
            if g in ETIQUETAS_EXCLUIDAS:
                excluidas += 1
                continue
            generos.append((r.show_id, GENEROS[g]))
        for d in separar(r.director):
            if d != "Desconocido":
                directores.append((r.show_id, d))

    t_paises = pd.DataFrame(paises, columns=["show_id", "pais", "iso2"]).drop_duplicates(["show_id", "iso2"])
    t_generos = pd.DataFrame(generos, columns=["show_id", "genero"]).drop_duplicates()
    t_directores = pd.DataFrame(directores, columns=["show_id", "director"]).drop_duplicates()
    rep["etiquetas_de_origen_excluidas"] = excluidas
    rep["paises_distintos"] = int(t_paises["iso2"].nunique())
    rep["generos_distintos"] = int(t_generos["genero"].nunique())

    # ---------------------------------------------------------------------------
    # 3. Guardar
    # ---------------------------------------------------------------------------
    CLEAN.mkdir(parents=True, exist_ok=True)
    WEB.mkdir(parents=True, exist_ok=True)
    titulos = df[[
        "show_id", "tipo", "title", "director", "country", "date_added", "anio_agregado",
        "mes_agregado", "release_year", "rating", "duration", "duracion_min", "temporadas",
        "anios_hasta_netflix", "listed_in", "description", "atipico_anio", "atipico_duracion",
    ]].rename(columns={"title": "titulo", "release_year": "anio_estreno", "rating": "clasificacion",
                       "duration": "duracion", "listed_in": "categorias_originales",
                       "description": "descripcion", "date_added": "fecha_agregado",
                       "country": "pais_original"})
    titulos.to_csv(CLEAN / "titulos.csv", index=False)
    t_paises.to_csv(CLEAN / "paises.csv", index=False)
    t_generos.to_csv(CLEAN / "generos.csv", index=False)
    t_directores.to_csv(CLEAN / "directores.csv", index=False)

    # Copia compacta para el dashboard (llaves cortas para que pese poco)
    por_id = lambda t, col: t.groupby("show_id")[col].apply(list).to_dict()
    p, g, d = por_id(t_paises, "iso2"), por_id(t_generos, "genero"), por_id(t_directores, "director")
    registros = [{
        "id": r.show_id,
        "t": r.titulo,
        "tipo": r.tipo,
        "anio": int(r.anio_estreno),
        "pais": p.get(r.show_id, []),
        "gen": g.get(r.show_id, []),
        "dir": d.get(r.show_id, []),
    } for r in titulos.itertuples()]
    with open(WEB / "netflix.json", "w", encoding="utf-8") as f:
        json.dump(registros, f, ensure_ascii=False, separators=(",", ":"))

    # Código ISO numérico de cada país: es la llave con la que el mapa encuentra su polígono
    iso_num = {c: pycountry.countries.get(alpha_2=c).numeric for c in sorted(t_paises["iso2"].unique())}
    with open(WEB / "paises_iso.json", "w", encoding="utf-8") as f:
        json.dump(iso_num, f)

    rep["filas_finales"] = len(titulos)
    rep["peliculas"] = int((titulos["tipo"] == "Película").sum())
    rep["series"] = int((titulos["tipo"] == "Serie").sum())
    rep["nulos_originales"] = {k: int(v) for k, v in rep["nulos_originales"].items()}
    for destino in (CLEAN, WEB):  # también se copia al dashboard (página "Acerca de los datos")
        with open(destino / "reporte_limpieza.json", "w", encoding="utf-8") as f:
            json.dump(rep, f, ensure_ascii=False, indent=2)
    print(json.dumps(rep, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
