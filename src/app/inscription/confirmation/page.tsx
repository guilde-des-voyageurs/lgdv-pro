import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inscription en attente | La Guilde des Voyageurs',
  description: 'Votre inscription est en cours de traitement',
}

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const email = searchParams.email as string

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-lg font-medium text-gray-900">
              Votre inscription a bien été prise en compte
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Un email vous sera envoyé sur {email} vous informant de la validation de votre candidature ou de son refus.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Retour à l&apos;accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
