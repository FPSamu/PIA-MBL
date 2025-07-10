import { supabase } from '../services/supabaseClient'

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Error en sign up:', error.message)
  } else {
    console.log('Usuario creado:', data)
  }
  return { data, error };
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error al iniciar sesión:', error.message)
  } else {
    console.log('Sesión iniciada:', data)
  }
  return { data, error };
}
  