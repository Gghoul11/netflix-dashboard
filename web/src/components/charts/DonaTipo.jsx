import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { colores, colorPorTipo } from '../../theme/colores'
import { num, pct } from '../../lib/kpis'
import TooltipOscuro from './TooltipOscuro'

/**
 * KPI 5 → GRÁFICO DE ANILLO (dona): películas vs series.
 * Solo hay 2 categorías, así que cumple la regla de "pastel/anillo con máximo 5 categorías".
 * En el centro se escribe el total; al lado, una leyenda con número y porcentaje.
 */
export default function DonaTipo({ datos }) {
  const total = datos.reduce((s, d) => s + d.total, 0)
  const nombre = { Película: 'Películas', Serie: 'Series' }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos.map((d) => ({ ...d, nombre: nombre[d.nombre] }))}
              dataKey="total"
              nameKey="nombre"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={total && datos.every((d) => d.total) ? 2 : 0}
              stroke={colores.tarjeta}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {datos.map((d) => (
                <Cell key={d.nombre} fill={colorPorTipo[d.nombre]} />
              ))}
            </Pie>
            <Tooltip content={<TooltipOscuro titulo={(_, p) => p[0]?.name} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">{num(total)}</span>
          <span className="text-xs text-suave">títulos</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {datos.map((d) => (
          <li key={d.nombre} className="flex items-center gap-2 whitespace-nowrap">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: colorPorTipo[d.nombre] }} />
            <span className="w-20">{nombre[d.nombre]}</span>
            <span className="font-semibold tabular-nums">{pct(d.pct)}</span>
            <span className="text-suave tabular-nums">({num(d.total)})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
