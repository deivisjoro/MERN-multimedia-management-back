import ContentType from '../models/ContentType.js';
import Content from '../models/Content.js';
import { validationResult } from 'express-validator';

export const getContentTypes = async (req, res) => {
  try {
    const contentTypes = await ContentType.find();
    res.json({ statusCode: 200, message: 'CONTENT_TYPES_FETCHED', data: contentTypes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const getContentType = async (req, res) => {
  try {
    const contentType = await ContentType.findById(req.params.id);
    if (!contentType) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_TYPE_NOT_FOUND', data: null });
    }
    res.json({ statusCode: 200, message: 'CONTENT_TYPE_FETCHED', data: contentType });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const createContentType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  const { name, icon } = req.body;

  try {
    const contentType = new ContentType({ name, icon });
    await contentType.save();
    res.status(201).json({ statusCode: 201, message: 'CONTENT_TYPE_CREATED', data: contentType });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateContentType = async (req, res) => {
  const { name, icon } = req.body;

  try {
    let contentType = await ContentType.findById(req.params.id);
    if (!contentType) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_TYPE_NOT_FOUND', data: null });
    }

    if (name) contentType.name = name;
    if (icon) contentType.icon = icon;

    await contentType.save();
    res.json({ statusCode: 200, message: 'CONTENT_TYPE_UPDATED', data: contentType });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteContentType = async (req, res) => {
  try {
    const contentType = await ContentType.findById(req.params.id);
    if (!contentType) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_TYPE_NOT_FOUND', data: null });
    }

    const contentCount = await Content.countDocuments({ type: contentType._id });
    if (contentCount > 0) {
      return res.status(400).json({ statusCode: 400, message: 'CONTENT_TYPE_HAS_DEPENDENCIES', data: null });
    }

    await contentType.remove();
    res.json({ statusCode: 200, message: 'CONTENT_TYPE_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteContentTypeAndDependencies = async (req, res) => {
  try {
    const contentType = await ContentType.findById(req.params.id);
    if (!contentType) {
      return res.status(404).json({ statusCode: 404, message: 'CONTENT_TYPE_NOT_FOUND', data: null });
    }

    await Content.deleteMany({ type: contentType._id });
    await contentType.remove();
    res.json({ statusCode: 200, message: 'CONTENT_TYPE_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleContentTypes = async (req, res) => {
  try {
    const { ids } = req.body;
    const problematicContentTypes = [];

    for (const id of ids) {
      const contentType = await ContentType.findById(id);
      const contentCount = await Content.countDocuments({ type: id });

      if (contentCount > 0) {
        problematicContentTypes.push(contentType.name);
      }
    }

    if (problematicContentTypes.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'CONTENT_TYPES_HAVE_DEPENDENCIES',
        data: problematicContentTypes,
      });
    }

    await ContentType.deleteMany({ _id: { $in: ids } });

    res.json({ statusCode: 200, message: 'CONTENT_TYPES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleContentTypesAndDependencies = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const contentType = await ContentType.findById(id);

      if (contentType) {
        await Content.deleteMany({ type: id });
        await contentType.remove();
      }
    }

    res.json({ statusCode: 200, message: 'CONTENT_TYPES_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};
