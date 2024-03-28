var express = require('express');
var router = express.Router();
const { RestClientV5 } = require('bybit-api');
const client = new RestClientV5();

/* GET home page. */
router.get('/', async function(req, res, next) {

  const data = await client.getMarkPriceKline({
    category: 'linear',
    symbol: 'BTCUSD',
    interval: '15',
    limit: 1,
  })

  res.send(`
  <html>
    <head>
      <title>BTC</title>  
      <meta property="og:title" content="BTC: ${data?.result?.list?.[0]?.[4] || 'to the moon'}">
      <meta property="og:image" content="/og/image/btc?s=${Date.now()}">
      </head>
    <body></body>
  </html>`);
});

module.exports = router;
