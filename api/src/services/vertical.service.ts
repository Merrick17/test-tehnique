import { prisma } from "../prisma/prisma";

export const listVerticals =
  async () => {
    return prisma.vertical.findMany({
      orderBy: {
        name: "asc",
      },
    });
  };
