const dbConfig = require('../config/dbConfig')

const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAliases: false
    }
)

sequelize.authenticate()
.then(()=>{
    console.log('Database connection successful!...');
    
})
.catch((err)=>{
    console.log('Error'+ err);
    
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// db.students = require('./studentModel.js')(sequelize, DataTypes)
// db.courses = require('./courseModel.js')(sequelize, DataTypes)
// db.users = require('./authModel.js')(sequelize, DataTypes)
db.user = require('./usersModel.js')(sequelize, DataTypes)
db.courses = require('./courseModel.js')(sequelize, DataTypes)
db.assignment = require('./assignmentModel.js')(sequelize, DataTypes)
db.exam = require('./examModel.js')(sequelize, DataTypes)
// db.assignment = require('./assignmentModel.js')(sequelize, DataTypes)

db.sequelize.sync({force: false})
.then(()=>{
    console.log('re-sync done');
    
})

db.user.belongsTo(db.courses, {
    foreignKey: "course_id",  // Define the foreign key in the users table
    as: "course" // Define an alias
});

db.courses.hasMany(db.user, { 
    foreignKey: "course_id", 
    as: "user" // Define an alias
});

// In the Course hasMany association, change the alias to 'assignments' 
db.courses.hasMany(db.assignment, { foreignKey: 'course_id', as: 'assignments' });

// In the Assignment belongsTo association, keep the alias as 'course'
db.assignment.belongsTo(db.courses, { foreignKey: 'course_id', as: 'course' });

// Other relationships
db.assignment.belongsTo(db.user, { foreignKey: 'lecturer_id', as: 'lecturer' });
db.user.hasMany(db.assignment, { foreignKey: 'lecturer_id', as: 'assignments' });


// });

// db.courses.hasMany(db.user, { 
//     foreignKey: "course_id", 
//     as: "user" // Define an alias
// });


module.exports = db