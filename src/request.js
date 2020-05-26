'use strict'

var axios = require('axios')


module.exports = function(config){

    var credentials = require('./credentials')(config)

    const Request = {

        run: async (method, url, data) => {

            return new Promise( async (resolve, reject) => {

                let auth
                let contentType

                if (url === '/token' || url === '/revoke'){
                    auth = 'Basic ' + new Buffer.from(config.credentials.apiKey + ':' + config.credentials.apiSecret).toString('base64')
                    contentType = 'application/x-www-form-urlencoded'
                }else{
                    let token =  await credentials.get()
                    auth = 'Bearer ' + token.access_token
                    contentType = 'application/json'
                }

                axios({
                    method: method,
                    url: config.url.apiURL + url,
                    data: data,
                    timeout: config.general.requestTimeout,
                    headers: {
                        'Authorization': auth,
                        'User-Agent': config.general.serviceName,
                        'Content-type': contentType
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

    return Request

}