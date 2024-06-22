import Topic from '../models/Topic.js';
import Content from '../models/Content.js';
import { validationResult } from 'express-validator';

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('allowedContentTypes');
    res.json({ statusCode: 200, message: 'TOPICS_FETCHED', data: topics });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('allowedContentTypes');
    if (!topic) {
      return res.status(404).json({ statusCode: 404, message: 'TOPIC_NOT_FOUND', data: null });
    }
    res.json({ statusCode: 200, message: 'TOPIC_FETCHED', data: topic });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const createTopic = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  const { name, allowedContentTypes } = req.body;

  try {
    const topic = new Topic({
      name,
      allowedContentTypes: JSON.parse(allowedContentTypes),
    });

    await topic.save();
    res.status(201).json({ statusCode: 201, message: 'TOPIC_CREATED', data: topic });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateTopic = async (req, res) => {
  const { name, allowedContentTypes } = req.body;

  try {
    let topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ statusCode: 404, message: 'TOPIC_NOT_FOUND', data: null });
    }

    if (name) topic.name = name;
    if (allowedContentTypes) topic.allowedContentTypes = JSON.parse(allowedContentTypes);

    await topic.save();
    res.json({ statusCode: 200, message: 'TOPIC_UPDATED', data: topic });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ statusCode: 404, message: 'TOPIC_NOT_FOUND', data: null });
    }

    const contentCount = await Content.countDocuments({ topic: topic._id });
    if (contentCount > 0) {
      return res.status(400).json({ statusCode: 400, message: 'TOPIC_HAS_DEPENDENCIES', data: null });
    }

    await topic.remove();
    res.json({ statusCode: 200, message: 'TOPIC_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteTopicAndDependencies = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ statusCode: 404, message: 'TOPIC_NOT_FOUND', data: null });
    }

    await Content.deleteMany({ topic: topic._id });
    await topic.remove();
    res.json({ statusCode: 200, message: 'TOPIC_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleTopics = async (req, res) => {
  try {
    const { ids } = req.body;
    const problematicTopics = [];

    for (const id of ids) {
      const topic = await Topic.findById(id);
      const contentCount = await Content.countDocuments({ topic: id });

      if (contentCount > 0) {
        problematicTopics.push(topic.name);
      }
    }

    if (problematicTopics.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'TOPICS_HAVE_DEPENDENCIES',
        data: problematicTopics,
      });
    }

    await Topic.deleteMany({ _id: { $in: ids } });

    res.json({ statusCode: 200, message: 'TOPICS_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleTopicsAndDependencies = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const topic = await Topic.findById(id);

      if (topic) {
        await Content.deleteMany({ topic: id });
        await topic.remove();
      }
    }

    res.json({ statusCode: 200, message: 'TOPICS_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};
