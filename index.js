

module.exports = function(config){

    var EnzonaAPI = {}

    EnzonaAPI.models = {}
    EnzonaAPI.models.products = require('./src/models/products')(config)
    EnzonaAPI.models.paymentsQuery = require('./src/models/payments-query')

    EnzonaAPI.credentials = require('./src/credentials')(config)
    EnzonaAPI.payments = require('./src/payments')(config)

    EnzonaAPI.config = config

    return EnzonaAPI

}