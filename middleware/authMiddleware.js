import jwt from 'jsonwebtoken';
import Content from '../models/Content.js';

export const authenticateToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ statusCode: 401, message: 'NO_TOKEN_PROVIDED', data: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ statusCode: 401, message: 'INVALID_TOKEN', data: null });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ statusCode: 403, message: 'FORBIDDEN', data: null });
    }
    next();
  };
};

export const authorizeUser = (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ statusCode: 403, message: 'FORBIDDEN', data: null });
  }
  next();
};

export const authorizeContentOwner = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (content.creator.toString() !== req.user.id) {
      return res.status(403).json({ statusCode: 403, message: 'NOT_CONTENT_OWNER', data: null });
    }
    next();
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};
