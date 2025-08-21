import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { UserSchema } from "../schemas"
import getTokenFromCookies from "./token"

export const verifySession = cache ( async () =>
{
    const token = await getTokenFromCookies()
    if(!token)
    {
        redirect("/auth/logIn")
    }

    const url = `${process.env.API_URL}/auth/user`

    const req = await fetch(url, 
    {
        method: "GET",
        headers:
        {
            Authorization: `Bearer ${token}`
        }
    })

    const session = await req.json()

    const result = UserSchema.safeParse(session)

    if(!result.success)
    {
        redirect("/auth/logIn")
    }

    return {
        user: result.data,
        isAuth: true
    }
})