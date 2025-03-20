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

  // Rafraîchir la session si elle existe
  await supabase.auth.getSession()

  // Protéger les routes qui nécessitent une authentification
  const isAuthPage = request.nextUrl.pathname.startsWith('/connexion') ||
    request.nextUrl.pathname.startsWith('/inscription') ||
    request.nextUrl.pathname.startsWith('/auth/callback')

  const { data: { session } } = await supabase.auth.getSession()

  // Si l'utilisateur est sur une page auth alors qu'il est déjà connecté
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/hall', request.url))
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!isAuthPage && !session && (
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
      .eq('id', session?.user.id)
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
    '/inscription',
    '/inscription/confirmation',
    '/auth/callback'
  ],
}
