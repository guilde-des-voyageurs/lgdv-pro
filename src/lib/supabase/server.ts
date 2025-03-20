import { createServerClient } from '@supabase/ssr'
import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { cookies } from 'next/headers'

/**
 * Crée un client Supabase pour les opérations serveur.
 * 
 * Cette fonction est utilisée pour initialiser le client Supabase avec les informations 
 * de connexion et la gestion des cookies.
 * 
 * @returns Le client Supabase créé.
 */
export function createClient() {
  const cookieStore = cookies() as unknown as RequestCookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL du serveur Supabase
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Clé anonyme de Supabase
    {
      /**
       * Gestion des cookies pour le client Supabase.
       * 
       * Cette partie est responsable de la récupération, du stockage et de la suppression 
       * des cookies. Cependant, pour des raisons de sécurité et de conformité, 
       * les modifications des cookies sont désactivées en dehors des Server Actions.
       */
      cookies: {
        /**
         * Récupère la valeur d'un cookie spécifique.
         * 
         * @param name Nom du cookie à récupérer.
         * @returns La valeur du cookie si trouvé, sinon une chaîne vide.
         */
        get(name: string) {
          return cookieStore.get(name)?.value ?? '' // Retourne la valeur du cookie ou une chaîne vide si non trouvé
        },
        /**
         * Définit la valeur d'un cookie.
         * 
         * Note : Cette fonction est désactivée pour empêcher la modification des cookies 
         * en dehors des Server Actions ou des Route Handlers.
         * 
         * @param name Nom du cookie à définir.
         * @param value Valeur à attribuer au cookie.
         * @param options Options supplémentaires pour le cookie (chemin, durée de vie, domaine, sécurité).
         */
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          // Les cookies ne peuvent être modifiés que dans les Server Actions ou les Route Handlers
          // Cette fonction sera appelée par Supabase mais ne fera rien en dehors des actions serveur
          return
        },
        /**
         * Supprime un cookie spécifique.
         * 
         * Note : Cette fonction est désactivée pour empêcher la suppression des cookies 
         * en dehors des Server Actions ou des Route Handlers.
         * 
         * @param name Nom du cookie à supprimer.
         * @param options Options pour la suppression (chemin, domaine).
         */
        remove(name: string, options: { path?: string; domain?: string }) {
          // Les cookies ne peuvent être modifiés que dans les Server Actions ou les Route Handlers
          // Cette fonction sera appelée par Supabase mais ne fera rien en dehors des actions serveur
          return
        }
      }
    }
  )
}
