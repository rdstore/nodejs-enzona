
var axios = require('axios')


module.exports.createPayment = function(acc, products, token){


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

        sendata.ammount = {
            total: total
        }

        sendata.ammount.details = {
            shipping: 0.01,
            tax: totaltax,
            discount: 0.00,
            tip: 0.00
        }

        sendata.items = products

        sendata.merchant_op_id = 123456789123,
        sendata.invoice_number = 1212,
        sendata.return_url = "https://mymerchant.cu/return",
        sendata.cancel_url = "https://mymerchant.cu/cancel",
        sendata.terminal_id = 12121,
        sendata.buyer_identity_code = ''

        console.log(sendata)

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