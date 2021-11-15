import { Router } from 'express';
const router = Router();

import * as ctrlPost from '../controllers/postControllers';
import { verifyToken } from '../middlewares/authToken';
import { validateRole } from '../middlewares/validateRole';


router.post('/post', [verifyToken, validateRole], ctrlPost.savedPost);
router.get('/post', ctrlPost.getPosts);
router.post('/post-users', ctrlPost.getPostByUser);
router.put('/post/:id', [verifyToken, validateRole], ctrlPost.updatePost);
router.delete('/post/:id', [verifyToken, validateRole], ctrlPost.deletePost);

export default router;