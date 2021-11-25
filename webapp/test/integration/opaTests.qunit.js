/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"at/clouddna/training14/FioriDeepDive/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});