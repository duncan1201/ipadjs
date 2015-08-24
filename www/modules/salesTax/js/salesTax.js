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
                        var query = 'SELECT * FROM sales_taxes ORDER BY name COLLATE NOCASE';
                        var callback_fun = function(tx, results){
                            var rows = results.rows;
                            var ret = [];
                            for (i = 0; i < rows.length; i++){
                                var item = rows.item(i);
                                ret.push({
                                        name: item.name,
                                        rate: item.rate,
                                        id: item.id,
                                        system_generated:item.system_generated
                                });
                            }
                 
                            var scope = angular.element(document.querySelector('#sales_taxes_main_content')).scope();
                 
                            scope.$apply(function(){
                              scope.sales_taxes = ret;
                            });
                        }; // end of callback_fun
                        var json = {sql: query, params:[], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of all
                 
                    delete_sales_tax: function (id) {
                        var self = this;
                        var callback_function =
                            function(tx, r){
                                self.all();
                            };
                 
                        var json = {
                                        sql: "delete from sales_taxes where id = ?",
                                        params: [id],
                                        callback: callback_function
                                    };
                        DbUtil.executeSql(json);
                    },
                 
                    create_sales_tax: function(new_sales_tax){
                        var self = this;
                        var callback_fun =function(tx, r){
                            self.all();
                            new_sales_tax.name = "";
                            new_sales_tax.rate = "";
                        } ; // end of callback_fun
                        var json = {sql: 'insert into sales_taxes (name, rate) values (?, ?)', params:[new_sales_tax.name, new_sales_tax.rate], callback: callback_fun};
                        DbUtil.executeSql(json);
                    }, // end of create_sales_tax
                    get_current_sales_tax: function(callback_fun){
                        var stmt = "select s.* from sales_taxes s where s.id in (select sales_tax_id from outlets o where o.is_current = 1)";
                        var json = {sql: stmt, params:[], callback: callback_fun};
                        DbUtil.executeSql(json);
                    } // end of get_current_sales_tax
                 
                 }
            });