import AddExpenseButton from "@/components/expenses/AddExpenseButton"
import ModalContainer from "@/components/UI/ModalContainer"
import { getBudget } from "@/src/services/budgets"
import { Metadata } from "next"

export async function generateMetadata({params} : {params: {id: string}}) : Promise<Metadata>
{
    const budget = await getBudget(params.id)
    return {
        title: `CashTrack | ${budget.name}`,
        description: `CashTrack | ${budget.name}`
    }
}

export default async function BudgetDetailsPage({params} : {params: {id: string}}) 
{
    const budget = await getBudget(params.id)
    return(
        <>
        <div className='flex justify-between items-center'>
            <div>
                <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
                <p className="text-xl font-bold">Manage your {''} <span className="text-amber-500">expenses</span></p>
            </div>
            <AddExpenseButton/>
        </div>
        <ModalContainer/>
        </>
    )
}