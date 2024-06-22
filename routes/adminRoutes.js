import express from 'express';
import userAdminRoutes from './userAdminRoutes.js';
import categoryAdminRoutes from './categoryAdminRoutes.js';
import contentTypeAdminRoutes from './contentTypeAdminRoutes.js';
import topicAdminRoutes from './topicAdminRoutes.js';
import reactionTypeAdminRoutes from './reactionTypeAdminRoutes.js';
import contentAdminRoutes from './contentAdminRoutes.js';

const router = express.Router();

router.use('/users', userAdminRoutes);
router.use('/categories', categoryAdminRoutes);
router.use('/content-types', contentTypeAdminRoutes);
router.use('/topics', topicAdminRoutes);
router.use('/reaction-types', reactionTypeAdminRoutes);
router.use('/contents', contentAdminRoutes);

export default router;
