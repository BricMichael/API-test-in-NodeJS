import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '../Models/Post';
import { IUser, User } from '../Models/User';


const checkId = (id: string | number): boolean => isValidObjectId(id);


export const savedPost = async (req: Request, res: Response) => {
    try {
        const { mediaUrl, description, userId } = req.body;

        if (!userId || !checkId(userId)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        if (!description) return res.status(400).json({ message: 'Error: You must enter a description' });
        if (!mediaUrl) return res.status(400).json({ message: 'Error: mediaUrl is required.' });

        const protocol = mediaUrl.slice(0, 5) === 'https';
        const createPost = new Post({ description, userId, mediaUrl, protocol: protocol ? 'https' : 'http' });
        await createPost.save();

        const findUser: IUser | null = await User.findById(userId); // bidirectional data post

        if (findUser) { // bidirectional data post
            findUser.posts = [...findUser.posts, createPost._id];
            await findUser.save();
        }

        res.json(createPost);
    } catch (err: any) {
        console.log('savedPost error', err.message);
    }
}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();

        res.json(posts);
    } catch (err: any) {
        console.log('getPosts error', err.message);
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!checkId(id)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });

        const post = await Post.findById(id);
        res.json(post)
    } catch (err: any) {
        console.log('getPostById error', err.message);
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!checkId(id)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });
        if (!req.body.description) return res.status(400).json({ message: 'Error: You must enter a description' });

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (err: any) {
        console.log('getPostById error', err.message);
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!checkId(id)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });

        await Post.findByIdAndDelete(id);

        res.status(202).json({ message: 'Post removed successfully' });
    } catch (err: any) {
        console.log('deletePost error', err.message);
    }
}