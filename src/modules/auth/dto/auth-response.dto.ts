import type { UserResponseDTO } from "../../users/dto/user-response.dto";

export interface AuthResponseDTO {
  user: UserResponseDTO;
  accessToken: string;
}
