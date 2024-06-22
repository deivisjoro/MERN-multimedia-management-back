import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Content from '../models/Content.js';
import { validationResult } from 'express-validator';
import upload from '../config/multer.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ statusCode: 200, message: 'USERS_FETCHED', data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'USER_NOT_FOUND', data: null });
    }
    res.json({ statusCode: 200, message: 'USER_FETCHED', data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const createUser = async (req, res) => {
  if (req.file) {
    upload.single('profileImage')(req, res, async (err) => {
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

export const updateUser = async (req, res) => {
  const { username, email, userType, language } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'USER_NOT_FOUND', data: null });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (userType) user.userType = userType;
    if (language) user.language = language;

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ statusCode: 200, message: 'USER_UPDATED', data: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'USER_NOT_FOUND', data: null });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ statusCode: 400, message: 'INCORRECT_OLD_PASSWORD', data: null });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ statusCode: 200, message: 'PASSWORD_UPDATED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateProfileImage = async (req, res) => {
  upload.single('profileImage')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ statusCode: 500, message: 'FILE_UPLOAD_ERROR', data: null });
    }

    try {
      let user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ statusCode: 404, message: 'USER_NOT_FOUND', data: null });
      }

      user.profileImage = req.file ? req.file.path : '';
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;
      res.json({ statusCode: 200, message: 'PROFILE_IMAGE_UPDATED', data: userResponse });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
    }
  });
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'USER_NOT_FOUND', data: null });
    }

    const contentCount = await Content.countDocuments({ creator: user._id });
    const commentCount = await Comment.countDocuments({ creator: user._id });
    const reactionCount = await Reaction.countDocuments({ creator: user._id });
    const ratingCount = await Rating.countDocuments({ creator: user._id });

    if (contentCount > 0 || commentCount > 0 || reactionCount > 0 || ratingCount > 0) {
      return res.status(400).json({ statusCode: 400, message: 'USER_HAS_DEPENDENCIES', data: null });
    }

    await user.remove();
    res.json({ statusCode: 200, message: 'USER_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteUserAndDependencies = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'USER_NOT_FOUND', data: null });
    }

    await Content.deleteMany({ creator: user._id });
    await Comment.deleteMany({ creator: user._id });
    await Reaction.deleteMany({ creator: user._id });
    await Rating.deleteMany({ creator: user._id });

    await user.remove();
    res.json({ statusCode: 200, message: 'USER_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleUsers = async (req, res) => {
  try {
    const { ids } = req.body;
    const problematicUsers = [];

    for (const id of ids) {
      const user = await User.findById(id);
      const contentCount = await Content.countDocuments({ creator: id });
      const commentCount = await Comment.countDocuments({ creator: id });
      const reactionCount = await Reaction.countDocuments({ creator: id });
      const ratingCount = await Rating.countDocuments({ creator: id });

      if (contentCount > 0 || commentCount > 0 || reactionCount > 0 || ratingCount > 0) {
        problematicUsers.push(user.username);
      }
    }

    if (problematicUsers.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'CANNOT_DELETE_USER_WITH_DEPENDENCIES',
        data: problematicUsers
      });
    }

    await User.deleteMany({ _id: { $in: ids } });

    res.json({ statusCode: 200, message: 'USERS_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleUsersAndDependencies = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const user = await User.findById(id);

      if (user) {
        await Content.deleteMany({ creator: id });
        await Comment.deleteMany({ creator: id });
        await Reaction.deleteMany({ creator: id });
        await Rating.deleteMany({ creator: id });
        await user.remove();
      }
    }

    res.json({ statusCode: 200, message: 'USERS_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};
