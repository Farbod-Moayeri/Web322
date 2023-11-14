/******************************************************************************** 
*  WEB322 – Assignment 03 
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: Farbod Moayeri Student ID: 134395227 Date: 2023-10-30
* 
*  Published URL: https://crazy-waders-ant.cyclic.app/
* 
********************************************************************************/ 

const legoData = require("./public/js/legoSets");
const express = require('express'); 
const path = require('path');
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server started on port ${HTTP_PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize database:", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get(['/', '/home', '/home.html'], (req, res) => {
    try {
        res.render("home");
    } catch (err) {
        res.status(404).send(err);
    }
    
});

app.get(['/', '/lego/addSet', '/lego/addSet.html'], (req, res) => {
    legoData.getAllThemes()
    .then(themes => {
        res.render("addSet", {themes});
    })
    .catch (err => {
        res.render("500", { message: `Error fetching themes: ${err}` });
    })
    
});
app.post('/lego/addSet', (req, res) => {
    legoData.addSet(req.body)
    .then(() => {
        res.redirect('/lego/sets');
    })
    .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});

app.get('/lego/editSet/:num', (req, res) => {
    const setNum = req.params.num;
    
    Promise.all([
        legoData.getSetByNum(setNum),
        legoData.getAllThemes()
    ])
    .then(([setData, themeData]) => {
        res.render("editSet", { set: setData, themes: themeData });
    })
    .catch(err => {
        res.status(404).render("404", { message: err });
    });
});
app.post('/lego/editSet', (req, res) => {
    const setNum = req.body.set_num;
    const setData = req.body;

    legoData.editSet(setNum, setData)
    .then(() => {
        res.redirect('/lego/sets');
    })
    .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});

app.get(['/about', '/about.html'], (req, res) => {
    try {
        res.render("about");
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
                res.render("sets", {sets: data})
            })
            .catch((err) => {
                res.status(404).render("404", {message: "Unable to find requested sets."});
            })
    } else {
        
        legoData.getAllSets()
        .then(data => {
            res.render("sets", {sets: data});
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
            res.render("set", {set: data});
        })
        .catch((err) => {
            res.status(404).render("404", {message: "Unable to find requested set."});
        });
});
app.get('*', (req,res) => {
    try {
        res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
    } catch (err) {
        res.status(404).send(err.message);
    }
})
