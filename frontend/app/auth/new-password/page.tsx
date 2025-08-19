import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";
import Link from "next/link";


export const metadata : Metadata = 
{
    title: "Cashtrackr - New Password"
}
export default function NewPasswordPage() 
{
    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">Forgot your password</h1>
            <p className="text-3xl font-bold">Reset it <span className="text-amber-500">Here</span></p>
            <ForgotPasswordForm />

            <nav className="mt-10 flex flex-col space-y-4">
                <Link href={"/auth/register"} className="text-center text-gray-500">
                    Don't have an account? Create one here
                </Link>
            </nav>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link href={"/auth/logIn"} className="text-center text-gray-500">
                    Already have an account? Log In
                </Link>
            </nav>
        </>
    );

}