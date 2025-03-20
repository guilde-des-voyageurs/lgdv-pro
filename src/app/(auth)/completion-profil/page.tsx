import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileCompletion from '@/components/profile/ProfileCompletion'

export const metadata: Metadata = {
  title: 'Compléter mon profil | La Guilde des Voyageurs',
  description: 'Complétez votre profil pour rejoindre La Guilde des Voyageurs',
}

export default async function ProfileCompletionPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  // Vérifier si l'utilisateur a déjà complété son profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', session.user.id)
    .single()

  // Si le profil est déjà actif, rediriger vers le hall
  if (profile?.status === 'active') {
    redirect('/hall')
  }

  // Si le profil est désactivé, rediriger vers une page d'erreur
  if (profile?.status === 'disabled') {
    redirect('/compte-desactive')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ProfileCompletion 
        userId={session.user.id} 
      />
    </div>
  )
}
