'use client'

import { useState } from 'react'
import { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Event = Database['public']['Tables']['events']['Row']
type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'organizer_id'>

interface EventFormProps {
  event?: Event
  onSuccess: () => void
  onCancel: () => void
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventInput>({
    name: event?.name || '',
    date: event?.date || '',
    type: event?.type || 'medieval_festival',
    description: event?.description || '',
    location: event?.location || '',
    status: event?.status || 'draft',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Utilisateur non authentifié')
      }

      if (event?.id) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('events')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', event.id)

        if (updateError) throw updateError
      } else {
        // Create new event
        const { error: insertError } = await supabase.from('events').insert([
          {
            ...formData,
            organizer_id: user.id,
          },
        ])

        if (insertError) throw insertError
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nom de l&apos;événement
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          required
          value={formData.date.split('T')[0]}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value + 'T00:00:00Z' })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type d&apos;événement
        </label>
        <select
          id="type"
          required
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as Event['type'],
            })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="medieval_festival">Festival Médiéval</option>
          <option value="music_festival">Festival de Musique</option>
          <option value="fantasy_convention">Convention Fantasy</option>
          <option value="geek_pop_culture">Culture Geek/Pop</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Lieu
        </label>
        <input
          type="text"
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Statut
        </label>
        <select
          id="status"
          required
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as Event['status'],
            })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'En cours...' : event ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
