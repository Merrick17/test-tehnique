"use client";

import { useParams } from "next/navigation";
import DeliveryForm from "@/components/delivery-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeliveryApi, useDeliveriesApi } from "@/hooks/delivery.hook";

const EditDeliveryPage = () => {
  const params = useParams<{ id: string }>();
  const { data: delivery } = useDeliveryApi(params.id);
  const { updateMutation } = useDeliveriesApi();

  if (!delivery) {
    return <Skeleton className="h-48 w-full max-w-md" />;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit delivery</h1>
      <DeliveryForm
        key={delivery.id}
        initialValue={{
          clientId: delivery.client.id,
          verticalId: delivery.vertical.id,
          minAge: delivery.minAge,
          maxAge: delivery.maxAge,
          dailyCapacity: delivery.dailyCapacity,
          pricePerLead: Number(delivery.pricePerLead),
          isActive: delivery.isActive,
          postalCodes: delivery.postalCodes.map(
            (p: { postalCode: string }) => p.postalCode
          ),
          timeWindows: delivery.timeWindows.map(
            (w: { startMinute: number; endMinute: number }) => ({
              startMinute: w.startMinute,
              endMinute: w.endMinute,
            })
          ),
        }}
        submitLabel="Save changes"
        isSubmitting={updateMutation.isPending}
        onSubmit={(input) => updateMutation.mutate({ id: params.id, input })}
      />
    </div>
  );
};

export default EditDeliveryPage;
