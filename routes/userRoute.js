const express = require('express');
const routes = express.Router()
// const userControllers = require('../controllers/userControllers')
const userControllers = require('../controllers/userControllers');


routes.post('/register', userControllers.register)
routes.get('/getAllUser', userControllers.getAllUser)
routes.get('/getUserById/:user_id', userControllers.getUserById)
routes.patch('/updateUser', userControllers.updateUser)
routes.delete('/deleteUser', userControllers.deleteUser)
routes.post('/login', userControllers.login)
// routes.get('/getStudentsByCourse/:student', userControllers.getStudentsByCourse)
// routes.get('/getLecturersByCourse', userControllers.getLecturersByCourse)
routes.get('/students/by-course/:course_id', userControllers.getStudentsByCourse);
routes.get('/lecturers/by-course/:course_id',userControllers.getLecturersByCourse);

module.exports = routes