import { num, pct } from '../../lib/kpis'

/**
 * KPI PRINCIPAL (Nivel 1): número de títulos por país.
 * Es la tarjeta más grande y la única con borde rojo, para que sea lo primero que se ve.
 */
export default function KpiPrincipal({ datos, paisSeleccionado }) {
  const { paisesConTitulos } = datos
  // Si el usuario eligió un país, la tarjeta muestra ese país; si no, el país líder.
  const posicion = paisSeleccionado ? datos.lista.findIndex((p) => p.iso2 === paisSeleccionado) : 0
  const lider = datos.lista[posicion]
  const { conPais } = datos
  const participacionLider = lider && conPais ? lider.total / conPais : 0
  return (
    <article className="flex flex-col justify-between rounded-xl border-2 border-rojo bg-tarjeta p-5 sm:col-span-2 lg:col-span-1 lg:row-span-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-rojo">KPI principal · Títulos por país</p>
      {lider ? (
        <>
          <div className="mt-2">
            <p className="text-sm text-suave">
              {posicion === 0 ? 'País con más títulos' : `País seleccionado · lugar #${posicion + 1}`}
            </p>
            <p className="text-3xl font-extrabold leading-tight">{lider.nombre}</p>
            <p className="mt-1 text-5xl font-extrabold tabular-nums text-texto">{num(lider.total)}</p>
            <p className="text-sm text-suave">títulos</p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-borde pt-3 text-sm">
            <div>
              <dt className="text-suave">Del total con país</dt>
              <dd className="text-xl font-bold tabular-nums">{pct(participacionLider)}</dd>
            </div>
            <div>
              <dt className="text-suave">Países con títulos</dt>
              <dd className="text-xl font-bold tabular-nums">{num(paisesConTitulos)}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="mt-4 text-suave">Sin títulos con país para estos filtros.</p>
      )}
    </article>
  )
}
