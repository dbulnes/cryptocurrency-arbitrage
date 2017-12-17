/**
 *
 */

'use strict';

console.log('Starting app...');

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.
const express = require('express');
const app = express(), 
    helmet = require('helmet'), 
    http = require('http').Server(app), 
    io = require('socket.io')(http); // For websocket server functionality

app.use(express.static('./frontend'));
app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
// app.use(cors({credentials: false}));
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(port, function () {
    console.log('listening on', port);
});


require('./settings.js')(); //Includes settings file.

let coinNames = [];
io.on('connection', function (socket) {
    socket.emit('coinsAndMarkets', [marketNames, coinNames]);
    socket.emit('results', results);
});

// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coin_prices = {}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.

function getMarketData(options, coin_prices, callback) { //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(options.URL, function (error, response, body) {
            try {
                if (options.marketName == "shapeshift") {
                    //console.log("DATA: " + data);
                    //console.log("BODY: " + body);
                }
                let data = JSON.parse(body);
                
                console.log("Success", options.marketName);
                if (options.marketName) {
                    let newCoinPrices;

                    newCoinPrices = options.lastPrice(data, coin_prices, options.toBTCURL);
                    if(options.marketName == "c-cex"){
                        //console.log(coin_prices);
                    }
                    numberOfRequests++;
                    if (numberOfRequests >= 1) computePrices(coin_prices);
                    resolve(newCoinPrices);

                }
                else {
                    resolve(data);
                }

            } catch (error) {
                console.log("Error getting JSON response from", options.URL, error); //Throws error
                reject(error);
            }

        });


    });
}

function computePrices(data) {
    if (numberOfRequests >= 2) {
        results = [];
        for (let coin in data) {

            if (Object.keys(data[coin]).length > 1){
                if(coinNames.includes(coin) == false) coinNames.push(coin);


            let arr = [];
                for (let market in data[coin]) {
                    arr.push([data[coin][market], market]);
                }
                arr.sort(function (a, b) {
                    return a[0] - b[0];
                });
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        results.push(
                            [
                                coin, 
                                arr[i][0] / arr[j][0], 
                                arr[i][0], arr[j][0], 
                                arr[i][1], arr[j][1] 
                            ], 
                            [
                                coin, 
                                arr[j][0] / arr[i][0], 
                                arr[j][0], 
                                arr[i][0], 
                                arr[j][1], 
                                arr[i][1]
                            ]
                        );
                    }
                }

            }
        }
        results.sort(function (a, b) {
            return a[1] - b[1];
        });
        //console.log(results);
        io.emit('results', results);
    }
}


(async function main() {
    let arrayOfRequests = [];

    for (let i = 0; i < markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coin_prices));
    }

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))

        .then(results => computePrices(coin_prices))

        .catch(e => console.log(e));

    setTimeout(main, 10000);
})();

// .then(v => {
//        // console.log(v);
//    });
