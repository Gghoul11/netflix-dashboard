import { Route, Routes } from 'react-router-dom'
import Encabezado from './components/layout/Encabezado'
import Dashboard from './pages/Dashboard'
import Evaluacion from './pages/Evaluacion'
import AcercaDe from './pages/AcercaDe'
import { useNetflixData } from './data/useNetflixData'

export default function App() {
  const { cargando, error, titulos, isoNum, mundo } = useNetflixData()

  return (
    <div className="min-h-screen">
      <Encabezado />
      <main className="mx-auto max-w-7xl px-4 py-5">
        {cargando && <p className="py-20 text-center text-suave">Cargando catálogo…</p>}
        {error && <p className="py-20 text-center text-rojo">Error: {error}</p>}
        {!cargando && !error && (
          <Routes>
            <Route path="/" element={<Dashboard titulos={titulos} isoNum={isoNum} mundo={mundo} />} />
            <Route path="/evaluacion" element={<Evaluacion />} />
            <Route path="/acerca" element={<AcercaDe />} />
            <Route path="*" element={<p className="py-20 text-center text-suave">Página no encontrada.</p>} />
          </Routes>
        )}
      </main>
      <footer className="border-t border-borde py-4 text-center text-xs text-suave">
        Datos: Netflix Movies and TV Shows (Kaggle, 2021) · Proyecto de Visualización de Datos · Aldo Arceo Beltrán
      </footer>
    </div>
  )
}
