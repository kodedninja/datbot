#!/usr/bin/env node

var minimist = require('minimist')
var dedent = require('dedent')
var datbot = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {
    'help': 'h',
    'version': 'v',
    'output': 'o'
  },
  default: {
    'output': null,
  },
  boolean: [
    'help',
    'version',
    'verbose'
  ]
})

if (argv.help) {
  console.log('\n', dedent`
    $  datbot <key> [opts] [commands]

    options
      --help, -h              show this help text
      --output, -o            tell datbot where to download the files
      --verbose               print to the console
      --version, -v           print version

    example
      $ datbot dat://dj837h....eu/ "git add . && git commit -m automatic"
  `, '\n')
  process.exit(0)
}

if (argv.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}

var key = argv._[0]
var commands = argv._.slice(1)

datbot(key, () => commands, {
  output: argv.output
}, function (exitCodes) {
  if (argv.verbose) {
    var success = true
    var failIndex = -1

    for (var i = 0; i < exitCodes.length && success; i++) {
      if (exitCodes[i] !== 0) {
        success = false
        failIndex = i
      }
    }

    if (success) {
      console.log('All commands ran successfully after update!')
    } else {
      console.log(`One of the commands failed after an update: ${commands[failIndex]}`)
    }
  }
})
