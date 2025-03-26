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

  const currentYear = new Date().getFullYear()

  // Récupérer le profil et la cotisation de l'année en cours
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      cotisations!inner (
        status,
        amount,
        paid_at
      )
    `)
    .eq('id', user.id)
    .eq('cotisations.year', currentYear)
    .single()

  // Si pas de cotisation trouvée, récupérer juste le profil
  if (error?.code === 'PGRST116') {
    const { data: profileOnly, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profileOnly) {
      return (
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Erreur</h1>
            <p>Erreur lors de la récupération du profil :</p>
            <pre className="mt-2 p-4 bg-red-50 text-red-800 rounded">
              {JSON.stringify({ error: profileError, userId: user.id }, null, 2)}
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
                  <p><span className="font-medium">Email :</span> {profileOnly.email}</p>
                  <p><span className="font-medium">Entreprise :</span> {profileOnly.company_name || '-'}</p>
                  <p><span className="font-medium">Type de membre :</span> {profileOnly.member_type || '-'}</p>
                  <p><span className="font-medium">Statut :</span> {profileOnly.status}</p>
                  <p><span className="font-medium">Rôle :</span> {profileOnly.is_admin ? 'Administrateur' : 'Membre'}</p>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Cotisation {currentYear}</h3>
                        <p className="mt-2 text-sm text-yellow-700">
                          Aucune cotisation enregistrée pour {currentYear}
                        </p>
                      </div>
                    </div>
                  </div>
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

  const cotisation = profile.cotisations?.[0]

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
                <div className={`mt-4 p-4 rounded-md ${
                  cotisation?.status === 'paid' 
                    ? 'bg-green-50' 
                    : 'bg-yellow-50'
                }`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {cotisation?.status === 'paid' ? (
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-sm font-medium ${
                        cotisation?.status === 'paid' 
                          ? 'text-green-800' 
                          : 'text-yellow-800'
                      }`}>
                        Cotisation {currentYear}
                      </h3>
                      <div className="mt-2 text-sm">
                        {cotisation?.status === 'paid' ? (
                          <>
                            <p className="text-green-700">
                              Cotisation payée
                              {cotisation.amount && ` (${cotisation.amount}€)`}
                            </p>
                            {cotisation.paid_at && (
                              <p className="text-green-700 mt-1">
                                Date de paiement : {new Date(cotisation.paid_at).toLocaleDateString()}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-yellow-700">
                            Cotisation non payée pour {currentYear}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
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
