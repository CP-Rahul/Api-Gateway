const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ServerConfig } = require('../../config')

function comparePassword(password, encryptedPassword) {
    try {
        return bcrypt.compareSync(password, encryptedPassword)
    } catch (error) {
        throw error;
    };
}

function createToken(input) {
    try {
       return token = jwt.sign(input, ServerConfig.JWTSECRET,{ expiresIn: '1h' });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    comparePassword,
    createToken
}