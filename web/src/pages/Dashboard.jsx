import { useMemo, useState } from 'react'
import Filtros from '../components/layout/Filtros'
import KpiPrincipal from '../components/kpis/KpiPrincipal'
import KpiTarjeta from '../components/kpis/KpiTarjeta'
import Tarjeta from '../components/ui/Tarjeta'
import MapaPaises from '../components/charts/MapaPaises'
import BarrasTop from '../components/charts/BarrasTop'
import LineaEstrenos from '../components/charts/LineaEstrenos'
import DonaTipo from '../components/charts/DonaTipo'
import NubeGeneros from '../components/charts/NubeGeneros'
import {
  estrenosPorAnio,
  filtrar,
  num,
  nombrePais,
  peliculasVsSeries,
  titulosPorPais,
  titulos as nTitulos,
  todosLosGeneros,
  topDirectores,
  topGeneros,
} from '../lib/kpis'

/**
 * Página principal. La cuadrícula sigue el wireframe de la Fase 2 (3 columnas):
 *
 *  ┌──────────────┬──────────────┬──────────────┐
 *  │ KPI PRINCIPAL│ KPI total    │ KPI año pico │   Nivel 1 + KPIs
 *  │ (2 filas)    │ KPI género #1│ KPI director │
 *  ├──────────────┴──────────────┼──────────────┤
 *  │ MAPA de calor por país      │ Top 10 países│   Nivel 2
 *  ├─────────────────────────────┼──────────────┤
 *  │ Estrenos por año (área)     │ Dona tipo    │   Nivel 2
 *  ├──────────────┬──────────────┼──────────────┤
 *  │ Top 5 géneros│ Nube géneros │ Top 5 direct.│   Nivel 3
 *  └──────────────┴──────────────┴──────────────┘
 */
export default function Dashboard({ titulos, isoNum, mundo }) {
  // Rango de años disponible en los datos
  const anios = useMemo(() => {
    const min = Math.min(...titulos.map((x) => x.anio))
    const max = Math.max(...titulos.map((x) => x.anio))
    return Array.from({ length: max - min + 1 }, (_, i) => min + i)
  }, [titulos])
  const iniciales = useMemo(
    () => ({ tipo: 'Todos', desde: anios[0], hasta: anios[anios.length - 1], pais: '' }),
    [anios],
  )
  // Los filtros también se pueden abrir desde el enlace, ej. /?tipo=Serie&pais=JP&desde=2010
  const [filtros, setFiltros] = useState(() => {
    const url = new URLSearchParams(window.location.search)
    return {
      tipo: url.get('tipo') ?? iniciales.tipo,
      desde: Number(url.get('desde') ?? iniciales.desde),
      hasta: Number(url.get('hasta') ?? iniciales.hasta),
      pais: url.get('pais') ?? iniciales.pais,
    }
  })
  const seleccionarPais = (iso2) => setFiltros((f) => ({ ...f, pais: iso2 }))

  // El mapa y el ranking de países ignoran el filtro de país (para no quedarse con un solo país);
  // el resto de los gráficos sí lo aplican.
  const sinFiltroPais = useMemo(() => filtrar(titulos, { ...filtros, pais: '' }), [titulos, filtros])
  const filtrados = useMemo(() => filtrar(titulos, filtros), [titulos, filtros])

  const kpiPais = useMemo(() => titulosPorPais(sinFiltroPais), [sinFiltroPais])
  const porAnio = useMemo(() => estrenosPorAnio(filtrados, filtros.desde, filtros.hasta), [filtrados, filtros])
  const generos = useMemo(() => todosLosGeneros(filtrados), [filtrados])
  const top5Generos = useMemo(() => topGeneros(filtrados), [filtrados])
  const top5Directores = useMemo(() => topDirectores(filtrados), [filtrados])
  const tipos = useMemo(() => peliculasVsSeries(filtrados), [filtrados])
  const paisesDisponibles = useMemo(
    () => [...new Set(titulos.flatMap((x) => x.pais))].sort((a, b) => nombrePais(a).localeCompare(nombrePais(b), 'es')),
    [titulos],
  )

  const enPais = filtros.pais ? ` en ${nombrePais(filtros.pais)}` : ''

  return (
    <div className="space-y-4">
      <Filtros
        filtros={filtros}
        setFiltros={setFiltros}
        anios={anios}
        paises={paisesDisponibles}
        valoresIniciales={iniciales}
      />

      {/* FILA 1 · KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiPrincipal datos={kpiPais} paisSeleccionado={filtros.pais} />
        <KpiTarjeta
          etiqueta="Títulos en el catálogo"
          valor={num(filtrados.length)}
          detalle={`con los filtros actuales${enPais}`}
        />
        <KpiTarjeta
          etiqueta="Año con más estrenos"
          valor={porAnio.pico.total ? porAnio.pico.anio : '—'}
          detalle={porAnio.pico.total ? `${nTitulos(porAnio.pico.total)} estrenados ese año` : 'sin datos'}
        />
        <KpiTarjeta
          etiqueta="Género más común"
          valor={top5Generos[0]?.nombre ?? '—'}
          detalle={top5Generos[0] ? nTitulos(top5Generos[0].total) : 'sin datos'}
        />
        <KpiTarjeta
          etiqueta="Director más productivo"
          valor={top5Directores[0]?.nombre ?? '—'}
          detalle={top5Directores[0] ? `${nTitulos(top5Directores[0].total)} dirigidos` : 'sin datos'}
        />
      </div>

      {/* FILA 2 · Mapa + ranking de países */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Tarjeta
          className="lg:col-span-2"
          titulo="¿Dónde se producen los títulos de Netflix?"
          subtitulo="Mapa de calor: más brillante = más títulos. Haz clic en un país para filtrar el dashboard."
          nota="Un título coproducido por varios países cuenta para cada uno de ellos."
        >
          <MapaPaises
            mundo={mundo}
            isoNum={isoNum}
            lista={kpiPais.lista}
            paisSeleccionado={filtros.pais}
            onSeleccionar={seleccionarPais}
          />
        </Tarjeta>
        <Tarjeta titulo="Top 10 países" subtitulo="Número de títulos por país de producción">
          <BarrasTop
            datos={kpiPais.lista.slice(0, 10)}
            seleccionado={filtros.pais}
            onClic={(d) => seleccionarPais(d.iso2 === filtros.pais ? '' : d.iso2)}
          />
        </Tarjeta>
      </div>

      {/* FILA 3 · Evolución temporal + tipo de contenido */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Tarjeta
          className="lg:col-span-2"
          titulo={`Estrenos por año${enPais}`}
          subtitulo="Áreas apiladas: la altura total es el número de títulos estrenados ese año. Usa el filtro de años para acercarte a un periodo."
          nota="El dataset llega hasta septiembre de 2021, por eso ese año aparece incompleto."
        >
          <LineaEstrenos filas={porAnio.filas} tipo={filtros.tipo} />
        </Tarjeta>
        <Tarjeta titulo={`Películas vs series${enPais}`} subtitulo="Proporción del catálogo por tipo de contenido">
          <DonaTipo datos={tipos} />
        </Tarjeta>
      </div>

      {/* FILA 4 · Géneros y directores */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Tarjeta titulo={`Top 5 géneros${enPais}`} subtitulo="Número de títulos por género">
          <BarrasTop datos={top5Generos} />
        </Tarjeta>
        <Tarjeta titulo="Nube de géneros" subtitulo="Tamaño = número de títulos · en rojo, el top 5">
          <NubeGeneros generos={generos} />
        </Tarjeta>
        <Tarjeta
          titulo={`Top 5 directores${enPais}`}
          subtitulo="Directores con más títulos en el catálogo"
          nota="Excluye los títulos sin director registrado (30 % del catálogo)."
        >
          <BarrasTop datos={top5Directores} />
        </Tarjeta>
      </div>
    </div>
  )
}
