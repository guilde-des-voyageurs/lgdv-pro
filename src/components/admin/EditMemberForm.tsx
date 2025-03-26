'use client'

import { useState, useEffect } from 'react'
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
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: member.id,
    created_at: member.created_at,
    updated_at: member.updated_at,
    email: member.email,
    company_name: member.company_name || '',
    status: member.status as 'active' | 'pending_review',
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

  const [cotisation, setCotisation] = useState({
    status: 'unpaid' as 'paid' | 'unpaid',
    amount: '',
    year: new Date().getFullYear(),
  })

  const [cotisationsHistory, setCotisationsHistory] = useState<Array<{
    id: string;
    year: number;
    status: 'paid' | 'unpaid';
    amount: string;
    paid_at: string | null;
  }>>([])

  const [loadingCotisation, setLoadingCotisation] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const supabase = createClient()

  useEffect(() => {
    const loadCotisation = async () => {
      try {
        const currentYear = new Date().getFullYear()
        const { data, error } = await supabase
          .from('cotisations')
          .select('*')
          .eq('profile_id', member.id)
          .eq('year', currentYear)
          .single()

        if (error && error.code !== 'PGRST116') { 
          throw error
        }

        if (data) {
          setCotisation({
            status: data.status,
            amount: data.amount?.toString() || '',
            year: data.year,
          })
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la cotisation:', err)
      } finally {
        setLoadingCotisation(false)
      }
    }

    loadCotisation()
  }, [member.id, supabase])

  useEffect(() => {
    const loadCotisations = async () => {
      try {
        const { data, error } = await supabase
          .from('cotisations')
          .select('*')
          .eq('profile_id', member.id)
          .order('year', { ascending: false })

        if (error) throw error

        if (data) {
          // Mettre à jour l'historique
          setCotisationsHistory(data.map(item => ({
            id: item.id,
            year: item.year,
            status: item.status,
            amount: item.amount?.toString() || '',
            paid_at: item.paid_at
          })))

          // Mettre à jour la cotisation actuelle si elle existe
          const currentYearCotisation = data.find(item => item.year === selectedYear)
          if (currentYearCotisation) {
            setCotisation({
              status: currentYearCotisation.status,
              amount: currentYearCotisation.amount?.toString() || '',
              year: currentYearCotisation.year,
            })
          } else {
            // Réinitialiser pour la nouvelle année
            setCotisation({
              status: 'unpaid',
              amount: '',
              year: selectedYear,
            })
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des cotisations:', err)
      } finally {
        setLoadingCotisation(false)
      }
    }

    loadCotisations()
  }, [member.id, selectedYear, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Mise à jour du profil
      const { error: profileError } = await supabase
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

      if (profileError) throw profileError

      // Mise à jour de la cotisation
      const { error: cotisationError } = await supabase
        .from('cotisations')
        .upsert({
          profile_id: member.id,
          year: cotisation.year,
          status: cotisation.status,
          amount: cotisation.amount ? parseFloat(cotisation.amount) : null,
          updated_at: new Date().toISOString(),
          ...(cotisation.status === 'paid' ? { paid_at: new Date().toISOString() } : { paid_at: null })
        }, {
          onConflict: 'profile_id,year'
        })

      if (cotisationError) throw cotisationError

      router.refresh()
      router.push('/admin/membres')
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'member_type' && value !== '' && !['marque', 'artisan', 'artiste', 'restaurateur', 'auteur', 'autre'].includes(value)) {
      setError('Type de membre invalide')
      return
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]

    try {
      setLoading(true)
      setUploadError(null)

      const supabase = createClient()
      
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
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l\'upload du logo')
    } finally {
      setLoading(false)
    }
  }

  const handleCotisationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCotisation(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value))
  }

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = Math.min(...cotisationsHistory.map(c => c.year), currentYear)
    const years: number[] = []
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year)
    }
    // Ajouter l'année suivante pour permettre la préparation
    years.unshift(currentYear + 1)
    return years
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
        <div className="col-span-full">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            {formData.logo_url && (
              <Image
                src={formData.logo_url}
                alt="Logo de l'entreprise"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            )}
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                file:cursor-pointer cursor-pointer"
            />
          </div>
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
          {loading && (
            <p className="mt-2 text-sm text-gray-500">Upload en cours...</p>
          )}
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

        {/* Cotisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Année */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Année
            </label>
            <select
              id="year"
              name="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Statut de la cotisation */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Statut de la cotisation
            </label>
            <select
              id="status"
              name="status"
              value={cotisation.status}
              onChange={handleCotisationChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="unpaid">Non payée</option>
              <option value="paid">Payée</option>
            </select>
          </div>

          {/* Montant de la cotisation */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Montant de la cotisation
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={cotisation.amount}
              onChange={handleCotisationChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Historique des cotisations */}
        <div>
          <h2 className="text-lg font-medium text-gray-700">Historique des cotisations</h2>
          <ul className="mt-2">
            {cotisationsHistory.map(cotisation => (
              <li key={cotisation.id} className="py-2">
                <span className="text-sm text-gray-700">{cotisation.year} - {cotisation.status}</span>
                {cotisation.paid_at && (
                  <span className="ml-2 text-sm text-gray-500">Payée le {new Date(cotisation.paid_at).toLocaleString('fr-FR')}</span>
                )}
              </li>
            ))}
          </ul>
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
