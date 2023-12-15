const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

function validateCreateUser(req, res, next) {
    ErrorResponse.message = 'Something went wrong while SignUp'
    if(!req.body.email) {
        ErrorResponse.error = new AppError('Email cannot be null', StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    if(!req.body.password) {
        ErrorResponse.error = new AppError('Password cannot be null', StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req, res, next) {
    try {
        const response = await UserService.isAuthenticated(req.headres['x-access-token']);
        if(response) {
            req.user = response;
            next();
        }
    } catch (error) {
        return res
                .status(error.statusCode)
                .json(error);
    }
}

module.exports = {
    validateCreateUser
}