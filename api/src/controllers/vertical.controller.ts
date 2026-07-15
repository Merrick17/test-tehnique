import type {
  Request,
  Response,
} from "express";
import * as verticalService from "../services/vertical.service";

export const listVerticals = async (
  _req: Request,
  res: Response
) => {
  const result =
    await verticalService.listVerticals();

  return res.json(result);
};
