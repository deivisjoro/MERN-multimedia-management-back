import ReactionType from '../models/ReactionType.js';
import Reaction from '../models/Reaction.js';
import { validationResult } from 'express-validator';

export const getReactionTypes = async (req, res) => {
  try {
    const reactionTypes = await ReactionType.find();
    res.json({ statusCode: 200, message: 'REACTION_TYPES_FETCHED', data: reactionTypes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const getReactionType = async (req, res) => {
  try {
    const reactionType = await ReactionType.findById(req.params.id);
    if (!reactionType) {
      return res.status(404).json({ statusCode: 404, message: 'REACTION_TYPE_NOT_FOUND', data: null });
    }
    res.json({ statusCode: 200, message: 'REACTION_TYPE_FETCHED', data: reactionType });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const createReactionType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  const { name, icon } = req.body;

  try {
    const reactionType = new ReactionType({ name, icon });
    await reactionType.save();
    res.status(201).json({ statusCode: 201, message: 'REACTION_TYPE_CREATED', data: reactionType });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateReactionType = async (req, res) => {
  const { name, icon } = req.body;

  try {
    let reactionType = await ReactionType.findById(req.params.id);
    if (!reactionType) {
      return res.status(404).json({ statusCode: 404, message: 'REACTION_TYPE_NOT_FOUND', data: null });
    }

    if (name) reactionType.name = name;
    if (icon) reactionType.icon = icon;

    await reactionType.save();
    res.json({ statusCode: 200, message: 'REACTION_TYPE_UPDATED', data: reactionType });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteReactionType = async (req, res) => {
  try {
    const reactionType = await ReactionType.findById(req.params.id);
    if (!reactionType) {
      return res.status(404).json({ statusCode: 404, message: 'REACTION_TYPE_NOT_FOUND', data: null });
    }

    const reactionCount = await Reaction.countDocuments({ type: reactionType._id });
    if (reactionCount > 0) {
      return res.status(400).json({ statusCode: 400, message: 'REACTION_TYPE_HAS_DEPENDENCIES', data: null });
    }

    await reactionType.remove();
    res.json({ statusCode: 200, message: 'REACTION_TYPE_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteReactionTypeAndDependencies = async (req, res) => {
  try {
    const reactionType = await ReactionType.findById(req.params.id);
    if (!reactionType) {
      return res.status(404).json({ statusCode: 404, message: 'REACTION_TYPE_NOT_FOUND', data: null });
    }

    await Reaction.deleteMany({ type: reactionType._id });
    await reactionType.remove();
    res.json({ statusCode: 200, message: 'REACTION_TYPE_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};


export const deleteMultipleReactionTypes = async (req, res) => {
  try {
    const { ids } = req.body;
    const problematicReactionTypes = [];

    for (const id of ids) {
      const reactionType = await ReactionType.findById(id);
      const reactionCount = await Reaction.countDocuments({ type: id });

      if (reactionCount > 0) {
        problematicReactionTypes.push(reactionType.name);
      }
    }

    if (problematicReactionTypes.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'REACTION_TYPES_HAVE_DEPENDENCIES',
        data: problematicReactionTypes,
      });
    }

    await ReactionType.deleteMany({ _id: { $in: ids } });

    res.json({ statusCode: 200, message: 'REACTION_TYPES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleReactionTypesAndDependencies = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const reactionType = await ReactionType.findById(id);

      if (reactionType) {
        await Reaction.deleteMany({ type: id });
        await reactionType.remove();
      }
    }

    res.json({ statusCode: 200, message: 'REACTION_TYPES_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};