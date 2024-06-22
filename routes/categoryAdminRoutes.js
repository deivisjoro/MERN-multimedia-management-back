import express from 'express';
import {
  getCategories, createCategory, updateCategory, updateCategoryImage,
  deleteCategory, deleteCategoryAndDependencies, deleteMultipleCategories, deleteMultipleCategoriesAndDependencies
} from '../controllers/categoryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para gestionar categorías
router.get('/', authenticateToken, authorizeRoles('admin'), getCategories);
router.post('/', authenticateToken, authorizeRoles('admin'), createCategory);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateCategory);
router.put('/:id/image', authenticateToken, authorizeRoles('admin'), updateCategoryImage);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteCategory);
router.delete('/:id/dependencies', authenticateToken, authorizeRoles('admin'), deleteCategoryAndDependencies);
router.delete('/', authenticateToken, authorizeRoles('admin'), deleteMultipleCategories);
router.delete('/dependencies', authenticateToken, authorizeRoles('admin'), deleteMultipleCategoriesAndDependencies);

export default router;
