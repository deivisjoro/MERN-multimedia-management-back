import express from 'express';
import {
  getContents, createContent, updateContent,
  deleteContent, deleteContentAndDependencies, deleteMultipleContents, deleteMultipleContentsAndDependencies
} from '../controllers/contentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para gestionar contenidos
router.get('/', authenticateToken, authorizeRoles('admin'), getContents);
router.post('/', authenticateToken, authorizeRoles('admin'), createContent);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateContent);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteContent);
router.delete('/:id/dependencies', authenticateToken, authorizeRoles('admin'), deleteContentAndDependencies);
router.delete('/', authenticateToken, authorizeRoles('admin'), deleteMultipleContents);
router.delete('/dependencies', authenticateToken, authorizeRoles('admin'), deleteMultipleContentsAndDependencies);

export default router;
