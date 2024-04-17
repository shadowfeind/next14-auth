import { db } from "@/lib/db"

export const getVerificationTokenByEmail = async(email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: { email }
        })

        return verificationToken
    } catch (error) {
        return null
    }
}