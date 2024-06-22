import Content from '../models/Content.js';
import Comment from '../models/Comment.js';
import Rating from '../models/Rating.js';
import Reaction from '../models/Reaction.js';
import { validationResult } from 'express-validator';
import upload from '../config/multer.js';

export const getContents = async (req, res) => {
  const { category, topic, contentType } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (topic) filter.topic = topic;
  if (contentType) filter.contentType = contentType;

  try {
    const contents = await Content.find(filter);
    res.json({ statusCode: 200, message: 'CONTENTS_FETCHED', data: contents });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('creator category topic contentType ratings reactions comments');
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }
    res.json({ statusCode: 200, message: 'CONTENT_FETCHED', data: content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const createContent = async (req, res) => {
  if (req.file) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ statusCode: 500, message: 'FILE_UPLOAD_ERROR', data: null });
      }
      await processCreateContent(req, res);
    });
  } else {
    await processCreateContent(req, res);
  }
};

const processCreateContent = async (req, res) => {
  const { title, description, contentSource, contentType, url, category, topic, creator } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const contentData = {
      title,
      description,
      contentSource,
      contentType,
      category,
      topic,
      creator,
    };

    if (contentSource === 'file') {
      contentData.fileName = req.file.originalname;
      contentData.filePath = req.file.path;
    } else if (contentSource === 'url') {
      contentData.url = url;
    }

    const content = new Content(contentData);

    await content.save();
    res.status(201).json({ statusCode: 201, message: 'CONTENT_CREATED', data: content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateContent = async (req, res) => {
  if (req.file) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ statusCode: 500, message: 'FILE_UPLOAD_ERROR', data: null });
      }
      await processUpdateContent(req, res);
    });
  } else {
    await processUpdateContent(req, res);
  }
};

const processUpdateContent = async (req, res) => {
  const { title, description, contentSource, contentType, url, category, topic } = req.body;

  try {
    let content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }

    if (title) content.title = title;
    if (description) content.description = description;
    if (contentSource) content.contentSource = contentSource;
    if (contentType) content.contentType = contentType;
    if (category) content.category = category;
    if (topic) content.topic = topic;
    if (contentSource === 'file' && req.file) {
      content.fileName = req.file.originalname;
      content.filePath = req.file.path;
    } else if (contentSource === 'url') {
      content.url = url;
    }

    await content.save();
    res.json({ statusCode: 200, message: 'CONTENT_UPDATED', data: content });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('comments ratings reactions');
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }

    if (content.comments.length > 0 || content.ratings.length > 0 || content.reactions.length > 0) {
      return res.status(400).json({ statusCode: 400, message: 'CONTENT_HAS_DEPENDENCIES', data: null });
    }

    await content.remove();
    res.json({ statusCode: 200, message: 'CONTENT_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteContentAndDependencies = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('comments ratings reactions');
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }

    await Comment.deleteMany({ _id: { $in: content.comments } });
    await Rating.deleteMany({ _id: { $in: content.ratings } });
    await Reaction.deleteMany({ _id: { $in: content.reactions } });
    await content.remove();

    res.json({ statusCode: 200, message: 'CONTENT_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleContents = async (req, res) => {
  try {
    const { ids } = req.body;
    const problematicContents = [];

    for (const id of ids) {
      const content = await Content.findById(id).populate('comments ratings reactions');
      if (content && (content.comments.length > 0 || content.ratings.length > 0 || content.reactions.length > 0)) {
        problematicContents.push(content.title);
      }
    }

    if (problematicContents.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'CONTENTS_HAVE_DEPENDENCIES',
        data: problematicContents,
      });
    }

    await Content.deleteMany({ _id: { $in: ids } });

    res.json({ statusCode: 200, message: 'CONTENTS_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleContentsAndDependencies = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const content = await Content.findById(id).populate('comments ratings reactions');
      if (content) {
        await Comment.deleteMany({ _id: { $in: content.comments } });
        await Rating.deleteMany({ _id: { $in: content.ratings } });
        await Reaction.deleteMany({ _id: { $in: content.reactions } });
        await content.remove();
      }
    }

    res.json({ statusCode: 200, message: 'CONTENTS_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};


export const addComment = async (req, res) => {
  const { contentId, userId, text } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }

    const comment = new Comment({ text, creator: userId, content: contentId });
    await comment.save();

    content.comments.push(comment._id);
    await content.save();

    res.status(201).json({ statusCode: 201, message: 'COMMENT_ADDED', data: comment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const addRating = async (req, res) => {
  const { contentId, userId, value } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }

    const rating = new Rating({ value, creator: userId, content: contentId });
    await rating.save();

    content.ratings.push(rating._id);
    const totalRatings = await Rating.find({ content: contentId });
    const averageRating = totalRatings.reduce((sum, rating) => sum + rating.value, 0) / totalRatings.length;
    content.averageRating = averageRating;
    await content.save();

    res.status(201).json({ statusCode: 201, message: 'RATING_ADDED', data: rating });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const addReaction = async (req, res) => {
  const { contentId, userId, type } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_NOT_FOUND', data: null });
    }

    const reaction = new Reaction({ type, creator: userId, content: contentId });
    await reaction.save();

    content.reactions.push(reaction._id);
    await content.save();

    res.status(201).json({ statusCode: 201, message: 'REACTION_ADDED', data: reaction });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};