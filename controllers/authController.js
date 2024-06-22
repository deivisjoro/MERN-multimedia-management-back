import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { validationResult } from 'express-validator';
import upload from '../config/multer.js';

export const registerUser = async (req, res) => {
  if (req.file) {
    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ statusCode: 500, message: 'FILE_UPLOAD_ERROR', data: null });
      }
      await processCreateUser(req, res);
    });
  } else {
    await processCreateUser(req, res);
  }
};

const processCreateUser = async (req, res) => {
  const { username, email, password, userType, language } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ statusCode: 400, message: 'EMAIL_IN_USE', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    user = new User({
      username,
      email,
      password: hashedPassword,
      userType,
      language,
      profileImage: req.file ? req.file.path : '',
      verificationToken,
      isVerified: false
    });

    await user.save();

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking the following link: ${verificationUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ statusCode: 201, message: 'USER_CREATED', data: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ statusCode: 400, message: 'INVALID_TOKEN', data: null });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ statusCode: 200, message: 'EMAIL_VERIFIED_SUCCESSFULLY', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ statusCode: 400, message: 'EMAIL_NOT_FOUND', data: null });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ statusCode: 400, message: 'INVALID_PASSWORD', data: null });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.userType,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        statusCode: 200,
        message: 'LOGIN_SUCCESSFUL',
        data: {
          token,
          userId: user.id,
          userType: user.userType,
          language: user.language
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};
