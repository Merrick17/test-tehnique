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
import { useClientsApi } from "@/hooks/client.hook";
import type { Client } from "@/types";

const ClientsPage = () => {
  const [page, setPage] = useState(1);
  const { clientsQuery, deleteMutation } = useClientsApi(page, 10);
  const data = clientsQuery.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Button render={<Link href="/dashboard/clients/new" />}>New client</Button>
      </div>

      {clientsQuery.isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deliveries</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((client: Client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="hover:underline"
                  >
                    {client.name}
                  </Link>
                </TableCell>
                <TableCell>{client.email ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant={client.isActive ? "default" : "secondary"}>
                    {client.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{client._count?.deliveries ?? 0}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/dashboard/clients/${client.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(client.id)}
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

export default ClientsPage;
