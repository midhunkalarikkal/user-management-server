import { pinoHttp } from "pino-http";
import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";

import { logger } from "../utils/logger.js";

export const requestLogger = pinoHttp({
  logger,

  genReqId: () => randomUUID(),

  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  serializers: {
    req: (req: Request & { id?: string }) => ({
      id: req.id,
      method: req.method,
      url: req.url?.split("?")[0],
    }),

    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
  },

  customSuccessMessage: (req, res) => `${req.method} ${req.url?.split("?")[0]} ${res.statusCode}`,

  customErrorMessage: (req, res) => `${req.method} ${req.url?.split("?")[0]} ${res.statusCode}`,
});
