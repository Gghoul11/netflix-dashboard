-- =====================================================================
-- Base de datos del proyecto "Netflix en el mundo" (PostgreSQL / Supabase)
-- Ejecutar completo en Supabase → SQL Editor → Run.
-- =====================================================================

-- 1. Tabla principal: un renglón por título (ya limpio por etl/limpieza.py)
create table if not exists titulos (
  show_id              text primary key,
  tipo                 text not null check (tipo in ('Película', 'Serie')),
  titulo               text not null,
  director             text,
  pais_original        text,
  fecha_agregado       date,
  anio_agregado        int,
  mes_agregado         int,
  anio_estreno         int not null,
  clasificacion        text,
  duracion             text,
  duracion_min         int,
  temporadas           int,
  anios_hasta_netflix  int,
  categorias_originales text,
  descripcion          text,
  atipico_anio         boolean default false,
  atipico_duracion     boolean default false
);

-- 2. Tablas puente: un título puede tener varios países, géneros y directores
create table if not exists paises (
  show_id text references titulos(show_id) on delete cascade,
  pais    text not null,
  iso2    text not null,
  primary key (show_id, iso2)
);

create table if not exists generos (
  show_id text references titulos(show_id) on delete cascade,
  genero  text not null,
  primary key (show_id, genero)
);

create table if not exists directores (
  show_id  text references titulos(show_id) on delete cascade,
  director text not null,
  primary key (show_id, director)
);

-- 3. Vistas con los KPIs (las mismas cuentas que hace el dashboard)
create or replace view kpi_titulos_por_pais as
  select pais, iso2, count(*) as titulos from paises group by pais, iso2 order by titulos desc;

create or replace view kpi_estrenos_por_anio as
  select anio_estreno, tipo, count(*) as titulos from titulos group by anio_estreno, tipo order by anio_estreno;

create or replace view kpi_top_generos as
  select genero, count(*) as titulos from generos group by genero order by titulos desc limit 5;

create or replace view kpi_top_directores as
  select director, count(*) as titulos from directores group by director order by titulos desc limit 5;

create or replace view kpi_peliculas_vs_series as
  select tipo, count(*) as titulos,
         round(100.0 * count(*) / sum(count(*)) over (), 1) as porcentaje
  from titulos group by tipo;

-- 4. Respuestas de la encuesta de evaluación (Fase 4)
create table if not exists encuestas (
  id                 bigint generated always as identity primary key,
  creado             timestamptz not null default now(),
  -- Sección 1 · participante
  edad               int check (edad between 10 and 99),
  genero             text,
  ocupacion          text,
  conoce_tema        int check (conoce_tema between 1 and 5),
  usa_dashboards     int check (usa_dashboards between 1 and 5),
  -- Sección 2 · usabilidad (1 = totalmente en desacuerdo, 5 = totalmente de acuerdo)
  p1_facil           int check (p1_facil between 1 and 5),
  p2_colores         int check (p2_colores between 1 and 5),
  p3_kpi             int check (p3_kpi between 1 and 5),
  p4_graficos        int check (p4_graficos between 1 and 5),
  p5_organizacion    int check (p5_organizacion between 1 and 5),
  p6_textos          int check (p6_textos between 1 and 5),
  p7_interactividad  int check (p7_interactividad between 1 and 5),
  p8_atractivo       int check (p8_atractivo between 1 and 5),
  p9_insights        int check (p9_insights between 1 and 5),
  p10_satisfaccion   int check (p10_satisfaccion between 1 and 5),
  -- Comprensión
  c1_pais            text,
  c2_tipo            text,
  c3_genero          text,
  -- Sección 3 · abiertas
  a1_gusto           text,
  a2_confuso         text,
  a3_mejora          text,
  a4_util            text,
  a5_cambios         text
);

-- 5. Seguridad (Row Level Security)
--    · Los datos de Netflix: cualquiera puede LEER, nadie puede modificar desde la web.
--    · Las encuestas: cualquiera puede ENVIAR una respuesta, pero nadie puede leerlas desde la web
--      (solo el autor, desde el panel de Supabase o con la llave privada).
alter table titulos    enable row level security;
alter table paises     enable row level security;
alter table generos    enable row level security;
alter table directores enable row level security;
alter table encuestas  enable row level security;

drop policy if exists lectura_publica on titulos;
drop policy if exists lectura_publica on paises;
drop policy if exists lectura_publica on generos;
drop policy if exists lectura_publica on directores;
drop policy if exists enviar_encuesta on encuestas;

create policy lectura_publica on titulos    for select to anon using (true);
create policy lectura_publica on paises     for select to anon using (true);
create policy lectura_publica on generos    for select to anon using (true);
create policy lectura_publica on directores for select to anon using (true);
create policy enviar_encuesta on encuestas  for insert to anon with check (true);

-- 6. Permisos del usuario público (anon). Los proyectos nuevos de Supabase no los dan solos.
--    RLS (arriba) decide QUÉ filas; estos GRANT deciden QUÉ acciones están permitidas.
grant usage on schema public to anon;
grant select on titulos, paises, generos, directores to anon;
grant select on kpi_titulos_por_pais, kpi_estrenos_por_anio, kpi_top_generos,
                kpi_top_directores, kpi_peliculas_vs_series to anon;
grant insert on encuestas to anon;   -- solo enviar respuestas, nunca leerlas
