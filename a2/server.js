/********************************************************************************
* WEB322 – Assignment 02
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: Farbod Moayeri Student ID: 134395227 Date: 2023-09-26
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express'); 
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
    })
    .catch(err => {
        console.log(err.message);
    })

app.get('/', (req, res) => {
    res.send('Assignment 2: Farbod Moayeri - 134395227')
});
app.get('/lego/sets', (req, res) => {
    legoData.getAllSets()
        .then(data => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err.message);
        });
});
app.get('/lego/sets/num-demo', (req, res) => {
    legoData.getSetByNum(371)
        .then(data => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err.message);
        });
});
app.get('/lego/sets/theme-demo', (req, res) => {
    legoData.getSetsByTheme('technic')
        .then(data => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err.message);
        });
});