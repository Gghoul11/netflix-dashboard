/**
 * Contenedor común de cada gráfico: título (qué muestra), subtítulo (cómo leerlo)
 * una "lectura rápida" opcional (la conclusión del gráfico dicha en palabras)
 * y una nota opcional al pie (fuente o aclaración).
 * La lectura rápida se agregó tras la evaluación de la Fase 4: algunos usuarios
 * no sacaban la conclusión solo viendo el tamaño de barras o palabras.
 */
export default function Tarjeta({ titulo, subtitulo, lectura, nota, children, className = '' }) {
  return (
    <section className={`flex flex-col rounded-xl border border-borde bg-tarjeta p-4 ${className}`}>
      <header className="mb-3">
        <h2 className="text-base font-semibold text-texto">{titulo}</h2>
        {subtitulo && <p className="mt-0.5 text-sm text-suave">{subtitulo}</p>}
        {lectura && (
          <p className="mt-2 border-l-2 border-rojo bg-fondo/60 py-1 pl-2 text-sm text-texto">
            <span className="font-semibold">En resumen:</span> {lectura}
          </p>
        )}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {nota && <p className="mt-2 text-xs text-suave">{nota}</p>}
    </section>
  )
}
