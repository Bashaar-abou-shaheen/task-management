const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Admin = require('../models/admin');

// Utility: Generate JWT
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '200h' });
};

// Utility: Handle validation errors
const checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};

// =======================
// USER
// =======================

exports.signup = async (req, res, next) => {
    try {
        checkValidation(req);

        const { name, email, password,userName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            userName,
            password: hashedPassword,
            role: 'user'
        });

        const savedUser = await user.save();
        const token = generateToken({ email: savedUser.email, userId: savedUser._id.toString(), role: 'user' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            userId: savedUser._id.toString(),
            role : savedUser.role
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        checkValidation(req);

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User with this email does not exist.');
            error.statusCode = 422;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Incorrect password.');
            error.statusCode = 422;
            throw error;
        }

        const token = generateToken({ email: user.email, userId: user._id.toString(), role: 'user' });

        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id.toString(),
            role : user.role
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.logout = (req, res) => {
    // Stateless logout (front-end should remove token)
    res.status(200).json({ message: 'Logged out successfully (token discarded on client)' });
};

// =======================
// ADMIN
// =======================

exports.signUpAdmin = async (req, res, next) => {
    try {
        checkValidation(req);

        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = new Admin({
            email,
            password: hashedPassword,
            role: 'admin'
        });

        const savedAdmin = await admin.save();
        const token = generateToken({ email: savedAdmin.email, adminId: savedAdmin._id.toString(), role: 'admin' });

        res.status(201).json({
            message: 'Admin account created successfully',
            token,
            adminId: savedAdmin._id.toString(),
            role : savedAdmin.role
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.logInAdmin = async (req, res, next) => {
    try {
        checkValidation(req);

        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            const error = new Error('Admin with this email does not exist.');
            error.statusCode = 422;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            const error = new Error('Incorrect password.');
            error.statusCode = 422;
            throw error;
        }

        const token = generateToken({ email: admin.email, adminId: admin._id.toString(), role: 'admin' });

        res.status(200).json({
            message: 'Admin login successful',
            token,
            adminId: admin._id.toString(),
            role : admin.role
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
