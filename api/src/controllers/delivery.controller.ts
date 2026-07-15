import type {
  Request,
  Response,
} from "express";
import * as deliveryService from "../services/delivery.service";

export const listDeliveries = async (
  req: Request,
  res: Response
) => {
  const result =
    await deliveryService.listDeliveries(
      req.query.page,
      req.query.limit
    );

  return res.json(result);
};

export const getDeliveryById = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string; 
  const result =
    await deliveryService.getDeliveryById(
    id
    );

  return res.json(result);
};

export const listClientDeliveries =
  async (
    req: Request,
    res: Response
  ) => {
    const clientId = req.params.clientId as string;
    const result =
      await deliveryService
        .listClientDeliveries(
          clientId
        );

    return res.json(result);
  };

export const createDelivery = async (
  req: Request,
  res: Response
) => {
  const result =
    await deliveryService
      .createDelivery(
        req.body
      );

  return res
    .status(201)
    .json(result);
};

export const updateDelivery = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string; 
  const result =
    await deliveryService
      .updateDelivery(
        id,
        req.body
      );

  return res.json(result);
};

export const deleteDelivery = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string; 
  const result =
    await deliveryService
      .deleteDelivery(
       id
      );

  return res.json(result);
};
