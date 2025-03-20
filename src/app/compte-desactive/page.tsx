import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Compte désactivé | La Guilde des Voyageurs',
  description: 'Votre compte a été désactivé',
}

export default function DisabledAccountPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-lg font-medium text-gray-900">
              Votre compte a été désactivé
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Votre compte n&apos;est plus actif. Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter l&apos;équipe d&apos;administration.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
