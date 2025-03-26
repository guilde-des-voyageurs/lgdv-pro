import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditProfileForm from '@/components/profile/EditProfileForm'

export const metadata: Metadata = {
  title: 'Modifier mon profil | La Guilde des Voyageurs',
  description: 'Modifiez vos informations personnelles',
}

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p>Erreur lors de la récupération du profil :</p>
          <pre className="mt-2 p-4 bg-red-50 text-red-800 rounded">
            {JSON.stringify({ error, userId: user.id }, null, 2)}
          </pre>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Modifier mon profil</h1>
          <p className="mt-2 text-gray-600">
            Modifiez vos informations personnelles et professionnelles
          </p>
        </div>

        <EditProfileForm member={profile} />
      </div>
    </main>
  )
}
