'use strict';

const WEBHOOK = 'https://hooks.slack.com/services/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',
	  CHANNEL = 'test';

var cp     = require('child_process'),
	should = require('should'),
	exceptionHandler;

describe('Exception Handler', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
		this.timeout(5000);

		setTimeout(function () {
			exceptionHandler.kill('SIGKILL');
			done();
		}, 4000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(exceptionHandler = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			exceptionHandler.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			exceptionHandler.send({
				type: 'ready',
				data: {
					options: {
						webhook: WEBHOOK,
						channel: CHANNEL
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#error', function (done) {
		it('should process the error data', function () {
			var sampleError = new Error('Slack Exception Handler Plugin Test Error.');

			exceptionHandler.send({
				type: 'error',
				data: {
					message: sampleError.message,
					stack: sampleError.stack
				}
			}, done);
		});
	});
});