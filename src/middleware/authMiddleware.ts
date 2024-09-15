import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from './interfaces';

export function authMiddleware(
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
    if (!secretKey) return res.status(500).json({ message: 'Server error' });

    const decoded = jwt.verify(token, secretKey) as UserPayload;

    //FIXME - do not use @ts-ignore
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Не авторизован' });
  }
}
