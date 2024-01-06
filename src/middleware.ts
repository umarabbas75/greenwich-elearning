import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

import { siderbarmenu } from './app/(dashboard)/_components/menu';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });

    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Check if user is already authenticated and trying to visit login page
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const pathname = req.nextUrl.pathname; // "/dashboard"
    const role = token?.role; // "Manager"
    const currentPathAuthorizationSettings = siderbarmenu.find(
      (item) => item.link === pathname,
    ); // { Manager: ["read"] }
    const currentPathPermissions =
      currentPathAuthorizationSettings?.role?.includes(role as any); // { Manager: ["read"] }

    if (isAuth && !isAuthPage && !currentPathPermissions) {
      return new NextResponse('You are not authorized!');
    }

    if (isAuthPage) {
      return null; // Continue to render the login page for unauthenticated users
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  },
);
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|assets|favicon.ico).*)'],
};
