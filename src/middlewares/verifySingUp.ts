import { deleteProfileImage } from '../helpers/errorLogoutDeleteAvatar';
import { emailRegex } from '../helpers/regex';
import { User } from '../Models/User';


export interface IReturn { error: boolean, msg: string }

export const validateEmailAndPassword = (email: string, password: string): IReturn => {
    if (!emailRegex.test(email)) return { error: true, msg: 'Invalid email address' };
    if (password.length < 8) return { error: true, msg: 'Password must be at least 8 characters' };

    return { error: false, msg: '' };
}

export const verifySingUp = async (username: string, email: string, password: string, nameFile: string): Promise<IReturn | undefined> => {
    try { //if an error occurs during registration, delete the profile picture.
        const { error, msg } = validateEmailAndPassword(email, password);
        if (error) {
            await deleteProfileImage(nameFile);
            return { error: true, msg }
        }

        const checkUsername = await User.findOne({ username });
        if (checkUsername) {
            await deleteProfileImage(nameFile);
            return { error: true, msg: 'The username already exists' }
        }

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            await deleteProfileImage(nameFile);
            return { error: true, msg: 'The email already exists' };
        }

        return { error: false, msg: '' };
    } catch (error: any) {
        console.log(error.message);
    }
}