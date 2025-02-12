require('dotenv').config()

const express = require('express')
const userRoute = require('./routes/userRoute')
const courseRoute = require('./routes/courseRoute')
const assignmentRoute = require('./routes/assignmentRoute')
const examRoute = require('./routes/examRoute')
const app = express()

const helmet = require('helmet')
app.use(helmet())
const limit = require('express-rate-limit')
const limiter = limit({
    max: '100',
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests, please try again in an hour'
})

app.use('/api', limiter)

const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', userRoute)
app.use('/api', courseRoute)
app.use('/api', assignmentRoute)
app.use('/api', examRoute)

// error handling 
app.use((err, req, res, next) =>{
    if(err.status === 404){
        // Handle 401 Unauthorized error
        res.status(404).send({
            error:{
                status: 401,
                message: "Unauthorized: Invalid username/password"
            }
        });

    }
    else {
        // Handle other errors
        res.status(err.status || 500).send({
            error: {
                status: err.status || 500,
                message: err.message || "Internal Server Error"
            }
        });

    }
});

app.listen(process.env.port || 4000, function(){
    console.log('Server running on port Now  listening For request on: http://localhost:4000')
})