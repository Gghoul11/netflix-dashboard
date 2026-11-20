/** KPI secundario (Nivel 2-3): etiqueta, valor grande y una línea de contexto. */
export default function KpiTarjeta({ etiqueta, valor, detalle, color }) {
  return (
    <article className="rounded-xl border border-borde bg-tarjeta p-4">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-suave">
        {color && <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color }} />}
        {etiqueta}
      </p>
      <p className="mt-1 truncate text-2xl font-bold tabular-nums" title={String(valor)}>
        {valor}
      </p>
      {detalle && <p className="mt-0.5 text-sm text-suave">{detalle}</p>}
    </article>
  )
}
