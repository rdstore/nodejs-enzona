'use strict';
var path = require('path')
var appDir = path.join(path.dirname(require.main.filename), '..')
var config = require( appDir + '/config/enzona')

var model = {
        description: config.general.paymentDescription,
        currency: config.general.paymentDefaultCurrency,
        amount: {
          total: 0,
          details: {
            shipping: 0,
            tax: 0,
            discount: 0,
            tip: 0
          }
        },
        items: [

        ],
        merchant_op_id: 123456789123,
        invoice_number: 1212,
        return_url: config.url.confirmURL,
        cancel_url: config.url.cancelURL,
        terminal_id: 12121,
        buyer_identity_code: ""
}

const ProductsModel = {

    get: () => {
        return model
    },

    build: () => {

        let total = 0
        let totalTax = 0

        model.items.map( item => {
            total += item.price * item.quantity
            totalTax += item.tax
        })

        model.amount.total = (total + totalTax + model.amount.details.shipping + model.amount.details.tip) - model.amount.details.discount
        model.amount.details.tax = totalTax

        return model
    },

    reset: () => {
        model.description = config.general.paymentDescription
        model.currency = config.general.paymentDefaultCurrency
        model.items = []
    }
}


module.exports = ProductsModel