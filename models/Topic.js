import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  allowedContentTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContentType',
  }],
});

const Topic = mongoose.model('Topic', TopicSchema);
export default Topic;