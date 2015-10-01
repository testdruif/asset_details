var NRS = (function(NRS, $, undefined) {
	var getAsset = function(id, cb) {
		NRS.sendRequest("getAsset+", {"asset": id.toString()}, function(asset, input) {cb(asset);});
    };
    var getAssetBidPrice = function(id, cb) {
        NRS.sendRequest("getBidOrders+", {"asset": id.toString(),"firstIndex": 0,"lastIndex": 0}, function(response, input) {
            if (response.bidOrders.length > 0)
                cb(response.bidOrders[0]);
            else
                cb(null);
        });
    };
	var drawChart = function(name, title, contentData, size) {
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
    var draw = function(dataContent) {
        if (dataContent.length === NRS.accountInfo.assetBalances.length) {
            $('#asset_details_page>.content').prepend('<span id="DistributionChart"></span>');
            drawChart('DistributionChart', 'Asset Distribution', dataContent);
		} 
    };
	drawpie = function() {
		var dataContent = [];
        $.each(NRS.accountInfo.assetBalances, function(field, obj) {
			getAsset(obj.asset, function(asset) {
                if (asset) {
                    getAssetBidPrice(asset.asset, function(order) {
                        var price;
                        if (order)
                            price = order.priceNQT;
                        else
                            price = 1;
                        dataContent.push({
                            label: asset.name,
                            value: parseInt(obj.balanceQNT) * price / (Math.pow(10, 8))
                        });
                        draw(dataContent);
                    });
                }
            });
        });
	}
	AssetAmount = function() {
		NRS.sendRequest("getAccountAssetCount", {account: NRS.accountRS}, function(AssetAmount) {
			$("#asset_count").text(AssetAmount.numberOfAssets);
		});
	}
	AssetAccount = function() {
		$("#ass_acc").text(NRS.accountRS);
	}
	AssetInfo = function() {
		var rows = "";
		var quantity = 0;
		NRS.sendRequest("getAccountAssets", {account: NRS.accountRS}, function(response) {
			$.each(response.accountAssets, function(asset, assetinfo) {
				quantity = assetinfo.quantityQNT / Math.pow(10, assetinfo.decimals);
				rows += "<tr>";
				rows += "<td align = center>" + String(assetinfo.name).escapeHTML() + "</td>";
				rows += "<td align = center>" + String(quantity).escapeHTML() + "</td>";
				rows += "<td align = center><a href=https://www.mynxt.info/asset/" + String(assetinfo.asset).escapeHTML() + " target = iframe_info>" + "Open in myNXT" + "</a></td>";
				rows += "</tr>";
			});
		NRS.dataLoaded(rows);
		});
	}
	NRS.pages.p_asset_details = function() {
		AssetAccount();
		AssetAmount();
		AssetInfo();
		drawpie();
		NRS.dataLoaded();
	}
	
	return NRS;
}(NRS || {}, jQuery));
