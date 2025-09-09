import Logo from "@/components/UI/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <>

      <header className=" bg-purple-950 py-5">
        <div className="max-w-3xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-96 lg:w-[500px]">
            <Logo />
          </div>
          <nav className="flex flex-col lg:flex-row lg:justify-end gap-5 w-full ">
            <Link
              href='/auth/logIn'
              className="font-bold text-white hover:text-amber-500 uppercase text-sm text-center"
            >Log In</Link>
            <Link
              href='/auth/register'
              className="font-bold text-white hover:text-amber-500 uppercase text-sm text-center"
            >Register</Link>
          </nav>
        </div>
      </header>

      <main className=" max-w-3xl mx-auto p-5 space-y-5 mt-20">
        <h1 className="font-black text-4xl lg:text-6xl text-purple-950">Expense Administrator</h1>
        <p className="text-3xl font-bold">control your <span className="text-amber-500">finances</span></p>
        <p className="text-lg">Dominate your budget with our expense administrator. Intuitively and effectively manage your income and expenses. Take control of your personal finances with our user-friendly platform.</p>

        <h2 className="font-black text-4xl text-purple-950 ">CashTrackr Advantages</h2>

        <ol className="grid grid-cols-1 gap-5 items-start">
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">Effortless organization: </span>
            Classify and visualize your expenses clear and straightforward panel.
          </li>
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">Smart budgeting: </span>
            Set realistic financial goals and track your progress with our smart budgeting tools.
          </li>
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">Worldwide access: </span>
            You can access your finances wherever you are.
          </li>
          <li className="p-5 shadow-lg text-lg">
            <span className="text-purple-950 font-black">Guaranteed Security: </span>
            The highest security standards will protect your data.
          </li>
        </ol>
      </main>

      <nav className="flex flex-col lg:flex-row lg:justify-between gap-5 mt-10 pb-20 max-w-3xl mx-auto ">
          <Link 
            href="/auth/register"
            className="text-gray-500 text-sm uppercase text-center"
          >Don't have an account? Create one</Link>
          <Link 
            href="/auth/logIn"
            className="text-gray-500 text-sm uppercase text-center"
          >Already have an account? Log in</Link>
        </nav>
    </>
  );
}