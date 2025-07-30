/**
 * niaData
 * @param chartId
 * @constructor
 */
var NiaData = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

NiaData.prototype = function() {

    var initialize = function() {

    };

    // PoE 가동율현황
    var searchErrStatus = function(_this, params, searchDataResult){
        Server.get('/main/stat/errStatus/getErrStatusData.do', {
            data: params,
            success: function(result) {
                var list2 = [
                    {day: 1624892400000, value1: 39, value2:53, value3: 71},
                    {day: 1624978800000, value1: 23, value2:42, value3: 35},
                    {day: 1625065200000, value1: 62, value2:51, value3: 45},
                    {day: 1625151600000, value1: 98, value2:28, value3: 48},
                    {day: 1625238000000, value1: 77, value2:59, value3: 26},
                    {day: 1625324400000, value1: 54, value2:89, value3: 19},
                    {day: 1625410800000, value1: 46, value2:36, value3: 54}
                ];
                searchDataResult.call(_this, params, list2);
                // searchDataResult.call(_this, params, result);
            }
        });
    };



    return {
        initialize: initialize,
        searchErrStatus: searchErrStatus,
    }

}();