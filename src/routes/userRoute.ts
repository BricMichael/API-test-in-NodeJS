import { Router } from 'express';
import * as ctrlUser from '../controllers/userController';
import { verifyToken } from '../middlewares/authToken';
import { validateRole } from '../middlewares/validateRole';

const router = Router();


router.get('/user/emails', verifyToken, ctrlUser.getModelsEmail);
router.put('/user/subscribeToRole/:id', verifyToken, ctrlUser.subscribeToRole);
router.post('/user/username', verifyToken, ctrlUser.getUsersByUsername);
router.delete('/user/delete/:id', [verifyToken, validateRole], ctrlUser.deleteUser);

export default router;