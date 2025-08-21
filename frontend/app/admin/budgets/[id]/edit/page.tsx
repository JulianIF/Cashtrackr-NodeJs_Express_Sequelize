import getTokenFromCookies from "@/src/auth/token"
import { BudgetAPIResponseSchema } from "@/src/schemas"
import Link from "next/link"
import { notFound } from "next/navigation"

const getBudget = async (budgetId: string) => 
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
}

export default async function EditBudgetPage({params} : {params: {id: string}})
{
    const budget = await getBudget(params.id)
    return(
        <>
        <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
            <div className='w-full md:w-auto'>
            <h1 className='font-black text-4xl text-purple-950 my-5'>
                Edit Budget: {budget.name}
            </h1>
            <p className="text-xl font-bold">Fill out this form to edit your {''}
                <span className="text-amber-500">budget</span>
            </p>
            </div>
            <Link
            href={'/admin'}
            className='bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center'
            >
            Back
            </Link>
        </div>
        <div className='p-10 mt-10  shadow-lg border '>

        </div>
        </>
    )
}