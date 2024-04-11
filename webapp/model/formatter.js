sap.ui.define([
], function () {
    "use strict";

    return {
        formatStatus : function (sStatus, bApproved) {
            if (sStatus === "COMPLETED" && bApproved === false) {
                return "REJECTED";
            } else {
                return sStatus;
            }
        },
        formatState: function(status, approved){
            if (status === 'RUNNING') {
                return "Information";
            } else if(status === 'COMPLETED' && (approved === true || typeof(approved) === "undefined")){
                return "Success";
            }else if (status === 'REJECTED') {
                return "Warning"
            }else if(status === 'ERRONEOUS'){
                return "Error";
            }else if(status === 'SUSPENDED'){
                return "Indication02";
            }else if(status === 'CANCELED'){
                return "Indication02";
            }
        },
        formatIcon: function(status, approved){
            if (status === 'RUNNING') {
                return "sap-icon://pending";
            } else if(status === 'COMPLETED' && (approved === true || typeof(approved) === "undefined")){
                return "sap-icon://status-completed";
            }else if(status === 'REJECTED'){
                return "sap-icon://decline";
            }else if(status === 'ERRONEOUS'){
                return "sap-icon://status-error";
            }else if(status === 'SUSPENDED'){
                return "sap-icon://alert";
            }else if(status === 'CANCELED'){
                return "sap-icon://cancel";
            }
        },
        handleDialog: function(status, approved){
            if (status === 'COMPLETED' && approved === false) {
                return true;
            }else if(status === 'ERRONEOUS'){
                return true;
            }else{
                return false;
            }
        },
        handleIcon: function(status, approved){
            if (status === 'REJECTED') {
                return "sap-icon://comment";
            }else if(status === 'ERRONEOUS'){
                return "sap-icon://information";
            }else{
                return "sap-icon://comment";
            }
        },
        handlePress: function(status, approved){
            if (status === 'REJECTED') {
                return "onPressComment"
            }else if(status === 'ERRONEOUS'){
                return "onViewErrors";
            }else{
                return "onPressComment";
            }
            
        },
        formatInvoiceFlow: function(invType){
            if (invType === "CHARGE") {
                return "Charge-back";
            } else if(invType === "SERVC"){
                return "Service Fee";
            }
        }
    };

}
);