
const { RestClientV5 } = require('bybit-api');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const BybitClient = new RestClientV5();

module.exports = async ({ req, res, log, error }) => {
  const { target } = req.params;
  
  const canvasRenderService = new ChartJSNodeCanvas({ width: 100, height: 100 });
  const dataset = await kLineData('BTCUSD'); 
  const configuration = generateChartJsConfig(dataset.reverse())

  res.set('Content-Type', 'image/png');
  res.status(200);
  const stream = canvasRenderService.renderToStream(configuration);
  return stream.pipe(res);
};

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