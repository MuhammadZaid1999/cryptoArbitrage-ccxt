'use strict';
const ccxt = require('ccxt');

// console.log(ccxt.exchanges); list all exchanges that is provided by library 
(async function(){
    const binance = new ccxt.binance()
    // console.log("********************** BINANCE MARKET *********************")
    
    // ******************** Public Functions ***********************
    // await binance.loadMarkets() // initialize market data
    // console.log(await binance.fetchMarkets());
    const ticker = await binance.fetchTicker('BTC/USDT');
    // console.log(ticker.last) fetch current price
    // console.log(await binance.fetchCurrencies());
    // console.log(binance.currencies)  fetch all listed currencies of market 
    // console.log(binance.symbols)  fetch all trading pair of market
    // console.log(await binance.fetchOrderBook('BTC/USDT')) get the buy and sell prices of given pair
    // console.log(await binance.fetchTicker('BTC/USDT')) get info of trading pair such as datetime, high, low, bid, bid volume, bidPrice, high price, low price, price change, price percent change
    // console.log(await binance.fetchTickers()) get ticker info of all trading pairs 
    // console.log(await binance.fetchTrades('ETH/USDT')) fetch all buy and sell trades of market
    // console.log(await binance.fetchStatus()) fetch status of a market
    

    // ******************** Private Functions ***********************
    const exchange1 = new ccxt.binance({
        apiKey: '',
        secret: '',
    });
    // console.log(await exchange1.fetchBalance()) fetch all user balance against coins
    // console.log(await exchange1.fetchOrders('COTI/USDT'))  fetch buy and sell orders... price, amount and cost etc.
    // console.log(await exchange1.fetchOpenOrders('KAVA/BUSD')) fetch open orders of an account on given symbols
    // console.log(await exchange1.fetchCanceledOrders('KAVA/BUSD')) fetch canceled orders of an account on given symbols
    // console.log(await exchange1.fetchClosedOrders('KAVA/BUSD')) fetch closed orders of an account on given symbols
    // console.log(await exchange1.fetchMyTrades('BTC/USDT')) fetch trades of an account on given symbols

})();
