const express = require('express');
const examController = require('../controllers/examController');
const routes = express.Router()

const router = express.Router();

routes.post('/addExam', examController.addExam);
routes.get('/getAllExams', examController.getAllExams);
routes.get('/getExam:examId', examController.getExam);
routes.put('/updateExam:examId', examController.updateExam);
routes.delete('/deleteExam:examId', examController.deleteExam);
routes.get('/getAllExamsWithCourses/courses', examController.getAllExamsWithCourses);
routes.get('/getExamWithCourse:examId/course', examController.getExamWithCourse);

module.exports = router;
