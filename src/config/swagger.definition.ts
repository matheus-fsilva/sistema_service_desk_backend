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

      // AUTH

      LoginRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: {
            type: "string",
            format: "email",
            maxLength: 150,
            example: "joao@exemplo.com",
            description:
              "O e-mail é convertido para letras minúsculas durante a autenticação.",
          },
          senha: {
            type: "string",
            minLength: 1,
            maxLength: 72,
            example: "Senha123!",
            description:
              "Senha do usuário. Deve possuir no máximo 72 caracteres.",
          },
        },
      },

      AuthResponse: {
        type: "object",
        required: ["user", "accessToken"],
        properties: {
          user: {
            $ref: "#/components/schemas/UserResponse",
          },
          accessToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "Token JWT utilizado para autenticar as requisições.",
          },
        },
      },

      // USERS

      UserResponse: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          nome: {
            type: "string",
            example: "João da Silva",
          },
          email: {
            type: "string",
            format: "email",
            example: "joao@exemplo.com",
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
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-11-06T12:00:00.000Z",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            example: "2026-11-06T12:00:00.000Z",
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

      // LOCALS

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

      // TICKETS

      TicketResponse: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          id_solicitante: {
            type: "integer",
            example: 2,
          },
          id_local: {
            type: "integer",
            nullable: true,
            example: 1,
          },
          id_equipamento: {
            type: "integer",
            nullable: true,
            example: 1,
          },
          id_tecnico_atribuido: {
            type: "integer",
            nullable: true,
            example: 3,
          },
          id_tecnico_resolucao: {
            type: "integer",
            nullable: true,
            example: 3,
          },
          titulo: {
            type: "string",
            example: "Computador não liga",
          },
          descricao: {
            type: "string",
            example: "O computador do laboratório não está ligando.",
          },
          tipo: {
            type: "string",
            enum: ["Hardware", "Software"],
            example: "Hardware",
          },
          status: {
            type: "string",
            enum: ["Aberto", "Em andamento", "Fechado", "Cancelado"],
            example: "Aberto",
          },
          prioridade: {
            type: "string",
            enum: ["Baixa", "Média", "Alta", "Crítica"],
            example: "Média",
          },
          nivel_atendimento: {
            type: "string",
            enum: ["N1", "N2"],
            example: "N1",
          },
          data_abertura: {
            type: "string",
            format: "date-time",
            example: "2026-11-06T12:00:00.000Z",
          },
          data_fechamento: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: null,
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

      CreateTicket: {
        type: "object",
        required: ["titulo", "descricao", "tipo", "prioridade"],
        properties: {
          titulo: {
            type: "string",
            maxLength: 150,
            example: "Computador não liga",
          },
          descricao: {
            type: "string",
            example: "O computador do laboratório não está ligando.",
          },
          tipo: {
            type: "string",
            enum: ["Hardware", "Software"],
            example: "Hardware",
          },
          prioridade: {
            type: "string",
            enum: ["Baixa", "Média", "Alta", "Crítica"],
            example: "Média",
          },
          id_local: {
            type: "integer",
            minimum: 1,
            nullable: true,
            example: 1,
          },
          id_equipamento: {
            type: "integer",
            minimum: 1,
            nullable: true,
            example: 1,
          },
          nivel_atendimento: {
            type: "string",
            enum: ["N1", "N2"],
            description:
              "Disponível somente para N1, N2 e Admin. Usuários comuns são encaminhados automaticamente ao N1.",
            example: "N1",
          },
        },
      },

      UpdateTicket: {
        type: "object",
        minProperties: 1,
        properties: {
          titulo: {
            type: "string",
            maxLength: 150,
            example: "Computador não liga após atualização",
          },
          descricao: {
            type: "string",
            example: "O problema continua após a atualização.",
          },
          tipo: {
            type: "string",
            enum: ["Hardware", "Software"],
            example: "Hardware",
          },
          prioridade: {
            type: "string",
            enum: ["Baixa", "Média", "Alta", "Crítica"],
            example: "Alta",
          },
          status: {
            type: "string",
            enum: ["Aberto", "Em andamento", "Fechado"],
            example: "Em andamento",
          },
          nivel_atendimento: {
            type: "string",
            enum: ["N1", "N2"],
            example: "N2",
          },
          id_local: {
            type: "integer",
            minimum: 1,
            nullable: true,
            example: 1,
          },
          id_equipamento: {
            type: "integer",
            minimum: 1,
            nullable: true,
            example: 1,
          },
          id_tecnico_atribuido: {
            type: "integer",
            minimum: 1,
            nullable: true,
            example: 3,
          },
        },
      },

      CancelTicket: {
        type: "object",
        required: ["justificativa"],
        properties: {
          justificativa: {
            type: "string",
            minLength: 1,
            example: "A solicitação não é mais necessária.",
          },
        },
      },

      // TICKET COMMENTS

      TicketCommentResponse: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          id_chamado: {
            type: "integer",
            example: 1,
          },
          id_usuario: {
            type: "integer",
            example: 2,
          },
          comentario: {
            type: "string",
            example: "O suporte está verificando o problema.",
          },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-11-06T12:30:00.000Z",
          },
        },
      },

      CreateTicketComment: {
        type: "object",
        required: ["comentario"],
        properties: {
          comentario: {
            type: "string",
            minLength: 1,
            example: "O problema continua acontecendo.",
          },
        },
      },

      // TICKET PAGINATION

      TicketPagination: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            example: 1,
          },
          limit: {
            type: "integer",
            example: 10,
          },
          total: {
            type: "integer",
            example: 25,
          },
          totalPages: {
            type: "integer",
            example: 3,
          },
        },
      },

      TicketListResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          message: {
            type: "string",
            example: "Chamados listados com sucesso.",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/TicketResponse",
            },
          },
          pagination: {
            $ref: "#/components/schemas/TicketPagination",
          },
        },
      },
    },
  },
};
