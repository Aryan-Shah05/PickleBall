import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new AppError(400, err.errors[0].message, 'VALIDATION_ERROR'));
      } else {
        next(new AppError(400, 'Invalid request data', 'VALIDATION_ERROR'));
      }
    }
  };
}; 