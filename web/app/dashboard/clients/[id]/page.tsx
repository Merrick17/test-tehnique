"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientApi } from "@/hooks/client.hook";

type Delivery = {
  id: string;
  vertical: { name: string };
  minAge: number;
  maxAge: number;
  dailyCapacity: number;
  pricePerLead: string;
  isActive: boolean;
};

const ClientDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: client, isLoading } = useClientApi(params.id);

  if (isLoading || !client) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{client.name}</h1>
          <p className="text-sm text-muted-foreground">
            {client.email ?? "No email"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={client.isActive ? "default" : "secondary"}>
            {client.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/dashboard/clients/${client.id}/edit`} />}
          >
            Edit
          </Button>
        </div>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground">
        Deliveries
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vertical</TableHead>
            <TableHead>Age range</TableHead>
            <TableHead>Daily capacity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {client.deliveries?.map((delivery: Delivery) => (
            <TableRow key={delivery.id}>
              <TableCell>
                <Link
                  href={`/dashboard/deliveries/${delivery.id}`}
                  className="hover:underline"
                >
                  {delivery.vertical.name}
                </Link>
              </TableCell>
              <TableCell>
                {delivery.minAge} - {delivery.maxAge}
              </TableCell>
              <TableCell>{delivery.dailyCapacity}</TableCell>
              <TableCell>{delivery.pricePerLead}</TableCell>
              <TableCell>
                <Badge variant={delivery.isActive ? "default" : "secondary"}>
                  {delivery.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientDetailPage;
