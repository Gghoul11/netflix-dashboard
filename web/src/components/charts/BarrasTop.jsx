import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { colores } from '../../theme/colores'
import { num } from '../../lib/kpis'
import TooltipOscuro from './TooltipOscuro'

/**
 * Barras HORIZONTALES para rankings (top países, top 5 géneros, top 5 directores).
 * Horizontales porque los nombres son largos y así se leen sin girar el texto.
 * Cada barra lleva su valor escrito al final: no hace falta un eje numérico.
 * Color: el primer lugar va en ROJO (énfasis) y el resto en gris, así el líder salta a la vista.
 * Si hay un país seleccionado (`seleccionado`), ese es el que va en rojo.
 */
export default function BarrasTop({ datos, etiqueta = 'Títulos', seleccionado, onClic, alto }) {
  if (!datos.length) return <p className="py-8 text-center text-sm text-suave">Sin datos para estos filtros.</p>

  return (
    <ResponsiveContainer width="100%" height={alto ?? datos.length * 36 + 8}>
      <BarChart data={datos} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }} barCategoryGap={6}>
        <XAxis type="number" hide domain={[0, 'dataMax']} />
        <YAxis
          type="category"
          dataKey="nombre"
          width={150}
          tickLine={false}
          axisLine={false}
          tick={{ fill: colores.texto, fontSize: 12 }}
        />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={<TooltipOscuro />} />
        <Bar
          dataKey="total"
          name={etiqueta}
          radius={[0, 4, 4, 0]}
          onClick={onClic ? (d) => onClic(d.payload ?? d) : undefined}
          style={onClic ? { cursor: 'pointer' } : undefined}
        >
          {datos.map((d, i) => {
            const destacada = seleccionado ? d.iso2 === seleccionado : i === 0
            return <Cell key={d.nombre} fill={destacada ? colores.rojo : colores.barraGris} />
          })}
          <LabelList dataKey="total" position="right" formatter={num} fill={colores.texto} fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
