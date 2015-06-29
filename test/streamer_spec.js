/*
 * @file streamer_spec.js
 * @author Guillaume Flandre
 * @copyright Copyright (c) Guillaume Flandre 2015. All rights reserved.
 */
var fs = require('fs');
var assert = require('assert');
var streamer = require(__dirname + '/../streamer');

describe('streamer', function () {
	describe('#each()', function () {
		it('should execute an async task for each piece of data', function (done) {
			var stream = fs.createReadStream(__dirname + '/fixtures.txt', { encoding: 'utf8' });
			streamer.each(stream, function (elem, getStats, cb) {
				setTimeout(function () {
					cb();
				}, 100);
			}, function (err, stats) {
				assert.equal(err, null);
				assert.equal(stats.retrieved, 24);
				assert.equal(stats.processed, 24);
				done();
			});
		});
	});
});
