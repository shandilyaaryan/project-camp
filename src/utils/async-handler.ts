import type { NextFunction, Request, Response } from "express";

type handler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | any;

const asynchandler = (requestHandler: handler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error),
    );
  };
};

export default asynchandler;