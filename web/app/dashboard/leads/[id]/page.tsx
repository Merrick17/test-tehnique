"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeadApi } from "@/hooks/routing.hook";

const LeadDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data: lead, isLoading } = useLeadApi(params.id);

  if (isLoading || !lead) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lead.vertical.name} - {lead.postalCode} -{" "}
            {new Date(lead.receivedAt).toLocaleString()}
          </p>
        </div>
        <Badge variant={lead.status === "DISTRIBUTED" ? "default" : "secondary"}>
          {lead.status}
        </Badge>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground">
        Distributions
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Price paid</TableHead>
            <TableHead>Distributed at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lead.distributions?.map((distribution: any) => (
            <TableRow key={distribution.id}>
              <TableCell>{distribution.client.name}</TableCell>
              <TableCell>{distribution.delivery.id}</TableCell>
              <TableCell>{distribution.pricePaid}</TableCell>
              <TableCell>
                {new Date(distribution.distributedAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadDetailPage;
