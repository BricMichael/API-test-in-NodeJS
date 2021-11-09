"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRol = void 0;
const roles = ['user', 'model'];
const checkRol = (role) => {
    if (!role)
        return { error: false, respRole: 'user' }; // if a role is not submitted, it will have a default user.
    const validate = role.toLocaleLowerCase();
    if (!roles.includes(validate))
        return { error: true, respRole: 'Roles not allowed' };
    return { error: false, respRole: validate };
};
exports.checkRol = checkRol;
