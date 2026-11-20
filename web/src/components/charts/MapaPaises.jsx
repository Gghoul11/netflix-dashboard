import { useMemo } from 'react'
import { GeoJSON, MapContainer } from 'react-leaflet'
import { feature } from 'topojson-client'
import { colores, colorDelMapa, escalaMapa } from '../../theme/colores'
import { num } from '../../lib/kpis'

/**
 * KPI principal → MAPA DE CALOR (coroplético) de títulos por país.
 * Se usa React-Leaflet (sugerido en la Fase 3). No se cargan teselas (calles, relieve):
 * solo los polígonos de los países, para que el único color en pantalla sea el dato.
 * Clic en un país = filtrar todo el dashboard por ese país.
 */
export default function MapaPaises({ mundo, isoNum, lista, paisSeleccionado, onSeleccionar }) {
  // Polígonos de países (sin la Antártida, que no tiene títulos y ocupa mucho espacio)
  const paises = useMemo(() => {
    const geo = feature(mundo, mundo.objects.countries)
    geo.features = geo.features.filter((f) => f.id !== '010')
    // Rusia y Fiyi cruzan la línea de cambio de fecha (longitud 180°); sin este ajuste
    // Leaflet dibuja una franja horizontal de lado a lado del mapa.
    const correr = (anillo) => anillo.map(([lon, lat]) => [lon < 0 ? lon + 360 : lon, lat])
    for (const f of geo.features) {
      if (f.id !== '643' && f.id !== '242') continue
      const g = f.geometry
      if (g.type === 'Polygon') g.coordinates = g.coordinates.map(correr)
      else g.coordinates = g.coordinates.map((pol) => pol.map(correr))
    }
    return geo
  }, [mundo])

  // ISO numérico → { iso2, nombre, total }
  const porNumero = useMemo(() => {
    const m = new Map()
    for (const p of lista) m.set(isoNum[p.iso2], p)
    return m
  }, [lista, isoNum])

  const estilo = (f) => {
    const dato = porNumero.get(f.id)
    const seleccionado = dato && dato.iso2 === paisSeleccionado
    return {
      fillColor: colorDelMapa(dato?.total),
      fillOpacity: 1,
      color: seleccionado ? '#FFFFFF' : colores.tarjeta,
      weight: seleccionado ? 2 : 0.6,
    }
  }

  const alCrearPais = (f, capa) => {
    const dato = porNumero.get(f.id)
    const texto = dato
      ? `<strong>${dato.nombre}</strong><br/>${num(dato.total)} títulos`
      : `<strong>${f.properties.name}</strong><br/>Sin títulos`
    capa.bindTooltip(texto, { sticky: true, className: 'tooltip-pais' })
    capa.on({
      mouseover: () => capa.setStyle({ color: '#FFFFFF', weight: 1.5 }),
      mouseout: () => capa.setStyle(estilo(f)),
      click: () => dato && onSeleccionar(dato.iso2 === paisSeleccionado ? '' : dato.iso2),
    })
  }

  // La "key" fuerza a redibujar los colores cuando cambian los filtros
  const llave = `${paisSeleccionado}-${lista.length}-${lista[0]?.total ?? 0}-${lista.reduce((s, p) => s + p.total, 0)}`

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-72 flex-1 overflow-hidden rounded-lg">
        <MapContainer
          center={[30, 12]}
          zoom={1.5}
          zoomSnap={0.1}
          minZoom={1}
          maxZoom={6}
          scrollWheelZoom={false}
          worldCopyJump={false}
          maxBounds={[[-70, -200], [90, 200]]}
          attributionControl={false}
          style={{ height: '100%', minHeight: 288, width: '100%' }}
        >
          <GeoJSON key={llave} data={paises} style={estilo} onEachFeature={alCrearPais} />
        </MapContainer>
      </div>

      {/* Leyenda de la escala de color */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-suave" aria-label="Leyenda del mapa">
        <span className="font-medium text-texto">Títulos:</span>
        {escalaMapa.map((r) => (
          <span key={r.desde} className="flex items-center gap-1">
            <span className="inline-block h-3 w-5 rounded-sm" style={{ background: r.color }} />
            {r.hasta === Infinity ? `${num(r.desde)} o más` : `${num(r.desde)}–${num(r.hasta)}`}
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-5 rounded-sm" style={{ background: colores.sinDatos }} />
          sin títulos
        </span>
      </div>
    </div>
  )
}
