import { Metadata } from 'next'
import DetailedRegisterForm from '@/components/auth/DetailedRegisterForm'

export const metadata: Metadata = {
  title: 'Inscription | La Guilde des Voyageurs',
  description: 'Rejoignez La Guilde des Voyageurs',
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 py-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Rejoindre La Guilde
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a href="/connexion" className="font-medium text-blue-600 hover:text-blue-500">
              connectez-vous à votre compte
            </a>
          </p>
        </div>

        <DetailedRegisterForm />
      </div>
    </main>
  )
}
