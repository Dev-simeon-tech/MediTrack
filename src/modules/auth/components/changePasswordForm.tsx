"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  ChangePasswordState,
  changePasswordAction,
} from "../actions/changePassword";

const initialState: ChangePasswordState = {};

const ChangePasswordForm = () => {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState,
  );

  const fields = [
    {
      name: "currentPassword",
      label: "Current (temporary) password",
      auto: "current-password",
    },
    { name: "newPassword", label: "New password", auto: "new-password" },
    {
      name: "confirmPassword",
      label: "Confirm new password",
      auto: "new-password",
    },
  ] as const;
  return (
    <form action={formAction} className='flex flex-col gap-4 mt-5'>
      {state.error && (
        <p role='alert' className='text-red-600'>
          {state.error}
        </p>
      )}
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name}>{f.label}</label>
          <Input
            id={f.name}
            name={f.name}
            type='password'
            autoComplete={f.auto}
          />
          {state.fieldErrors?.[f.name] && (
            <p className='text-sm text-red-600'>
              {state.fieldErrors[f.name]![0]}
            </p>
          )}
        </div>
      ))}

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

export default ChangePasswordForm;
