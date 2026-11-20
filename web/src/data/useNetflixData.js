import { useEffect, useState } from 'react'

/**
 * Carga los datos que genera el script de limpieza (etl/limpieza.py):
 *  - netflix.json    → los 8 807 títulos limpios
 *  - paises_iso.json → código ISO numérico de cada país (llave del mapa)
 *  - mundo.json      → polígonos de los países (Natural Earth, paquete world-atlas)
 * Se usa Fetch, como sugiere el stack de la Fase 3.
 */
export function useNetflixData() {
  const [estado, setEstado] = useState({ cargando: true, error: null, titulos: [], isoNum: {}, mundo: null })

  useEffect(() => {
    const leer = (ruta) =>
      fetch(`${import.meta.env.BASE_URL}data/${ruta}`).then((r) => {
        if (!r.ok) throw new Error(`No se pudo cargar ${ruta}`)
        return r.json()
      })

    Promise.all([leer('netflix.json'), leer('paises_iso.json'), leer('mundo.json')])
      .then(([titulos, isoNum, mundo]) => setEstado({ cargando: false, error: null, titulos, isoNum, mundo }))
      .catch((error) => setEstado((e) => ({ ...e, cargando: false, error: error.message })))
  }, [])

  return estado
}
