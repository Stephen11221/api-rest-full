const db = require('../models/indexStart');
const createError = require('http-errors');

const Exam = db.Exam; // Sequelize Exam model
const Course = db.courses; // Sequelize Course model

module.exports = {
  // Add a new exam
  addExam: async (req, res, next) => {
    try {
      const { title, startTime, endTime, courseId } = req.body;

      // Check if the course exists before creating an exam
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw createError(404, 'Course not found');
      }

      // Create a new exam linked to a course by courseId
      const newExam = await Exam.create({ title, startTime, endTime, courseId });

      res.status(201).send(newExam);
    } catch (error) {
      next(error);
    }
  },

  // Get all exams
  getAllExams: async (req, res, next) => {
    try {
      const exams = await Exam.findAll({
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'description'],
          },
        ],
      });

      res.status(200).send(exams);
    } catch (error) {
      next(error);
    }
  },

  // Get a single exam by ID
  getExam: async (req, res, next) => {
    try {
      const { examId } = req.params;

      const exam = await Exam.findOne({
        where: { id: examId },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'description'],
          },
        ],
      });

      if (!exam) {
        throw createError(404, 'Exam not found');
      }

      res.status(200).send(exam);
    } catch (error) {
      next(error);
    }
  },

  // Update an exam by ID
  updateExam: async (req, res, next) => {
    try {
      const { examId } = req.params;
      const { title, startTime, endTime, courseId } = req.body;

      // Check if the provided courseId exists
      if (courseId) {
        const course = await Course.findByPk(courseId);
        if (!course) {
          throw createError(404, 'Course not found');
        }
      }

      // Update the exam
      const [updated] = await Exam.update(
        { title, startTime, endTime, courseId },
        { where: { id: examId } }
      );

      if (updated === 0) {
        throw createError(404, 'Exam not found or no changes made');
      }

      // Fetch the updated exam
      const updatedExam = await Exam.findOne({
        where: { id: examId },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'description'],
          },
        ],
      });

      res.status(200).send(updatedExam);
    } catch (error) {
      next(error);
    }
  },

  // Delete an exam by ID
  deleteExam: async (req, res, next) => {
    try {
      const { examId } = req.params;

      const deleted = await Exam.destroy({ where: { id: examId } });

      if (!deleted) {
        throw createError(404, 'Exam not found');
      }

      res.status(200).send({ message: `Exam with ID ${examId} has been deleted` });
    } catch (error) {
      next(error);
    }
  },

  // Get all exams with their associated courses
  getAllExamsWithCourses: async (req, res, next) => {
    try {
      const exams = await Exam.findAll({
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'description'],
          },
        ],
      });

      res.status(200).send(exams);
    } catch (error) {
      next(error);
    }
  },

  // Get a specific exam with its associated course
  getExamWithCourse: async (req, res, next) => {
    try {
      const { examId } = req.params;

      const exam = await Exam.findOne({
        where: { id: examId },
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'description'],
          },
        ],
      });

      if (!exam) {
        throw createError(404, 'Exam not found');
      }

      res.status(200).send(exam);
    } catch (error) {
      next(error);
    }
  },
};
