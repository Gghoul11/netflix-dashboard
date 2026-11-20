/**
 * Paleta definida en la Fase 2 (docs/fase-2-diseno.md).
 * Es la ÚNICA fuente de colores del proyecto: los gráficos importan este
 * archivo y el CSS usa las mismas variables (src/index.css → @theme).
 */
export const colores = {
  // 4 colores principales
  rojo: '#E50914', // Películas, KPI principal y énfasis
  azul: '#3B82F6', // Series
  fondo: '#141414', // Fondo general
  texto: '#E5E5E5', // Texto principal

  // Apoyo (derivados de los principales)
  tarjeta: '#1F1F1F',
  borde: '#2E2E2E',
  textoSuave: '#A3A3A3',
  sinDatos: '#2A2A2A',
  barraGris: '#5C5C5C', // barras que no son el líder en los rankings
}

/** Color fijo por tipo de contenido: nunca cambia aunque se filtre. */
export const colorPorTipo = {
  Película: colores.rojo,
  Serie: colores.azul,
}

/**
 * Escala secuencial de rojos para el mapa de calor (de menos a más títulos).
 * Sobre fondo oscuro, "más títulos" = rojo más brillante.
 */
export const escalaMapa = [
  { desde: 1, hasta: 9, color: '#4A1316' },
  { desde: 10, hasta: 49, color: '#7A1419' },
  { desde: 50, hasta: 199, color: '#A8111A' },
  { desde: 200, hasta: 999, color: '#E50914' },
  { desde: 1000, hasta: Infinity, color: '#FF6B6F' },
]

export function colorDelMapa(cantidad) {
  if (!cantidad) return colores.sinDatos
  return escalaMapa.find((r) => cantidad >= r.desde && cantidad <= r.hasta).color
}
