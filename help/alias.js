const path = require('path')
const Module = require('module').Module
const old_findPath = Module._findPath

const ALIAS = {}
const _pathCache = {}

Module._findPath = function (request, paths, isMain) {
  var cacheKey = request + '\x00' + (paths.length === 1 ? paths[0] : paths.join('\x00'))
  var _request = _pathCache[cacheKey]

  if (!_request) {
    _request = request
    var aliasKey = Object.keys(ALIAS)
    for (var i = 0, len = aliasKey.length; i < len; i++) {
      var key = aliasKey[i]
      if (request.startsWith(key + '/') || request === key) {
        request = request.replace(key, '')
        _request = path.join(ALIAS[key], request)
        _pathCache[cacheKey] = _request
        break
      }
    }
  }

  return old_findPath(_request, paths, isMain)
}

module.exports = function setAlias (alias, path) {
  if (typeof alias === 'object') {
    Object.assign(ALIAS, alias)
  } else if (typeof alias === 'string' && typeof path === 'string') {
    ALIAS[alias] = path
  } else {
    throw Error('params must be object or string')
  }
}