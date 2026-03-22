const { query } = require('../../config/database');
const { extractYouTubeVideoId } = require('../../utils/helpers');

const videoController = {
  async getVideoById(req, res, next) {
    try {
      const { videoId } = req.params;
      
      const videoQuery = `
        SELECT v.id, v.title, v.description, v.youtube_url, v.order_index, v.duration_seconds, v.created_at, v.updated_at,
               s.id as section_id, s.title as section_title, s.order_index as section_order,
               sub.id as subject_id, sub.title as subject_title, sub.slug as subject_slug
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE v.id = ?
      `;
      const videos = await query(videoQuery, [videoId]);
      
      if (videos.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const video = videos[0];

      const previousVideoQuery = `
        SELECT v.id, v.title
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND 
              (s.order_index < ? OR (s.order_index = ? AND v.order_index < ?))
        ORDER BY s.order_index DESC, v.order_index DESC
        LIMIT 1
      `;
      const previousVideos = await query(previousVideoQuery, [
        video.subject_id, video.section_order, video.section_order, video.order_index
      ]);
      video.previous_video = previousVideos.length > 0 ? previousVideos[0] : null;

      const nextVideoQuery = `
        SELECT v.id, v.title
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND 
              (s.order_index > ? OR (s.order_index = ? AND v.order_index > ?))
        ORDER BY s.order_index ASC, v.order_index ASC
        LIMIT 1
      `;
      const nextVideos = await query(nextVideoQuery, [
        video.subject_id, video.section_order, video.section_order, video.order_index
      ]);
      video.next_video = nextVideos.length > 0 ? nextVideos[0] : null;

      if (req.user) {
        const progressQuery = `
          SELECT last_position_seconds, is_completed, completed_at
          FROM video_progress
          WHERE user_id = ? AND video_id = ?
        `;
        const progress = await query(progressQuery, [req.user.id, videoId]);
        
        if (progress.length > 0) {
          video.last_position_seconds = progress[0].last_position_seconds;
          video.is_completed = progress[0].is_completed;
          video.completed_at = progress[0].completed_at;
        } else {
          video.last_position_seconds = 0;
          video.is_completed = false;
          video.completed_at = null;
        }

        const enrollmentQuery = `
          SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?
        `;
        const enrollments = await query(enrollmentQuery, [req.user.id, video.subject_id]);
        video.is_enrolled = enrollments.length > 0;

        if (video.previous_video) {
          const previousProgressQuery = `
            SELECT is_completed
            FROM video_progress
            WHERE user_id = ? AND video_id = ?
          `;
          const previousProgress = await query(previousProgressQuery, [req.user.id, video.previous_video.id]);
          video.is_locked = previousProgress.length === 0 || !previousProgress[0].is_completed;
        } else {
          video.is_locked = false;
        }
      } else {
        video.last_position_seconds = 0;
        video.is_completed = false;
        video.completed_at = null;
        video.is_enrolled = false;
        video.is_locked = true;
      }

      video.youtube_video_id = extractYouTubeVideoId(video.youtube_url);

      res.json({
        video
      });
    } catch (error) {
      next(error);
    }
  },

  async getFirstVideoOfSubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      
      const subjectQuery = 'SELECT id, title FROM subjects WHERE id = ?';
      const subjects = await query(subjectQuery, [subjectId]);
      
      if (subjects.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const firstVideoQuery = `
        SELECT v.id, v.title, v.description, v.youtube_url, v.order_index, v.duration_seconds, v.created_at, v.updated_at,
               s.id as section_id, s.title as section_title, s.order_index as section_order,
               sub.id as subject_id, sub.title as subject_title, sub.slug as subject_slug
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE sub.id = ?
        ORDER BY s.order_index ASC, v.order_index ASC
        LIMIT 1
      `;
      const videos = await query(firstVideoQuery, [subjectId]);
      
      if (videos.length === 0) {
        return res.status(404).json({ error: 'No videos found in this subject' });
      }

      const video = videos[0];

      const nextVideoQuery = `
        SELECT v.id, v.title
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ? AND 
              (s.order_index > ? OR (s.order_index = ? AND v.order_index > ?))
        ORDER BY s.order_index ASC, v.order_index ASC
        LIMIT 1
      `;
      const nextVideos = await query(nextVideoQuery, [
        video.subject_id, video.section_order, video.section_order, video.order_index
      ]);
      video.next_video = nextVideos.length > 0 ? nextVideos[0] : null;
      video.previous_video = null;

      if (req.user) {
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

        const enrollmentQuery = `
          SELECT id FROM enrollments WHERE user_id = ? AND subject_id = ?
        `;
        const enrollments = await query(enrollmentQuery, [req.user.id, subjectId]);
        video.is_enrolled = enrollments.length > 0;
        video.is_locked = false;
      } else {
        video.last_position_seconds = 0;
        video.is_completed = false;
        video.completed_at = null;
        video.is_enrolled = false;
        video.is_locked = true;
      }

      video.youtube_video_id = extractYouTubeVideoId(video.youtube_url);

      res.json({
        video
      });
    } catch (error) {
      next(error);
    }
  },

  async getVideosBySection(req, res, next) {
    try {
      const { sectionId } = req.params;
      
      const sectionQuery = 'SELECT id, title FROM sections WHERE id = ?';
      const sections = await query(sectionQuery, [sectionId]);
      
      if (sections.length === 0) {
        return res.status(404).json({ error: 'Section not found' });
      }

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

          video.youtube_video_id = extractYouTubeVideoId(video.youtube_url);
        }
      } else {
        for (const video of videos) {
          video.last_position_seconds = 0;
          video.is_completed = false;
          video.completed_at = null;
          video.youtube_video_id = extractYouTubeVideoId(video.youtube_url);
        }
      }

      res.json({
        section: sections[0],
        videos
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = videoController;
