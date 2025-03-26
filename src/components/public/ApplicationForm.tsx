'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ApplicationForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
    manager_name: '',
    siret: '',
    member_type: '',
    phone: '',
    address: '',
    website_url: '',
    instagram_url: '',
    tiktok_url: '',
    join_reason: '',
    sponsor: '',
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        throw new Error('Un compte existe déjà avec cet email')
      }

      // Créer le profil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          email: formData.email,
          company_name: formData.company_name || null,
          manager_name: formData.manager_name || null,
          siret: formData.siret || null,
          member_type: formData.member_type || null,
          phone: formData.phone || null,
          address: formData.address || null,
          website_url: formData.website_url || null,
          instagram_url: formData.instagram_url || null,
          tiktok_url: formData.tiktok_url || null,
          join_reason: formData.join_reason || null,
          sponsor: formData.sponsor || null,
          status: 'pending_review',
          date_inscription: new Date().toISOString(),
          is_admin: false,
        })

      if (insertError) throw insertError

      // Envoyer l'email d'invitation
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) throw signInError

      setSuccess(true)
      setFormData({
        email: '',
        company_name: '',
        manager_name: '',
        siret: '',
        member_type: '',
        phone: '',
        address: '',
        website_url: '',
        instagram_url: '',
        tiktok_url: '',
        join_reason: '',
        sponsor: '',
      })
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

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Candidature envoyée avec succès
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Votre candidature a été enregistrée. Vous allez recevoir un email pour confirmer votre adresse email.
                Une fois confirmée, votre candidature sera examinée par notre équipe.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
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

      <div>
        <h3 className="text-lg font-medium text-gray-900">Informations de base</h3>
        <p className="mt-1 text-sm text-gray-500">
          Ces informations sont nécessaires pour créer votre profil professionnel.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email professionnel *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
              Nom de l&apos;entreprise *
            </label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">
              Nom du gérant *
            </label>
            <input
              type="text"
              name="manager_name"
              id="manager_name"
              required
              value={formData.manager_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
              SIRET *
            </label>
            <input
              type="text"
              name="siret"
              id="siret"
              required
              value={formData.siret}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="member_type" className="block text-sm font-medium text-gray-700">
              Type de membre *
            </label>
            <select
              id="member_type"
              name="member_type"
              required
              value={formData.member_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
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

      <div>
        <h3 className="text-lg font-medium text-gray-900">Coordonnées</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone *
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Adresse *
            </label>
            <textarea
              name="address"
              id="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Présence en ligne</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
              placeholder="https://..."
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
              placeholder="https://instagram.com/..."
            />
          </div>

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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
              placeholder="https://tiktok.com/..."
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Informations complémentaires</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label htmlFor="join_reason" className="block text-sm font-medium text-gray-700">
              Pourquoi souhaitez-vous rejoindre La Guilde des Voyageurs ? *
            </label>
            <textarea
              name="join_reason"
              id="join_reason"
              required
              rows={4}
              value={formData.join_reason}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700">
              Parrain (si vous en avez un)
            </label>
            <input
              type="text"
              name="sponsor"
              id="sponsor"
              value={formData.sponsor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer ma candidature'}
          </button>
        </div>
      </div>
    </form>
  )
}
