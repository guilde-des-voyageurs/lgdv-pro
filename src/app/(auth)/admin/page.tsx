import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Administration | La Guilde des Voyageurs',
  description: 'Administration de La Guilde des Voyageurs',
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/hall')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Administration</h1>
      <p className="mt-4 text-gray-600">
        Gérez La Guilde des Voyageurs.
      </p>
      <AdminDashboard />
    </div>
  )
}

function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Tableau de bord
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de La Guilde des Voyageurs
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Membres actifs
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              0
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Membres en attente
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              0
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total des membres
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              0
            </dd>
          </div>
        </div>
      </div>
    </div>
  )
}
