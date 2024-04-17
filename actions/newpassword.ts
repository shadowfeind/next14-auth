'use server'

import { passwordResetTokenByToken } from "@/data/password-resetToken"
import { getUserByEmail } from "@/data/user"
import { PasswordSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from 'bcryptjs'
import { db } from "@/lib/db"

export const newPassword = async(values: z.infer<typeof PasswordSchema>, token?:string | null) => {
    if(!token) {
        return {
            error: "Missing token"
        }
    }

    const result = PasswordSchema.safeParse(values)

    if(!result.success){
        return {
            error: 'Invalid Fields'
        }
    }

    const { password } = result.data 

    const existingToken = await passwordResetTokenByToken(token)

    if(!existingToken){
        return { error: "Invalid token"}
    }

    const hadExpired = new Date(existingToken.expires) < new Date()

    if(hadExpired){
        return {
            error: "Token expired"
        }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if(!existingUser){
        return {
            error: 'Email doest not exists'
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.update({
        where: { id: existingToken.id},
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return { success: "Password changed"}
}