"use client";

import { useState } from "react";
import Link from "next/link";
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
import { useRoutingHistoryApi } from "@/hooks/routing.hook";

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRoutingHistoryApi(page, 10, "DISTRIBUTED");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Distribution history</h1>
        <p className="text-sm text-muted-foreground">
          Every lead that was successfully routed to a client.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Price paid</TableHead>
              <TableHead>Distributed at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((lead: any) =>
              lead.distributions.map((distribution: any) => (
                <TableRow key={distribution.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="hover:underline"
                    >
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{lead.vertical.name}</TableCell>
                  <TableCell>{distribution.client.name}</TableCell>
                  <TableCell>{distribution.pricePaid}</TableCell>
                  <TableCell>
                    {new Date(distribution.distributedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
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

export default HistoryPage;
