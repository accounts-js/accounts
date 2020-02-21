export const sendError = (res: any, err: any) =>
  res.status(400).json({
    message: err.message,
    code: err.code,
  });
