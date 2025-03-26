import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import Link from 'next/link'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Mon Compte | La Guilde des Voyageurs',
  description: 'Gérez votre compte professionnel',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  // Ajout de logs pour déboguer
  console.log('User ID:', user.id)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Ajout de logs pour déboguer
  console.log('Profile:', profile)
  console.log('Error:', error)

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
        <h1 className="text-2xl font-bold mb-4">Mon Compte</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Informations du compte</h2>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Email :</span> {profile.email}</p>
                <p><span className="font-medium">Entreprise :</span> {profile.company_name || '-'}</p>
                <p><span className="font-medium">Type de membre :</span> {profile.member_type || '-'}</p>
                <p><span className="font-medium">Statut :</span> {profile.status}</p>
                <p><span className="font-medium">Rôle :</span> {profile.is_admin ? 'Administrateur' : 'Membre'}</p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h2 className="text-lg font-medium mb-4">Actions</h2>
              <div className="flex space-x-4">
                <Link
                  href="/compte/edit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  Modifier mon profil
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
