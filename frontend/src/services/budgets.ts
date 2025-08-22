import { cache } from "react"
import getTokenFromCookies from "../auth/token"
import { BudgetAPIResponseSchema } from "../schemas"
import { notFound } from "next/navigation"

export const getBudget = cache(async (budgetId: string) => 
{
    const token = await getTokenFromCookies()
    const url = `${process.env.API_URL}/budgets/${budgetId}`

    const req = await fetch(url,
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()

    if(!req.ok)
    {
        notFound()
    }

    const budget = BudgetAPIResponseSchema.parse(json)
    return budget
})