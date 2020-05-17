var path = require('path')

var appDir = path.join(path.dirname(require.main.filename), '..')

var enzona = {}

enzona.config = require( appDir + '/config/enzona')
enzona.credentials = require( appDir + '/config/enzona')
enzona.payments = require('./src/payments')


module.exports = enzona

// module.exports = require( appDir + '/config/enzona')
// module.exports = require('./src/credentials')
// module.exports = require('./src/payments')


