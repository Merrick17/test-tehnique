"use client";

import { useRouter } from "next/navigation";
import LeadForm from "@/components/lead-form";
import { useRoutingApi } from "@/hooks/routing.hook";

const NewLeadPage = () => {
  const router = useRouter();
  const { distributeMutation } = useRoutingApi();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-xl font-semibold">New lead</h1>
      <LeadForm
        submitLabel="Create and distribute"
        isSubmitting={distributeMutation.isPending}
        onSubmit={(input) =>
          distributeMutation.mutate(input, {
            onSuccess: (result) => {
              router.push(`/dashboard/leads/${result.lead.id}`);
            },
          })
        }
      />
    </div>
  );
};

export default NewLeadPage;
