var HmDate = {
		SECOND: "second",
		MINUTE: "minute",
		HOUR: "hour",
		DAY : "day",
		MONTH : "month",
		YEAR : "year",
		YESTERDAY: "yesterday",
		
		FS_LONG: 'yyyy-MM-dd HH:mm',
		FS_MIDDLE: 'yyyy-MM-dd HH',
		FS_SHORT: 'yyyy-MM-dd',
		
		/**
		 * jqWidget 날짜&시간 설정
		 */
		create: function($dt1, $dt2, strField, intGap, strFormat) {
			if(strFormat == null) strFormat = this.FS_LONG;
			var toDate = new Date();
			var fromDate = new Date();
			switch(strField) {
			case HmDate.SECOND: fromDate.setSeconds(fromDate.getSeconds() - intGap); break;
			case HmDate.MINUTE: fromDate.setMinutes(fromDate.getMinutes() - intGap); break;
			case HmDate.HOUR: fromDate.setHours(fromDate.getHours() - intGap); break;
			case HmDate.DAY: 
				if(intGap == 0) 
					fromDate.setHours(0, 0, 0, 0);
				else
					fromDate.setDate(fromDate.getDate() - intGap); 
				break;
			case HmDate.MONTH: fromDate.setMonth(fromDate.getMonth() - intGap); break;
			case HmDate.YEAR: fromDate.setYear(fromDate.getYear() - intGap); break;
			case HmDate.YESTERDAY:// DAY로 계산하면서 toDate를 어제날짜로 설정할 때 사용.18.03.16
				toDate.setDate(toDate.getDate() - 1);// to의 날짜 어제로 설정
				if(intGap == 0) 
					fromDate.setHours(0, 0, 0, 0);
				else
					fromDate.setDate(fromDate.getDate() - intGap); 
				
				break;
			}
			var _width = strFormat == this.FS_LONG? 130 : strFormat == this.FS_MIDDLE? 110 : 100;
			$dt1.add($dt2).jqxDateTimeInput({ width: _width, height: '22px', formatString: strFormat, theme: jqxTheme, culture: 'ko-KR' });
			$dt1.jqxDateTimeInput('setDate', fromDate);
			$dt2.jqxDateTimeInput('setDate', toDate);
		},
		
		/**
		 * 날짜를 yyyyMMddhhmm format 으로 리턴
		 */
		getDateTimeStr : function($dt, strFormat) {
			if (strFormat === undefined)
				strFormat = "yyyyMMddHHmm";
			return $.format.date($dt.val('date'), strFormat);
		},

		/**
		 * 날짜를 yyyyMMdd format 으로 리턴
		 */
		getDateStr : function($dt, strFormat) {
			if (strFormat === undefined)
				strFormat = "yyyyMMdd";
			return $.format.date($dt.val("date"), strFormat);
		},

		/**
		 * 시간을 hhmm format으로 리턴
		 */
		getTimeStr : function($dt, strFormat) {
			if (strFormat === undefined)
				strFormat = "HHmm";
			return $.format.date($dt.val("date"), strFormat);
		},
		
		/** 월,일,시,분,초 값 앞에 0 넣어주기 */
		addZero : function(str){
			if(str < 10) str = '0'+str;
			return str;
		},
		
		/** 기간 검사 */
		validation: function($dt1, $dt2, msg) {
			if(arguments.length < 2) { 
				alert('2개의 인자값이 필요합니다.');
				return false;
			}
			var datetime1 = $.format.date($dt1.val('date'), 'yyyyMMddHHmm');
			var datetime2 = $.format.date($dt2.val('date'), 'yyyyMMddHHmm');
			var msg = msg === undefined? '시작일은 종료일 이후 일 수 없습니다. \n기간을 확인해주세요.' : msg;
			if(datetime1 > datetime2) {
				alert(msg);
				return false;
			}
			return true;
		}
		
};


Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var week = Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
    return week < 10? '0' + week : week;
};