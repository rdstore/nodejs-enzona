'use strict';

var qs = require('qs');

module.exports = function(config){

    const ezrequest = require('./request')(config)
    var productsModel = require('./models/products')(config)
    
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
            return new Promise( async (resolve, reject) => {
                //resolve(productsModel.build(products))
                await ezrequest.run('POST', '/payment/v1.0.0/payments', productsModel.build(products)).then( res => { resolve(res) }).catch( err => { reject(err) })    
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