'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	jobs = mongoose.model('jobs'),
	_ = require('lodash');

/**
 * Create a jobs
 */
exports.create = function(req, res) {
	var jobs = new jobs(req.body);
	jobs.user = req.user;

	jobs.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(jobs);
		}
	});
};

/**
 * Show the current jobs
 */
exports.read = function(req, res) {
	res.json(req.jobs);
};

/**
 * Update a jobs
 */
exports.update = function(req, res) {
	var jobs = req.jobs;

	jobs = _.extend(jobs, req.body);

	jobs.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(jobs);
		}
	});
};

/**
 * Delete an jobs
 */
exports.delete = function(req, res) {
	var jobs = req.jobs;

	jobs.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(jobs);
		}
	});
};

/**
 * List of jobs
 */
exports.list = function(req, res) {
	jobs.find().sort('-created').populate('user', 'displayName').exec(function(err, jobss) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(jobs);
		}
	});
};

/**
 * jobs middleware
 */
exports.jobsByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'jobs is invalid'
		});
	}

	jobs.findById(id).populate('user', 'displayName').exec(function(err, jobs) {
		if (err) return next(err);
		if (!jobs) {
			return res.status(404).send({
				message: 'jobs not found'
			});
		}
		req.jobs = jobs;
		next();
	});
};

/**
 * jobs authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.jobs.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
