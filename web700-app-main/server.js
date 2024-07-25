/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Himanshu Parmar Student_ID: 146708235  Date: 7/25/24 
* Online (vercel) Link: ________________________________________________________
*
********************************************************************************/
require('pg'); // explicitly require the "pg" module
const exphbs = require('express-handlebars');
const Sequelize = require('sequelize');
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
var app = express();

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');


app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + 'public'));

const collegeData = require('./modules/collegeData');
app.set('views', __dirname + '/views');


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.hbs'));
});

app.get("/about", (req, res) => {
    res.render(path.join(__dirname, 'views', 'about.hbs'));
});

app.get("/htmlDemo", (req, res) => {
    res.render(path.join(__dirname, 'views', 'htmlDemo.hbs'));
});

app.get('/students/add', (req, res) => {
    res.render(path.join(__dirname, 'views', 'addStudent.hbs'));
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch(err => {
        res.status(500).send("Unable to add student");
    });
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: err });
            });
    } else {
        collegeData.getAllStudents()
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: "No results" });
            });
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => {
            res.json(tas);
        })
        .catch((err) => {
            res.json({ message: "No results" });
        });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, ()=> {console.log("Server listening on port "+ HTTP_PORT)});
    })
    .catch((err) => {
        console.error(err);
    });