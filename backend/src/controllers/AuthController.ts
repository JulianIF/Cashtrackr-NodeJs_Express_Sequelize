import type { Request, Response } from "express"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController
{
    static createAccount = async (req: Request, res:Response) =>
    {
        const {email} = req.body

        const userExists = await User.findOne({where: {email}})

        if(userExists)
        {
            const error = new Error ('User already exists')
            res.status(409).json({error: error.message}) 
        }

        try 
        {
            const user = new User(req.body)

            user.password = await hashPassword(req.body.password)
            user.token = generateToken()

            await user.save()

            await AuthEmail.sendConfirmationEmail
            ({
                name: user.name, 
                email: user.email,
                token: user.token
            })

            res.status(201).json('Account Created') 
        } 
        catch (e) 
        {
           res.status(500).json({error: 'Server Error'}) 
        }
    }

    static confirmAccount = async (req: Request, res:Response) =>
    {
        const {token} = req.body

        const user = await User.findOne({where: {token}})

        if(!user)
        {
            const error = new Error ('Invalid Token')
            res.status(401).json({error: error.message}) 
        }
        user.confirmed = true
        user.token = null

        await user.save()
        res.json("Account Confirmed")
    }
}