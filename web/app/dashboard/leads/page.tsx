"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const LeadsPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("ALL");
  const { data, isLoading } = useRoutingHistoryApi(
    page,
    10,
    status === "ALL" ? undefined : status
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Leads</h1>
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value ?? "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="DISTRIBUTED">Distributed</SelectItem>
              <SelectItem value="NON_DISTRIBUTED">Non distributed</SelectItem>
            </SelectContent>
          </Select>
          <Button render={<Link href="/dashboard/leads/new" />}>New lead</Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Postal code</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((lead: any) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="hover:underline"
                  >
                    {lead.firstName} {lead.lastName}
                  </Link>
                </TableCell>
                <TableCell>{lead.vertical.name}</TableCell>
                <TableCell>{lead.postalCode}</TableCell>
                <TableCell>
                  {new Date(lead.receivedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lead.status === "DISTRIBUTED" ? "default" : "secondary"
                    }
                  >
                    {lead.status}
                  </Badge>
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

export default LeadsPage;
