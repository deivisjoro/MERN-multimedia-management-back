import mongoose from 'mongoose';

const ReactionTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReactionType = mongoose.model('ReactionType', ReactionTypeSchema);
export default ReactionType;
