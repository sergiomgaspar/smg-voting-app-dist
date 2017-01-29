/**
 * Polls model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _polls = require('./polls.model');

var _polls2 = _interopRequireDefault(_polls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PollsEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
PollsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _polls2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    PollsEvents.emit(event + ':' + doc._id, doc);
    PollsEvents.emit(event, doc);
  };
}

exports.default = PollsEvents;
//# sourceMappingURL=polls.events.js.map
