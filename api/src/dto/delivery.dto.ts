import Joi from "joi";

const timeWindowSchema =
  Joi.object({
    startMinute: Joi.number()
      .integer()
      .min(0)
      .max(1439)
      .required(),

    endMinute: Joi.number()
      .integer()
      .min(1)
      .max(1440)
      .required(),
  });

export const createDeliverySchema =
  Joi.object({
    clientId: Joi.string()
      .required(),

    verticalId: Joi.string()
      .required(),

    minAge: Joi.number()
      .integer()
      .min(0)
      .max(120)
      .required(),

    maxAge: Joi.number()
      .integer()
      .min(0)
      .max(120)
      .required(),

    dailyCapacity: Joi.number()
      .integer()
      .min(1)
      .required(),

    pricePerLead: Joi.number()
      .positive()
      .precision(2)
      .required(),

    isActive: Joi.boolean()
      .default(true),

    postalCodes: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d{5}$/)
      )
      .min(1)
      .unique()
      .required(),

    timeWindows: Joi.array()
      .items(timeWindowSchema)
      .min(1)
      .required(),
  });

export const updateDeliverySchema =
  Joi.object({
    verticalId: Joi.string(),

    minAge: Joi.number()
      .integer()
      .min(0)
      .max(120),

    maxAge: Joi.number()
      .integer()
      .min(0)
      .max(120),

    dailyCapacity: Joi.number()
      .integer()
      .min(1),

    pricePerLead: Joi.number()
      .positive()
      .precision(2),

    isActive: Joi.boolean(),

    postalCodes: Joi.array()
      .items(
        Joi.string()
          .pattern(/^\d{5}$/)
      )
      .min(1)
      .unique(),

    timeWindows: Joi.array()
      .items(timeWindowSchema)
      .min(1),
  }).min(1);
