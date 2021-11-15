import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '../Models/Post';
import { IUser, User } from '../Models/User';


export const checkId = (id: string | number): boolean => isValidObjectId(id);


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
        const { limit, page } = req.query;
        const limitQuery = limit && +limit || 10; // convert to number
        const pageQuery = page && +page || 1; // convert to number

        const options = {
            limit: limitQuery,
            page: pageQuery,
            select: 'username firstName lastName email avatar role createdAt',
            populate: 'posts'
        }

        const posts = await User.paginate({ role: 'model' }, options);

        res.json(posts);
    } catch (err: any) {
        console.log('getPosts error', err.message);
    }
}

export const getPostByUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        if (!checkId(id)) return res.status(400).json({ message: 'Error: Invalid Id, operation rejected' });

        const post = await Post.find({ userId: id });
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

