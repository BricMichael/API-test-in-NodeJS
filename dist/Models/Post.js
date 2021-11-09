"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    mediaUrl: { required: true, type: String },
    description: { required: true, type: String },
    protocol: { required: true, type: String },
    userId: {
        required: true,
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true, versionKey: false });
exports.Post = (0, mongoose_1.model)('Post', postSchema);
