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
  active: number
  pending: number
  paidCotisations: number
}

interface MemberTypeStats {
  [key: string]: number
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
  const { data: membersData } = await supabase
    .from('profiles')
    .select('status, member_type')

  const currentYear = new Date().getFullYear()
  const { data: cotisationsData } = await supabase
    .from('cotisations')
    .select('status')
    .eq('year', currentYear)
    .eq('status', 'paid')

  const memberStats: MemberStats = {
    active: membersData?.filter(p => p.status === 'active').length || 0,
    pending: membersData?.filter(p => p.status === 'pending_review').length || 0,
    paidCotisations: cotisationsData?.length || 0,
  }

  // Calculer les statistiques par type de membre
  const memberTypeStats: MemberTypeStats = (membersData || []).reduce((acc, member) => {
    if (member.member_type) {
      acc[member.member_type] = (acc[member.member_type] || 0) + 1
    }
    return acc
  }, {} as MemberTypeStats)

  // Mapper les types en français
  const typeLabels: { [key: string]: string } = {
    marque: 'Marque',
    artisan: 'Artisan',
    artiste: 'Artiste',
    restaurateur: 'Restaurateur',
    auteur: 'Auteur',
    autre: 'Autre'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Membres actifs</h3>
          <p className="text-3xl font-bold text-green-600">{memberStats.active}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">En attente de validation</h3>
          <p className="text-3xl font-bold text-yellow-600">{memberStats.pending}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Cotisations payées {currentYear}</h3>
          <p className="text-3xl font-bold text-blue-600">{memberStats.paidCotisations}</p>
        </div>
      </div>

      {/* Statistiques par type de membre */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Répartition par type de membre</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de membre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(memberTypeStats).sort().map(([type, count]) => (
                <tr key={type}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeLabels[type] || type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Liste des membres
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Consultez et modifiez les informations des membres
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
