import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

import { sidebarMenu } from './app/(dashboard)/_components/menu';
type RoleType = 'user' | 'admin';
export default withAuth(
  async function middleware(req) {
    const token: any = await getToken({ req });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token?.access}`,
      },
    });
    const data = await res?.json();
    console.log({ data, token });

    const isAuth = !!token && data?.statusCode !== 403;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Check if user is already authenticated and trying to visit login page
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/?expire=true', req.url));
    }

    const pathname = req.nextUrl.pathname; // "/dashboard"
    const role: RoleType = token?.role; // "student"

    const isAuthorized = sidebarMenu?.[role]?.findIndex((item) => {
      return item.link === pathname || item.link.startsWith(pathname.split(item.link)[0]);
    }); // { student: ["read"] }

    if (isAuth && !isAuthPage && isAuthorized === -1) {
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

      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
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
