export const swaggerDefinition = {
  openapi: "3.0.3",

  info: {
    title: "Sistema de Service Desk",
    version: "1.0.0",
    description:
      "API REST do Sistema de Service Desk da FATEC Guarulhos. " +
      "Permite o gerenciamento de usuários, locais, equipamentos e chamados de suporte técnico.",
    contact: {
      name: "Suporte da API",
    },
  },

  servers: [
    {
      url: "/api",
      description: "Servidor principal da API",
    },
  ],

  tags: [],

  security: [
    {
      BearerAuth: [],
    },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Informe o Access Token obtido no endpoint /auth/login.",
      },
    },

    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          statusCode: {
            type: "integer",
            example: 400,
          },
          message: {
            type: "string",
            example: "Os dados enviados são inválidos.",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  example: "senha",
                },
                message: {
                  type: "string",
                  example: "A senha deve possuir no mínimo 8 caracteres.",
                },
              },
            },
          },
        },
      },

      CreateUser: {
        type: "object",
        required: ["nome", "email", "senha", "tipo"],
        properties: {
          nome: {
            type: "string",
            maxLength: 100,
            example: "João da Silva",
          },
          email: {
            type: "string",
            format: "email",
            maxLength: 150,
            example: "joao@exemplo.com",
          },
          senha: {
            type: "string",
            minLength: 8,
            example: "Senha123!",
            description:
              "Mínimo de 8 caracteres, com letra maiúscula, minúscula, número e caractere especial. Limite de 72 bytes.",
          },
          tipo: {
            type: "string",
            enum: ["Usuario", "N1", "N2", "Admin"],
            example: "Usuario",
          },
        },
      },

      UpdateUser: {
        type: "object",
        minProperties: 1,
        properties: {
          nome: {
            type: "string",
            maxLength: 100,
            example: "João da Silva atualizado",
          },
          email: {
            type: "string",
            format: "email",
            maxLength: 150,
            example: "joao.atualizado@exemplo.com",
          },
          senha: {
            type: "string",
            minLength: 8,
            example: "NovaSenha123!",
            description:
              "Quando informada, deve atender aos critérios de segurança da senha. Limite de 72 bytes.",
          },
          tipo: {
            type: "string",
            enum: ["Usuario", "N1", "N2", "Admin"],
            example: "Usuario",
          },
          ativo: {
            type: "boolean",
            example: true,
          },
        },
      },

      LocalResponse: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          nome: {
            type: "string",
            example: "Laboratório de Informática 1",
          },
          descricao: {
            type: "string",
            nullable: true,
            example: "Laboratório destinado às aulas práticas.",
          },
          ativo: {
            type: "boolean",
            example: true,
          },
          created_at: {
            type: "string",
            format: "date-time",
          },
          updated_at: {
            type: "string",
            format: "date-time",
          },
        },
      },
    },
  },
};
