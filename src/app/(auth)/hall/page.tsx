import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hall de Guilde | La Guilde des Voyageurs',
  description: 'Bienvenue dans le Hall de la Guilde des Voyageurs',
}

export default function HallPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Hall de Guilde</h1>
      <p className="mt-4 text-gray-600">
        Bienvenue dans le Hall de la Guilde des Voyageurs.
      </p>
    </div>
  )
}
