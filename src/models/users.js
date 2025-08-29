import mongoose from 'mongoose';
import { UserRole } from '../helpers/Constant.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.NORMAL,
        required: true
    }
}, {
    timestamps: true
});

// Static methods
userSchema.statics.getByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.matchEmail = function(email) {
    return this.find({ email: email.toLowerCase() });
};

userSchema.statics.getUserById = function(id) {
    return this.findById(id);
};

userSchema.statics.getById = function(id) {
    return this.findById(id);
};

userSchema.statics.getAll = function() {
    return this.find({}).select('-password');
};

userSchema.statics.updateUser = function(userData) {
    return this.findByIdAndUpdate(
        userData.id,
        {
            name: userData.name,
            email: userData.email,
            role: userData.role
        },
        { new: true }
    ).select('-password');
};

userSchema.statics.deleteUser = function(id) {
    return this.findByIdAndDelete(id);
};

userSchema.statics.resetPassword = function(id, newPassword) {
    return this.findByIdAndUpdate(
        id,
        { password: newPassword },
        { new: true }
    );
};

const User = mongoose.model('User', userSchema);

export default User;