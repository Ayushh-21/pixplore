const validateUser = (data) => {
    const { username, email } = data;
    const errors = [];

    if (!username || typeof username !== 'string') {
        errors.push("Username is required and should be a string.");
    }

    if (!email || typeof email !== 'string') {
        errors.push("Email is required and should be a string.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push("Invalid email address");
    }

    return errors; 
};


module.exports = { validateUser }