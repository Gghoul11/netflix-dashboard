import { nombrePais } from '../../lib/kpis'

/**
 * Barra de filtros: una sola fila arriba de todo. Cualquier cambio recalcula
 * todos los KPIs y gráficos. El país también se puede elegir haciendo clic en el mapa.
 */
export default function Filtros({ filtros, setFiltros, anios, paises, valoresIniciales }) {
  const cambiar = (campo) => (e) => {
    const valor = campo === 'desde' || campo === 'hasta' ? Number(e.target.value) : e.target.value
    setFiltros((f) => ({ ...f, [campo]: valor }))
  }
  const hayFiltros = JSON.stringify(filtros) !== JSON.stringify(valoresIniciales)

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-borde bg-tarjeta px-4 py-3 text-sm">
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-1 text-xs font-medium text-suave">Tipo de contenido</legend>
        <div className="flex overflow-hidden rounded-md border border-borde">
          {['Todos', 'Película', 'Serie'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFiltros((f) => ({ ...f, tipo: t }))}
              className={`px-3 py-1.5 ${filtros.tipo === t ? 'bg-rojo font-semibold text-white' : 'text-suave hover:text-texto'}`}
            >
              {t === 'Todos' ? 'Todos' : t === 'Película' ? 'Películas' : 'Series'}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-suave">Estrenados desde</span>
        <select value={filtros.desde} onChange={cambiar('desde')} className="px-2 py-1.5">
          {anios.filter((a) => a <= filtros.hasta).map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-suave">hasta</span>
        <select value={filtros.hasta} onChange={cambiar('hasta')} className="px-2 py-1.5">
          {anios.filter((a) => a >= filtros.desde).map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-suave">País</span>
        <select value={filtros.pais} onChange={cambiar('pais')} className="min-w-44 px-2 py-1.5">
          <option value="">Todos los países</option>
          {paises.map((p) => (
            <option key={p} value={p}>
              {nombrePais(p)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => setFiltros(valoresIniciales)}
        disabled={!hayFiltros}
        className="ml-auto rounded-md border border-borde px-3 py-1.5 text-suave hover:text-texto disabled:opacity-40"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
