"use client";
import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  createPatient,
  type CreatePatientState,
} from "../actions/createPatient";
import {
  FieldSet,
  FieldLabel,
  FieldGroup,
  FieldLegend,
  FieldDescription,
  FieldError,
  FieldSeparator,
  Field,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "./TagInput";
import { Input } from "@/components/ui/input";
import { User, Plus, Save } from "lucide-react";

type BloodGroupType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

const SexChoice = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];
const BloodGroup = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O-" },
];
const initialState: CreatePatientState = {};
const CreatePatientForm = () => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType>();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createPatient,
    initialState,
  );

  return (
    <form action={formAction}>
      {state.error && (
        <p role='alert' className='text-red-600'>
          {state.error}
        </p>
      )}
      <FieldSet className='p-6 rounded-md shadow-sm bg-white'>
        <div className='flex justify-between items-center'>
          <FieldLegend className='flex items-center gap-2'>
            <div className='p-2 px-2.5 flex justify-center items-center w-fit rounded-sm bg-primary-foreground'>
              <User className='text-primary' />
            </div>
            <h2 className='md:text-2xl text-lg'>Personal Information</h2>
          </FieldLegend>
          <FieldDescription className='text-sm text-muted-foreground'>
            *Required fields
          </FieldDescription>
        </div>
        <FieldSeparator />
        <FieldGroup>
          <Field>
            <FieldLabel>
              Full Name<span className='text-red-400'>*</span>
            </FieldLabel>
            <Input className='w-full h-12' name='name' />
            {state.fieldErrors?.name && (
              <FieldError>{state.fieldErrors.name[0]}</FieldError>
            )}
          </Field>
          <div className='grid md:grid-cols-2 gap-4'>
            <Field>
              <FieldLabel>
                Date of Birth<span className='text-red-400'>*</span>
              </FieldLabel>
              <Input
                className='w-full h-12'
                name='dob'
                type='date'
                placeholder='mm/dd/yyyy'
              />
              {state.fieldErrors?.dob && (
                <FieldError>{state.fieldErrors.dob[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>
                Sex<span className='text-red-400'>*</span>
              </FieldLabel>
              <Select name='sex'>
                <SelectTrigger className='w-full h-full! grow-0'>
                  <SelectValue placeholder='Select Sex' />
                </SelectTrigger>
                <SelectContent>
                  {SexChoice.map((sex, index) => (
                    <SelectItem key={sex.value + index} value={sex.value}>
                      {sex.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.fieldErrors?.sex && (
                <FieldError>{state.fieldErrors.sex[0]}</FieldError>
              )}
            </Field>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <Field>
              <FieldLabel>
                Phone Number<span className='text-red-400'>*</span>
              </FieldLabel>
              <Input className='w-full h-12' type='phone' name='phone' />
              {state.fieldErrors?.phone && (
                <FieldError>{state.fieldErrors.phone[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Address</FieldLabel>
              <Input className='w-full h-12' name='address'></Input>
              {state.fieldErrors?.address && (
                <FieldError>{state.fieldErrors.address[0]}</FieldError>
              )}
            </Field>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel>Emergency Contact Name</FieldLabel>
              <Input className='w-full h-12' name='emergencyName' />
              {state.fieldErrors?.emergencyName && (
                <FieldError>{state.fieldErrors.emergencyName[0]}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel>Emergency Contact phone</FieldLabel>
              <Input
                className='w-full h-12'
                type='phone'
                name='emergencyPhone'
              ></Input>
              {state.fieldErrors?.emergencyPhone && (
                <FieldError>{state.fieldErrors.emergencyPhone[0]}</FieldError>
              )}
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet className='p-6 rounded-md shadow-sm bg-white mt-10'>
        <div>
          <FieldLegend className='flex items-center gap-2'>
            <div className='p-2 px-2.5 flex justify-center items-center w-fit rounded-sm bg-primary-foreground'>
              <Plus className='text-primary' />
            </div>
            <h2 className='text-2xl'>Medical Information</h2>
          </FieldLegend>
        </div>
        <FieldGroup>
          <div className='grid md:grid-cols-2 gap-4'>
            <Field>
              <FieldLabel>Blood Group</FieldLabel>
              <Select
                onValueChange={(value) =>
                  setBloodGroup(value as BloodGroupType)
                }
                items={BloodGroup}
              >
                <SelectTrigger className='h-full!'>
                  <SelectValue placeholder='Select Blood Group' />
                </SelectTrigger>
                <SelectContent>
                  {BloodGroup.map((blood, index) => (
                    <SelectItem key={index} value={blood.value}>
                      {blood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type='hidden' value={bloodGroup} name='bloodGroup'></Input>
            </Field>
            <div>
              <TagInput
                name='allergies'
                label='Known Allergies'
                placeholder='Type an allergy and press Enter'
              />
            </div>
            {state.fieldErrors?.allergies && (
              <FieldError>{state.fieldErrors.allergies[0]}</FieldError>
            )}
          </div>
          <TagInput
            name='chronicConditions'
            label='Chronic Conditions'
            placeholder='Type a condition and press Enter'
          />
          {state.fieldErrors?.chronicConditions && (
            <p className='text-sm text-red-600'>
              {state.fieldErrors.chronicConditions[0]}
            </p>
          )}
          <Field>
            <FieldLabel>Clinical Notes</FieldLabel>
            <Textarea
              name='chronicConditions'
              placeholder='Enter initial triage notes, observation summaries, or relevant background history...'
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <div className='mt-10 flex justify-end gap-4'>
        <Button
          onClick={() => router.push("/patients")}
          className='bg-white border-2 border-neutral-400 hover:bg-white/20 cursor-pointer py-5 px-5 text-black'
        >
          Cancel
        </Button>

        <Button
          type='submit'
          disabled={isPending}
          className='py-5 px-5 cursor-pointer'
        >
          <Save strokeWidth={3} />
          Save Patient
        </Button>
      </div>
    </form>
  );
};

export default CreatePatientForm;
