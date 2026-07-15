import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../prisma/prisma";
import { AppError } from "../utils/errors";

type LoginInput = {
  email: string;
  password: string;
};

export const login = async (
  input: LoginInput
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const isPasswordValid =
    await argon2.verify(
      user.passwordHash,
      input.password
    );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
