import { getVerificationTokenByEmail } from '@/data/verification-token'
import { v4 as uuidv4 } from 'uuid'
import { db } from './db'
import { passwordResetTokenByEmail } from '@/data/password-resetToken'


export const generateVerificationToken = async( email:string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // expires in 1hr

    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken){
        await db.verificationToken.delete({
            where: {id: existingToken.id}
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,token, expires
        }
    })

    return verificationToken
}

export const generatePasswordResetToekn = async(email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // expires in 1hr

    const existingToken = await passwordResetTokenByEmail(email)

    if(existingToken){
        await db.passwordResetToken.delete({
            where: {id: existingToken.id}
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,token, expires
        }
    })

    return passwordResetToken
}