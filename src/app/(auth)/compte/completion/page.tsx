'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function CompletionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      setError('Le fichier est trop volumineux. Maximum 5MB.')
      return
    }

    // Vérifier le type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      // Upload du logo
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ logo_url: publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user?.id)

      if (updateError) throw updateError

      // Rediriger vers le tableau de bord
      router.push('/compte')
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex justify-center p-4">
      <div className="max-w-md w-full space-y-8 py-12">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Dernière étape
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ajoutez votre logo pour compléter votre profil
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logo de votre entreprise *
          </label>
          <input
            id="logo"
            type="file"
            required
            disabled={loading}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="mt-1 block w-full disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            Format JPG, PNG, WebP ou GIF, taille maximale 5MB
          </p>
        </div>

        {loading && (
          <div className="text-center text-sm text-gray-600">
            Upload en cours...
          </div>
        )}
      </div>
    </main>
  )
}
