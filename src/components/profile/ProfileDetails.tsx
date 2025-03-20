'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface Profile {
  id: string
  email: string
  nom_responsable: string
  type_membre: string
  description: string
  raison_adhesion: string
  sponsor: string
  date_inscription: string
  telephone: string
  adresse_postale: string
  siret: string
  site_web?: string
  instagram?: string
  tiktok?: string
  logo_url?: string
  is_admin: boolean
  charte_signee: boolean
}

export default function ProfileDetails() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Erreur lors de la récupération du profil:', error)
        } else {
          setProfile(data)
        }
      }
      
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-red-600">
        Erreur lors du chargement du profil
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex items-start space-x-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          {profile.logo_url ? (
            <Image
              src={profile.logo_url}
              alt="Logo"
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Pas de logo</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{profile.nom_responsable}</h2>
          <p className="mt-1 text-sm text-gray-500">{profile.type_membre}</p>
          <div className="mt-4 text-gray-700">{profile.description}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
              <dd className="mt-1">{profile.telephone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Adresse</dt>
              <dd className="mt-1">{profile.adresse_postale}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">SIRET</dt>
              <dd className="mt-1">{profile.siret}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date d&apos;inscription</dt>
              <dd className="mt-1">{new Date(profile.date_inscription).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Adhésion</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Sponsor</dt>
              <dd className="mt-1">{profile.sponsor}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Raison d&apos;adhésion</dt>
              <dd className="mt-1">{profile.raison_adhesion}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Charte signée</dt>
              <dd className="mt-1">
                {profile.charte_signee ? (
                  <span className="text-green-600">Oui</span>
                ) : (
                  <span className="text-red-600">Non</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.site_web && (
              <a
                href={profile.site_web}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" />
                </svg>
                <span>Site web</span>
              </a>
            )}
            {profile.instagram && (
              <a
                href={`https://instagram.com/${profile.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-pink-600 hover:text-pink-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C7.283 0 6.944.012 5.877.06 4.812.11 4.087.278 3.45.525a4.901 4.901 0 0 0-1.772 1.153A4.902 4.902 0 0 0 .525 3.45C.278 4.087.109 4.812.06 5.877.012 6.944 0 7.283 0 10s.012 3.056.06 4.123c.049 1.065.218 1.79.465 2.427a4.902 4.902 0 0 0 1.153 1.772 4.902 4.902 0 0 0 1.772 1.153c.637.247 1.362.416 2.427.465 1.067.048 1.407.06 4.123.06s3.056-.012 4.123-.06c1.065-.049 1.79-.218 2.427-.465a4.902 4.902 0 0 0 1.772-1.153 4.902 4.902 0 0 0 1.153-1.772c.247-.637.416-1.362.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.065-.218-1.79-.465-2.427a4.902 4.902 0 0 0-1.153-1.772A4.902 4.902 0 0 0 16.55.525C15.913.278 15.188.109 14.123.06 13.056.012 12.717 0 10 0Zm0 1.802c2.67 0 2.986.01 4.04.058.975.045 1.504.207 1.857.344.466.181.8.398 1.15.748.35.35.566.684.748 1.15.137.353.3.882.344 1.857.048 1.054.058 1.37.058 4.041 0 2.67-.01 2.986-.058 4.04-.045.975-.207 1.504-.344 1.857a3.1 3.1 0 0 1-.748 1.15 3.1 3.1 0 0 1-1.15.748c-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.975-.045-1.504-.207-1.857-.344a3.098 3.098 0 0 1-1.15-.748 3.098 3.098 0 0 1-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.975.207-1.504.344-1.857.181-.466.398-.8.748-1.15.35-.35.684-.567 1.15-.748.353-.137.882-.3 1.857-.344 1.054-.048 1.37-.058 4.04-.058l.045.03Zm0 3.063a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27Zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666Zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
                </svg>
                <span>Instagram</span>
              </a>
            )}
            {profile.tiktok && (
              <a
                href={`https://tiktok.com/@${profile.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-900 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.69 0h2.878c.255 2.255.91 3.777 3.232 3.989v2.938c-1.715.14-2.93-.436-4.076-1.325v5.846c0 7.442-8.864 9.747-12.534 4.419C-1.58 13.37-.388 8.216 4.095 7.474v3.03c-.374.078-.742.177-1.102.296-1.292.428-2.01 1.276-1.85 2.62.322 2.692 4.955 3.497 4.553-.577V0h2.877v.07c.01 2.989-.013 11.921-.013 11.921.01 2.445 2.367 3.436 3.652 1.716.393-.526.591-1.135.596-1.767 0 0 .009-7.087.009-8.731V0h-.127Z" />
                </svg>
                <span>TikTok</span>
              </a>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}
