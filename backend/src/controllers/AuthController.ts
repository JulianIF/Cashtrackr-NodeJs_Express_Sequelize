import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController
{
    static createAccount = async (req: Request, res:Response) =>
    {
        const {email} = req.body

        const userExists = await User.findOne({where: {email}})

        if(userExists)
        {
            const error = new Error ('User already exists')
            return res.status(409).json({error: error.message}) 
        }

        try 
        {
            const user = await User.create(req.body)

            user.password = await hashPassword(req.body.password)
            const token = generateToken()
            user.token = token

            if (process.env.NODE_ENV !== 'production')
            {
                globalThis.cashTrackerConfirmationToken = token
            }
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

    static logIn = async (req: Request, res:Response) =>
    {
        const {email, password} = req.body

        const user = await User.findOne({where: {email}})

        if(!user)
        {
            const error = new Error ('User not found')
            return res.status(404).json({error: error.message}) 
        }

        if(!user.confirmed)
        {
            const error = new Error ('Account not confirmed')
            return res.status(403).json({error: error.message}) 
        }

        const isPasswordCorrect = await checkPassword(password, user.password)

        if(!isPasswordCorrect)
        {
            const error = new Error ('Incorrect Password')
            return res.status(401).json({error: error.message}) 
        }

        const jwToken = generateJWT(user.id)

        res.json(jwToken)
    }

    static forgotPassword = async (req: Request, res:Response) =>
    {
        const {email} = req.body

        const user = await User.findOne({where: {email}})

        if(!user)
        {
            const error = new Error ('User not found')
            res.status(404).json({error: error.message}) 
        }

        user.token = generateToken()

        await user.save()

        await AuthEmail.sendPasswordResetEmail
        ({
            name: user.name, 
            email: user.email,
            token: user.token
        })

        res.json('Check your e-mail to reset your password') 
        
    }

    static validateToken = async (req: Request, res:Response) =>
    {
        const {token} = req.body

        const tokenExists = await User.findOne({where: {token}})

        if(!tokenExists)
        {
            const error = new Error ('Invalid Token')
            res.status(404).json({error: error.message}) 
        }

        res.json('Token is valid')
    }

    static resetPasswordWithToken = async (req: Request, res:Response) =>
    {
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({where: {token}})

        if(!user)
        {
            const error = new Error ('Invalid Token')
            res.status(404).json({error: error.message}) 
        }

        user.password = await hashPassword(password)
        user.token = null

        await user.save()

        res.json('Password Modified')
    }

    static user = async (req: Request, res:Response) =>
    {
        res.json(req.user)
    }

    static updateCurrentUserPassword = async (req: Request, res:Response) =>
    {
        const { current_password, password } = req.body
        const {id} = req.user

        const user = await User.findByPk(id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)

        if(!isPasswordCorrect)
        {
            const error = new Error ('Current password is incorrect')
            res.status(401).json({error: error.message}) 
        }

        user.password = await hashPassword(password)
        
        await user.save()

        res.json('Password Modified')
    }

    static checkPassword = async (req: Request, res:Response) =>
    {
        const { password } = req.body
        const {id} = req.user

        const user = await User.findByPk(id)

        const isPasswordCorrect = await checkPassword(password, user.password)

        if(!isPasswordCorrect)
        {
            const error = new Error ('Current password is incorrect')
            res.status(401).json({error: error.message}) 
        }

        res.json('Correct Password')
    }
}