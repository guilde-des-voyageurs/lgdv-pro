import Link from 'next/link'

export default function CouronnesPage() {
  return (
    <main>
      <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center">
            Les Couronnes de la Guilde
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
            Notre monnaie locale qui récompense votre engagement
          </p>

          {/* Comment ça marche */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comment ça marche ?</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="relative p-6 shadow-sm ring-1 ring-gray-900/5 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Gagnez des Couronnes
                </h3>
                <p className="mt-3 text-base leading-7 text-gray-600">
                  Recevez des Couronnes à chaque interaction avec le réseau : recommandations, partages d&apos;expérience, contributions aux projets communs.
                </p>
              </div>
              <div className="relative p-6 shadow-sm ring-1 ring-gray-900/5 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  Dépensez-les
                </h3>
                <p className="mt-3 text-base leading-7 text-gray-600">
                  Utilisez vos Couronnes pour obtenir des réductions auprès de nos partenaires ou pour accéder à des services exclusifs du réseau.
                </p>
              </div>
            </div>
          </div>

          {/* Avantages */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Les avantages des Couronnes</h2>
            <ul className="space-y-4">
              <li className="flex gap-x-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Cashback local.</strong>
                  <p className="mt-1 text-gray-600">Un système de récompense qui encourage l&apos;économie locale et les échanges au sein du réseau.</p>
                </div>
              </li>
              <li className="flex gap-x-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Réseau de partenaires.</strong>
                  <p className="mt-1 text-gray-600">Accédez à des offres exclusives auprès de nos partenaires sélectionnés.</p>
                </div>
              </li>
              <li className="flex gap-x-3">
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-indigo-600">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Engagement récompensé.</strong>
                  <p className="mt-1 text-gray-600">Plus vous contribuez au réseau, plus vous gagnez de Couronnes à utiliser.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/postuler"
              className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Rejoignez la Guilde
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
