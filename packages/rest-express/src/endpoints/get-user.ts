import * as express from 'express';

export const getUser = () => async (req: express.Request, res: express.Response) => {
  res.json((req as any).user || null);
};
