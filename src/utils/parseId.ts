import AppError from "../errors/AppError";

const parseId = (value: unknown): number => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError("ID inválido.", 400);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("ID inválido.", 400);
  }

  return id;
};

export default parseId;
