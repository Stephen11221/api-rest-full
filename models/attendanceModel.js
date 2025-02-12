const { DataTypes } = require("sequelize");
const { sequelize } = require("./indexStart");
module.exports = (sequelize, DataTypes) => {
    const attendance = sequelize.define('attendance', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      present: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Student', // Ensure this matches your Student table name
          key: 'id',
        },
      },
      courseId: { // Changed from lessonId to courseId
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses', // Ensure this matches your Courses table name
          key: 'course_id', // Assuming 'course_id' is the primary key in the courses table
        },
      },
    });
  
  
    return attendance;
  };
  