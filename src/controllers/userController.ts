import { Request, Response } from 'express';
import { checkRol } from '../helpers/checkRol';
import { Post } from '../Models/Post';
import { User } from '../Models/User';
import { checkId } from './postControllers';


export const subscribeToRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!checkId(id)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });

        const { error, respRole } = await checkRol(req.body?.role);
        if (error) return res.status(400).json({ error: respRole });

        await User.findByIdAndUpdate(id, { role: respRole });

        res.json({ message: 'Successfully assigned role' });
    } catch (err: any) {
        console.log('error subscribeToRole:', err.message);
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!checkId(id)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });

        await Promise.all([
            User.findByIdAndDelete(id),
            Post.deleteMany({ userId: id || req.body.id }) //typescript gave me problems if I only put req.params.id :/
        ]);

        res.json({ message: 'User deleted successfully' });
    } catch (err: any) {
        console.log('error deleteUser:', err.message);
    }
}

export const getUsersByUsername = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;

        const hideFields = { email: 0, password: 0, updatedAt: 0 };
        const userFound = await User.find({ username: { $regex: username.trim(), $options: 'i' } }, hideFields);

        if (!userFound.length) return res.json({ message: 'No results found' });

        return res.json(userFound);
    } catch (err: any) {
        console.log('getUsersByUsername', err.message);
    }
}


export const getModelsEmail = async (req: Request, res: Response) => {
    try {
        const allUsers = await User.find();
        const modelsEmail = allUsers.filter(user => user.role === 'model').map(user => ({ email: user.email }));

        res.json(modelsEmail);
    } catch (err: any) {
        console.log('getModelsEmail', err.message);
    }
}
