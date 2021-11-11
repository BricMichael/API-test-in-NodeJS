"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrlUser = __importStar(require("../controllers/userController"));
const authToken_1 = require("../middlewares/authToken");
const validateRole_1 = require("../middlewares/validateRole");
const router = (0, express_1.Router)();
router.put('/user/subscribeToRole/:id', authToken_1.verifyToken, ctrlUser.subscribeToRole);
router.post('/user/roles', authToken_1.verifyToken, ctrlUser.getUsersByRole);
router.delete('/user/delete/:id', [authToken_1.verifyToken, validateRole_1.validateRole], ctrlUser.deleteUser);
exports.default = router;
