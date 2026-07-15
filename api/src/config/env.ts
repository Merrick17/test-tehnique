import "dotenv/config";

const required = (
  value: string | undefined,
  name: string
): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3200),
  jwtSecret: required(
    process.env.JWT_SECRET,
    "JWT_SECRET"
  ),
  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN ?? "1d",
};
