'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PollsSchema = new _mongoose2.default.Schema({
  title: String,
  description: String,
  createWho: String,
  createWhoId: String,
  items: [] //{name:String, votes: String, id: String}
});

/* Custom methods */

/* Search Polls by ID of creator */
PollsSchema.methods.findByUser = function (cb) {
  return this.model('Polls').find({ createWhoId: this.createWhoId }, cb);
  //return this.model('Polls').find({  }, cb);
};

exports.default = _mongoose2.default.model('Polls', PollsSchema);
//# sourceMappingURL=polls.model.js.map
