import type {
  NextFunction,
  Request,
  Response,
} from "express";
import type { ObjectSchema } from "joi";

export const validate = (
  schema: ObjectSchema,
  property: "body" | "query" | "params" = "body"
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error, value } = schema.validate(
      req[property],
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    req[property] = value;
    return next();
  };
};
