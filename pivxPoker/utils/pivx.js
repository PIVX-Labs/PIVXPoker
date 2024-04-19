//const unirest=require('unirest');
const http = require('http');

const USER = process.env.WALLET_USER;
const PASS = process.env.WALLET_PASSWORD;

const headers = {
  "content-type": "text/plain;"
};

const https = require('https');

/**
 * This reachout out over http or https 
 * @param {object} endpoint 
 * @param {*} method 
 * @param {*} body 
 * @param {*} contentType 
 * @param {*} header 
 * @returns 
 */
const request = async (endpoint, method, body, contentType, header = []) => {
    const url = new URL(endpoint);

    //This is the information you need to send to the get the proper response. This is generated from the endpoint object
    const opts = {
        'auth': url.username + ':' + url.password,
        'host': url.host,
        'hostname': url.hostname,
        'port': url.port,
        'href': url.href,
        'protocol': url.protocol,
        'path': url.pathname + url.search,
        'method': method
    };

    const server = opts.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
        const req = server.request(opts, (res) => {
            let strData = '';
            res.setEncoding('utf8');

            res.on('data', d => strData += d);

            res.on('end', () => {
                // Return the full string
                if(res.statusCode === 200) {
                    resolve(strData);
                }
                else {
                    reject(strData ? strData : res);
                }
            });
        });

        req.on('error', error => reject(error));

        req.setHeader('User-Agent', 'StakeCube');
        req.setHeader('Content-Type', contentType);

        for(const key in header) req.setHeader(key, header[key]);

        if(body) req.write(body);

        req.end();
    });
};
/**
 * Send a post request
 * @param {object} endpoint 
 * @param {*} contentType 
 * @param {*} header 
 * @returns 
 */
const post = async (endpoint, body, contentType = 'application/json', header = []) => {
    return await request(endpoint, 'POST', body, contentType, header);
};

const getNewAddress=async ()=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getnewaddress","params":[]}`;
    const respond= JSON.parse(await post('http://' +
    USER + ':' +
    PASS + '@' +
    process.env.WALLET_URL + ':' +
    process.env.WALLET_PORT,
    dataString));
    return respond;

};

const getNewShieldAddress=async ()=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getnewshieldaddress","params":[]}`;
    const respond= JSON.parse(await post('http://' +
    USER + ':' +
    PASS + '@' +
    process.env.WALLET_URL + ':' +
    process.env.WALLET_PORT,
    dataString));
    return respond;

};

const getTransaction=async (txid)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"gettransaction","params":["${txid}"]}`;
    const respond= JSON.parse(await post('http://' +
    USER + ':' +
    PASS + '@' +
    process.env.WALLET_URL + ':' +
    process.env.WALLET_PORT,
    dataString));
    return respond;

};

const sendToAddress=async (address, amount)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"sendtoaddress","params":["${address}", "${amount/100000000}"]}`;
    const respond= JSON.parse(await post('http://' +
    USER + ':' +
    PASS + '@' +
    process.env.WALLET_URL + ':' +
    process.env.WALLET_PORT,
    dataString));
    return respond;
}

const getTotalBalance=async (address, amount)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getbalance","params":[]}`;
    const respond= JSON.parse(await post('http://' +
    USER + ':' +
    PASS + '@' +
    process.env.WALLET_URL + ':' +
    process.env.WALLET_PORT,
    dataString));
    return respond;
}

const decodeRawTransactiontest= async(rawtx)=>{
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"decoderawtransaction","params":["${rawtx}"]}`;
    console.log(dataString);
    const respond= JSON.parse(await post('http://' +
    USER + ':' +
    PASS + '@' +
    process.env.WALLET_URL + ':' +
    process.env.WALLET_PORT,
    dataString));
    return respond;
}

module.exports={
    getNewAddress, getNewShieldAddress, getTransaction, sendToAddress, getTotalBalance, decodeRawTransactiontest
};