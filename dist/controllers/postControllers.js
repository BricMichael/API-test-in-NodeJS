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
exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.savedPost = void 0;
const mongoose_1 = require("mongoose");
const Post_1 = require("../Models/Post");
const User_1 = require("../Models/User");
const checkId = (id) => (0, mongoose_1.isValidObjectId)(id);
const savedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mediaUrl, description, userId } = req.body;
        if (!userId || !checkId(userId))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        if (!description)
            return res.status(400).json({ message: 'Error: You must enter a description' });
        if (!mediaUrl)
            return res.status(400).json({ message: 'Error: mediaUrl is required.' });
        const protocol = mediaUrl.slice(0, 5) === 'https';
        const createPost = new Post_1.Post({ description, userId, mediaUrl, protocol: protocol ? 'https' : 'http' });
        yield createPost.save();
        const findUser = yield User_1.User.findById(userId); // bidirectional data post
        if (findUser) { // bidirectional data post
            findUser.posts = [...findUser.posts, createPost._id];
            yield findUser.save();
        }
        res.json(createPost);
    }
    catch (err) {
        console.log('savedPost error', err.message);
    }
});
exports.savedPost = savedPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.Post.find();
        res.json(posts);
    }
    catch (err) {
        console.log('getPosts error', err.message);
    }
});
exports.getPosts = getPosts;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!checkId(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        const post = yield Post_1.Post.findById(id);
        res.json(post);
    }
    catch (err) {
        console.log('getPostById error', err.message);
    }
});
exports.getPostById = getPostById;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!checkId(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        if (!req.body.description)
            return res.status(400).json({ message: 'Error: You must enter a description' });
        const updatedPost = yield Post_1.Post.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    }
    catch (err) {
        console.log('getPostById error', err.message);
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!checkId(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        yield Post_1.Post.findByIdAndDelete(id);
        res.status(202).json({ message: 'Post removed successfully' });
    }
    catch (err) {
        console.log('deletePost error', err.message);
    }
});
exports.deletePost = deletePost;
