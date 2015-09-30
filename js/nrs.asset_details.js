var NRS = (function(NRS, $, undefined) {

	NRS.pages.p_asset_details = function() {
		var rows = "";
		var quantity = 0;
		NRS.sendRequest("getAccountAssets", {account: NRS.accountRS}, function(response) {
				$.each(response.accountAssets, function(i, assetinfo) {
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
	NRS.setup.p_asset_details = function() {
		//Do one-time initialization stuff here
	}
	return NRS;
}(NRS || {}, jQuery));

