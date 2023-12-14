const { StatusCodes, BAD_REQUEST } = require('http-status-codes');

const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Auth } = require('../utils/common');


const userRepository = new UserRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        if(error.name == 'SequelizeUniqueConstraintError' || error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message)
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create the user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepository.getUser(data.email);
        if(!user) {
            throw new AppError('User not exixts', StatusCodes.BAD_REQUEST);
        }
        const passwordMatch = Auth.comparePassword(data.password, user.password);
        if(!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        } 
        const jwtToken = Auth.createToken(
            {
                id: user.id,
                email: user.email
            });
        console.log(jwtToken);
        return jwtToken; 
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Cannot signin', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    signin
}