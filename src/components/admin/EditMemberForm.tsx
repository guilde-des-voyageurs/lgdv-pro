'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Profile = Database['public']['Tables']['profiles']['Row']

interface Props {
  member: Profile
}

export default function EditMemberForm({ member }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: member.id,
    created_at: member.created_at,
    updated_at: member.updated_at,
    email: member.email,
    company_name: member.company_name || '',
    status: member.status as 'active' | 'pending_payment' | 'pending_review',
    is_admin: member.is_admin,
    manager_name: member.manager_name || '',
    siret: member.siret || '',
    member_type: member.member_type || '',
    logo_url: member.logo_url || '',
    sponsor: member.sponsor || '',
    join_reason: member.join_reason || '',
    charter_signed: member.charter_signed || false,
    phone: member.phone || '',
    address: member.address || '',
    tiktok_url: member.tiktok_url || '',
    instagram_url: member.instagram_url || '',
    website_url: member.website_url || '',
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email: formData.email,
          company_name: formData.company_name || null,
          status: formData.status,
          is_admin: formData.is_admin,
          manager_name: formData.manager_name || null,
          siret: formData.siret || null,
          member_type: formData.member_type || null,
          logo_url: formData.logo_url || null,
          sponsor: formData.sponsor || null,
          join_reason: formData.join_reason || null,
          charter_signed: formData.charter_signed,
          phone: formData.phone || null,
          address: formData.address || null,
          tiktok_url: formData.tiktok_url || null,
          instagram_url: formData.instagram_url || null,
          website_url: formData.website_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', member.id)

      if (error) throw error

      router.refresh()
      router.push('/admin/membres')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        {/* ID (lecture seule) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <input
            type="text"
            value={formData.id}
            disabled
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          {formData.logo_url && (
            <div className="mt-2 mb-4">
              <Image
                src={formData.logo_url}
                alt="Logo de l'entreprise"
                width={100}
                height={100}
                className="rounded-lg"
              />
            </div>
          )}
          <input
            type="url"
            id="logo_url"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            placeholder="URL du logo"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Nom de l'entreprise */}
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
              Nom de l&apos;entreprise
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Nom du gérant */}
          <div>
            <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">
              Nom du gérant
            </label>
            <input
              type="text"
              id="manager_name"
              name="manager_name"
              value={formData.manager_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* SIRET */}
          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
              SIRET
            </label>
            <input
              type="text"
              id="siret"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Coordonnées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Liens web */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site web */}
          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
              Site web
            </label>
            <input
              type="url"
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">
              Instagram
            </label>
            <input
              type="url"
              id="instagram_url"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* TikTok */}
          <div>
            <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700">
              TikTok
            </label>
            <input
              type="url"
              id="tiktok_url"
              name="tiktok_url"
              value={formData.tiktok_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Informations d'adhésion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type de membre */}
          <div>
            <label htmlFor="member_type" className="block text-sm font-medium text-gray-700">
              Type de membre
            </label>
            <select
              id="member_type"
              value={formData.member_type}
              onChange={(e) => setFormData({ ...formData, member_type: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="Marque">Marque</option>
              <option value="Artisan/Créateur">Artisan/Créateur</option>
              <option value="Artiste">Artiste</option>
              <option value="Association">Association</option>
              <option value="Restaurateur/Bar">Restaurateur/Bar</option>
              <option value="Auteur">Auteur</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Parrain */}
          <div>
            <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700">
              Parrain
            </label>
            <input
              type="text"
              id="sponsor"
              name="sponsor"
              value={formData.sponsor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Raison d'adhésion */}
        <div>
          <label htmlFor="join_reason" className="block text-sm font-medium text-gray-700">
            Raison d&apos;adhésion
          </label>
          <textarea
            id="join_reason"
            name="join_reason"
            value={formData.join_reason}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Statut et validation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="active">Actif</option>
              <option value="pending_payment">En attente de paiement</option>
              <option value="pending_review">En attente de validation</option>
            </select>
          </div>

          {/* Admin */}
          <div className="flex items-center h-full">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Administrateur</span>
            </label>
          </div>

          {/* Charte signée */}
          <div className="flex items-center h-full">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.charter_signed}
                onChange={(e) => setFormData({ ...formData, charter_signed: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Charte signée</span>
            </label>
          </div>
        </div>

        {/* Dates (lecture seule) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de création</label>
            <input
              type="text"
              value={new Date(formData.created_at).toLocaleString('fr-FR')}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dernière modification</label>
            <input
              type="text"
              value={new Date(formData.updated_at).toLocaleString('fr-FR')}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500"
            />
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/membres')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  )
}
