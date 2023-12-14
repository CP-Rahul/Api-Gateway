const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    HASH: process.env.HASH,
    JWTSECRET: process.env.JWTSECRET
}