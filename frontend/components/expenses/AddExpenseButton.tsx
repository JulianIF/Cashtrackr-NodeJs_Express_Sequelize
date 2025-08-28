"use client"

import { useRouter } from "next/navigation"

export default function AddExpenseButton() 
{
    const router = useRouter()
    return (
        <button 
        type="button"
        className="bg-amber-500 text-white px-10 py-2 rounded-lg font-bold cursor-pointer"
        onClick={() => router.push('?addExpense=true&showModal=true')}>
            Add Expense
        </button>
    )
}