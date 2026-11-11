import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";

import { setupSwagger } from "./config/swagger.config";
import { corsOptions } from "./config/security.config";

import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app: Express = express();

// Middlewares globais

// Middlewares de segurança
app.use(helmet());
app.use(cors(corsOptions));

// Middlewares de processamento
app.use(express.json());

// Documentação
setupSwagger(app);

// Rotas da aplicação
app.use("/api", routes);

// Tratamento de erros
app.use(errorHandler);

export default app;
