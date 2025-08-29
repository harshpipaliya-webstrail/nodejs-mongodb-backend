"use strict";

import { jwtSecret } from "../config.js";
import jwt from "express-jwt";
import users from "./users.js";

const routes = {};

routes.setup = function (app) {
    console.log("Setup Route");

    // Apply JWT middleware to all /api/ routes except signin and signup
    app.use('/api/', (req, res, next) => {
        const excludedPaths = [
            '/api/user/signin',
            '/api/user/signup'
        ];
        
        if (excludedPaths.includes(req.path)) {
            return next();
        }
        
        return jwt({ 
            algorithms: ["HS256"], 
            secret: jwtSecret,
            requestProperty: 'auth'
        })(req, res, next);
    });

    app.use('/api/user', users);
};

export default routes;