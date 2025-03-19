import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Mon Compte | La Guilde des Voyageurs',
  description: 'Gérez votre compte professionnel',
}

export default async function AccountPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations du compte</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="font-medium">{profile?.status || 'En attente'}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={async () => {
                  'use server'
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  redirect('/connexion')
                }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
