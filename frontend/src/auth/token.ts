import { cookies } from "next/headers"


export default async function getTokenFromCookies()
{
    const cookieStore = await cookies()
    const token = cookieStore.get('CASHTRACKR_TOKEN')?.value
    return token
}