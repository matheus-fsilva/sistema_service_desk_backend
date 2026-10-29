import type { Response } from "express";
import type { PaginationResponseDTO } from "../dto/pagination-response.dto";

export default function sendPaginatedListResponse<T>(
  res: Response,
  data: T[],
  pagination: PaginationResponseDTO,
  message = "Registros listados com sucesso.",
): void {
  res.status(200).json({
    status: "success",
    message,
    data,
    pagination,
  });
}
