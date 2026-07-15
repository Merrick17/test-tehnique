import { Router } from "express";
import { listVerticals } from "../controllers/vertical.controller";
import { verifyAuth } from "../middlewares/verifyAuth";
import { asyncHandler } from "../utils/asyncHandler";

export const verticalRouter = Router();

verticalRouter.use(verifyAuth);

/**
 * @openapi
 * /verticals:
 *   get:
 *     summary: List verticals
 *     tags: [Verticals]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of verticals
 */
verticalRouter.get(
  "/",
  asyncHandler(listVerticals)
);
