import ChangePasswordForm from "@/components/profile/ChangePasswordForm";


export default async function ChangePasswordPage() 
{
    return (
        <>
        <h1 className="font-black text-4xl text-purple-950 my-5">Change Password</h1>
        <p className="text-xl font-bold">You can change your {''}
            <span className="text-amber-500">password</span>
        </p>

        <ChangePasswordForm/>
        </>
    )
}
