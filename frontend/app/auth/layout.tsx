import Logo from "@/components/UI/Logo";
import ToastNotification from "@/components/UI/ToastNotification";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">   
            <div className="bg-purple-950 flex justify-center lg:bg-[url('/grafico.svg')] lg:bg-no-repeat bg-bottom-left">
                <Logo/>
            </div>

            <div className="p-10 lg:py-28">
                <div className="max-w-3xl mx-auto">
                    {children}
                </div>
            </div>
        </div>

        <ToastNotification/>
    </>
  );
}