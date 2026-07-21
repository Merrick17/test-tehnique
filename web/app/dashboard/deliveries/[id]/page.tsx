"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeliveryApi } from "@/hooks/delivery.hook";

const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const DeliveryDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: delivery, isLoading } = useDeliveryApi(params.id);

  if (isLoading || !delivery) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {delivery.client.name} - {delivery.vertical.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Ages {delivery.minAge}-{delivery.maxAge} - {delivery.dailyCapacity}
            /day - {delivery.pricePerLead} per lead
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={delivery.isActive ? "default" : "secondary"}>
            {delivery.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            render={
              <Link href={`/dashboard/deliveries/${delivery.id}/edit`} />
            }
          >
            Edit
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Postal codes
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {delivery.postalCodes.map((postalCode: { id: string; postalCode: string }) => (
            <Badge key={postalCode.id} variant="outline">
              {postalCode.postalCode}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Time windows
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {delivery.timeWindows.map((window: { id: string; startMinute: number; endMinute: number }) => (
            <Badge key={window.id} variant="outline">
              {minutesToTime(window.startMinute)} -{" "}
              {minutesToTime(window.endMinute)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailPage;
