sap.ui.define([], function () {

	"use strict";
	
	return {
		genderFormatter(sGenderKey) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			
			if (sGenderKey === "F") {
				return oBundle.getText("gender.female");
			}
			
			return oBundle.getText("gender.male");
		}
	};

});