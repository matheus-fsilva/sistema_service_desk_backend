import { Router } from "express";
import localRoutes from "./modules/locals/local.routes";

const routes = Router();

routes.use("/locals", localRoutes);

export default routes;
