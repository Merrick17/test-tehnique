import Joi from "joi";

export const createClientSchema =
  Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(150)
      .required(),

    email: Joi.string()
      .email()
      .allow(null, ""),

    isActive: Joi.boolean()
      .default(true),
  });

export const updateClientSchema =
  Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(150),

    email: Joi.string()
      .email()
      .allow(null, ""),

    isActive: Joi.boolean(),
  }).min(1);
