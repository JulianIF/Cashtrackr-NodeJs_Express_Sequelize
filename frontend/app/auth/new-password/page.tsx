import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import PasswordResetHandler from "@/components/auth/PasswordResetHandler";
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
            <h1 className="font-black text-6xl text-purple-950">Reset Password</h1>
            <p className="text-3xl font-bold">Enter the code sent to you
                <span className="text-amber-500"> via email</span>
            </p>
            <PasswordResetHandler/>
            
        </>
    );

}