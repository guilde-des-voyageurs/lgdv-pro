'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navigation = [
  { name: 'Tableau de bord', href: '/admin' },
  { name: 'Gérer les membres', href: '/admin/membres' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête et menu */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Titre */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Administration
            </h1>
          </div>
          
          {/* Menu horizontal */}
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    pathname === item.href
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
