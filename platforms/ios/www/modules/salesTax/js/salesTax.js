app.controller('salesTaxCtrl', function($scope, $ionicModal, SalesTaxes){
               var self = this;
               var main_content_scope = angular.element(document.querySelector('#sales_taxes_main_content')).scope();
               var compose_button_scope = angular.element(document.querySelector('#sales_taxes_compose_button')).scope();
               
               if($scope == main_content_scope){
                    SalesTaxes.all();
               }

               $ionicModal.fromTemplateUrl('sales-tax-popup.html',
                                           function(modal){
                                                $scope.salesTaxModal = modal;
                                           }, {
                                                scope: $scope
                                           });
               
               $scope.add_sales_tax_click = function () {
                    $scope.modal_title = "New Sales Tax";
                    $scope.salesTaxModal.show();
               };
               
               $scope.sales_tax_form_click = function(new_sales_tax) {
                    
                    SalesTaxes.create_sales_tax(new_sales_tax);
                    $scope.salesTaxModal.hide();
               };
               
               $scope.cancel_new_sales_tax_click = function() {
                    $scope.salesTaxModal.hide();
                    $scope.new_sales_tax = {"name": "", "rate": ""};
               };
               
               $scope.edit_sales_tax_click = function(id) {
                    $scope.modal_title = "Edit Sales Tax";
                    for ( i = 0; i < $scope.sales_taxes.length; i++){
                        console.log("edit id="+$scope.sales_taxes[i].id);
                        if (id == $scope.sales_taxes[i].id){
                            $scope.new_sales_tax = $scope.sales_taxes[i];
                        }
                    }
               
                    $scope.salesTaxModal.show();
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
                                                    ret += ",\"system_generated\":";
                                                    ret += results.rows.item(i).system_generated;
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