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
exports.getUsersByRole = exports.deleteUser = exports.subscribeToRole = void 0;
const checkRol_1 = require("../helpers/checkRol");
const Post_1 = require("../Models/Post");
const User_1 = require("../Models/User");
const postControllers_1 = require("./postControllers");
const subscribeToRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        if (!(0, postControllers_1.checkId)(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        const { error, respRole } = yield (0, checkRol_1.checkRol)((_a = req.body) === null || _a === void 0 ? void 0 : _a.role);
        if (error)
            return res.status(400).json({ error: respRole });
        yield User_1.User.findByIdAndUpdate(id, { role: respRole });
        res.json({ message: 'Successfully assigned role' });
    }
    catch (err) {
        console.log('error subscribeToRole:', err.message);
    }
});
exports.subscribeToRole = subscribeToRole;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(0, postControllers_1.checkId)(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        yield Promise.all([
            User_1.User.findByIdAndDelete(id),
            Post_1.Post.deleteMany({ userId: id || req.body.id }) //typescript gave me problems if I only put req.params.id :/
        ]);
        res.json({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.log('error deleteUser:', err.message);
    }
});
exports.deleteUser = deleteUser;
const getUsersByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { role } = req.body;
        const roles = ['user', 'model'];
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].includes((_b = role[0]) === null || _b === void 0 ? void 0 : _b.toLowerCase())) {
                // if the first letter matches the search is good, the following letters do not affect.
                const usernames = yield User_1.User.find({ role: roles[i] });
                return res.json(usernames);
            }
        }
        return res.status(400).json({ error: 'Invalid role' });
    }
    catch (err) {
        console.log('deletePost error', err.message);
    }
});
exports.getUsersByRole = getUsersByRole;
