import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion | La Guilde des Voyageurs',
  description: 'Connectez-vous à votre espace professionnel',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            La Guilde des Voyageurs
          </h1>
          <h2 className="mt-6 text-center text-xl text-gray-600">
            Connectez-vous à votre espace
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a href="/inscription" className="font-medium text-blue-600 hover:text-blue-500">
              inscrivez-vous pour nous rejoindre
            </a>
          </p>
        </div>

        <LoginForm />

        <div className="mt-4 text-center">
          <a
            href="/mot-de-passe-oublie"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </main>
  )
}
