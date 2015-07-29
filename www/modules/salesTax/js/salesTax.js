app.controller('salesTaxCtrl', function($scope, $ionicModal, SalesTaxes){
               
               SalesTaxes.all();
               
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
               
               $scope.delete_sales_tax_click = function(id) {
                    console.log("delete sales tax:" + id);
                    SalesTaxes.delete_sales_tax(id);
               }
               
               });

var salesTax = angular.module('salesTax', ['ionic', 'util']);

salesTax.factory('SalesTaxes', function(DbUtil){
                 return {
                    all: function() {
                        var ret = "";
                        var db = DbUtil.openDb();
                 
                        db.transaction(function(tx){
                                tx.executeSql('select * from sales_taxes',
                                              [],
                                              function(tx, results){
                                                ret += "[";
                                                for (i = 0; i < results.rows.length; i++){
                                                    ret += "{\"name\":\""
                                                    ret += results.rows.item(i).name;
                                                    ret += "\",\"rate\":"
                                                    ret += results.rows.item(i).rate;
                                                    ret += ",\"id\":";
                                                    ret += results.rows.item(i).id;
                                                    ret += "}";
                                              
                                                    if (i < results.rows.length - 1){
                                                        ret += ",";
                                                    }
                                                }
                                                ret += "]";
                                                console.log(ret);
                                          
                                                var scope = angular.element(document.querySelector('#sales_taxes_main_content')).scope();
                                              
                                                scope.$apply(function(){
                                                                scope.sales_taxes = angular.fromJson(ret);
                                                              });
                                              }/*,
                                              function(tx, error){
                                                console.log("error:" + error.message);
                                              }*/);
                                });
                    },
                 
                    delete_sales_tax: function (id) {
                        var self = this;
                        var db = DbUtil.openDb();
                        db.transaction(function(tx){
                                       
                                            tx.executeSql('delete from sales_taxes where id = ?',
                                                          [id],
                                                          function(tx, r){
                                                            self.all();
                                                          });
                                       });
                    }
                 }
            });