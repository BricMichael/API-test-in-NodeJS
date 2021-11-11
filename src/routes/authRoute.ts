import { Router } from 'express';
import * as ctrlAuth from '../controllers/authControlllers';
import { upload } from '../helpers/uploadAvatarUser';


const router = Router();


router.post('/auth/singUp', upload.single('avatar'), ctrlAuth.singUp);
router.post('/auth/singIn', ctrlAuth.singIn);



export default router;