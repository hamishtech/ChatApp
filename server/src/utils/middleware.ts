import express from 'express';

const logger = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  console.log(req);
  next();
};

export default { logger };
