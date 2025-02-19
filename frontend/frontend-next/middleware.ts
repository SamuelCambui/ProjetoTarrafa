import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const publicRoutes = ["/", "/login"];

export default async function middleware(req: NextRequest) {
  // const path = req.nextUrl.pathname;
  // const isProtectedRoute = !publicRoutes.includes(path);

  // const cookie = cookies().get("session")?.value;
  // const session = await decrypt(cookie);
  // if (isProtectedRoute && !session?.user) {
  //   return NextResponse.redirect(new URL("/login", req.nextUrl));
  // }

  

  // if (!isProtectedRoute && session?.user) {
  //   return NextResponse.redirect(
  //     new URL(`/ppgls/${session.user.idIes}`, req.nextUrl)
  //     // new URL(`/ppgls/3727`, req.nextUrl)
  //   );
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
