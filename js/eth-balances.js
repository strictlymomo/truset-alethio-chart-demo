(() => {

    const ID = "current-eth-balances"
    const CONTAINER = document.getElementById(ID);
    const WIDTH = 892;
    const HEIGHT = 20000;
    const DATA_URL = "data/current-eth-balances.csv";
    const KEYS = ['last_balance_change_BlockNumber', 'ETH_balance', 'address'];
    
    let currentBlock = 7679200;
    let chartData = [],
        chartData25 = [];

    d3.csv(DATA_URL).then(data => {
        /* This chart uses the following dimensional data structure
            https://ecomfe.github.io/echarts-doc/public/en/option.html#series-bar.encode */
        format(data);
        chartData25 = chartData.slice(0, 26);
        createChart(CONTAINER);
        
        function format(data) {
            chartData.push(KEYS);        
            data.forEach(d => {
                let datum = [];
                KEYS.forEach(k => {
                    (k === 'address') ? datum.push(d[k]) : datum.push(Number(d[k])); 
                });
                chartData.push(datum);                
            });                   
        }

        function getTimeSinceLastBalanceChange(lastBalanceChangedBlockNumber, currentBlockNumber) {
            return currentBlock - lastTx;
        }
        
        function createChart(container) {
            let el = document.createElement('div');
            el.setAttribute("id", ID);
            el.setAttribute("style", `width: ${WIDTH}px; height: ${HEIGHT}px; border: 1px solid #000;`);
            container.appendChild(el);
            let myChart = echarts.init(el);
            var option = {
                dataset: {
                    source: chartData,
                },
                series: [
                    {
                        type: 'bar',
                        encode: {
                            x: 'ETH_balance',   // Map the "ETH_balance" column to X axis.
                            y: 'address'        // Map the "address" column to Y axis
                        }
                    }
                ],
                grid: {containLabel: true},
                xAxis: {
                    name: 'Balance'
                },
                yAxis: {
                    type: 'category', 
                    inverse: true
                },
                visualMap: {
                    orient: 'horizontal',
                    left: 'center',
                    min: 6500000,
                    max: 8002128,
                    text: ["Last Tx Was Recent", "It's been a minute"],
                    dimension: 0,   // Map the score column to color
                    inRange: {
                        color: ['yellow', 'lightgreen', '#008ae5']
                    }
                },
                //tooltip: {},
            };
            myChart.setOption(option);
        }
    });
})();