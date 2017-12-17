module.exports = (function() {
    "use strict";

/*
Example C-Cex API response structure
[
    "usd-btc": {
        "high": 0.00005615,
        "low": 0.00005105,
        "avg": 0.0000536,
        "lastbuy": 0.0000511,
        "lastsell": 0.00005177,
        "buy": 0.00005112,
        "sell": 0.00005176,
        "lastprice": 0.00005177,
        "updated": 1513472645
    }
]
*/

    return { 
        marketName: 'ccex', 
        URL: 'https://c-cex.com/t/prices.json', //URL To Fetch API From. 
        toBTCURL: false, //URL, if needed for an external bitcoin price api. 
        link: 'https://c-cex.com/', 
        pairURL : '',
        lastPrice: function (data, coin_prices) {  
            return new Promise(function (res, rej) {   
                try { 
                    for (let ticker in data) {
                        if(ticker.includes('-btc')) { 
                            let coinName = ticker.replace("-btc", '').toUpperCase(); 
                            //If we dont want the given coin, return an empty object for that coin
                            if (!coin_prices[coinName]) {
                                coin_prices[coinName] = {}; 
                            }
                            coin_prices[coinName].ccex = data[ticker].lastprice; 
                        } 
                    } 
                    res(coin_prices); 
                } catch(err) {  
                    console.log(err);
                    rej(err);
                } 
            }) 
        } 
    }
})();
