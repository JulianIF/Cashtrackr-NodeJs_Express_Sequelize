import LogInForm from "@/components/auth/LogInForm";
import { Metadata } from "next";
import Link from "next/link";


export const metadata : Metadata = 
{
    title: "Cashtrackr - Log In"
}
export default function LogInPage() 
{
    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">Log In</h1>
            <p className="text-3xl font-bold">Start managing your <span className="text-amber-500">Finances</span></p>
            <LogInForm />

            <nav className="mt-10 flex flex-col space-y-4">
                <Link href={"/auth/register"} className="text-center text-gray-500">
                    Don't have an account? Create one here
                </Link>
            </nav>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link href={"/auth/forgot-password"} className="text-center text-gray-500">
                    Forgot your password? Reset it here
                </Link>
            </nav>
        </>
    );

}