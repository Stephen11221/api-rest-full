const createError = require('http-errors')
const { where } = require('sequelize')
const something = require('../path/to/module');

const db = require('../models/indexStart')
const bcrypt = require('bcrypt')
const { signAccessToken, signRefreshToken } = require('../helpers/JWT')
const {authSchema} = require('../helpers/validationSchema')

const User = db.user;
// const Course = db.courses; 
const Course = db.courses; 
const Assignment = db.assignment;

module.exports = {
    register: async (req, res, next) => {
        try {
            // Destructure the necessary fields from the request body
            const { fullName, email, password, role, courseName } = await authSchema.validateAsync(req.body);
    
            // Check if the user already exists
            const exists = await User.findOne({ where: { email } });
            if (exists) {
                throw createError.Conflict(`${email} has already been sent to the database`);
            }
    
            // Find the course by courseName
            const course = await Course.findOne({ where: { courseName } });
    
            if (!course) {
                throw createError.NotFound("Course not found");
            }
    
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create the new user and link them to the course
            const newUser = await User.create({
                fullName,
                email,
                password: hashedPassword,
                role,
                course_id: course.course_id,  // Link the student to the course using course_id
            });
    
            // Log the newUser to check if the user_id is assigned
            console.log("Created User:", newUser);
    
            // Ensure user_id exists
            if (!newUser.user_id) {
                throw createError.InternalServerError("Failed to create user or assign user_id.");
            }
    
            // Generate an access token
            const accessToken = await signAccessToken(newUser.user_id);
            const refreshToken = await signRefreshToken(newUser.user_id);
    
            // Fetch the newly created user with course details
            const createdUser = await User.findOne({
                where: { user_id: newUser.user_id },
                include: [
                    {
                        model: Course,
                        as: 'course',  // Alias as defined in associations
                        attributes: ['courseName'],
                    },
                ],
            });
    
            // Respond with the created user and tokens
            res.status(201).send({ createdUser, accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    },
    
    
    
    getAllUser: async (req, res, next) =>{
        try{
            const user = await User.findAll({})
            res.status(200).send(user)
        }
        catch(error){
            next(error)
        }
    },


    getUserById: async (req, res, next) =>{
        try{
            const id = req.params.user_id
            const user = await  User.findOne({where: {user_id: id}})
            res.status(200).send(user)
        }
        catch(error){
            next(error)
        }
    },
    getStudentsByCourse: async (req, res, next) => {
        try {
            const course_id = req.params.course_id;  // This should extract the correct value from the URL
            console.log(`Looking for students in course ID: ${course_id}`);
            
            const students = await User.findAll({
                where: {
                    course_id: course_id,  // Using the actual course_id from the URL
                    role: 'student'  // Ensure role is set to 'student' in the database
                }
            });
    
            if (students.length === 0) {
                console.log('No students found for the provided course_id and role.');
            }
    
            res.status(200).send(students);
        } catch (error) {
            next(error);
        }
    },    
     getLecturersByCourse: async (req, res, next) => {
        try {
            const course_id = req.params.course_id;
            const lecturers = await User.findAll({
                where: {
                    role: 'lecturer',
                    course_id: course_id
                }
            });
            res.status(200).send(lecturers);
        } catch (error) {
            next(error);
        }
     },


    updateUser: async (req, res, next) => {
        try {
            const id = req.params.user_id;
    
            // Destructure the inputs from the request body
            const {  fullName, email, password, role, courseName } = req.body;
    
            // Prepare an object to hold the updated information
            const updatedInfo = {};
    
            // Validate and add email if provided
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw createError.BadRequest('Invalid email format');
                }
                updatedInfo.email = email;
            }
    
            // Validate and hash password if provided
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedInfo.password = hashedPassword;
            }
    
            // Validate and add role if provided
            if (role) {
                const validRoles = ['admin', 'user']; // Adjust based on your application roles
                if (!validRoles.includes(role)) {
                    throw createError.BadRequest('Invalid role specified');
                }
                updatedInfo.role = role;
            }
    
            // Ensure at least one field is being updated
            if (Object.keys(updatedInfo).length === 0) {
                throw createError.BadRequest('No valid fields provided for update');
            }
    
            // Update the user in the database
            const [affectedRows] = await User.update(updatedInfo, { where: { user_id: id } });
    
            if (!affectedRows) {
                throw createError.NotFound(`User with id ${id} is not registered`);
            }
    
            // Send a success response
            res.status(200).send({ message: `User with id ${id} has been updated successfully` });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req, res, next) => {
        try{
            const id = req.params.user_id
            const user = await  User.destroy({where: {user_id: id}})
            res.status(200).send(`user with id ${id} has been deleted`)
        }
        catch(error){
            next(error)
        }
    },


    login: async (req, res, next) => {
        try {
          console.log("Login request received:", req.body);
          const result = await authSchema.validateAsync(req.body);
          const user = await User.findOne({ where: { email: result.email } });
          if (!user) throw createError.NotFound("User Not Registered");
      
          const isMatch = await user.isValidPassword(result.password);
          if (!isMatch) throw createError.Unauthorized("Invalid username/password");
      
          const accessToken = await signAccessToken(user.user_id, user.role);
          const refreshToken = await signRefreshToken(user.user_id);
          console.log("Tokens generated:", { accessToken, refreshToken });
      
          res.send({ accessToken, refreshToken });
        } catch (error) {
          console.error("Login error:", error);
          if (error.isJoi === true) return next(createError.BadRequest("Invalid username/password"));
          next(error);
        }
      }


}