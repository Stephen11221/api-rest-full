// Ensure the sequelize instance and DataTypes are correctly imported
const userModel = require('../models/userModel');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, // Validate email format
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("student", "lecturer"),
            defaultValue: "student",
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Courses', // Match the table name for the Course model
                key: 'id', // Match the primary key in the Course model
            },
        },
    }, {
        timestamps: true, // Ensure timestamps are enabled for createdAt and updatedAt
    });

    // Define associations
    User.associate = (models) => {
        User.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    };

    return User;
};
