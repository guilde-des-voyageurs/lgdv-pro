import { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'
import Link from 'next/link'
import { UserGroupIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Tableau de bord | Administration',
  description: 'Tableau de bord administrateur de La Guilde des Voyageurs',
}

interface MemberStats {
  total: number
  active: number
  pending: number
  inactive: number
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Vérifier que l'utilisateur est admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/compte')
  }

  // Récupérer les statistiques des membres
  const { data: stats } = await supabase
    .from('profiles')
    .select('status')

  const memberStats: MemberStats = {
    total: stats?.length || 0,
    active: stats?.filter(p => p.status === 'active').length || 0,
    pending: stats?.filter(p => p.status === 'pending_payment' || p.status === 'pending_review').length || 0,
    inactive: stats?.filter(p => p.status === 'inactive').length || 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total des membres</h3>
          <p className="text-3xl font-bold">{memberStats.total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Membres actifs</h3>
          <p className="text-3xl font-bold text-green-600">{memberStats.active}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">En attente</h3>
          <p className="text-3xl font-bold text-yellow-600">{memberStats.pending}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Inactifs</h3>
          <p className="text-3xl font-bold text-red-600">{memberStats.inactive}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Gestion des membres</h2>
        <p className="text-gray-600 mb-4">
          Gérez les membres de La Guilde des Voyageurs : informations, statuts et permissions.
        </p>
        <Link
          href="/admin/membres/"
          className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
        >
          <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
            <UserGroupIcon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              Gestion des membres
              <span className="absolute inset-0" />
            </div>
            <p className="mt-1 text-gray-600">Voir et modifier les membres de la Guilde</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
