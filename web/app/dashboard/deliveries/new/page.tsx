"use client";

import DeliveryForm from "@/components/delivery-form";
import { useDeliveriesApi } from "@/hooks/delivery.hook";

const NewDeliveryPage = () => {
  const { createMutation } = useDeliveriesApi();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">New delivery</h1>
      <DeliveryForm
        submitLabel="Create delivery"
        isSubmitting={createMutation.isPending}
        onSubmit={(input) => createMutation.mutate(input)}
      />
    </div>
  );
};

export default NewDeliveryPage;
