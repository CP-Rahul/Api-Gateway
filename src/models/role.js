'use strict';
const {
  Model, ENUM
} = require('sequelize');

const { ENUMS } = require('../utils/common');
const { CUSTOMER, ADMIN, FLIGHT_COMPANY } = ENUMS.USER_ROLES;

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init({
    name: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: []
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};