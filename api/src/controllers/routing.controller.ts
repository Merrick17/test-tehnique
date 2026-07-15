import type {
  Request,
  Response,
} from "express";
import * as routingService from "../services/routing.service";

export const simulateRouting = async (
  req: Request,
  res: Response
) => {
  const result =
    await routingService
      .simulateRouting(
        req.body
      );

  return res.json(result);
};

export const distributeLead = async (
  req: Request,
  res: Response
) => {
  const result =
    await routingService
      .distributeLead(
        req.body
      );

  return res
    .status(201)
    .json(result);
};

export const listRoutingHistory =
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await routingService
        .listRoutingHistory(
          req.query.page,
          req.query.limit,
          req.query.status
        );

    return res.json(result);
  };

export const getLeadById = async (
  req: Request,
  res: Response
) => {
    const id = req.params.id as string; 
  const result =
    await routingService
      .getLeadById(
        id 
      );

  return res.json(result);
};
