import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/prisma";
import { AppError } from "../utils/errors";
import { getPagination } from "../utils/pagination";
import {
  validateTimeWindows,
  type TimeWindowInput,
} from "../utils/timeWindows";

type CreateDeliveryInput = {
  clientId: string;
  verticalId: string;
  minAge: number;
  maxAge: number;
  dailyCapacity: number;
  pricePerLead: number;
  isActive?: boolean;
  postalCodes: string[];
  timeWindows: TimeWindowInput[];
};

type UpdateDeliveryInput =
  Partial<
    Omit<
      CreateDeliveryInput,
      "clientId"
    >
  >;

const validateDeliveryInput = (
  minAge: number,
  maxAge: number,
  timeWindows: TimeWindowInput[]
) => {
  if (minAge > maxAge) {
    throw new AppError(
      "minAge cannot be greater than maxAge"
    );
  }

  validateTimeWindows(
    timeWindows
  );
};

export const listDeliveries = async (
  pageInput: unknown,
  limitInput: unknown
) => {
  const {
    page,
    limit,
    skip,
  } = getPagination(
    pageInput,
    limitInput
  );

  const [items, total] =
    await prisma.$transaction([
      prisma.delivery.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          client: true,
          vertical: true,
          postalCodes: true,
          timeWindows: true,
        },
      }),

      prisma.delivery.count(),
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

export const getDeliveryById = async (
  id: string
) => {
  const delivery =
    await prisma.delivery.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        vertical: true,
        postalCodes: true,
        timeWindows: true,
      },
    });

  if (!delivery) {
    throw new AppError(
      "Delivery not found",
      404
    );
  }

  return delivery;
};

const getDeliveryDefaults = async (
  id: string
) => {
  const delivery =
    await prisma.delivery.findUnique({
      where: {
        id,
      },
      select: {
        minAge: true,
        maxAge: true,
        timeWindows: {
          select: {
            startMinute: true,
            endMinute: true,
          },
        },
      },
    });

  if (!delivery) {
    throw new AppError(
      "Delivery not found",
      404
    );
  }

  return delivery;
};

const ensureDeliveryExists = async (
  id: string
) => {
  const delivery =
    await prisma.delivery.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

  if (!delivery) {
    throw new AppError(
      "Delivery not found",
      404
    );
  }
};

export const listClientDeliveries =
  async (
    clientId: string
  ) => {
    const client =
      await prisma.client.findUnique({
        where: {
          id: clientId,
        },
        select: {
          id: true,
        },
      });

    if (!client) {
      throw new AppError(
        "Client not found",
        404
      );
    }

    return prisma.delivery.findMany({
      where: {
        clientId,
      },
      include: {
        vertical: true,
        postalCodes: true,
        timeWindows: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const createDelivery = async (
  input: CreateDeliveryInput
) => {
  validateDeliveryInput(
    input.minAge,
    input.maxAge,
    input.timeWindows
  );

  const [client, vertical] =
    await Promise.all([
      prisma.client.findUnique({
        where: {
          id: input.clientId,
        },
        select: {
          id: true,
        },
      }),

      prisma.vertical.findUnique({
        where: {
          id: input.verticalId,
        },
        select: {
          id: true,
        },
      }),
    ]);

  if (!client) {
    throw new AppError(
      "Client not found",
      404
    );
  }

  if (!vertical) {
    throw new AppError(
      "Vertical not found",
      404
    );
  }

  return prisma.delivery.create({
    data: {
      clientId: input.clientId,
      verticalId:
        input.verticalId,
      minAge: input.minAge,
      maxAge: input.maxAge,
      dailyCapacity:
        input.dailyCapacity,
      pricePerLead:
        new Prisma.Decimal(
          input.pricePerLead
        ),
      isActive:
        input.isActive ?? true,

      postalCodes: {
        create:
          input.postalCodes.map(
            (postalCode) => ({
              postalCode,
            })
          ),
      },

      timeWindows: {
        create:
          input.timeWindows,
      },
    },
    include: {
      client: true,
      vertical: true,
      postalCodes: true,
      timeWindows: true,
    },
  });
};

export const updateDelivery = async (
  id: string,
  input: UpdateDeliveryInput
) => {
  const existing =
    await getDeliveryDefaults(id);

  const minAge =
    input.minAge ??
    existing.minAge;

  const maxAge =
    input.maxAge ??
    existing.maxAge;

  const timeWindows =
    input.timeWindows ??
    existing.timeWindows;

  validateDeliveryInput(
    minAge,
    maxAge,
    timeWindows
  );

  if (input.verticalId) {
    const vertical =
      await prisma.vertical.findUnique({
        where: {
          id: input.verticalId,
        },
        select: {
          id: true,
        },
      });

    if (!vertical) {
      throw new AppError(
        "Vertical not found",
        404
      );
    }
  }

  return prisma.$transaction(
    async (tx) => {
      if (input.postalCodes) {
        await tx.deliveryPostalCode
          .deleteMany({
            where: {
              deliveryId: id,
            },
          });
      }

      if (input.timeWindows) {
        await tx.deliveryTimeWindow
          .deleteMany({
            where: {
              deliveryId: id,
            },
          });
      }

      return tx.delivery.update({
        where: {
          id,
        },
        data: {
          verticalId: input.verticalId,
          minAge: input.minAge,
          maxAge: input.maxAge,
          dailyCapacity:
            input.dailyCapacity,
          pricePerLead:
            input.pricePerLead !== undefined
              ? new Prisma.Decimal(
                  input.pricePerLead
                )
              : undefined,
          isActive: input.isActive,
          postalCodes: input.postalCodes
            ? {
                create:
                  input.postalCodes.map(
                    (postalCode) => ({
                      postalCode,
                    })
                  ),
              }
            : undefined,
          timeWindows: input.timeWindows
            ? {
                create:
                  input.timeWindows,
              }
            : undefined,
        },
        include: {
          client: true,
          vertical: true,
          postalCodes: true,
          timeWindows: true,
        },
      });
    }
  );
};

export const deleteDelivery = async (
  id: string
) => {
  await ensureDeliveryExists(id);

  await prisma.delivery.delete({
    where: {
      id,
    },
  });

  return {
    message: "Delivery deleted",
  };
};
