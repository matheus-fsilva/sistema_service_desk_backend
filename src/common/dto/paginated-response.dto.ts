import type { PaginationResponseDTO } from "./pagination-response.dto";

export interface PaginatedResponseDTO<T> {
  data: T[];
  pagination: PaginationResponseDTO;
}
