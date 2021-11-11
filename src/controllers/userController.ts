import { Request, Response } from 'express';
import { Schema } from 'mongoose';
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

export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const roles = ['user', 'model'];

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].includes(role[0]?.toLowerCase())) {
                // if the first letter matches the search is good, the following letters do not affect.
                const usernames = await User.find({ role: roles[i] });
                return res.json(usernames);
            }
        }

        return res.status(400).json({ error: 'Invalid role' });
    } catch (err: any) {
        console.log('deletePost error', err.message);
    }
}

