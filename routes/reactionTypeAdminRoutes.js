import express from 'express';
import {
  getReactionTypes, createReactionType, updateReactionType,
  deleteReactionType, deleteReactionTypeAndDependencies, deleteMultipleReactionTypes, deleteMultipleReactionTypesAndDependencies
} from '../controllers/reactionTypeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para gestionar tipos de reacción
router.get('/', authenticateToken, authorizeRoles('admin'), getReactionTypes);
router.post('/', authenticateToken, authorizeRoles('admin'), createReactionType);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateReactionType);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteReactionType);
router.delete('/:id/dependencies', authenticateToken, authorizeRoles('admin'), deleteReactionTypeAndDependencies);
router.delete('/', authenticateToken, authorizeRoles('admin'), deleteMultipleReactionTypes);
router.delete('/dependencies', authenticateToken, authorizeRoles('admin'), deleteMultipleReactionTypesAndDependencies);

export default router;
