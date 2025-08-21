import { Metadata } from "next";
import Link from "next/link";

export const metadata : Metadata = 
{
    title: 'CashTrack | Admin Panel',
    description: 'CashTrack | Admin Panel'
}

export default async function AdminPage() 
{
    return (
        <>
            <div className='flex flex-col-reverse md:flex-row md:justify-between items-center'>
            <div className='w-full md:w-auto'>
                <h1 className="font-black text-4xl text-purple-950 my-5">Budgets</h1>
                <p className="text-xl font-bold">Manage your {''}
                <span className="text-amber-500">budgets</span>
                </p>
            </div>
            <Link
                href={'/admin/budgets/new'}
                className='bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center'
            >
                Create new Budget
            </Link>
            </div>
        </>
    )
}