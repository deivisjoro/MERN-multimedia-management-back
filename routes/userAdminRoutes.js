import express from 'express';
import {
  getUsers, createUser, updateUser, deleteUser,
  deleteUserAndDependencies, deleteMultipleUsers, deleteMultipleUsersAndDependencies
} from '../controllers/userController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: 'USERNAME_IS_REQUIRED',
  VALID_EMAIL: 'PLEASE_INCLUDE_A_VALID_EMAIL',
};

// Rutas para gestionar usuarios
router.get('/', authenticateToken, authorizeRoles('admin'), getUsers);
router.post('/', authenticateToken, authorizeRoles('admin'), [
  check('username', VALIDATION_MESSAGES.USERNAME_REQUIRED).not().isEmpty(),
  check('email', VALIDATION_MESSAGES.VALID_EMAIL).isEmail()
], createUser);
router.put('/:id', authenticateToken, authorizeRoles('admin'), [
  check('username', VALIDATION_MESSAGES.USERNAME_REQUIRED).not().isEmpty(),
  check('email', VALIDATION_MESSAGES.VALID_EMAIL).isEmail()
], updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);
router.delete('/:id/dependencies', authenticateToken, authorizeRoles('admin'), deleteUserAndDependencies);
router.delete('/', authenticateToken, authorizeRoles('admin'), deleteMultipleUsers);
router.delete('/dependencies', authenticateToken, authorizeRoles('admin'), deleteMultipleUsersAndDependencies);

export default router;
