export const successResponse = (res, message, data = {}) => {
    return res.status(200).json({ message, ...data });
  };
  
  export const errorResponse = (res, error, statusCode = 500) => {
    return res.status(statusCode).json({ error });
  };
  