import { useParams, useSearchParams } from "next/navigation";
import { DialogTitle } from "@headlessui/react";
import { deleteExpense } from "@/actions/delete-expense-action";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import ErrorMessage from "../UI/ErrorMessage";

type DeleteExpenseForm = {
  closeModal: () => void
}

export default function DeleteExpenseForm({ closeModal }: DeleteExpenseForm) 
{
    const { id: budgetId } = useParams<{id:string}>()
    const searchParams = useSearchParams()
    const expenseId = searchParams.get('deleteExpenseId')!

    const deleteExpenseWithBudgetId = deleteExpense.bind(null, {budgetId: +budgetId, expenseId: +expenseId})
    const [state, dispatch] = useActionState(deleteExpenseWithBudgetId,
    {
        errors: [],
        success: ''
    })

    useEffect(() => 
    {
        if(!Number.isInteger(+budgetId) || !Number.isInteger(+expenseId))
        {
            closeModal()
        }
    }, [])

    useEffect(() =>
    {   
        if(state.success)
        {
            toast.success(state.success)
            closeModal()
        }
    }, [state])

    return (
        <>
            <DialogTitle
            as="h3"
            className="font-black text-4xl text-purple-950 my-5"
            >
            Delete Expense
            </DialogTitle>
            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
            <p className="text-xl font-bold">Confirm to delete, {''}
            <span className="text-amber-500">this expense</span>
            </p>
            <p className='text-gray-600 text-sm'>(A deleted expense can't be recovered)</p>
            <div className="grid grid-cols-2 gap-5 mt-10">
            <button
                className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                onClick={closeModal}
            >Cancel</button>
            <button
                type='button'
                className="bg-red-500 w-full p-3 text-white uppercase font-bold hover:bg-red-600 cursor-pointer transition-colors"
                onClick={() => dispatch()}
            >Delete</button>
            </div>
        </>
    )
}