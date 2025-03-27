import Link from 'next/link'

export default function ManifestePage() {
  return (
    <main>
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-center">
              Manifeste
            </h1>

            {/* Introduction */}
            <div className="mt-16 space-y-8 text-lg leading-8 text-gray-600">
              <p className="italic text-xl">
                Nous vivons une époque étrange. Notre confort ne fut jamais si grand de toute notre Histoire, 
                et pourtant, nous n&apos;avons jamais été aussi nombreux à ne pas nous sentir à notre place.
              </p>

              <p>
                Comme si la vie moderne nous avait offert en practicité ce qu&apos;elle nous volait en sens. 
                Ce sens, cette magie, beaucoup tentent de la retrouver à travers les oeuvres de fiction qui 
                font l&apos;éloge de ces valeurs humaines millénaires et qui nous parlent d&apos;aventure, de bravoure, 
                de fraternité et de fierté.
              </p>

              <p>
                D&apos;autres, en plongeant dans de vieilles époques reculées, par l&apos;Histoire et le patrimoine, 
                auxquelles on apprécie se raccrocher pour ressentir de l&apos;authenticité, de la grandeur et de 
                la poésie. Enfin, il en est qui regarde vers l&apos;avenir en espérant que celui-ci apporte les 
                solutions aux problèmes de notre temps, qu&apos;ils soient humains ou environnementaux.
              </p>

              <p className="font-semibold text-gray-900">
                La Guilde des Voyageurs propose une aventure nouvelle d&apos;économie circulaire, à la manière 
                d&apos;un réseau professionnel et créatif solidaire. Comme un grand continent inconnu à explorer, 
                ou une nation abstraite à fonder. Celle de ressuciter le meilleur du passé, et de le joindre 
                au meilleur du présent. Pour redonner un sens. Pour réenchanter le monde moderne.
              </p>

              <p className="text-xl font-medium text-indigo-600 text-center">
                Telle est la philosophie de la Guilde des Voyageurs.
              </p>
            </div>

            {/* Comment section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-8">
                Comment ?
              </h2>

              <div className="space-y-8 text-lg leading-8 text-gray-600">
                <p>
                  Créer une véritable guilde moderne. D&apos;un côté, un réseau de professionnels engagés qui 
                  forment une économie circulaire qui favorise les opportunités, de l&apos;autre des milliers 
                  de clients qui participent à leur niveau à cette toile de fond et profitent d&apos;avantages 
                  uniques, de commerces certifiés et de l&apos;esprit de camaraderie propre à notre communauté.
                </p>

                <p className="font-medium">La Guilde opère en fond de tâche.</p>

                <div className="grid gap-8 sm:grid-cols-2 mt-12">
                  <div className="relative bg-white/50 p-6 shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900 mb-4">
                      Pour les professionnels
                    </h3>
                    <p className="text-base leading-7 text-gray-600">
                      Elle aide et coordonne des acteurs professionnels pour voir émerger et soutenir 
                      des projets innovants ou des événements en accord avec son constat d&apos;écrit dans 
                      son Manifeste.
                    </p>
                  </div>
                  <div className="relative bg-white/50 p-6 shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900 mb-4">
                      Pour les clients
                    </h3>
                    <p className="text-base leading-7 text-gray-600">
                      Elle propose une expérience client unique sur tout un réseau économique, avec une 
                      monnaie locale de guilde qui encourage les entreprises autant que les clients.
                    </p>
                  </div>
                </div>

                <p className="text-xl font-medium text-center mt-12">
                  Elle est à la fois économique, humaine, déterminée.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 flex justify-center gap-4">
              <Link
                href="/postuler"
                className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Rejoindre l&apos;aventure
              </Link>
              <Link
                href="/couronnes"
                className="rounded-md bg-white px-8 py-3 text-base font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-gray-50"
              >
                Découvrir les Couronnes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
