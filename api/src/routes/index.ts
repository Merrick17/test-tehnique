import { Router } from "express";
import { authRouter } from "./auth.routes";
import { clientRouter } from "./client.routes";
import { deliveryRouter } from "./delivery.routes";
import { routingRouter } from "./routing.routes";
import { verticalRouter } from "./vertical.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/clients", clientRouter);
apiRouter.use("/deliveries", deliveryRouter);
apiRouter.use("/verticals", verticalRouter);
apiRouter.use("/routing", routingRouter);
