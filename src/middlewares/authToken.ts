import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../Models/User';

interface IDecoded {
    id: string
    iat: number
    exp: number
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string | undefined = req.header('x-access-token');

        if (!token) return res.status(403).json({ message: 'Access denied' });

        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'secretKey') as IDecoded;

        const userFound = await User.findById(decoded.id, { password: 0 });
        if (!userFound) res.status(404).json({ message: 'No user found' });


        if (userFound) req.role = userFound.role;
        next();
    } catch (error: any) {
        res.status(404).json({ error: 'Malformed or invalid token, access denied.' });
        console.log('Error: verifyToken =>', error.message);
    }
}