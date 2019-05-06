# datbot
<a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
  <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="Stability"/>
</a>

Seed a DAT archive and trigger scripts on updates

#### `Work In Progress`

## Installation
```
npm i datbot
```

## Usage
Use it as a CLI tool or from a Node program using the API.

```javascript
datbot('dat://dj837h....ew/', (path) => {
  if (path.includes('content')) {
    return [ 'npm run build' ]
  }
}, {
  output: '~/.tmp/'
})
```

## CLI
```
$  datbot <key> [opts] [commands]

options
  --help, -h              show this help text
  --output, -o            tell datbot where to download the files
  --verbose               print to the console
  --version, -v           print version

example
  $ datbot dat://dj837h....ew/ "git add . && git commit -m automatic"

```

## API
### `datbot(key, reducer(path), ?options, ?callback(exitCodes))`
Takes a Dat `key` that's forwarded to [`dat-node`](https://npmjs.com/package/dat-node) and a `reducer` function, that gets a `string` containing the path of the currently changed file and returns an `Array` of commands (`string`). The path here isn't reliable, when many files are changed at the same time.

Optionally you can pass a `callback` function, that gets called after each update containing an `Array` of exit codes.

Defaults of `options`:

```javascript
{
  rate: 2500,      // miliseconds between update calls
  output: <key>    // output directory for the Dat archive
}
```
