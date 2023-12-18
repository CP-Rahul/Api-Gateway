const expres = require('express');

const { UserController } = require('../../controllers');
const { UserMiddlewares } = require('../../middlewares');

const router = expres.Router();

router.post('/signup',
        UserMiddlewares.validateCreateUser,
        UserController.createUser);

router.post('/signin',
        UserMiddlewares.validateCreateUser,
        UserController.signin);

router.post('/role',
        UserMiddlewares.checkAuth,
        UserMiddlewares.isAdmin,
        UserController.addRoleToUser);

module.exports = router;