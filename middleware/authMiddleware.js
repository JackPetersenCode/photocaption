const bcrypt = require('bcrypt');

const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);
    console.log(hashedPassword);
    return hashedPassword;
};

module.exports = { hashPassword };