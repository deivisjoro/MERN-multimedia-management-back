import Category from '../models/Category.js';
import Content from '../models/Content.js';
import { validationResult } from 'express-validator';
import upload from '../config/multer.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ statusCode: 200, message: 'CATEGORIES_FETCHED', data: categories });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ statusCode: 404, message: 'CATEGORY_NOT_FOUND', data: null });
    }
    res.json({ statusCode: 200, message: 'CATEGORY_FETCHED', data: category });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const createCategory = async (req, res) => {

  if (req.file) {
    upload.single('coverImage')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ statusCode: 500, message: 'FILE_UPLOAD_ERROR', data: null });
      }
      await processCreateCategory(req, res);
    });
  } else {
    await processCreateCategory(req, res);
  }
};

const processCreateCategory = async (req, res) => {
  const { name, permissions } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ statusCode: 400, message: 'VALIDATION_ERRORS', data: errors.array() });
  }

  try {
    const category = new Category({
      name,
      permissions: JSON.parse(permissions),
      coverImage: req.file ? req.file.path : '',
    });

    await category.save();
    res.status(201).json({ statusCode: 201, message: 'CATEGORY_CREATED', data: category });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateCategory = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ statusCode: 404, message: 'CATEGORY_NOT_FOUND', data: null });
    }

    if (name) category.name = name;
    if (permissions) category.permissions = JSON.parse(permissions);

    await category.save();
    res.json({ statusCode: 200, message: 'CATEGORY_UPDATED', data: category });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const updateCategoryImage = async (req, res) => {
  upload.single('coverImage')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ statusCode: 500, message: 'FILE_UPLOAD_ERROR', data: null });
    }

    try {
      let category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ statusCode: 404, message: 'CATEGORY_NOT_FOUND', data: null });
      }

      category.coverImage = req.file ? req.file.path : '';
      await category.save();

      res.json({ statusCode: 200, message: 'CATEGORY_IMAGE_UPDATED', data: category });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
    }
  });
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ statusCode: 404, message: 'CATEGORY_NOT_FOUND', data: null });
    }

    const contentCount = await Content.countDocuments({ category: category._id });
    if (contentCount > 0) {
      return res.status(400).json({ statusCode: 400, message: 'CATEGORY_HAS_DEPENDENCIES', data: null });
    }

    await category.remove();
    res.json({ statusCode: 200, message: 'CATEGORY_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteCategoryAndDependencies = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ statusCode: 404, message: 'CATEGORY_NOT_FOUND', data: null });
    }

    await Content.deleteMany({ category: category._id });
    await category.remove();
    res.json({ statusCode: 200, message: 'CATEGORY_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleCategories = async (req, res) => {
  try {
    const { ids } = req.body;
    const problematicCategories = [];

    for (const id of ids) {
      const category = await Category.findById(id);
      const contentCount = await Content.countDocuments({ category: id });

      if (contentCount > 0) {
        problematicCategories.push(category.name);
      }
    }

    if (problematicCategories.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'CATEGORIES_HAVE_DEPENDENCIES',
        data: problematicCategories,
      });
    }

    await Category.deleteMany({ _id: { $in: ids } });

    res.json({ statusCode: 200, message: 'CATEGORIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};

export const deleteMultipleCategoriesAndDependencies = async (req, res) => {
  try {
    const { ids } = req.body;

    for (const id of ids) {
      const category = await Category.findById(id);

      if (category) {
        await Content.deleteMany({ category: id });
        await category.remove();
      }
    }

    res.json({ statusCode: 200, message: 'CATEGORIES_AND_DEPENDENCIES_REMOVED', data: null });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ statusCode: 500, message: 'SERVER_ERROR', data: null });
  }
};
