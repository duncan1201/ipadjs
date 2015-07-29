app.controller('salesTaxCtrl', function($scope, $ionicModal, SalesTaxes){
               
               SalesTaxes.all();

               $ionicModal.fromTemplateUrl('new-sales-tax.html', function(modal){
                                           $scope.salesTaxModal = modal;
                                           }, {
                                           scope: $scope
                                           });
               
               $scope.add_sales_tax_click = function () {
                    $scope.salesTaxModal.show();
               };
               
               $scope.create_new_sales_tax_click = function(new_sales_tax) {
                    console.log("name:" + new_sales_tax.name);
                    console.log("rate:" + new_sales_tax.rate);
                    SalesTaxes.create_sales_tax(new_sales_tax);
                    $scope.salesTaxModal.hide();
               };
               
               $scope.cancel_new_sales_tax_click = function() {
                    $scope.salesTaxModal.hide();
               };
               
               $scope.delete_sales_tax_click = function(id) {
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
                                tx.executeSql('SELECT * FROM sales_taxes ORDER BY name COLLATE NOCASE',
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
                                              });
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
                    },
                 
                    create_sales_tax: function(new_sales_tax){
                        var self = this;
                        var db = DbUtil.openDb();
                        db.transaction(function(tx){
                                       tx.executeSql('insert into sales_taxes (name, rate) values (?, ?)',
                                                     [new_sales_tax.name, new_sales_tax.rate],
                                                     function(tx, r){
                                                        self.all();
                                                        new_sales_tax.name = "";
                                                        new_sales_tax.rate = "";
                                                     });
                                       });
                    }
                 }
            });