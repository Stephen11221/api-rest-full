const { DataTypes } = require("sequelize");
const { sequelize } = require("./indexStart");

module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define('Submission', {
        submission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        assignment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Assignments', // Ensure this matches the name of your Assignments table
                key: 'assignment_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        student_id: { // Renamed from user_id to student_id for clarity
            type: DataTypes.INTEGER,
            references: {
                model: 'Users', // Ensure this matches the name of your Users table
                key: 'id', // Assuming 'id' is the primary key for Users
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        submission_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING,
            allowNull: false, // This could store the file URL of the student’s submission
        },
    });

    Submission.associate = (models) => {
        // Each submission is made by a student (user)
        Submission.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });

        // Each submission is for a specific assignment
        Submission.belongsTo(models.Assignment, { foreignKey: 'assignment_id', as: 'assignment' });
    };

    return Submission;
};
