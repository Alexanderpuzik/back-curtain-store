import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default function checkRoleMiddleware(role: string) {
  return function (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Bearer asfasnfkajsfnjk
      if (!token) return res.status(401).json({ message: 'Не авторизован' });

      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) return res.status(500);

      const decoded = jwt.verify(token, secretKey);

      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Нет доступа' });
      }
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Не авторизован' });
    }
  };
}
