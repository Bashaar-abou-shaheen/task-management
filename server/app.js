const express = require('express');
const app =express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require("./routes/auth.js")
const adminTaskRoutes = require("./routes/adminTask.js")
const userTaskRoutes = require("./routes/userTask.js")
const chartRoutes = require("./routes/chart.js")
const scheduleRecurringTasks = require("./middleware/recurringTasks.js");

dotenv.config();

app.use(bodyParser.json());

const MONGODB_URI= process.env.MONGO_URI;

app.use((req, res,next)=>{      
    res.setHeader('Access-Control-Allow-Origin',"*")        // to make it work in all domain
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE')   // to make the methods work the other domain
    res.setHeader('Access-Control-Allow-Headers','Content-Type , Authorization')    // we need Authorization for token
    next();
})

app.use('/auth',authRoutes)
app.use('/admin-task',adminTaskRoutes)
app.use('/user-task',userTaskRoutes)
app.use('/chart',chartRoutes)

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message : message})
});

scheduleRecurringTasks();

mongoose.connect(MONGODB_URI)
    .then(()=>{
        app.listen(process.env.PORT)
    })
    .catch(err=>{
        console.log(err);
    });
