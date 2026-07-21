"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ClientForm from "@/components/client-form";
import { useClientApi, useClientsApi } from "@/hooks/client.hook";

const EditClientPage = () => {
  const params = useParams<{ id: string }>();
  const { data: client } = useClientApi(params.id);
  const { updateMutation } = useClientsApi();

  if (!client) {
    return <Skeleton className="h-48 w-full max-w-md" />;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">Edit client</h1>
      <ClientForm
        key={client.id}
        defaultValues={{
          name: client.name,
          email: client.email ?? "",
          isActive: client.isActive,
        }}
        submitLabel="Save changes"
        isSubmitting={updateMutation.isPending}
        onSubmit={(input) => updateMutation.mutate({ id: params.id, input })}
      />
    </div>
  );
};

export default EditClientPage;
