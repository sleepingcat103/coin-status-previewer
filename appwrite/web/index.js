
const { RestClientV5 } = require('bybit-api');
const client = new RestClientV5();

module.exports = async ({ req, res, log, error }) => {
  // log('Hello, Logs!');
  // error('Hello, Errors!');

  const symbol = 'btc'

  const data = await client.getMarkPriceKline({
    category: 'linear',
    symbol: 'BTCUSD',
    interval: '15',
    limit: 1,
  })
  
  return res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>BTC</title>  
      <meta property="og:title" content="BTC: ${data?.result?.list?.[0]?.[4] || 'to the moon'}">
      <meta property="og:image" content="${process.env.OG_IMAGE_API_URL}/${symbol}?s=${Date.now()}">
      </head>
    <body></body>
  </html>`);

};