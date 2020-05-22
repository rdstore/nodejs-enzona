var path = require('path')
var appDir = path.join(path.dirname(require.main.filename), '..')

var EnzonaAPI = {}

EnzonaAPI.config = require( appDir + '/config/enzona')
EnzonaAPI.token = require('./src/credentials')
EnzonaAPI.payments = require('./src/payments')


module.exports = EnzonaAPI


