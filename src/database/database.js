"use strict";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
mongoose.set('strictQuery', false);
mongoose.connect(`${process.env.DB_CONNECTION}`);

function connect() {
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log(`Database connected successfully`);
    });
}

connect();