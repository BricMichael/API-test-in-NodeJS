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
exports.deleteProfileImage = void 0;
const fs = require('fs').promises;
const path_1 = __importDefault(require("path"));
//if an error occurs during registration, delete the profile picture.
const deleteProfileImage = (nameProfileImage) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs.unlink(path_1.default.join(__dirname, `../Avatars/${nameProfileImage}`));
});
exports.deleteProfileImage = deleteProfileImage;
