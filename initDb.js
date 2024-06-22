import User from './models/User.js';
import Category from './models/Category.js';
import Topic from './models/Topic.js';
import ReactionType from './models/ReactionType.js';
import ContentType from './models/ContentType.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const initDb = async () => {
  try {    

    // Crear usuario administrador si no existe
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await new User({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        userType: 'admin',
        isVerified: true
      }).save();
      console.log(`Admin user created with email ${adminEmail}`);
    }

    // Crear categorías si no existen
    const categories = [
      { name: 'Tecnología', coverImage: '/uploads/default-category.jpg' },
      { name: 'Deportes', coverImage: '/uploads/default-category.jpg' },
      { name: 'Música', coverImage: '/uploads/default-category.jpg' }
    ];
    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        await new Category(categoryData).save();
        console.log(`Category ${categoryData.name} created`);
      }
    }

    // Crear tópicos si no existen
    const topics = {
      'Tecnología': ['IA', 'Programación'],
      'Deportes': ['Fútbol', 'Baloncesto'],
      'Música': ['Rock', 'Jazz']
    };

    for (const [categoryName, topicNames] of Object.entries(topics)) {
      const category = await Category.findOne({ name: categoryName });
      for (const topicName of topicNames) {
        const existingTopic = await Topic.findOne({ name: topicName });
        if (!existingTopic) {
          await new Topic({ name: topicName, category: category._id }).save();
          console.log(`Topic ${topicName} created in category ${categoryName}`);
        }
      }
    }

    // Crear tipos de reacciones si no existen
    const reactionTypes = [
      { name: 'Me gusta', icon: 'fa-thumbs-up' },
      { name: 'No me gusta', icon: 'fa-thumbs-down' }
    ];
    for (const reactionType of reactionTypes) {
      const existingReactionType = await ReactionType.findOne({ name: reactionType.name });
      if (!existingReactionType) {
        await new ReactionType(reactionType).save();
        console.log(`Reaction type ${reactionType.name} created`);
      }
    }

    // Crear tipos de contenido si no existen
    const contentTypes = ['Video', 'Audio', 'Documento PDF', 'Animación', 'Documento Word'];
    for (const contentTypeName of contentTypes) {
      const existingContentType = await ContentType.findOne({ name: contentTypeName });
      if (!existingContentType) {
        await new ContentType({ name: contentTypeName }).save();
        console.log(`Content type ${contentTypeName} created`);
      }
    }
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
};

export default initDb;
