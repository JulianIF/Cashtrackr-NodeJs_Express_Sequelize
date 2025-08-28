import Link from 'next/link'
 
export default function NotFound() 
{
  return (
    <div className='space-y-5'>
        <h1 className="font-black text-4xl text-purple-950">Not Found</h1>
        <p className="text-xl font-bold">The budget you are trying to access {''} <span className="text-amber-500">doesn't exist</span></p>
        <Link href="/admin" className='bg-amber-500 px-10 py-2 rounded-lg text-white font-bold cursor-pointer inline-block'>Go to Budgets</Link>
    </div>
  )
}