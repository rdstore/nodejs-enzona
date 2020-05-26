'use strict';

var path = require('path')
var appDir = path.join(path.dirname(require.main.filename), '..')
var config = require( appDir + '/config/enzona')

var model = {
    limit: '5',
    offset: '0',
    merchant_op_filter: '',
    status_filter: '',
    start_date_filter: '',
    end_date_filter: '',
    order_filter: 'desc',
    merchant_uuid: config.credentials.merchantUUID
}

const PaymentsQuery = {

    getCompiled: () => {
        let compiled = {}

        if (model.limit !== '') { compiled.limit = model.limit}
        if (model.offset !== ''){ compiled.offset = model.offset }
        if (model.merchant_op_filter !== ''){ compiled.merchant_op_filter = model.merchant_op_filter }
        if (model.status_filter !== ''){ compiled.status_filter = model.status_filter }
        if (model.start_date_filter !== ''){ compiled.start_date_filter = model.start_date_filter }
        if (model.end_date_filter !== ''){ compiled.end_date_filter = model.end_date_filter }
        if (model.order_filter !== ''){ compiled.order_filter = model.order_filter }
        if (model.merchant_uuid !== ''){ compiled.merchant_uuid = model.merchant_uuid }

        return compiled
    },

    setLimit: (limit) => {
        model.limit = limit
        return PaymentsQuery
    },

    getLimit: () => {
        return model.limit
    },

    setOffset: (offset) => {
        model.offset = offset
        return PaymentsQuery
    },

    getOffset: () => {
        return model.offset
    },

    setMerchantOpFilter: (merchantOpFilter) => {
        model.merchant_op_filter = merchantOpFilter
        return PaymentsQuery
    },

    getMerchantOpFilter: () => {
        return model.merchant_op_filter
    },

    setStatusFilter: (statusFilter) => {
        model.status_filter = statusFilter
        return PaymentsQuery
    },

    getStatusFilter: () => {
        return model.status_filter
    },

    setStartDateFilter: (startDateFilter) => {
        model.start_date_filter = startDateFilter
        return PaymentsQuery
    },

    getStartDateFilter: () => {
        return model.start_date_filter
    },

    setEndDateFilter: (endDateFilter) => {
        model.end_date_filter = endDateFilter
        return PaymentsQuery
    },

    endStartDateFilter: () => {
        return model.end_date_filter
    },

    setOrderFilter: (orderFilter) => {
        model.order_filter = orderFilter
        return PaymentsQuery
    },

    getOrderFilter: () => {
        return model.order_filter
    },

    setMerchantUUID: (merchantUUID) => {
        model.merchant_uuid = merchantUUID
        return PaymentsQuery
    },

    getMerchantUUID: () => {
        return model.merchant_uuid
    },

    reset: () => {
        model.limit = 5
        model.offset = 0
        model.merchant_op_filter = ''
        model.status_filter = ''
        model.start_date_filter = ''
        model.end_date_filter = ''
        model.order_filter = 'desc'
        model.merchant_uuid = config.credentials.merchantUUID
    }
}

module.exports = PaymentsQuery