"use strict";

import { celebrate, Joi as BaseJoi } from "celebrate";
import Joi from 'joi';
import User from "../models/users.js";
import httpStatus from 'http-status';
import APIResponse from "../helpers/APIResponse.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.helper.js";
import { getJWTToken } from "../utils/jwt.helper.js";
import { UserRole } from "../helpers/Constant.js";

export const login = {
    validator: celebrate({
        body: {
            email: Joi.string().trim().required().error(new Error('Please enter Email')),
            password: Joi.string().required().error(new Error('Please enter password'))
        }
    }),
    controller: async (req, res) => {
        try {
            const newEmail = req.body.email.toLowerCase()
            const user = await User.getByEmail(newEmail)
            if (user) {
                const match = await comparePassword(req.body.password, user.password)
                if (match) {
                    const token = getJWTToken({
                        id: user.id,
                        email: req.body.email
                    });
                    let newUser;
                    newUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token: token
                    };

                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse(newUser, "Login Successful", httpStatus.OK)
                        );
                }
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .json(
                        new APIResponse(
                            null,
                            "Wrong Password",
                            httpStatus.UNAUTHORIZED,
                        )
                    );
            }
            return res.status(httpStatus.UNAUTHORIZED).json(new APIResponse({}, 'Wrong Email', httpStatus.UNAUTHORIZED));

        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Something went wrong" }, httpStatus.BAD_REQUEST);
        }
    }
}

export const signup = {
    validator: celebrate({
        body: {
            name: Joi.string().error(new Error('Please enter valid name')),
            password: Joi.string().error(new Error('Please enter valid password')),
            role: Joi.string().valid(...Object.values(UserRole)).error(new Error('Please enter role')),
            email: Joi.string().trim().email().error(new Error('Please enter valid Email'))
        }
    }),
    controller: async (req, res) => {
        let body = req.body;
        const newPassword = await hashPassword(req.body.password, 10);
        const newUser =
        {
            name: body.name,
            email: body.email.toLowerCase(),
            role: body.role,
            password: newPassword,
        }
        const model = new User(newUser);
        try {
            const alreadyExist = await User.getByEmail(body.email)
            if (!alreadyExist) {
                let saveResponse = await model.save();
                saveResponse = JSON.parse(JSON.stringify(saveResponse))
                delete saveResponse.password;
                return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'User created successfully.', httpStatus.OK));

            } else if (alreadyExist.email === req.body.email) {
                res.status(httpStatus.OK)
                    .send({ message: "email already exist" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Adding User', httpStatus.INTERNAL_SERVER_ERROR, e));
            }

        } catch (e) {
            if (e.code === 11000) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: "user already exist" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Adding User', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }
    }
}

export const editUser = {
    validator: celebrate({
        body: {
            id: Joi.string().error(new Error('Please enter user Id')),
            name: Joi.string().error(new Error('Please enter valid name')),
            role: Joi.string().valid(...Object.values(UserRole)).error(new Error('Please enter role')),
            email: Joi.string().trim().email().error(new Error('Please enter valid Email'))
        }
    }),
    controller: async (req, res) => {
        try {
            let newUser = {
                id: req.body.id,
                name: req.body.name,
                role: req.body.role,
                email: req.body.email
            }
            const alreadyExist = await User.matchEmail(req.body.email)
            if (alreadyExist.length >= 1) {
                if (alreadyExist[0]._id.toString() !== req.body.id) {
                    return res.status(httpStatus.BAD_REQUEST).json(new APIResponse({}, 'email is already exist', httpStatus.OK));
                }
            }
            const user = await User.getUserById(req.body.id)
            if (user) {
                let updatedUser = await User.updateUser(newUser)
                updatedUser = JSON.parse(JSON.stringify(updatedUser))
                delete updatedUser.password
                return res.status(httpStatus.OK).json(new APIResponse(updatedUser, 'User updated successfully.', httpStatus.OK));
            }
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Something went wrong" });
        }
    }
}

export const deleteUser = {
    controller: async (req, res) => {
        try {
            const user = await User.deleteUser(req.params.id)

            if (user) {
                return res.status(httpStatus.OK).json(new APIResponse(null, 'User deleted successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });

        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Something went wrong" });
        }
    }
}

export const getAllUsers = {
    controller: async (req, res) => {
        try {
            const users = await User.getAll()
            if (users) {
                let allUsers = users.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }))
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(allUsers, "Users found successfully", httpStatus.OK)
                    );
            }
        } catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Something went wrong" }, httpStatus.BAD_REQUEST);
        }
    }
}

export const resetPassword = {
    validator: celebrate({
        body: {
            currentPassword: Joi.string().required().error(new Error('Please enter current password')),
            newPassword: Joi.string().required().error(new Error('Please enter new password')),
        }
    }),
    controller: async (req, res) => {
        try {
            const user = await User.getById(req.auth.id)
            if (user) {
                const match = await comparePassword(req.body.currentPassword, user.password)
                if (match) {
                    const newPassword = await hashPassword(req.body.newPassword, 10);
                    await User.resetPassword(user.id, newPassword)
                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse({}, "Password Changed", httpStatus.OK)
                        );
                }
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse({}, "Wrong Current Password", httpStatus.BAD_REQUEST)
                    );
            }
        } catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Something went wrong" }, httpStatus.BAD_REQUEST);
        }
    }
}