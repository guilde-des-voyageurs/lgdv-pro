import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion | La Guilde des Voyageurs',
  description: 'Connectez-vous à votre espace',
}

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si l'utilisateur est déjà connecté, le rediriger vers son compte
  if (user) {
    redirect('/compte')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            La Guilde des Voyageurs
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre espace
          </p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous n&apos;êtes pas encore membre ?{' '}
            <Link
              href="/postuler"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Postulez pour nous rejoindre
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
