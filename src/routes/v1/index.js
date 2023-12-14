const expres = require('express');

const userRoutes = require('./user-routes');

const router = expres.Router();

router.use('/user', userRoutes);

module.exports = router;