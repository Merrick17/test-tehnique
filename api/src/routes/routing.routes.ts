import { Router } from "express";
import {
  distributeLead,
  getLeadById,
  listRoutingHistory,
  simulateRouting,
} from "../controllers/routing.controller";
import { leadSchema } from "../dto/lead.dto";
import { validate } from "../middlewares/validate";
import { verifyAuth } from "../middlewares/verifyAuth";
import { asyncHandler } from "../utils/asyncHandler";

export const routingRouter =
  Router();

routingRouter.use(
  verifyAuth
);

/**
 * @openapi
 * components:
 *   schemas:
 *     LeadInput:
 *       type: object
 *       required: [firstName, lastName, birthDate, postalCode, verticalId]
 *       properties:
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         birthDate: { type: string, format: date }
 *         postalCode: { type: string }
 *         verticalId: { type: string }
 *         receivedAt: { type: string, format: date-time }
 */

/**
 * @openapi
 * /routing/simulate:
 *   post:
 *     summary: Simulate routing for a lead without persisting it
 *     tags: [Routing]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       200:
 *         description: Ranked list of eligible deliveries
 *       404:
 *         description: Vertical not found
 */
routingRouter.post(
  "/simulate",
  validate(leadSchema),
  asyncHandler(
    simulateRouting
  )
);

/**
 * @openapi
 * /routing/distribute:
 *   post:
 *     summary: Create a lead and distribute it to the best eligible delivery
 *     tags: [Routing]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeadInput'
 *     responses:
 *       201:
 *         description: Lead created, with a distribution if one was made
 */
routingRouter.post(
  "/distribute",
  validate(leadSchema),
  asyncHandler(
    distributeLead
  )
);

/**
 * @openapi
 * /routing/history:
 *   get:
 *     summary: List lead routing history
 *     tags: [Routing]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DISTRIBUTED, NON_DISTRIBUTED] }
 *     responses:
 *       200:
 *         description: Paginated list of leads
 */
routingRouter.get(
  "/history",
  asyncHandler(
    listRoutingHistory
  )
);

/**
 * @openapi
 * /routing/leads/{id}:
 *   get:
 *     summary: Get a lead by id, including its distributions
 *     tags: [Routing]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lead details
 *       404:
 *         description: Lead not found
 */
routingRouter.get(
  "/leads/:id",
  asyncHandler(
    getLeadById
  )
);
