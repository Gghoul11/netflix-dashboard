import { useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * FASE 4 · Encuesta de evaluación del dashboard.
 * Estructura tomada de las indicaciones de la Fase 4:
 *   Sección 1 · Datos del participante
 *   Sección 2 · 10 afirmaciones en escala 1–5
 *   Sección 3 · Preguntas abiertas
 * Se agrega una sección corta de "comprensión" (3 preguntas con respuesta correcta)
 * para comprobar si el usuario realmente entendió los datos.
 * Las respuestas se guardan en la tabla `encuestas` de Supabase.
 */

const AFIRMACIONES = [
  ['p1_facil', 'El dashboard es fácil de entender.'],
  ['p2_colores', 'Los colores utilizados ayudan a interpretar la información.'],
  ['p3_kpi', 'Puedo identificar fácilmente el KPI principal.'],
  ['p4_graficos', 'Los gráficos representan correctamente los datos.'],
  ['p5_organizacion', 'La información está bien organizada y estructurada.'],
  ['p6_textos', 'Los textos, títulos y etiquetas son claros.'],
  ['p7_interactividad', 'La interactividad (filtros, botones) es intuitiva.'],
  ['p8_atractivo', 'Considero que el dashboard es visualmente atractivo.'],
  ['p9_insights', 'El dashboard me permite obtener conclusiones o insights.'],
  ['p10_satisfaccion', 'En general, la experiencia de uso fue satisfactoria.'],
]

const COMPRENSION = [
  ['c1_pais', '¿Qué país tiene más títulos en Netflix?', ['India', 'Estados Unidos', 'Reino Unido', 'No lo sé']],
  ['c2_tipo', '¿Netflix tiene más películas o más series?', ['Películas', 'Series', 'Casi igual', 'No lo sé']],
  ['c3_genero', '¿Cuál es el género más común?', ['Comedia', 'Documental', 'Drama', 'No lo sé']],
]

const ABIERTAS = [
  ['a1_gusto', '¿Qué te gustó más del dashboard?'],
  ['a2_confuso', '¿Qué parte te resultó confusa o difícil de entender?'],
  ['a3_mejora', '¿Qué mejorarías en el diseño o en los gráficos?'],
  ['a4_util', '¿Qué KPI o gráfico te resultó más útil?'],
  ['a5_cambios', '¿Agregarías o quitarías algún elemento?'],
]

const vacio = () => ({ edad: '', genero: '', ocupacion: '', conoce_tema: '', usa_dashboards: '' })

function Seccion({ numero, titulo, descripcion, children }) {
  return (
    <section className="rounded-xl border border-borde bg-tarjeta p-5">
      <h2 className="text-lg font-semibold">
        <span className="text-rojo">{numero}.</span> {titulo}
      </h2>
      <p className="mb-4 mt-1 text-sm text-suave">{descripcion}</p>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function Escala({ nombre, valor, onChange, izquierda = 'Totalmente en desacuerdo', derecha = 'Totalmente de acuerdo' }) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm font-semibold transition-colors ${
              valor === n ? 'border-rojo bg-rojo text-white' : 'border-borde text-suave hover:border-suave'
            }`}
          >
            <input type="radio" name={nombre} value={n} checked={valor === n} onChange={() => onChange(n)} className="sr-only" required />
            {n}
          </label>
        ))}
      </div>
      {izquierda && (
        <div className="mt-1 flex w-[232px] justify-between text-[11px] text-suave">
          <span>{izquierda}</span>
          <span>{derecha}</span>
        </div>
      )}
    </div>
  )
}

export default function Evaluacion() {
  const [r, setR] = useState(vacio)
  const [estado, setEstado] = useState('editando') // editando | enviando | enviado | error
  const [error, setError] = useState('')
  const poner = (campo) => (valor) => setR((x) => ({ ...x, [campo]: valor?.target ? valor.target.value : valor }))

  const enviar = async (e) => {
    e.preventDefault()
    setEstado('enviando')
    const fila = { ...r, edad: r.edad ? Number(r.edad) : null }
    const { error: err } = await supabase.from('encuestas').insert(fila)
    if (err) {
      setError(err.message)
      setEstado('error')
    } else {
      setEstado('enviado')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (estado === 'enviado') {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-borde bg-tarjeta p-8 text-center">
        <p className="text-4xl">🎬</p>
        <h2 className="mt-2 text-2xl font-bold">¡Gracias por tu evaluación!</h2>
        <p className="mt-2 text-suave">Tus respuestas se guardaron y se usarán para mejorar el dashboard.</p>
        <button
          type="button"
          onClick={() => {
            setR(vacio())
            setEstado('editando')
          }}
          className="mt-6 rounded-md bg-rojo px-4 py-2 font-semibold text-white"
        >
          Registrar otra respuesta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-xl border border-borde bg-tarjeta p-5">
        <h2 className="text-2xl font-bold">Evaluación del dashboard</h2>
        <p className="mt-1 text-suave">
          Primero explora el dashboard libremente por unos minutos y después responde esta encuesta. Toma unos
          5 minutos. Es anónima.
        </p>
        {!supabase && (
          <p className="mt-3 rounded-md border border-azul/50 bg-azul/10 p-3 text-sm">
            La base de datos aún no está conectada, así que la encuesta todavía no puede guardar respuestas.
          </p>
        )}
      </div>

      <Seccion numero={1} titulo="Datos del participante">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            Edad
            <input type="number" min="10" max="99" value={r.edad} onChange={poner('edad')} className="px-3 py-2" required />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Género (opcional)
            <select value={r.genero} onChange={poner('genero')} className="px-3 py-2">
              <option value="">Prefiero no decir</option>
              <option>Mujer</option>
              <option>Hombre</option>
              <option>Otro</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Ocupación o rol
            <input value={r.ocupacion} onChange={poner('ocupacion')} placeholder="Ej. estudiante" className="px-3 py-2" required />
          </label>
        </div>
        <div>
          <p className="mb-2 text-sm">¿Qué tanto conoces el catálogo de Netflix?</p>
          <Escala nombre="conoce_tema" valor={r.conoce_tema} onChange={poner('conoce_tema')} izquierda="Nada" derecha="Mucho" />
        </div>
        <div>
          <p className="mb-2 text-sm">¿Qué tanta experiencia tienes usando dashboards?</p>
          <Escala nombre="usa_dashboards" valor={r.usa_dashboards} onChange={poner('usa_dashboards')} izquierda="Ninguna" derecha="Mucha" />
        </div>
      </Seccion>

      <Seccion numero={2} titulo="Evaluación de usabilidad" descripcion="1 = Totalmente en desacuerdo · 5 = Totalmente de acuerdo">
        {AFIRMACIONES.map(([campo, texto], i) => (
          <div key={campo}>
            <p className="mb-2 text-sm">
              <span className="text-suave">{i + 1}.</span> {texto}
            </p>
            <Escala nombre={campo} valor={r[campo]} onChange={poner(campo)} izquierda={null} />
          </div>
        ))}
      </Seccion>

      <Seccion numero={3} titulo="¿Qué entendiste?" descripcion="Responde según lo que viste en el dashboard (puedes regresar a verlo).">
        {COMPRENSION.map(([campo, texto, opciones]) => (
          <fieldset key={campo}>
            <legend className="mb-2 text-sm">{texto}</legend>
            <div className="flex flex-wrap gap-2">
              {opciones.map((o) => (
                <label
                  key={o}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm ${
                    r[campo] === o ? 'border-rojo bg-rojo text-white' : 'border-borde text-suave hover:border-suave'
                  }`}
                >
                  <input type="radio" name={campo} className="sr-only" checked={r[campo] === o} onChange={() => poner(campo)(o)} required />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </Seccion>

      <Seccion numero={4} titulo="Preguntas abiertas">
        {ABIERTAS.map(([campo, texto]) => (
          <label key={campo} className="flex flex-col gap-1 text-sm">
            {texto}
            <textarea rows={2} value={r[campo] ?? ''} onChange={poner(campo)} className="px-3 py-2" />
          </label>
        ))}
      </Seccion>

      {estado === 'error' && (
        <p className="rounded-md border border-rojo bg-rojo/10 p-3 text-sm">No se pudo guardar: {error}</p>
      )}
      <button
        type="submit"
        disabled={!supabase || estado === 'enviando'}
        className="w-full rounded-md bg-rojo py-3 font-semibold text-white disabled:opacity-40"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Enviar evaluación'}
      </button>
    </form>
  )
}
