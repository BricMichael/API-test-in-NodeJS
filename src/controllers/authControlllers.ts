import { Request, Response } from 'express';
import { IUserMethods, User } from '../Models/User';
import jwt from 'jsonwebtoken';
import { checkRol } from '../helpers/checkRol';


export const singUp = async (req: Request, res: Response) => {
    try {
        const { username, firstName, lastName, email, password, role } = req.body;

        if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

        const { error, respRole } = checkRol(role);
        if (error) return res.status(400).json({ error: respRole });

        const saveUser: IUserMethods = new User({
            username, firstName, lastName, email,
            avatar: req.file?.path,
            role: respRole,
            password
        });
        saveUser.password = await saveUser.encryptPassword(password);
        await saveUser.save();

        const token = jwt.sign({ id: saveUser._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.

        res.json({ msg: 'Registro exitoso', token })
    } catch (err) {
        console.log('singUp error', err);
    }
}



export const singIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email }).populate('posts', { userId: 0 });


        if (!userFound) return res.status(404).json({ erorr: 'User not found', token: null });

        const matchPassword: boolean = await userFound.comparePassword(password, userFound.password);

        if (!matchPassword || password.length < 8) return res.status(404).json({ error: 'Invalid Password', token: null });

        const token = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.)

        res.json({ // do not send password.
            token,
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            firstname: userFound.firstName,
            lastname: userFound.lastName,
            avatar: userFound.avatar,
            role: userFound.role,
            posts: userFound.posts,
        });

    } catch (err) {
        console.log('singIn error', err);
    }
}




export const profile = (req: Request, res: Response) => {
    try {
        res.send('profile')
    } catch (err) {
        console.log('profile error', err);
    }
}