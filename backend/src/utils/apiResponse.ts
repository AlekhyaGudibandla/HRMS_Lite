import { Response } from "express";

/**
 * Standardised success response helper.
 */
export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): void => {
  res.status(statusCode).json(data);
};

/**
 * Standardised error response helper.
 */
export const sendError = (res: Response, message: string, statusCode = 400): void => {
  res.status(statusCode).json({ message });
};
