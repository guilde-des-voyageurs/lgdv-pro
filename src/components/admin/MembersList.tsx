'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import clsx from 'clsx'

type Profile = {
  id: string
  email: string
  full_name: string | null
  status: 'pending' | 'active' | 'inactive'
  created_at: string
}

export default function MembersList() {
  const [members, setMembers] = useState<(Profile & { user: User | null })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les membres au montage du composant
  useState(() => {
    loadMembers()
  })

  async function loadMembers() {
    try {
      const supabase = createClient()
      
      // Récupérer tous les profils avec leurs données utilisateur
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Pour chaque profil, récupérer les données utilisateur
      const membersWithUser = await Promise.all(
        profiles.map(async (profile) => {
          const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id)
          if (userError) console.error('Erreur lors de la récupération de l\'utilisateur:', userError)
          return { ...profile, user }
        })
      )

      setMembers(membersWithUser)
    } catch (err) {
      console.error('Erreur lors du chargement des membres:', err)
      setError('Impossible de charger la liste des membres')
    } finally {
      setLoading(false)
    }
  }

  async function updateMemberStatus(memberId: string, newStatus: Profile['status']) {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', memberId)

      if (error) throw error

      // Recharger la liste
      await loadMembers()
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err)
      setError('Impossible de mettre à jour le statut du membre')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Membre
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date d'inscription
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {member.full_name || 'Non renseigné'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{member.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={clsx(
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  {
                    'bg-green-100 text-green-800': member.status === 'active',
                    'bg-yellow-100 text-yellow-800': member.status === 'pending',
                    'bg-gray-100 text-gray-800': member.status === 'inactive'
                  }
                )}>
                  {member.status === 'active' && 'Actif'}
                  {member.status === 'pending' && 'En attente'}
                  {member.status === 'inactive' && 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(member.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {member.status === 'pending' && (
                  <button
                    onClick={() => updateMemberStatus(member.id, 'active')}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Valider
                  </button>
                )}
                {member.status === 'active' && (
                  <button
                    onClick={() => updateMemberStatus(member.id, 'inactive')}
                    className="text-red-600 hover:text-red-900 mr-4"
                  >
                    Désactiver
                  </button>
                )}
                {member.status === 'inactive' && (
                  <button
                    onClick={() => updateMemberStatus(member.id, 'active')}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Réactiver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
