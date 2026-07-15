import type {
  Request,
  Response,
} from "express";
import * as clientService from "../services/client.service";

export const listClients = async (
  req: Request,
  res: Response
) => {
  const result =
    await clientService.listClients(
      req.query.page,
      req.query.limit
    );

  return res.json(result);
};

export const getClientById = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string; 
  const result =
    await clientService.getClientById(
      id
    );

  return res.json(result);
};

export const createClient = async (
  req: Request,
  res: Response
) => {
  const result =
    await clientService.createClient(
      req.body
    );

  return res
    .status(201)
    .json(result);
};

export const updateClient = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string; 
  const result =
    await clientService.updateClient(
      id,
      req.body
    );

  return res.json(result);
};

export const deleteClient = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string; 
  const result =
    await clientService.deleteClient(
      id
    );

  return res.json(result);
};
