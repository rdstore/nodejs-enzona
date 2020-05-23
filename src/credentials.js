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

        return new Promise( async (resolve, reject) => {

            let life = (global.eztoken.life + global.eztoken.created) - Math.floor(new Date() / 1000)

            if (global.eztoken.access_token === '' || life <= 0){
                var data = {
                    grant_type: config.credentials.loginType,
                    scope: config.credentials.scope
                };

                if (config.credentials.loginType === 'password'){
                    data.username = config.credentials.username
                    data.password = config.credentials.password
                }


                
                axios.post(config.url.apiURL + '/token', qs.stringify(data), 
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

                    if (config.credentials.loginType === 'password'){
                        global.eztoken.refresh_token = response.data.refresh_token
                    }
                    resolve(response.data)
                })
                .catch(err => {
                    if (err.response === undefined){
                        reject({error: 'Destino inaccesible o problema de red'})
                    }else{
                        reject(err.response.data)
                    }
                })
            }else{
                if (config.credentials.loginType === 'password' && life <= config.general.lifeToRefresh){
                    await Token.refresh().then( res => { resolve(res) }).catch( err => { reject(err) })
                }else{
                    resolve({access_token: global.eztoken.access_token, refresh_token: global.eztoken.refresh_token, life: life})
                }
            }
        }) 
    },



    /**
     * 
     * Actualizar token de acceso
     * 
    **/
    refresh: async () => {

        return new Promise((resolve, reject) => {

            var data = qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: global.eztoken.refresh_token
            })

            axios.post(config.url.apiURL + '/token', data, 
            {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Basic ' + new Buffer.from(config.credentials.apiKey + ':' + config.credentials.apiSecret).toString('base64'),
                    'User-Agent': config.general.serviceName
                }
            })
            .then( res => {
                global.eztoken.access_token = res.data.access_token
                global.eztoken.created = Math.floor(new Date() / 1000)
                global.eztoken.life = res.data.expires_in
                global.eztoken.refresh_token = res.data.refresh_token
                resolve(res.data)
            })
            .catch( err => {
                console.log(err)
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
     * Revocar token de acceso -->>> NO FUNCIONA
     * 
    **/
   revoke: () => {
        
        return new Promise((resolve, reject) => {
    
            var data = qs.stringify({
                'grant_type': 'token',
                'refresh_token': global.eztoken.refresh_token
            });
    
            axios.post(config.url.apiURL + '/revoke', data, 
            {
                timeout: config.general.requestTimeout,
                headers: {
                    'Authorization': 'Basic ' + new Buffer.from(config.credentials.apiKey + ':' + config.credentials.apiSecret).toString('base64'),
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


module.exports = Token