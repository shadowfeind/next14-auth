"use server"
import { RegisterSchema } from "@/schemas"
import * as z from "zod"
import bcrypt from 'bcryptjs'
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/email"

export const register = async(values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if(!validatedFields.success) return {error: "Invalid Fields"}

    const { email, name, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const userExists = await getUserByEmail(email)

    if(userExists) return {error: "email already in use"}

    await db.user.create({
      data:{
         name,
         email,
         password: hashedPassword
      }
    })

    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)
 
    return {success: "Confrimation email send"}
 }