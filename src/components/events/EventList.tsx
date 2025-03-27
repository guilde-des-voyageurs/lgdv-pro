'use client'

import { useState } from 'react'
import { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'

type Event = Database['public']['Tables']['events']['Row']

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching events:', error)
        return
      }

      setEvents(data || [])
      setLoading(false)
    }

    fetchEvents()
  }, [supabase])

  const getEventTypeLabel = (type: Event['type']) => {
    const labels = {
      medieval_festival: 'Festival Médiéval',
      music_festival: 'Festival de Musique',
      fantasy_convention: 'Convention Fantasy',
      geek_pop_culture: 'Culture Geek/Pop',
    }
    return labels[type]
  }

  if (loading) {
    return <div>Chargement des événements...</div>
  }

  return (
    <div className="space-y-8">
      {events.length === 0 ? (
        <p className="text-gray-500">Aucun événement à venir.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {event.name}
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="mr-2 h-5 w-5" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {getEventTypeLabel(event.type)}
                </span>
              </div>
              {event.description && (
                <p className="mt-4 text-sm text-gray-600">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
