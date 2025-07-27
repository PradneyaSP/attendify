import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from './lib/cookiesServer';

export async function middleware(req: NextRequest) {
    // const pathname = req.nextUrl.pathname;
    // const isLogin = pathname.startsWith("/login");
    // const isSignUp = pathname.startsWith("/sign-up");
    // const sensitiveRoutes = ["/dashboard"];
    // const isAccessingSensitiveRoutes = sensitiveRoutes.some((route) => pathname.startsWith(route));

    // // Retrieve user cookie to check if user is authenticated
    // const user = await getCookie('user');

    // if (user) {
    //     if (isLogin || isSignUp) {
    //         return NextResponse.redirect(new URL("/dashboard", req.url));
    //     }
    //     if (isAccessingSensitiveRoutes) {
    //         return NextResponse.next(); // Allow access to sensitive routes
    //     }
    // } else {
    //     if (isAccessingSensitiveRoutes) {
    //         return NextResponse.redirect(new URL("/login", req.url));
    //     }
    // }

    return NextResponse.next(); // Allow access to public routes
}

export const config = {
    matcher: ["/", "/login", "/sign-up", "/dashboard/:path*"],
};
