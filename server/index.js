const express = require("express")
const ConfigInitial = require("./configs.js")
const {body, query, check} = require('express-validator');
const services = require('./servises.js')
const server = express()
const Hand = require('./hands/hands.js');

server.listen(3000, () => console.log("Server listen on port 3000"))

//MIDS------------------------------------:
ConfigInitial(server, express)
server.use((req, res, next) => {
    console.log("pryflight")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

//ROUTER----------------------------------:

server.get('/songs', Hand.Home)

server.get('/songs/filter', Hand.filteredSongs)

server.post('/register',

    body('email').trim()
        .isLength({min: 1})
        .withMessage('Email length must be more then 1 chars long!').bail()
        .isEmail()
        .withMessage('Not a valid Email!').bail()
        .normalizeEmail()
        .custom(async(value) => {
            const userExist = await services.userExist(value, 'email')
            if (userExist){
                throw new Error('This email is taken!')
            }
            return true
        })
    ,

    body('username').trim()
        .isLength({min: 2})
        .withMessage('Username length must be more then 2 chars long!').bail()
        .custom((value) => {
            const result =  value.match(/^[a-zA-Z0-9]+$/g)
            return result.length == 0? false:true
        })
        .withMessage("Username must contains only letters and numbers!").bail()
        .custom(async(value) => {
            const userExist = await services.userExist(value)
            if (userExist){
                throw new Error('This username is taken!')
            }
            return true
        })
    ,

    body('password').trim()
        .isLength({min: 1})
        .withMessage('Password length must be more then 1 chars long!').bail()
        .custom((value) => {
            const result =  value.match(/^[a-zA-Z0-9]+$/g)
            return result.length == 0? false:true
        })
        .withMessage("Passwords must contains only letters and numbers!").bail()
        .custom((value, {req}) => {
            return value != req.body.reppassword.trim()? false:true
        }).withMessage("Passwords DO NOT match!")
    ,   
    Hand.RegisterUser
)

server.post('/login/user',
    body('email').trim()
        .custom(async(value, {req}) => {
            const userExist = await services.userExist(value, "email")
           
            if (!userExist){
                throw new Error('User do Not Exist!')
            }
            const result = await services.ComparePasswords(req.body.password.trim(), userExist.password)
            
            if (!result){
                throw new Error('Email and Password do not match!')
            }
            return true
        })
    ,
    
    Hand.LoginUser
)

server.post('/user/create/song', Hand.CreateSong)

server.get('/user/songs', Hand.GetUserSongs)

server.get('/delete*', Hand.DeleteSong)
    
server.post('/edit*', Hand.editSong)

server.get('/edit*', Hand.getSong)