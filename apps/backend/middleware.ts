import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function authMiddleware(
  req: any,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];
 console.log("AUTH MIDDLEWARE HIT");
  console.log("HEADERS:", req.headers.authorization);
  if (!header) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(header, JWT_SECRET);
    req.userid = (decoded as any).id; 
    next();
  } catch (e) {
    res.status(403).json({ message: "Invalid token" });
  }
}
