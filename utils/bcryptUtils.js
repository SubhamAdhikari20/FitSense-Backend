const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    // Hash the password
    const saltRound = bcrypt.genSaltSync(10);
    return await bcrypt.hash(password, saltRound);
};

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };