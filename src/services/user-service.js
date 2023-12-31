const { StatusCodes, BAD_REQUEST } = require('http-status-codes');

const { UserRepository } = require('../repositories');
const { RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Auth, ENUMS } = require('../utils/common');


const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByname(ENUMS.USER_ROLES.CUSTOMER);
        user.addRole(role);
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
        return jwtToken; 
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Cannot signin', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    try {
        console.log(token)
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        const user = await userRepository.get(response.id)
        if(!user) {
            throw new AppError('User not found', StatusCodes.BAD_REQUEST);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
       throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
}

async function addRoleToUser(data) {
    try {
        const user = await userRepository.get(data.id);
        if(!user) {
            throw new AppError('User not exixts', StatusCodes.BAD_REQUEST);
        }
        const role = await roleRepository.getRoleByname(data.role);
        if(!user) {
            throw new AppError('No role found', StatusCodes.BAD_REQUEST);
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Cannot assign role', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
    try {
        const user = await userRepository.get(id);
        if(!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }
        const adminrole = await roleRepository.getRoleByname(ENUMS.USER_ROLES.ADMIN);
        if(!adminrole) {
            throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
        }
        return user.hasRole(adminrole);
    } catch(error) {
        if(error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}