'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const localStrategy = require('./auth/local');
const jwtStrategy = require('./auth/jwt');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect, dbGet } = require('./db-mongoose');

// ROUTERS
const userRouter = require('./users/routes/user');
const authRouter = require('./users/routes/auth');
const questionRouter = require('./questions/routes/questions');

// Express app
const app = express();

// MORGAN
app.use(
	morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
		skip: (req, res) => process.env.NODE_ENV === 'test'
	})
);

// CORS
app.use(
	cors({
		origin: CLIENT_ORIGIN
	})
);

// Parse requiest body
app.use(express.json());

// Auth
passport.use(localStrategy);
passport.use(jwtStrategy);

// Endpoints
app.use('/api/auth', authRouter);
// app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api/questions', questionRouter);

// Catch-all 404
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	console.error(err);
	next(err);
});

function runServer(port = PORT) {
	const server = app
		.listen(port, () => {
			console.info(`App listening on port ${server.address().port}`);
		})
		.on('error', err => {
			console.error('Express failed to start');
			console.error(err);
		});
}

if (require.main === module) {
	dbConnect();
	runServer();
}

console.log(`MongoDB URI: ${dbGet().connection.host}:${dbGet().connection.port}`);

module.exports = { app };