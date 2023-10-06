import jwt from 'jsonwebtoken';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';


const dbPath = path.resolve(__dirname, '../../config/db');
require(dbPath);

interface JwtPayload {
  id: string;
}

export interface RequestWithUserId extends Request {
  userId: IUser['_id'];
}

export interface CustomRequestHandler {
  (req: RequestWithUserId, res: Response, next: NextFunction): void;
}

const authenticationJWT: CustomRequestHandler = (req: RequestWithUserId, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send({ error: 'Token não informado' });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    res.status(401).send({ error: 'Token malformatado' });
    return;
  }

  jwt.verify(parts[1], process.env.JWT_KEY as string, (err, decoded) => {
    if (err || !decoded) {
      res.status(401).send({ error: 'Token inválido' });
      return;
    }

    const payload = decoded as JwtPayload;

    (req as RequestWithUserId).userId = payload.id;
    next();
  });
};

export default authenticationJWT;
