import Progressbar from "@/components/budgets/Progressbar"
import AddExpenseButton from "@/components/expenses/AddExpenseButton"
import ExpenseMenu from "@/components/expenses/ExpenseMenu"
import Amount from "@/components/UI/Amount"
import ModalContainer from "@/components/UI/ModalContainer"
import { getBudget } from "@/src/services/budgets"
import { formatCurrency, formatDate } from "@/src/utils"
import { Metadata } from "next"

export async function generateMetadata({params} : {params: {id: string}}) : Promise<Metadata>
{
    const {id} = await params
    const budget = await getBudget(id)
    return {
        title: `CashTrack | ${budget.name}`,
        description: `CashTrack | ${budget.name}`
    }
}

export default async function BudgetDetailsPage({params} : {params: {id: string}}) 
{
    const {id} = await params
    const budget = await getBudget(id)
    const totalSpent = budget.expenses.reduce((total, expense) => +expense.amount + total, 0)
    const totalAvailable = +budget.amount - totalSpent

    const percentage = +((totalSpent / +budget.amount) * 100).toFixed(2)

    return(
        <>
        <div className='flex justify-between items-center'>
            <div>
                <h1 className="font-black text-4xl text-purple-950">{budget.name}</h1>
                <p className="text-xl font-bold">Manage your {''} <span className="text-amber-500">expenses</span></p>
            </div>
            <AddExpenseButton/>
        </div>

        {budget.expenses.length ? 
        (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-10">
                    <div>
                        <Progressbar
                        percentage={percentage}
                        />
                    </div>

                    <div className="flex flex-col justify-center items-center md:items-start gap-5">
                        <Amount
                            label="Total Budget"
                            amount={+budget.amount}
                        />
                        <Amount
                            label="Available"
                            amount={totalAvailable}
                        />
                        <Amount
                            label="Spent"
                            amount={totalSpent}
                        />
                    </div>
                </div>
                <ul role="list" className="divide-y divide-gray-300 border shadow-lg mt-10 ">
                {budget.expenses.map((expense) => (
                    <li key={expense.id} className="flex justify-between gap-x-6 p-5">
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto space-y-2">
                        <p className="text-2xl font-semibold text-gray-900">
                            {expense.name}
                        </p>
                        <p className="text-xl font-bold text-amber-500">
                            {formatCurrency(+expense.amount)}
                        </p>
                        <p className='text-gray-500  text-sm'>
                            Updated: {''}
                            <span className="font-bold">{formatDate(expense.updatedAt)}</span>
                        </p>
                        </div>
                    </div>
                    <ExpenseMenu
                        expenseId={expense.id}
                    />
                    </li>
                ))}
                </ul>
            </>
        ) :
        (
            <div>No Expenses created</div>
        )}

        <ModalContainer/>
        </>
    )
}