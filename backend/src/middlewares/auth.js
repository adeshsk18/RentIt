import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";

const authMiddleware = (...roles) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
        message: "You don't have permission to access this page.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (roles.length > 0 && !roles.includes(req.user.type)) {
        return res
          .status(403)
          .json({ message: "User not authorized to access this route." });
      }

      next();
    } catch (err) {
      console.log(`Error occured in auth middleware: ${err}`);
      return res
        .status(403)
        .json({
          error: "Invalid token.",
          message: "You don't have permission to access this page",
        });
    }
  };
};

export default authMiddleware;
