var EventEmitter = require('events')
var eventEmitter = new EventEmitter()

eventEmitter.setMaxListeners(0)

module.exports = eventEmitter
