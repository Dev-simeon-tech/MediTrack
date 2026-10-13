import CreatePatientForm from "../components/CreatePatientForm";

export default function NewPatientPage() {
  return (
    <main className='p-4 bg-primary-foreground/30'>
      <article className='mb-10'>
        <h2 className='text-2xl lg:text-3xl font-semibold pb-2'>
          Register new Patient
        </h2>
      </article>
      <CreatePatientForm />
    </main>
  );
}
