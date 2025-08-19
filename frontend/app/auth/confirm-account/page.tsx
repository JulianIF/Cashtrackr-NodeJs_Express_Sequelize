import ConfirmAccountForm from "@/components/auth/ConfirmAccountForm";
import { Metadata } from "next";


export const metadata : Metadata = 
{
    title: "Cashtrackr - Confirm Account"
}
export default function ConfirmAccountPage() 
{
    return (
        <>
            <h1 className="font-black text-6xl text-purple-950">Confirm your account</h1>
            <p className="text-3xl font-bold">Input the code you received <span className="text-amber-500">via email</span></p>
            <ConfirmAccountForm />
        </>
    );

}