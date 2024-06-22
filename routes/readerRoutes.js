import express from 'express';
import {
  getContents, getContent, addComment, addRating, addReaction
} from '../controllers/contentController.js';
import { getUser, updateUser, updatePassword, updateProfileImage } from '../controllers/userController.js';
import { authenticateToken, authorizeUser } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

// Constantes de mensajes de validación
const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'USERNAME_IS_REQUIRED',
  VALID_EMAIL: 'PLEASE_INCLUDE_A_VALID_EMAIL',
  OLD_PASSWORD_REQUIRED: 'OLD_PASSWORD_IS_REQUIRED',
  NEW_PASSWORD_LENGTH: 'NEW_PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS',
};

// Rutas para gestión de perfil de usuario
router.get('/profile/:id', authenticateToken, authorizeUser, getUser);
router.put('/profile/:id', authenticateToken, authorizeUser, [
  check('username', VALIDATION_MESSAGES.USERNAME_REQUIRED).not().isEmpty(),
  check('email', VALIDATION_MESSAGES.VALID_EMAIL).isEmail()
], updateUser);
router.put('/profile/:id/password', authenticateToken, authorizeUser, [
  check('oldPassword', VALIDATION_MESSAGES.OLD_PASSWORD_REQUIRED).not().isEmpty(),
  check('newPassword', VALIDATION_MESSAGES.NEW_PASSWORD_LENGTH).isLength({ min: 6 })
], updatePassword);
router.put('/profile/:id/image', authenticateToken, authorizeUser, updateProfileImage);

// Rutas para interacción con contenidos
router.get('/content', authenticateToken, getContents);
router.get('/content/:id', authenticateToken, getContent);
router.post('/content/:contentId/comments', authenticateToken, addComment);
router.post('/content/:contentId/ratings', authenticateToken, addRating);
router.post('/content/:contentId/reactions', authenticateToken, addReaction);

export default router;
