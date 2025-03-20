import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Événements | La Guilde des Voyageurs',
  description: 'Découvrez les événements de La Guilde des Voyageurs',
}

export default function EvenementsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Événements</h1>
      <p className="mt-4 text-gray-600">
        Découvrez tous les événements de la Guilde.
      </p>
    </div>
  )
}
