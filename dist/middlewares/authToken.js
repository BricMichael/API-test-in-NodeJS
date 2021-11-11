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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../Models/User");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('x-access-token');
        if (!token)
            return res.status(403).json({ message: 'Access denied' });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'secretKey');
        const userFound = yield User_1.User.findById(decoded.id, { password: 0 });
        if (!userFound)
            res.status(404).json({ message: 'No user found' });
        if (userFound)
            req.role = userFound.role;
        next();
    }
    catch (error) {
        res.status(404).json({ error: 'Malformed or invalid token, access denied.' });
        console.log('Error: verifyToken =>', error.message);
    }
});
exports.verifyToken = verifyToken;
