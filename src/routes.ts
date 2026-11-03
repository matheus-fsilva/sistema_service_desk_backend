import { Router } from "express";
import localRoutes from "./modules/locals/local.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";
import userRoutes from "./modules/users/users.routes";

const routes = Router();

routes.use("/locals", localRoutes);

routes.use("/equipment", equipmentRoutes);

routes.use("/users", userRoutes);

export default routes;
