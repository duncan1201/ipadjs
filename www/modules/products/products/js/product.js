app.controller('productCtrl',
               function($rootScope, $scope, Products, Suppliers, App_URLs){
               
                    var suppliers_callback =
                        function(tx, results){
                            $scope.$apply(function(){
                            var suppliers = Suppliers.parse_suppliers_summary(results);
                            suppliers.unshift({id:-1, name: "+add supplier", default_markup: 1, desc: ""});
                            $scope.suppliers = suppliers;
                        });
                    }; // end of suppliers_callback
               
                    $rootScope.$on('$includeContentLoaded',
                                   function(event, url){
                                        if(url == App_URLs.product_add_edit_url){
                                            console.log("product_add_edit_url");
                                            Suppliers.all_summary(suppliers_callback);
                                        }
                                   });
               
                    $scope.add_new_supplier_choose =
                        function(){
                            console.log("add_newsupplier_choose");
                        };
               
                    $scope.add_new_product_click = function() {
                        $rootScope.ion_content_template = "modules/products/products/templates/add_edit_product.htm";
                    };
               
                    $scope.product_form_submit_click = function() {
                        console.log("product_form_submit_click");
                    };
               
                    $scope.product_form_cancel_click = function() {
                        $rootScope.ion_content_template = "modules/products/products/templates/main_content.htm";
                    }; 
               }); // end of controller

var product = angular.module('product', ['ionic', 'util']);

product.factory('Products',
                function(DbUtil){
                    return {
                        
                    };
                }); // end of product.factory