'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const User = require('../../users/user');

const { JWT_SECRET, JWT_EXPIRY } = require('../../config');
const router = express.Router();

const localAuth = passport.authenticate('local', { session: false, failWithError: true });

router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.use('/refresh', passport.authenticate('jwt', {session: false, failWithError: true}));

router.post('/refresh', jwtAuth, (req, res) => {
	User.find({_id : req.user.id})
		.then(user => {
			const authToken = createAuthToken(user[0]);
			res.json({ authToken });
		});
});

function createAuthToken(user) {
	return jwt.sign({ user }, JWT_SECRET, {
		subject: user.username,
		expiresIn: JWT_EXPIRY
	});
}

module.exports = router;