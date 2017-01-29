/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/polls              ->  index
 * POST    /api/polls              ->  create
 * GET     /api/polls/:id          ->  show
 * PUT     /api/polls/:id          ->  upsert
 * PATCH   /api/polls/:id          ->  patch
 * DELETE  /api/polls/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _polls = require('./polls.model');

var _polls2 = _interopRequireDefault(_polls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      _fastJsonPatch2.default.apply(entity, patches, /*validate*/true);
    } catch (err) {
      return _promise2.default.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Polls
function index(req, res) {
  return _polls2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

/* Get Polls from db by user */
/* To implement: add validation that userID = loggedUser */
function show(req, res) {

  //console.log("Searching polls created by user:"+req.params.id);
  var poll = new _polls2.default({ createWhoId: req.params.id });

  if (req.params.id === 'count') return _polls2.default.count().exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));else return poll.findByUser().lean().exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Polls in the DB
function create(req, res) {
  return _polls2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Polls in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _polls2.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Polls in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _polls2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Polls from the DB
function destroy(req, res) {
  return _polls2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=polls.controller.js.map
