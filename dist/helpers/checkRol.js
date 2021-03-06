"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRol = void 0;
const errorLogoutDeleteAvatar_1 = require("./errorLogoutDeleteAvatar");
const roles = ['user', 'model'];
const checkRol = (role, nameFile = '') => __awaiter(void 0, void 0, void 0, function* () {
    if (!role)
        return { error: false, respRole: 'user' }; // if a role is not submitted, it will have a default user.
    const validate = role.toLocaleLowerCase();
    if (!roles.includes(validate)) {
        nameFile && (yield (0, errorLogoutDeleteAvatar_1.deleteProfileImage)(nameFile)); //if an error occurs during registration, delete the profile picture.
        return { error: true, respRole: 'Roles not allowed' };
    }
    return { error: false, respRole: validate };
});
exports.checkRol = checkRol;
