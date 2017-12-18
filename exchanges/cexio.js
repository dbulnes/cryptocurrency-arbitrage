module.exports = (function() {
    "use strict";

/*
Example CEX.IO API response structure
[
    {
        "timestamp":"1513535718",
        "pair":"ETH:BTC",
        "low":"0.0351",
        "high":"0.03789963",
        "last":"0.03731922",
        "volume":"2687.28385300",
        "volume30d":"146002.45031900",
        "bid":0.03733001,
        "ask":0.03766713
    }
]
*/

    return { 
        marketName: 'cexio', 
        URL: 'https://cex.io/api/tickers/BTC', //URL To Fetch API From. 
        toBTCURL: false, //URL, if needed for an external bitcoin price api. 
        link: 'cex.io', 
        pairURL : '',
        lastPrice: function (data, coin_prices) {  
            return new Promise(function (res, rej) {   
                try { 
                    let newTicker = data.data;
                    for (let newMarket in newTicker) {
                        if(newTicker[newMarket].pair.includes(':BTC')) { 
                            let coinName = newTicker[newMarket].pair.replace(":BTC", '').toUpperCase(); 
                            //If we dont want the given coin, return an empty object for that coin
                            if (!coin_prices[coinName]) {
                                coin_prices[coinName] = {}; 
                            }
                            coin_prices[coinName].cexio = newTicker[newMarket].last; 
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
