"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import ListPagination from "@/components/list-pagination";
import { useDeliveriesApi } from "@/hooks/delivery.hook";
import type { Delivery } from "@/types";

const DeliveriesPage = () => {
  const [page, setPage] = useState(1);
  const { deliveriesQuery, deleteMutation } = useDeliveriesApi(page, 10);
  const data = deliveriesQuery.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Deliveries</h1>
        <Button render={<Link href="/dashboard/deliveries/new" />}>New delivery</Button>
      </div>

      {deliveriesQuery.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Age range</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((delivery: Delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>{delivery.client.name}</TableCell>
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
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/dashboard/deliveries/${delivery.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(delivery.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {data?.pagination && (
        <ListPagination
          page={data.pagination.page}
          pages={data.pagination.pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default DeliveriesPage;
