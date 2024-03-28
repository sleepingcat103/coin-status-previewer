var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
const { RestClientV5 } = require('bybit-api');

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const BybitClient = new RestClientV5();

/* GET users listing. */
router.get('/image/:target', async function(req, res, next) {
  const { target } = req.params;
  console.log('draw og pic, target:', target)
  // 假設這是一些數據
  const canvasRenderService = new ChartJSNodeCanvas({ width: 100, height: 100 });

  // 設置數據
  const dataset = await kLineData('BTCUSD'); 

  // 使用 Chart.js 生成圖表配置
  const configuration = generateChartJsConfig(dataset.reverse())

  // 將圖片數據使用 stream 回傳給客戶端
  res.set('Content-Type', 'image/png');
  res.status(200);
  const stream = canvasRenderService.renderToStream(configuration);
  stream.pipe(res);

  // 使用 Chart.js Node Canvas 生成圖表
  // const image = await canvasRenderService.renderToBuffer(configuration);

  // const filename = `chart_${Date.now()}.png`;
  // const imagePath = path.join(__dirname, filename);
  // fs.writeFileSync(imagePath, image);
});

module.exports = router;

function generateChartJsConfig(dataset) {

  const now = dataset[dataset.length - 1];

  return {
    type: 'line',
    data: {
      labels: Array.from(dataset).fill(''),
      datasets: [{
        data: dataset,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        pointRadius: 0
      }, {
        data: Array.from(dataset).fill(now),
        fill: false,
        borderColor: 'red',
        pointRadius: 0
      }]
    },
    options: {
      plugins: {
        legend: false
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      },
    }
  };
}

function kLineData(symbol) {
  return BybitClient.getKline({ symbol, interval: '360' })
  .then((response) => {
    return (response?.result?.list || []).map(d => d[4])
  })
}