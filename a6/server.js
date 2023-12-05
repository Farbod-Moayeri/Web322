/******************************************************************************** 
*  WEB322 – Assignment 05
*  
*  I declare that this assignment is my own work in accordance with Seneca's 
*  Academic Integrity Policy: 
*  
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html 
*  
*  Name: Farbod Moayeri Student ID: 134395227 Date: 2023-11-17
* 
*  Published URL: https://crazy-waders-ant.cyclic.app/
* 
********************************************************************************/ 

const legoData = require("./public/js/legoSets");
const authData = require("./public/js/auth-service");
const express = require('express'); 
const clientSessions = require('client-sessions');
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

legoData.initialize()
.then(authData.initialize)
.then(() => {
    app.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`Server started on port ${HTTP_PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize database:", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
    clientSessions({
      cookieName: 'session', // this is the object name that will be added to 'req'
      secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
      duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
      activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    })
);

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
}

app.set('view engine', 'ejs');

app.get(['/', '/home', '/home.html'], (req, res) => {
    try {
        res.render("home");
    } catch (err) {
        res.status(404).send(err);
    }
    
});
// ---------------------------------------------------------------------------------------------------------------
app.get('/login', (req, res) => {
    res.render("login");
});
app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    authData.checkUser(req.body)
    .then((user) => {
        req.session.user = {
            userName: user.UserName,
            email: user.email,
            loginHistory: user.loginHistory,
        }
        res.redirect('/lego/sets');
    })
    .catch((err) => {
        res.render("login", {errorMessage: err, userName:req.body.userName });
    });
});
// ---------------------------------------------------------------------------------------------------------------
app.get('/register', (req,res) => {
    res.render("register");
});
app.post('/register', (req, res) => {
    authData.registerUser(req.body)
    .then(() => {
        res.render("register", {successMessage: "User created"});
    })
    .catch((err) => {
        res.render("register", {errorMessage: err, userName:req.body.userName});
    });
});
// ----------------------------------------------------------------------------------------------------------------
app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect("/");
})
// ----------------------------------------------------------------------------------------------------------------
app.get('/userHistory', ensureLogin, (req, res) => {
    res.render("userHistory");
});
// ----------------------------------------------------------------------------------------------------------------
app.get(['/lego/addSet', '/lego/addSet.html'], ensureLogin ,(req, res) => {
    legoData.getAllThemes()
    .then(themes => {
        res.render("addSet", {themes});
    })
    .catch (err => {
        res.render("500", { message: `Error fetching themes: ${err}` });
    })
    
});
app.post('/lego/addSet', ensureLogin ,(req, res) => {
    legoData.addSet(req.body)
    .then(() => {
        res.redirect('/lego/sets');
    })
    .catch(err => {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});
// ------------------------------------------------------------------------------------------------------
app.get('/lego/editSet/:num', ensureLogin ,(req, res) => {
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
app.post('/lego/editSet', ensureLogin ,(req, res) => {
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
// ----------------------------------------------------------------------------------------------------
app.post('/lego/deleteSet/:num', ensureLogin ,(req,res) => {
    const setNum = req.params.num;
    legoData.deleteSet(setNum)
        .then(() => {
            res.redirect('/lego/sets');
        })
        .catch((err) => {
            res.render("500", {message: `I'm sorry, but we have encountered the following error: ${err}`});
        });

});
// ---------------------------------------------------------------------------------------------------
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
