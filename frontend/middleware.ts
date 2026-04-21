import { NextRequest, NextResponse } from 'next/server';

// Routes protégées (nécessitent authentification)
const protectedRoutes = [
  '/my-listings',
  '/favorites',
  '/messages',
  '/profile',
  '/listings/create',
  '/admin',
];

// Routes publiques
const publicRoutes = ['/login', '/register', '/listings'];

// Routes d'authentification redirigeant vers l'accueil si déjà connecté
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('auth_role')?.value;
  const isAuthenticated = !!token;

  // Si l'utilisateur est sur une route d'auth et est déjà connecté
  if (authRoutes.includes(pathname) && isAuthenticated) {
    const destination = role === 'moderator' ? '/admin' : '/my-listings';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Si l'utilisateur essaie d'accéder à une route protégée sans authentification
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Contrôle d'accès admin
  if (pathname.startsWith('/admin') && role !== 'moderator') {
    return NextResponse.redirect(new URL('/my-listings', request.url));
  }

  // Redirection pour les routes qui commencent par (dashboard)
  if (pathname.startsWith('/(dashboard)') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Correspond à tous les chemins sauf:
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
