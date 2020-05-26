'use strict';

var qs = require('qs');


module.exports = function(config){

    const ezrequest = require('./request')(config)
    
    const Payments = {

        /**
         * Permite crear una orden de pago --> NO ENTIENDO AUN QUE ES
         */
        // newPaymentOrder: async () => {
    
        // }, 
    
    
        /**
         * 
         * Permite crear un pago
         * 
         * @param {Object} Objeto con la estructura model/products
         * 
         */
        create: async (products) => {

            return new Promise((resolve, reject) => {
    
                let total = 0
                let totaltax = 0
    
                products.items.forEach(element => {
                    total += element.price * element.quantity
                    totaltax += element.tax * element.quantity
                    element.price = element.price.toFixed(2)
                    element.tax = element.tax.toFixed(2)
                })
    
                total += totaltax + parseFloat(products.shipping)
                let sendata = {}
    
                sendata.description = 'pagoami'
                sendata.currency = 'CUP'
    
                sendata.amount = {
                    total: total.toFixed(2)
                }
    
                sendata.amount.details = {
                    shipping: products.shipping.toFixed(2),
                    tax: totaltax.toFixed(2),
                    discount: "0.01",
                    tip: "0.01"
                }
    
                sendata.items = products.items
    
                sendata.merchant_op_id = 111125478251,
                sendata.invoice_number = 7854,
                sendata.return_url = config.url.confirmURL
                sendata.cancel_url = config.url.cancelURL,
                sendata.terminal_id = 12121,
                sendata.buyer_identity_code = ''
    
                resolve(sendata)
    
                // axios.post(config.url.apiURL + '/payment/v1.0.0/payments', sendata, {
                //     timeout: config.general.requestTimeout,
                //     headers: {
                //         'Authorization': 'Bearer ' + token.access_token,
                //         'User-Agent': config.general.serviceName
                //     }
                // }).then( res => {
                //     resolve(res.data)
                // })
                // .catch( err => {
                //     if (err.response === undefined){
                //         reject({error: 'Destino inaccesible o problema de red'})
                //     }else{
                //         reject(err.response.data)
                //     }
                // })
    
            })
        },
    
    
        /**
         * 
         * Permite completar una pago --> NO ENTIENDO AUN QUE ES - DA ERROR
         * 
         * @param {String} uuid Id de la transacción 
         * 
         */
        complete: async (uuid) => {
            return new Promise( async (resolve, reject) => {
                await ezrequest.run('POST', '/payment/v1.0.0/payments/' + uuid + '/complete', null).then( res => { resolve(res) }).catch( err => { reject(err) })
            })
        },


        /**
         * 
         * Obtener un pago específico
         * 
         * @param {String} uuid Id de la transacción 
         * 
         */
        getPayment: async (payment) => {
            return new Promise( async (resolve, reject) => {
                await ezrequest.run('GET', '/payment/v1.0.0/payments/' + payment, null).then( res => { resolve(res) }).catch( err => { reject(err) })     
            })
        },
    
    
        /**
         * 
         * Obtener un listado de pagos a el comercio 
         * 
         * @param {Object} Objeto con la estructura model/payments-query
         * 
         */
        getPaymentsList: (query) => {
            return new Promise( async (resolve, reject) => {
                await ezrequest.run('GET', '/payment/v1.0.0/payments?' + qs.stringify(query), null).then( res => { resolve(res) }).catch( err => { reject(err) })
            })
        },       
    
    
        /**
         * 
         * Cancelar un pago 
         * 
         * @param {String} uuid Id de la transacción 
         * 
         */
        cancelPayment: (uuid) => {
            return new Promise( async (resolve, reject) => {
                await ezrequest.run('POST', '/payment/v1.0.0/payments/' + uuid + '/cancel', null).then( res => { resolve(res) }).catch( err => { reject(err) })
            })
        }
    
    }

    return Payments
}