(() => {
    
    const ID = "token-transfers"
    const CONTAINER = document.getElementById(ID);
    const WIDTH = 892;
    const HEIGHT = 500;
    const DATA_URL = "data/token-transfers.csv";

    let nodesByName = {};
    let nodes, links = [];

d3.csv(DATA_URL).then(data =>{

    /* 
        We represent token networks as directed cyclic graphs with value inflows and outflows. 
        We format the data into two lists: nodes (addresses) and edges (transfers). 
        To get a distribution of ERC20 token holders, use the nodes list in lieu of the "current ETH balances list". 
     */

    format(data);
    createChart(CONTAINER);

    function format(data) {
        // Create nodes for each unique source and target.
        data.forEach(function(datum) {
            datum.source = nodeByName(datum.fromAddr);
            datum.target = nodeByName(datum.toAddr);
        });

        // Extract the array of nodes from the map by name.
        nodes = d3.values(nodesByName);
        nodes.forEach(function (node) {
            node.itemStyle = {color: colors.navy};
            node.symbolSize = 3;
            node.value = node.symbolSize;
            // Use random x, y
            node.x = node.y = null;
            node.draggable = true;
        });

        links = [];
        data.forEach(function(d, i) {
            let link = {};
            link.id = i;
            link.source = d.fromAddr;
            link.target = d.toAddr;
            link.value = d.value;
            link.lineStyle = {width: (d.value/10000)};
            links.push(link);
        });                   
    }

    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = {name: name});
    }

    function createChart(container) {
        let el = document.createElement('div');
        el.setAttribute("id", ID);
        el.setAttribute("style", `width: ${WIDTH}px; height: ${HEIGHT}px; border: 1px solid #000;`);
        container.appendChild(el);
        let myChart = echarts.init(el);
        let option = {
            tooltip: {},
            animation: false,
            series : [
                {
                    type: 'graph',
                    layout: 'force',
                    data: nodes,
                    links: links,
                    roam: true,
                    force: {
                        repulsion: 10
                    },
                    focusNodeAdjacency: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        }
                    },
                    label: {
                        position: 'right',
                        formatter: '{b}',
                        fontSize: 4
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.3
                    },
                    emphasis: {
                        lineStyle: {
                            // width: 10
                            color: colors.green
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }
});
})();