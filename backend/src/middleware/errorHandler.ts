import { Request, Response, NextFunction } from "express";

interface PostgresError extends Error {
  code?: string;
  constraint?: string;
  detail?: string;
}

const errorHandler = (
  err: PostgresError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("❌ Error:", err.message);

  // PostgreSQL unique violation
  if (err.code === "23505") {
    res.status(409).json({
      message: `Duplicate entry: ${err.detail || err.constraint || "unique constraint violated"}`,
    });
    return;
  }

  // PostgreSQL check constraint violation
  if (err.code === "23514") {
    res.status(400).json({
      message: `Validation failed: ${err.detail || err.constraint || "check constraint violated"}`,
    });
    return;
  }

  // PostgreSQL foreign key violation
  if (err.code === "23503") {
    res.status(400).json({
      message: `Referenced record not found: ${err.detail || "foreign key constraint violated"}`,
    });
    return;
  }

  // Default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
