"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVerticalsApi } from "@/hooks/vertical.hook";
import type { LeadInput, Vertical } from "@/types";

const POSTAL_CODE_PATTERN = /^\d{5}$/;

type LeadFormProps = {
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (input: LeadInput) => void;
};

const LeadForm = ({ submitLabel, isSubmitting, onSubmit }: LeadFormProps) => {
  const { data: verticals } = useVerticalsApi();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      postalCode: "",
      verticalId: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
      <FieldGroup>
        <Field orientation="horizontal">
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel htmlFor="firstName">First name <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="firstName"
              aria-invalid={!!errors.firstName}
              {...register("firstName", { required: "Required" })}
            />
            <FieldError errors={[errors.firstName]} />
          </Field>
          <Field data-invalid={!!errors.lastName}>
            <FieldLabel htmlFor="lastName">Last name <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="lastName"
              aria-invalid={!!errors.lastName}
              {...register("lastName", { required: "Required" })}
            />
            <FieldError errors={[errors.lastName]} />
          </Field>
        </Field>

        <Field data-invalid={!!errors.birthDate}>
          <FieldLabel htmlFor="birthDate">Birth date <span className="text-destructive">*</span></FieldLabel>
          <Input
            id="birthDate"
            type="date"
            aria-invalid={!!errors.birthDate}
            {...register("birthDate", { required: "Required" })}
          />
          <FieldError errors={[errors.birthDate]} />
        </Field>

        <Field data-invalid={!!errors.postalCode}>
          <FieldLabel htmlFor="postalCode">Postal code <span className="text-destructive">*</span></FieldLabel>
          <Input
            id="postalCode"
            placeholder="75001"
            aria-invalid={!!errors.postalCode}
            {...register("postalCode", {
              required: "Required",
              pattern: {
                value: POSTAL_CODE_PATTERN,
                message: "Must be 5 digits",
              },
            })}
          />
          <FieldError errors={[errors.postalCode]} />
        </Field>

        <Field data-invalid={!!errors.verticalId}>
          <FieldLabel htmlFor="verticalId">Vertical <span className="text-destructive">*</span></FieldLabel>
          <Controller
            control={control}
            name="verticalId"
            rules={{ required: "Required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="verticalId" className="w-full">
                  <SelectValue placeholder="Select a vertical" />
                </SelectTrigger>
                <SelectContent>
                  {verticals?.map((vertical: Vertical) => (
                    <SelectItem key={vertical.id} value={vertical.id}>
                      {vertical.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.verticalId]} />
        </Field>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default LeadForm;
