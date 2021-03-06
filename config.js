'use strict';

module.exports = {
	PORT: process.env.PORT || 8080,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
	DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/spaced-repetition-backend',
	TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/spaced-repetition-backend-test',
	JWT_SECRET: process.env.JWT_SECRET || 'testing-secret',
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};