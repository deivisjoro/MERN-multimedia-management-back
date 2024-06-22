import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['admin', 'creador', 'lector'],
    required: true,
  },
  canRead: {
    type: Boolean,
    default: false,
  },
  canWrite: {
    type: Boolean,
    default: false,
  },
});

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [PermissionSchema],
  coverImage: {
    type: String,
    default: 'uploads/default-category.jpg',
  },
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
