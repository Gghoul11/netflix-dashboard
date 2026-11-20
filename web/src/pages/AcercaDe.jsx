import { useEffect, useState } from 'react'
import { num } from '../lib/kpis'

/**
 * Explica de dónde vienen los datos y qué limpieza se hizo (Fase 1),
 * con los números reales que genera etl/limpieza.py (reporte_limpieza.json).
 */
export default function AcercaDe() {
  const [rep, setRep] = useState(null)
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/reporte_limpieza.json`)
      .then((r) => r.json())
      .then(setRep)
      .catch(() => setRep(null))
  }, [])

  const filas = rep
    ? [
        ['Títulos en el dataset', num(rep.filas_originales)],
        ['Películas / series', `${num(rep.peliculas)} / ${num(rep.series)}`],
        ['Sin director registrado → "Desconocido"', num(rep.nulos_originales.director)],
        ['Sin país registrado → "Desconocido"', num(rep.nulos_originales.country)],
        ['Sin fecha de llegada a Netflix', num(rep.sin_fecha_agregado)],
        ['Duración capturada por error en la columna "rating" (corregidos)', num(rep.rating_con_duracion_corregidos)],
        ['Fecha de llegada anterior al estreno (error, se anuló la fecha)', num(rep.fecha_agregado_antes_de_estreno_anuladas)],
        [`Títulos atípicamente antiguos (antes de ${rep.limite_atipico_anio}) — se conservan`, num(rep.atipicos_anio_estreno)],
        ['Duplicados', num(rep.duplicados_eliminados)],
        ['Países distintos', num(rep.paises_distintos)],
        ['Géneros (después de unificar etiquetas)', num(rep.generos_distintos)],
      ]
    : []

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <section className="rounded-xl border border-borde bg-tarjeta p-5">
        <h2 className="text-2xl font-bold">Acerca de los datos</h2>
        <p className="mt-2 text-suave">
          <strong className="text-texto">Fuente:</strong>{' '}
          <a className="text-rojo underline" href="https://www.kaggle.com/datasets/shivamb/netflix-shows" target="_blank" rel="noreferrer">
            Netflix Movies and TV Shows (Kaggle)
          </a>
          . Catálogo de películas y series disponibles en Netflix hasta septiembre de 2021.
        </p>
        <p className="mt-2 text-suave">
          <strong className="text-texto">Pregunta que responde el dashboard:</strong> ¿cómo se distribuye el catálogo de
          Netflix por país, año y género, y cómo han cambiado esas tendencias?
        </p>
      </section>

      <section className="rounded-xl border border-borde bg-tarjeta p-5">
        <h3 className="text-lg font-semibold">Limpieza aplicada</h3>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {filas.map(([a, b]) => (
              <tr key={a} className="border-b border-borde last:border-0">
                <td className="py-2 pr-4 text-suave">{a}</td>
                <td className="py-2 text-right font-semibold tabular-nums">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-borde bg-tarjeta p-5 text-sm text-suave">
        <h3 className="mb-2 text-lg font-semibold text-texto">Cómo leer los números</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Un título coproducido por varios países cuenta una vez para cada país.</li>
          <li>Un título puede tener varios géneros: cuenta una vez en cada uno.</li>
          <li>
            Netflix usa etiquetas distintas para películas y series (“Dramas” y “TV Dramas”); se unificaron en un solo
            género en español.
          </li>
          <li>Etiquetas de origen como “International Movies” no son géneros y no se cuentan como tales.</li>
          <li>El año de los gráficos es el año de estreno del título.</li>
        </ul>
      </section>
    </div>
  )
}
