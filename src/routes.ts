import { Router } from "express";
import localRoutes from "./modules/locals/local.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";

const routes = Router();

routes.use("/locals", localRoutes);

routes.use("/equipment", equipmentRoutes);

routes.use("/users", userRoutes);

routes.use("/auth", authRoutes);

export default routes;
