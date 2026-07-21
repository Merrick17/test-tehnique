"use client";

import ClientForm from "@/components/client-form";
import { useClientsApi } from "@/hooks/client.hook";

const NewClientPage = () => {
  const { createMutation } = useClientsApi();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">New client</h1>
      <ClientForm
        submitLabel="Create client"
        isSubmitting={createMutation.isPending}
        onSubmit={(input) => createMutation.mutate(input)}
      />
    </div>
  );
};

export default NewClientPage;
