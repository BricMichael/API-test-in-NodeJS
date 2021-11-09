import { Router } from 'express';
const router = Router();

import * as ctrlPost from '../controllers/postControllers';
import { verifyToken } from '../middlewares/authToken';


router.post('/post', verifyToken, ctrlPost.savedPost);
router.get('/post', ctrlPost.getPosts);
router.get('/post/:id', ctrlPost.getPostById);
router.put('/post/:id', ctrlPost.updatePost);
router.delete('/post/:id', ctrlPost.deletePost);



export default router;