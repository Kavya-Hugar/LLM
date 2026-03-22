const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
  return youtubeRegex.test(url);
};

const validateRequired = (data, requiredFields) => {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      missing.push(field);
    }
  }
  
  return missing;
};

const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  
  const missing = validateRequired(req.body, ['email', 'password', 'name']);
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missing
    });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }
  
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long'
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  const missing = validateRequired(req.body, ['email', 'password']);
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missing
    });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }
  
  next();
};

const validateVideoCreation = (req, res, next) => {
  const { title, youtube_url, section_id } = req.body;
  
  const missing = validateRequired(req.body, ['title', 'youtube_url', 'section_id']);
  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missing
    });
  }
  
  if (!validateYouTubeUrl(youtube_url)) {
    return res.status(400).json({
      error: 'Invalid YouTube URL format'
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateVideoCreation,
  validateEmail,
  validatePassword,
  validateYouTubeUrl,
  validateRequired
};
