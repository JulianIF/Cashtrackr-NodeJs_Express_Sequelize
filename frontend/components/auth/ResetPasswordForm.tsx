import { resetPassword } from "@/actions/reset-password-action"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"

export default function ResetPasswordForm({token}: {token: string}) 
{
    const router = useRouter()
    const resetPasswordWithToken = resetPassword.bind(null, token)
    const [state, dispatch] = useActionState(resetPasswordWithToken,
    {
        errors: [],
        success: ''
    })

    useEffect(() =>
    {
        if(state.errors)
        {
            state.errors.forEach(error => 
            {
                toast.error(error)
            })
        }
        if(state.success)
        {
            toast.success(state.success,
            {
                onClose: () =>
                {
                    router.push('/auth/logIn')
                },
                onClick: () =>
                {
                    router.push('/auth/logIn')
                },
            })
        }
    }, [state])

    return (
        <form
        className=" mt-14 space-y-5"
        noValidate
        >
        <div className="flex flex-col gap-5">
            <label
            className="font-bold text-2xl"
            >Password</label>

            <input
            type="password"
            placeholder="Exampl3Pa$$word"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
            />
        </div>

        <div className="flex flex-col gap-5">
            <label
            className="font-bold text-2xl"
            >Repeat Password</label>

            <input
            id="password_confirmation"
            type="password"
            placeholder="Repeat your password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
            />

        </div>

        <input
            type="submit"
            value='Guardar Password'
            className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
        />
        </form>
  )
}