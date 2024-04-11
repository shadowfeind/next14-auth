import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { LOGIN_REDIRECT, authPrefix, authRoutes, publicRoutes } from "./routes"

const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(authPrefix)
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

  if(isApiAuthRoute) return null 

  if(isAuthRoutes){
    if(isLoggedIn){
        return Response.redirect((new URL(LOGIN_REDIRECT, nextUrl)))
    }
    return null
  }

  // if(!isLoggedIn && !isPublicRoutes){
  //   return Response.redirect(new URL("/auth/login", nextUrl))
  // }

  return null
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  }