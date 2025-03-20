import { Metadata } from 'next'
import MembersList from '@/components/admin/MembersList'

export const metadata: Metadata = {
  title: 'Gérer les membres | Administration',
  description: 'Gestion des membres de La Guilde des Voyageurs',
}

export default function MembersPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Gérer les membres
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Liste complète des membres de La Guilde des Voyageurs
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <MembersList />
      </div>
    </div>
  )
}
