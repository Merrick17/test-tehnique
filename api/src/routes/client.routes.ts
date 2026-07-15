import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  listClients,
  updateClient,
} from "../controllers/client.controller";
import {
  createClientSchema,
  updateClientSchema,
} from "../dto/client.dto";
import { validate } from "../middlewares/validate";
import { verifyAuth } from "../middlewares/verifyAuth";
import { asyncHandler } from "../utils/asyncHandler";

export const clientRouter =
  Router();

clientRouter.use(
  verifyAuth
);

/**
 * @openapi
 * /clients:
 *   get:
 *     summary: List clients
 *     tags: [Clients]
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
 *         description: Paginated list of clients
 */
clientRouter.get(
  "/",
  asyncHandler(listClients)
);

/**
 * @openapi
 * /clients/{id}:
 *   get:
 *     summary: Get a client by id
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Client with its deliveries
 *       404:
 *         description: Client not found
 */
clientRouter.get(
  "/:id",
  asyncHandler(getClientById)
);

/**
 * @openapi
 * /clients:
 *   post:
 *     summary: Create a client
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, nullable: true }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Client created
 */
clientRouter.post(
  "/",
  validate(
    createClientSchema
  ),
  asyncHandler(createClient)
);

/**
 * @openapi
 * /clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
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
 *               name: { type: string }
 *               email: { type: string, nullable: true }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Client updated
 *       404:
 *         description: Client not found
 */
clientRouter.put(
  "/:id",
  validate(
    updateClientSchema
  ),
  asyncHandler(updateClient)
);

/**
 * @openapi
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Client deleted
 *       404:
 *         description: Client not found
 */
clientRouter.delete(
  "/:id",
  asyncHandler(deleteClient)
);
