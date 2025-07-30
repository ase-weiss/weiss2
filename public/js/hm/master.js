var jqxTheme = 'ui-hamon', ctxPath = '';

if (!window.console) {
    window.console = {};
    console.log = function () {
    };
}

$(function () {
    Master.initVariable();
    Master.observe();
    Master.initDesign();
    Master.initData();
});

var Master = {
    initVariable: function () {
        ctxPath = $('#ctxPath').val();
        //파비콘 경로 netis 이미지 제거 swims로 제작필요
        var icoNm = '';
        var icoUrl = ctxPath + '/img/ico/' + icoNm;
        $('head').append('<link rel="shortcut icon" href="' + icoUrl + '" />');
    },

    observe: function () {
        $.ajaxSetup({cache: false});


        // 버튼 이력 쌓기
        $('.btn_A').on('click', function () {


            var actionName = $(this).text();
            Master.addActionLog(actionName);
        });
        // $(window).resize(function() {
        //     try {
        //         $('.jqx-splitter:first').jqxSplitter('refresh');
        //         if(Highcharts.charts) {
        //         	for(var i = 0; i < Highcharts.charts.length; i++) {
        //                 Highcharts.charts[i].reflow();
        // 			}
        // 		}
        //     } catch(e){}
        // });
        $('#btnBookmark').on('click', function (event) {
            var params = {
                menuNm: $('#navMenuNm').text(),
                menuNo: GlobalEnv.pageMenuNo
            };
            $.post(ctxPath + '/main/popup/comm/pBookmarkSetting.do', params, function (result) {
                HmWindow.open($('#pwindow'), '북마크 관리', result, 270, 410, 'pwindow_init', params);
                $('#pwindow').jqxWindow({position: {x: event.pageX - 260, y: 80}})
            });
        });
    },

    initDesign: function () {
        //메뉴생성
        if ($('#mega-menu') !== undefined) {
            $('#mega-menu').dcMegaMenu({
                rowItems: $('#gSiteName').val() == 'HyundaiCar' ? '1' : '6',
                beforeOpen: function () {
                    // rack화면에서 서브그리드 오픈시 z-index문제로 메뉴를 오픈하면 가려지는 현상발생
                    // 메뉴오픈전에 z-index를 조정하는 코드 추가
                    $('#mega-menu').css('z-index', 9999999);
                },
                onLoad: function () {
                    $('#mega-menu').css('visibility', 'visible');
                }
            });
        }
    },

    initData: function () {
        try {
            Master.setLoc();
            Master.setCommInit();

            // check bookmark icon
            if (window.GlobalEnv === undefined) return;
            Server.post('/main/popup/bookmark/getBookmarkCnt.do', {
                data: {menuNo: GlobalEnv.pageMenuNo},
                success: function (result) {
                    if (result > 0) {
                        $('#btnBookmark').css('background-position', '0 -13px');
                    } else {
                        $('#btnBookmark').css('background-position', '0 -1px');
                    }
                }
            });
        } catch (e) {
        }
        //document.title = "SWIMS";
    },

    // 공통초기화 (이미지, 버튼, Resource 등등)
    setCommInit: function () {
        try {
            var pwin = $('#pwindow');
            if (pwin.length == 0) {
                pwin = $('<div id="pwindow" style="position: absolute;"></div>');
                pwin.append($('<div></div>'));
                pwin.append($('<div></div>'));
                $('body').append(pwin);
            }
            HmWindow.create(pwin);
        } catch (e) {
        }

        $('#gEsIp').val($('#gEsHostNameYn').val() == 'Y' ? window.location.hostname : $('#gEsIp').val());

        HmResource.evt_level_list = [
            {label: $('#sEvtLevel1').val(), value: 1},
            {label: $('#sEvtLevel2').val(), value: 2},
            {label: $('#sEvtLevel3').val(), value: 3},
            {label: $('#sEvtLevel4').val(), value: 4},
            {label: $('#sEvtLevel5').val(), value: 5}
        ]
    },

    // location 영역 설정
    setLoc: function (event) {
        var urlPath = window.location.pathname;
        var reqMenuNo = $('#reqMenuNo').val() || '';
        $('#mega-menu li.level-3 a').each(function () {
            // 주소창 reload로 호출된 경우에는 reqMenuNo값이 넘어오지 않으므로 path를 기반으로 메뉴명 표시
            if(reqMenuNo.length == 0) {
                var href = $(this).attr('href');
                if(href.indexOf(urlPath) !== -1) {
                    var menu = $(this).text();
                    var menuNo = $(this).attr('data-menuNo');
                    var pageGrp = $(this).closest('li.level-2').children(':first').text();
                    var page = $(this).closest('li.level-1').children(':first').text();
                    $('#navMenuNm, #navPageMenu').text(menu);
                    $('#navPage').text(page);
                    $('#navPageGrp').text(pageGrp);
                    GlobalEnv.pageMenuNo = menuNo;

                    $(this).closest('li.level-1').addClass('mega-selected');
                    return false;
                }
            }
            // 기존 로직, reqMenuNo값을 사용한 네비게이션 표시
            else {
                var menuNo = $(this).attr('data-menuNo');
                if (reqMenuNo == menuNo) {
                    var menu = $(this).text();
                    var menuNo = $(this).attr('data-menuNo');
                    var pageGrp = $(this).closest('li.level-2').children(':first').text();
                    var page = $(this).closest('li.level-1').children(':first').text();
                    $('#navMenuNm, #navPageMenu').text(menu);
                    $('#navPage').text(page);
                    $('#navPageGrp').text(pageGrp);
                    GlobalEnv.pageMenuNo = menuNo;

                    $(this).closest('li.level-1').addClass('mega-selected');
                    return false;
                }
            }
        });
    },

    /** 로고 클릭시 메인화면으로 이동 */
    gotoMainPage: function () {
        if ($('#sUserAuthNo').val() != 4) {
            location.href = ctxPath + '/main/main2.do';
        } else {
            location.href = ctxPath + '/main/main3.do';
        }

    },

    /* page 이동 */
    gotoMenuPage: function (menuUrl, menuNo) {
        var frm = $('#hForm');
        var params = {
            menuNo: menuNo
        };
        frm.empty();
        if (params !== undefined && params !== null) {
            $.each(params, function (key, value) {
                $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
            });
        }
        //토폴로지 팝업으로 띄우라는 요청 처리 테스트 중
        if (menuUrl == '/d3map/topology.do') {
            //HmUtil.createFullPopup('/d3map/topology.do', $('#hForm'), 'pTopo', params);
            HmUtil.createPopup('/d3map/topology.do', $('#hForm'), 'pScanMultiAdd', screen.width, screen.height);
            return
        }
        //교직원용 캡티브포탈
        if (menuUrl == '/main/env/schlCaptive.do') {
            var myNeisCode = $("#sUserGrpCdoe").val();
            if(myNeisCode = ''){
                alert("사용자의 neisCode 값을 확인해주세요.")
                return
            }
            //추후 해당 값 파라메터 처리
            window.open('https://swims.or.kr/swims/teacher/view.do?nicecode=B107091420', "캡티브포털설정", 'top=10, left=10, width=1000, height=800, status=no, menubar=no, toolbar=no, resizable=no')
            return
        }

        $('#hForm').attr({
            method: 'POST',
            action: menuUrl,
            target: '_self'
        }).submit();
    },

    /** 대시보드 호출 Link */
    gotoDashLink: function (linkType, linkUrl) {
        //임시대시보드 이미지 팝업
        /*HmUtil.createPopup('/main/popup/ipt/pPhoneDetailInfo.do', $('#hForm'), 'pDashBoard', '1400', '900');
        return;*/
        if (linkType === undefined) {
            linkType = $('#gDashLinkType').val();
        }
        if (linkUrl === undefined) {
            linkUrl = $('#gDashLinkURL').val();
        }

        if (linkType === 'Layout') {
            var guid = linkUrl.substring(0, linkUrl.indexOf('/'));
            var grpType = linkUrl.substring(linkUrl.indexOf('/') + 1, linkUrl.length);
            Master.gotoLayoutPage(guid, grpType, 0, 0, false);
        } else {
            var url = linkUrl.split('?');
            var sendParams = {};
            if (url.length > 1) {
                var tmp = url[1].split('&');
                $.each(tmp, function (i, v) {
                    var tmpArr = v.split('=');
                    if (tmpArr.length == 2) {
                        sendParams[tmpArr[0]] = tmpArr[1];
                    }
                });
            }

            $.extend(sendParams, {
                userId: $('#sUserId').val(),
                inflow: 'NetisWeb'
            });

            var hostName = location.hostname;
            var protocol = location.protocol + "//";
            if(hostName.indexOf('swims') > - 1){
                var dashUrl = protocol + 'swims.or.kr:8081'.replace("localhost", hostName);
            }else{
                var dashUrl = protocol + url[0].replace("localhost", hostName);
            }
            console.log(dashUrl);
            HmUtil.createFullPopup(dashUrl, $('#hForm'), 'pDashBoard', sendParams);
        }
    },

    /** Link메뉴 호출 */
    gotoDashUrlLink: function (url, menuNo) {
        if (url.indexOf('/dashImg') > 0) {
            var tmp = url.split("/");
            delete tmp[0];
            delete tmp[1];
            delete tmp[2];
            var imgNm = tmp.filter(function (d) {
                return d.length > 1;
            }).join('/');
            var url = location.protocol + '//' + location.hostname + ':' + location.port + '/dashImg.jsp?img=' + imgNm;
            window.open(url, '_blank', "width=" + screen.availWidth + ",height=" + screen.availHeight).focus();
        } else {
            var _url = url.split('?');
            var params = {
                userId: $('#sUserId').val(),
                inflow: 'NetisWeb'
            };
            if (_url.length == 2) {
                var uri = JSON.parse('{"' + decodeURI(_url[1].replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
                $.extend(params, uri);
            }

            var chgUrl = _url[0];
            chgUrl = chgUrl.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, location.hostname);
            HmUtil.createFullPopup(chgUrl, $('#hForm'), HmUtil.generateUUID(), params);
        }
    },

    /** RACK 토폴로지 호출 */
    gotoRackTopo: function () {
        var url;
        url = location.protocol + '//' + location.hostname + ':' + location.port + '/map/RackTopology.do';
        HmUtil.createFullPopup(url, $('#hForm'), 'pNetisDash', {userId: $('#sUserId').val(), inflow: 'NetisWeb'});
    },


    /** Layout 호출 */
    gotoLayoutPage: function (guid, grpType, scondUse, rtUse, fullSize) {
        $('#hForm').empty();

        $('<input />', {type: 'hidden', name: 'guid', value: guid}).appendTo($('#hForm'));
        $('<input />', {type: 'hidden', name: 'grpType', value: grpType}).appendTo($('#hForm'));
        $('<input />', {type: 'hidden', name: 'scondUse', value: scondUse}).appendTo($('#hForm'));
        $('<input />', {type: 'hidden', name: 'rtUse', value: rtUse}).appendTo($('#hForm'));
        $('<input />', {type: 'hidden', name: 'fullSize', value: fullSize}).appendTo($('#hForm'));

        $('#hForm').attr({
            method: 'POST',
            action: ctxPath + '/main/layout/layout.do',
            target: '_self'
        }).submit();
    },

    /* call widgetPage */
    gotoWidgetPage: function (menuType, guid, scondUse, menuNo) {
        var frm = $('#hForm');
        var params = {
            menuType: menuType, guid: guid, scondUse: scondUse, menuNo: menuNo
        };
        frm.empty();
        if (params !== undefined && params !== null) {
            $.each(params, function (key, value) {
                $('<input />', {type: 'hidden', id: key, name: key, value: value}).appendTo(frm);
            });
        }
        /*$('#hForm').attr({
            method: 'POST',
            action: ctxPath + '/main/widget/widget.do',
            target: '_self'
        }).submit();*/

        var opts = [];
        var popNm = 'widgetPop'
        opts.push('fullscreen=yes');
        opts.push('resizable=yes');
        opts.push('scrollbars=yes');
        opts.push('status=no');

        opts.push('width=' + screen.width);
        opts.push('height=' + screen.height);
        window.open('', popNm, opts.join(',')).focus();
        frm.attr('method', 'POST');
        frm.attr('target', popNm);
        frm.attr('action', '/main/widget/widget.do');
        frm.submit();
        frm.empty();
    },

    /** LayoutGrid 호출 */
    gotoLayoutGridPage: function (guid, grpType) {
        $('#hForm').empty();
        $('<input />', {type: 'hidden', name: 'guid', value: guid}).appendTo($('#hForm'));
        $('<input />', {type: 'hidden', name: 'grpType', value: grpType}).appendTo($('#hForm'));
        $('#hForm').attr({
            method: 'POST',
            action: ctxPath + '/main/layout/layoutGrid.do',
            target: '_self'
        }).submit();
    },

    /** 우측상단 favicon 버튼 클릭 */
    clickFavicon: function (btnKey) {
        if (btnKey == 'DASH') {
            this.gotoDashLink();
        }
        else if (btnKey == 'MIB') {
            HmUtil.createPopup('/main/popup/com/pMibBrowser.do', $('#hForm'), 'pMibBrowser', 1500, 800);
        }
        else if (btnKey == 'TOPO') {
            location.href = ctxPath + '/d3map/topology.do';
        }
        else if (btnKey == 'ADMIN') {
            this.showUserConfEdit();
        }
        else if (btnKey == 'LOGOUT') {
            this.prcsLogout();
        }
        else if (btnKey == 'SITEMAP') {
            this.showSitemap();
        }
        else if (btnKey == 'BOOKMARK') {
            this.showBookmark();
        }
        else {
            alert(btnKey + '는 지원하지 않습니다.');
        }
    },

    showSitemap: function () {
        if ($('#hmSitemapWin').length == 0) {
            $('body').append($('<div></div>', {
                id: 'hmSitemapWin',
                style: 'overflow: hidden;'
            }));
        }
        $('#hmSitemapWin').load('/main/popup/comm/pSitemap.do', function (result) {
            $('#hmSitemap').css('display', 'block');
        });
        /*
        $.get('/main/popup/comm/pSitemap.do', function(result) {
            HmWindow.open($('#pwindow'), '사이트맵', result, $(window).width(), $(window).height());
        });

         */
    },

    //사용자 정보 편집 팝업
    showUserConfEdit: function () {
        var sUserAuthNo = $("#sUserAuthNo").val();
        var height = 215;
        if (sUserAuthNo == 4) {
            height = 215;
        }
        HmUtil.createPopup('/main/popup/env/pUserConfEdit.do?', $('#hForm'), 'pUserConfEdit', 450, height);
    },

    /** 북마크 리스트 */
    showBookmark: function () {
        var bmMenu = $('#bookmarkMenu');
        if (bmMenu.length == 0) {
            $('body').append($('<div></div>', {
                id: 'bookmarkMenu',
                style: 'position: absolute; top: 50px; right: 300px; z-index:999'
            }));
            bmMenu = $('#bookmarkMenu');
        }
        bmMenu.empty();
        // bmMenu.off('itemclick')
        // 	.on('itemclick', function(event) {
        // 		try {
        // 			var url = $(event.args).attr('item-value');
        // 			if (url.startsWith('javascript:')) {
        // 				eval(url.replace('javascript:', '').trim());
        // 			} else {
        // 				location.href = url;
        // 			}
        // 		} catch(e){console.log(e);}
        // 	});

        Server.post('/main/popup/bookmark/getBookmarkTreeList.do', {
            data: {isConfig: 'N'},
            success: function (result) {
                // console.log('result', result);
                var adapter = new $.jqx.dataAdapter({
                    datatype: 'json',
                    datafields: [
                        {name: 'id'},
                        {name: 'pid'},
                        {name: 'bmNm'},
                        {name: 'bmMenuNo'},
                        {name: 'bmUrl'}
                    ],
                    id: 'id',
                    localdata: result
                });
                adapter.dataBind();
                var records = adapter.getRecordsHierarchy('id', 'pid', 'items', [{
                    name: 'bmNm',
                    map: 'label'
                }, {name: 'bmUrl', map: 'value'}]);
                var _s = [];
                $.each(records, function (i, v) {
                    var _items = [];
                    if (v.hasOwnProperty('items') && v.items.length > 0) {
                        $.each(v.items, function (si, sv) {
                            _items.push({html: "<div class='bm-level2'><a href='" + sv.bmUrl + "'><img src='/lib/megamenu/skins/images/rec01_off.png'/><label class='bm-level2-text'>" + sv.bmNm + "</label></a></div>"});
                        });
                    }
                    if (_items.length > 0) {
                        _s.push({
                            html: "<img src='/lib/megamenu/skins/images/rec01_off.png'/><span class='bm-level1-text'>" + v.bmNm + "</span>",
                            subMenuWidth: '120px', items: _items
                        });
                    }
                    else {
                        _s.push({
                            html: "<img src='/lib/megamenu/skins/images/rec01_off.png'/><span class='bm-level1-text'>" + v.bmNm + "</span>",
                            subMenuWidth: '120px'
                        });
                    }
                });

                console.log(records);
                // bmMenu.jqxMenu({autoOpenPopup: false, mode: 'vertical', rtl: true, theme: jqxTheme, source: records, autoSizeMainItems: true});
                bmMenu.jqxMenu({
                    width: 150,
                    autoOpenPopup: false,
                    mode: 'popup',
                    rtl: true,
                    source: _s,
                    theme: 'ui-hamon-bm'
                });
                // bmMenu.css('visibility', 'visible');
                bmMenu.jqxMenu('open', $(window).width() - 200, 50)
            }
        });
    },

    /**
     * 로그아웃 처리
     */
    prcsLogout: function () {
        if (!confirm("로그아웃 하시겠습니까?")) return;
        $('#hForm').attr({
            method: 'post',
            action: ctxPath + '/login/prcsLogout.do',
            target: '_self'
        }).submit();
    },


    /** =============================
     * 좌측 > 그룹탭
     ==============================*/
    /** 그룹트리 생성(장비 포함) */
    createGrpTab: function (callbackFn, params) {
        if ($('#leftTab') === undefined) return;
        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, callbackFn, params);
                        break;
                    case 1:
                        HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, callbackFn, params);
                        break;
                    case 2:
                        HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF, callbackFn, params);
                        break;
                }
            }
        });
    },

    /** 그룹트리 생성(장비 미포함) */
    createGrpTab2: function (callbackFn) {
        if ($('#leftTab') === undefined) return;
        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT, callbackFn, null, ['grpName']);
                        break;
                    case 1:
                        HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH, callbackFn, null, ['grpName']);
                        break;
                    case 2:
                        HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF, callbackFn, null, ['grpName']);
                        break;
                }
            }
        });
    },

    /** 그룹트리 생성(장비 미포함) */
    createApGrpTab: function (callbackFn) {
        if ($('#leftTab') === undefined) return;
        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, callbackFn, null, ['grpName']);
                        break;
                    case 1:
                        HmTreeGrid.create($('#fGrpTreeGrid'), HmTree.T_AP_FILTER_GRP, null, {isRootSelect: 'true'}, ['grpName']);
                        break;
                }
            }
        });
    },

    /** 그룹탭 공통 파라미터 */
    getGrpTabParams: function () {

        var treeItem = null, _grpType = 'DEFAULT';
        switch ($('#leftTab').val()) {
            case 0:
                treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
                _grpType = 'DEFAULT';
                break;
            case 1:
                treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid'));
                _grpType = 'SEARCH';
                break;
            case 2:
                treeItem = HmTreeGrid.getSelectedItem($('#iGrpTreeGrid'));
                _grpType = 'IF';
                break;
        }

        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP', _grpRef = 0, _neisCode = '';

        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
            _grpRef = treeItem.grpRef;
            _neisCode = treeItem.grpCode;
        }

        return {
            grpType: _grpType,
            grpNo: _grpNo,
            grpParent: _grpParent,
            grpRef : _grpRef,
            itemKind: _itemKind,
            neisCode: _neisCode
        };

    },

    /** 기본그룹 트리 파라미터  */
    getDefGrpParams: function ($treeGrid) {
        if ($treeGrid === undefined && $('#grpTree').length != 0) {
            $treeGrid = $('#grpTree');
        }
        else if ($treeGrid === undefined && $('#dGrpTreeGrid').length != 0) {
            $treeGrid = $('#dGrpTreeGrid');
        }
        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
        var treeItem = HmTreeGrid.getSelectedItem($treeGrid);
        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : _itemKind == 'IF' ? treeItem.grpNo.split('_')[2] : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }

        return {
            grpType: 'DEFAULT',
            grpNo: _grpNo,
            grpParent: _grpParent,
            itemKind: _itemKind
        }
    },

    /** FW그룹 트리 파라미터  */
    getFwGrpParams: function ($treeGrid) {
        if ($treeGrid === undefined && $('#grpTree').length != 0) {
            $treeGrid = $('#grpTree');
        }
        var _grpNo = 0, _mngNo = 0, _svcId = 0, _grpParent = 0, _itemKind = 'GROUP';
        var treeItem = HmTreeGrid.getSelectedItem($treeGrid);
        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : -1;
            _mngNo = _itemKind == 'FIREWALL' ? treeItem.grpNo.split('_')[1] : _itemKind == 'VIRTUAL' ? treeItem.grpNo.split('_')[1] : -1;
            _svcId = _itemKind == 'VIRTUAL' ? treeItem.grpNo.split('_')[2] : -1;
            _grpParent = treeItem.grpParent;
        }

        return {
            grpType: 'DEFAULT',
            grpNo: _grpNo,
            mngNo: _mngNo,
            svcId: _svcId,
            grpParent: _grpParent,
            itemKind: _itemKind
        }
    },

    /** AP그룹 트리 파라미터  */
    getApGrpParams: function ($treeGrid) {

        var _grpType = 'DEFAULT', _grpNo = 0, _group = [], _model = [], _vendor = [], _ssid = [], _status = [],
            _itemKind = 'GROUP';

        var params = {};
        switch ($('#leftTab').val()) {
            case 0:
                var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
                _grpType = 'DEFAULT';
                if (treeItem != null) {
                    _itemKind = treeItem.devKind2;
                    $.extend(params, {
                        grpType: _grpType,
                        grpNo: _itemKind == 'GROUP' ? treeItem.grpNo : -1,
                        grpRef : _itemKind.grpRef,
                        itemKind: treeItem.devKind2
                    });
                }
                break;
            case 1:
                var treeItem = HmTreeGrid.getSelectedItem($('#fGrpTreeGrid'));
                _grpType = 'FILTER';
                if (treeItem != null) {
                    var checkedRows = $('#fGrpTreeGrid').jqxTreeGrid('getCheckedRows');
                    $.extend(params, {filterFlag: checkedRows.length});

                    for (var i = 0; i < checkedRows.length; i++) {
                        var rowData = checkedRows[i];
                        if (rowData.strGrpParent != 'G') {
                            switch (rowData.devKind2) {
                                case 'AP_GROUP':
                                    _group.push(rowData.grpNo);
                                    break;
                                case 'AP_VENDOR':
                                    _vendor.push(rowData.grpName);
                                    break;
                                case 'AP_SSID':
                                    _ssid.push(rowData.grpName);
                                    break;
                                case 'AP_STATUS':
                                    var status = rowData.grpName == 'Up' ? 1 : 2;
                                    _status.push(status);
                                    break;
                                case 'AP_MODEL':
                                    _model.push(rowData.grpName);
                                    break;
                            }
                        }
                    }

                    $.extend(params, {
                        grpType: _grpType,
                        itemKind: _itemKind
                    });

                    if (_group.length) {
                        $.extend(params, {apGrpNos: _group.join(',')});
                    }
                    if (_model.length) {
                        $.extend(params, {apModels: _model.join(',')});
                    }
                    if (_vendor.length) {
                        $.extend(params, {apVendors: _vendor.join(',')});
                    }
                    if (_ssid.length) {
                        $.extend(params, {apSsids: _ssid.join(',')});
                    }
                    if (_status.length) {
                        $.extend(params, {apStatuss: _status.join(',')});
                    }

                }
                break;
        }

        return params;
    },

    /** 서버그룹 트리 파라미터  */
    getSvrGrpParams: function ($treeGrid) {
        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
        var treeItem = HmTreeGrid.getSelectedItem($treeGrid);
        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }

        return {
            grpType: HmTree.T_GRP_SERVER,
            grpNo: _grpNo,
            grpParent: _grpParent,
            itemKind: _itemKind
        }
    },

    /** =============================
     * 공통 검색조건
     ==============================*/
    createPeriodCondition: function ($combo, $date1, $date2, $perfCycle) {
        if ($perfCycle !== undefined) {
            $perfCycle.jqxDropDownList({
                width: '80px', height: '21px', autoDropDownHeight: true, theme: jqxTheme, source: [
                    {label: '5분', value: '1'},
                    {label: '1시간', value: '2'},
                    {label: '1일', value: '3'}
                ], displayMember: 'label', valueMember: 'value', selectedIndex: 0
            });
        }
        $combo.jqxDropDownList({
            width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            displayMember: 'label', valueMember: 'value', selectedIndex: 0,
            source: [
                {label: '최근24시간', value: 1},
                {label: '최근1주일', value: 7},
                {label: '최근1개월', value: 30},
                {label: '최근1년', value: 365},
                {label: '사용자설정', value: -1}
            ]
        })
            .on('change', function (event) {
                switch (String(event.args.item.value)) {
                    case '-1':
                        $date1.add($date2).jqxDateTimeInput({disabled: false});
                        break;
                    default:
                        var toDate = new Date();
                        var fromDate = new Date();
                        fromDate.setDate(fromDate.getDate() - parseInt(event.args.item.value));
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date1.add($date2).jqxDateTimeInput({disabled: true});
                        break;
                }
                if ($perfCycle !== undefined) {
                    switch (String(event.args.item.value)) {
                        case '-1':
                            $perfCycle.jqxDropDownList('enableItem', 1);
                            //$perfCycle.jqxDropDownList('selectedIndex', 1)
                            break;
                        case '1':
                            $perfCycle.jqxDropDownList('enableItem', 1);
                            $perfCycle.jqxDropDownList('selectedIndex', 0);
                            break;
                        case '7':
                        case '30':
                            $perfCycle.jqxDropDownList('enableItem', 1);
                            $perfCycle.jqxDropDownList('selectedIndex', 1);
                            break;
                        case '365':
                            $perfCycle.jqxDropDownList('selectedIndex', 2);
                            $perfCycle.jqxDropDownList('disableItem', 1);
                            break;
                    }
                }
            });

        HmDate.create($date1, $date2, HmDate.DAY, 1);
        $date1.add($date2).jqxDateTimeInput({disabled: true});
    },

    createPeriodCondition2: function ($combo, $date1, $date2) {
        $combo.jqxDropDownList({
            width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            displayMember: 'label', valueMember: 'value', selectedIndex: 0,
            source: [
                {label: '현재', value: 0},
                {label: '최근24시간', value: 1},
                {label: '최근1주일', value: 7},
                {label: '최근1개월', value: 30},
                {label: '최근1년', value: 365},
                {label: '사용자설정', value: -1}
            ]
        })
            .on('change', function (event) {
                switch (String(event.args.item.value)) {
                    case '-1':
                        $date1.add($date2).jqxDateTimeInput({disabled: false});
                        break;
                    default:
                        var toDate = new Date();
                        var fromDate = new Date();
                        fromDate.setDate(fromDate.getDate() - parseInt(event.args.item.value));
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date1.add($date2).jqxDateTimeInput({disabled: true});
                        break;
                }
            });

        HmDate.create($date1, $date2, HmDate.HOUR, 0);
        $date1.add($date2).jqxDateTimeInput({disabled: true});
    },

    //airCube(최근3개월 검색 허용)
    createPeriodCondition3: function ($combo, $date1, $date2, dateFormat) {
        $combo.jqxDropDownList({
            width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            displayMember: 'label', valueMember: 'value', selectedIndex: 0,
            source: [
                {label: '최근24시간', value: 1},
                {label: '최근1주일', value: 7},
                {label: '최근1개월', value: 30},
                {label: '사용자설정', value: -1}
            ]
        })
            .on('change', function (event) {
                switch (String(event.args.item.value)) {
                    case '-1':
                        $date1.add($date2).jqxDateTimeInput({disabled: false});
                        break;
                    default:
                        var toDate = new Date();
                        var fromDate = new Date();
                        fromDate.setDate(fromDate.getDate() - parseInt(event.args.item.value));
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date1.add($date2).jqxDateTimeInput({disabled: true});
                        break;
                }
            });

        if (dateFormat != null) {
            HmDate.create($date1, $date2, HmDate.HOUR, 0, dateFormat);
        }
        else {
            HmDate.create($date1, $date2, HmDate.HOUR, 0);
        }
        $date1.add($date2).jqxDateTimeInput({disabled: true});
    },

    /** KB 은행 콜센터 녹취모니터링 0시~ 현재 */
    createPeriodCondition4: function ($combo, $date1, $date2) {

        $combo.jqxDropDownList({
            width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            displayMember: 'label', valueMember: 'value', selectedIndex: 0,
            source: [
                {label: '금일', value: 0},
                {label: '최근24시간', value: 1},
                {label: '최근1주일', value: 7},
                {label: '최근1개월', value: 30},
                {label: '최근1년', value: 365},
                {label: '사용자설정', value: -1}
            ]
        })
            .on('change', function (event) {
                switch (String(event.args.item.value)) {
                    case '-1':
                        $date1.add($date2).jqxDateTimeInput({disabled: false});
                        break;
                    case '0':
                        var toDate = new Date();
                        var fromDate = new Date();
                        fromDate.setHours(0);
                        fromDate.setMinutes(0);
                        fromDate.setSeconds(0);
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date1.add($date2).jqxDateTimeInput({disabled: true});
                        break;
                    default:
                        var toDate = new Date();
                        var fromDate = new Date();
                        fromDate.setDate(fromDate.getDate() - parseInt(event.args.item.value));
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date1.add($date2).jqxDateTimeInput({disabled: true});
                        break;
                }
            });
        HmDate.create($date1, $date2, HmDate.DAY, 0);
        $date1.add($date2).jqxDateTimeInput({disabled: true});

    },

    /**
     * TMS 5분단위용
     * @param $combo
     * @param $date1
     * @param $date2
     * @param type
     * @param dateFormat
     */
    createTmsPeriodCondition: function ($combo, $date1, $date2, type, dateFormat) {
        var _source = null;
        if (type === undefined) {
            _source = HmResource.getResource('period_tms_long_list');
        }
        else {
            switch (type) {
                case HmConst.period_type.tms_short:
                    _source = HmResource.getResource('period_tms_short_list');
                    break;
                case HmConst.period_type.tms_long:
                    _source = HmResource.getResource('period_tms_long_list');
                    break;
                default:
                    _source = HmResource.getResource('period_tms_long_list');
                    break;
            }
        }
        HmDate.create($date1, $date2, HmDate.HOUR, 0, dateFormat === undefined ? null : dateFormat);
        $date1.add($date2).jqxDateTimeInput({disabled: true});

        if (type == HmConst.period_type.tms_short) {
            $date1.add($date2).on('valueChanged', function (event) {
                var jsDate = event.args.date;
                var mod = jsDate.getMinutes() % 5;
                if (mod == 1) {
                    jsDate.setTime(jsDate.getTime() + (4 * 60 * 1000));
                    $(this).jqxDateTimeInput('setDate', jsDate);
                }
                else if (mod == 4) {
                    jsDate.setTime(jsDate.getTime() - (4 * 60 * 1000));
                    $(this).jqxDateTimeInput('setDate', jsDate);
                }
            });
        }
        $combo.jqxDropDownList({width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true, source: _source})
            .on('change', function (event) {
                var value = String(event.args.item.value);
                switch (value) {
                    case '-1':
                        $date1.add($date2).jqxDateTimeInput({disabled: false});
                        break;
                    default:
                        var toDate = new Date();
                        var fromDate = new Date();
                        var unit = value.substr(value.length - 1);
                        var itemVal = parseInt(value.substring(0, value.length - 1));
                        switch (unit) {
                            case 'm': // minute
                                if (itemVal == 5) {
                                    var min = Math.floor(fromDate.getMinutes() / 5) * 5;
                                    fromDate.setMinutes(min);
                                    toDate.setMinutes(min);
                                }
                                else if (itemVal == 10) {
                                    toDate.setMinutes(Math.floor(toDate.getMinutes() / 5) * 5);
                                    fromDate.setTime(toDate.getTime() - (5 * 60 * 1000));
                                }
                                else {
                                    fromDate.setTime(toDate.getTime() - (itemVal * 60 * 1000));
                                }
                                break;
                            case 'h': //hour
                                fromDate.setTime(toDate.getTime() - (1 * 60 * 60 * 1000));
                                toDate.setTime(toDate.getTime());
                                break;
                            case 'd': //day
                                if (itemVal != 0) {
                                    fromDate.setTime(fromDate.getTime() - (itemVal * 24 * 60 * 60 * 1000));
                                }
                                fromDate.setHours(0);
                                toDate.setHours(23);
                                toDate.setMinutes(59);
                                break;
                        }
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date1.jqxDateTimeInput('formatString', 'yyyy-MM');

                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date2.jqxDateTimeInput('formatString', 'yyyy-MM');
                        $date1.add($date2).jqxDateTimeInput({disabled: true});
                        break;
                }
            });
        $combo.jqxDropDownList('selectIndex', 0);
    },

    // 조회테이블 기간콤보
    createTableCntPeriodCondition: function ($combo, $date1, $date2, dateFormat) {
        $combo.jqxDropDownList({
            width: 60, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            displayMember: 'label', valueMember: 'value', selectedIndex: 0,
            source: [
                {label: '5분', value: 1},
                {label: '1시간', value: 2},
                {label: '1일', value: 3}
            ]
        });

        if (dateFormat != null) {
            HmDate.create($date1, $date2, HmDate.HOUR, 0, dateFormat);
        }
        else {
            HmDate.create($date1, $date2, HmDate.HOUR, 0);
        }
    },

    refreshCbPeriod: function ($cbPeriod) {
        var _selectedIndex = $cbPeriod.jqxDropDownList('getSelectedIndex');
        $cbPeriod.jqxDropDownList('clearSelection');
        $cbPeriod.jqxDropDownList('selectIndex', _selectedIndex);
    },

    //신규 검색 UI 호출.(comSearch1.jsp)
    //(구분(최근24,1주,년,월),기간,장비/IP)
    createSearchBar1: function ($periodBox, $dateBox, $srchBox) {
        //기간
        if ($dateBox !== undefined && $dateBox != "") {
            $dateBox.show();
            HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 0);
            $('#date1').add($('#date2')).jqxDateTimeInput({disabled: true});
        }
        //구분 라디오박스
        if ($periodBox !== undefined && $periodBox != "") {
            $periodBox.show();
            //구분 라디오 버튼 클릭 이벤트
            $("input:radio[name=cbPeriod]").click(function () {
                if ($("input[name='cbPeriod']:checked").val() == "-1") {//사용자설정
                    $('#date1').add($('#date2')).jqxDateTimeInput({disabled: false});
                } else {
                    Master.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));
                }
            });
            Master.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));
        }
        //장비/IP 검색
        if ($srchBox !== undefined && $srchBox != "") {
            $srchBox.show();
        }
    },
    //신규 검색 UI 호출.(comSearch2.jsp)
    //(구분(실시간,최근24,1주,년,월),주기,기간,기준,개수,장비/IP)
    createSearchBar2: function ($periodBox, $cycleBox, $dateBox, $sortBox, $topnBox, $srchBox) {
        //기간
        if ($dateBox !== undefined && $dateBox != "") {
            $dateBox.show();
            HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 0);
            $('#date1').add($('#date2')).jqxDateTimeInput({disabled: true});
        }
        //구분 라디오박스
        if ($periodBox !== undefined && $periodBox != "") {
            $periodBox.show();
            //구분 라디오 버튼 클릭 이벤트
            $("input:radio[name=cbPeriod]").click(function () {
                if ($("input[name='cbPeriod']:checked").val() == "-1") {//사용자설정
                    $('#date1').add($('#date2')).jqxDateTimeInput({disabled: false});
                } else {
                    Master.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));
                }
            });
            Master.radioCbPeriodCondition($("input[name='cbPeriod']:checked"), $('#date1'), $('#date2'));
        }
        //주기
        if ($cycleBox !== undefined && $cycleBox != "") {
            $cycleBox.show();
        }
        //기준
        if ($sortBox !== undefined && $sortBox != "") {
            $sortBox.show();
        }
        //개수
        if ($topnBox !== undefined && $topnBox != "") {
            $topnBox.show();
        }
        //장비/IP 검색
        if ($srchBox !== undefined && $srchBox != "") {
            $srchBox.show();
        }
    },
    //기간 조건 라디오버튼
    radioCbPeriodCondition: function ($combo, $date1, $date2) {
        var comboVal = parseInt($combo.val().replace(/\D/ig, '')),
            comboUnit = $combo.val().replace(/[0-9]/ig, '');

        var toDate = new Date(), fromDate = new Date();
        if (comboUnit.length) {
            switch (comboUnit) {
                case 'm': // minute
                    fromDate.setTime(fromDate.getTime() - (comboVal * 60 * 1000));
                    break;
                case 'h': // hour
                    fromDate.setTime(fromDate.getTime() - (comboVal * 60 * 60 * 1000));
                    break;
                case 'D': // date
                    fromDate.setTime(fromDate.getTime() - (comboVal * 24 * 60 * 60 * 1000));
                    break;
                case 'M': // month
                case 'W': // week
                case 'Y': //year
                    break;
                default:
                    fromDate.setDate(fromDate.getDate() - comboVal);
                    break;
            }
        }

        $date1.jqxDateTimeInput('setDate', fromDate);
        $date2.jqxDateTimeInput('setDate', toDate);
        $date1.add($date2).jqxDateTimeInput({disabled: true});
    },
    /**IP 선택 파라미터*/
    getSrchIp: function () {
        var sIP = "";
        if ($("input[name='srchType']:checked").val() == "I") { //IP선택
            sIP = $("#srchText").val();
        }
        return sIP;
    },
    /**장비 선택 파라미터*/
    getSrchDevName: function () {
        var sDevName = "";
        if ($("input[name='srchType']:checked").val() == "D") { //장비선택
            sDevName = $("#srchText").val();
        }
        return sDevName;
    },
    //주기 프로그레스바
    getProgressBar: function (callBack) {
        //주기 바.
        $('#prgrsBar').jqxProgressBar({width: 70, height: 20, theme: jqxTheme, showText: true, animationDuration: 0})
            .on('complete', function (event) {
                $(this).val(0);
                callBack();
            });
    },

    addActionLog: function (action) {
        var reqUri = window.location.pathname;
        var excludeAction = ['조회', '엑셀', '추가', '닫기'];
        var check = excludeAction.indexOf(action);
        if (check > -1) {
            return;
        } // 해당 버튼에 대한 이력은 쌓지 않음.
        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'ACTION_LOG_URL'},
            success: function (result) {
                $.each(result, function (idx, item) {
                    if (item.codeValue1 === reqUri) {
                        Server.post('/main/env/loginHist/addActionHist.do', {
                            data: {reqUri: reqUri, reqAction: action},
                            success: function (result) {
                            }
                        })
                    }
                });
            }
        });
    }
};
