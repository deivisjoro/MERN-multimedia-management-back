import express from 'express';
import {
  getUser,
  updateUser,
  updatePassword,
  updateProfileImage
} from '../controllers/userController.js';
import { authenticateToken, authorizeUser } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'USERNAME_IS_REQUIRED',
  VALID_EMAIL: 'PLEASE_INCLUDE_A_VALID_EMAIL',
  OLD_PASSWORD_REQUIRED: 'OLD_PASSWORD_IS_REQUIRED',
  NEW_PASSWORD_LENGTH: 'NEW_PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS'
};

// Ruta para obtener la información del usuario
router.get('/profile/:id', authenticateToken, authorizeUser, getUser);

// Ruta para actualizar la información del usuario
router.put('/profile/:id', authenticateToken, authorizeUser, [
  check('username', VALIDATION_MESSAGES.USERNAME_REQUIRED).not().isEmpty(),
  check('email', VALIDATION_MESSAGES.VALID_EMAIL).isEmail()
], updateUser);

// Ruta para actualizar la contraseña del usuario
router.put('/profile/:id/password', authenticateToken, authorizeUser, [
  check('oldPassword', VALIDATION_MESSAGES.OLD_PASSWORD_REQUIRED).not().isEmpty(),
  check('newPassword', VALIDATION_MESSAGES.NEW_PASSWORD_LENGTH).isLength({ min: 6 })
], updatePassword);

// Ruta para actualizar la imagen de perfil del usuario
router.put('/profile/:id/image', authenticateToken, authorizeUser, updateProfileImage);

export default router;
