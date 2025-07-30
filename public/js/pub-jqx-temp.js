var jqxTheme = 'ui-hamon', ctxPath = '', userAuth = '', menuAuthNo = '';
var jqxThemeV1 = 'ui-hamon-v1';

function tempJqxTree(id, opts){
        var type = HmTree.T_GRP_DEFAULT2;
        var source =
        {
            dataType: "json",
            dataFields: opts.dataFields || {},
            hierarchy : {
                keyDataField : { name : 'grpNo' },
                // parentDataField :'strGrpParent' //'grpParent'
                parentDataField :{ name : 'grpParent' }
            },
            id : 'grpNo',
            url: opts.url ? opts.url : ''
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        // create Tree Grid
        // HmTreeGrid.create($('#jqxTreeList'), HmTree.T_GRP_DEFAULT_EVENT, selectTree, { pkgType: 'VSVR_HOST' });

        $(id).jqxTreeGrid(
        {
            width: '100%',
            height:'100%',
            theme: jqxThemeV1,
            source: dataAdapter,
            sortable: true,
            checkboxes: opts.checkboxes ? opts.checkboxes : false,
            ready: function()
            {
                $(id).jqxTreeGrid('collapseAll');
                $(id).jqxTreeGrid('expandRow', '1');

                //placeholder 추가  퍼블변경
                if($('.n-tree-area #filterjqxTreeList .jqx-input-group input').length > 0){
                    $('.n-tree-area #filterjqxTreeList .jqx-input-group input').attr('placeholder', '명칭 검색');
                    $('.n-tree-area #filterjqxTreeList .jqx-input-group input').parents('.n-tree').addClass('n-has-top-search')
                }
            },
            columns : [
            { text: '명칭', dataField: 'grpName',
                cellsRenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                    if(opts.temp){
                        return '트리메뉴명메뉴명';
                    }
                }
             },
            ],
            altRows : false,
            filterable :false,
            // filterMode: 'simple',
            autoRowHeight : false,
            pageable : false,
            showHeader : false,
            localization : getLocalization('kr'),
            selectionMode : 'singleRow',

            icons : function(rowKey, rowData) {
            try {
                if(rowData.hasOwnProperty('devKind2')) {
                    var _devKind2 = (rowData.devKind2 || '').toUpperCase();
                    // var _iconImg = 'etc.svg';
                    var _iconImg = '';
                    switch(_devKind2) {
                        case 'GROUP':
                             //_iconImg = 'group.svg';
                             // 퍼블변경
                                 if(rowData.grpRef == 3) {
                                    _iconImg = 'grpBottom.png';
                                }
                            break;
                        case 'BACKBONE':
                            _iconImg = 'backbone.svg';
                            break;
                        case 'FIREWALL':
                            _iconImg = 'firewall.svg';
                            break;
                        case 'ROUTER':
                            _iconImg = 'router.svg';
                            break;
                        default:
                            if(_devKind2.endsWith('SWITCH')) {
                                _iconImg = 'switch.svg';
                            }else if(_devKind2.toUpperCase().indexOf('WIN')>-1){
                                _iconImg = 'windows.svg'
                            }else if(_devKind2.toUpperCase().indexOf('LINUX')>-1){
                                _iconImg = 'linux.svg'
                            }else if(_devKind2.toUpperCase().indexOf('AIX')>-1){
                                _iconImg = 'aix.svg'
                            }else if(_devKind2.toUpperCase().indexOf('SOLAR')>-1){
                                _iconImg = 'solaris.svg'
                            }else if(_devKind2.toUpperCase().indexOf('HP')>-1){
                                _iconImg = 'hpux.svg'
                            }
                            else {
                                // _iconImg = 'etc.svg';
                                _iconImg = (rowData.hasOwnProperty('devKind1') && rowData.devKind1 == 'SVR') ? 'server.svg' : 'etc.svg';
                            }
                            break;
                    }
                    // 퍼블변경
                    return _iconImg ? '../img/tree/v5.0.1/' + _iconImg : '';
                }
                else {
                    return'../img/tree/p_tree.png';
                }
            } catch (e) {
                return '../img/tree/p_tree.png';
            }
        },
        });    
      
}


function tempJqxGrid(id, opts, localData){
    let initCheckNextCellW = 0
    var source = {
        datatype: "json",

        // id: 'ProductID',
        localdata: localData
    };

    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        var color = value < 20 ? '#ff0000' : '#008000';
        return `<span style="margin: 4px; margin-top:8px; float: ${columnproperties.cellsalign}; color: ${color};">${value}</span>`;
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var option = $.extend(true, {
        source: dataAdapter,
        width : "100%",
        height : "100%",
        autoheight : false,		/* loading slow */
        autorowheight: false,		/* loading slow */
        theme : jqxTheme,
        pageable : true,
        pagermode: 'simple',
        columnsresize : true,
        showstatusbar : false,
        selectionmode : "singlerow",
        enabletooltips : true,
        columnsheight: 40, // 퍼블변경
        rowsheight: 42, //퍼블변경
        filterrowheight: 30,
        toolbarheight : 30,
        sortable : true,
        altrows: false,
        enablebrowserselection : true,
        showpinnedcolumnbackground: false,
        showsortcolumnbackground : false,
        pagerheight: 35,    // pagerbar height
        pagerrenderer : HmGrid.pagerrenderer,
        pagesize : 1000,
        pagesizeoptions: ["10", "20", "50", "100"],
        localization : getLocalization('kr'),
    
        // selectionmode: 'multiplecellsadvanced',
        selectionmode: 'none',
        // selectionmode: 'checkbox',
        // columns: opts.columns || [], 
        rendered: function () {
            if(this.selectionmode == 'checkbox'){
                customizeCheckboxColumn(id, 10);
                setTimeout(function () {
                    customizeCheckboxColumn(id, 10);
                }, 200);

                let resizeTimer;
                $(window).on('resize', function () {
                    if (resizeTimer) {
                        clearTimeout(resizeTimer);
                    }
                    customizeCheckboxColumn(id, 10);

                    resizeTimer = setTimeout(function () {
                        customizeCheckboxColumn(id, 10);
                    }, 200);
                });                
            }
        }
    }, opts);


    // jqxGrid 초기화
    $(id).jqxGrid(option);  
    if (option.pageable) {
        $(id).addClass("n-has-pager");
    }


    function customizeCheckboxColumn(id, size) {
        if($(id).parents().hasClass('n-st2')) return;
        // 셀
        $(id + ' .jqx-grid-cell').each(function () {
            if ($(this).index() === 0) {
                $(this).attr('data-class', 'checkbox-cell').width(50);
            }
        });

        // 헤더
        $(id + ' .jqx-grid-column-header').each(function () {
            if ($(this).index() === 0) {
                $(this).attr('data-class', 'checkbox-cell').width(50);
            }
        });
    }


}