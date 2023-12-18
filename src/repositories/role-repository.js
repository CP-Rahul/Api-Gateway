const { StatusCodes } = require('http-status-codes');

const { response } = require('express');
const { Role } = require('../models');
const AppError = require('../utils/errors/app-error');
const CrudRepository = require('./crud-repository');

class RoleRepository extends CrudRepository{
    constructor() {
        super(Role);
    }
    async getRoleByname(name) {
        try {
            const response = await Role.findOne({
                where: {
                    name: name
                }
            });
            return response;
        } catch (error) {
            if(!response) {
                throw new AppError('Cannot find the role', StatusCodes.NOT_FOUND);
            }
        }
    }
}

module.exports = RoleRepository;