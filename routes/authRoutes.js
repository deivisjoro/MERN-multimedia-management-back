import express from 'express';
import { registerUser, verifyEmail, loginUser } from '../controllers/authController.js';
import { check } from 'express-validator';

const router = express.Router();

const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'USERNAME_IS_REQUIRED',
  VALID_EMAIL: 'PLEASE_INCLUDE_A_VALID_EMAIL',
  PASSWORD_REQUIRED: 'PASSWORD_IS_REQUIRED',
  PASSWORD_MIN_LENGTH: 'PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS',
};


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               userType:
 *                 type: string
 *                 enum: [lector, creador]
 *                 description: Type of user
 *               language:
 *                 type: string
 *                 description: Preferred language of the user
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image of the user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation errors
 */
router.post('/register', [
  check('username', VALIDATION_MESSAGES.USERNAME_REQUIRED).not().isEmpty(),
  check('email', VALIDATION_MESSAGES.VALID_EMAIL).isEmail(),
  check('password', VALIDATION_MESSAGES.PASSWORD_REQUIRED).not().isEmpty(),
  check('password', VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH).isLength({ min: 6 }),
], registerUser);

// Ruta para verificar el correo electrónico
router.get('/verify-email/:token', verifyEmail);

// Ruta para iniciar sesión
router.post('/login', [
  check('email', VALIDATION_MESSAGES.VALID_EMAIL).isEmail(),
  check('password', VALIDATION_MESSAGES.PASSWORD_REQUIRED).not().isEmpty(),
], loginUser);

export default router;
