import { transport } from "../config/nodemailer";
import User from "../models/User";


type EmailType =
{
    name: string,
    email: string,
    token: string
}
export class AuthEmail
{
    static sendConfirmationEmail = async (user: EmailType) =>
    {
        const email = await transport.sendMail
        ({
            from: 'CashTrack <admin@cashtrack.com>',
            to: user.email,
            subject: 'CashTrackr - Confirm Account',
            html:`<p> Hello ${user.name}, your account is almost ready </p>
                  <p> Visit this link: </p>
                  <a href=#> Confirm Account </a>
                  <p> Your code is: <b>${user.token}</b></p>`
        })
    }
}