'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'

type Profile = Database['public']['Tables']['profiles']['Row']

interface EditProfileFormProps {
  member: Profile
}

export default function EditProfileForm({ member }: EditProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    id: member.id,
    email: member.email,
    company_name: member.company_name || '',
    manager_name: member.manager_name || '',
    siret: member.siret || '',
    member_type: member.member_type || '',
    logo_url: member.logo_url || '',
    sponsor: member.sponsor || '',
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
          manager_name: formData.manager_name || null,
          siret: formData.siret || null,
          member_type: formData.member_type || null,
          logo_url: formData.logo_url || null,
          sponsor: formData.sponsor || null,
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
      router.push('/compte')
    } catch (err) {
      console.error('Erreur:', err)
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${member.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

      setFormData({
        ...formData,
        logo_url: publicUrl
      })
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du téléchargement')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Une erreur est survenue
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informations de base */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Informations de base</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Nom de l&apos;entreprise
              </label>
              <input
                type="text"
                name="company_name"
                id="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">
                Nom du gérant
              </label>
              <input
                type="text"
                name="manager_name"
                id="manager_name"
                value={formData.manager_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                SIRET
              </label>
              <input
                type="text"
                name="siret"
                id="siret"
                value={formData.siret}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="member_type" className="block text-sm font-medium text-gray-700">
                Type de membre
              </label>
              <select
                id="member_type"
                name="member_type"
                value={formData.member_type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionner un type</option>
                <option value="marque">Marque</option>
                <option value="artisan">Artisan</option>
                <option value="artiste">Artiste</option>
                <option value="restaurateur">Restaurateur</option>
                <option value="auteur">Auteur</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Logo</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logo de l&apos;entreprise
              </label>
              <div className="mt-2 flex items-center space-x-4">
                {formData.logo_url && (
                  <img
                    src={formData.logo_url}
                    alt="Logo de l'entreprise"
                    className="h-32 w-32 object-contain bg-gray-50 rounded-lg"
                  />
                )}
                <label
                  htmlFor="logo"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {formData.logo_url ? 'Changer le logo' : 'Télécharger un logo'}
                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF jusqu&apos;à 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Informations complémentaires */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Informations complémentaires</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700">
                Parrain
              </label>
              <input
                type="text"
                name="sponsor"
                id="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <textarea
                name="address"
                id="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Réseaux sociaux</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-700">
                TikTok
              </label>
              <input
                type="url"
                name="tiktok_url"
                id="tiktok_url"
                value={formData.tiktok_url}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="url"
                name="instagram_url"
                id="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                Site web
              </label>
              <input
                type="url"
                name="website_url"
                id="website_url"
                value={formData.website_url}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/compte')}
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
