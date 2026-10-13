import SignInForm from "../components/SignInForm";
import Logo from "@/assets/meditrack-logo.svg";
export default function SignInPage() {
  return (
    <main className='min-h-screen bg-primary-foreground flex justify-center items-center'>
      <div className='bg-white p-8 rounded-2xl lg:w-sm'>
        <Logo className='mx-auto mb-5' aria-label='MediTrack' />
        <h2 className='text-center font-semibold text-2xl'>Sign In</h2>
        <SignInForm />
      </div>
    </main>
  );
}
