var HmBoxCondition = {

	/** create boxCondition */
	create : function($box, source, options) {
		var _id = $box.attr('id');
		$box.attr('class', 'tab_container_custom');

		var _boxId = _id  +'_box';
		var _target = $('<div id="'+ _boxId +'" class="tab-wrap">');
		var _divide = $('<div class="divide"></div>');
		try {
			$.each(source, function(i, v){
				_divide.append(
					$('<input id="tab_'+_id+'_'+i+'" type="radio" name="target_'+_id+'" value="'+v.value+'">'+
					'<label for="tab_'+_id+'_'+i+'" style="float: left" >'+v.label+'</label>')
				);
			});

			_target.append(_divide);
			$box.append(_target);
			$("input:radio[name=target_{0}]:first".substitute(_id)).attr('checked', true);
			// $('#tab_'+_id+'_0').attr('checked', 1);

		}catch (e) {}
	},

	/* radio */
	createRadio: function($div, source) {
		var docFrag = $(document.createDocumentFragment());
		var _id = $div.attr('id');
		$.each(source, function (i, v) {
			var _radioId = _id + i;
			docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
			docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio'}));
		});
		$div.append(docFrag);
	},
	/* radio */
	changeRadioSource: function($div, source) {
		var docFrag = $(document.createDocumentFragment());
		var _id = $div.attr('id');
		$div.empty();
		$.each(source, function (i, v) {
			var _radioId = _id + i;
			docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
			docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio'}));
		});
		$div.append(docFrag);
	},
	/* radio */
	disabledRadio: function(name, disabled) {
		// $('input[type="radio"]').prop('disabled', disabled);
		$("input[id^='{0}']".substitute(name)).attr('disabled',disabled);
		/*$("input[name='{0}']:checked".substitute(name)).css('disable', disabled);*/
	},	/* radio */
	clickRadio: function(name, value) {
		$("input:radio[id^='{0}']:input[value='{1}']".substitute(name, value)).attr("checked", true);

	},

	/* radioInput - 검색 */
	createRadioInput: function($div, source) {
		var docFrag = $(document.createDocumentFragment());
		var _id = $div.attr('id');
		$.each(source, function (i, v) {
			var _radioId = _id + i;
			var labelIdx = i + 1;
			var labelId = _id + labelIdx;

			docFrag.append($('<input/>', {id: _radioId, type: 'radio', name: _id, value: v.value, checked: i == 0}));
			docFrag.append($('<label/>', {for: _radioId, text: v.label, class: 'hm-radio', onclick: 'document.getElementById('+labelId+').focus();' }));
		});
        docFrag.append($('<input/>', {type: 'text', id: _id + '_input', style: 'display: block; margin-left: 3px;'}));
		$div.append(docFrag);
	},

	/* 실시간/기간 조건 생성
	*	@params
	* 	cid					기간 dom 생성시 unique id를 생성하기 위한 suffix
	* 	fn_searchCallback	'실시간' timer 사용시 'complete' 이벤트에 호출한 callback function
	* 	timer				'실시간' 사용시 timer 객체를 담을 변수
	* 	perfCycleNm			수집주기 radio name
	*
	**/

	createPeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
		cid = cid || '';
		$("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
			var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
			// value값에 단위가 존재하는 경우 예외처리 (m: minute)

			if(_unit.length) {
				_val = $(this).val().replace(/\D/ig,'');

				// clear timer
				if (timer != null) {
					clearInterval(timer);
				}
				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ disabled: true });
				//NIA 통계관련 시간제외 부분
                //$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ formatString: 'yyyy-MM-dd' });

				if(_unit != 'ALL') {
					Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
				}
			}
			else { // 0(실시간), -1(기간) 일때...
				if (_val == "0") {
					$(this).closest('div.tab_container').find('section.content1').css('display', 'inline-block');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'none');
					$("input:radio[name='sRef{0}']:last".substitute(cid)).click();
				}
				else {
					// clear timer
					if (timer != null) {
						clearInterval(timer);
					}
					$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
					$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
					if (_val != "-1") {
						Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
					}
				}
			}
			// 수집주기 radio가 존재하면 기간구분 선택에 따른 수집주기 설정 변경
			if(perfCycleNm !== undefined) {
				var _perfCycle = 2; // default = 2
				if(_val == '1') {
					_perfCycle = 1;
				}
				else if(_val == '365') {
					_perfCycle = 3;
				}
				$("input:radio[name={0}][value={1}]".substitute(perfCycleNm, _perfCycle)).click();
			}
		});

		// 실시간 조건
		$("input:radio[name='sRef{0}']".substitute(cid)).click(function() {
			var _val = $(this).val();
			if (timer != null) {
				clearInterval(timer);
			}
			if (_val > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar'+cid).val();
					if (curVal < 100)
						curVal += 100 / _val;
					$('#prgrsBar'+cid).val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar'+cid).val(0);
			}
		});
		$('#prgrsBar'+cid).jqxProgressBar({ width : 70, height : 20, theme: jqxTheme, showText : true, animationDuration: 0 })
			.on('complete', function(event) {
				$(this).val(0);
				if(fn_searchCallback != null) {
					fn_searchCallback();
				}
			});

		// date 조건
		HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

		// 구분 default = first element
		$("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
	},

	createTmsPeriod: function(cid, fn_searchCallback, timer, perfCycleNm) {
		cid = cid || '';

		// TMS는 5분단위로 설정
		$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid)))
			.on('valueChanged', function(event) {
				var jsDate = event.args.date;
				var mod = jsDate.getMinutes() % 5;
				if(mod == 1) {
					jsDate.setTime(jsDate.getTime() + (4 * 60 * 1000));
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
				else if(mod == 4) {
					jsDate.setTime(jsDate.getTime() - (4 * 60 * 1000));
					$(this).jqxDateTimeInput('setDate', jsDate);
				}
			});

		$("input:radio[name=sPeriod{0}]".substitute(cid)).click(function(event){
			var _val = $(this).val(), _unit = $(this).val().replace(/[0-9\-]/ig, '');
			// value값에 단위가 존재하는 경우 예외처리 (m: minute)
			if(_unit.length) {
				_val = parseInt($(this).val().replace(/\D/ig,''));
				if (timer != null) {
					clearInterval(timer);
				}
				$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
				$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
				$('#sDate1{0}'.substitute(cid)).add( $('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({ disabled: true });
				switch(_unit) {
					case 'm': //minute
						var toDate = new Date();
						var fromDate = new Date();
						if(_val == 5) {
							var min = Math.floor(fromDate.getMinutes() / 5) * 5;
							fromDate.setMinutes(min);
							toDate.setMinutes(min);
						}
						else if(_val == 10) {
							toDate.setMinutes(Math.floor(toDate.getMinutes() / 5) * 5);
							fromDate.setTime(toDate.getTime() - (5 * 60 * 1000));
						}
						else {
							fromDate.setTime(toDate.getTime() - (_val * 60 * 1000));
						}
						$('#sDate1{0}'.substitute(cid)).jqxDateTimeInput('setDate', fromDate);
						$('#sDate2{0}'.substitute(cid)).jqxDateTimeInput('setDate', toDate);
						break;
				}
			}
			else {
				if (_val == "0") {
					$(this).closest('div.tab_container').find('section.content1').css('display', 'inline-block');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'none');
					$("input:radio[name='sRef{0}']:last".substitute(cid)).click();
				} else {
					// clear timer
					if (timer != null) {
						clearInterval(timer);
					}
					$(this).closest('div.tab_container').find('section.content1').css('display', 'none');
					$(this).closest('div.tab_container').find('section.content2').css('display', 'inline-block');
					$('#sDate1{0}'.substitute(cid)).add($('#sDate2{0}'.substitute(cid))).jqxDateTimeInput({disabled: _val != "-1"});
					if (_val != "-1") {
						Master.radioCbPeriodCondition($("input[name='sPeriod{0}']:checked".substitute(cid)), $('#sDate1' + cid), $('#sDate2' + cid));
					}
				}
			}
			// 수집주기 radio가 존재하면 기간구분 선택에 따른 수집주기 설정 변경
			if(perfCycleNm !== undefined) {
				var _perfCycle = 2; // default = 2
				if(_val == '1') {
					_perfCycle = 1;
				}
				else if(_val == '365') {
					_perfCycle = 3;
				}
				$("input:radio[name={0}][value={1}]".substitute(perfCycleNm, _perfCycle)).click();
			}
		});

		// 실시간 조건
		$("input:radio[name='sRef{0}']".substitute(cid)).click(function() {
			var _val = $(this).val();
			if (timer != null) {
				clearInterval(timer);
			}
			if (_val > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar'+cid).val();
					if (curVal < 100)
						curVal += 100 / _val;
					$('#prgrsBar'+cid).val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar'+cid).val(0);
			}
		});
		$('#prgrsBar'+cid).jqxProgressBar({ width : 70, height : 20, theme: jqxTheme, showText : true, animationDuration: 0 })
			.on('complete', function(event) {
				$(this).val(0);
				if(fn_searchCallback != null) {
					fn_searchCallback();
				}
			});

		// date 조건
		HmDate.create($('#sDate1'+ cid), $('#sDate2'+ cid), HmDate.HOUR, 0);

		// 구분 default = first element
		$("input:radio[name=sPeriod{0}]:first".substitute(cid)).click();
	},

	refreshPeriod: function(cid) {
		cid = cid || '';
		var _sPeriod = $("input:radio[name=sPeriod{0}]:checked".substitute(cid)).val();
		if($.inArray(_sPeriod, ['0', '-1']) === -1) {
			$("input:radio[name=sPeriod{0}]:checked".substitute(cid)).click();
		}
	},

	getPeriodParams: function(cid) {
		cid = cid || '';
		var _period = "";
		if($("input[name='sPeriod{0}']:checked".substitute(cid)).val().indexOf("-") == 0){
			_period = "-" + $("input[name='sPeriod{0}']:checked".substitute(cid)).val().replace(/\D/ig,'');
		}else{
			_period = $("input[name='sPeriod{0}']:checked".substitute(cid)).val().replace(/\D/ig,'');
		}
		return {
			period: _period,
			date1: HmDate.getDateStr($('#sDate1'+cid)),
			time1: HmDate.getTimeStr($('#sDate1'+cid)),
			date2: HmDate.getDateStr($('#sDate2'+cid)),
			time2: HmDate.getTimeStr($('#sDate2'+cid))
		};
	},

	getSrchParams: function(radioNm) {
		if(radioNm === undefined) {
			radioNm = 'sSrchType';
		}
		var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
			_stext = $('#{0}_input'.substitute(radioNm)).val();
		return {
			sIp: _stype == 'IP'? _stext : null,
			sDevName: _stype == 'NAME'? _stext : null,
			sDevKind2: _stype == 'DEVKIND2'? _stext : null,
			sVendor: _stype == 'VENDOR'? _stext : null,
			sModel: _stype == 'MODEL'? _stext : null
		};
	},

	val: function(name) {
		return $("input[name='{0}']:checked".substitute(name)).val();
	},
	label: function(name) {
		var id = $("input[name='{0}']:checked".substitute(name)).attr('id');
		return $("label[for='{0}']".substitute(id)).text();
	},

	/** 선택된 Radio Value 리턴 */
	getValue: function($box) {
		if($box === undefined) {
			return null
		}
		var _id = $box.attr('id');
		return $("input[name='target_"+_id+"']:checked").val();
	}

};
