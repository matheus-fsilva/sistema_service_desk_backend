import { Router } from "express";
import localRoutes from "./modules/locals/local.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";

const routes = Router();

routes.use("/locals", localRoutes);

routes.use("/equipments", equipmentRoutes);

export default routes;
