import mongoose from 'mongoose';

const ContentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
  },
});

const ContentType = mongoose.model('ContentType', ContentTypeSchema);
export default ContentType;