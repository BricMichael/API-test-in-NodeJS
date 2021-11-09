import { Request, Response, NextFunction } from 'express';



export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['x-access-token'];

        console.log(token)
        next();
    } catch (error: any) {
        console.log(error.message);
    }
}