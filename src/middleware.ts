import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // @ts-ignore - Les types de Next.js ne sont pas à jour
          response.cookies.set({
            name,
            value,
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          })
        },
        remove(name: string, options: CookieOptions) {
          // @ts-ignore - Les types de Next.js ne sont pas à jour
          response.cookies.set({
            name,
            value: '',
            ...options,
            path: '/',
            maxAge: 0,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && request.nextUrl.pathname === '/compte') {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  if (session && (
    request.nextUrl.pathname === '/connexion' || 
    request.nextUrl.pathname === '/mot-de-passe-oublie'
  )) {
    return NextResponse.redirect(new URL('/compte', request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/compte', '/connexion', '/mot-de-passe-oublie']
}
