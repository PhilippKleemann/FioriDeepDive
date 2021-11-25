sap.ui.define([
	"at/clouddna/training14/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"at/clouddna/training14/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, MessageBox, Fragment, formatter, History) {
	"use strict";

	return BaseController.extend("at.clouddna.training14.FioriDeepDive.controller.Customer", {
		_fragmentList: {},
		_sMode: "",
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let sCustomerId = oEvent.getParameter("arguments").customerid;

			let editModel = new JSONModel({
				editMode: false
			});

			this.setModel(editModel, "editModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this.getView().bindElement({
					path: "/CustomerSet(guid'" + sCustomerId + "')",
					events: {
						dataRequested: function () {
							this.logInfo("Customer" + sCustomerId + "was requested");
							this.getView().setBusy(true);
						}.bind(this),
						dataReceived: function (oData) {
							if (oData.getParameter("data")) {
								this.logInfo("Customer" + sCustomerId + "was received");
							} else {
								this.logError("Customer" + sCustomerId + "was not found");
							}
							this.getView().setBusy(false);
						}.bind(this)
					}

				});
				this.logInfo("Display Customer");
			} else {
				this._sMode = "create";

				let createModel = new JSONModel({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "",
					Email: "",
					Phone: "",
					Website: ""
				});

				this.setModel(createModel, "createModel");
				editModel.setProperty("/editMode", true);
				this._showCustomerFragment("CreateCustomer");
				this.logInfo("Create Customer");

			}

		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true);
		},

		onSavePress: function (oEvent) {
			this.getView().setBusy(true);

			if (this._sMode === "create") {
				let oModel = this.getView().getModel(),
					oCreateData = this.getView().getModel("createModel").getData();

				oModel.create("/CustomerSet", oCreateData, {
					success: function (oData, response) {
						MessageBox.information(this.geti18nText("dialog.create.success"), {
							onClose: function (sAction) {
								this.onNavBack();
								this.logInfo("Customer created");
								this.getView().setBusy(false);
							}.bind(this)
						});
					}.bind(this),
					error: function (oError) {
						MessageBox.error(oError.message, {
							onClose: function (sAction) {
								this.onNavBack();
								this.getView().setBusy(false);
								this.logError("Customer creation failed");
							}.bind(this)
						});
					}
				});
			} else {
				if (this.getModel().hasPendingChanges()) {
					this.getModel().submitChanges({
						success: function (oData) {
							MessageBox.information(this.geti18nText("dialog.update.success"));
							this.logInfo("Customer saved");
							this.getView().setBusy(false);
						}.bind(this),
						error: function (oError) {
							MessageBox.information(this.geti18nText("dialog.update.error"));
							this.logInfo("Customer not saved");
							this.getView().setBusy(false);
						}.bind(this)
					});
				} else {
					this._toggleEdit(false);
				}
			}
		},

		onCancelPress: function (oEvent) {

			MessageBox.confirm(this.geti18nText("dialog.cancel"), {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						if (this._sMode === "create") {
							this.onNavBack();
						} else {
							if (this.getModel().hasPendingChanges()) {
								this.getModel().resetChanges();
							}
							this._toggleEdit(false);
						}
					}
				}.bind(this)
			});
		},

		_toggleEdit: function (bEditMode) {
			let oEditModel = this.getModel("editModel");

			oEditModel.setProperty("/editMode", bEditMode);
			
			this.setDirtyState(bEditMode);
			
			this._showCustomerFragment(bEditMode ? "EditCustomer" : "DisplayCustomer");
		},

		_showCustomerFragment: function (sFragmentName) {
			let oPage = this.getView().byId("customer_page");

			oPage.removeAllContent();

			if (this._fragmentList[sFragmentName]) {
				oPage.insertContent(this._fragmentList[sFragmentName]);
			} else {
				Fragment.load({
					id: this.getView().createId(sFragmentName),
					name: "at.clouddna.training14.FioriDeepDive.view." + sFragmentName,
					controller: this
				}).then(function (oFragment) {
					this._fragmentList[sFragmentName] = oFragment;
					oPage.insertContent(this._fragmentList[sFragmentName]);
					this.logInfo("Fragment" + sFragmentName + "loaded");
				}.bind(this));
			}
		}
	});
});