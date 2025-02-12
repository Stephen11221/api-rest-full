// models/assignment.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("./indexStart");
module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
        assignment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: false, // This could store the URL of the uploaded PDF or file
        },
        course_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'courses', // Match table name
                key: 'course_id', // Match primary key
            },
            onDelete: 'CASCADE', // Optional: Ensures dependent rows are deleted
            onUpdate: 'CASCADE',
        },
        lecturer_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users', // Match table name
                key: 'id', // Match primary key
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });

    Assignment.associate = (models) => {
        // Each assignment belongs to one course
        Assignment.belongsTo(models.Course, { foreignKey: 'course_id' });

        // Each assignment is assigned by one lecturer (user)
        Assignment.belongsTo(models.User, { foreignKey: 'lecturer_id' });

        // Each student can submit many assignments, but one assignment can belong to many students
        Assignment.belongsToMany(models.User, {
            through: 'Submissions',
            foreignKey: 'assignment_id',
            as: 'students',
        });
    };

    return Assignment;
};
