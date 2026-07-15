import {
  LeadStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "../prisma/prisma";
import { AppError } from "../utils/errors";
import { getPagination } from "../utils/pagination";
import {
  isDeliveryEligible,
  sortEligibleDeliveries,
} from "../utils/routing";
import {
  getEndOfDay,
  getStartOfDay,
} from "../utils/time";

type LeadInput = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  postalCode: string;
  verticalId: string;
  receivedAt?: Date;
};

const getCandidates = async (
  input: LeadInput,
  receivedAt: Date
) => {
  const startOfDay =
    getStartOfDay(receivedAt);

  const endOfDay =
    getEndOfDay(receivedAt);

  const deliveries =
    await prisma.delivery.findMany({
      where: {
        isActive: true,
        verticalId:
          input.verticalId,
        client: {
          isActive: true,
        },
        postalCodes: {
          some: {
            postalCode:
              input.postalCode,
          },
        },
      },

      include: {
        client: true,
        postalCodes: true,
        timeWindows: true,

        distributions: {
          where: {
            distributedAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

  return deliveries.map(
    (delivery) => ({
      ...delivery,
      pricePerLead:
        Number(
          delivery.pricePerLead
        ),
      distributedToday:
        delivery.distributions.length,
    })
  );
};

export const simulateRouting = async (
  input: LeadInput
) => {
  const receivedAt =
    input.receivedAt ??
    new Date();

  const vertical =
    await prisma.vertical.findUnique({
      where: {
        id: input.verticalId,
      },
    });

  if (!vertical) {
    throw new AppError(
      "Vertical not found",
      404
    );
  }

  const candidates =
    await getCandidates(
      input,
      receivedAt
    );

  const eligible =
    candidates.filter(
      (delivery) =>
        isDeliveryEligible(
          {
            birthDate:
              new Date(
                input.birthDate
              ),
            postalCode:
              input.postalCode,
            verticalId:
              input.verticalId,
            receivedAt,
          },
          delivery
        )
    );

  const ranked =
    sortEligibleDeliveries(
      eligible
    );

  return ranked.map(
    (delivery, index) => ({
      rank: index + 1,
      deliveryId:
        delivery.id,
      client: {
        id:
          delivery.client.id,
        name:
          delivery.client.name,
      },
      pricePerLead:
        delivery.pricePerLead,
      dailyCapacity:
        delivery.dailyCapacity,
      distributedToday:
        delivery.distributedToday,
      remainingCapacity:
        delivery.dailyCapacity -
        delivery.distributedToday,
    })
  );
};

export const distributeLead = async (
  input: LeadInput
) => {
  const receivedAt =
    input.receivedAt ??
    new Date();

  const ranked =
    await simulateRouting({
      ...input,
      receivedAt,
    });

  const winner =
    ranked[0];

  return prisma.$transaction(
    async (tx) => {
      const lead =
        await tx.lead.create({
          data: {
            firstName:
              input.firstName,
            lastName:
              input.lastName,
            birthDate:
              new Date(
                input.birthDate
              ),
            postalCode:
              input.postalCode,
            verticalId:
              input.verticalId,
            receivedAt,
            status: winner
              ? LeadStatus.DISTRIBUTED
              : LeadStatus.NON_DISTRIBUTED,
          },
        });

      if (!winner) {
        return {
          lead,
          distribution: null,
        };
      }

      const startOfDay =
        getStartOfDay(
          receivedAt
        );

      const endOfDay =
        getEndOfDay(
          receivedAt
        );

      const delivery =
        await tx.delivery.findUnique({
          where: {
            id:
              winner.deliveryId,
          },
        });

      if (!delivery) {
        throw new AppError(
          "Delivery not found during distribution",
          409
        );
      }

      const distributedToday =
        await tx.distribution.count({
          where: {
            deliveryId:
              delivery.id,
            distributedAt: {
              gte:
                startOfDay,
              lte:
                endOfDay,
            },
          },
        });

      if (
        distributedToday >=
        delivery.dailyCapacity
      ) {
        const updatedLead =
          await tx.lead.update({
            where: {
              id: lead.id,
            },
            data: {
              status:
                LeadStatus.NON_DISTRIBUTED,
            },
          });

        return {
          lead: updatedLead,
          distribution: null,
        };
      }

      const distribution =
        await tx.distribution.create({
          data: {
            leadId: lead.id,
            clientId:
              winner.client.id,
            deliveryId:
              winner.deliveryId,
            pricePaid:
              new Prisma.Decimal(
                winner.pricePerLead
              ),
          },
        });

      return {
        lead,
        distribution,
      };
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel
          .Serializable,
    }
  );
};

export const listRoutingHistory =
  async (
    pageInput: unknown,
    limitInput: unknown,
    statusInput?: unknown
  ) => {
    const {
      page,
      limit,
      skip,
    } = getPagination(
      pageInput,
      limitInput
    );

    const status =
      statusInput === "DISTRIBUTED" ||
      statusInput === "NON_DISTRIBUTED"
        ? statusInput
        : undefined;

    const where = status
      ? {
          status:
            status as LeadStatus,
        }
      : {};

    const [items, total] =
      await prisma.$transaction([
        prisma.lead.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            receivedAt: "desc",
          },
          include: {
            vertical: true,
            distributions: {
              include: {
                client: true,
                delivery: true,
              },
            },
          },
        }),

        prisma.lead.count({
          where,
        }),
      ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(
          total / limit
        ),
      },
    };
  };

export const getLeadById = async (
  id: string
) => {
  const lead =
    await prisma.lead.findUnique({
      where: {
        id,
      },
      include: {
        vertical: true,
        distributions: {
          include: {
            client: true,
            delivery: true,
          },
        },
      },
    });

  if (!lead) {
    throw new AppError(
      "Lead not found",
      404
    );
  }

  return lead;
};
