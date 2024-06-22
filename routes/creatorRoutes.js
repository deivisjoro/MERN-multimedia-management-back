import express from 'express';
import {
  createContent, updateContent, deleteContent, getContents, getContent, addComment, addRating, addReaction
} from '../controllers/contentController.js';
import { authenticateToken, authorizeRoles, authorizeContentOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para gestión de contenido por creadores
router.post('/content', authenticateToken, authorizeRoles('creador'), createContent);
router.put('/content/:id', authenticateToken, authorizeRoles('creador'), authorizeContentOwner, updateContent);
router.delete('/content/:id', authenticateToken, authorizeRoles('creador'), authorizeContentOwner, deleteContent);

// Rutas para consultar contenidos
router.get('/content', authenticateToken, authorizeRoles('creador', 'lector'), getContents);
router.get('/content/:id', authenticateToken, authorizeRoles('creador', 'lector'), getContent);

// Rutas para interacción con el contenido
router.post('/content/:contentId/comments', authenticateToken, authorizeRoles('creador', 'lector'), addComment);
router.post('/content/:contentId/ratings', authenticateToken, authorizeRoles('creador', 'lector'), addRating);
router.post('/content/:contentId/reactions', authenticateToken, authorizeRoles('creador', 'lector'), addReaction);

export default router;
