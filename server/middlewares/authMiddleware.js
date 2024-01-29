import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Unauthorized, no token");
      return;
    }
    if (req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        throw new Error("No token");
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT);
      const userId = decoded.userid;

      req.params.userId = userId;
      next();
    }
  } catch (error) {
    next(error);
  }
};
