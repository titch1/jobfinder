'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	jobs = require('../../app/controllers/jobs.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/jobs')
		.get(jobs.list)
		.post(users.requiresLogin, jobs.create);

	app.route('/jobs/:articleId')
		.get(jobs.read)
		.put(users.requiresLogin, jobs.hasAuthorization, jobs.update)
		.delete(users.requiresLogin, jobs.hasAuthorization, jobs.delete);

	// Finish by binding the article middleware
	app.param('jobId', jobs.jobByID);
};
