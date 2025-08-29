import { DraftExpense } from "@/src/schemas"

type ExpenseFormProps =
{
    expense?: DraftExpense
}
export default function ExpenseForm({expense}: ExpenseFormProps) 
{
    return (
        <>
            <div className="mb-5">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Expense Name
                </label>
                <input
                    id="name"
                    className="w-full p-3  border border-gray-100  bg-white"
                    type="text"
                    placeholder="Expense Name"
                    name="name"
                    defaultValue={expense?.name}
                />
            </div>

            <div className="mb-5">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Expense Amount
                </label>
                <input
                    id="amount"
                    className="w-full p-3  border border-gray-100 bg-white"
                    type="number"
                    placeholder="Expense Amount"
                    name="amount"
                    defaultValue={expense?.amount}
                />
            </div>
        </>
    )
}