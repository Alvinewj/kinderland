const uuid = require('uuid')
const bcrypt = require('bcrypt')
const SHA256 = require("crypto-js/sha256")
const StudentModel = require("../models/students")
const _ = require("lodash")
const ObjectId = require('mongoose').Types.ObjectId

const AdminModel = require('../models/admin')

const controllers = {

    showRegistrationForm: (req, res) => {
        res.render('admin/register', {
            pageTitle: 'Register as a Admin User'
            
        })
    },
    
    showLoginForm: (req, res) => {
        res.render('admin/login', {
            pageTitle: 'Admin Login'
        })
    },

    register: (req, res) => {
        // validate the users input
        // not implemented yet, try on your own
        
        StudentModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // if found in DB, means email has already been take, redirect to registration page
                if (result) {
                    res.redirect('/admin/register')
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
                StudentModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/admin/dashboard')
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
        StudentModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // check if result is empty, if it is, no user, so login fail, redirect to login page
                if (!result) {
                    console.log('err: no result')
                    res.redirect('/admin/login')
                    return
                }

                // combine DB user salt with given password, and apply hash algo
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    console.log('err: hash does not match')
                    res.redirect('/admin/login')
                    return
                }

                // login successful

                // set session user
                req.session.user = result

                res.redirect('/admin/dashboard')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/admin/login')
            })
    },


    dashboard: (req, res) => {
        StudentModel.find()
        .then(result => {
            res.render('admin/dashboard', {
                pageTitle: 'Dashboard',
                studentdata: result
                
             })
        }).catch(err => {
            console.log(err)
        })
    },

    newStudent: (req, res) => {

    
            res.render('admin/new', {
                pageTitle: 'New Student',
               
                
             })
      
    },
    
    createStudent: (req, res) => {
        const slug = _.kebabCase(req.body.name)
        
        StudentModel.create({
            name: req.body.student_name,
            age: req.body.student_age,
            gender: req.body.student_gender,
            address: req.body.student_address,
            "emergency contact": req.body.student_emergency_contact
        })
            .then(result => {
                res.redirect('/admin/dashboard')
                
            })
            .catch(err => {
                console.log(err)
                res.redirect('admin/new')
            })
    },

    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/admin/login')
    },

    delete: (req,res) => {
        console.log(req.params.id)
        console.log("in del route")

        
        StudentModel.findOneAndDelete({
          "_id": ObjectId(req.params.id)
            
        })
        .then(result => {
            res.redirect('/admin/dashboard')
            console.log(result)
        })
        .catch(err => {
            console.log(err)
            res.redirect('admin/dashboard')
        })
    },

    studentEditForm: (req, res) => {

        StudentModel.findOne({
            "_id": ObjectId(req.params.id)
        })
            .then(result => {
                if (! result) {
                    res.redirect('/admin/dashboard')
                    return
                }
                console.log(result)
                res.render('admin/edit', {
                    student: result
            
                 })
        })
    },
        updateStudent: (req, res) => {
            const newSlug = _.kebabCase(req.body.id)

            StudentModel.findOne ({

            "_id": ObjectId(req.params.id)

             })

            //  const firstName = 'chels'
            //  const lastName = 'ee'
            //  const fullName = firstName + lastName

            //  const string1 = '/admin/'
            //  const string3 = '/edit'

             
            //  const string4 = string1 + "jifrf8rfjrRFjirfr" + string3

            //  // /admin/jifrf8rfjrRFjirfr/edit

            StudentModel.updateOne ({

                "_id": ObjectId(req.params.id)

                         },
                         {
                        name: req.body.student_name,
                        age: req.body.student_age,
                        gender: req.body.student_gender,
                        address: req.body.student_address,
                        "emergency contact": req.body.student_emergency_contact
                    })
            
                    .then(updateResult => {
                        res.redirect('/admin/dashboard')
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/admin/' + req.params.id + '/edit')
                    })

    },
        
    }

module.exports = controllers