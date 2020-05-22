'use strict';

var path = require('path')
var qs = require('qs');
var axios = require('axios')
var appDir = path.join(path.dirname(require.main.filename), '..')
var config = require( appDir + '/config/enzona')

var credentials = require('./credentials')

const Payments = {

    /**
     * 
     * Permite crear una orden de pago --> NO ENTIENDO AUN QUE ES
     * 
     */
    newPaymentOrder: async () => {

        let token = await getAccessToken()

        return new Promise((resolve, reject) => {
            
            var cosa = {
                description: "string",
                currency: "CUP",
                amount: 5,
                merchant_op_id: 123456789123
            }

            axios.post(config.url.apiURL + '/payment/v1.0.0/payment-orders', cosa, {
                timeout: config.general.requestTimeout,
                headers:{
                    'Authorization': 'Bearer ' + token,
                    'User-Agent': config.general.serviceName
                }
            })
            .then( res => {
                resolve(res)
            })
            .catch( err => {
                reject(err)
            })
        })

    }, 


    /**
     * 
     * Permite crear un pago
     * 
     * @param {Array} products  Productos con los que crear la orden de pago
                        name: "Nombre del Producto",
                        description: "Descripcion del producto",
                        quantity: 1,
                        price: 0.03,
                        tax: 0.01
    * 
    */
    create: async (products) => {

        let token = await credentials.get()

        return new Promise((resolve, reject) => {

            let total = 0
            let totaltax = 0

            products.items.forEach(element => {
                total += parseFloat(element.price) * element.quantity
                totaltax += parseFloat(element.tax) * element.quantity
            })

            total += totaltax + parseFloat(products.shipping)
            let sendata = {}

            sendata.description = 'pagoami'
            sendata.currency = 'CUP'

            sendata.amount = {
                total: total
            }

            sendata.amount.details = {
                shipping: products.shipping,
                tax: totaltax,
                discount: 0.01,
                tip: 0.01
            }

            sendata.items = products.items

            sendata.merchant_op_id = 111125478251,
            sendata.invoice_number = 7854,
            sendata.return_url = config.url.confirmURL
            sendata.cancel_url = config.url.cancelURL,
            sendata.terminal_id = 12121,
            sendata.buyer_identity_code = ''

            console.log(sendata)

            axios.post(config.url.apiURL + '/payment/v1.0.0/payments', sendata, {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + token.access_token,
                    'User-Agent': config.general.serviceName
                }
            }).then( res => {
                resolve(res.data)
            })
            .catch( err => {
                if (err.response === undefined){
                    reject({error: 'Destino inaccesible o problema de red'})
                }else{
                    reject(err.response.data)
                }
            })

        })
    },


    /**
     * 
     * Permite completar una pago --> NO ENTIENDO AUN QUE ES
     * 
     * @param {String} uuid Id de la transacción 
     * 
     */
    complete: async (uuid) => {

        let token = await credentials.get()

        return new Promise((resolve, reject) => {
            axios.post(config.url.apiURL + '/payment/v1.0.0/payments/' + uuid + '/complete', {}, {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + token.access_token,
                    'User-Agent': config.general.serviceName
                }
            }).then( res => {
                resolve(res)
            })
            .catch( err => {
                if (err.response === undefined){
                    reject({error: 'Destino inaccesible o problema de red'})
                }else{
                    reject(err.response.data)
                }
            })
        })
    },


    /**
     * 
     * Obtener un listado de pagos a el comercio 
     * 
     * @param {Array} query Parámetros a la consulta de la lista de pagos 
     * 
     */
    getPaymentsList: async (query) => {

        let token = await credentials.get()

        return new Promise((resolve, reject) => {

            query.merchant_uuid = config.credentials.merchantUUID

            axios.get(config.url.apiURL + '/payment/v1.0.0/payments?' + qs.stringify(query), {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Bearer ' + token.access_token,
                    'User-Agent': config.general.serviceName
                }
            })
            .then( res => {
                resolve(res.data)
            })
            .catch( err => {
                if (err.response === undefined){
                    reject({error: 'Destino inaccesible o problema de red'})
                }else{
                    reject(err.response.data)
                }
            })
        })

    }

}


module.exports = Payments