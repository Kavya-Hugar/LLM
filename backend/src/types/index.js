module.exports = {
  User: {
    id: 'number',
    email: 'string',
    name: 'string',
    created_at: 'date'
  },
  
  Subject: {
    id: 'number',
    title: 'string',
    slug: 'string',
    description: 'string',
    is_published: 'boolean',
    created_at: 'date'
  },
  
  Section: {
    id: 'number',
    subject_id: 'number',
    title: 'string',
    order_index: 'number',
    created_at: 'date'
  },
  
  Video: {
    id: 'number',
    section_id: 'number',
    title: 'string',
    description: 'string',
    youtube_url: 'string',
    order_index: 'number',
    duration_seconds: 'number',
    created_at: 'date'
  },
  
  VideoProgress: {
    id: 'number',
    user_id: 'number',
    video_id: 'number',
    last_position_seconds: 'number',
    is_completed: 'boolean',
    completed_at: 'date'
  },
  
  Enrollment: {
    id: 'number',
    user_id: 'number',
    subject_id: 'number',
    enrolled_at: 'date'
  }
};
