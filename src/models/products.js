'use strict';

module.exports = function(config){

    const Products = {


        get: () => {
            return {
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
        },


        build: (products) => {

            let total = 0
            let totaltax = 0

            products.items.map( item => {

                total += item.price * item.quantity
                totaltax += item.tax

                item.price = item.price.toFixed(2)
                item.tax = item.tax.toFixed(2)
            })

            total += ((totaltax + products.amount.details.shipping + products.amount.details.tip) - products.amount.details.discount)

            products.amount.total = total.toFixed(2)
            products.amount.details.tax = totaltax.toFixed(2)

            products.amount.details.tip =  products.amount.details.tip.toFixed(2)
            products.amount.details.discount = products.amount.details.discount.toFixed(2)
            products.amount.details.shipping = products.amount.details.shipping.toFixed(2)

            return products

        },
    
    }

    return Products
    
}