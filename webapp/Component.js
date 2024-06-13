sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "com/nn/finance/interinvoicingadmin/model/models"], function (e, i, n) {
	"use strict";
	return e.extend("com.nn.finance.interinvoicingadmin.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			e.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(n.createDeviceModel(), "device");
			this.getModel("Overview").setSizeLimit(1e3);
			this.getModel("Overview").setData([]);
		}
	})
});