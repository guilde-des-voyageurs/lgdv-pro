import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Si l'utilisateur est connecté, rediriger vers son compte
  if (session) {
    redirect('/compte')
  }

  // Sinon, rediriger vers la page de connexion
  redirect('/connexion')
}
