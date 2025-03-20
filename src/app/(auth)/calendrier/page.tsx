import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mon calendrier | La Guilde des Voyageurs',
  description: 'Gérez votre calendrier sur La Guilde des Voyageurs',
}

export default function CalendrierPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Mon calendrier</h1>
      <p className="mt-4 text-gray-600">
        Consultez et gérez vos événements.
      </p>
    </div>
  )
}
