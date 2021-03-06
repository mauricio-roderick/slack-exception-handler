'use strict';

var _           = require('lodash'),
	platform    = require('./platform'),
	slackConfig = {},
	slackClient;

/*
 * Listen for the error event.
 */
platform.on('error', function (error) {
	var notification = _.clone(slackConfig);

	_.extend(notification, {
		text: error.stack
	});

	slackClient.send(notification, function (error) {
		if (!error) return;

		console.error('Error on Slack.', error);
		platform.handleException(error);
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var Slack = require('node-slack');

	_.extend(slackConfig, {
		channel: _.startsWith(options.channel, '#') ? options.channel : '#' + options.channel,
		username: options.username
	});

	slackClient = new Slack(options.webhook);

	platform.log('Slack Exception Handler Initialized.');
	platform.notifyReady();
});