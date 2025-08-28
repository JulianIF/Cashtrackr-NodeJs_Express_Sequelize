"use server"

import getTokenFromCookies from "@/src/auth/token"
import { DraftExpenseSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = 
{
    errors: string[]
    success: string
}

export default async function createExpense(budgetId: number, prevState: ActionStateType, formData: FormData)
{
    const expenseData = DraftExpenseSchema.safeParse(
    {
        name: formData.get('name'),
        amount: formData.get('amount')
    })

    if (!expenseData.success) 
    {
        return {
            errors: expenseData.error.issues.map(issue => issue.message),
            success: ''
        }
    }


    const token = await getTokenFromCookies()
    
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses`

    const req = await fetch(url,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
        {
            name: expenseData.data.name,
            amount: expenseData.data.amount
        })

    })

    const json = await req.json()
    
    if(!req.ok)
    {
        const {error} = ErrorResponseSchema.parse(json)
        return{
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