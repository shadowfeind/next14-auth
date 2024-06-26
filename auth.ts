import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/twofactor-confirmation"

// db session doesnot work in edge
//we are using auth.config as prisma does not support edge
export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({user}){
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date()}
      })
    } 
  },
  callbacks: {
    async signIn({user, account}){
      //allow oauth without email verification
      if(account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id)

      //preventing singn without email verification
      if(!existingUser?.emailVerified) return false

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if(!twoFactorConfirmation) return false

        //Delete 2fa for next login
        await db.twoFactorConfirmation.delete({
          where: {id: twoFactorConfirmation.id}
        })
      }

      return true
    },
    async session({ session, token }: any){
      if(token.sub && session.user){
        session.user.id = token.sub
      }
      if(token.role && session.user){
        session.user.role = token.role
      }
      return session
    },
    async jwt ({token}){
      if(!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if(!existingUser) return token 

      token.role = existingUser.role 

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})