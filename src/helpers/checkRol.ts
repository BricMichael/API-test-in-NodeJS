import { deleteProfileImage } from "./errorLogoutDeleteAvatar";

type Type = 'user' | 'model';
const roles = ['user', 'model'];

interface IReturn { error: boolean, respRole: string }

export const checkRol = async (role: Type, nameFile: string = ''): Promise<IReturn> => {
    if (!role) return { error: false, respRole: 'user' }; // if a role is not submitted, it will have a default user.

    const validate: string = role.toLocaleLowerCase();

    if (!roles.includes(validate)) {
        nameFile && await deleteProfileImage(nameFile); //if an error occurs during registration, delete the profile picture.
        return { error: true, respRole: 'Roles not allowed' };
    }

    return { error: false, respRole: validate }
}