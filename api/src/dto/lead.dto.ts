import Joi from "joi";

export const leadSchema =
  Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    lastName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    birthDate: Joi.date()
      .iso()
      .max("now")
      .required(),

    postalCode: Joi.string()
      .pattern(/^\d{5}$/)
      .required(),

    verticalId: Joi.string()
      .required(),

    receivedAt: Joi.date()
      .iso(),
  });
