'use server'

import { getUserByEmail } from "@/data/user"
import { getVerificationTokenBYToken } from "@/data/verification-token"
import { db } from "@/lib/db"


export const newVerification = async(token: string) => {
    const existingToken = await getVerificationTokenBYToken(token)

    if(!existingToken){
        return { error: "Token does not exists"}
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired){
        return { error: 'token expired'}
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser){
        return { error: 'user does not exists'}
    }


    //changing email if user ever want to change email
    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingUser.email
        }
    })

    await db.verificationToken.delete({
        where: {id: existingToken.id}
    })

    return { success: 'email verified'}
}