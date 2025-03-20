'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  type_membre?: string
  status: 'pending' | 'active' | 'disabled'
  is_admin: boolean
  date_inscription: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviting, setInviting] = useState(false)

  // Charger la liste des utilisateurs
  const loadUsers = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('date_inscription', { ascending: false })

    if (error) {
      setError('Erreur lors du chargement des utilisateurs')
      console.error('Erreur:', error)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  // Inviter un nouvel utilisateur
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single()

      if (existingUser) {
        setError('Un compte existe déjà avec cet email')
        return
      }

      // Créer le profil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          email: inviteEmail,
          is_admin: isAdmin,
          status: 'pending',
          date_inscription: new Date().toISOString()
        })

      if (insertError) throw insertError

      // Envoyer l'email d'invitation
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: inviteEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) throw signInError

      // Réinitialiser le formulaire et recharger la liste
      setInviteEmail('')
      setIsAdmin(false)
      setShowInviteForm(false)
      loadUsers()

    } catch (err) {
      console.error('Erreur lors de l\'invitation:', err)
      setError('Erreur lors de l\'envoi de l\'invitation')
    } finally {
      setInviting(false)
    }
  }

  // Activer/Désactiver un utilisateur
  const toggleUserStatus = async (user: User) => {
    const supabase = createClient()
    const newStatus = user.status === 'disabled' ? 'active' : 'disabled'

    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', user.id)

    if (error) {
      setError('Erreur lors de la mise à jour du statut')
      console.error('Erreur:', error)
    } else {
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ))
    }
  }

  // Charger les utilisateurs au montage du composant
  useState(() => {
    loadUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
        <button
          onClick={() => setShowInviteForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Inviter un utilisateur
        </button>
      </div>

      {showInviteForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Inviter un nouvel utilisateur</h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email professionnel
              </label>
              <input
                type="email"
                id="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                Administrateur
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={inviting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {inviting ? 'Envoi...' : 'Inviter'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'inscription
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.type_membre || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {user.status === 'active' ? 'Actif' :
                     user.status === 'pending' ? 'En attente' :
                     'Désactivé'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.is_admin ? 'Oui' : 'Non'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.date_inscription).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => toggleUserStatus(user)}
                    className={`text-sm font-medium
                      ${user.status === 'disabled' 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-red-600 hover:text-red-700'}`}
                  >
                    {user.status === 'disabled' ? 'Activer' : 'Désactiver'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
