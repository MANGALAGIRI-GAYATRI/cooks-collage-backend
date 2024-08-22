const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
//get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if (!users) {
            return res.status(200).send({
                success: false,
                message: "No users found",
            })
        }
        return res.status(200).send({
            success: true,
            BlogCount: users.length,
            message: "All USers lists",
            users,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting users",
            error,
        })
    }
};

//create user register user
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Fill all the details"
            })
        }
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(401).send({
                success: false,
                message: "User already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        //save new user
        const user = new userModel({ username, email, password: hashedPassword });
        await user.save();
        return res.status(201).send({
            success: true,
            message: "new user created",
            user,
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({
            message: "Error in register callback",
            success: false,
            error
        })
    }
};

//login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: 'Please provide email or password'
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'user not found'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Password is Invalid'
            })
        }
        else {
            return res.status(200).send({
                success: true,
                message: 'Login successful',
                user
            })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error in login callback',
            error
        })
    }
};