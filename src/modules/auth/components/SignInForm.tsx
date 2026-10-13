"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Mail, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FieldError } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { signInAction, type SignInState } from "../actions/signIn";

const initialState: SignInState = {};

const SignInForm = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const signInActionWithUrl = (state: SignInState, formData: FormData) =>
    signInAction(state, formData, redirectUrl ?? undefined);
  const [state, formAction, isPending] = useActionState(
    signInActionWithUrl,
    initialState,
  );

  return (
    <form action={formAction} className='flex flex-col gap-4 mt-5'>
      {state.error && (
        <div className='bg-red-100 text-red-700 p-2 text-center rounded-md text-sm'>
          {state.error}
        </div>
      )}
      <InputGroup>
        <InputGroupInput
          type='email'
          name='email'
          autoComplete='email'
          placeholder='example@meditrack.com '
          aria-invalid={state.fieldErrors?.email ? true : false}
        />
        <InputGroupAddon>
          <Mail />
        </InputGroupAddon>
      </InputGroup>
      {state.fieldErrors?.email && (
        <FieldError>{state.fieldErrors?.email[0]}</FieldError>
      )}

      <InputGroup>
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupInput
          aria-invalid={state.fieldErrors?.password ? true : false}
          name='password'
          type='password'
          placeholder='*****'
        />
      </InputGroup>
      {state.fieldErrors?.password && (
        <FieldError>{state.fieldErrors?.password[0]}</FieldError>
      )}

      <Button
        type='submit'
        size={"icon-lg"}
        disabled={isPending}
        className='w-full flex gap-2 items-center cursor-pointer'
      >
        <p>Sign in</p>
        <LogIn strokeWidth={3} />
      </Button>
    </form>
  );
};

export default SignInForm;
