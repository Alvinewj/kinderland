// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser'); 
const React = require("react");
const ReactDOM = require("react-dom");
const AdminController = require('./controllers/AdminController')
const StudentsController = require('./controllers/StudentsController')
const UsersController = require('./controllers/UsersController')
const app = express();
const port = process.env.PORT || 8888;

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(express.urlencoded({
  extended: true
}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))
app.use(setUserVarMiddleware)

// ++++++++++++++++
// Admin ROUTES
// ++++++++++++++++

//admin registration form route
app.get('/admin/register', adminMiddleWare, AdminController.showRegistrationForm)

//admin registration 
app.post('/admin/register', adminMiddleWare, AdminController.register)

//admin login route
app.get('/admin/login', adminMiddleWare, AdminController.showLoginForm)

//admin logout route
app.get('/admin/logout', adminMiddleWare, AdminController.logout)


//+++++++++++++++++++
// ADMIN ONLY ROUTE
//+++++++++++++++++++

// user dashboard route
app.get('/admin/dashboard', authenticatedAdminMiddleware, AdminController.dashboard)

//user logout route
app.get('/admin/logout', authenticatedAdminMiddleware, AdminController.logout)


// +++++++++++++
// USER ROUTE
// +++++++++++++

// user registration form route
app.get('/users/register', guestMiddleWare, UsersController.showRegistrationForm)

// user registration
app.post('/users/register', guestMiddleWare, UsersController.register)

// user login form route
app.get('/users/login', guestMiddleWare, UsersController.showLoginForm)

// user login route
app.post('/users/login', guestMiddleWare, UsersController.login)



// ++++++++++++++++
// USER ONLY ROUTE
// ++++++++++++++++

// user dashboard route
app.get('/users/dashboard', authenticatedOnlyMiddleware, UsersController.dashboard)

//user logout route
app.get('/users/logout', authenticatedOnlyMiddleware, UsersController.logout)




// connect to DB, then initiate Express app
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')

    app.listen(process.env.PORT || port, () => {
      console.log(`KinderLand app listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
  })

  function guestMiddleWare(req, res, next) {

    if(req.session && req.session.user) {
      res.redirect('/users/dashboard')
      return
  }
    next()

  }
  function adminMiddleWare(req, res, next) {

    if(req.session && req.session.user) {
      res.redirect('/admin/admindashboard')
      return
  }
    next()

  }

  function authenticatedAdminMiddleware(req, res, next) {
    if ( ! req.session || ! req.session.user ) {
      res.redirect('/admin/adminlogin')
      return
    }
  
    next()
  }

  function authenticatedOnlyMiddleware(req, res, next) {
    if ( ! req.session || ! req.session.user ) {
      res.redirect('/users/login')
      return
    }
  
    next()
  }

  function setUserVarMiddleware(req, res, next) {
    // default user template var set to null
    res.locals.user = null
  
    // check if req.session.user is set,
    // if set, template user var will be set as well
    if (req.session && req.session.user) {
      res.locals.user = req.session.user
    }
   
    next()
  }


  
