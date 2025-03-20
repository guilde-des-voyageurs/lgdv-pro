import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
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
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
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

  // Récupérer l'utilisateur authentifié de manière sécurisée
  const { data: { user } } = await supabase.auth.getUser()

  // Si l'utilisateur est connecté et essaie d'accéder à une page publique
  if (user && (
    request.nextUrl.pathname === '/connexion'
  )) {
    return NextResponse.redirect(new URL('/hall', request.url))
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!user && (
    request.nextUrl.pathname.startsWith('/hall') ||
    request.nextUrl.pathname.startsWith('/compte') ||
    request.nextUrl.pathname.startsWith('/calendrier') ||
    request.nextUrl.pathname.startsWith('/evenements') ||
    request.nextUrl.pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // Si l'utilisateur essaie d'accéder à la page admin sans être admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user?.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/hall', request.url))
    }
  }

  return response
}

// Configurer les routes qui déclenchent le middleware
export const config = {
  matcher: [
    '/hall/:path*',
    '/compte/:path*',
    '/calendrier/:path*',
    '/evenements/:path*',
    '/admin/:path*',
    '/connexion',
    '/auth/callback'
  ],
}
