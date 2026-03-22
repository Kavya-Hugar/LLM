const axios = require('axios');
const { query } = require('../../config/database');
const config = require('../../config');

const aiController = {
  async chatWithTutor(req, res, next) {
    try {
      const { message, context, video_id } = req.body;
      const userId = req.user.id;

      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required' });
      }

      let videoContext = '';
      if (video_id) {
        const videoQuery = `
          SELECT v.title, v.description,
                 s.title as section_title,
                 sub.title as subject_title
          FROM videos v
          JOIN sections s ON v.section_id = s.id
          JOIN subjects sub ON s.subject_id = sub.id
          WHERE v.id = ?
        `;
        const videos = await query(videoQuery, [video_id]);
        
        if (videos.length > 0) {
          const video = videos[0];
          videoContext = `
Context: You are helping with a lesson from "${video.subject_title}" course.
Current lesson: "${video.title}" from section "${video.section_title}".
Lesson description: ${video.description || 'No description available'}.
`;
        }
      }

      const systemPrompt = `You are an AI tutor for an online learning platform. You are helpful, patient, and educational.
Your role is to help students understand concepts, answer questions, and provide explanations.
Keep your responses concise but thorough. Use simple language and provide examples when helpful.
${videoContext}

Student's question: ${message}`;

      if (!config.huggingfaceApiKey) {
        return res.status(503).json({ 
          error: 'AI service not available',
          message: 'Hugging Face API key not configured'
        });
      }

      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${config.huggingfaceModel}`,
          {
            inputs: systemPrompt,
            parameters: {
              max_length: 500,
              temperature: 0.7,
              do_sample: true,
              top_p: 0.9,
              return_full_text: false
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${config.huggingfaceApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        let aiResponse = '';
        if (response.data && response.data[0] && response.data[0].generated_text) {
          aiResponse = response.data[0].generated_text.trim();
        } else if (response.data && response.data.generated_text) {
          aiResponse = response.data.generated_text.trim();
        } else {
          aiResponse = 'I apologize, but I\'m having trouble processing your question right now. Please try again or rephrase your question.';
        }

        res.json({
          response: aiResponse,
          timestamp: new Date().toISOString()
        });

      } catch (huggingFaceError) {
        console.error('Hugging Face API error:', huggingFaceError.response?.data || huggingFaceError.message);
        
        if (huggingFaceError.response?.status === 429) {
          return res.status(429).json({ 
            error: 'AI service temporarily unavailable',
            message: 'Too many requests. Please try again in a moment.'
          });
        }

        if (huggingFaceError.response?.status === 401) {
          return res.status(503).json({ 
            error: 'AI service configuration error',
            message: 'Invalid API key configuration'
          });
        }

        res.status(503).json({ 
          error: 'AI service temporarily unavailable',
          message: 'Unable to connect to AI service. Please try again later.'
        });
      }

    } catch (error) {
      console.error('AI chat error:', error);
      next(error);
    }
  },

  async summarizeLesson(req, res, next) {
    try {
      const { video_id } = req.body;
      const userId = req.user.id;

      if (!video_id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const videoQuery = `
        SELECT v.title, v.description,
               s.title as section_title,
               sub.title as subject_title
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE v.id = ?
      `;
      const videos = await query(videoQuery, [video_id]);
      
      if (videos.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const video = videos[0];

      const enrollmentQuery = `
        SELECT id FROM enrollments
        WHERE user_id = ? AND subject_id = ?
      `;
      const enrollments = await query(enrollmentQuery, [userId, video.subject_title]);
      
      if (enrollments.length === 0) {
        return res.status(403).json({ error: 'Not enrolled in this subject' });
      }

      const prompt = `Please provide a concise summary of the following lesson:

Course: ${video.subject_title}
Section: ${video.section_title}
Lesson: ${video.title}
Description: ${video.description || 'No description available'}

Please provide:
1. A brief overview (2-3 sentences)
2. Key learning points (3-5 bullet points)
3. One practical application or example

Keep the summary educational and easy to understand.`;

      if (!config.huggingfaceApiKey) {
        return res.status(503).json({ 
          error: 'AI service not available',
          message: 'Hugging Face API key not configured'
        });
      }

      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/facebook/bart-large-cnn`,
          {
            inputs: prompt,
            parameters: {
              max_length: 300,
              min_length: 50,
              temperature: 0.7,
              do_sample: false
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${config.huggingfaceApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        let summary = '';
        if (response.data && response.data[0] && response.data[0].summary_text) {
          summary = response.data[0].summary_text.trim();
        } else {
          summary = `Summary for "${video.title}":

This lesson covers key concepts in ${video.subject_title}. Students will learn important principles and practical applications related to ${video.section_title}.

Key Learning Points:
• Understanding core concepts
• Practical applications
• Problem-solving techniques
• Best practices
• Real-world examples

This knowledge will help you apply what you've learned in practical scenarios.`;
        }

        res.json({
          video_id: parseInt(video_id),
          summary,
          generated_at: new Date().toISOString()
        });

      } catch (huggingFaceError) {
        console.error('Hugging Face API error:', huggingFaceError.response?.data || huggingFaceError.message);
        
        res.status(503).json({ 
          error: 'AI service temporarily unavailable',
          message: 'Unable to generate summary right now. Please try again later.'
        });
      }

    } catch (error) {
      console.error('AI summary error:', error);
      next(error);
    }
  },

  async generateQuiz(req, res, next) {
    try {
      const { video_id, question_count = 5 } = req.body;
      const userId = req.user.id;

      if (!video_id) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      if (question_count < 1 || question_count > 10) {
        return res.status(400).json({ error: 'Question count must be between 1 and 10' });
      }

      const videoQuery = `
        SELECT v.title, v.description,
               s.title as section_title,
               sub.title as subject_title
        FROM videos v
        JOIN sections s ON v.section_id = s.id
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE v.id = ?
      `;
      const videos = await query(videoQuery, [video_id]);
      
      if (videos.length === 0) {
        return res.status(404).json({ error: 'Video not found' });
      }

      const video = videos[0];

      const enrollmentQuery = `
        SELECT id FROM enrollments
        WHERE user_id = ? AND subject_id = ?
      `;
      const enrollments = await query(enrollmentQuery, [userId, video.subject_title]);
      
      if (enrollments.length === 0) {
        return res.status(403).json({ error: 'Not enrolled in this subject' });
      }

      const prompt = `Generate ${question_count} multiple choice questions based on this lesson:

Course: ${video.subject_title}
Section: ${video.section_title}
Lesson: ${video.title}
Description: ${video.description || 'No description available'}

Please create questions that test understanding of key concepts. Each question should have:
1. A clear question
2. 4 possible answers (A, B, C, D)
3. The correct answer indicated
4. A brief explanation

Format each question as JSON:
{
  "question": "Question text",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "correct_answer": "A",
  "explanation": "Brief explanation"
}

Return only the JSON array of questions.`;

      if (!config.huggingfaceApiKey) {
        return res.status(503).json({ 
          error: 'AI service not available',
          message: 'Hugging Face API key not configured'
        });
      }

      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium`,
          {
            inputs: prompt,
            parameters: {
              max_length: 1000,
              temperature: 0.8,
              do_sample: true
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${config.huggingfaceApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        let quizQuestions = [];
        
        try {
          const generatedText = response.data[0]?.generated_text || '';
          const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            quizQuestions = JSON.parse(jsonMatch[0]);
          }
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
        }

        if (quizQuestions.length === 0) {
          quizQuestions = [
            {
              question: `What is the main topic covered in "${video.title}"?`,
              options: [
                `A) ${video.subject_title}`,
                `B) ${video.section_title}`,
                `C) General programming`,
                `D) Advanced mathematics`
              ],
              correct_answer: "B",
              explanation: `This lesson specifically covers topics within ${video.section_title}.`
            },
            {
              question: `Which course does this lesson belong to?`,
              options: [
                `A) ${video.subject_title}`,
                `B) Computer Science 101`,
                `C) Advanced Mathematics`,
                `D) General Studies`
              ],
              correct_answer: "A",
              explanation: `The lesson is part of the ${video.subject_title} course.`
            }
          ];
        }

        res.json({
          video_id: parseInt(video_id),
          questions: quizQuestions.slice(0, question_count),
          generated_at: new Date().toISOString()
        });

      } catch (huggingFaceError) {
        console.error('Hugging Face API error:', huggingFaceError.response?.data || huggingFaceError.message);
        
        res.status(503).json({ 
          error: 'AI service temporarily unavailable',
          message: 'Unable to generate quiz questions right now. Please try again later.'
        });
      }

    } catch (error) {
      console.error('AI quiz error:', error);
      next(error);
    }
  }
};

module.exports = aiController;
