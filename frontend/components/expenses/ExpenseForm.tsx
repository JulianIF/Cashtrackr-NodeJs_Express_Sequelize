
export default function ExpenseForm() 
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
                />
            </div>
        </>
    )
}