import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { colores, colorPorTipo } from '../../theme/colores'
import { num } from '../../lib/kpis'
import TooltipOscuro from './TooltipOscuro'

/**
 * KPI 2 → GRÁFICO DE ÁREA APILADA: estrenos por año.
 * Línea/área es el gráfico recomendado para tendencias en el tiempo.
 * Se apilan películas (rojo) y series (azul) para ver el total y la mezcla a la vez.
 */
export default function LineaEstrenos({ filas, tipo }) {
  const series = tipo === 'Todos' ? ['Película', 'Serie'] : [tipo]
  const nombre = { Película: 'Películas', Serie: 'Series' }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={filas} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={colores.borde} />
        <XAxis
          dataKey="anio"
          tick={{ fill: colores.textoSuave, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: colores.borde }}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: colores.textoSuave, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={num}
          width={48}
        />
        <Tooltip
          content={<TooltipOscuro titulo={(anio, p) => `${anio} · ${num(p.reduce((s, x) => s + x.value, 0))} títulos`} />}
          cursor={{ stroke: colores.textoSuave, strokeDasharray: '3 3' }}
        />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="square"
          formatter={(v) => <span style={{ color: colores.texto, fontSize: 12 }}>{v}</span>}
        />
        {series.map((s) => (
          <Area
            key={s}
            type="monotone"
            dataKey={s}
            name={nombre[s]}
            stackId="1"
            stroke={colorPorTipo[s]}
            strokeWidth={2}
            fill={colorPorTipo[s]}
            fillOpacity={0.35}
            activeDot={{ r: 4, stroke: colores.tarjeta, strokeWidth: 2 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}
