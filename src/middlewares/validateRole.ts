import { Request, Response, NextFunction } from 'express';


export const validateRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const rolUser: string = req.role;
        if (rolUser !== 'model') return res.status(403).json({ error: 'Unauthorized role' });

        next();
    } catch (error: any) {
        console.log('Error: validateRole', error.message);
    }
}