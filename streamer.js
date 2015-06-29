/**
 * streamer.js
 * @author  Guillaume Flandre
 * @copyright Copyright (c) Guillaume Flandre 2015. All rights reserved.
 */
var Stream = require('stream');

/**
 * Streamer module
 *
 * Provides helpers for node streams
 */
var streamer = function () {
	my = {};

	/**
	 * Public
	 */
	var each;

	/**
	 * that
	 */
	var that = {};

	/***********************************************************************************************
	 *                                      PUBLIC METHODS
	 **********************************************************************************************/
	/**
	 * Exceutes a method for each data received
	 * @param  {object}   stream                             The stream object
	 * @param  {function} iterator(element, statsGetter, cb) The method to execute
	 * @param  {function} cb(err)                            The callback called at the end
	 */
	each = function (stream, iterator, cb) {
		if (!(stream instanceof Stream)) {
			return cb(new Error("The first argument should be an instance of Stream"));
		}

		if (typeof iterator !== 'function') {
			return cb(new Error("The iterator should be a function"));
		}

		if (typeof cb !== 'function') {
			cb = function () {};
		}

		var retrieved = 0;
		var processed = 0;
		var done = false;

		var getStats = function(doNotIncrement) {
			return {
				retrieved: retrieved,
				processed: processed + (doNotIncrement ? 0 : 1)
			};
		};

		var end = function () {
			if(done && processed >= retrieved) {
				return cb(null, getStats(true));
			}
		};

		stream.on('data', function (element) {
			retrieved++;

			iterator(element, getStats, function (err) {
				processed++;

				if (err) {
					cb(err);
				} else {
					end();
				}
			});
		})
		.on('error', cb)
		.on('close', function () {
			done = true;
			end();
		});
	};

	that.each = each;

	return that;
};

module.exports = streamer();
