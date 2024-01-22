"use server"
import { LoginSchema, RegisterSchema } from "@/schemas"
import * as z from "zod"
import bcrypt from 'bcrypt'
import { db } from "@/lib/db"

export const register = async(values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)
    if(!validatedFields.success) return {error: "Invalid Fields"}

    const { email, name, password } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const userExists = await db.user.findUnique({
      where:{
         email
      }
    })

    if(userExists) return {error: "email already in use"}

    await db.user.create({
      data:{
         name,
         email,
         password: hashedPassword
      }
    })
 
    return {success: "User created"}
 }