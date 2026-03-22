require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
  huggingfaceModel: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium'
};
