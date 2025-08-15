"use server";

import { ErrorResponseSchema, RegisterSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = 
{
    errors: string[]
    success: string
}

export async function register(prevState: ActionStateType, formData: FormData)
{
    const registerData = 
    {
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        password: formData.get("password") as string,
        password_confirmation: formData.get("password_confirmation") as string
    }

    const register = RegisterSchema.safeParse(registerData)

    if(!register.success)
    {
        const errors = register.error.issues.map(error => error.message)
        return {
            errors,
            success:prevState.success
        }
    }

    const url = `${process.env.API_URL}/auth/create-account`
    const req = await fetch(url, 
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
            {
                email: register.data.email,
                name: register.data.name,
                password: register.data.password
            })
        })

    const json = await req.json()
    if(req.status === 409)
    {
        const {error} = ErrorResponseSchema.parse(json)

        return {
            errors: [error],
            success: ''
        }
    }
    
    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}