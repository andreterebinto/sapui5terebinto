sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    return Opa5.extend("com.terebinto.sapui5.test.integration.arrangements.Startup", {
        iStartMyApp: function () {
            this.iStartMyUIComponent({
                componentConfig: {
                    name: "com.terebinto.sapui5",
                    async: true,
                    manifest: true
                }
            });
        }
    });
});
