
var axios = require('axios')


module.exports.create = function(products, token){

    return new Promise((resolve, reject) => {

        let total = 0
        let totaltax = 0

        products.forEach(element => {
            total += element.price * element.quantity
            totaltax += element.tax * element.quantity
        })

        total += 0.01
        let sendata = {}

        sendata.description = 'pagoami'
        sendata.currency = 'CUP'

        sendata.amount = {
            total: total
        }

        sendata.amount.details = {
            shipping: 0.01,
            tax: totaltax
        }

        sendata.items = products

        sendata.merchant_op_id = 123456789123,
        sendata.invoice_number = 1212,
        sendata.return_url = "http://localhost:3002/return",
        sendata.cancel_url = "http://localhost:3002/cancel",
        sendata.terminal_id = 12121,
        sendata.buyer_identity_code = ''

        
        axios.post('https://apisandbox.enzona.net/payment/v1.0.0/payments', sendata, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then( res => {
            resolve(res)
        })
        .catch( err => {
            reject(err)
        })

    })

}