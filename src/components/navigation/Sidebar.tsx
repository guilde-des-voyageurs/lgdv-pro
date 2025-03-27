'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface NavigationItem {
  name: string
  href: string
  icon: typeof UserCircleIcon
  requiresAdmin?: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Mon compte', href: '/compte', icon: UserCircleIcon },
  { name: 'Admin', href: '/admin', icon: ShieldCheckIcon, requiresAdmin: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(data?.is_admin || false)
      }
    }

    checkAdminStatus()
  }, [])

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation
            .filter(item => !item.requiresAdmin || isAdmin)
            .map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-gray-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-6 w-6 flex-shrink-0
                      ${isActive
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
        </nav>
      </div>
    </div>
  )
}
