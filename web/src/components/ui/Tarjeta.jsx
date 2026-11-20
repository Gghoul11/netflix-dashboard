/**
 * Contenedor común de cada gráfico: título (qué muestra), subtítulo (cómo leerlo)
 * y una nota opcional al pie (fuente o aclaración).
 */
export default function Tarjeta({ titulo, subtitulo, nota, children, className = '' }) {
  return (
    <section className={`flex flex-col rounded-xl border border-borde bg-tarjeta p-4 ${className}`}>
      <header className="mb-3">
        <h2 className="text-base font-semibold text-texto">{titulo}</h2>
        {subtitulo && <p className="mt-0.5 text-sm text-suave">{subtitulo}</p>}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {nota && <p className="mt-2 text-xs text-suave">{nota}</p>}
    </section>
  )
}
