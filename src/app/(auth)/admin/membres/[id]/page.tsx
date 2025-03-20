import { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'
import EditMemberForm from '@/components/admin/EditMemberForm'

export const metadata: Metadata = {
  title: 'Modifier un membre | Administration',
  description: 'Modifier les informations d\'un membre de La Guilde des Voyageurs',
}

interface Props {
  params: {
    id: string
  }
}

export default async function EditMemberPage({ params }: Props) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Vérifier que l'utilisateur est admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/compte')
  }

  // Récupérer les informations du membre
  const { data: member } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!member) {
    redirect('/admin/membres')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modifier un membre</h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations du membre et cliquez sur Enregistrer pour sauvegarder les changements.
        </p>
      </div>

      <EditMemberForm member={member} />
    </div>
  )
}
