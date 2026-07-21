"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientsApi } from "@/hooks/client.hook";
import { useVerticalsApi } from "@/hooks/vertical.hook";
import type { Client, DeliveryInput, Vertical } from "@/types";

const POSTAL_CODE_PATTERN = /^\d{5}$/;

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const timeToMinutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

type DeliveryFormValues = {
  clientId: string;
  verticalId: string;
  minAge: number;
  maxAge: number;
  dailyCapacity: number;
  pricePerLead: number;
  isActive: boolean;
  postalCodes: string;
  timeWindows: { start: string; end: string }[];
};

const toFormValues = (input?: DeliveryInput): DeliveryFormValues => ({
  clientId: input?.clientId ?? "",
  verticalId: input?.verticalId ?? "",
  minAge: input?.minAge ?? 18,
  maxAge: input?.maxAge ?? 65,
  dailyCapacity: input?.dailyCapacity ?? 10,
  pricePerLead: input?.pricePerLead ?? 10,
  isActive: input?.isActive ?? true,
  postalCodes: input?.postalCodes.join(", ") ?? "",
  timeWindows: input?.timeWindows.map((window) => ({
    start: minutesToTime(window.startMinute),
    end: minutesToTime(window.endMinute),
  })) ?? [{ start: "00:00", end: "23:59" }],
});

type DeliveryFormProps = {
  initialValue?: DeliveryInput;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (input: DeliveryInput) => void;
};

const DeliveryForm = ({
  initialValue,
  submitLabel,
  isSubmitting,
  onSubmit,
}: DeliveryFormProps) => {
  const { clientsQuery } = useClientsApi(1, 100);
  const { data: verticals } = useVerticalsApi();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    defaultValues: toFormValues(initialValue),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeWindows",
  });

  const submit = (values: DeliveryFormValues) => {
    onSubmit({
      clientId: values.clientId,
      verticalId: values.verticalId,
      minAge: Number(values.minAge),
      maxAge: Number(values.maxAge),
      dailyCapacity: Number(values.dailyCapacity),
      pricePerLead: Number(values.pricePerLead),
      isActive: values.isActive,
      postalCodes: values.postalCodes
        .split(",")
        .map((code) => code.trim())
        .filter(Boolean),
      timeWindows: values.timeWindows.map((window) => ({
        startMinute: timeToMinutes(window.start),
        endMinute: timeToMinutes(window.end),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.clientId}>
          <FieldLabel htmlFor="clientId">Client <span className="text-destructive">*</span></FieldLabel>
          <Controller
            control={control}
            name="clientId"
            rules={{ required: "Client is required" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="clientId" className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsQuery.data?.items?.map((client: Client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[errors.clientId]} />
        </Field>

        <Field data-invalid={!!errors.verticalId}>
          <FieldLabel htmlFor="verticalId">Vertical <span className="text-destructive">*</span></FieldLabel>
          <Controller
            control={control}
            name="verticalId"
            rules={{ required: "Vertical is required" }}
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

        <Field orientation="horizontal">
          <Field data-invalid={!!errors.minAge}>
            <FieldLabel htmlFor="minAge">Min age <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="minAge"
              type="number"
              aria-invalid={!!errors.minAge}
              {...register("minAge", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 120,
              })}
            />
            <FieldError errors={[errors.minAge]}>
              {errors.minAge && "Must be between 0 and 120"}
            </FieldError>
          </Field>
          <Field data-invalid={!!errors.maxAge}>
            <FieldLabel htmlFor="maxAge">Max age <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="maxAge"
              type="number"
              aria-invalid={!!errors.maxAge}
              {...register("maxAge", {
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 120,
              })}
            />
            <FieldError errors={[errors.maxAge]}>
              {errors.maxAge && "Must be between 0 and 120"}
            </FieldError>
          </Field>
        </Field>

        <Field orientation="horizontal">
          <Field data-invalid={!!errors.dailyCapacity}>
            <FieldLabel htmlFor="dailyCapacity">Daily capacity <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="dailyCapacity"
              type="number"
              aria-invalid={!!errors.dailyCapacity}
              {...register("dailyCapacity", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
            />
            <FieldError errors={[errors.dailyCapacity]}>
              {errors.dailyCapacity && "Must be at least 1"}
            </FieldError>
          </Field>
          <Field data-invalid={!!errors.pricePerLead}>
            <FieldLabel htmlFor="pricePerLead">Price per lead <span className="text-destructive">*</span></FieldLabel>
            <Input
              id="pricePerLead"
              type="number"
              step="0.01"
              aria-invalid={!!errors.pricePerLead}
              {...register("pricePerLead", {
                required: true,
                valueAsNumber: true,
                min: 0.01,
              })}
            />
            <FieldError errors={[errors.pricePerLead]}>
              {errors.pricePerLead && "Must be a positive amount"}
            </FieldError>
          </Field>
        </Field>

        <Field data-invalid={!!errors.postalCodes}>
          <FieldLabel htmlFor="postalCodes">
            Postal codes (comma separated) <span className="text-destructive">*</span>
          </FieldLabel>
          <Textarea
            id="postalCodes"
            placeholder="75001, 75002, 69001"
            aria-invalid={!!errors.postalCodes}
            {...register("postalCodes", {
              required: "At least one postal code is required",
              validate: (value) => {
                const codes = value
                  .split(",")
                  .map((code) => code.trim())
                  .filter(Boolean);

                if (codes.length === 0) {
                  return "At least one postal code is required";
                }

                return (
                  codes.every((code) => POSTAL_CODE_PATTERN.test(code)) ||
                  "Postal codes must be 5 digits"
                );
              },
            })}
          />
          <FieldError errors={[errors.postalCodes]} />
        </Field>

        <Field>
          <FieldLabel>Time windows <span className="text-destructive">*</span></FieldLabel>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  type="time"
                  {...register(`timeWindows.${index}.start`, {
                    required: true,
                  })}
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="time"
                  {...register(`timeWindows.${index}.end`, {
                    required: true,
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ start: "00:00", end: "23:59" })}
            >
              Add time window
            </Button>
          </div>
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

export default DeliveryForm;
