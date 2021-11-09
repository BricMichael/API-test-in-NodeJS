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
exports.profile = exports.singIn = exports.singUp = void 0;
const User_1 = require("../Models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkRol_1 = require("../helpers/checkRol");
const singUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, firstName, lastName, email, password, role } = req.body;
        if (password.length < 8)
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        const { error, respRole } = (0, checkRol_1.checkRol)(role);
        if (error)
            return res.status(400).json({ error: respRole });
        const saveUser = new User_1.User({
            username, firstName, lastName, email,
            avatar: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
            role: respRole,
            password
        });
        saveUser.password = yield saveUser.encryptPassword(password);
        yield saveUser.save();
        const token = jsonwebtoken_1.default.sign({ id: saveUser._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.
        res.json({ msg: 'Registro exitoso', token });
    }
    catch (err) {
        console.log('singUp error', err);
    }
});
exports.singUp = singUp;
const singIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userFound = yield User_1.User.findOne({ email }).populate('posts', { userId: 0 });
        if (!userFound)
            return res.status(404).json({ erorr: 'User not found', token: null });
        const matchPassword = yield userFound.comparePassword(password, userFound.password);
        if (!matchPassword || password.length < 8)
            return res.status(404).json({ error: 'Invalid Password', token: null });
        const token = jsonwebtoken_1.default.sign({ id: userFound._id }, process.env.SECRET_KEY || 'secretKey', { expiresIn: 18000 }); //expires in 5. hours.)
        res.json({
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
    }
    catch (err) {
        console.log('singIn error', err);
    }
});
exports.singIn = singIn;
const profile = (req, res) => {
    try {
        res.send('profile');
    }
    catch (err) {
        console.log('profile error', err);
    }
};
exports.profile = profile;
