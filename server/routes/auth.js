const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.js');
const User = require('../models/user.js');
const Admin = require('../models/admin.js');
const isAuth = require('../middleware/isAuth.js');

const router = express.Router();

const passwordValidation = body('password', 'Password must be at least 5 characters long')
  .trim()
  .isLength({ min: 5 });

const confirmPasswordValidation = body('confirmPassword')
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match');
    }
    return true;
  });

// ============================
// USER AUTH
// ============================

// @route   PUT /auth/signup
// @desc    Register a new user
router.put('/signup', [
  body('name', 'Name is required').trim().notEmpty(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return Promise.reject('Email already in use');
      }
    }),
  body('userName')
    .trim()
    .notEmpty()
    .custom(async (userName) => {
      const userNameExists = await User.findOne({ userName: userName });
      if (userNameExists) {
        return Promise.reject('userName already in use');
      }
    }),
  passwordValidation,
  confirmPasswordValidation,
], authController.signup);

// @route   POST /auth/login
// @desc    Login user
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        return Promise.reject('Email not found');
      }
    }),
  passwordValidation,
], authController.login);

// @route   POST /auth/logout
// @desc    Logout user
router.post('/logout', isAuth, authController.logout);

// ============================
// ADMIN AUTH
// ============================

// @route   POST /auth/signup/admin
// @desc    Register a new admin
router.post('/signup/admin', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
    .custom(async (email) => {
      const adminExists = await Admin.findOne({ email });
      if (adminExists) {
        return Promise.reject('Admin email already in use');
      }
    }),
  passwordValidation,
], authController.signUpAdmin);

// @route   POST /auth/login/admin
// @desc    Login admin
router.post('/login/admin', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
    .custom(async (email) => {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return Promise.reject('Admin email not found');
      }
    }),
  passwordValidation,
], authController.logInAdmin);

module.exports = router;
