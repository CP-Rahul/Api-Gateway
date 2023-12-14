const CrudRepository = require("./crud-repository");
const { User } = require('../models');

class UserRepository extends CrudRepository {
    constructor(){
        super(User);
    }

    async getUser(email) {
        try {
            const response = await User.findOne({
                where: {
                    email: email
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserRepository;