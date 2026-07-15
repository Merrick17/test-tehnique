import { prisma } from "../prisma/prisma";
import { AppError } from "../utils/errors";
import { getPagination } from "../utils/pagination";

type CreateClientInput = {
  name: string;
  email?: string | null;
  isActive?: boolean;
};

type UpdateClientInput =
  Partial<CreateClientInput>;

export const listClients = async (
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
      prisma.client.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              deliveries: true,
              distributions: true,
            },
          },
        },
      }),

      prisma.client.count(),
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

export const getClientById = async (
  id: string
) => {
  const client =
    await prisma.client.findUnique({
      where: {
        id,
      },
      include: {
        deliveries: {
          include: {
            vertical: true,
            postalCodes: true,
            timeWindows: true,
          },
        },
      },
    });

  if (!client) {
    throw new AppError(
      "Client not found",
      404
    );
  }

  return client;
};

const ensureClientExists = async (
  id: string
) => {
  const client =
    await prisma.client.findUnique({
      where: {
        id,
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
};

export const createClient = async (
  input: CreateClientInput
) => {
  return prisma.client.create({
    data: {
      name: input.name,
      email: input.email || null,
      isActive:
        input.isActive ?? true,
    },
  });
};

export const updateClient = async (
  id: string,
  input: UpdateClientInput
) => {
  await ensureClientExists(id);

  return prisma.client.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      email:
        input.email !== undefined
          ? input.email || null
          : undefined,
      isActive: input.isActive,
    },
  });
};

export const deleteClient = async (
  id: string
) => {
  await ensureClientExists(id);

  await prisma.client.delete({
    where: {
      id,
    },
  });

  return {
    message: "Client deleted",
  };
};
