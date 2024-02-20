sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/core/util/Export", "sap/ui/core/util/ExportTypeCSV"], function (
	e, t, r, n) {
	"use strict";
	return e.extend("com.nn.finance.interinvoicingadmin.controller.Main", {
		onInit: function () {},
		onClear: function (e) {
			var t = this.getView().getModel("Filter");
			t.getProperty("/InvoiceType", "");
			t.setProperty("/Status", "");
			t.setProperty("/FromDate", null);
			t.setProperty("/ToDate", null);
			t.getProperty("/Compcode", "");
			t.getProperty("/CompcodeReciever", "")
		},
		onSearch: function (e) {
			this.getView().setBusy(true);
			this._readWorkflows().then(this._readContext.bind(this))
		},
		onDataExport: function (e) {
			var t = new r({
				exportType: new n({
					separatorChar: ";"
				}),
				models: this.getView().getModel("Overview"),
				rows: {
					path: "/"
				},
				columns: [{
					name: "InvoiceType",
					template: {
						content: "{startEvent/invoiceFlow}"
					}
				}, {
					name: "Status",
					template: {
						content: "{statustext}"
					}
				}, {
					name: "Sender Initials",
					template: {
						content: "{startEvent/senderInitials}"
					}
				}, {
					name: "Sender C.Code",
					template: {
						content: "{startEvent/senderCcode}"
					}
				}, {
					name: "Receiver Initials",
					template: {
						content: "{startEvent/receiverInitials}"
					}
				}, {
					name: "Receiver C.Code",
					template: {
						content: "{startEvent/receiverCcode}"
					}
				}, {
					name: "Amount",
					template: {
						content: "{startEvent/totalAmount}"
					}
				}, {
					name: "Currency",
					template: {
						content: "{startEvent/currency}"
					}
				}, {
					name: "Created",
					template: {
						content: {
							parts: ["createdat"],
							formatter: function (e) {
								var t = sap.ui.core.format.DateFormat.getDateInstance({
									pattern: "yyyy-MM-dd"
								});
								return t.format(new Date(e))
							}
						}
					}
				}, {
					name: "Order number",
					template: {
						content: "{ordernumber}"
					}
				},{
					name: "Cost Center",
					template: {
						content: "{sndCostCenter}"
					}
				},{
					name: "WBS",
					template: {
						content: "{sndWbs}"
					}
				}
			]
			});
			t.saveFile().catch(function (e) {}).then(function () {
				t.destroy()
			})
		},
		_readWorkflows: function () {
			var sUri = this.getOwnerComponent().getManifestObject().resolveUri(this.getOwnerComponent().getManifestEntry("sap.app").dataSources.bpatrigger.uri);
			var e = "eu10.dev-cf-journalentry.ictest.processIntercompanyInvoicing";
			var t = this.getView().getModel("Filter");
			var r = t.getProperty("/Status");
			var n = t.getProperty("/FromDate");
			var o = t.getProperty("/ToDate");
			var filSndComp = t.getProperty("/Compcode");
			var filRcvComp = t.getProperty("/CompcodeReciever");
			var a = sUri + "?definitionId=" + e + "&$top=1000";
			if (r) {
				a = a + "&status=" + r
			}
			if (n) {
				a = a + "&startedFrom=" + n.toISOString()
			}
			if (o) {
				a = a + "&startedUpTo=" + o.toISOString()
			}
			// if (filSndComp) {
			// 	a = a
			// }
			return new Promise(function (e, t) {
				$.ajax({
					url: a,
					method: "GET",
					contentType: "application/json",
					dataType: "json",
					success: e,
					error: function (e) {
						t(e)
					}
				})
			})
		},
		_readContext: function (e) {
			var sUri = this.getOwnerComponent().getManifestObject().resolveUri(this.getOwnerComponent().getManifestEntry("sap.app").dataSources.bpatrigger.uri);
			var t = [];
			for (var r = 0; r < e.length; r++) {
				var n = new Promise(function (t, n) {
					var o = sUri + "/" + e[r].id + "/context";
					var a = r;
					$.ajax({
						url: o,
						method: "GET",
						contentType: "application/json",
						dataType: "json",
						success: function (r) {
							r.id = e[a].id;
							r.statustext = e[a].status;
							r.sndCostCenter = r.startEvent.orderitems[0].itemsObj[0].costCenter;
							r.sndWbs = r.startEvent.orderitems[0].itemsObj[0].wbs;
							r.createdat = new Date(e[a].startedAt);
							if (r.response && r.response.d) {
								r.ordernumber = r.response.d.Vbeln
							}
							t(r)
						}.bind(this),
						error: function (e) {
							n(e)
						}
					})
				});
				t.push(n)
			}
			Promise.all(t).then(this._updateList.bind(this))
		},
		_updateList: function (e) {
			var t = this.getView().getModel("Overview");
			var r = this.getView().getModel("Filter");
			var n = r.getProperty("/Compcode");
			var o = r.getProperty("/CompcodeReciever");
			var a = r.getProperty("/InvoiceType");
			if (n || o || a) {
				for (var i = 0; i < e.length;) {
					if (n && e[i].compcode !== n) {
						e.splice(i, 1)
					} else if (o && e[i].compcodeReciever !== o) {
						e.splice(i, 1)
					} else if (a && e[i].invoicetype !== a) {
						e.splice(i, 1)
					} else {
						i++
					}
				}
			}
			t.setData(e);
			this.getView().setBusy(false)
		}
	})
});