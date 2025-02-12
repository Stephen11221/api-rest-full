const express = require('express');
const routes = express.Router()
const assignmentController = require('../controllers/assignmentController');
// const routes = require('./userRoute');

// Routes for Assignment operations

// Create a new assignment
routes.post('/addAssignment', assignmentController.addAssignment);

// Get all assignments
routes.get('/getAllAssignments', assignmentController.getAllAssignments);

// Get an assignment by ID
routes.get('/getAssignmentById:assignment_id', assignmentController.getAssignmentById);

// Update an assignment
routes.put('/updateAssignment:assignment_id', assignmentController.updateAssignment);

// Delete an assignment
routes.delete('/deleteAssignment:assignment_id', assignmentController.deleteAssignment);

// Get assignments by course ID
routes.get('/course/:course_id', assignmentController.getAssignmentsByCourse);

// Get assignments by lecturer ID
routes.get('/lecturer/:lecturer_id', assignmentController.getAssignmentsByLecturer);

module.exports = routes;  // Make sure to export 'router' correctly
