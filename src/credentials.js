var path = require('path')

var axios = require('axios')
var qs = require('qs');

var appDir = path.join(path.dirname(require.main.filename), '..')

var config = require( appDir + '/config/enzona')

/**
 * GET NEW ACCESS TOKEN 
**/
module.exports.getToken = async function(acc){
    
    return new Promise((resolve, reject) => {

        const data = qs.stringify({
            grant_type: 'client_credentials',
            scope: 'enzona_bussiness_payment'
        });
        
        axios.post('https://apisandbox.enzona.net/token', data, 
        {
            headers: {
                'Authorization': 'Basic ' + new Buffer.from(acc.key + ':' + acc.secret).toString('base64'),
                'Accept': 'application/json'
            }
        })
        .then(response => {
            resolve(response.data)
        })
        .catch(err => {
            reject(err)
        })
    }) 
}

/**
 * REFRESH ACCESS TOKEN -->>> NO WORK
**/
module.exports.refreshToken = async function(acc, token){

    return new Promise((resolve, reject) => {

        const data = qs.stringify({
            refresh_token: token,
            grant_type: 'refresh_token'
        });

        axios.post('https://apisandbox.enzona.net/token', data, 
        {
            headers: {
            'Authorization': 'Basic ' + new Buffer.from(acc.key + ':' + acc.secret).toString('base64'),
            'Accept': 'application/json'
            }
        })
        .then( res => {
            resolve(res)
        })
        .catch( err => {
            reject(err.message)
        })

    })
}