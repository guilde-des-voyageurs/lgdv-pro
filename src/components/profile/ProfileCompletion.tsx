'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const TYPES_ACTIVITE = [
  'Marque',
  'Auteur',
  'Artisan',
  'Restaurateur',
  'Artiste',
  'Autre'
]

interface ProfileFormData {
  type_membre: string
  description: string
  raison_adhesion: string
  sponsor: string
  site_web?: string
  instagram?: string
  tiktok?: string
}

export default function ProfileCompletion({ userId, userEmail }: { userId: string, userEmail: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    type_membre: '',
    description: '',
    raison_adhesion: '',
    sponsor: '',
    site_web: '',
    instagram: '',
    tiktok: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          status: 'active',
          site_web: formData.site_web || null,
          instagram: formData.instagram || null,
          tiktok: formData.tiktok || null
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Rediriger vers le hall une fois le profil complété
      router.push('/hall')
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err)
      setError('Une erreur est survenue lors de la mise à jour de votre profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue dans La Guilde des Voyageurs !
        </h1>
        <p className="mt-2 text-gray-600">
          Pour finaliser votre inscription, merci de compléter votre profil.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="type_membre" className="block text-sm font-medium text-gray-700">
            Type d'activité *
          </label>
          <select
            id="type_membre"
            name="type_membre"
            required
            value={formData.type_membre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionner dans la liste</option>
            {TYPES_ACTIVITE.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description de votre activité *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="raison_adhesion" className="block text-sm font-medium text-gray-700">
            Pourquoi souhaitez-vous rejoindre la Guilde ? *
          </label>
          <textarea
            id="raison_adhesion"
            name="raison_adhesion"
            required
            rows={4}
            value={formData.raison_adhesion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700">
            Parrain *
          </label>
          <input
            type="text"
            id="sponsor"
            name="sponsor"
            required
            value={formData.sponsor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="site_web" className="block text-sm font-medium text-gray-700">
            Site Web
          </label>
          <input
            type="url"
            id="site_web"
            name="site_web"
            placeholder="https://"
            value={formData.site_web}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
            Instagram
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              @
            </span>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">
            TikTok
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              @
            </span>
            <input
              type="text"
              id="tiktok"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              className="block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Compléter mon profil'}
          </button>
        </div>
      </form>
    </div>
  )
}
