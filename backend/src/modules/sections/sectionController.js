const { query } = require('../../config/database');

const sectionController = {
  async getSectionsBySubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      
      const subjectQuery = 'SELECT id, title FROM subjects WHERE id = ?';
      const subjects = await query(subjectQuery, [subjectId]);
      
      if (subjects.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const sectionsQuery = `
        SELECT id, title, order_index, created_at, updated_at
        FROM sections
        WHERE subject_id = ?
        ORDER BY order_index ASC
      `;
      const sections = await query(sectionsQuery, [subjectId]);

      for (const section of sections) {
        const videosQuery = `
          SELECT id, title, order_index, duration_seconds
          FROM videos
          WHERE section_id = ?
          ORDER BY order_index ASC
        `;
        const videos = await query(videosQuery, [section.id]);
        section.videos = videos;
        section.video_count = videos.length;

        if (req.user) {
          const progressQuery = `
            SELECT 
              COUNT(v.id) as total_videos,
              COUNT(CASE WHEN vp.is_completed = true THEN 1 END) as completed_videos
            FROM videos v
            LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
            WHERE v.section_id = ?
          `;
          const [progress] = await query(progressQuery, [req.user.id, section.id]);
          
          section.total_videos = progress.total_videos;
          section.completed_videos = progress.completed_videos;
          section.progress_percentage = progress.total_videos > 0 
            ? Math.round((progress.completed_videos / progress.total_videos) * 100)
            : 0;
        } else {
          section.total_videos = section.video_count;
          section.completed_videos = 0;
          section.progress_percentage = 0;
        }
      }

      res.json({
        subject: subjects[0],
        sections
      });
    } catch (error) {
      next(error);
    }
  },

  async getSectionById(req, res, next) {
    try {
      const { sectionId } = req.params;
      
      const sectionQuery = `
        SELECT s.id, s.title, s.order_index, s.created_at, s.updated_at,
               sub.id as subject_id, sub.title as subject_title, sub.slug as subject_slug
        FROM sections s
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE s.id = ?
      `;
      const sections = await query(sectionQuery, [sectionId]);
      
      if (sections.length === 0) {
        return res.status(404).json({ error: 'Section not found' });
      }

      const section = sections[0];

      const videosQuery = `
        SELECT id, title, description, youtube_url, order_index, duration_seconds, created_at, updated_at
        FROM videos
        WHERE section_id = ?
        ORDER BY order_index ASC
      `;
      const videos = await query(videosQuery, [sectionId]);

      if (req.user) {
        for (const video of videos) {
          const progressQuery = `
            SELECT last_position_seconds, is_completed, completed_at
            FROM video_progress
            WHERE user_id = ? AND video_id = ?
          `;
          const progress = await query(progressQuery, [req.user.id, video.id]);
          
          if (progress.length > 0) {
            video.last_position_seconds = progress[0].last_position_seconds;
            video.is_completed = progress[0].is_completed;
            video.completed_at = progress[0].completed_at;
          } else {
            video.last_position_seconds = 0;
            video.is_completed = false;
            video.completed_at = null;
          }
        }
      }

      section.videos = videos;
      section.video_count = videos.length;

      res.json({
        section
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = sectionController;
