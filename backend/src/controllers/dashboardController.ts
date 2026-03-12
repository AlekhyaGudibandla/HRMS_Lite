import { Request, Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboardService";
import { sendSuccess } from "../utils";

/**
 * Dashboard Controller — Handles stats and activities.
 */

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    const stats = await dashboardService.getStats({
      employeeId: employeeId as string,
      startDate: startDate as string,
      endDate: endDate as string,
    });
    
    sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};
