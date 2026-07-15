import { Router } from "express";
import {
  createDelivery,
  deleteDelivery,
  getDeliveryById,
  listClientDeliveries,
  listDeliveries,
  updateDelivery,
} from "../controllers/delivery.controller";
import {
  createDeliverySchema,
  updateDeliverySchema,
} from "../dto/delivery.dto";
import { validate } from "../middlewares/validate";
import { verifyAuth } from "../middlewares/verifyAuth";
import { asyncHandler } from "../utils/asyncHandler";

export const deliveryRouter =
  Router();

deliveryRouter.use(
  verifyAuth
);

/**
 * @openapi
 * /deliveries:
 *   get:
 *     summary: List deliveries
 *     tags: [Deliveries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of deliveries
 */
deliveryRouter.get(
  "/",
  asyncHandler(
    listDeliveries
  )
);

/**
 * @openapi
 * /deliveries/client/{clientId}:
 *   get:
 *     summary: List deliveries for a client
 *     tags: [Deliveries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of deliveries for the client
 *       404:
 *         description: Client not found
 */
deliveryRouter.get(
  "/client/:clientId",
  asyncHandler(
    listClientDeliveries
  )
);

/**
 * @openapi
 * /deliveries/{id}:
 *   get:
 *     summary: Get a delivery by id
 *     tags: [Deliveries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Delivery details
 *       404:
 *         description: Delivery not found
 */
deliveryRouter.get(
  "/:id",
  asyncHandler(
    getDeliveryById
  )
);

/**
 * @openapi
 * /deliveries:
 *   post:
 *     summary: Create a delivery
 *     tags: [Deliveries]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientId, verticalId, minAge, maxAge, dailyCapacity, pricePerLead, postalCodes, timeWindows]
 *             properties:
 *               clientId: { type: string }
 *               verticalId: { type: string }
 *               minAge: { type: integer }
 *               maxAge: { type: integer }
 *               dailyCapacity: { type: integer }
 *               pricePerLead: { type: number }
 *               isActive: { type: boolean }
 *               postalCodes:
 *                 type: array
 *                 items: { type: string }
 *               timeWindows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startMinute: { type: integer }
 *                     endMinute: { type: integer }
 *     responses:
 *       201:
 *         description: Delivery created
 *       404:
 *         description: Client or vertical not found
 */
deliveryRouter.post(
  "/",
  validate(
    createDeliverySchema
  ),
  asyncHandler(
    createDelivery
  )
);

/**
 * @openapi
 * /deliveries/{id}:
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verticalId: { type: string }
 *               minAge: { type: integer }
 *               maxAge: { type: integer }
 *               dailyCapacity: { type: integer }
 *               pricePerLead: { type: number }
 *               isActive: { type: boolean }
 *               postalCodes:
 *                 type: array
 *                 items: { type: string }
 *               timeWindows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startMinute: { type: integer }
 *                     endMinute: { type: integer }
 *     responses:
 *       200:
 *         description: Delivery updated
 *       404:
 *         description: Delivery not found
 */
deliveryRouter.put(
  "/:id",
  validate(
    updateDeliverySchema
  ),
  asyncHandler(
    updateDelivery
  )
);

/**
 * @openapi
 * /deliveries/{id}:
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Delivery deleted
 *       404:
 *         description: Delivery not found
 */
deliveryRouter.delete(
  "/:id",
  asyncHandler(
    deleteDelivery
  )
);
