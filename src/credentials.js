'use strict';

var path = require('path')

var axios = require('axios')
var qs = require('qs');

var appDir = path.join(path.dirname(require.main.filename), '..')
var config = require( appDir + '/config/enzona')

//var token = {}


const Token = {

    /**
     * 
     * Solicitar nuevo token de acceso
     *
    **/
    get: async () => {

        return new Promise((resolve, reject) => {

            let life = (global.eztoken.life + global.eztoken.created) - Math.floor(new Date() / 1000)

            if (global.eztoken.access_token === '' || life <= 0){
                var data = qs.stringify({
                    grant_type: 'client_credentials',
                    scope: 'enzona_business_payment enzona_business_qr refresh_token'
                });
                
                axios.post(config.url.apiURL + '/token', data, 
                {
                    timeout: config.general.requestTimeout,
                    headers: {
                        'Authorization': 'Basic ' + new Buffer.from(config.credentials.apiKey + ':' + config.credentials.apiSecret).toString('base64'),
                        'User-Agent': config.general.serviceName
                    }
                })
                .then(response => {
                    global.eztoken.access_token = response.data.access_token
                    global.eztoken.created = Math.floor(new Date() / 1000)
                    global.eztoken.life = response.data.expires_in
                    resolve(response.data)
                })
                .catch(err => {
                    if (err.response === undefined){
                        reject({error: 'Destino inaccesible o problema de red'})
                    }else{
                        reject(err.response.data.message)
                    }
                })
            }else{
                if (life <= config.general.lifeToRefresh){
                    refresh()
                    .then( refreshResponse => {
                        global.eztoken.access_token = refreshResponse.data.access_token
                        global.eztoken.created = Math.floor(new Date() / 1000)
                        global.eztoken.life = refreshResponse.data.expires_in
                        resolve({access_token: refreshResponse.data.access_token})
                    })
                    .catch( refreshErr => {
                        if (refreshErr.response === undefined){
                            reject({error: 'Destino inaccesible o problema de red'})
                        }else{
                            reject(refreshErr.response.data.message)
                        }
                    })
                }else{
                    resolve({access_token: global.eztoken.access_token, life: life})
                }
            }
        }) 
    },



    /**
     * 
     * Actualizar token de acceso -->>> NO WORK
     * 
    **/
    refresh: async () => {

        return new Promise((resolve, reject) => {

            var data = qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: global.eztoken.access_token
            })

            console.log(data)
    
            axios.post(config.url.apiURL + '/token', data, 
            {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Basic ' + new Buffer.from(config.credentials.apiKey + ':' + config.credentials.apiSecret).toString('base64'),
                    'User-Agent': config.general.serviceName
                }
            })
            .then( res => {
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
     * Revocar token de acceso -->>> NO WORK
     * 
    **/
   revoke: () => {
        
        return new Promise((resolve, reject) => {
    
            var data = qs.stringify({
                'grant_type': 'token',
                'refresh_token': global.eztoken.token
            });
    
            axios.post(config.url.apiURL + '/revoke', data, 
            {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Basic ' + new Buffer.from(config.credentials.apiKey + ':' + config.credentials.apiSecret).toString('base64'),
                    'User-Agent': config.general.serviceName,
                    'Accept': 'application/json'
                }
            })
            .then( res => {
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
    }

}


module.exports = Token