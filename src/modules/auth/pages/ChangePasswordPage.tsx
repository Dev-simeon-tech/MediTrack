import ChangePasswordForm from "../components/changePasswordForm";
import Logo from "@/assets/meditrack-logo.svg";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ChangePasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return (
    <main className='min-h-screen bg-primary-foreground flex justify-center items-center'>
      <div className='bg-white p-8 rounded-2xl lg:w-sm'>
        <Logo className='mx-auto mb-5' aria-label='MediTrack' />
        <h2 className='text-center font-semibold text-2xl'>
          Set a new password
        </h2>
        {session.user.mustChangePassword && (
          <p>
            You&apos;re using a temporary password. Choose a new one to
            continue.
          </p>
        )}
        <ChangePasswordForm />
      </div>
    </main>
  );
}
