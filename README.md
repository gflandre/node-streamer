# Streamer

Streamer is a lib helping to iterate over streamed data while performing async
operations on each piece of data streamed.

## Install
```
npm install node-streamer
```

## Usage
### `each`
`streamer.each(stream, iterator, callback)`

Where :
 - `stream` is a node.js readable stream
 - `iterator(elem, getStats, cb)` is the method that will perform an async task. It has the following arguments:
   - `elem` data from the stream
   - `getStats` a method that can be called to get stats of the state of the current streaming, of the form:
     ```javascript
     	{
     	  retrieved: <number>,
     	  processed: <number>
        }
     ```
   - `cb` to be called when the async task is done
 - `callback` the callback called when the stream is done

#### Example:
```
var streamer = require('node-streamer');

// Dummy method to get a readable stream
// Typically: a large file, a mysql or mongo stream, whatever really
var stream = getStream();

// For each `data` retrieved for the stream, execute the iterator method, do something async,
// then call the callback
streamer.each(stream, function (elem, getStats, cb) {
	myAsyncMethod(function (err) {
		var stats = getStats();
		console.log('%d/%d', stats.processed, stats.retrieved);
		return cb(err);
	})
}, function (err, stats) {
	console.log('DONE: %d/%d', stats.processed, stats.retrieved);
	// do something when done
});
```

## Test
In order to test you'll need to install mocha: `npm install -g mocha`.
Then just run the `mocha` command at the root of your project.

## Contribute
This lib is still very basic and might not perfectly fit your needs.
If you think it would make sense to add some features/methods don't hesitate to fork and
make pull requests.

## Licence
Distributed under the MIT License.
