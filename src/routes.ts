import { Router } from "express";
import localRoutes from "./modules/locals/local.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import ticketRoutes from "./modules/tickets/ticket.routes";
import ticketCommentRoutes from "./modules/ticketComments/ticketComment.routes";

const routes = Router();

routes.use("/locals", localRoutes);

routes.use("/equipment", equipmentRoutes);

routes.use("/users", userRoutes);

routes.use("/auth", authRoutes);

routes.use("/tickets", ticketRoutes);

routes.use("/tickets", ticketCommentRoutes);

export default routes;
