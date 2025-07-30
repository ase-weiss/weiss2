/**
 * AP Byte, bps 차트
 * @param chartId
 * @constructor
 */
var ApPerfSwitchChart = function(chartId, chartInfo) {
    this.chartId = chartId;
    this.chart = null;
};

ApPerfSwitchChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    labels: {formatter: HmHighchart.absUnit1000Formatter}
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: ' %',
                    formatter: HmHighchart.absUnit1000TooltipFormatter
                },
                series: [
                    {name: '수신 BPS', type: 'column', color: '#c22184'},
                    {name: '송신 BPS', type: 'column', color: '#2196c2'},
                    {name: '수신 BYTE', type: 'column', color: '#c22184'},
                    {name: '송신 BYTE', type: 'column', color: '#2196c2'}
                ]
            }, HmHighchart.TYPE_COLUMN);

    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var noDataFlag = 0;
        if(chartDataArr != null && chartDataArr.length > 0) {
            for(var i = 0; i < chartDataArr.length; i++) {
                HmHighchart.setSeriesData(this.chartId, i, chartDataArr[i], false);
                if(chartDataArr[i].length>0) noDataFlag = 1;
            }
            this.chart.yAxis[0].update({gridLineWidth: noDataFlag}, false);

            HmHighchart.redraw(this.chartId);
        }
        else {
            alert('차트데이터를 확인하세요.');
        }
        try{
            if(noDataFlag == 0){
                this.chart.showNoData();
            }else
                this.chart.hideNoData();
            this.chart.hideLoading();
        } catch(err){}
    }

    /**
     * 임계선 표시추가
     * @param value
     */
    var redrawAxisPlotLines = function(value) {
        HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
        HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line',  value, '임계치({0}%)'.substitute(value));
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, itemType: 1, mngNo: 1, itemIdx: 1, date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchData = function(params) {
        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;
        var esUse = params.esUse;
        var perfData = new PerfData();
        perfData.searchApPerf(_this, params, searchDataResult);
    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */

    var searchDataResult = function(params, result) {
        var chartDataArr = null;
        chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['RX_BPS', 'TX_BPS', 'RX_BYTE', 'TX_BYTE'], result);
        setSumData(result);
        updateBoundData.call(this, chartDataArr);
    }

    var setSumData = function(result){
        var rxBpsSum = 0;
        var txBpsSum = 0;
        var rxByteSum = 0;
        var txByteSum = 0;
        $.each(result, function (i, v) {
            rxBpsSum += v.RX_BPS;
            txBpsSum += v.TX_BPS;
            rxByteSum += v.RX_BYTE;
            txByteSum += v.TX_BYTE;
        })
        $("[name=rxBpsSum]").text(HmUtil.convertUnit1024(rxBpsSum));
        $("[name=txBpsSum]").text(HmUtil.convertUnit1024(txBpsSum));
        $("[name=rxByteSum]").text(HmUtil.convertUnit1024(rxByteSum));
        $("[name=txByteSum]").text(HmUtil.convertUnit1024(txByteSum));
    }
    var changeDataSet = function(chartId, perfTy) {
        if(perfTy == 'BYTE'){
            chartId.chart.series[0].hide()
            chartId.chart.series[1].hide()
            chartId.chart.series[2].show()
            chartId.chart.series[3].show()
        } else {
            chartId.chart.series[0].show()
            chartId.chart.series[1].show()
            chartId.chart.series[2].hide()
            chartId.chart.series[3].hide()
        }
    }
    var clearSeriesData = function() {
        try {
            $("[name=rxBpsSum]").text(0);
            $("[name=txBpsSum]").text(0);
            $("[name=rxByteSum]").text(0);
            $("[name=txByteSum]").text(0);

            var slen = this.chart.series.length;
            for (var i = 0; i < slen; i++) {
                this.chart.series[i].update({data: []}, false);
            }
            this.chart.yAxis[0].update({gridLineWidth: true}, false);
            HmHighchart.redraw(this.chartId);
        } catch(e) {}
    }

    /** remove the chart */
    var destroy = function() {
        HmHighchart.destroy(this.chart);
    }

    return {
        initialize: initialize,
        updateBoundData: updateBoundData,
        redrawAxisPlotLines: redrawAxisPlotLines,
        searchData: searchData,
        changeDataSet: changeDataSet,
        clearSeriesData: clearSeriesData,
        destroy: destroy
    }

}();