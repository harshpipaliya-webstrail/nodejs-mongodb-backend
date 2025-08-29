"use strict";

import { Router } from "express";
import { signup, login, editUser, getAllUsers, deleteUser, resetPassword } from '../controllers/users.js';

const router = Router();

router.get("/", getAllUsers.controller);
router.post("/signup", signup.validator, signup.controller);
router.post("/signin", login.validator, login.controller);
router.put("/", editUser.validator, editUser.controller);
router.delete("/:id", deleteUser.controller);
router.post("/reset_password", resetPassword.validator, resetPassword.controller);

export default router;