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
exports.latestPosts = exports.deletePost = exports.updatePost = exports.getPostByUser = exports.getPosts = exports.savedPost = exports.checkId = void 0;
const mongoose_1 = require("mongoose");
const Post_1 = require("../Models/Post");
const User_1 = require("../Models/User");
const checkId = (id) => (0, mongoose_1.isValidObjectId)(id);
exports.checkId = checkId;
const savedPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mediaUrl, description, userId } = req.body;
        if (!userId || !(0, exports.checkId)(userId))
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
        const { limit, page } = req.query;
        const limitQuery = limit && +limit || 10; // convert to number
        const pageQuery = page && +page || 1; // convert to number
        const options = {
            limit: limitQuery,
            page: pageQuery,
            select: 'username firstName lastName email avatar role createdAt',
            populate: 'posts'
        };
        const posts = yield User_1.User.paginate({ role: 'model' }, options);
        res.json(posts);
    }
    catch (err) {
        console.log('getPosts error', err.message);
    }
});
exports.getPosts = getPosts;
const getPostByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!(0, exports.checkId)(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        const post = yield Post_1.Post.find({ userId: id });
        res.json(post);
    }
    catch (err) {
        console.log('getPostById error', err.message);
    }
});
exports.getPostByUser = getPostByUser;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, exports.checkId)(id))
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
        if (!(0, exports.checkId)(id))
            return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        yield Post_1.Post.findByIdAndDelete(id);
        res.status(202).json({ message: 'Post removed successfully' });
    }
    catch (err) {
        console.log('deletePost error', err.message);
    }
});
exports.deletePost = deletePost;
const latestPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submitPosts = yield Post_1.Post.find().sort({ createdAt: 1 });
        res.json(submitPosts);
    }
    catch (err) {
        console.log('deletePost error', err.message);
    }
});
exports.latestPosts = latestPosts;
