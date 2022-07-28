const router = require('express').Router();

const User = require('../model/User');
//const Teacher = require('../model/Teacher');
//const Exam = require('../model/Exam');

const {registerValidation} = require('../validation');
const {loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { listenerCount } = require('../model/User');

const jwtauth = require('../middleware/jwtauth');



/*
Called for signing up
 -> send all info that were in the User schema
 in form: 
 
        for firstName -> req.body.firstName,
        for lastName -> req.body.lastName,
        for email -> req.body.email,
        for password -> req.body.password,
        for teacherMode -> req.body.teacherMode,
        for teacherPass -> secret,
        for about: null,
        for registrationNo -> req.body.registrationNo (if not a teacher)


call it using:  localhost:3000/signUp
*/

router.post('/signUp', async (req,res) => {
    console.log("sign UP");
    returned = await registerValidation(req.body);
    if(returned[0] == 0) {
        return res.status(206).json(returned[1]);
    }
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) {
        return res.status(406).json('User already exists');
    }
    hashedPass = 0;
    await bcrypt.hash(req.body.password, 10).then(function(hash) {
        hashedPass = hash;
    });
    var secret = "";
    if(req.body.teacherMode) {
        secret = req.body.teacherPass
        if(secret != process.env.TEACHER_SECRET) {
            return res.status(401).json("Teacher secret is not correct");
        }
    }

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPass,
        teacherMode: req.body.teacherMode,
        teacherPass: secret,
        about: null,
        registrationNo: req.body.registrationNo,
    });

    try {
        await user.save();
        return res.status(200).json('Registration complete');
    }catch(err) {
        return res.status(404).json('Error registering');
    }
});



/*

sends login information when user tries to log in

sends data in form:
    email -> req.body.email
    password -> req.body.password


call it using:

localhost:3000/logIn
    
*/

router.post('/logIn' , async (req, res) => {
    returned = await loginValidation(req.body);
    if(returned[0] == 0) {
        return res.status(206).json(returned[1]);
    }
    const user = await User.findOne({email : req.body.email}); /// registration number working as primary key
    if(!user) {
        return res.status(404).json('No such user!');
    }

    match = false;
    await bcrypt.compare(req.body.password, user.password).then(function(result) {
        match = result;
    });

    if(!match) {
        return res.status(403).json('Password not matched');
    }

    Role = ""
    if(user.teacherMode == true) {
        Role = "teacher"
    }
    else {
        Role = "student"
    }

    try {
        const payload = {
            ...user.toObject(),
            role: Role
        }
    
        jwt.sign(
            payload, 
            process.env.TOKEN_SECRET,
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.status(200).json({
                    ...payload,
                    token: token, 
                    email: req.body.email ,
                    teacherMode: user.teacherMode
                }); /// sends the feedback with token
            }
        );
       // res.status(200).json({user});
    } catch(err) {
         //return res.render('404');
        res.status(404).json('Error logging in'); /// sends error if error occurs
    }

});



// ERASE below


module.exports = router;