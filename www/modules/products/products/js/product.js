app.controller('productCtrl',
               function($rootScope, $scope, Products, Suppliers, Brands, App_URLs){
               
                    var brands_callback =
                        function(tx, results){
                            var brands = Brands.parse_results(results);
                            $scope.$apply(function(){
                                          brands.unshift({id:-1, brand_name: "+add brand", desc: ""});
                                          $scope.brands = brands;
                                          });
                        };
               
                    var suppliers_callback =
                        function(tx, results){
                            var suppliers = Suppliers.parse_suppliers_summary(results);
                            $scope.$apply(function(){
                                          
                                          suppliers.unshift({id:-1, name: "+add supplier", default_markup: 1, desc: ""});
                                          $scope.suppliers = suppliers;
                        });
                    }; // end of suppliers_callback
               
                    $rootScope.$on('$includeContentLoaded',
                                   function(event, url){
                                        if(url == App_URLs.product_add_edit_url){
                                            console.log("product_add_edit_url");
                                            Brands.all(brands_callback);
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