var NRS = (function(NRS, $, undefined) {

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
			rows += "<td>" + String(assetinfo.name).escapeHTML() + "</td>";
			rows += "<td>" + String(quantity).escapeHTML() + "</td>";
			rows += "<td><a href=https://www.mynxt.info/asset/" +  String(assetinfo.asset).escapeHTML() + " target = _blank>" + String(assetinfo.asset).escapeHTML() + "</a></td>";
			rows += "</tr>";
		});

	NRS.dataLoaded(rows);

	});
}

NRS.pages.p_asset_details = function() {
	AssetAccount();
	AssetAmount();
	AssetInfo();
}


return NRS;
}(NRS || {}, jQuery));

