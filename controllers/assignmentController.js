const createError = require('http-errors');
const db = require('../models/indexStart'); // Ensure this points to your Sequelize models
const Assignment = db.assignment;
const Course = db.courses; 
const User = db.user;

module.exports = {
    // Create a new assignment
    addAssignment: async (req, res, next) => {
        try {
            const { title, description, due_date, file_url, course_id, lecturer_id } = req.body;

            // Validate required fields
            if (!title || !due_date || !file_url || !course_id || !lecturer_id) {
                throw createError.BadRequest("Missing required fields");
            }

            // Create a new assignment
            const newAssignment = await Assignment.create({
                title,
                description,
                due_date,
                file_url,
                course_id,
                lecturer_id,
            });

            res.status(201).json({
                message: "Assignment created successfully",
                assignment: newAssignment,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all assignments
    getAllAssignments: async (req, res, next) => {
        try {
            const assignments = await Assignment.findAll({
                include: [
                    { model: Course, as: 'course', attributes: ['courseName'] },
                    { model: User, as: 'lecturer', attributes: ['fullName', 'email'] },
                ],
            });

            res.status(200).json(assignments);
        } catch (error) {
            next(error);
        }
    },

    // Get an assignment by ID
    getAssignmentById: async (req, res, next) => {
        try {
            const { assignment_id } = req.params;

            const assignment = await Assignment.findOne({
                where: { assignment_id },
                include: [
                    { model: Course, as: 'course', attributes: ['courseName'] },
                    { model: User, as: 'lecturer', attributes: ['fullName', 'email'] },
                ],
            });

            if (!assignment) throw createError.NotFound("Assignment not found");

            res.status(200).json(assignment);
        } catch (error) {
            next(error);
        }
    },

    // Update an assignment
    updateAssignment: async (req, res, next) => {
        try {
            const { assignment_id } = req.params;
            const { title, description, due_date, file_url, course_id, lecturer_id } = req.body;

            const updatedFields = { title, description, due_date, file_url, course_id, lecturer_id };

            // Remove undefined values
            Object.keys(updatedFields).forEach(key => {
                if (updatedFields[key] === undefined) delete updatedFields[key];
            });

            const [updatedRows] = await Assignment.update(updatedFields, { where: { assignment_id } });

            if (updatedRows === 0) throw createError.NotFound("Assignment not found or no changes made");

            res.status(200).json({ message: "Assignment updated successfully" });
        } catch (error) {
            next(error);
        }
    },

    // Delete an assignment
    deleteAssignment: async (req, res, next) => {
        try {
            const { assignment_id } = req.params;

            const deletedRows = await Assignment.destroy({ where: { assignment_id } });

            if (deletedRows === 0) throw createError.NotFound("Assignment not found");

            res.status(200).json({ message: "Assignment deleted successfully" });
        } catch (error) {
            next(error);
        }
    },

    // Get assignments by course ID
    getAssignmentsByCourse: async (req, res, next) => {
        try {
            const { course_id } = req.params;

            const assignments = await Assignment.findAll({
                where: { course_id },
                include: [
                    { model: User, as: 'lecturer', attributes: ['fullName', 'email'] },
                ],
            });

            res.status(200).json(assignments);
        } catch (error) {
            next(error);
        }
    },

    // Get assignments by lecturer ID
    getAssignmentsByLecturer: async (req, res, next) => {
        try {
            const { lecturer_id } = req.params;

            const assignments = await Assignment.findAll({
                where: { lecturer_id },
                include: [
                    { model: Course, as: 'course', attributes: ['courseName'] },
                ],
            });

            res.status(200).json(assignments);
        } catch (error) {
            next(error);
        }
    },
};
