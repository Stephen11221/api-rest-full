const { DataTypes } = require("sequelize");
const { sequelize } = require("./indexStart");
module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define('Exam', {
      exam_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER, // Duration in minutes
        allowNull: false,
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses', // Ensure this matches your Courses table name
          key: 'course_id', // Assuming 'course_id' is the primary key in the Courses table
        },
      },
    });
  
    // Associations
    Exam.associate = (models) => {
      // An exam belongs to one course
      Exam.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  
      // Many-to-many relationship between exams and students
      Exam.belongsToMany(models.Student, {
        through: 'ExamResults', // Define a junction table for storing results
        foreignKey: 'exam_id',
        as: 'students',
      });
    };
  
    return Exam;
  };
  