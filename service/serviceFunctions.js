const { user } = require("../models")

const doesUserExist = async (email) => {
    const userExist = await user.findOne({ where: { email: email } })
    return !!userExist
}

module.exports = { doesUserExist }
