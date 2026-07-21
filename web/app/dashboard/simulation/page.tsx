"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeadForm from "@/components/lead-form";
import { useRoutingApi } from "@/hooks/routing.hook";

const SimulationPage = () => {
  const { simulateMutation } = useRoutingApi();
  const results = simulateMutation.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Routing simulation</h1>
          <p className="text-sm text-muted-foreground">
            Preview which delivery a lead would be routed to, without
            creating it.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/dashboard/leads/new" />}>
          Create a real lead
        </Button>
      </div>

      <LeadForm
        submitLabel="Simulate"
        isSubmitting={simulateMutation.isPending}
        onSubmit={(input) => simulateMutation.mutate(input)}
      />

      {results && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            Eligible deliveries ({results.length})
          </h2>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No eligible delivery found for this lead.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Remaining capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result: any) => (
                  <TableRow key={result.deliveryId}>
                    <TableCell>{result.rank}</TableCell>
                    <TableCell>{result.client.name}</TableCell>
                    <TableCell>{result.pricePerLead}</TableCell>
                    <TableCell>{result.remainingCapacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationPage;
