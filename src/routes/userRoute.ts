import { Router } from 'express';
import * as ctrlUser from '../controllers/userController';
import { verifyToken } from '../middlewares/authToken';
import { validateRole } from '../middlewares/validateRole';

const router = Router();

router.put('/user/subscribeToRole/:id', verifyToken, ctrlUser.subscribeToRole);
router.post('/user/roles', verifyToken, ctrlUser.getUsersByRole);
router.delete('/user/delete/:id', [verifyToken, validateRole], ctrlUser.deleteUser);

export default router;