import ProfileForm from "@/components/profile/ProfileForm";
import { verifySession } from "@/src/auth/dal";

export default async function EditProfilePage() 
{
    const {user} = await verifySession()

    return (
        <>
            <h1 className="font-black text-4xl text-purple-950 my-5">Update Profile</h1>
            <p className="text-xl font-bold">Here you can change the information in your {''}
                <span className="text-amber-500">profile</span>
            </p>
            <ProfileForm
            user={user}
            />
        </>
    )
}