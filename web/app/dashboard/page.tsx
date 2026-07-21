"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientsApi } from "@/hooks/client.hook";
import { useDeliveriesApi } from "@/hooks/delivery.hook";
import { useRoutingHistoryApi } from "@/hooks/routing.hook";

const STAT_CARDS = [
  {
    key: "clients" as const,
    title: "Clients",
    description: "Total registered clients",
    href: "/dashboard/clients",
    cta: "View clients",
  },
  {
    key: "deliveries" as const,
    title: "Deliveries",
    description: "Configured lead delivery rules",
    href: "/dashboard/deliveries",
    cta: "View deliveries",
  },
  {
    key: "distributed" as const,
    title: "Distributed leads",
    description: "Leads successfully routed to a client",
    href: "/dashboard/history",
    cta: "View history",
  },
  {
    key: "nonDistributed" as const,
    title: "Non-distributed leads",
    description: "Leads that found no eligible delivery",
    href: "/dashboard/leads",
    cta: "View leads",
  },
];

const DashboardPage = () => {
  const { clientsQuery } = useClientsApi(1, 1);
  const { deliveriesQuery } = useDeliveriesApi(1, 1);
  const distributedQuery = useRoutingHistoryApi(1, 1, "DISTRIBUTED");
  const nonDistributedQuery = useRoutingHistoryApi(1, 1, "NON_DISTRIBUTED");

  const totals = {
    clients: clientsQuery.data?.pagination?.total,
    deliveries: deliveriesQuery.data?.pagination?.total,
    distributed: distributedQuery.data?.pagination?.total,
    nonDistributed: nonDistributedQuery.data?.pagination?.total,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your lead distribution activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <Card key={card.key}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {totals[card.key] === undefined ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-3xl font-semibold">
                  {totals[card.key]}
                </span>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={card.href} />}
              >
                {card.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
