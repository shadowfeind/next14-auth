import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async(email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    const {error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: 'traves.troy007@gmail.com',
        subject: "Confirmation email",
        html: `<p>click <a href=${confirmLink}>here</a> to confirm email</p>`
    })

    console.log({error, email})
}

export const sendPasswordResetEmail = async(email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: 'traves.troy007@gmail.com',
        subject: "Reset password",
        html: `<p>click <a href=${confirmLink}>here</a> to Reset Password</p>`
    })
}

export const sendTwoFactorTokenEmail = async(email: string, token: string) => {
   
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: 'traves.troy007@gmail.com',
        subject: "Reset password",
        html: `<p>Your 2fa code is ${token}</p>`
    })
}