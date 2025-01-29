
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

const validateSearchImageQuery = (query) => {
    const errors = []
    if (!query.query || typeof query.query !== 'string') {
        errors.push("query is required and should be a string.")
    }

    return errors
}

const validateImageUrl = (imageUrl) => {
    return imageUrl.startsWith("https://images.unsplash.com/");
}

const validateTags = (tags) => {
    if (!Array.isArray(tags)) return "Tags must be an array";
    if (tags.length > 5) return "Cannot have more than 5 tags";
    for (const tag of tags) {
        if (tag.length > 20) return "Each tag must not exceed 20 characters";
    }
    return null;
}

module.exports = { validateUser, validateSearchImageQuery, validateImageUrl, validateTags }