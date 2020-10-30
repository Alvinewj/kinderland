const uuid = require('uuid')
const bcrypt = require('bcrypt')
const SHA256 = require("crypto-js/sha256")


const AdminModel = require('../models/admin')

const controllers = {

    showRegistrationForm: (req, res) => {
        res.render('admin/adminregister', {
            pageTitle: 'Register as a Admin User'

        })
    },
    
    showLoginForm: (req, res) => {
        res.render('admin/adminlogin', {
            pageTitle: 'Admin Login'
        })
    },

    register: (req, res) => {
        // validate the users input
        // not implemented yet, try on your own

        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // if found in DB, means email has already been take, redirect to registration page
                if (result) {
                    res.redirect('/admin/adminregister')
                    return
                }

                // no document found in DB, can proceed with registration

                // generate uuid as salt
                 const salt = uuid.v4()

                // hash combination using bcrypt
                const combination = salt + req.body.password

                // hash the combination using SHA256
                const hash = SHA256(combination).toString()

                // create user in DB
                UserModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/admin/admindashboard')
                    })
                    .catch(err => {
                        res.redirect('/admin/register')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/admin/register')
            })
    },

    login: (req, res) => {
        // validate input here on your own

        // gets user with the given email
        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // check if result is empty, if it is, no user, so login fail, redirect to login page
                if (!result) {
                    console.log('err: no result')
                    res.redirect('/admin/adminlogin')
                    return
                }

                // combine DB user salt with given password, and apply hash algo
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    console.log('err: hash does not match')
                    res.redirect('/admin/adminlogin')
                    return
                }

                // login successful

                // set session user
                req.session.user = result

                res.redirect('/admin/admindashboard')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/admin/adminlogin')
            })
    },

    dashboard: (req, res) => {
        res.render('admin/admindashboard', {
            pageTitle: 'Admin Dashboard'
        })
    },

    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/admin/adminlogin')
    }

}



module.exports = controllers