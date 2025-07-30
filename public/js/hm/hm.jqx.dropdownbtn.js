var HmDropDownBtn = {
		/** DropDownTree */
		createTree: function($btn, $tree, type, btnW, btnH, treeW, treeH, fnSelect, params, theme) {
			var url = undefined;
			if(theme === undefined) theme = jqxTheme;
			if($.isEmpty(params)) params = {};

			// dropDownButton
			$btn.jqxDropDownButton({ width: btnW, height: btnH, theme: theme, enableBrowserBoundsDetection: true });

			switch(type) {
			case HmTree.T_GRP_DEFAULT: url = '/grp/getDefaultGrpTreeList.do'; break;
			case HmTree.T_GRP_SEARCH: url = '/grp/getSearchGrpTreeList.do'; break;
			case HmTree.T_GRP_AUTHCONF: url = '/grp/getAuthConfDefaultGrpTreeListAll.do'; break;
			case HmTree.T_GRP_DEF_ALL: url = '/grp/getDefaultGrpTreeListAll.do'; break;
			case HmTree.T_GRP_IF: url = '/grp/getIfGrpTreeList.do'; break;
			case HmTree.T_GRP_SERVER: url = '/grp/getServerGrpTreeList.do'; break;
			case HmTree.T_GRP_MANG: url = '/grp/getMangGrpTreeList.do'; break;
			case HmTree.T_GRP_MANGFLOW: url = '/grp/getMangFlowGrpTreeList.do'; break;
			case HmTree.T_GRP_SERVICE: url = '/grp/getServiceGrpTreeList.do'; break;
			case HmTree.T_GRP_LINE: url = '/grp/getLineGrpTreeList.do'; break;
			default: return;
			}
			var adapter = new $.jqx.dataAdapter(
					{
						datatype: 'json',
						root: 'resultData',
						url: null
					},
					{
						autoBind: false,
						async: false,
						formatData: function(data) {
							$.extend(data, params);
							return data;
						},
						loadComplete: function(records) {
							// set icon img
							$.each(records.resultData, function(idx, obj) {
								obj.icon = ctxPath + '/img/folder.png';
							});
							adapter.records = records.resultData;
						}
					}
			);
			adapter._source.url = ctxPath + url;
			adapter.dataBind();
			var records = adapter.getRecordsHierarchy('grpNo', 'grpParent', 'items', [{ name: 'grpName', map: 'label' }, { name: 'grpNo', map: 'value' }]);
			$tree.on('initialized', function (event) {
				$(this).jqxTree('expandItem', $(this).jqxTree('getItems')[0]);
	        	$(this).jqxTree('selectItem', $(this).jqxTree('getItems')[0]);
	        })
	        .on('select', function(event) {
	        	var item = $(this).jqxTree('getItem', event.args.element);
				var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + item.label + '</div>';
				$btn.jqxDropDownButton('setContent', content);
				if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
				$btn.jqxDropDownButton('close');
	        });

			if(type == HmTree.T_GRP_AUTHCONF)
				$tree.jqxTree({ source: records, width: treeW, height: treeH, theme: theme, allowDrag: false, hasThreeStates: true, checkboxes: true });
			else
				$tree.jqxTree({ source: records, width: treeW, height: treeH, theme: theme, allowDrag: false });
		},

		/** DropDownTreeGrid */
		createTreeGrid: function($btn, $treeGrid, type, btnW, btnH, treeW, treeH, fnSelect, params, theme) {
			var url = undefined;
			if(theme === undefined) theme = jqxTheme;
			if($.isEmpty(params)) params = {};

            /**
			 * display=none일때 트리노드가 많아 overflow-y가 발생할경우 scroll이 생기지 않음. 강제로 block으로 전환
			 * 2018.12.17	by jjung
             */
            $treeGrid.css('display', 'block');

			// dropDownButton
			$btn.jqxDropDownButton({ width: btnW, height: btnH, theme: theme, enableBrowserBoundsDetection: true, autoOpen: false })
				.on('open', function(event) {
					$treeGrid.css('display', 'block');
				});

			switch(type) {
			case HmTree.T_GRP_DEFAULT: url = '/grp/getDefaultGrpTreeList.do'; break;
			case HmTree.T_GRP_SEARCH: url = '/grp/getSearchGrpTreeList.do'; break;
			case HmTree.T_GRP_AUTHCONF: url = '/grp/getAuthConfDefaultGrpTreeListAll.do'; break;
			case HmTree.T_GRP_DEF_ALL: url = '/grp/getDefaultGrpTreeListAll.do'; break;
			case HmTree.T_GRP_IF: url = '/grp/getIfGrpTreeList.do'; break;
			case HmTree.T_GRP_SERVER: url = '/grp/getServerGrpTreeList.do'; break;
			case HmTree.T_GRP_MANG: url = '/grp/getMangGrpTreeList.do'; break;
			case HmTree.T_GRP_MANGFLOW: url = '/grp/getMangFlowGrpTreeList.do'; break;
			case HmTree.T_GRP_SERVICE: url = '/grp/getServiceGrpTreeList.do'; break;
			case HmTree.T_GRP_SVCPORT: url = '/grp/getSvcPortGrpList.do'; break;
			case HmTree.T_GRP_TOPO: url = '/grp/getTopoGrpTreeList.do'; break;
			case HmTree.T_GRP_D3TOPO: url = "/grp/getD3TopoGrpTreeList.do"; break;
                case HmTree.T_GRP_LINE: url = '/grp/getLineGrpTreeList.do'; break;
			default: return;
			}

			var adapter = new $.jqx.dataAdapter(
					{
						datatype: 'json',
						root: 'resultData',
						url: ctxPath + url,
						hierarchy: {
							keyDataField: { name: 'grpNo' },
							parentDataField: { name: 'grpParent' }
						},
						id: 'grpNo'
					},
					{
						async: true,
						formatData: function(data) {
							$.extend(data, params);
							return data;
						}
					}
			);
			$treeGrid.jqxTreeGrid({
				source: adapter,
				width: treeW,
				height: treeH,
				theme: theme,
				altRows: false,
				pageable: false,
                filterable: true,
				showHeader: false,
				selectionMode: 'singleRow',
                icons : function(rowKey, rowData) {
                    try {
                        if(rowData.hasOwnProperty('devKind2')) {
                            switch(rowData.devKind2) {
                                case 'GROUP':
                                    if (type === HmTree.T_GRP_SEARCH && rowData.grpParent === 0) {
                                        return ctxPath + '/img/tree/SearchGrpGategory.png';
                                    } else {
                                        return ctxPath + '/img/tree/p_tree.png';
                                    }
                                case 'BACKBONE': case 'FIREWALL': case 'IPS': case 'L3SWITCH': case 'L4SWITCH':
                                case 'NAC': case 'QOS': case 'ROUTER': case 'SERVER': case 'SWITCH': case 'VPN': case 'WIPS':
                                return ctxPath + '/img/tree/' + rowData.devKind2 + '.png';
                                default:
                                    return ctxPath + '/img/tree/ETC.png';
                            }
                        }
                        else {
                            return ctxPath + '/img/tree/p_tree.png';
                        }
                    } catch (e) {
                        return ctxPath + '/img/tree/p_tree.png';
                    }
                },
//				ready: function() {
//					var uid = null;
//					var rows = $treeGrid.jqxTreeGrid('getRows');
//					if(rows != null && rows.length > 0) {
//						uid = $treeGrid.jqxTreeGrid('getKey', rows[0]);
//					}
//					if(uid != null) {
//						$treeGrid.jqxTreeGrid('expandRow', uid);
//						$treeGrid.jqxTreeGrid('selectRow', uid);
//						var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rows[0].grpName + '</div>';
//						$btn.jqxDropDownButton('setContent', content);
//						if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
//					}	
//				},
				columns:
				[
				 	{ text: '그룹', dataField: 'grpName' }
				]
			})
			.on('bindingComplete', function(event) {
				var uid = null;
				var rows = $treeGrid.jqxTreeGrid('getRows');
				if(rows != null && rows.length > 0) {
					uid = $treeGrid.jqxTreeGrid('getKey', rows[0]);
				}
				if(uid != null) {
					$treeGrid.jqxTreeGrid('expandRow', uid);
					$treeGrid.jqxTreeGrid('selectRow', uid);
					var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rows[0].grpName + '</div>';
					$btn.jqxDropDownButton('setContent', content);
					// if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
				}
			})
			.on('rowSelect', function(event) {
				var rowdata = event.args.row;
				var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rowdata.grpName + '</div>';
				$btn.jqxDropDownButton('setContent', content);
				if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
				$btn.jqxDropDownButton('close');
			});
		},

		/** DropDownTreeGrid: NIA 용 */
		createTreeGrid2: function($btn, $treeGrid, type, btnW, btnH, treeW, treeH, fnSelect, params, theme) {
			var url = undefined;
			if(theme === undefined) theme = jqxTheme;
			if($.isEmpty(params)) params = {};
			/**
			 * display=none일때 트리노드가 많아 overflow-y가 발생할경우 scroll이 생기지 않음. 강제로 block으로 전환
			 * 2018.12.17	by jjung
			 */
			$treeGrid.css('display', 'block');

			// dropDownButton
			$btn.jqxDropDownButton({ width: btnW, height: btnH, theme: theme, enableBrowserBoundsDetection: true, autoOpen: false })
				.on('open', function(event) {
					$treeGrid.css('display', 'block');
				});

			url = '/grp/getDefaultGrpTreeList.do';

			var adapter = new $.jqx.dataAdapter(
				{
					datatype: 'json',
					root: 'resultData',
					url: ctxPath + url,
					hierarchy: {
						keyDataField: { name: 'grpNo' },
						parentDataField: { name: 'grpParent' }
					},
					id: 'grpNo'
				},
				{
					async: true,
					formatData: function(data) {
						$.extend(data, params);
						data.grpRefSet = 3;
                        if(params.grpRefSet !== undefined){
                            data.grpRefSet = params.grpRefSet
                        }
                        // console.log("grpRefSet", data.grpRefSet)
						return data;
					}
				}
			);
			$treeGrid.jqxTreeGrid({
				source: adapter,
				width: treeW,
				height: treeH,
				theme: theme,
				altRows: false,
				pageable: false,
				showHeader: false,
				filterable: true, // 학교 검색을 위해서 추가
				selectionMode: 'singleRow',
				icons : function(rowKey, rowData) {
					try {
						if(rowData.hasOwnProperty('devKind2')) {
							var prefix = ctxPath + '/img/tree/v5.0.1/';
							switch(rowData.grpRef) {
								case 1:
									if (rowData.grpParent === 0) {
										return prefix + 'grpAll.png';
									} else {
										return prefix + 'grpTop.png';
									}
								case 2:
									return prefix + 'grpMidd.png';
								case 3:
									return prefix + 'grpBottom.png';
								default:
									return ctxPath + '/img/tree/ETC.png';
							}
						}
						else {
							return ctxPath + '/img/tree/p_tree.png';
						}
					} catch (e) {
						return ctxPath + '/img/tree/p_tree.png';
					}
				},
				columns:
					[
						{ text: '그룹', dataField: 'grpName' }
					]
			})
				.on('bindingComplete', function(event) {
					var uid = null;
					var rows = $treeGrid.jqxTreeGrid('getRows');
					if(rows != null && rows.length > 0) {
						uid = $treeGrid.jqxTreeGrid('getKey', rows[0]);
					}
					if(uid != null) {
						$treeGrid.jqxTreeGrid('expandRow', uid);
						$treeGrid.jqxTreeGrid('selectRow', uid);
						var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rows[0].grpName + '</div>';
						$btn.jqxDropDownButton('setContent', content);
						// if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
					}

					$.each(rows[0].records, function(idx, value, keyword) {
						if(params.grpRefSet != 4) {
							HmTreeGrid.visibleChildren($treeGrid, value, keyword);
						} else {
							if(params.grpParent === undefined || params.grpParent === 0 || params.grpParent === 1) return;
							var topGrpNo = $treeGrid.jqxTreeGrid('getRow', params.grpParent).parent.grpNo;
							if(value.grpNo == topGrpNo) {
								$treeGrid.jqxTreeGrid('expandRow', topGrpNo);
								$treeGrid.jqxTreeGrid('expandRow', params.grpParent);
								$treeGrid.jqxTreeGrid('selectRow', params.grpParent);
								return false;
							}
						}
					});

				})
				.on('rowSelect', function(event) {
					var rowdata = event.args.row;
					if(rowdata === undefined) return;
					var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rowdata.grpName + '</div>';
					$btn.jqxDropDownButton('setContent', content);
					if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
					$btn.jqxDropDownButton('close');
				})
				.on('filter', function(event) {
				if(event.args.filters.length == 0) return;
				var rows = $(this).jqxTreeGrid('getView');
				var keyword = event.args.filters[0].filter.getfilters()[0].value;
				if(rows.length == 0) return;
				var $treeGrid = $(this);
				$treeGrid.jqxTreeGrid('beginUpdate');
				// HmTreeGrid.openSearchNode($treeGrid);
				/** 하위노드에 대한 visible속성 제어 */
				$.each(rows[0].records, function(idx, value, keyword) {
					HmTreeGrid.visibleChildren($treeGrid, value, keyword);
				});
				$treeGrid.jqxTreeGrid('endUpdate');
				$treeGrid.jqxTreeGrid('refresh');
			});
		},

	/** DropDownTreeGrid: NIA 용 */
	createTreeGrid3: function($btn, $treeGrid, type, btnW, btnH, treeW, treeH, fnSelect, params, theme) {
		var url = undefined;
		if(theme === undefined) theme = jqxTheme;
		if($.isEmpty(params)) params = {};
		/**
		 * display=none일때 트리노드가 많아 overflow-y가 발생할경우 scroll이 생기지 않음. 강제로 block으로 전환
		 * 2018.12.17	by jjung
		 */
		$treeGrid.css('display', 'block');

		// dropDownButton
		$btn.jqxDropDownButton({ width: btnW, height: btnH, theme: theme, enableBrowserBoundsDetection: true, autoOpen: false })
			.on('open', function(event) {
				$treeGrid.css('display', 'block');
			});

		url = '/grp/getDefaultGrpTreeList.do';

		var adapter = new $.jqx.dataAdapter(
			{
				datatype: 'json',
				root: 'resultData',
				url: ctxPath + url,
				hierarchy: {
					keyDataField: { name: 'grpNo' },
					parentDataField: { name: 'grpParent' }
				},
				id: 'grpNo'
			},
			{
				async: true,
				formatData: function(data) {
					$.extend(data, params);
					data.grpRefSet = 3;
					if(params.grpRefSet !== undefined){
						data.grpRefSet = params.grpRefSet
					}
					// console.log("grpRefSet", data.grpRefSet)
					return data;
				}
			}
		);
		$treeGrid.jqxTreeGrid({
			source: adapter,
			width: treeW,
			height: treeH,
			theme: theme,
			altRows: false,
			pageable: false,
			showHeader: false,
			filterable: true, // 학교 검색을 위해서 추가
			selectionMode: 'singleRow',
			icons : function(rowKey, rowData) {
				try {
					if(rowData.hasOwnProperty('devKind2')) {
						var prefix = ctxPath + '/img/tree/v5.0.1/';
						switch(rowData.grpRef) {
							case 1:
								if (rowData.grpParent === 0) {
									return prefix + 'grpAll.png';
								} else {
									return prefix + 'grpTop.png';
								}
							case 2:
								return prefix + 'grpMidd.png';
							case 3:
								return prefix + 'grpBottom.png';
							default:
								return ctxPath + '/img/tree/ETC.png';
						}
					}
					else {
						return ctxPath + '/img/tree/p_tree.png';
					}
				} catch (e) {
					return ctxPath + '/img/tree/p_tree.png';
				}
			},
			columns:
				[
					{ text: '그룹', dataField: 'grpName' }
				]
		})
			.on('bindingComplete', function(event) {
				var uid = null;
				var rows = $treeGrid.jqxTreeGrid('getRows');
				console.log("rows:: ", rows)
				if(rows != null && rows.length > 0) {
					uid = $treeGrid.jqxTreeGrid('getKey', rows[0]);
				}
				if(uid != null) {
					$treeGrid.jqxTreeGrid('expandRow', uid);
					//$treeGrid.jqxTreeGrid('selectRow', uid);
					var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rows[0].grpName + '</div>';
					$btn.jqxDropDownButton('setContent', content);
				}

				$.each(rows[0].records, function(idx, value, keyword) {
					if(params.grpRefSet != 4) {
						HmTreeGrid.visibleChildren($treeGrid, value, keyword);
					} else {
						if(params.grpParent === undefined) return;
						var topGrpNo = $treeGrid.jqxTreeGrid('getRow', params.grpParent).parent.grpNo;
						if(value.grpNo == topGrpNo) {
							$treeGrid.jqxTreeGrid('expandRow', topGrpNo);
							$treeGrid.jqxTreeGrid('expandRow', params.grpParent);
							//$treeGrid.jqxTreeGrid('selectRow', params.grpParent);
							return false;
						}
					}
				});
				$treeGrid.jqxTreeGrid('selectRow', params.selRow);
			})
			.on('rowSelect', function(event) {
				var rowdata = event.args.row;
				// console.log("rowSelect", rowdata)
				if(rowdata === undefined) return;
				var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px;">' + rowdata.grpName + '</div>';
				$btn.jqxDropDownButton('setContent', content);
				if(fnSelect !== undefined && fnSelect !== null) fnSelect(event);
				$btn.jqxDropDownButton('close');
			})
			.on('filter', function(event) {
				if(event.args.filters.length == 0) return;
				var rows = $(this).jqxTreeGrid('getView');
				var keyword = event.args.filters[0].filter.getfilters()[0].value;
				if(rows.length == 0) return;
				var $treeGrid = $(this);
				$treeGrid.jqxTreeGrid('beginUpdate');
				// HmTreeGrid.openSearchNode($treeGrid);
				/** 하위노드에 대한 visible속성 제어 */
				$.each(rows[0].records, function(idx, value, keyword) {
					HmTreeGrid.visibleChildren($treeGrid, value, keyword);
				});
				$treeGrid.jqxTreeGrid('endUpdate');
				$treeGrid.jqxTreeGrid('refresh');
			});
	},

		/** DropDownGrid */
		createGrid: function($btn, $grid, type, btnW, btnH, gridW, gridH, params, theme) {
			var _url = undefined;
			if(theme === undefined) theme = jqxTheme;
			if($.isEmpty(params)) params = {};

			// dropDownButton
			$btn.jqxDropDownButton({ width: btnW, height: btnH, theme: theme, enableBrowserBoundsDetection: true })
				.on('open', function(event) {
					$grid.css('display', 'block');
				});
			$btn.jqxDropDownButton('setContent', '<div style="position: relative; margin-left: 3px; margin-top: 2px">선택하세요</div>');

			var _columns = null;
			switch(type) {
			case 'DEV':
				_url = '/dev/getDevList.do';
				_columns = [
		            { text: '장비명', datafield: 'devName', width: 150 },
		            { text: '사용자장비명', datafield: 'userDevName', width: 150 },
		            { text: 'IP', datafield: 'devIp', width: 120 },
		            { text: '모델', datafield: 'model', width: 130 },
		            { text: '제조사', datafield: 'vendor', width: 130 }
	            ];
				break;
			case 'L7SESS':
				_url: null;
                _columns = [
                    { text: '그룹', datafield: 'grpName', width: 130, pinned: true },
                    { text: '장비', datafield: 'devName', width: 130, pinned: true },
                    { text: '장비IP', datafield: 'devIp', width: 120 },
                    { text: 'Server', datafield: 'svrNm', width: 130 },
                    { text: 'IP', datafield: 'ip', width: 120 },
                    { text: 'Protocol', datafield: 'portType', displayfield: 'disPortType', width: 80 },
                    { text: 'Port', datafield: 'portNum', width: 80, cellsalign: 'right' }
                ];
				break;
			case 'DEV_KIND2':
                    _url = '/dev/getDevListForDevKind2.do';
                    _columns = [
                        { text: '장비번호', datafield: 'mngNo', width: 150, hidden: true },
                    	{ text: '장비명', datafield: 'devName', width: 100 },
                        { text: '사용자장비명', datafield: 'userDevName', width: 150 },
                        { text: 'IP', datafield: 'devIp', width: 90 },
                        { text: '모델', datafield: 'model', width: 100 },
                        { text: '제조사', datafield: 'vendor', width: 100 }
                    ];
                    break;
                case 'IF_FOR_DEV':
                    _url = '/dev/getIfListForDev.do';
                    _columns = [
                        { text: '회선번호', datafield: 'ifIdx', width: 150, hidden: true },
                        { text: '회선명', datafield: 'ifName', width: 100 },
                        { text: '사용자장비명', datafield: 'ifAlias', width: 150 },
                    ];
                    break;

			default: return;
			}

			HmGrid.create($grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: _url
						},
						{
							formatData: function(data) {
								$.extend(data, params);
								return data;
							}
						}
				),
                width: gridW !== undefined? gridW : '99.8%',
                height: gridH !== undefined? gridH : '99.8%',
				columns: _columns
			});
			$grid.on('rowselect', function(event) {
                var _selectionmode = $(this).jqxGrid('selectionmode');
                var _content = '선택하세요.';
                if ($.inArray(_selectionmode, ['singlerow']) !== -1) {
                    var conStr = ''
                	if(event.args.rowindex != undefined) {
                        console.log(event.args)

                        var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);

                        if(rowdata != null){
                        switch (type) {
                            case 'DEV_KIND2':
                                conStr = rowdata.devName;
                                break;
                            case 'IF_FOR_DEV':
                                conStr = rowdata.ifName;
                                break;
                            default :
                                conStr = rowdata.devName;
                        }
                        }
                    }
                    content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + conStr + '</div>';
                }
                else {
                    var idxes = $(this).jqxGrid('getselectedrowindexes');
                    if (idxes.length > 0) {
                        var rowdata = $(this).jqxGrid('getrowdata', idxes[0]);
                        content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.devName + (idxes.length > 1 ? ' 외 {0}'.substitute(idxes.length - 1) : '') + '</div>';
                    }
                }
                $btn.jqxDropDownButton('setContent', content);
            }).on('rowunselect', function(event) {
                // var idxes = $(this).jqxGrid('getselectedrowindexes');
                // var content = '선택하세요.';
                // if (idxes.length > 0) {
                //     var rowdata = $(this).jqxGrid('getrowdata', idxes[0]);
                //     content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.devName + (idxes.length > 1 ? ' 외 {0}'.substitute(idxes.length - 1) : '') + '</div>';
                // }
                //$btn.jqxDropDownButton('setContent', content);
			}).on('bindingcomplete', function(event) {
				$grid.jqxGrid('selectrow', 0);
			}).on('rowdoubleclick', function(event){
				$btn.jqxDropDownButton('close');
			});
		}
};