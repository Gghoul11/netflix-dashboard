/**
 * Cálculo de TODOS los KPIs del dashboard.
 * Son funciones puras: reciben la lista de títulos (ya filtrada) y devuelven números.
 * Cada título tiene la forma: { id, t, tipo, anio, pais: ['US'], gen: ['Drama'], dir: ['...'] }
 */

const nombresPais = new Intl.DisplayNames(['es'], { type: 'region' })
export const nombrePais = (iso2) => nombresPais.of(iso2) ?? iso2

/** Aplica los filtros de la barra superior. */
export function filtrar(titulos, { tipo, desde, hasta, pais }) {
  return titulos.filter(
    (x) =>
      (tipo === 'Todos' || x.tipo === tipo) &&
      x.anio >= desde &&
      x.anio <= hasta &&
      (!pais || x.pais.includes(pais)),
  )
}

/** Cuenta cuántos títulos tiene cada valor de un campo con varios valores (pais, gen, dir). */
function contar(titulos, campo) {
  const conteo = new Map()
  for (const x of titulos) for (const v of x[campo]) conteo.set(v, (conteo.get(v) ?? 0) + 1)
  return [...conteo.entries()].map(([nombre, total]) => ({ nombre, total })).sort((a, b) => b.total - a.total)
}

/* ---------- KPI PRINCIPAL: número de títulos por país ---------- */
export function titulosPorPais(titulos) {
  const lista = contar(titulos, 'pais').map((p) => ({ ...p, iso2: p.nombre, nombre: nombrePais(p.nombre) }))
  const conPais = titulos.filter((x) => x.pais.length > 0).length
  const lider = lista[0]
  return {
    lista, // [{ iso2:'US', nombre:'Estados Unidos', total:3690 }, ...]
    paisesConTitulos: lista.length,
    lider,
    participacionLider: lider ? lider.total / conPais : 0, // % de los títulos con país conocido
    conPais, // títulos que tienen al menos un país
    sinPais: titulos.length - conPais,
  }
}

/* ---------- KPI 2: evolución de estrenos por año ---------- */
export function estrenosPorAnio(titulos, desde, hasta) {
  const filas = []
  for (let anio = desde; anio <= hasta; anio++) filas.push({ anio, Película: 0, Serie: 0, total: 0 })
  for (const x of titulos) {
    const f = filas[x.anio - desde]
    if (!f) continue
    f[x.tipo]++
    f.total++
  }
  const pico = filas.reduce((max, f) => (f.total > max.total ? f : max), filas[0] ?? { anio: '-', total: 0 })
  return { filas, pico }
}

/* ---------- KPI 3: top 5 géneros ---------- */
export const topGeneros = (titulos, n = 5) => contar(titulos, 'gen').slice(0, n)
export const todosLosGeneros = (titulos) => contar(titulos, 'gen')

/* ---------- KPI 4: top 5 directores ---------- */
export const topDirectores = (titulos, n = 5) => contar(titulos, 'dir').slice(0, n)

/* ---------- KPI 5: películas vs series ---------- */
export function peliculasVsSeries(titulos) {
  const peliculas = titulos.filter((x) => x.tipo === 'Película').length
  const series = titulos.length - peliculas
  return [
    { nombre: 'Película', total: peliculas, pct: titulos.length ? peliculas / titulos.length : 0 },
    { nombre: 'Serie', total: series, pct: titulos.length ? series / titulos.length : 0 },
  ]
}

/* ---------- Formato ---------- */
export const num = (n) => new Intl.NumberFormat('es-MX').format(n)
export const pct = (p) => `${Math.round(p * 100)}%`

/** "1 título" / "3 títulos" */
export const titulos = (n) => `${num(n)} ${n === 1 ? 'título' : 'títulos'}`
