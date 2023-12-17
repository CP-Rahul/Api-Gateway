const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const { rateLimit } = require('express-rate-limit');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, 
	limit: 50,
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter);

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Server running on port ${ServerConfig.PORT}`);
})