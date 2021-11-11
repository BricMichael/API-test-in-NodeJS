import { Request, Response } from 'express';
import { IUserMethods, User } from '../Models/User';
import jwt from 'jsonwebtoken';
import { checkRol } from '../helpers/checkRol';
import { IReturn, validateEmailAndPassword, verifySingUp } from '../middlewares/verifySingUp';



export const singUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;
        const nameFile = req.file?.filename || '';

        const { error, respRole } = await checkRol(role, nameFile);
        if (error) return res.status(400).json({ error: respRole });

        const checkUser: IReturn | undefined = await verifySingUp(username, email, password, nameFile);
        if (checkUser?.error) return res.status(400).json({ error: checkUser.msg });

        const saveUser: IUserMethods = new User(req.body);

        saveUser.avatar = req.file?.path || '';
        saveUser.role = respRole;
        saveUser.password = await saveUser.encryptPassword(password);
        await saveUser.save();

        const token: string = jwt.sign({ id: saveUser._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.
        res.header('auth-token', token).json({ msg: 'Successful registration' });
    } catch (err) {
        console.log('singUp error', err);
    }
}



export const singIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { error, msg } = validateEmailAndPassword(email, password);
        if (error) return res.status(400).json(msg);

        const userFound = await User.findOne({ email }).populate('posts', { userId: 0 });
        if (!userFound) return res.status(404).json({ erorr: 'User not found' });

        const matchPassword: boolean = await userFound.comparePassword(password, userFound.password);
        if (!matchPassword) return res.status(404).json({ error: 'Password does not match' });

        const token: string = jwt.sign({ id: userFound._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.)

        res.header('auth-token', token).json({ // do not send password.
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
