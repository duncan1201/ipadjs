app.controller('salesTaxCtrl', function($scope, $ionicModal){
               
               SalesTaxs.all();
               
               $ionicModal.fromTemplateUrl('new-sales-tax.html', function(modal){
                                           $scope.taskModal = modal;
                                           }, {
                                           scope: $scope
                                           });
               
                    $scope.add_sales_tax_click = function () {
                        //window.alert("add click");
                        $scope.taskModal.show();
                    };
               
                    $scope.create_new_sales_tax = function() {
               
                    };
               
                    $scope.cancel_new_sales_tax_click = function() {
                        $scope.taskModal.hide();
                    };
               
               });

var salesTax = angular.module('salesTax', ['ionic']);

document.addEventListener("deviceready", function(){
                          
                          //db = window.sqlitePlugin.openDatabase({name: "my.db", createFromLocation: 2});
                        
                          }, false);

salesTax.factory('SalesTaxs', function(){
                 return {
                    all: function() {
                 
                 //db.transaction(function(tx){
                                /*
                                tx.executeSql('SELECT * FROM sales_taxes', [], function (tx, results){
                                              window.alert(results.rows.length);
                                              });*/
                                //};
                 
                        return "I love you";
                    }
                 }
});