import inquirer from 'inquirer';
import ccxt from 'ccxt';
import dotenv  from "dotenv";
dotenv.config()

const questions = [
    {
      type: 'input',
      name: 'pair',
      message: "Enter The Trading Pair Example: BTC/USDT ",
    },
    {
      type: 'number',
      name: 'quantity',
      message: "Enter The Quantity Example: 2 ",
    },
    {
      type: 'number',
      name: 'profit',
      message: "Enter The Profit Percentage Example: 0.1 ",
    },
];

// Define the exchanges
const exchanges = [
    new ccxt.binance({
        apiKey: process.env.EXCHANGE1_API_KEY,
        secret: process.env.EXCHANGE1_API_SECRET,
    }),
    new ccxt.coinbasepro({
        apiKey: process.env.EXCHANGE2_API_KEY,
        secret: process.env.EXCHANGE2_API_SECRET,
    }),
    new ccxt.kucoin({
        apiKey: process.env.EXCHANGE3_API_KEY,
        secret: process.env.EXCHANGE3_API_SECRET,
    }),
    new ccxt.bitget({
        apiKey: process.env.EXCHANGE4_API_KEY,
        secret: process.env.EXCHANGE4_API_SECRET,
    }),
    new ccxt.okx({
        apiKey: process.env.EXCHANGE5_API_KEY,
        secret: process.env.EXCHANGE5_API_SECRET,
    })
];

inquirer.prompt(questions).then(answers => {
    // Define the trading pair and initial parameters
    const symbol = answers.pair
    const profitPercentage = answers.profit
    const quantity = answers.quantity

    checkArbitrageOpportunity(symbol, quantity, profitPercentage)
});

async function checkArbitrageOpportunity(symbol, quantity, profitPercentage){
    try{
        // Fetch order book data from exchanges
        const [orderBook1, orderBook2, orderBook3, orderBook4, orderBook5] = await Promise.all([
            exchanges[0].fetchOrderBook(symbol),
            exchanges[1].fetchOrderBook(symbol),
            exchanges[2].fetchOrderBook(symbol),
            exchanges[3].fetchOrderBook(symbol),
            exchanges[4].fetchOrderBook(symbol),
        ]);

        // Get the best bid (buy) and ask (sell) prices from both exchanges
        const bidPrices = [
            orderBook1.bids[0][0],
            orderBook2.bids[0][0],
            orderBook3.bids[0][0],
            orderBook4.bids[0][0],
            orderBook5.bids[0][0],
        ];
        const minBidPrice = Math.min(...bidPrices);
        const findMinBidIndex = bidPrices.indexOf(minBidPrice);
        console.log('findMinBidIndex', findMinBidIndex)
        const exchangeForBuying = exchanges[findMinBidIndex];
        console.log('ExchangeForBuying', exchangeForBuying.name)
        
        const askPrices = [
            orderBook1.asks[0][0],
            orderBook2.asks[0][0],
            orderBook3.asks[0][0],
            orderBook4.asks[0][0],
            orderBook5.asks[0][0],
        ];
        const maxAskPrice = Math.max(...askPrices);
        const findMaxAskIndex = askPrices.indexOf(maxAskPrice);
        console.log('findMaxAskIndex', findMaxAskIndex)
        const exchangeForSelling = exchanges[findMaxAskIndex];
        console.log('ExchangeForSelling', exchangeForSelling.name)

        const calulateProfitPercentage = ((maxAskPrice - minBidPrice) / minBidPrice) * 100;
        if(calulateProfitPercentage >= profitPercentage){
            console.log(`Arbitrage opportunity found! Profit: ${profitPercentage.toFixed(2)}%`);

            await placeBuyOrder(exchangeForBuying, symbol, quantity, minBidPrice);
            await placeSellOrder(exchangeForSelling, symbol, quantity, maxAskPrice);
        }
    }
    catch(error){
        console.error(`An error occurred: ${error.message}`);
    }
}


async function placeBuyOrder(exchange, symbol, quantity, price) {
    try {
        const order = await exchange.createLimitBuyOrder(symbol, quantity, price);
        console.log('Buy order placed successfully:', order);
    } catch (error) {
        console.error('Error placing buy order:', error.message);
    }
}

async function placeSellOrder(exchange, symbol, quantity, price) {
    try {
        const order = await exchange.createLimitSellOrder(symbol, quantity, price);
        console.log('Sell order placed successfully:', order);
    } catch (error) {
        console.error('Error placing sell order:', error.message);
    }
}


