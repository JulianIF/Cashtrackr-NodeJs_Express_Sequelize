"use server"

import { ErrorResponseSchema, LoginSchema, SuccessSchema } from "@/src/schemas"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type ActionStateType = 
{
    errors: string[]
    success: string
}

export async function authenticate(prevState: ActionStateType, formData: FormData)
{
    const credentials = 
    {
        email: formData.get("email"),
        password: formData.get("password")
    }

    const auth = LoginSchema.safeParse(credentials)
    if(!auth.success)
    {
        return {
            errors: auth.error.issues.map(issue => issue.message),
            success: ''
        }
    }
    
    const url = `${process.env.API_URL}/auth/logIn`
        const req = await fetch(url, 
            {
                method: "POST",
                headers: 
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                {
                    email: auth.data.email,
                    password: auth.data.password
                })
            })
        const json = await req.json()
    
        if(!req.ok)
        {
            const {error} = ErrorResponseSchema.parse(json)
            return {
                errors: [error],
                success: ''
            }
        }
        const success = SuccessSchema.parse(json)
        
        const cookieStore = await cookies()

        cookieStore.set({
            name: "CASHTRACKR_TOKEN",
            value: json,
            httpOnly: true,
            path: "/"
        })
        
        redirect("/admin")
}