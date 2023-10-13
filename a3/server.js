/********************************************************************************
* WEB322 – Assignment 03
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Farbod Moayeri Student ID: 134395227 Date: 2023-09-26
*
********************************************************************************/

const legoData = require("./public/js/legoSets");
const express = require('express'); 
const path = require('path');
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    })
    .catch(err => {
        console.log(err.message);
    });

app.use(express.static('public'));

app.get(['/', '/home', '/home.html'], (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '/views/home.html'));
    } catch (err) {
        res.status(404).send(err);
    }
    
});
app.get(['/about', '/about.html'], (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '/views/about.html'));
    } catch (err) {
        res.status(404).send(err);
    }
    
});
app.get('/lego/sets/', (req, res) => {

    const theme = req.query.theme;

    if(theme)
    {
        legoData.getSetsByTheme(theme)
            .then(data => {
                res.json(data);
            })
            .catch((err) => {
                res.status(404).send(err.message);
            })
    } else {
        legoData.getAllSets()
        .then(data => {
            res.send(data);
        })
        .catch((err) => {
            res.status(404).send(err.message);
        });
    }
});
app.get('/lego/sets/:num?', (req, res) => {
    const num = req.params.num
    legoData.getSetByNum(num)
        .then(data => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err.message);
        });
});
app.get('*', (req,res) => {
    try {
        res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
    } catch (err) {
        res.status(404).send(err.message);
    }
})
