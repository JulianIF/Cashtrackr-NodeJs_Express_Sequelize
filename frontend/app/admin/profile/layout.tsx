import ProfileTabs from "@/components/profile/ProfileTabs";
import ToastNotification from "@/components/UI/ToastNotification";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <ProfileTabs />
        {children}
        <ToastNotification />
    </>
  );
}