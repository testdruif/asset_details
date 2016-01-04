var NRS = (function(NRS, $, undefined) {
	var contentTable = [];
	var contentPie = [];

	getAsset = function(id, cb) {
		NRS.sendRequest("getAsset+", {"asset": id.toString()}, function(asset, input) {cb(asset);});
	};
	getAssetBidPrice = function(id, cb) {
		NRS.sendRequest("getBidOrders+", {"asset": String(id),"firstIndex": 0,"lastIndex": 0}, function(response, input) {
		if (response.bidOrders.length > 0)
			cb(response.bidOrders[0]);
		else
			cb(null);
		});
	};
	getAssetAskPrice = function(id, cb) {
		NRS.sendRequest("getAskOrders+", {"asset": id.toString(),"firstIndex": 0,"lastIndex": 0}, function(response, input) {
			if (response.askOrders.length > 0)
				cb(response.askOrders[0]);
			else
				cb(null);
			});
	};
	drawChart = function(name, title, contentData, size) {
		$('#' + name).empty();
		var pie = new d3pie(name, {
			"header": {
				"title": {
					"text": title,
					"fontSize": 22,
					"font": "verdana"
				},
				"subtitle": {
					"text": "",
					"color": "#999999",
					"fontSize": 10,
					"font": "verdana"
				},
				"titleSubtitlePadding": 12
			},
			"size": size || {
				"canvasHeight": 300,
				"canvasWidth": 600,
				"pieOuterRadius": "80%"
			},
			data: {
				"sortOrder": "value-desc",
				"smallSegmentGrouping": {
					"enabled": true,
					"value": 1
				},
				content: contentData
			},
			"labels": {
				"outer": {
					"pieDistance": 32
				},
				"inner": {
					"string": "{percentage}%"
				},
				"mainLabel": {
					"font": "verdana"
				},
				"percentage": {
					"color": "#e1e1e1",
					"font": "verdana",
					"decimalPlaces": 0
				},
				"value": {
					"color": "#e1e1e1",
					"font": "verdana"
				},
				"lines": {
					"enabled": true,
					"color": "#cccccc"
				},
				"truncation": {
					"enabled": true
				}
			},
			"tooltips": {
				"enabled": true,
				"type": "placeholder",
				"string": "{value} NXT"
			}
		});
	};
	AssetDrawPie = function(dataContent) {
			$('#asset_details_page>.content').prepend('<span id="DistributionChart"></span>');
			drawChart('DistributionChart', 'Asset Distribution', dataContent);
	};
	AssetAmount = function() {
		NRS.sendRequest("getAccountAssetCount", {account: NRS.accountRS}, function(AssetAmount) {
		$("#asset_count").text(AssetAmount.numberOfAssets);
		});
	}
	AssetTotalValue = function(totalvalue) {
		$("#asset_totalvalue").text(totalvalue);
	}
	AssetAccount = function() {
		$("#ass_acc").text(NRS.accountRS);
	}
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	
	AssetTimeLoaded = function() {
		$('#time_loaded').html(moment().format('LLL'));
	}
	function sortcolumn(a, b) {
		if (a[0] === b[0]) {
			return 0;
		}
		else {
			return (a[0] < b[0]) ? -1 : 1;
		}
	}
	AssetPrintout = function(content) {
			rows_asset_details = "";
			totalvalue = 0;
			content.sort(sortcolumn);
			for (var i=0; i < content.length; i++) {
				rows_asset_details += "<tr>";
				rows_asset_details += "<td align = left><a href=\"#\" data-goto-asset=\"" + content[i][1] + "\">" + content[i][2] + "</a></td>";
				rows_asset_details += "<td align = center>" + content[i][3] + "</td>";
				rows_asset_details += "<td align = center>" + content[i][4] + "</td>";
				rows_asset_details += "<td align = center>" + content[i][5] + "</td>";
				rows_asset_details += "<td align = center>" + content[i][6] + "</td>";
				rows_asset_details += "<td align = center><a href=https://www.mynxt.info/asset/" + content[i][1] + " target = iframe_info>" + "Info" + "</a></td>";
				rows_asset_details += "</tr>";
				totalvalue += content[i][4];
			}
			AssetTotalValue(totalvalue);
			NRS.dataLoaded(rows_asset_details);
	};
	AssetInfo = function() {
		NRS.sendRequest("getAccountAssets", {account: NRS.accountRS,includeAssetInfo: true}, function(response) {
			$.each(response.accountAssets, function(asset, assetinfo) {
				var Assetquantity = 0;
				var Assetvalue = 0;
				var Assetid = "";
				var Assetname = "";
				var AssetDecimal = "";
				Assetid = assetinfo.asset;
				Assetname = assetinfo.name;
				AssetDecimal = assetinfo.decimals;
				Assetquantity = assetinfo.quantityQNT / Math.pow(10, AssetDecimal);
				Assetvalue = Assetquantity / Math.pow(10, AssetDecimal);
								getAssetBidPrice(Assetid, function(bidorder) {
					var Assetaskprice = 0;
					var Assetaskpricerev = 0;
					var Assetbidprice = 0;
					var Assetbidpricerev = 0;
					if (bidorder) {
						Assetbidprice = bidorder.priceNQT * Math.pow(10,AssetDecimal);
					}
					else {
						Assetbidprice = 1;
					}
					getAssetAskPrice(Assetid, function (askorder) {
						if (askorder) {
							Assetaskprice = askorder.priceNQT * Math.pow(10,AssetDecimal);
						}
						else {
							Assetaskprice = 1;
						}
						Assetaskpricerev = Assetaskprice / (Math.pow(10,8));
						Assetbidpricerev = Assetbidprice / (Math.pow(10, 8));
						contentPie.push({label: Assetname,value: Assetquantity * Assetbidprice / (Math.pow(10, 8))});
						Assetvalue = Math.round(Assetquantity * Assetbidpricerev);
						contentTable.push([Assetname.toLowerCase(),Assetid,Assetname,Assetquantity,Assetvalue,Assetaskpricerev,Assetbidpricerev]);

					});
				});
			});
		});
	}

	NRS.setup.p_asset_details = function() {
		contentTable = [];
	        contentPie = [];
		AssetInfo();
	}

	NRS.pages.p_asset_details = function() {
		AssetTimeLoaded();
		AssetAccount();
		AssetAmount();
		AssetDrawPie(contentPie);
		AssetPrintout(contentTable);
	NRS.setup.p_asset_details();
	}
	return NRS;
}(NRS || {}, jQuery));
