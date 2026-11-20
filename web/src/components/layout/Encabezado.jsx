import { NavLink } from 'react-router-dom'

const enlaces = [
  { a: '/', texto: 'Dashboard' },
  { a: '/evaluacion', texto: 'Evaluación' },
  { a: '/acerca', texto: 'Acerca de los datos' },
]

/** Nivel 1 de jerarquía: título general del dashboard + navegación entre secciones. */
export default function Encabezado() {
  return (
    <header className="border-b border-borde bg-fondo">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="text-rojo">Netflix</span> en el mundo
          </h1>
          <p className="text-sm text-suave">
            La economía del entretenimiento: ¿qué produce Netflix, dónde y desde cuándo?
          </p>
        </div>
        <nav className="flex gap-1 text-sm">
          {enlaces.map((e) => (
            <NavLink
              key={e.a}
              to={e.a}
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 font-medium transition-colors ${
                  isActive ? 'bg-rojo text-white' : 'text-suave hover:bg-tarjeta hover:text-texto'
                }`
              }
            >
              {e.texto}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
