import { createClient } from '@supabase/supabase-js'

/**
 * Conexión a la base de datos (Supabase / PostgreSQL).
 * Las llaves vienen de web/.env.local (no se suben a GitHub).
 * Si no existen, el dashboard sigue funcionando; solo la encuesta queda desactivada.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const llave = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && llave ? createClient(url, llave) : null
