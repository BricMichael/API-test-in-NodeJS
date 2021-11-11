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
exports.verifySingUp = exports.validateEmailAndPassword = void 0;
const errorLogoutDeleteAvatar_1 = require("../helpers/errorLogoutDeleteAvatar");
const regex_1 = require("../helpers/regex");
const User_1 = require("../Models/User");
const validateEmailAndPassword = (email, password) => {
    if (!regex_1.emailRegex.test(email))
        return { error: true, msg: 'Invalid email address' };
    if (password.length < 8)
        return { error: true, msg: 'Password must be at least 8 characters' };
    return { error: false, msg: '' };
};
exports.validateEmailAndPassword = validateEmailAndPassword;
const verifySingUp = (username, email, password, nameFile) => __awaiter(void 0, void 0, void 0, function* () {
    try { //if an error occurs during registration, delete the profile picture.
        const { error, msg } = (0, exports.validateEmailAndPassword)(email, password);
        if (error) {
            yield (0, errorLogoutDeleteAvatar_1.deleteProfileImage)(nameFile);
            return { error: true, msg };
        }
        const checkUsername = yield User_1.User.findOne({ username });
        if (checkUsername) {
            yield (0, errorLogoutDeleteAvatar_1.deleteProfileImage)(nameFile);
            return { error: true, msg: 'The username already exists' };
        }
        const checkEmail = yield User_1.User.findOne({ email });
        if (checkEmail) {
            yield (0, errorLogoutDeleteAvatar_1.deleteProfileImage)(nameFile);
            return { error: true, msg: 'The email already exists' };
        }
        return { error: false, msg: '' };
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.verifySingUp = verifySingUp;
