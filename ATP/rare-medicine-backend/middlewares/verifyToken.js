import jwt from "jsonwebtoken";

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const headerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;
      const token = req.cookies?.token || headerToken;

      if (!token) {
        return res.status(401).json({ message: "Please login first" });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const role = decodedToken.role?.toUpperCase();

      if (allowedRoles.length && !allowedRoles.includes(role)) {
        return res.status(403).json({ message: "You are not authorized" });
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
