let chartColors =[
  "#246BEB",
  "#3D9BFF",
  "#3CD8F0",
  "#3FD898",
  "#BEE228",
  "#FFC000",
  "#FF6A00",
  "#D75B75",
  "#9785FF",
  "#E6AAFF",
  "#BF50D0",
  "#7A75FF",
  "#4D26FF"
];


function tempLineChart1(id){
Highcharts.chart(id, {
    chart: {
      type: 'line'
    },
    title: false,
    legend: {
    enabled: false
  },
    xAxis: {
      categories: [
        '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ],
      title: false,
      labels: {
        style: {
          color: '#373F57', 
          fontSize: '13 px'
        }
      },      
      crosshair: {
          width: 1,
          color: '#8491A7',   
          dashStyle: 'Solid',
        }
    },
 yAxis: {
      min: 0,
      max: 100,
      title: false,
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D7DCE5',
      labels: {
        formatter: function () {
          return this.value + '%';
        },
        style: {
          color: '#5E687F',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8491A7',
      style: {
        color: '#000',
        fontSize: '13px'
      },
      formatter: function () {
      let s = `<div class="n-chart-tooltip">`;
      s += `<b class="n-tit">${this.x}</b>`;
      s += `<ul class="n-list">`;
      this.points.forEach(point => {
        s += ` <li>
                 <span class="n-label"><span class="n-ic" style="background:${point.color};"></span>${point.series.name}</span><b style="font-weight:500;">${point.y.toFixed(2)}</b>
              </li>
        `;
      });
      s += `</ul></div>`;
      return s;
    }
    },
    
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 6,
              lineColor: null,
            }
          }
        },
        states: {
          hover: {
            halo: {
              size: 12, // 반투명 원 크기
              opacity: 0.15 // 반투명 정도
            },
            lineWidth: 2
          }
        }
      }
    },
    series: [{
      name: 'CPU 평균',
       type: 'area',
      data: [
        20, 20, 20, 20, 20, 20, 20, 20,
        20, 20, 22, 24, 28, 30, 32,
        35, 40, 42, 45.25, 40, 38, 36, 34
      ],
      color: '#246BEB',
      fillColor: {
         linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0.3, Highcharts.color('#246BEB').setOpacity(0.2).get('rgba')],
          [1, Highcharts.color('#246BEB').setOpacity(0).get('rgba')] 
        ]
      },
      fillOpacity: 0.1,
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: true, 
            radius: 5
          }
        },
        symbol: 'circle'
      },
       lineWidth: 1
    }, {
      name: '최대',
      data: [
        22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22
      ],
      color: '#FE6161',
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: true, 
            radius: 5
          }
        },
        symbol: 'circle'
      },
      lineWidth: 1
    }, {
      name: '최소', 
      data: [
        10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 15, 10, 10,
        10, 10, 10, 10, 10, 10, 10, 10
      ],
      color: '#8491A7',
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: true,
            radius: 5
          }
        },
        symbol: 'circle'
      },
      lineWidth: 1
    }]
  });  
}
function tempLineChart2(id) {
  Highcharts.chart(id, {
    chart: {
      type: 'line'
    },
    title: false,
    legend: {
      enabled: false
    },
    xAxis: {
      categories: Array.from({ length: 31 }, (_, i) => `${i + 1}일`),
      title: false,
      labels: {
        style: {
          color: '#373F57',
          fontSize: '13px'
        }
      },
      crosshair: {
        width: 1,
        color: '#8491A7',
        dashStyle: 'Solid'
      }
    },
    yAxis: {
      min: 0,
      max: 100,
      tickInterval: 20,
      title: false,
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: '#D7DCE5',
      labels: {
        style: {
          color: '#5E687F',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#8491A7',
      style: {
        color: '#000',
        fontSize: '13px'
      },
      formatter: function () {
        let s = `<div class="n-chart-tooltip">`;
        s += `<b class="n-tit">${this.x}</b>`;
        s += `<ul class="n-list">`;
        this.points.forEach(point => {
          s += ` <li>
                   <span class="n-label">${point.series.name}</span><b style="font-weight:500;">${point.y.toFixed(2)}</b>
                </li>
          `;
        });
        s += `</ul></div>`;
        return s;
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 6,
              lineColor: null
            }
          }
        },
        states: {
          hover: {
            halo: {
              size: 12,
              opacity: 0.15
            },
            lineWidth: 2
          }
        }
      }
    },
    series: [{
      name: 'Rate',
      data: [
        20, 22, 23, 25, 28, 26, 27, 30, 33, 32,
        34, 35, 37, 38, 36, 35, 33, 32, 30, 28,
        26, 25, 24, 22, 21, 20, 19, 18, 17, 17, 16
      ],
      color: '#246BEB',
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: true,
            radius: 5
          }
        },
        symbol: 'circle'
      },
      lineWidth: 1
    }]
  });
}


function tempWidgetBarChart(id, opts){

var option = $.extend(true, {
      chart: {
          type: 'bar'
      },
      title: {
          text: ''
      },
      xAxis: {
          title: false,
          labels: {
            style: {
              color: '#373F57', 
              fontSize: '11px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              width: '60px',   // 라벨 최대 너비
              display: 'inline-block'
            },
            useHTML: true,
            formatter: function () {
              const maxLength = 8; 
              return this.value.length > maxLength
                ? this.value.substring(0, maxLength) + '…'
                : this.value;
            }
          },
          
      },
      yAxis: {
          min: 0,
          // max: 100,
          tickInterval: 10,
          title: false,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: '#D7DCE5',
          labels: {
            format: '{value}%',
            style: {
              color: '#373F57', 
              fontSize: '11px'
            }
          },
          endOnTick: false,
          plotLines: [{
            value: 0,
            color: '#D7DCE5', // 제로라인 색상
            width: 1
        }] 
      },
      tooltip: {
        backgroundColor: '#fff',
        shared: true,
        useHTML: true,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#8491A7',
        style: {
          color: '#000',
          fontSize: '13px'
        },
        formatter: function () {
        let s = `<div class="n-chart-tooltip">`;
        s += `<b class="n-tit">${this.x}</b>`;
        s += `<ul class="n-list">`;
        this.points.forEach(point => {
          s += ` <li>
                  <span class="n-label">
                    <span class="n-ic" style="background:${point.color};"></span>
                    ${point.series.name}
                  </span>
                  <b style="font-weight:500;">${point.y.toFixed(2)}</b>
                </li>
          `;
        });
        s += `</ul></div>`;
        return s;
      }
      },
      legend: {
          enabled: false
      },
  }, opts);


    Highcharts.chart(id, option);
}


function tempWidgetLineChart(id, opts){

  var option = $.extend(true, {
      chart: {
          type: 'line',
      },
      title: { text: '' },
      xAxis: {
        tickLength: 0, 
        labels: {
            style: {
                color: '#373F57',
                fontSize: '12px'
            }
        },
      },
      yAxis: {
          min: 0,
          tickInterval: 15,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: '#D7DCE5',
          title: { text: null },
          labels: {
              style: {
                  color: '#373F57',
                  fontSize: '12px'
              }
          },
          plotLines: [{
            value: 0,
            color: '#D7DCE5',
            width: 1
        }] 
      },
      
      tooltip: {
        shared: true,
        useHTML: true,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#8491A7',
        style: {
          color: '#000',
          fontSize: '13px'
        },
        formatter: function () {
        let s = `<div class="n-chart-tooltip">`;
        s += `<b class="n-tit">${this.x}</b>`;
        s += `<ul class="n-list">`;
        this.points.forEach(point => {
          s += ` <li>
                  <span class="n-label"><span class="n-ic" style="background:${point.color};"></span>${point.series.name}</span><b style="font-weight:500;">${point.y.toFixed(2)}</b>
                </li>
          `;
        });
        s += `</ul></div>`;
        return s;
      }
      },
      legend: { enabled: false },
      
  }, opts);

  Highcharts.chart(id, option);
}


function tempGageChart(id, opts){

  var option = $.extend(true, {
       chart: {
      type: 'solidgauge',
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
    },
    title: null,
    tooltip: { enabled: false },
    exporting: { enabled: false },
    pane: {
      startAngle: 0,
      endAngle: 360,
      background: [{
        outerRadius: '100%',
        innerRadius: '88%',
        backgroundColor: '#EBEEF5',
        borderWidth: 0
      }]
    },
    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: []
    },
    
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: true,
          borderWidth: 0
        },
        linecap: 'round',
        rounded: true
      }
    },
    series: [{
        data: [{
          radius: '100%',
          innerRadius: '88%', 
        }]
    }],
    credits: {
      enabled: false
    }
      
  }, opts);

  Highcharts.chart(id, option);
}


function tempWidgetCircleChart(id, opts){

  var option = $.extend(true, {
    chart: {
    type: 'pie',
    spacing: [0, 0, 0, 0],
    margin: [0, 0, 0, 150],
    events: {
        render: function () {
          const chart = this;

          if (chart.series.length > 0) {
            // 도넛 중심 좌표 구하기
            const center = chart.series[0].center; // [x, y, innerR, outerR]
            const centerX = center[0] + chart.plotLeft;
            const centerY = center[1] + chart.plotTop + 8;

            if (!chart.customText) {
              chart.customText = chart.renderer.text('10', centerX, centerY)
                .attr({
                  align: 'center'
                })
                .css({
                  fontSize: '20px',
                  fontWeight: 'bold'
                })
                .add();
            } else {
              chart.customText.attr({
                x: centerX,
                y: centerY
              });
            }
          }
        }
      }
  },
  title: null,
 
  tooltip: {
    shared: true,
    useHTML: true,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#8491A7',
    style: {
      color: '#000',
      fontSize: '13px'
    },
    formatter: function () {
      let point = this.point;
      return `
        <div class="n-chart-tooltip">
          <b class="n-tit">${point.name}</b>
          <ul class="n-list">
            <li>
              <span class="n-label">
                <span class="n-ic" style="background:${point.color};"></span>
                ${this.series.name}
              </span>
              <b style="font-weight:500;">${point.y.toFixed(2)}</b>
            </li>
          </ul>
        </div>
      `;
    }
  },
  exporting: { enabled: false },
  legend: {
    align: 'left',
    verticalAlign: 'middle',
    layout: 'vertical',
    symbolHeight: 10, 
    symbolWidth: 10,
    symbolRadius: 2,
    itemMarginTop: 2,
    itemMarginBottom: 2,
    itemStyle: {
      fontSize: '11px',
      fontWeight: 'normal'
    }
  },
    
  plotOptions: {
    pie: {
      innerSize: '50%',
      center: ['50%', '50%'],
      dataLabels: {
        enabled: false
      },
      showInLegend: true
    }
  },
  credits: { enabled: false }
}, opts);

  Highcharts.chart(id, option);
}
