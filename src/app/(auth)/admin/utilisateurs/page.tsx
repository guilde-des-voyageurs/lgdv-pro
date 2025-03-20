import { Metadata } from 'next'
import UserManagement from '@/components/admin/UserManagement'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Gestion des utilisateurs | La Guilde des Voyageurs',
  description: 'Administration des utilisateurs de La Guilde des Voyageurs',
}

export default async function UsersPage() {
  // Vérifier que l'utilisateur est admin
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/hall')
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <UserManagement />
    </div>
  )
}
