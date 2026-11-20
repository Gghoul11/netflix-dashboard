import { useEffect, useState } from 'react'
import cloud from 'd3-cloud'
import { colores } from '../../theme/colores'
import { num } from '../../lib/kpis'

/**
 * KPI 3 (complemento) → NUBE DE PALABRAS de géneros.
 * El tamaño de cada palabra es proporcional a su número de títulos.
 * Los 5 géneros principales van en rojo (los mismos del top 5); el resto en gris.
 * La nube da una vista rápida de TODA la variedad; las barras dan el número exacto.
 */
const ANCHO = 420
const ALTO = 260

export default function NubeGeneros({ generos }) {
  const [palabras, setPalabras] = useState([])
  const [activa, setActiva] = useState(null)

  useEffect(() => {
    if (!generos.length) return

    const max = generos[0].total
    const min = generos[generos.length - 1].total
    const tamano = (n) => (max === min ? 28 : 12 + ((Math.sqrt(n) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min))) * 30)

    const layout = cloud()
      .size([ANCHO, ALTO])
      .words(generos.map((g, i) => ({ text: g.nombre, total: g.total, top: i < 5, size: tamano(g.total) })))
      .padding(3)
      .rotate(0) // sin palabras giradas: se leen mejor
      .font('Inter')
      .fontWeight((d) => (d.top ? 700 : 500))
      .fontSize((d) => d.size)
      .random(() => 0.5) // misma posición cada vez
      .on('end', setPalabras)
    layout.start()
    return () => layout.stop()
  }, [generos])

  if (!generos.length) return <p className="py-8 text-center text-sm text-suave">Sin datos para estos filtros.</p>

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="h-auto w-full" role="img" aria-label="Nube de palabras de géneros">
        <g transform={`translate(${ANCHO / 2},${ALTO / 2})`}>
          {palabras.map((p) => (
            <text
              key={p.text}
              textAnchor="middle"
              transform={`translate(${p.x},${p.y})`}
              fontSize={p.size}
              fontWeight={p.top ? 700 : 500}
              fontFamily="Inter, system-ui, sans-serif"
              fill={p.top ? colores.rojo : colores.textoSuave}
              opacity={activa && activa !== p.text ? 0.4 : 1}
              onMouseEnter={() => setActiva(p.text)}
              onMouseLeave={() => setActiva(null)}
              style={{ cursor: 'default' }}
            >
              <title>{`${p.text}: ${num(p.total)} títulos`}</title>
              {p.text}
            </text>
          ))}
        </g>
      </svg>
      {activa && (
        <p className="absolute right-0 top-0 rounded bg-[#0b0b0b] px-2 py-1 text-xs">
          {activa}: <strong>{num(palabras.find((p) => p.text === activa)?.total ?? 0)}</strong> títulos
        </p>
      )}
    </div>
  )
}
