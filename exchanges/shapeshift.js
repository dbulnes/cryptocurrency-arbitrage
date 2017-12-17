module.exports = (function() {
    "use strict";

/*
Example Shapeshift API response structure
[
    {
        "rate": "0.00178268",
        "limit": 144.62547683,
        "pair": "ETC_BTC",
        "maxLimit": 144.62547683,
        "min": 1.10533879,
        "minerFee": 0.001
    }
]
*/

    return { 
        marketName: 'shapeshift', 
        URL: 'https://shapeshift.io/marketinfo/', //URL To Fetch API From. 
        toBTCURL: false, //URL, if needed for an external bitcoin price api. 
        link: 'shapeshift.io', 
        pairURL : '',
        lastPrice: function (data, coin_prices) {  
            return new Promise(function (res, rej) {   
                try { 
                    for (let newMarket in data) {
                        if(data[newMarket].pair.includes('_BTC')) { 
                            let coinName = data[newMarket].pair.replace("_BTC", '').toUpperCase(); 
                            //If we dont want the given coin, return an empty object for that coin
                            if (!coin_prices[coinName]) {
                                coin_prices[coinName] = {}; 
                            }
                            coin_prices[coinName].shapeshift = data[newMarket].rate; 
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
