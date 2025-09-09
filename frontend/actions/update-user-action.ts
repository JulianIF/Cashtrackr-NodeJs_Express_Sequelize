"use server"

import getTokenFromCookies from "@/src/auth/token"
import { ErrorResponseSchema, ProfileFormSchema, SuccessSchema, UserSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type ActionStateType = 
{
    errors: string[]
    success: string
}

export async function updateUser(prevState: ActionStateType, formData: FormData)
{
    const profile = ProfileFormSchema.safeParse(
    {
        name: formData.get('name'),
        email: formData.get('email')
    })
    
    if (!profile.success)
    {
        return {
            errors: profile.error.issues.map(issue => issue.message),
            success: ''
        }
    }


    const token = await getTokenFromCookies()
            
    const url = `${process.env.API_URL}/auth/user`

    const req = await fetch(url,
    {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
        {
            name: profile.data.name,
            email: profile.data.email
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

    revalidatePath('/admin/profile/settings')

    return(
    {
        errors: [],
        success
    })
}