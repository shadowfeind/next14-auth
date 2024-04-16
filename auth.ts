import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { db } from "./lib/db"

// db session doesnot work in edge
//we are using auth.config as prisma does not support edge
export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }){
      if(token.sub && session.user){
        session.user.id = token.sub
      }
      return session
    }
    ,
    async jwt ({token}){
      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})