'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type MemberType = 'marque' | 'auteur' | 'artisan' | 'restaurateur' | 'artiste' | 'autre'

interface FormData {
  email: string
  charterSigned: boolean
  joinReason: string
  sponsor: string
  memberType: MemberType
  description: string
  phone: string
  postalAddress: string
  siret: string
  managerName: string
  websiteUrl: string
  instagramUrl: string
  tiktokUrl: string
}

export default function DetailedRegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    charterSigned: false,
    joinReason: '',
    sponsor: '',
    memberType: 'autre',
    description: '',
    phone: '',
    postalAddress: '',
    siret: '',
    managerName: '',
    websiteUrl: '',
    instagramUrl: '',
    tiktokUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Créer le compte avec magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            charter_signed: formData.charterSigned,
            join_reason: formData.joinReason,
            sponsor: formData.sponsor,
            member_type: formData.memberType,
            description: formData.description,
            phone: formData.phone,
            postal_address: formData.postalAddress,
            siret: formData.siret,
            manager_name: formData.managerName,
            website_url: formData.websiteUrl,
            instagram_url: formData.instagramUrl,
            tiktok_url: formData.tiktokUrl,
            status: 'pending'
          }
        }
      })

      if (authError) throw authError

      // Rediriger vers la page de confirmation
      router.push(`/inscription/confirmation?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email professionnel *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="memberType" className="block text-sm font-medium text-gray-700">
            Type de membre *
          </label>
          <select
            id="memberType"
            required
            value={formData.memberType}
            onChange={(e) => setFormData(prev => ({ ...prev, memberType: e.target.value as MemberType }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="marque">Marque</option>
            <option value="auteur">Auteur</option>
            <option value="artisan">Artisan</option>
            <option value="restaurateur">Restaurateur</option>
            <option value="artiste">Artiste</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description de votre activité *
          </label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="joinReason" className="block text-sm font-medium text-gray-700">
            Pourquoi souhaitez-vous rejoindre La Guilde ? *
          </label>
          <textarea
            id="joinReason"
            required
            value={formData.joinReason}
            onChange={(e) => setFormData(prev => ({ ...prev, joinReason: e.target.value }))}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700">
            Parrain
          </label>
          <input
            id="sponsor"
            type="text"
            value={formData.sponsor}
            onChange={(e) => setFormData(prev => ({ ...prev, sponsor: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Si un membre vous a recommandé, indiquez son nom
          </p>
        </div>

        <div>
          <label htmlFor="managerName" className="block text-sm font-medium text-gray-700">
            Nom du responsable *
          </label>
          <input
            id="managerName"
            type="text"
            required
            value={formData.managerName}
            onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone *
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="postalAddress" className="block text-sm font-medium text-gray-700">
            Adresse postale *
          </label>
          <textarea
            id="postalAddress"
            required
            value={formData.postalAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, postalAddress: e.target.value }))}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
            SIRET *
          </label>
          <input
            id="siret"
            type="text"
            required
            value={formData.siret}
            onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            Site web
          </label>
          <input
            id="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700">
            Instagram
          </label>
          <input
            id="instagramUrl"
            type="url"
            value={formData.instagramUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.instagram.com/votre_compte"
          />
        </div>

        <div>
          <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-700">
            TikTok
          </label>
          <input
            id="tiktokUrl"
            type="url"
            value={formData.tiktokUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, tiktokUrl: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.tiktok.com/@votre_compte"
          />
        </div>

        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="charterSigned"
              type="checkbox"
              required
              checked={formData.charterSigned}
              onChange={(e) => setFormData(prev => ({ ...prev, charterSigned: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="charterSigned" className="font-medium text-gray-700">
              Je confirme avoir lu et accepté la charte de La Guilde *
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Inscription...' : 'Candidater'}
        </button>
      </div>
    </form>
  )
}
