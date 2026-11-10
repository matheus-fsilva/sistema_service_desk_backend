import "dotenv/config";
import "reflect-metadata";

import app from "./app";
import database from "./config/database.config";

const PORT = Number(process.env.PORT ?? 3000);

async function startServer(): Promise<void> {
  try {
    await database.initialize();

    console.log("Conexão com MySQL estabelecida!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar a aplicação:", error);

    if (database.isInitialized) {
      await database.destroy();
    }

    process.exitCode = 1;
  }
}

void startServer();
