import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reactionType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReactionType',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReactionSchema.index({ content: 1, user: 1 }, { unique: true });

const Reaction = mongoose.model('Reaction', ReactionSchema);
export default Reaction;
