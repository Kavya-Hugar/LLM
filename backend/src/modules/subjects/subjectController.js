const { query } = require('../../config/database');
const { generateSlug } = require('../../utils/helpers');

const subjectController = {
  async getAllSubjects(req, res, next) {
    try {
      const { published_only = 'true' } = req.query;
      
      let subjectsQuery = `
        SELECT id, title, slug, description, is_published, created_at, updated_at
        FROM subjects
      `;
      
      const queryParams = [];
      
      if (published_only === 'true') {
        subjectsQuery += ' WHERE is_published = true';
      }
      
      subjectsQuery += ' ORDER BY created_at DESC';
      
      const subjects = await query(subjectsQuery, queryParams);

      for (const subject of subjects) {
        const sectionsQuery = `
          SELECT COUNT(*) as section_count
          FROM sections
          WHERE subject_id = ?
        `;
        const [sectionCount] = await query(sectionsQuery, [subject.id]);
        subject.section_count = sectionCount.section_count;

        const videosQuery = `
          SELECT COUNT(*) as video_count
          FROM videos v
          JOIN sections s ON v.section_id = s.id
          WHERE s.subject_id = ?
        `;
        const [videoCount] = await query(videosQuery, [subject.id]);
        subject.video_count = videoCount.video_count;
      }

      res.json({
        subjects
      });
    } catch (error) {
      next(error);
    }
  },

  async getSubjectById(req, res, next) {
    try {
      const { subjectId } = req.params;
      
      const subjectQuery = `
        SELECT id, title, slug, description, is_published, created_at, updated_at
        FROM subjects
        WHERE id = ?
      `;
      const subjects = await query(subjectQuery, [subjectId]);
      
      if (subjects.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const subject = subjects[0];

      const sectionsQuery = `
        SELECT id, title, order_index, created_at, updated_at
        FROM sections
        WHERE subject_id = ?
        ORDER BY order_index ASC
      `;
      const sections = await query(sectionsQuery, [subjectId]);

      for (const section of sections) {
        const videosQuery = `
          SELECT id, title, description, youtube_url, order_index, duration_seconds, created_at, updated_at
          FROM videos
          WHERE section_id = ?
          ORDER BY order_index ASC
        `;
        const videos = await query(videosQuery, [section.id]);
        section.videos = videos;
        section.video_count = videos.length;
      }

      subject.sections = sections;
      subject.section_count = sections.length;
      
      const totalVideosQuery = `
        SELECT COUNT(*) as total_videos
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        WHERE s.subject_id = ?
      `;
      const [totalVideos] = await query(totalVideosQuery, [subjectId]);
      subject.video_count = totalVideos.total_videos;

      if (req.user) {
        const enrollmentQuery = `
          SELECT id, enrolled_at
          FROM enrollments
          WHERE user_id = ? AND subject_id = ?
        `;
        const enrollments = await query(enrollmentQuery, [req.user.id, subjectId]);
        subject.is_enrolled = enrollments.length > 0;
        subject.enrolled_at = enrollments.length > 0 ? enrollments[0].enrolled_at : null;
      } else {
        subject.is_enrolled = false;
        subject.enrolled_at = null;
      }

      res.json({
        subject
      });
    } catch (error) {
      next(error);
    }
  },

  async getSubjectTree(req, res, next) {
    try {
      const { subjectId } = req.params;
      
      const subjectQuery = `
        SELECT id, title, slug, description, is_published
        FROM subjects
        WHERE id = ?
      `;
      const subjects = await query(subjectQuery, [subjectId]);
      
      if (subjects.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const subject = subjects[0];

      const sectionsQuery = `
        SELECT id, title, order_index
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
      }

      subject.sections = sections;

      res.json({
        subject
      });
    } catch (error) {
      next(error);
    }
  },

  async enrollInSubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      const userId = req.user.id;

      const subjectQuery = 'SELECT id, is_published FROM subjects WHERE id = ?';
      const subjects = await query(subjectQuery, [subjectId]);
      
      if (subjects.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      if (!subjects[0].is_published) {
        return res.status(400).json({ error: 'Cannot enroll in unpublished subject' });
      }

      const enrollmentQuery = `
        SELECT id FROM enrollments 
        WHERE user_id = ? AND subject_id = ?
      `;
      const existingEnrollments = await query(enrollmentQuery, [userId, subjectId]);
      
      if (existingEnrollments.length > 0) {
        return res.status(409).json({ error: 'Already enrolled in this subject' });
      }

      const insertEnrollmentQuery = `
        INSERT INTO enrollments (user_id, subject_id)
        VALUES (?, ?)
      `;
      await query(insertEnrollmentQuery, [userId, subjectId]);

      res.status(201).json({
        message: 'Successfully enrolled in subject',
        subject_id: parseInt(subjectId)
      });
    } catch (error) {
      next(error);
    }
  },

  async getEnrolledSubjects(req, res, next) {
    try {
      const userId = req.user.id;
      
      const enrolledQuery = `
        SELECT s.id, s.title, s.slug, s.description, s.created_at, s.updated_at,
               e.enrolled_at
        FROM subjects s
        JOIN enrollments e ON s.id = e.subject_id
        WHERE e.user_id = ? AND s.is_published = true
        ORDER BY e.enrolled_at DESC
      `;
      const subjects = await query(enrolledQuery, [userId]);

      for (const subject of subjects) {
        const progressQuery = `
          SELECT 
            COUNT(v.id) as total_videos,
            COUNT(CASE WHEN vp.is_completed = true THEN 1 END) as completed_videos
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
      }

      res.json({
        subjects
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = subjectController;
