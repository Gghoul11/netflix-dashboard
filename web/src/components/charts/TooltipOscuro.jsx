import { num } from '../../lib/kpis'

/** Tooltip común para todos los gráficos de Recharts (mismo estilo en todo el dashboard). */
export default function TooltipOscuro({ active, payload, label, titulo }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-borde bg-[#0b0b0b] px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-texto">{titulo ? titulo(label, payload) : label}</p>
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="flex items-center gap-2 text-suave">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: p.color ?? p.payload?.fill }} />
          {p.name}: <span className="font-semibold tabular-nums text-texto">{num(p.value)}</span>
        </p>
      ))}
    </div>
  )
}
