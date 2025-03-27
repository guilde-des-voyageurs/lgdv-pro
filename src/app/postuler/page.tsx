import { Metadata } from 'next'
import ApplicationForm from '@/components/public/ApplicationForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Postuler à la Guilde des Voyageurs | La Guilde des Voyageurs',
  description: 'Remplissez ce formulaire pour nous rejoindre. Notre équipe examinera votre candidature et vous recontactera dans les plus brefs délais.',
}

export default async function ApplicationPage() {
  // Vérifier que l'utilisateur n'est pas déjà connecté
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/compte')
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white shadow-lg sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-semibold text-gray-900">
                Postuler à la Guilde des Voyageurs
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Remplissez ce formulaire pour nous rejoindre. Notre équipe examinera votre candidature
                et vous recontactera dans les plus brefs délais.
              </p>
            </div>
            <ApplicationForm />
          </div>
        </div>
      </div>
    </div>
  )
}
