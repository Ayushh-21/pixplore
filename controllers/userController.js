const { user } = require("../models")
const { doesUserExist } = require("../service/serviceFunctions")
const { validateUser } = require("../validations")


const createUser = async (req, res) => {
    try {
        const { username, email } = req.body
        const validateErrors = validateUser(req.body)

        if (validateErrors.length > 0) {
            return res.status(400).json({
                error: validateErrors
            })
        }
        const userExists = await doesUserExist(email)

        if (userExists) {
            return res.status(400).json({
                message: "Email already exists."
            })
        }
        const newUser = await user.create({ username, email })
        res.status(200).json({
            message: 'User created successfully.',
            user: newUser
        })

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "An internal server error occurred."
        })

    }
}


module.exports = { createUser }