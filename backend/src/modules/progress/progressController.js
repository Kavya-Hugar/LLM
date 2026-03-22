const { query } = require('../../config/database');

const progressController = {
  async getSubjectProgress(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;

      const subjectQuery = 'SELECT id, title FROM subjects WHERE id = ?';
      const subjects = await query(subjectQuery, [subjectId]);
      
      if (subjects.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const enrollmentQuery = `
        SELECT id, enrolled_at
        FROM enrollments
        WHERE user_id = ? AND subject_id = ?
      `;
      const enrollments = await query(enrollmentQuery, [userId, subjectId]);
      
      if (enrollments.length === 0) {
        return res.status(403).json({ error: 'Not enrolled in this subject' });
      }

      const sectionsQuery = `
        SELECT s.id, s.title, s.order_index
        FROM sections s
        WHERE s.subject_id = ?
        ORDER BY s.order_index ASC
      `;
      const sections = await query(sectionsQuery, [subjectId]);

      let totalVideos = 0;
      let completedVideos = 0;
      let totalDuration = 0;
      let watchedDuration = 0;

      for (const section of sections) {
        const videosQuery = `
          SELECT v.id, v.title, v.order_index, v.duration_seconds
          FROM videos v
          WHERE v.section_id = ?
          ORDER BY v.order_index ASC
        `;
        const videos = await query(videosQuery, [section.id]);

        for (const video of videos) {
          totalVideos++;
          totalDuration += video.duration_seconds || 0;

          const progressQuery = `
            SELECT last_position_seconds, is_completed, completed_at
            FROM video_progress
            WHERE user_id = ? AND video_id = ?
          `;
          const progress = await query(progressQuery, [userId, video.id]);

          if (progress.length > 0) {
            video.last_position_seconds = progress[0].last_position_seconds;
            video.is_completed = progress[0].is_completed;
            video.completed_at = progress[0].completed_at;
            
            if (progress[0].is_completed) {
              completedVideos++;
              watchedDuration += video.duration_seconds || 0;
            } else {
              watchedDuration += progress[0].last_position_seconds || 0;
            }
          } else {
            video.last_position_seconds = 0;
            video.is_completed = false;
            video.completed_at = null;
          }
        }

        section.videos = videos;
        section.video_count = videos.length;
        section.completed_videos = videos.filter(v => v.is_completed).length;
        section.progress_percentage = videos.length > 0 
          ? Math.round((section.completed_videos / videos.length) * 100)
          : 0;
      }

      const overallProgress = totalVideos > 0 
        ? Math.round((completedVideos / totalVideos) * 100)
        : 0;

      res.json({
        subject: subjects[0],
        enrollment: {
          enrolled_at: enrollments[0].enrolled_at
        },
        sections,
        overall_progress: {
          total_videos: totalVideos,
          completed_videos: completedVideos,
          progress_percentage: overallProgress,
          total_duration_seconds: totalDuration,
          watched_duration_seconds: watchedDuration
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getVideoProgress(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;

      const videoQuery = `
        SELECT v.id, v.title, v.duration_seconds,
               s.id as section_id, s.title as section_title,
               sub.id as subject_id, sub.title as subject_title
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

      const enrollmentQuery = `
        SELECT id FROM enrollments
        WHERE user_id = ? AND subject_id = ?
      `;
      const enrollments = await query(enrollmentQuery, [userId, video.subject_id]);
      
      if (enrollments.length === 0) {
        return res.status(403).json({ error: 'Not enrolled in this subject' });
      }

      const progressQuery = `
        SELECT last_position_seconds, is_completed, completed_at, created_at, updated_at
        FROM video_progress
        WHERE user_id = ? AND video_id = ?
      `;
      const progress = await query(progressQuery, [userId, videoId]);

      if (progress.length > 0) {
        video.progress = progress[0];
      } else {
        video.progress = {
          last_position_seconds: 0,
          is_completed: false,
          completed_at: null,
          created_at: null,
          updated_at: null
        };
      }

      res.json({
        video
      });
    } catch (error) {
      next(error);
    }
  },

  async updateVideoProgress(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      const { last_position_seconds, is_completed } = req.body;

      const videoQuery = `
        SELECT id, title, duration_seconds
        FROM videos
        WHERE id = ?
      `;
      const videos = await query(videoQuery, [videoId]);
      
      if (videos.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const video = videos[0];

      const subjectQuery = `
        SELECT sub.id
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE v.id = ?
      `;
      const subjects = await query(subjectQuery, [videoId]);
      
      const enrollmentQuery = `
        SELECT id FROM enrollments
        WHERE user_id = ? AND subject_id = ?
      `;
      const enrollments = await query(enrollmentQuery, [userId, subjects[0].id]);
      
      if (enrollments.length === 0) {
        return res.status(403).json({ error: 'Not enrolled in this subject' });
      }

      const existingProgressQuery = `
        SELECT id, is_completed
        FROM video_progress
        WHERE user_id = ? AND video_id = ?
      `;
      const existingProgress = await query(existingProgressQuery, [userId, videoId]);

      const updateData = {
        last_position_seconds: Math.max(0, Math.min(last_position_seconds || 0, video.duration_seconds || 0)),
        is_completed: Boolean(is_completed),
        updated_at: new Date()
      };

      if (updateData.is_completed && (!existingProgress.length || !existingProgress[0].is_completed)) {
        updateData.completed_at = new Date();
      }

      if (existingProgress.length > 0) {
        const updateFields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const updateValues = Object.values(updateData);
        updateValues.push(userId, videoId);

        await query(
          `UPDATE video_progress SET ${updateFields} WHERE user_id = ? AND video_id = ?`,
          updateValues
        );
      } else {
        const insertFields = ['user_id', 'video_id', ...Object.keys(updateData)];
        const insertValues = [userId, videoId, ...Object.values(updateData)];

        await query(
          `INSERT INTO video_progress (${insertFields.join(', ')}) VALUES (${insertFields.map(() => '?').join(', ')})`,
          insertValues
        );
      }

      const updatedProgressQuery = `
        SELECT last_position_seconds, is_completed, completed_at, created_at, updated_at
        FROM video_progress
        WHERE user_id = ? AND video_id = ?
      `;
      const updatedProgress = await query(updatedProgressQuery, [userId, videoId]);

      res.json({
        message: 'Progress updated successfully',
        progress: updatedProgress[0]
      });
    } catch (error) {
      next(error);
    }
  },

  async getOverallProgress(req, res, next) {
    try {
      const userId = req.user.id;

      const enrolledSubjectsQuery = `
        SELECT s.id, s.title, s.slug, e.enrolled_at
        FROM subjects s
        JOIN enrollments e ON s.id = e.subject_id
        WHERE e.user_id = ? AND s.is_published = true
        ORDER BY e.enrolled_at DESC
      `;
      const subjects = await query(enrolledSubjectsQuery, [userId]);

      for (const subject of subjects) {
        const progressQuery = `
          SELECT 
            COUNT(v.id) as total_videos,
            COUNT(CASE WHEN vp.is_completed = true THEN 1 END) as completed_videos,
            SUM(v.duration_seconds) as total_duration,
            SUM(CASE WHEN vp.is_completed = true THEN v.duration_seconds ELSE vp.last_position_seconds END) as watched_duration
          FROM videos v
          JOIN sections s ON v.section_id = s.id
          LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
          WHERE s.subject_id = ?
        `;
        const [progress] = await query(progressQuery, [userId, subject.id]);
        
        subject.total_videos = progress.total_videos;
        subject.completed_videos = progress.completed_videos;
        subject.progress_percentage = progress.total_videos > 0 
          ? Math.round((progress.completed_videos / progress.total_videos) * 100)
          : 0;
        subject.total_duration_seconds = progress.total_duration || 0;
        subject.watched_duration_seconds = progress.watched_duration || 0;
      }

      const overallStats = subjects.reduce((acc, subject) => ({
        total_subjects: acc.total_subjects + 1,
        total_videos: acc.total_videos + subject.total_videos,
        completed_videos: acc.completed_videos + subject.completed_videos,
        total_duration: acc.total_duration + subject.total_duration_seconds,
        watched_duration: acc.watched_duration + subject.watched_duration_seconds
      }), {
        total_subjects: 0,
        total_videos: 0,
        completed_videos: 0,
        total_duration: 0,
        watched_duration: 0
      });

      overallStats.overall_progress_percentage = overallStats.total_videos > 0 
        ? Math.round((overallStats.completed_videos / overallStats.total_videos) * 100)
        : 0;

      res.json({
        subjects,
        overall_stats: overallStats
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = progressController;
