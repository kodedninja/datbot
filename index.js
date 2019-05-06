var assert = require('assert')
var Dat = require('dat-node')
var watch = require('chokidar').watch
var fs = require('fs')
var nrc = require('node-run-cmd')
var path = require('path')

// (str, fn(arr), obj, ?fn(arr)) -> void
module.exports = function (key, reducer, options, callback) {
  assert(typeof key === 'string', 'datbot: key should be a string')
  assert(typeof reducer === 'function', 'datbot: second parameter should be a function')

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options.rate = options.rate || 2500
  options.output = path.resolve(process.cwd(), options.output || cleanUrl(key))

  // ensure the directory exists
  if (!fs.existsSync(options.output)) {
    fs.mkdirSync(options.output)
  }

  // start the watcher
  var watcher = watch(options.output, {
    awaitWriteFinish: true,
    ignoreFiles: /\.dat/
  })
  var updateTimeout = null
  watcher.on('all', function (type, path) {
    if (updateTimeout) clearTimeout(updateTimeout)
    updateTimeout = setTimeout(function () {
      handleUpdate(path)
    }, options.rate)
  })

  Dat(options.output, {
    key: key
  }, function (err, dat) {
    if (err) throw err

    dat.joinNetwork()
  })

  function handleUpdate(path) {
    var cmdsStr = reducer(path)

    cmds = cmdsStr.map((cmd) => ({ command: cmd, cwd: options.output }))

    nrc.run(cmds).then(function (exitCodes) {
      if (callback) callback(exitCodes)
    })
  }
}

function cleanUrl(key) {
  return key.replace('dat:', '').replace(/\//g, '')
}
