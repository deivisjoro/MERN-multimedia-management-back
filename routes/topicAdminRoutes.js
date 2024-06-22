import express from 'express';
import {
  getTopics, createTopic, updateTopic,
  deleteTopic, deleteTopicAndDependencies, deleteMultipleTopics, deleteMultipleTopicsAndDependencies
} from '../controllers/topicController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para gestionar tópicos
router.get('/', authenticateToken, authorizeRoles('admin'), getTopics);
router.post('/', authenticateToken, authorizeRoles('admin'), createTopic);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateTopic);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteTopic);
router.delete('/:id/dependencies', authenticateToken, authorizeRoles('admin'), deleteTopicAndDependencies);
router.delete('/', authenticateToken, authorizeRoles('admin'), deleteMultipleTopics);
router.delete('/dependencies', authenticateToken, authorizeRoles('admin'), deleteMultipleTopicsAndDependencies);

export default router;
