app.controller('salesTaxCtrl', function($scope, $ionicModal, SalesTaxes){
               SalesTaxes.all();
               console.log("after SalesTaxes.all()");
               
               $ionicModal.fromTemplateUrl('new-sales-tax.html', function(modal){
                                           $scope.taskModal = modal;
                                           }, {
                                           scope: $scope
                                           });
               
               $scope.add_sales_tax_click = function () {
                    $scope.taskModal.show();
               };
               
               $scope.create_new_sales_tax = function() {
               
               };
               
               $scope.cancel_new_sales_tax_click = function() {
                    $scope.taskModal.hide();
               };
               
               });

var salesTax = angular.module('salesTax', ['ionic', 'util']);

salesTax.factory('SalesTaxes', function(DbUtil){
                 return {
                 all: function() {
                 //var db = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024);
                 var db = DbUtil.openDb();
                 
                 db.transaction(function(tx){
                                tx.executeSql('select * from sales_taxes', [], function(tx, results){
                                              console.log("results.rows.lengthxxxx:"+results.rows.length);
                                              }, function(tx, error){
                                              console.log("error:" + error.message);
                                              });
                                });
                 
                 return "I love you";
                 }
                 }
                 });