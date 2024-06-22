import express from 'express';
import {
  getContentTypes, createContentType, updateContentType,
  deleteContentType, deleteContentTypeAndDependencies, deleteMultipleContentTypes, deleteMultipleContentTypesAndDependencies
} from '../controllers/contentTypeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para gestionar tipos de contenido
router.get('/', authenticateToken, authorizeRoles('admin'), getContentTypes);
router.post('/', authenticateToken, authorizeRoles('admin'), createContentType);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateContentType);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteContentType);
router.delete('/:id/dependencies', authenticateToken, authorizeRoles('admin'), deleteContentTypeAndDependencies);
router.delete('/', authenticateToken, authorizeRoles('admin'), deleteMultipleContentTypes);
router.delete('/dependencies', authenticateToken, authorizeRoles('admin'), deleteMultipleContentTypesAndDependencies);

export default router;
