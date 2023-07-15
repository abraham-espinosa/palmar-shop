import { response } from 'express';
import asyncHandler from '../middlewar/asyncHandler.js';
import User from '../models/userModel.js'; 
import createToken from '../utils/createToken.js'

// POST /api/users PUBLIC
const signupUser = asyncHandler(async (req, res) => {
    const {name, email, password } = req.body;

    const userExists = await User.findOne({email: email});

    if (userExists){
        res.status(400);
        throw new Error('Email already associated with another account');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        createToken(res, user._id);
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('Something went wrong, please try again. Invalid data')
    }
});

// GET /api/users/login PUBLIC
const authUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body;
    
    const user = await User.findOne({ email});
    
    if (user && (await user.matchPassword(password))) {
        createToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(401);
        throw new Error('Invalid fields');
    }
});

// POST /api/users/logout PRIVATE
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
       
    res.status(200).json({
        message: 'Session closed successfully'
    });
});

// GET /api/users/details PRIVATE
const getOwnUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('Something went wrong, please try again, data was not found');
    }
});

// PUT /api/users/details PRIVATE
const updateOwnUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('Was not able to update user data');
    }
});

//----------------------------------------------------------------
// ADMIN
//----------------------------------------------------------------
// GET /api/users  PRIVATE/ADMIN
const getAllUsers = asyncHandler(async (req, res) => {
    res.send('get all users');
});

// GET /api/users/:id  PRIVATE/ADMIN
const getUserById = asyncHandler(async (req, res) => {
    res.send('get user by ID');
});

// DELETE /api/users/:id  PRIVATE/ADMIN
const deleteUser = asyncHandler(async (req, res) => {
    res.send('delete user');
});

// UPDATE /api/users/:id  PRIVATE/ADMIN
const updateUser = asyncHandler(async (req, res) => {
    res.send('update user');
});

export {
    authUser,
    signupUser,
    logoutUser,
    getOwnUser,
    updateOwnUser,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
}