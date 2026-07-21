"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ClientInput } from "@/types";

type ClientFormProps = {
  defaultValues?: ClientInput;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (input: ClientInput) => void;
};

const ClientForm = ({
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}: ClientFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientInput>({
    defaultValues: defaultValues ?? { name: "", email: "", isActive: true },
  });

  const submit = (values: ClientInput) => {
    onSubmit({ ...values, email: values.email || null });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name <span className="text-destructive">*</span></FieldLabel>
          <Input
            id="name"
            aria-invalid={!!errors.name}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name is too short" },
            })}
          />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="isActive">Active</FieldLabel>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default ClientForm;
