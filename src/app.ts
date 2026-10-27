import express, { type Express } from "express";
import routes from "./routes";
import { setupSwagger } from "./config/swagger.config";
import errorHandler from "./middlewares/errorHandler";

const app: Express = express();

// Middlewares globais
app.use(express.json());

// Documentação
setupSwagger(app);

// Rotas da aplicação
app.use("/api", routes);

// Tratamento de erros
app.use(errorHandler);

export default app;
