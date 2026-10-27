export interface AppErrorDetail {
  field: string;
  message: string;
}

export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: AppErrorDetail[];

  constructor(
    message: string,
    statusCode: number = 400,
    errors: AppErrorDetail[] = [],
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
