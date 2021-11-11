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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singIn = exports.singUp = void 0;
const User_1 = require("../Models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkRol_1 = require("../helpers/checkRol");
const verifySingUp_1 = require("../middlewares/verifySingUp");
const singUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { username, email, password, role } = req.body;
        const nameFile = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '';
        const { error, respRole } = yield (0, checkRol_1.checkRol)(role, nameFile);
        if (error)
            return res.status(400).json({ error: respRole });
        const checkUser = yield (0, verifySingUp_1.verifySingUp)(username, email, password, nameFile);
        if (checkUser === null || checkUser === void 0 ? void 0 : checkUser.error)
            return res.status(400).json({ error: checkUser.msg });
        const saveUser = new User_1.User(req.body);
        saveUser.avatar = ((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || '';
        saveUser.role = respRole;
        saveUser.password = yield saveUser.encryptPassword(password);
        yield saveUser.save();
        const token = jsonwebtoken_1.default.sign({ id: saveUser._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.
        res.header('auth-token', token).json({ msg: 'Successful registration' });
    }
    catch (err) {
        console.log('singUp error', err);
    }
});
exports.singUp = singUp;
const singIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { error, msg } = (0, verifySingUp_1.validateEmailAndPassword)(email, password);
        if (error)
            return res.status(400).json(msg);
        const userFound = yield User_1.User.findOne({ email }).populate('posts', { userId: 0 });
        if (!userFound)
            return res.status(404).json({ erorr: 'User not found' });
        const matchPassword = yield userFound.comparePassword(password, userFound.password);
        if (!matchPassword)
            return res.status(404).json({ error: 'Password does not match' });
        const token = jsonwebtoken_1.default.sign({ id: userFound._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.)
        res.header('auth-token', token).json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            firstname: userFound.firstName,
            lastname: userFound.lastName,
            avatar: userFound.avatar,
            role: userFound.role,
            posts: userFound.posts,
        });
    }
    catch (err) {
        console.log('singIn error', err);
    }
});
exports.singIn = singIn;
