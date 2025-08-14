"use client"

export default function RegisterForm()
{
    return (
        <form
            className="mt-14 space-y-5"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label
                    className="font-bold text-2xl"
                    htmlFor="email"
                >Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    name="email"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    className="font-bold text-2xl"
                >Name</label>
                <input
                    type="name"
                    placeholder="John Doe"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    name="name"
                />
            </div>

            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
                <label
                    className="font-bold text-2xl"
                >Repeat Password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    placeholder="Repeat yor password"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    name="password_confirmation"
                />
            </div>

            <input
                type="submit"
                value='Register'
                className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
            />
        </form>
    )
}