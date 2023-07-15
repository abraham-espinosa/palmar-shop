import express from 'express';
const router = express.Router();
import { 
    authUser,
    signupUser,
    logoutUser,
    getOwnUser,
    updateOwnUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser } from '../controllers/userController.js';
import {protect, admin} from '../middlewar/authMiddleware.js'

    router.route('/')
        .post(signupUser)
        .get(protect, admin, getAllUsers);
    
    router.post('/login',  authUser);
    
    router.post('/logout', logoutUser);
    
    router.route('/details')
        .get(protect, getOwnUser)
        .put(protect, updateOwnUser);
    
    router.route('/:id')
        .delete(protect, admin, deleteUser)
        .get(protect, admin, getUserById)
        .put(protect, admin, updateUser)
    
    export default router;